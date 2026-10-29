// Central de Agentes · prédio 3D — fonte.js
// Fonte real: lê o estado do agente local (SSE /api/events) e cria, atualiza e remove os bonecos.
// Contrato dos dados: docs/CONTRATO-DE-DADOS.md. No modo simulado nada aqui roda (startReal só é chamado com REAL).

const REAL_AGENTS = new Map();   // id da sessão no agente local -> boneco
const REAL_ROOM = new Map();     // id da sessão -> nome da sala (para o feed de sessões que já fecharam)
const REAL_COLORS = ['#2E8A84','#4E63CF','#B8484E','#7A5FB0','#3E9E5E','#D09A3C','#45A39A','#C2852B','#3C7FB0','#C26B7A'];
const SOURCE_LABEL = {codenotch:'via Codenotch', codex:'via sessões do Codex', estimado:'estimado', oauth:'via conta', api:'via API', manual:'manual'};
let realSeq = 0, realState = null;

// Ferramentas reais que o protótipo não conhecia
Object.assign(TOOL_PT, {PowerShell:'Executando', MultiEdit:'Editando', NotebookEdit:'Editando', Glob:'Buscando', Agent:'Delegando', Task:'Delegando',
  WebSearch:'Pesquisando', TodoWrite:'Planejando', Skill:'Usando skill', ToolSearch:'Carregando ferramentas', AskUserQuestion:'Perguntando', Pensando:'Pensando',
  shell:'Executando', exec_command:'Executando', apply_patch:'Editando', js:'Executando', update_plan:'Planejando'});
// mcp__servidor__ferramenta -> "MCP · ferramenta"
const prettyTool = t => { const m = /^mcp__[^_]+(?:[-_][^_]+)*?__(.+)$/.exec(t || ''); return m ? 'MCP · ' + m[1].replace(/_/g, ' ') : (t || ''); };
const perfAt = ms => performance.now() - (Date.now() - ms);   // horário do agente -> relógio da animação
const hashOf = s => { let h = 0; for (const c of String(s)) h = (h*31 + c.charCodeAt(0)) >>> 0; return h; };
const toEv = (e, a) => ({t: new Date(e.t), a, kind: e.kind, text: e.text, tag: e.tag || KIND_TAG[e.kind] || e.kind});

function modelLabel(m){
  m = String(m || '');
  let r = /claude-(opus|sonnet|haiku|fable|mythos)-(\d+)(?:-(\d{1,2})(?!\d))?/i.exec(m);
  if (r) return r[1][0].toUpperCase() + r[1].slice(1) + ' ' + r[2] + (r[3] ? '.' + r[3] : '');
  r = /^gpt-([\d.]+)(?:-([a-z]+))?/i.exec(m);
  if (r) return 'GPT-' + r[1] + (r[2] ? ' ' + r[2][0].toUpperCase() + r[2].slice(1) : '');
  return m || '—';
}
function familyOf(m){
  const r = /opus|sonnet|haiku|fable|mythos/i.exec(m || '');
  return r ? r[0][0].toUpperCase() + r[0].slice(1).toLowerCase() : /gpt|codex/i.test(m || '') ? 'Codex' : '';
}

// Sala do prédio pelo nome que o agente mandou; pasta sem sala no config.json vai para "Projetos avulsos"
function roomOfReal(x){
  const n = String(x.room || '').toLowerCase();
  return ROOMS.find(R => R.name.toLowerCase() === n) || ROOMS.find(R => R.name === AVULSOS);
}
// Mesas livres por tipo de sala. Na Diretoria a mesa 0 é do Dudu. Quem não tem mesa fica no sofá da sala.
function seatsOf(R){
  if (R.type === 'control') return [2];
  if (R.type === 'reception' || R.type === 'infra') return [0];
  if (R.type === 'studio') return [0, 1];
  if (R.type === 'calls' || R.type === 'meeting') return [];
  return [0, 1, 2];
}

function realGo(a){
  if (a.state === 'idle') return goIdle(a);
  if (a.desk != null) return goSeat(a);
  releaseSpot(a);
  const s = idleFor(a.R)[a.ov % 3]; a.spot = s;
  a.path = planPath(a, {x: a.R.ox + s.x, z: a.R.oz + s.z}, s.via, a.R.f); a.yawEnd = s.yaw;
}
// Na primeira carga todo mundo já aparece no lugar, sem fila no elevador
function finishPath(a){
  let f = a.f; for (const p of a.path) if (p.elev !== undefined) f = p.elev;
  const last = [...a.path].reverse().find(p => p.x !== undefined);
  if (last) a.pos = {x: last.x, z: last.z};
  a.f = f; a.path = []; a.ride = null; a.yaw = a.yawEnd ?? a.yaw; a.body.g.rotation.y = a.yaw;
}

function permNote(){
  if (NUVEM) return realState && realState.away ? 'O pedido está no terminal do PC e não chegou à nuvem.' : 'Ligue o modo ausente (aba Planos) para aprovar pelo celular. Sem ele, o pedido fica no terminal do PC.';
  return realState && realState.remoteApproval
    ? 'O pedido foi para o terminal. Para aprovar por aqui, deixe este painel aberto e visível quando o pedido chegar.'
    : 'Aprovação pelo painel desligada (config.json → remoteApproval). Responda no terminal.';
}

function realUpdate(a, x, first){
  const prev = a.state;
  a.name = x.name || 'Principal'; a.proj = x.project || x.room; a.model = modelLabel(x.model); a.family = familyOf(x.model);
  a.tool = prettyTool(x.tool); a.target = x.target || ''; if (x.prompt) a.prompt = x.prompt;
  const tk = x.tokens || {};
  a.cost = x.costUsdToday || 0; a.tin = (tk.in || 0) + (tk.cacheRead || 0) + (tk.cacheWrite || 0); a.tout = tk.out || 0;
  a.tasksDone = x.tasksToday || 0; a.xp = a.tasksDone * 25;
  a.waitCmd = x.waitCmd || x.target || ''; a.errMsg = x.errMsg || ''; a.pendingId = x.pendingId || null; a.permNote = permNote();
  a.since = perfAt(x.since || Date.now()); if (x.state === 'waiting') a.waitSince = a.since;
  a.log = (x.log || []).map(e => toEv(e, a));
  const newest = (x.log || [])[0];
  if (!first && newest && newest.t > a.lastLogT){
    if (['wait','err','done'].includes(newest.kind)) a.pop = 1;
    if (newest.kind === 'prompt') a.bubble = {text: short(newest.text, 70), until: performance.now() + 5000};
    else if (newest.kind === 'tool') a.bubble = {text: newest.tag + ' · ' + short(base(newest.text), 40), until: performance.now() + 3500};
  }
  if (newest) a.lastLogT = Math.max(a.lastLogT, newest.t);
  a.state = x.state;
  // Só anda quando entra ou sai do ocioso; trabalhando ↔ esperando ↔ erro continua na mesa
  if (!first && (prev === 'idle') !== (x.state === 'idle')) realGo(a);
}

function realCreate(x, first){
  const R = roomOfReal(x), h = hashOf(x.id);
  const used = new Set(R.agents.filter(o => o.desk != null).map(o => o.desk));
  const free = seatsOf(R).find(d => !used.has(d));
  const a = {id: ++realSeq, key: x.id, real: true, R, f: 0, name: '', proj: '', model: '', family: '',
    prov: x.source === 'codex' ? 'gpt' : 'claude', kind: R.kind && R.kind !== 'fin' ? R.kind : 'code',
    color: REAL_COLORS[h % REAL_COLORS.length], skin: SKINS[h % SKINS.length], hair: HAIR[(h >>> 4) % HAIR.length],
    desk: free ?? null, ov: free == null ? R.agents.filter(o => o.desk == null).length : 0,
    state: 'idle', tin: 0, tout: 0, cost: 0, units: 0, tool: '', target: '', prompt: '', since: performance.now(), next: Infinity,
    waitSince: performance.now(), waitCmd: '', errMsg: '', log: [], idleSpot: h % 3, path: [], copa: null, spot: null, via: 'front',
    pop: 0, yaw: Math.PI, xp: 0, tasksDone: 0, ride: null, bubble: null, prompts: [], waits: [], errs: [], pendingId: null, lastLogT: 0};
  realUpdate(a, x, true);
  a.body = person(a); scene.add(a.body.g); a.lab = mkLabel(a);
  R.agents.push(a); AGENTS.push(a); REAL_AGENTS.set(x.id, a); REAL_ROOM.set(x.id, R.name);
  a.pos = {x: EX, z: WALK}; a.f = 0;   // chega pelo elevador do térreo
  realGo(a);
  if (first) finishPath(a); else { a.pop = 1; toast(`${a.name} entrou em ${a.proj || R.name}`); }
  return a;
}

function realRemove(a){
  releaseSpot(a); scene.remove(a.body.g); a.lab.el.remove();
  AGENTS.splice(AGENTS.indexOf(a), 1); a.R.agents.splice(a.R.agents.indexOf(a), 1); REAL_AGENTS.delete(a.key);
  if (selected === a){ selected = null; follow = false; syncFollow(); agentShell = null; }
}

function realPlans(s){
  const info = s.planInfo || {}, plans = s.plans || {};
  for (const p of PLANS){
    const i = info[p.id] || {}, src = plans[p.id] || {};
    if (i.name) p.name = i.name;
    p.tier = (i.tier || p.tier) + (SOURCE_LABEL[src.source] ? ' · ' + SOURCE_LABEL[src.source] : '');
    if ('brl' in i) p.brl = i.brl; p.approx = false;
    if (p.meters){
      p.meters = (src.meters || []).map(m => ({label: m.label, used: m.usedPct || 0, reset: m.resetAt || 0, win: /semanal|dias/i.test(m.label) ? D7 : H5}));
      p.sourceNote = p.id === 'gpt' ? 'Aguardando leitura do Codenotch ou de uma sessão do Codex.' : 'Aguardando leitura do Codenotch.';
    } else if (p.id === 'eleven'){
      const restam = Math.max(0, ((src.resetAt || 0) - Date.now()) / 86400e3);   // ciclo mensal: ~30,4 dias
      p.credit = src.source === 'api' && src.limit ? {total: src.limit, left: Math.max(0, src.limit - (src.used || 0)), unit: 'créditos', daysLeft: Math.ceil(restam), cycle: 30.4, elapsedDays: Math.max(0.5, 30.4 - restam), mix: {}} : null;
      p.sourceNote = src.source === 'sem chave' ? 'Sem chave da ElevenLabs. Coloque ELEVENLABS_API_KEY (só leitura) em agent/.env.' : 'ElevenLabs: ' + (src.source || 'sem leitura');
    } else if (p.id === 'higgs'){
      const tot = i.manualCreditsTotal, left = i.manualCreditsLeft;
      const tier = String(i.tier || p.tier).split(' ·')[0];
      p.credit = tot > 0 && left != null ? {total: tot, left, unit: 'créditos', daysLeft: i.renewInDays ?? 30, cycle: 30, mix: {}}
        : tot === 0 ? {total: 0, left: 0, unit: 'créditos', label: `${tier} · 0 créditos`} : null;
      p.sourceNote = tot === 0 ? `Plano ${tier}, 0 créditos (conferido na conta). A Higgsfield não tem API de saldo: atualize em config.json → plans.higgs quando mudar.`
        : 'Plano e créditos a confirmar. Preencha manualCreditsTotal e manualCreditsLeft em config.json → plans.higgs.';
    }
  }
}

function realApply(s, first){
  realState = s; CAMBIO = s.usdBrl || CAMBIO;
  const seen = new Set();
  for (const x of s.agents || []){
    seen.add(x.id);
    let a = REAL_AGENTS.get(x.id);
    if (a && roomOfReal(x) !== a.R){ realRemove(a); a = null; }   // mudou de pasta
    if (a) realUpdate(a, x, false); else realCreate(x, first);
  }
  for (const [k, a] of REAL_AGENTS) if (!seen.has(k)) realRemove(a);

  // Custo e tarefas do dia por sala, incluindo sessões que já fecharam
  window.EDH_DAY_TOTAL = (s.rooms || []).reduce((t, r) => t + (r.costUsdToday || 0), 0);
  const day = new Map();
  for (const r of s.rooms || []){ const R = roomOfReal(r), d = day.get(R) || {cost: 0, tasks: 0}; d.cost += r.costUsdToday || 0; d.tasks += r.tasksToday || 0; day.set(R, d); }
  let tasks = 0;
  for (const R of ROOMS){
    const d = day.get(R) || {cost: 0, tasks: 0}, live = R.agents.reduce((t, a) => t + a.cost, 0);
    R.budget = (s.roomBudgets || {})[R.name] || 0;   // config.json → rooms[].budgetBrl
    R.base = Math.max(0, d.cost - live); R.done = Math.max(d.tasks, R.agents.reduce((t, a) => t + a.tasksDone, 0)); tasks += R.done;
    if (first) R.hist = Array(30).fill(roomCost(R));
  }
  if (first) totalHist.fill(totalCost());
  if (!first && tasks > COMPANY.tasks) ringBell();   // sino das entregas: toca a cada tarefa concluída
  COMPANY.tasks = tasks; COMPANY.xp = tasks * 25;
  // Quadro de cada sala: o que as sessões de lá estão fazendo (começo do último prompt)
  for (const R of ROOMS) R.tasks = [...new Set(R.agents.map(a => a.prompt).filter(Boolean).map(p => p.replace(/^["\s]+/, '').split(/\s+/).slice(0, 2).join(' ')))];
  BIZ.uptime = (s.uptime || []).map(u => [u.site, u.upPct, u.ok]);
  window.EDH_CONTENT = s.content || null;
  window.EDH_DEPLOYS = s.deploys || [];
  if (first) lastQuadroT = Math.max(0, ...(s.quadro || []).map(m => m.t)); else quadroBaloes(s);   // posts e reels do Content Studio (Estúdio e sugestões)

  FEED.length = 0;
  for (const f of s.feed || []) FEED.push(toEv(f, REAL_AGENTS.get(f.agentId) || {R: {name: f.room || REAL_ROOM.get(f.agentId) || 'Sessão encerrada'}, name: ''}));

  realPlans(s);
  if (!selected) selected = AGENTS.find(a => a.state === 'waiting') || AGENTS[0] || null;
  if (NUVEM) costDays = {[dayKeyLocal(new Date())]: Object.fromEntries((s.projects || s.rooms || []).map(r => [r.project || r.room, {room: r.room, costUsd: r.costUsdToday, tasks: r.tasksToday}]))};
  $('simTag').textContent = NUVEM ? `Nuvem · resumo sem prompts nem comandos · atualizado às ${new Date(s.updatedAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit', second: '2-digit'})}` : `Dados reais · agente local · US$ 1 = R$ ${CAMBIO.toFixed(2).replace('.', ',')}`;
  checkAchievements();
  dirty = true;
}

async function realPermission(a, ok){
  if (!a.pendingId){ toast(a.permNote || 'Responda no terminal'); return; }
  if (NUVEM){
    const {error, count} = await SB.from('permission_requests').update({decision: ok ? 'allow' : 'deny', status: 'decided', decided_at: new Date().toISOString()}, {count: 'exact'}).eq('id', a.pendingId).eq('status', 'pending');
    toast(error ? 'Não consegui responder: ' + error.message : count ? (ok ? 'Permitido. Chega no PC em poucos segundos.' : 'Negado.') : 'Esse pedido já foi respondido ou expirou');
    return;
  }
  try {
    const r = await fetch('/api/permission/' + encodeURIComponent(a.pendingId), {method: 'POST',
      headers: {'Content-Type': 'application/json', 'X-EDH-Token': window.EDH_TOKEN || ''},
      body: JSON.stringify(ok ? {decision: 'allow'} : {decision: 'deny', message: 'Negado pelo prédio da Central de Agentes'})});
    if (r.ok){ toast(ok ? 'Permitido: ' + a.waitCmd : 'Negado. O agente vai buscar outro caminho.'); if (ok) COMPANY.perms++; }
    else toast(r.status === 404 ? 'Esse pedido já expirou e voltou para o terminal' : `O agente recusou a resposta (${r.status})`);
  } catch { toast('Agente local fora do ar'); }
}

async function realAssignTask(a, text){
  try { await navigator.clipboard.writeText(text); toast(`Copiado. Cole no terminal de ${a.proj || a.R.name}`); }
  catch { toast('Não consegui copiar. Selecione o texto e copie à mão.'); }
}

function startReal(){
  if (NUVEM) return startNuvemFront();
  $('simTag').textContent = 'Conectando ao agente local…';
  let first = true;
  const es = new EventSource('/api/events');   // reconecta sozinho se o agente reiniciar
  es.addEventListener('state', ev => {
    try {
      realApply(JSON.parse(ev.data), first);
      if (first){ first = false; loadHistory(); loadCosts(); setInterval(loadCosts, 60e3); fetch('/api/fluxos').then(r => r.json()).then(f => { FLUXOS = f; agentShell = null; dirty = true; }).catch(() => {}); }
    } catch (err) { console.error('[fonte]', err); }
  });
  es.onerror = () => { $('simTag').textContent = 'Agente local fora do ar · tentando reconectar'; };
  // Avisa o agente que o painel está aberto e visível: só assim um pedido de permissão espera a resposta daqui
  const ping = () => { if (document.visibilityState === 'visible') fetch('/api/presence', {method: 'POST', headers: {'X-EDH-Token': window.EDH_TOKEN || ''}}).catch(() => {}); };
  ping(); setInterval(ping, 10e3); document.addEventListener('visibilitychange', ping);
}

/* =========================== histórico (fase 1.6) =========================== */
const GHOSTS = new Map();   // sessão que já fechou -> boneco que só aparece no replay
let costDays = {}, costPeriod = 1;
// Custo em API do mês corrente (custos.json do agente; na nuvem, só o dia de hoje)
function monthApiUsd(){
  const mk = dayKeyLocal(new Date()).slice(0, 7);
  return Object.entries(costDays).filter(([d]) => d.startsWith(mk)).reduce((t, [, rooms]) => t + Object.values(rooms).reduce((u, v) => u + (v.costUsd || 0), 0), 0);
}
const dayKeyLocal = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// Posição fixa de uma sessão num instante do histórico: mesa se estava ativa, sofá/puff se estava ociosa
function placeFor(R, state, desk, ov, idleSpot){
  if (state === 'idle' || desk == null){ const s = idleFor(R)[(state === 'idle' ? idleSpot : ov) % 3]; return {f: R.f, x: R.ox + s.x, z: R.oz + s.z, state, where: s.pose, yaw: s.yaw}; }
  const p = SEAT(R, desk); return {f: R.f, x: p.x, z: p.z, state, where: 'desk', yaw: Math.PI};
}
function bodyForHistory(key, room, name){
  const live = REAL_AGENTS.get(key); if (live) return live;
  let g = GHOSTS.get(key);
  if (!g){
    const h = hashOf(key);
    g = {id: ++realSeq, key, ghost: true, R: roomOfReal({room}), name, color: REAL_COLORS[h % REAL_COLORS.length], skin: SKINS[h % SKINS.length], hair: HAIR[(h >>> 4) % HAIR.length], pop: 0, path: [], log: []};
    g.body = person(g); g.body.g.visible = false; scene.add(g.body.g); GHOSTS.set(key, g);
  }
  return g;
}
async function loadHistory(){
  try {
    const rows = await (await fetch('/api/history?since=' + (Date.now() - 8 * 3600e3))).json();
    const snaps = rows.map(r => {
      const s = {}, used = new Map();
      for (const [key, room, , state, name] of r.a){
        const b = bodyForHistory(key, room, name), R = roomOfReal({room}), u = used.get(R) || {desk: 0, ov: 0}, seats = seatsOf(R);
        used.set(R, u);
        let desk = null, ov = 0;
        if (state !== 'idle'){ if (u.desk < seats.length) desk = seats[u.desk++]; else ov = u.ov++; }
        s[b.id] = placeFor(R, state, desk, ov, hashOf(key) % 3);
      }
      return {t: r.t, s};
    });
    const firstLive = SNAPS.length ? SNAPS[0].t : Infinity;
    SNAPS.unshift(...snaps.filter(x => x.t < firstLive));
    while (SNAPS.length > SNAP_MAX) SNAPS.shift();
    scrub.max = String(SNAPS.length - 1); if (replayIdx < 0) scrub.value = scrub.max;
  } catch (err) { console.warn('[fonte] histórico indisponível', err); }
}
// Fantasmas só aparecem quando o replay passa por um instante em que a sessão existia
function poseGhosts(dt, replaying){
  for (const g of GHOSTS.values()){
    const s = replaying && replaying.s[g.id];
    g.body.g.visible = !!s && (view.building || s.f === view.floor);
    if (s){ pose(g, dt, s); g.body.ring.material.color.set(ST[s.state]); g.body.ring.material.opacity = .3; }
  }
}

async function loadCosts(){ try { costDays = await (await fetch('/api/costs')).json(); dirty = true; } catch { /* agente fora do ar */ } }
// Custo por projeto (sala ou pasta) no período: base do relatório por cliente
function costReport(){
  if (!REAL) return '';
  const from = new Date(); from.setDate(from.getDate() - (costPeriod - 1)); const fk = dayKeyLocal(from);
  const agg = new Map();
  for (const [d, rooms] of Object.entries(costDays)) if (d >= fk) for (const [room, v] of Object.entries(rooms)){
    const x = agg.get(room) || {cost: 0, tasks: 0}; x.cost += v.costUsd || 0; x.tasks += v.tasks || 0; agg.set(room, x);
  }
  const rows = [...agg].sort((a, b) => b[1].cost - a[1].cost), total = rows.reduce((t, [, v]) => t + v.cost, 0);
  const btn = (n, l) => `<button class="act ${costPeriod === n ? 'primary' : ''}" type="button" data-act="costp" data-arg="${n}">${l}</button>`;
  return `<div class="card"><div class="sec"><h2>Custo por projeto</h2><small>${brlFromUsd(total)}</small></div>
    <div style="display:flex;gap:6px;margin:6px 0 4px">${btn(1, 'Hoje')}${btn(7, '7 dias')}${btn(30, '30 dias')}</div>
    ${rows.length ? `<ul class="sessions">${rows.map(([room, v]) => `<li><i style="background:var(--amber)"></i><span>${esc(room)}</span><em>${brlFromUsd(v.cost)} · ${v.tasks} tarefa${v.tasks !== 1 ? 's' : ''}</em></li>`).join('')}</ul>` : '<p class="note">Sem custo registrado no período.</p>'}
    <p class="note" style="margin-top:6px">Equivalente em API, por pasta do projeto. Atualiza a cada minuto.</p></div>`;
}

/* =========================== modo ausente =========================== */
function awayCard(){
  if (!REAL || !realState) return '';
  const on = !!realState.away;
  return `<div class="card"><div class="sec"><h2>Modo ausente</h2><small>${on ? 'ligado' : 'desligado'}</small></div>
    <p class="note">${on ? 'Pedidos de permissão esperam resposta pelo celular (Telegram ou site) por até 5 min antes de voltar ao terminal.' : 'Ligue quando sair do PC: os pedidos de permissão passam a chegar no celular.'}</p>
    <div style="margin-top:8px"><button class="act ${on ? '' : 'primary'}" type="button" data-act="away" data-arg="${on ? 0 : 1}">${on ? 'Desligar' : 'Ligar modo ausente'}</button></div></div>`;
}
async function realToggleAway(on){
  try {
    if (NUVEM){
      const {error} = await SB.from('office_control').upsert({id: 'principal', away: on, updated_at: new Date().toISOString()});
      if (error) throw error;
      toast(on ? 'Modo ausente ligado. O PC aplica em até 10 s.' : 'Modo ausente desligado. O PC aplica em até 10 s.');
    } else {
      const r = await fetch('/api/away', {method: 'POST', headers: {'Content-Type': 'application/json', 'X-EDH-Token': window.EDH_TOKEN || ''}, body: JSON.stringify({on})});
      if (!r.ok) throw new Error('HTTP ' + r.status);
      toast(on ? 'Modo ausente ligado' : 'Modo ausente desligado');
    }
  } catch (err) { toast('Não consegui mudar: ' + (err.message || err)); }
}

/* =========================== nuvem (site, fase 2) =========================== */
// Servido pelo site em /central/predio?fonte=nuvem. Login e config ficam em /central/ (index.html e config.json).
// O boot.js já fez login, buscou o estado (o layout das salas vem nele) e deixou o cliente em window.EDH_SB
let SB = null;
function startNuvemFront(){
  SB = window.EDH_SB || null;
  if (!SB){ $('simTag').textContent = window.EDH_NUVEM_ERRO || 'Central sem Supabase configurado'; return; }
  let first = true;
  const apply = st => { try { realApply(st, first); first = false; } catch (err) { console.error('[nuvem]', err); } };
  if (window.EDH_FIRST_STATE) apply(window.EDH_FIRST_STATE);
  else $('simTag').textContent = window.EDH_NUVEM_ERRO || 'Sem dados ainda: o agente do PC está ligado?';
  SB.channel('predio').on('postgres_changes', {event: '*', schema: 'public', table: 'office_state', filter: 'id=eq.principal'}, p => { if (p.new && p.new.state) apply(p.new.state); }).subscribe();
}

/* =========================== orquestra: agentes conversando =========================== */
let FLUXOS = [], lastQuadroT = 0;
const modoSel = () => (document.querySelector('input[name="modoTrab"]:checked') || {}).value || 'ler';
function workCard(a){
  return `<div class="card task"><span class="k">Trabalho em ${esc(a.proj || a.R.name)}</span>
    <textarea id="taskText" placeholder="O que fazer neste projeto (o outro agente não vê esta conversa: dê o contexto)"></textarea>
    <div class="row" style="gap:12px;margin:6px 0"><label><input type="radio" name="modoTrab" value="ler" checked> Só ler (revisar, investigar, planejar)</label><label><input type="radio" name="modoTrab" value="editar"> Pode editar esta pasta</label></div>
    <div class="row" style="flex-wrap:wrap;gap:6px">
      <button class="btn solid" type="button" data-act="delegar" data-arg="claude">Delegar ao Claude</button>
      <button class="btn solid" type="button" data-act="delegar" data-arg="codex">Delegar ao Codex</button>
      ${FLUXOS.length ? `<select id="fluxoSel" class="btn" aria-label="Fluxo">${FLUXOS.map(f => `<option value="${esc(f.id)}">${esc(f.nome)}</option>`).join('')}</select><button class="btn" type="button" data-act="fluxo">Rodar fluxo</button>` : ''}
      <button class="btn" type="button" data-act="sessao" data-arg="claude">Abrir Claude aqui</button>
      <button class="btn" type="button" data-act="sessao" data-arg="codex">Abrir Codex aqui</button>
    </div>
    <small class="note">Delegar e fluxo rodam em segundo plano nesta pasta; o resultado cai no quadro (aba Operação). "Abrir" abre um terminal novo com o texto como primeiro pedido.</small></div>`;
}
async function realTrabalho(act, arg, a){
  const ta = $('taskText'), texto = ta ? ta.value.trim() : '';
  if (act !== 'sessao' && !texto){ toast('Escreva a tarefa primeiro'); return; }
  const rota = act === 'delegar' ? '/api/tarefas' : act === 'fluxo' ? '/api/fluxos' : '/api/sessao';
  const corpo = act === 'delegar' ? {agente: a.key, para: arg, modo: modoSel(), tarefa: texto, de: 'Eduardo'}
    : act === 'fluxo' ? {agente: a.key, modelo: ($('fluxoSel') || {}).value, objetivo: texto, de: 'Eduardo'}
    : {agente: a.key, para: arg, prompt: texto};
  try {
    const r = await fetch(rota, {method: 'POST', headers: {'Content-Type': 'application/json', 'X-EDH-Token': window.EDH_TOKEN || ''}, body: JSON.stringify(corpo)});
    const j = await r.json();
    if (!r.ok) throw new Error(j.erro || r.status);
    toast(act === 'delegar' ? `Delegado ao ${arg === 'claude' ? 'Claude' : 'Codex'} (${modoSel() === 'ler' ? 'só ler' : 'pode editar'}). Resultado no quadro.` : act === 'fluxo' ? `Fluxo "${j.nome}" iniciado (${j.passos} passos)` : 'Terminal aberto na pasta do projeto');
    if (ta && act !== 'sessao') ta.value = '';
  } catch (err) { toast('Não deu: ' + err.message); }
}
const ST_TAREFA = {'na fila': '⏳', 'rodando': '🟢', 'concluída': '✅', 'falhou': '❌'};
function orquestraCard(){
  if (!REAL || !realState) return '';
  const ts = realState.tarefas || [], q = (realState.quadro || []).slice(-12).reverse();
  if (NUVEM) return ts.length ? `<div class="card"><div class="sec"><h2>Tarefas entre agentes</h2></div><ul class="sessions">${ts.slice(0, 8).map(t => `<li><i style="background:var(--amber)"></i><span>${ST_TAREFA[t.status] || ''} ${esc(t.projeto)} · ${t.para} (${t.modo})</span><em>${t.status}</em></li>`).join('')}</ul></div>` : '';
  return `<div class="card"><div class="sec"><h2>Agentes conversando</h2><small>${ts.filter(t => t.status === 'rodando').length} rodando</small></div>
    ${ts.length ? `<ul class="sessions">${ts.slice(0, 6).map(t => `<li title="${esc(t.tarefa)}"><i style="background:var(--amber)"></i><span>${ST_TAREFA[t.status] || ''} ${esc(t.projeto)} · ${t.para === 'claude' ? 'Claude' : 'Codex'} (${t.modo}) · ${esc(short(t.tarefa, 40))}</span><em>${t.custoUsd ? brlFromUsd(t.custoUsd) : t.status}</em></li>`).join('')}</ul>` : '<p class="note">Nenhuma tarefa delegada ainda. Selecione um agente e use "Delegar", ou peça numa sessão: "use o central_delegar para o Codex revisar isso".</p>'}
    <div class="sec" style="margin-top:10px"><h2>Quadro</h2><small>recados entre sessões</small></div>
    ${q.length ? `<ul class="log">${q.map(m => `<li><time>${fmtTime(new Date(m.t))}</time><span class="who">${esc(short(m.projeto, 13))}</span><span class="x"><b>${esc(m.de)} → ${esc(m.para)}</b> · ${esc(short(m.texto, 160))}</span></li>`).join('')}</ul>` : '<p class="note">Quadro vazio.</p>'}</div>`;
}
// Recado novo no quadro vira balão num boneco da sala
function quadroBaloes(s){
  for (const m of s.quadro || []){
    if (m.t <= lastQuadroT) continue;
    lastQuadroT = m.t;
    const a = AGENTS.find(x => x.proj === m.projeto || x.R.name === m.sala);
    if (a){ a.bubble = {text: `${m.de}: ${short(m.texto, 70)}`, until: performance.now() + 6000}; a.pop = 1; }
  }
}

/* =========================== cartão do projeto (clique na sala) =========================== */
let PROJ = null, PROJ_SALA = null, PROJ_AT = 0, projCarregando = false;
function abrirProjeto(sala){
  PROJ_SALA = sala; PROJ = null; PROJ_AT = 0;
  if (tab !== 'agente') setTab('projeto');
  carregarProjeto();
}
async function carregarProjeto(){
  if (!PROJ_SALA || NUVEM || projCarregando) return;
  projCarregando = true;
  try { PROJ = await (await fetch('/api/projeto?sala=' + encodeURIComponent(PROJ_SALA))).json(); PROJ_AT = Date.now(); dirty = true; }
  catch { /* agente fora do ar */ } finally { projCarregando = false; }
}
const ESTADO_DEPLOY = {READY: ['var(--ok)', 'no ar'], ERROR: ['var(--err)', 'com erro'], BLOCKED: ['var(--err)', 'bloqueado'], BUILDING: ['var(--wait)', 'publicando'], QUEUED: ['var(--wait)', 'na fila'], CANCELED: ['var(--idle)', 'cancelado']};
function renderProjeto(){
  if (!PROJ_SALA) return '<div class="card"><p class="note">Clique numa sala do prédio para ver o projeto: custos, git, deploys, últimos pedidos e o relatório do cliente.</p></div>';
  if (NUVEM) return '<div class="card"><p class="note">O cartão completo do projeto (git, prompts, relatório) fica no app do PC.</p></div>';
  if (Date.now() - PROJ_AT > 30e3) carregarProjeto();
  const p = PROJ;
  if (!p || p.sala !== PROJ_SALA) return '<div class="card"><p class="note">Carregando ' + esc(PROJ_SALA) + '…</p></div>';
  if (p.erro) return '<div class="card"><p class="note">' + esc(p.erro) + '</p></div>';
  const R = ROOMS.find(x => x.name === p.sala) || {};
  const custo = (rot, c) => `<div class="stat"><span>${rot}</span><b>${brlFromUsd(c.usd)}</b><small class="note">${c.tarefas} tarefas${c.dias ? ' · ' + c.dias + ' dias' : ''}</small></div>`;
  const mes = new Date().toISOString().slice(0, 7);
  let html = `<div class="card"><div class="ag-head"><span class="swatch" style="background:${R.cor || 'var(--amber)'}"></span><div style="min-width:0"><div class="ag-name">${esc(p.sala)}</div><div class="ag-proj">${esc(p.cliente ? 'Cliente: ' + p.cliente : '')}${p.descricao ? ' · ' + esc(p.descricao) : ''}</div></div></div>
    <div class="stats">${custo('Hoje', p.custos.hoje)}${custo('7 dias', p.custos.semana)}${custo('Mês', p.custos.mes)}</div>
    <div class="row" style="flex-wrap:wrap;gap:6px;margin-top:10px">
      ${p.pasta ? '<button class="btn" type="button" data-act="abrirProj" data-arg="claude">Abrir Claude aqui</button><button class="btn" type="button" data-act="abrirProj" data-arg="codex">Abrir Codex aqui</button>' : ''}
      ${p.cliente ? `<a class="btn" href="/relatorio?cliente=${encodeURIComponent(p.cliente)}&mes=${mes}" target="_blank" rel="noopener">Relatório do mês · ${esc(p.cliente)}</a>` : ''}
      <button class="btn" type="button" data-act="editarSalas">Editar salas</button>
    </div>
    ${p.pasta ? `<p class="note" style="margin-top:8px">Pasta: <code>${esc(p.pasta)}</code></p>` : '<p class="note" style="margin-top:8px">Nenhuma sessão recente nesta sala: abra uma no projeto para o painel saber a pasta.</p>'}</div>`;
  if (p.git) html += `<div class="card"><div class="sec"><h2>Git</h2><small>${esc(p.git.branch)}</small></div>
    <p style="margin:0">${esc(p.git.ultimoCommit)}<br><span class="note">${p.git.quando ? 'há ' + fmtSpan(Date.now() - p.git.quando) : ''}${p.git.alteracoes ? ` · <b style="color:var(--wait)">${p.git.alteracoes} arquivo${p.git.alteracoes > 1 ? 's' : ''} sem commit</b>` : ' · tudo commitado'}</span></p>
    ${p.git.remoto ? `<p class="note" style="margin:6px 0 0"><a href="${esc(p.git.remoto)}" target="_blank" rel="noopener">${esc(p.git.remoto.replace(/^https:\/\//, ''))}</a></p>` : ''}</div>`;
  if (p.deploys.length) html += `<div class="card"><div class="sec"><h2>Deploys · Vercel</h2></div><ul class="sessions">${p.deploys.map(d => { const e = ESTADO_DEPLOY[d.producao?.estado || d.estado] || ['var(--idle)', String(d.estado).toLowerCase()];
    return `<li><i style="background:${e[0]}"></i><span>${esc(d.projeto)} · ${e[1]}${d.url ? ` · <a href="https://${esc(d.url)}" target="_blank" rel="noopener">${esc(d.url)}</a>` : ''}</span><em>${d.quando ? fmtSpan(Date.now() - d.quando) + ' atrás' : ''}</em></li>`; }).join('')}</ul></div>`;
  if (p.prompts.length) html += `<div class="card"><div class="sec"><h2>Últimos pedidos</h2></div><ul class="log">${p.prompts.map(x => `<li><time>${fmtTime(new Date(x.t))}</time><span class="x">${esc(short(x.texto.replace(/^"|"$/g, ''), 160))}</span></li>`).join('')}</ul></div>`;
  if (p.sessoes.length) html += `<div class="card"><div class="sec"><h2>Sessões</h2></div><ul class="sessions">${p.sessoes.map(s => `<li><i style="background:${ST[s.estado] || 'var(--idle)'}"></i><span>${esc(s.nome)}${s.projeto && s.projeto !== p.sala ? ' · ' + esc(s.projeto) : ''}</span><em>${brlFromUsd(s.custoUsdHoje || 0)}</em></li>`).join('')}</ul></div>`;
  if (p.tarefas.length) html += `<div class="card"><div class="sec"><h2>Tarefas entre agentes</h2></div><ul class="sessions">${p.tarefas.map(t => `<li title="${esc(t.tarefa)}"><i style="background:var(--amber)"></i><span>${ST_TAREFA[t.status] || ''} ${t.para === 'claude' ? 'Claude' : 'Codex'} (${t.modo}) · ${esc(short(t.tarefa, 50))}</span><em>${t.status}</em></li>`).join('')}</ul></div>`;
  return html;
}
async function realAbrirProj(para){
  try {
    const r = await fetch('/api/sessao', {method: 'POST', headers: {'Content-Type': 'application/json', 'X-EDH-Token': window.EDH_TOKEN || ''}, body: JSON.stringify({projeto: PROJ_SALA, para})});
    const j = await r.json(); if (!r.ok) throw new Error(j.erro || r.status);
    toast(`Terminal do ${para === 'claude' ? 'Claude' : 'Codex'} aberto em ${PROJ_SALA}`);
  } catch (err) { toast('Não deu: ' + err.message); }
}

/* =========================== editor de salas =========================== */
const VAGAS = [[0, 1, 2, 3], [0, 1, 2, 3, 4, 5, 6], [0, 1, 2, 3, 4], [0, 1, 2, 3]];
const TIPOS = {project: 'Projeto', control: 'Diretoria', reception: 'Recepção', infra: 'TI', studio: 'Estúdio'};
let EDIT = null;
async function abrirEditor(pastaNova){
  if (NUVEM){ toast('O editor de salas fica no app do PC'); return; }
  try { EDIT = await (await fetch('/api/config/salas')).json(); } catch { toast('Agente fora do ar'); return; }
  if (pastaNova){
    const ocup = new Set(EDIT.rooms.map(r => r.floor + ':' + r.slot));
    let f = 2, s = null; for (const fl of [2, 1, 3, 0]){ s = VAGAS[fl].find(v => !ocup.has(fl + ':' + v)); if (s != null){ f = fl; break; } }
    EDIT.rooms.push({room: pastaNova, floor: f, slot: s ?? 0, cliente: '', stack: '', match: '/' + pastaNova.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(/|$)', _nova: true});
  }
  let dlg = $('editorSalas');
  if (!dlg){ dlg = document.createElement('dialog'); dlg.id = 'editorSalas'; dlg.className = 'editor'; document.body.appendChild(dlg);
    dlg.addEventListener('click', e => { const b = e.target.closest('[data-ed]'); if (!b) return; const i = +b.dataset.i;
      lerEditor();
      if (b.dataset.ed === 'add') EDIT.rooms.push({room: 'Nova sala', floor: 2, slot: 0, cliente: '', stack: '', match: ''});
      if (b.dataset.ed === 'del') EDIT.rooms.splice(i, 1);
      if (b.dataset.ed === 'fechar'){ dlg.close(); return; }
      if (b.dataset.ed === 'salvar'){ salvarEditor(); return; }
      desenharEditor(); }); }
  desenharEditor(); dlg.showModal();
}
function desenharEditor(){
  const opt = (v, cur, label) => `<option value="${v}"${String(v) === String(cur) ? ' selected' : ''}>${esc(label)}</option>`;
  $('editorSalas').innerHTML = `<div class="ed-head"><b>Salas do prédio</b><small class="note">Cada sala é um projeto. "Pasta contém" decide quais sessões entram nela (ex.: <code>/downloads/fernando(/|$)</code>).</small></div>
    <div class="ed-scroll"><table><thead><tr><th>Sala (projeto)</th><th>Cliente</th><th>Descrição</th><th>Andar</th><th>Vaga</th><th>Tipo</th><th>Pasta contém</th><th></th></tr></thead><tbody>
    ${EDIT.rooms.map((r, i) => `<tr data-row="${i}"${r._nova ? ' class="nova"' : ''}><td><input data-k="room" value="${esc(r.room)}"></td><td><input data-k="cliente" value="${esc(r.cliente || '')}"></td><td><input data-k="stack" value="${esc(r.stack || '')}"></td>
      <td><select data-k="floor">${FLOORS.map(F => opt(F.i, r.floor, F.short + ' ' + F.name)).join('')}</select></td>
      <td><select data-k="slot">${VAGAS[r.floor].map(v => opt(v, r.slot, String(v + 1))).join('')}</select></td>
      <td><select data-k="type">${Object.entries(TIPOS).map(([k, l]) => opt(k, r.type || 'project', l)).join('')}</select></td>
      <td><input data-k="match" value="${esc(r.match || '')}" placeholder="${r.fallback ? '(recebe as pastas sem sala)' : ''}"${r.fallback ? ' disabled' : ''}></td>
      <td><button class="btn" type="button" data-ed="del" data-i="${i}" aria-label="Remover ${esc(r.room)}">✕</button></td></tr>`).join('')}
    </tbody></table></div>
    <div class="ed-foot"><button class="btn" type="button" data-ed="add">+ Nova sala</button><span style="flex:1"></span><button class="btn" type="button" data-ed="fechar">Cancelar</button><button class="btn solid" type="button" data-ed="salvar">Salvar e recarregar</button></div>`;
  $('editorSalas').querySelectorAll('select[data-k="floor"]').forEach(sel => sel.addEventListener('change', () => { lerEditor(); desenharEditor(); }));
}
function lerEditor(){
  $('editorSalas').querySelectorAll('tr[data-row]').forEach(tr => {
    const r = EDIT.rooms[+tr.dataset.row]; if (!r) return;
    tr.querySelectorAll('[data-k]').forEach(el => { const k = el.dataset.k; let v = el.value; if (k === 'floor' || k === 'slot') v = +v; if (k === 'match' && el.disabled) return; r[k] = v; });
    if (!VAGAS[r.floor].includes(r.slot)) r.slot = VAGAS[r.floor][0];
    if (r.type === 'project') delete r.type;
    for (const k of ['cliente', 'stack', 'match']) if (r[k] === '') delete r[k];
  });
}
async function salvarEditor(){
  lerEditor();
  const rooms = EDIT.rooms.map(({_nova, ...r}) => r);
  try {
    const r = await fetch('/api/config/salas', {method: 'POST', headers: {'Content-Type': 'application/json', 'X-EDH-Token': window.EDH_TOKEN || ''}, body: JSON.stringify({rooms, floors: EDIT.floors})});
    const j = await r.json(); if (!r.ok) throw new Error(j.erro || r.status);
    toast('Salas salvas. Recarregando o prédio…'); setTimeout(() => location.reload(), 700);
  } catch (err) { toast('Não salvei: ' + err.message); }
}
