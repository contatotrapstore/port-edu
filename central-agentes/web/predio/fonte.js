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
  return realState && realState.remoteApproval
    ? 'O pedido foi para o terminal. Para aprovar por aqui, deixe este painel aberto e visível quando o pedido chegar.'
    : 'Aprovação pelo painel desligada (config.json → remoteApproval). Responda no terminal.';
}

function realUpdate(a, x, first){
  const prev = a.state;
  a.name = x.name || 'Principal'; a.proj = x.room; a.model = modelLabel(x.model); a.family = familyOf(x.model);
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
      p.credit = src.source === 'api' && src.limit ? {total: src.limit, left: Math.max(0, src.limit - (src.used || 0)), unit: 'créditos', daysLeft: Math.max(0, Math.ceil(((src.resetAt || 0) - Date.now()) / 86400e3)), cycle: 30, mix: {}} : null;
      p.sourceNote = src.source === 'sem chave' ? 'Sem chave da ElevenLabs. Coloque ELEVENLABS_API_KEY (só leitura) em agent/.env.' : 'ElevenLabs: ' + (src.source || 'sem leitura');
    } else if (p.id === 'higgs'){
      const tot = i.manualCreditsTotal, left = i.manualCreditsLeft;
      p.credit = tot && left != null ? {total: tot, left, unit: 'créditos', daysLeft: i.renewInDays ?? 30, cycle: 30, mix: {}} : null;
      p.sourceNote = 'Plano e créditos a confirmar. Preencha manualCreditsTotal e manualCreditsLeft em config.json → plans.higgs.';
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
  const day = new Map();
  for (const r of s.rooms || []){ const R = roomOfReal(r), d = day.get(R) || {cost: 0, tasks: 0}; d.cost += r.costUsdToday || 0; d.tasks += r.tasksToday || 0; day.set(R, d); }
  let tasks = 0;
  for (const R of ROOMS){
    const d = day.get(R) || {cost: 0, tasks: 0}, live = R.agents.reduce((t, a) => t + a.cost, 0);
    R.base = Math.max(0, d.cost - live); R.done = Math.max(d.tasks, R.agents.reduce((t, a) => t + a.tasksDone, 0)); tasks += R.done;
    if (first) R.hist = Array(30).fill(roomCost(R));
  }
  if (first) totalHist.fill(totalCost());
  COMPANY.tasks = tasks; COMPANY.xp = tasks * 25;

  FEED.length = 0;
  for (const f of s.feed || []) FEED.push(toEv(f, REAL_AGENTS.get(f.agentId) || {R: {name: REAL_ROOM.get(f.agentId) || 'Sessão encerrada'}, name: ''}));

  realPlans(s);
  if (!selected) selected = AGENTS.find(a => a.state === 'waiting') || AGENTS[0] || null;
  $('simTag').textContent = `Dados reais · agente local · US$ 1 = R$ ${CAMBIO.toFixed(2).replace('.', ',')} · números do Comercial e Marketing ainda simulados`;
  checkAchievements();
  dirty = true;
}

async function realPermission(a, ok){
  if (!a.pendingId){ toast(a.permNote || 'Responda no terminal'); return; }
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
  $('simTag').textContent = 'Conectando ao agente local…';
  let first = true;
  const es = new EventSource('/api/events');   // reconecta sozinho se o agente reiniciar
  es.addEventListener('state', ev => {
    try {
      realApply(JSON.parse(ev.data), first);
      if (first){ first = false; loadHistory(); loadCosts(); setInterval(loadCosts, 60e3); }
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
