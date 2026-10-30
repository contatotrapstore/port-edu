// Central de Agentes · prédio 3D — dados.js
// Constantes, salas, planos e sites conferidos.
// Scripts clássicos: as constantes de nível superior são compartilhadas entre os arquivos, na ordem de carga do index.html.
const $ = id => document.getElementById(id);
const loadingEl = $('loading');
// Fonte dos dados: agente local (localhost:4321, injeta window.EDH_TOKEN) ou nuvem (site /central/predio?fonte=nuvem). Sem nenhum dos dois, não monta o prédio
const NUVEM = new URLSearchParams(location.search).get('fonte') === 'nuvem';   // site: resumo sanitizado do Supabase, com login
const REAL = true;                                                              // sempre dados reais (o protótipo simulado saiu)
if (!NUVEM && !window.EDH_TOKEN){ loadingEl.textContent = 'Abra pelo app do PC (localhost:4321) ou pelo site /central'; throw new Error('Central sem fonte de dados'); }
if (!window.THREE || !THREE.MapControls || !THREE.BufferGeometryUtils){ loadingEl.textContent = 'Não consegui carregar o motor 3D. Confira a conexão e recarregue a página.'; throw new Error('Three.js não carregou'); }
let renderer;
try { renderer = new THREE.WebGLRenderer({canvas: $('gl'), antialias: true, powerPreference: 'high-performance'}); }
catch (e) { loadingEl.textContent = 'Este navegador não liberou o WebGL, que a versão 3D precisa. Tente no Chrome ou Edge atualizado.'; throw e; }

/* =============================== DATA =============================== */
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const MOBILE = matchMedia('(max-width: 700px), (pointer: coarse)').matches;
// Layout real (salas do config.json): o agente injeta em window.EDH_LAYOUT; na nuvem vem do estado (boot.js)
const LAYOUT = window.EDH_LAYOUT && (window.EDH_LAYOUT.rooms || []).length ? window.EDH_LAYOUT : null;
const AVULSOS = ((LAYOUT && LAYOUT.rooms.find(r => r.fallback)) || {}).room || 'Projetos avulsos';
const RW = 10, RD = 8, GAP = 2.5, WH = 2.6, COLS = 4, PLAZA = 6.5, FH = 4.2;
const WW = COLS*RW + (COLS-1)*GAP, WD = 2*RD + GAP;
const WALK = WD + 1.5, DOOR_X = 8.4, AISLE = 4.7, BACK = 7.3;
const EX = WW + 3.3, EZ = WD + 3.4;
let CAMBIO = 5.40; // vem do agente (config.json → usdBrl)
const AMBER = '#F5B935', CREAM = '#EDE6D6';
const ST = {working:'#5BD69E', waiting:'#FFD84A', error:'#FF6B5E', idle:'#6F837B', empty:'#2A3832', boss:'#F5B935'};
const ST_LABEL = {working:'Trabalhando', waiting:'Precisa de você', error:'Erro', idle:'Ocioso'};
const TOOL_PT = {Edit:'Editando', Read:'Lendo', Bash:'Executando', Grep:'Buscando', Write:'Criando', WebFetch:'Consultando', Imagem:'Gerando imagem', Video:'Gerando vídeo', Voz:'Narrando'};
const KIND_TAG = {wait:'Permissão', err:'Erro', done:'Concluído', prompt:'Prompt', tool:'Ação'};
const pick = a => a[Math.floor(Math.random()*a.length)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const brlFromUsd = (usd, dec=2) => 'R$ ' + (usd*CAMBIO).toLocaleString('pt-BR',{minimumFractionDigits:dec, maximumFractionDigits:dec});
const brl = (v, dec=0) => 'R$ ' + v.toLocaleString('pt-BR',{minimumFractionDigits:dec, maximumFractionDigits:dec});
const num = n => Math.round(n).toLocaleString('pt-BR');
const fmtTok = n => n >= 1e6 ? (n/1e6).toFixed(2).replace('.',',') + ' M' : Math.round(n/1e3) + ' mil';
const fmtTime = d => d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
const fmtDur = ms => { const s = Math.max(0, Math.floor(ms/1000)); return String(Math.floor(s/60)).padStart(2,'0') + ':' + String(s%60).padStart(2,'0'); };
const fmtSpan = ms => { const m = Math.max(1, Math.round(ms/60000)); if (m < 60) return m + ' min'; const h = Math.floor(m/60); if (h < 48) return h + 'h' + String(m%60).padStart(2,'0'); return Math.round(h/24) + ' dias'; };
const short = (s,n) => s.length > n ? s.slice(0,n-1) + '…' : s;
const base = p => String(p).split('/').pop();
const clamp = (v,a,b) => Math.max(a, Math.min(b, v));

const FLOORS = [
  {i:0, name:'Térreo', short:'T', desc:'Recepção, TI, Diretoria e convivência'},
  {i:1, name:'Desenvolvimento', short:'1º', desc:'Uma sala por projeto'},
  {i:2, name:'Comercial', short:'2º', desc:'Workana, funil, captação e prospecção'},
  {i:3, name:'Marketing', short:'3º', desc:'EDevsHub, Revix, estúdio e tráfego'},
];
FLOORS.forEach(F => F.y = F.i*FH);
if (LAYOUT) (LAYOUT.floors || []).forEach((x, i) => { if (FLOORS[i] && x){ FLOORS[i].name = x.name || FLOORS[i].name; FLOORS[i].desc = x.desc || ''; } });

// Sala real a partir do config.json: tipo do prédio + "kind" usado nas telas e animações
const REAL_KIND = {control: 'fin', reception: 'recep', infra: 'ops'};
const TIPOS_REAIS = ['project', 'control', 'reception', 'infra', 'studio'];
const realRoomDef = r => ({f: r.floor, slot: r.slot, type: TIPOS_REAIS.includes(r.type) ? r.type : 'project', name: r.room, stack: r.stack || '', cliente: r.cliente || null, kind: r.type === 'studio' ? undefined : (REAL_KIND[r.type] || 'code'), tasks: [], budget: r.budgetBrl || 0, fallback: !!r.fallback});
// Sem mapa (agente ainda sem config ou nuvem sem estado): só Diretoria e Projetos avulsos
const ROOM_DEFS = LAYOUT ? LAYOUT.rooms.map(realRoomDef) : [
  realRoomDef({room: 'Diretoria', floor: 0, slot: 3, type: 'control', stack: 'Central de Agentes'}),
  realRoomDef({room: AVULSOS, floor: 0, slot: 0, stack: 'Salas ainda não carregadas do config', fallback: true}),
];
const ROOMS = ROOM_DEFS.map((d, i) => {
  const R = {...d}; R.i = i; R.c = d.slot % COLS; R.r = Math.floor(d.slot / COLS);
  R.ox = R.c*(RW+GAP); R.oz = R.r*(RD+GAP);
  R.base = 0; R.done = 0;   // custo e tarefas do dia chegam do agente (fonte.js); orçamento só se vier do config
  return R;
});
const DESK_X = [1.7, 4.8, 7.9];
function SEAT(R, d){
  if (R.type === 'control' && d === 0) return {x:R.ox+2.0, z:R.oz+3.45};
  if (R.type === 'reception') return {x:R.ox+4.8, z:R.oz+3.45};
  return {x:R.ox+DESK_X[d], z:R.oz+3.45};
}
const IDLE_SPOTS = {
  office:[{x:4.0, z:6.1, pose:'sofa', yaw:Math.PI, via:'front'},{x:5.2, z:6.1, pose:'sofa', yaw:Math.PI, via:'front'},{x:.95, z:4.3, pose:'look', yaw:-Math.PI/2, via:'front'}],
  studio:[{x:2.55, z:6.45, pose:'bean', yaw:Math.PI, via:'front'},{x:3.85, z:6.45, pose:'bean', yaw:Math.PI, via:'front'},{x:5.15, z:6.45, pose:'bean', yaw:Math.PI, via:'front'}],
  control:[{x:4.7, z:6.65, pose:'chair', yaw:Math.PI, via:'back'},{x:5.8, z:6.65, pose:'chair', yaw:Math.PI, via:'back'},{x:6.9, z:6.65, pose:'chair', yaw:Math.PI, via:'back'}],
};
const idleFor = R => R.type === 'studio' ? IDLE_SPOTS.studio : R.type === 'control' ? IDLE_SPOTS.control : IDLE_SPOTS.office;

/* lounge spots per floor (world coords) */
const COPA = [
  [ // Térreo: convivência
    {x:15.0, z:14.25, kind:'drink', yaw:Math.PI}, {x:17.4, z:14.25, kind:'drink', yaw:Math.PI},
    {x:17.4, z:WD+1.95, kind:'coffee', yaw:Math.PI}, {x:18.6, z:WD+1.95, kind:'coffee', yaw:Math.PI},
    {x:27.0, z:WD+1.95, kind:'arcade', yaw:Math.PI},
    {x:3.45, z:WD+4.1, kind:'pong', yaw:Math.PI/2, pair:'pong'}, {x:6.55, z:WD+4.1, kind:'pong', yaw:-Math.PI/2, pair:'pong'},
    {x:16.4, z:WD+4.62, kind:'sofa', yaw:Math.PI}, {x:17.6, z:WD+4.62, kind:'sofa', yaw:Math.PI},
    {x:28.55, z:WD+4.1, kind:'foos', yaw:Math.PI/2, pair:'foos'}, {x:30.45, z:WD+4.1, kind:'foos', yaw:-Math.PI/2, pair:'foos'},
    {x:28.0, z:13.4, kind:'bench', yaw:Math.PI}, {x:30.0, z:14.2, kind:'bench', yaw:Math.PI}, {x:32.0, z:13.4, kind:'bench', yaw:Math.PI},
    {x:40.3, z:WD+3.2, kind:'bean', yaw:Math.PI}, {x:42.3, z:WD+3.2, kind:'bean', yaw:Math.PI},
  ],
  [ // Desenvolvimento: área aberta no fundo + plaza
    {x:40.0, z:12.6, kind:'coffee', yaw:Math.PI}, {x:41.2, z:12.6, kind:'water', yaw:Math.PI},
    {x:43.0, z:15.0, kind:'standup', yaw:Math.PI/2}, {x:45.2, z:15.0, kind:'standup', yaw:-Math.PI/2}, {x:44.1, z:16.2, kind:'standup', yaw:Math.PI},
    {x:20.0, z:WD+3.6, kind:'bean', yaw:Math.PI}, {x:22.0, z:WD+3.6, kind:'bean', yaw:Math.PI},
  ],
  [ // Comercial
    {x:26.0, z:12.8, kind:'bell', yaw:Math.PI},
    {x:30.4, z:15.2, kind:'sofa', yaw:Math.PI}, {x:31.6, z:15.2, kind:'sofa', yaw:Math.PI},
    {x:40.0, z:12.6, kind:'coffee', yaw:Math.PI}, {x:41.2, z:12.6, kind:'water', yaw:Math.PI},
    {x:44.0, z:15.6, kind:'bean', yaw:Math.PI},
  ],
  [ // Marketing
    {x:6.0, z:15.4, kind:'photo', yaw:0}, {x:5.0, z:16.6, kind:'shoot', yaw:Math.PI},
    {x:17.0, z:15.0, kind:'bean', yaw:Math.PI}, {x:18.6, z:15.0, kind:'bean', yaw:Math.PI},
    {x:28.0, z:12.6, kind:'coffee', yaw:Math.PI}, {x:29.2, z:12.6, kind:'water', yaw:Math.PI},
    {x:40.4, z:15.2, kind:'sofa', yaw:Math.PI}, {x:41.6, z:15.2, kind:'sofa', yaw:Math.PI},
  ],
];
COPA.forEach((list, f) => list.forEach(s => { s.by = null; s.f = f; }));
const COPA_LABEL = {drink:'Pegando energético', coffee:'Tomando café', water:'Pegando água', pong:'Jogando pingue-pongue', arcade:'No fliperama', sofa:'Descansando', foos:'Jogando pebolim', bean:'Relaxando', bench:'Na arquibancada', standup:'Na daily', bell:'Tocando o sino', photo:'Posando pra foto', shoot:'Fotografando'};

/* plans */
// Nada de número inventado: preços e nomes padrão, medidores e créditos chegam do agente (fonte.js → realPlans); sem fonte, ficam vazios
const H5 = 5*3600e3, D7 = 7*86400e3;
const PLANS = [
  {id:'claude', name:'Claude', tier:'Max 20x', brl:1100, mono:'C', color:'#E39B6B', meters:[]},
  {id:'gpt', name:'ChatGPT', tier:'5x', brl:550, mono:'G', color:'#9BD3B7', meters:[]},
  {id:'higgs', name:'Higgsfield', tier:'a confirmar', brl:null, mono:'H', color:'#C8B6F0', credit:null},
  {id:'eleven', name:'ElevenLabs', tier:'Starter', brl:33, approx:true, mono:'E', color:'#F0E2B6', credit:null},
];
const PLAN = Object.fromEntries(PLANS.map(p => [p.id, p]));
function meterInfo(m){
  const now = Date.now();
  if (!m.reset || m.reset <= now) return {elapsed: 1, proj: m.reset ? 'Janela reiniciada, aguardando a próxima leitura' : 'Sem data de reinício', cls: '', over: false};
  const elapsed = clamp(1 - (m.reset - now)/m.win, .001, 1); let proj, cls = '';
  if (m.used < .5) proj = 'Sem uso nesta janela';
  else { const rate = m.used / (elapsed*m.win), at = m.used + rate*(m.reset - now);
    if (at <= 100){ proj = `No ritmo atual, sobram ${Math.round(100-at)}% no reset`; cls = at < 70 ? 'good' : ''; }
    else { proj = `No ritmo atual, acaba em ${fmtSpan((100-m.used)/rate)}, antes do reset`; cls = 'bad'; } }
  return {elapsed, proj, cls, over: cls === 'bad'};
}
function creditInfo(c){
  if (!c || !c.total) return {usedPct: 0, elapsed: 0, leftover: 0, proj: (c && c.label) || 'Sem fonte de dados', cls: '', short: false, rate: 0};
  const elapsedD = c.elapsedDays ?? (c.cycle - c.daysLeft), usedC = c.total - c.left, rate = usedC / Math.max(1, elapsedD), need = rate * c.daysLeft, usedPct = usedC / c.total * 100;
  if (need <= c.left) return {usedPct, elapsed: elapsedD/c.cycle, leftover: c.left - need, proj:`No ritmo atual, sobram ~${num(c.left-need)} ${c.unit} na renovação`, cls:'good', short:false, rate};
  return {usedPct, elapsed: elapsedD/c.cycle, leftover:0, runout: c.left/rate, proj:`No ritmo atual, acaba em ~${Math.max(1,Math.round(c.left/rate))} dias (renova em ${c.daysLeft})`, cls:'bad', short:true, rate};
}

/* sites conferidos pelo agente (fonte.js preenche; tela da TI lê) */
const BIZ = {uptime: []};
