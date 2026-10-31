// Estado em memória: agentes, feed, pedidos de permissão e planos.
// Coletores e hooks escrevem aqui; o servidor lê snapshot() e escuta 'change'.
import { EventEmitter } from 'node:events';
import fs from 'node:fs';
import path from 'node:path';
import { config, roomFor, priceFor, CODENOTCH_FRESH_MS, DATA_DIR } from './config.js';
import { toolPt, targetOf, isToday } from './util.js';

const H5 = 5 * 3600e3, D7 = 7 * 86400e3;
const AWAY_FILE = path.join(DATA_DIR, 'modo-ausente.json');
function loadAway() { try { return !!JSON.parse(fs.readFileSync(AWAY_FILE, 'utf8')).away; } catch { return false; } }
// Nome, plano e mensalidade (config.json → plans), sem os campos internos
const PLAN_INFO = Object.fromEntries(Object.entries(config.plans || {}).map(([k, p]) => [k, Object.fromEntries(Object.entries(p).filter(([f]) => !f.startsWith('_') && !/Budget|Reset|experimental/.test(f)))]));

class Store extends EventEmitter {
  constructor() {
    super();
    this.agents = new Map();
    this.feed = [];
    this.pending = new Map();      // id -> { id, agentId, tool, text, at, resolve, timer }
    this.claudeUsage = [];         // [t, tokens] para estimar o medidor do plano Claude
    this.day = { key: '', rooms: new Map() }; // custo e tarefas do dia por sala (não some quando a sessão fecha)
    this.plans = {
      claude: { meters: [], source: 'estimado' },
      gpt: { meters: [], source: 'aguardando sessão do Codex' },
      eleven: { source: process.env.ELEVENLABS_API_KEY ? 'aguardando API' : 'sem chave' },
      higgs: { used: null, limit: config.plans?.higgs?.manualCreditsTotal ?? null, left: config.plans?.higgs?.manualCreditsLeft ?? null, source: 'manual' },
    };
    this._t = null;
    // Modo ausente: pedidos de permissão esperam resposta pelo celular (Telegram ou site) mesmo sem painel aberto
    this.away = loadAway();
    this.jobSessions = new Map();   // sessão criada por tarefa delegada -> nome do boneco ("Delegado · …")
    // PC escolhido no prédio para a sessão que vai abrir: o boneco senta nessa mesa
    this.reservas = new Map();      // id da sessão ("claude:<uuid>", "codex:<id>") -> { room, mesa, ate }
    this.reservasCodex = [];        // Codex novo ainda sem id: vale a primeira sessão nova que aparecer na sala
  }

  reservar(id, room, mesa) { if (Number.isInteger(mesa)) { this.reservas.set(id, { room, mesa, ate: Date.now() + 15 * 60e3 }); this.changed(); } }
  reservarCodex(room, mesa) { if (Number.isInteger(mesa)) this.reservasCodex.push({ room, mesa, desde: Date.now(), ate: Date.now() + 5 * 60e3 }); }
  _aplicarReserva(a) {
    const agora = Date.now(), r = this.reservas.get(a.id);
    if (r) { this.reservas.delete(a.id); if (r.ate > agora && r.room === a.room) { a.mesa = r.mesa; this.changed(); } return; }
    if (a.source !== 'codex' || a.mesa != null || !a.room) return;
    this.reservasCodex = this.reservasCodex.filter(x => x.ate > agora);
    const i = this.reservasCodex.findIndex(x => x.room === a.room && a._criado >= x.desde - 5000);   // só sessão aberta depois do clique
    if (i >= 0) { a.mesa = this.reservasCodex[i].mesa; this.reservasCodex.splice(i, 1); this.changed(); }
  }

  setAway(on, origem = '') {
    on = !!on;
    if (this.away === on) return;
    this.away = on;
    try { fs.mkdirSync(DATA_DIR, { recursive: true }); fs.writeFileSync(AWAY_FILE, JSON.stringify({ away: on, at: Date.now(), origem })); } catch { /* sem disco: vale só até reiniciar */ }
    this.emit('away', on, origem);
    this.changed();
  }

  changed() {
    if (this._t) return;
    this._t = setTimeout(() => { this._t = null; this.emit('change'); }, 250);
  }

  agent(id, base = {}) {
    let a = this.agents.get(id);
    if (!a) {
      const { room, floor, project } = roomFor(base.cwd);
      a = {
        id, source: base.source || 'claude', sessionId: base.sessionId || id, cwd: base.cwd || '', room, floor, project,
        name: base.name || 'Principal', model: base.model || '', state: 'idle', tool: '', target: '', prompt: '',
        since: Date.now(), lastActivity: 0, waitCmd: null, pendingId: null, errMsg: null,
        tokens: { in: 0, out: 0, cacheRead: 0, cacheWrite: 0 }, costUsdToday: 0, tasksToday: 0, log: [],
        _seen: new Set(), _hook: 0, _criado: Date.now(),
      };
      this.agents.set(id, a);
    }
    if (base.cwd && base.cwd !== a.cwd) {
      // Sessão que gastou antes de a pasta aparecer: leva o custo do dia junto para a sala certa
      const before = !a.cwd && (a.costUsdToday || a.tasksToday) ? this.roomDay(a) : null;
      a.cwd = base.cwd; Object.assign(a, roomFor(base.cwd));
      if (before) {
        const now = this.roomDay(a);
        before.costUsdToday = Math.max(0, before.costUsdToday - a.costUsdToday); before.tasksToday = Math.max(0, before.tasksToday - a.tasksToday);
        now.costUsdToday += a.costUsdToday; now.tasksToday += a.tasksToday;
      }
    }
    if (base.model) a.model = base.model;
    if (base.name && a.name === 'Principal') a.name = base.name;
    const job = this.jobSessions.get(a.sessionId);
    if (job && a.name === 'Principal') a.name = job;
    if (this.reservas.size || this.reservasCodex.length) this._aplicarReserva(a);
    return a;
  }

  /** Acumulado do dia por projeto (sala + pasta, para a sala de avulsos separar cada pasta). */
  roomDay(a) {
    const key = new Date().toDateString();
    if (this.day.key !== key) this.day = { key, rooms: new Map() };
    const k = a.room + '|' + (a.project || a.room);
    let r = this.day.rooms.get(k);
    if (!r) { r = { room: a.room, project: a.project || a.room, floor: a.floor, costUsdToday: 0, tasksToday: 0 }; this.day.rooms.set(k, r); }
    return r;
  }

  /** Totais do dia agrupados por sala (prédio) e por projeto (relatório de custo). */
  dayTotals() {
    if (this.day.key !== new Date().toDateString()) return { rooms: [], projects: [] };
    const projects = [...this.day.rooms.values()].filter(p => p.costUsdToday > 0 || p.tasksToday > 0), rooms = new Map();
    for (const p of projects) {
      const r = rooms.get(p.room) || { room: p.room, floor: p.floor, costUsdToday: 0, tasksToday: 0 };
      r.costUsdToday += p.costUsdToday; r.tasksToday += p.tasksToday; rooms.set(p.room, r);
    }
    return { rooms: [...rooms.values()], projects };
  }

  /** Zera os contadores "de hoje" da sessão quando o dia vira. */
  virarDia(a) {
    const k = new Date().toDateString();
    if (a.dayKey === k) return;
    if (a.dayKey) { a.costUsdToday = 0; a.tasksToday = 0; a.tokens = { in: 0, out: 0, cacheRead: 0, cacheWrite: 0 }; }
    a.dayKey = k;
  }

  taskDone(a) { this.virarDia(a); a.tasksToday++; this.roomDay(a).tasksToday++; }

  touch(a, t = Date.now()) {
    if (t > a.lastActivity) a.lastActivity = t;
    if (a.ended && t > (a.endedAt || 0) + 2000) a.ended = false;   // sessão retomada (--resume) volta a aparecer
  }

  event(a, kind, tag, text, t = Date.now()) {
    const e = { t, agentId: a.id, room: a.room, kind, tag, text: String(text || '').slice(0, 240) };
    a.log.unshift(e); if (a.log.length > 20) a.log.length = 20;
    this.feed.unshift(e); if (this.feed.length > 200) this.feed.length = 200;
    this.emit('event', e, a);
    this.changed();
  }

  setState(a, state, t = Date.now()) {
    if (a.state !== state) {
      // terminou de trabalhar e você ainda não viu: aviso próprio no prédio (delegações automáticas e histórico antigo não contam)
      if (a.state === 'working' && state === 'idle' && !this.jobSessions.has(a.sessionId) && Date.now() - a.lastActivity < 15 * 60e3) { a.unseen = true; a.doneAt = t; }
      if (state === 'working' || state === 'waiting') a.unseen = false;
      a.state = state; a.since = t;
    }
    if (state !== 'waiting') { a.waitCmd = null; a.pendingId = null; }
    if (state !== 'error') a.errMsg = null;
    this.changed();
  }

  /** Soma tokens de uma resposta (deduplicada por id). */
  addUsage(a, msgId, model, usage, t, fator = null) {
    if (!usage) return;
    if (msgId) { if (a._seen.has(msgId)) return; a._seen.add(msgId); if (a._seen.size > 5000) a._seen = new Set([...a._seen].slice(-2000)); }
    const u = { in: usage.input_tokens || 0, out: usage.output_tokens || 0, cacheRead: usage.cache_read_input_tokens || 0, cacheWrite: usage.cache_creation_input_tokens || 0 };
    const w1h = Math.min(u.cacheWrite, usage.cache_creation?.ephemeral_1h_input_tokens || 0); // o resto é cache de 5 min
    if (a.source === 'claude' && Date.now() - t < D7 + 86400e3) this.claudeUsage.push([t, u.in + u.out]);
    if (!isToday(t)) return;
    this.virarDia(a);
    for (const k in u) a.tokens[k] += u[k];
    const p = priceFor(model || a.model);
    // fator: regra de contexto longo da OpenAI (acima de ~272 mil tokens de entrada: entrada 2x, saída 1,5x)
    const fi = fator?.in || 1, fo = fator?.out || 1;
    const cost = (u.in * p.in * fi + u.out * p.out * fo + u.cacheRead * (p.cacheRead || 0) * fi + (u.cacheWrite - w1h) * (p.cacheWrite || 0) * fi + w1h * (p.cacheWrite1h ?? p.cacheWrite ?? 0)) / 1e6;
    a.costUsdToday += cost; this.roomDay(a).costUsdToday += cost;
    this.changed();
  }

  /** Eventos vindos do hook do Claude Code. */
  applyHook(h) {
    const ev = h.hook_event_name, sid = h.session_id;
    if (!sid) return null;
    const a = this.agent('claude:' + sid, { source: 'claude', sessionId: sid, cwd: h.cwd });
    const now = Date.now(); a._hook = now; this.touch(a, now);
    switch (ev) {
      case 'SessionStart': this.event(a, 'done', 'Sessão', 'Sessão iniciada'); break;
      case 'UserPromptSubmit': {
        // avisos automáticos que entram como "prompt" (fim de tarefa em segundo plano, lembretes do sistema) não são pedido seu:
        // não trocam o pedido mostrado, não entram na atividade e não desligam o modo ausente
        const auto = /^\s*<(task-notification|system-reminder|local-command|command-)/.test(String(h.prompt || ''));
        if (!auto && this.away && !process.env.EDH_JOB_ID) this.setAway(false, 'pc');
        if (!auto) a.prompt = String(h.prompt || '').slice(0, 2000);
        a.tool = 'Pensando'; a.target = 'lendo o contexto';
        this.setState(a, 'working'); if (!auto) this.event(a, 'prompt', 'Prompt', '"' + a.prompt.slice(0, 200) + '"'); break;
      }
      case 'PreToolUse':
        a.tool = h.tool_name; a.target = targetOf(h.tool_name, h.tool_input); a._toolOpen = now;
        if (a.state !== 'waiting') this.setState(a, 'working');
        this.event(a, 'tool', toolPt(h.tool_name), a.target); break;
      case 'PostToolUse':
        a._toolOpen = 0;
        if (a.state === 'waiting') this.setState(a, 'working'); break;
      case 'Notification': {
        const msg = String(h.message || '');
        if (/permiss|permission|approve|aprova/i.test(msg)) { if (a.state !== 'waiting') { a.waitCmd = a.waitCmd || msg; this.setState(a, 'waiting'); a.waitCmd = msg; this.event(a, 'wait', 'Permissão', msg); } }
        else if (/waiting for your input|aguardando/i.test(msg)) this.setState(a, 'idle');
        break;
      }
      case 'Stop':
        // a tarefa é contada pelo fim de turno no arquivo da sessão (claude-sessions.js)
        a.tool = ''; a.target = ''; a._toolOpen = 0; this.setState(a, 'idle'); this.event(a, 'done', 'Concluído', 'Turno concluído'); break;
      case 'SubagentStop': this.event(a, 'done', 'Subagente', 'Subagente terminou'); break;
      case 'SessionEnd': this.setState(a, 'idle'); a.ended = true; a.endedAt = now; this.event(a, 'done', 'Sessão', 'Sessão encerrada'); break;
    }
    this.changed();
    return a;
  }

  /** Você abriu ou focou a sessão: some o aviso de "terminou". */
  visto(id) {
    const a = this.agents.get(id); if (!a || !a.unseen) return false;
    a.unseen = false; this.changed(); return true;
  }

  /** Cria um pedido de permissão e devolve uma Promise com a decisão (ou null). */
  requestPermission(a, tool, input, timeoutMs) {
    const id = 'p_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const text = targetOf(tool, input) || tool;
    a.tool = tool; a.target = text; a.waitCmd = text; this.setState(a, 'waiting'); a.waitCmd = text; a.pendingId = id;
    this.event(a, 'wait', 'Permissão', 'Pede permissão: ' + text);
    const pr = new Promise(resolve => {
      const timer = setTimeout(() => this.resolvePermission(id, null), timeoutMs);
      this.pending.set(id, { id, agentId: a.id, tool, text, at: Date.now(), resolve, timer });
      this.emit('permission', { id, agentId: a.id, room: a.room, name: a.name, tool, text, timeoutMs });
      this.changed();
    });
    pr.id = id;
    return pr;
  }

  resolvePermission(id, decision, message) {
    const p = this.pending.get(id); if (!p) return false;
    clearTimeout(p.timer); this.pending.delete(id);
    const a = this.agents.get(p.agentId);
    if (a) {
      a.pendingId = null;
      if (decision === 'allow') { this.setState(a, 'working'); this.event(a, 'done', 'Aprovado', 'Você permitiu: ' + p.text); }
      else if (decision === 'deny') { this.setState(a, 'working'); this.event(a, 'err', 'Negado', 'Você negou: ' + p.text); }
      else this.event(a, 'wait', 'Permissão', 'Sem resposta no painel, pedido voltou para o terminal');
    }
    p.resolve(decision ? { decision, message } : null);
    this.emit('permission-resolved', { id, decision, room: a?.room, text: p.text });
    this.changed();
    return true;
  }

  /** Estimativa do medidor do Claude pelos tokens (quando não há fonte melhor). */
  estimateClaudePlan() {
    const cfg = config.plans?.claude || {}, now = Date.now();
    if (this.claudeUsage.length > 5000 || this.claudeUsage.some(([t]) => now - t > D7 + 86400e3)) this.claudeUsage = this.claudeUsage.filter(([t]) => now - t < D7 + 86400e3);
    if (this.plans.claude.source === 'oauth' && now - (this.plans.claude.at || 0) < 15 * 60e3) return;
    if (this.plans.claude.source === 'conta' && now - (this.plans.claude.at || 0) < CODENOTCH_FRESH_MS) return;   // leitura da conta recente: não estima
    this.claudeUsage = this.claudeUsage.filter(([t]) => now - t < D7 + 86400e3).sort((x, y) => x[0] - y[0]);
    let start = null, sess = 0;
    for (const [t, n] of this.claudeUsage) {
      if (start === null || t >= start + H5) { start = Math.floor(t / 3600e3) * 3600e3; sess = 0; }
      sess += n;
    }
    const active = start !== null && now < start + H5;
    const wr = new Date(); wr.setHours(cfg.weeklyResetHour ?? 9, 0, 0, 0);
    wr.setDate(wr.getDate() - ((wr.getDay() - (cfg.weeklyResetDow ?? 3) + 7) % 7));
    if (wr.getTime() > now) wr.setDate(wr.getDate() - 7);
    const week = this.claudeUsage.filter(([t]) => t >= wr.getTime()).reduce((s, [, n]) => s + n, 0);
    this.plans.claude = {
      source: 'estimado',
      meters: [
        // sem limite de 5 horas desde 31/10: a estimativa reserva mostra só o semanal (como a conta)
        { label: 'Semanal · todos os modelos', usedPct: Math.min(100, week / (cfg.weeklyTokenBudget || 1) * 100), resetAt: wr.getTime() + D7, source: 'estimado' },
      ],
    };
  }

  /** Marca como ocioso quem parou de mexer e esconde sessões antigas. */
  sweep() {
    const now = Date.now(), idleMs = (config.idleAfterSeconds || 90) * 1000, hideMs = (config.idleHideMinutes || 240) * 60e3;
    for (const a of this.agents.values()) {
      const toolAberta = a._toolOpen && now - a._toolOpen < 30 * 60e3;   // ferramenta ainda rodando (até 30 min)
      if (a.state === 'working' && !toolAberta && now - a.lastActivity > idleMs && now - a._hook > idleMs) { this.setState(a, 'idle'); }
      if (a.state === 'waiting' && !a.pendingId && now - a.lastActivity > 30 * 60e3) this.setState(a, 'idle');
    }
    for (const [id, a] of this.agents) if (now - a.lastActivity > hideMs && a.state !== 'waiting') this.agents.delete(id);
    this.estimateClaudePlan();
    this.changed();
  }

  snapshot() {
    const now = Date.now(), hideMs = (config.idleHideMinutes || 240) * 60e3;
    const agents = [...this.agents.values()].filter(a => !a.ended && now - a.lastActivity < hideMs)
      .sort((x, y) => x.floor - y.floor || x.room.localeCompare(y.room) || (x.name === 'Principal' ? -1 : 1))
      .map(({ _seen, _hook, _criado, ended, ...rest }) => rest);
    const { rooms, projects } = this.dayTotals();
    return {
      updatedAt: new Date().toISOString(), usdBrl: config.usdBrl || 5.4, agents, plans: this.plans, planInfo: PLAN_INFO,
      rooms, projects, layout: config.layout, uptime: this.uptime || [], content: this.content || null, deploys: this.deploys || [], semInternet: !!this.semInternet, ...(this.extras ? this.extras() : {}),
      pending: [...this.pending.values()].map(({ resolve, timer, ...p }) => p), feed: this.feed.slice(0, 80),
      remoteApproval: !!config.remoteApproval?.enabled, away: this.away,
      roomBudgets: Object.fromEntries((config.rooms || []).filter(r => r.budgetBrl).map(r => [r.room, r.budgetBrl])),
    };
  }
}

export const store = new Store();
