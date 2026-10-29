// Central de Agentes · prédio 3D — sim.js
// Agentes simulados, simulação e sugestões.
// Scripts clássicos: as constantes de nível superior são compartilhadas entre os arquivos, na ordem de carga do index.html.
/* agents */
const SKINS = ['#E8C6A3','#C69467','#8E5B3B','#F0D2B6','#A9734C'];
const HAIR = ['#1A1412','#3B2A1E','#6B4A2E','#C9A46A','#2B2B2B','#7A3B2A'];
const DEF = REAL ? [] : [ // no modo real os agentes vêm do agente local (fonte.js)
  [0,0,'Recepção','Haiku','#C79A3E','working',0],
  [0,2,'DevOps','Sonnet','#3C7FB0','working',0],
  [0,3,'Financeiro','Haiku','#5C7F9E','working',2],
  [1,0,'Principal','Opus','#2E8A84','working',0],[1,0,'Sub · testes','Sonnet','#C2852B','idle',1],
  [1,1,'Principal','Sonnet','#4E63CF','waiting',0],[1,1,'Revisor','Codex','#9AA6AE','working',1],
  [1,2,'Principal','Sonnet','#B8484E','working',0],
  [1,3,'QA','Sonnet','#7A5FB0','working',0],
  [1,4,'Principal','Opus','#3E9E5E','working',0],[1,4,'Sub · pesquisa','Haiku','#7A8F5A','idle',1],
  [1,5,'Principal','Opus','#D09A3C','error',0],[1,5,'Sub · testes','Sonnet','#3C7FB0','working',1],[1,5,'Sub · docs','Haiku','#C26B7A','working',2],
  [1,6,'Principal','Codex','#45A39A','working',0],
  [2,0,'Propostas','Sonnet','#C2852B','working',0],[2,0,'Triagem','Haiku','#6B8F9E','working',1],
  [2,1,'Follow-up','Haiku','#B8484E','working',0],
  [2,2,'Contratos','Sonnet','#4E63CF','idle',0],
  [2,3,'Prospector','Haiku','#3E9E5E','working',0],
  [3,0,'Social','Sonnet','#D09A3C','working',0],
  [3,1,'Social','Haiku','#C26B7A','working',0],
  [3,2,'Diretora de arte','Higgsfield','#8E5BC2','working',0],[3,2,'Locutor','ElevenLabs','#C26B3A','idle',1],
  [3,3,'Tráfego','Sonnet','#45A39A','waiting',0],
];
const pnow = performance.now();
let dirty = true;
const FEED = [];
const COMPANY = {xp:0, tasks:0, unlocked:[]};
function useTokens(a, kin, kout){
  const M = MODELS[a.model]; if (!M.rin) return;
  const tin = Math.round(rand(...kin)), tout = Math.round(rand(...kout));
  a.tin += tin; a.tout += tout; a.cost += tin/1e6*M.rin + tout/1e6*M.rout;
  if (M.prov === 'claude'){ const w = M.w*rand(.6,1.4), m = PLAN.claude.meters; m[0].used = Math.min(100, m[0].used + w); m[1].used = Math.min(100, m[1].used + w/18); }
  if (M.prov === 'gpt'){ const w = M.w*rand(.6,1.4), m = PLAN.gpt.meters; m[0].used = Math.min(100, m[0].used + w); m[1].used = Math.min(100, m[1].used + w/10); }
}
function useCredits(a, n){ const P = PLAN[a.prov]; n = Math.min(n, P.credit.left); P.credit.left -= n; a.units += n; a.cost += n * usdPerCredit[a.prov]; }
function emit(a, kind, text, tag){
  const e = {t:new Date(), a, kind, text, tag: tag || KIND_TAG[kind]};
  a.log.unshift(e); if (a.log.length > 16) a.log.pop();
  FEED.unshift(e); if (FEED.length > 90) FEED.pop();
  if (kind === 'wait' || kind === 'err' || kind === 'done') a.pop = 1;
  dirty = true;
}
const SNIPPETS = {
  Edit:['+ const status = await api.get(`/pedidos/${id}`)','- if (!user) return','+ if (!user?.ativo) return null','+ await queue.add("publicar", post)'],
  Write:['export function gerarRelatorio(mes) {','+ describe("checkout", () => {','+ CREATE TABLE checkins (...)'],
  Bash:['$ npm run build  ✓ 41 testes','$ ./gradlew bundleRelease  BUILD OK','$ git push origin main'],
  Read:['lendo 214 linhas…','// TODO: tratar timeout da API','import { supabase } from "../lib"'],
  Grep:['3 resultados em src/','useEffect → 7 ocorrências'],
  Escrevendo:['"Olá! Vi seu projeto e já entreguei algo bem parecido…"','"5 automações com IA que economizam 10h por semana"','"Oi! Passando pra saber se ficou alguma dúvida…"'],
  Criando:['slide 3/6: antes × depois','capa: fundo petróleo + âmbar'],
};
function actionFor(a, silent){
  const R = a.R; let tool, target, text;
  if (a.kind === 'code'){
    const t = Math.random();
    if (t < .26){ tool='Read'; target=pick(R.files); text=target; }
    else if (t < .52){ tool='Edit'; target=pick(R.files); text=target + '  +' + irand(2,48) + ' −' + irand(0,20); }
    else if (t < .64){ tool='Grep'; target='"' + pick(['useEffect','status','webhook','token','pedido','retry']) + '"'; text='por ' + target; }
    else if (t < .82){ tool='Bash'; target=pick(R.cmds); text=target; }
    else if (t < .92){ tool='Write'; target=pick(R.files); text=target; }
    else { tool='WebFetch'; target=pick(['docs do Capacitor','docs da Graph API','docs do Kommo','docs do Flutter']); text=target; }
    if (!silent) useTokens(a,[1500,9000],[150,1800]);
  } else if (a.kind === 'higgs'){
    if (Math.random() < .7){ tool='Imagem'; target=pick(['elyvra-lookbook-07.png','revix-banner-encontro.png','case-planetshake.png']); if (!silent) useCredits(a, irand(2,6)); }
    else { tool='Video'; target=pick(['revix-teaser-10s.mp4','bastidores-edevshub.mp4']); if (!silent) useCredits(a, irand(10,20)); }
    text = target;
  } else if (a.kind === 'eleven'){
    tool='Voz'; target=pick(['revix-anuncio-ep3.mp3','ligou-chegou-ura.mp3']); const ch = irand(150,600); if (!silent) useCredits(a, ch); text = target + ' · ' + num(ch) + ' créditos';
  } else {
    const K = KINDS[a.kind], [tl, targets] = pick(K.acts); tool = tl; target = pick(targets); text = target;
    if (!silent) useTokens(a,[800,4000],[200,900]);
  }
  a.tool = tool; a.target = target;
  if (!silent){
    emit(a,'tool',text,TOOL_PT[tool] || tool); a.xp += 2; COMPANY.xp += 2;
    const sn = SNIPPETS[tool]; if (sn && Math.random() < .6) a.bubble = {text: pick(sn), until: performance.now() + 3800};
  }
}
const AGENTS = DEF.map(([f, slot, name, model, color, state, desk], i) => {
  const R = roomAt(f, slot), M = MODELS[model];
  const kind = R.type === 'studio' ? (model === 'Higgsfield' ? 'higgs' : 'eleven') : R.kind;
  const a = {id:i, R, f, name, model, prov:M.prov, kind, color, skin:SKINS[i % SKINS.length], hair:HAIR[i % HAIR.length], desk, state,
    tin:0, tout:0, cost:0, units:0, tool:'', target:'', since:pnow - rand(30e3, 600e3), next:pnow + rand(500,3000),
    waitSince:pnow - rand(4e3,15e3), waitCmd:'', errMsg:'', log:[], idleSpot:desk % 3, path:[], copa:null, spot:null, via:'front', pop:0, yaw:Math.PI,
    xp: irand(40, 380), tasksDone: irand(1, 9), ride:null, bubble:null};
  a.prompts = kind === 'code' ? R.prompts : kind === 'social' ? SOCIAL_PROMPTS[R.brand] : KINDS[kind].prompts;
  a.prompt = pick(a.prompts);
  a.waits = kind === 'code' ? R.cmds : (KINDS[kind].waits || []);
  a.errs = kind === 'code' ? ['2 de 41 testes falharam','build falhou: tipo incompatível','lint: 3 erros','timeout na chamada da API'] : (KINDS[kind].errs || []);
  if (M.rin){ a.tin = Math.round(rand(40e3, 280e3) * (kind === 'code' ? 1 : .4)); a.tout = Math.round(a.tin*rand(.08,.18)); a.cost = a.tin/1e6*M.rin + a.tout/1e6*M.rout; }
  else { a.units = model === 'Higgsfield' ? irand(60,160) : irand(2000,6000); a.cost = a.units * usdPerCredit[M.prov]; }
  if (state === 'working') actionFor(a, true);
  if (state === 'waiting'){ a.waitCmd = pick(a.waits); a.tool = 'Permissão'; a.target = a.waitCmd; }
  if (state === 'error'){ a.tool = 'Bash'; a.target = pick(a.waits.length ? a.waits : ['build']); a.errMsg = pick(a.errs); }
  COMPANY.xp += a.xp; COMPANY.tasks += a.tasksDone;
  return a;
});
ROOMS.forEach(R => R.agents = AGENTS.filter(a => a.R === R));
// starting positions
const startCopa = {4:[0,5], 10:[0,6], 23:[0,2], 18:[2,1]};
AGENTS.forEach(a => {
  const sc = startCopa[a.id];
  if (a.state === 'idle' && sc){ const s = COPA[sc[0]][sc[1]]; s.by = a.id; a.copa = s; a.f = s.f; a.pos = {x:s.x, z:s.z}; a.yaw = s.yaw; a.via = 'open'; }
  else if (a.state === 'idle'){ const s = idleFor(a.R)[a.idleSpot]; a.spot = s; a.pos = {x:a.R.ox+s.x, z:a.R.oz+s.z}; a.yaw = s.yaw; a.via = s.via; }
  else { a.pos = SEAT(a.R, a.desk); a.yaw = Math.PI; a.via = 'front'; }
});
AGENTS.forEach(a => {
  const e = {t:new Date(Date.now()-rand(5e3,60e3)), a, kind:'tool', text:a.target, tag:TOOL_PT[a.tool] || a.tool};
  if (a.state === 'waiting'){ e.kind = 'wait'; e.text = 'Pede permissão: ' + a.waitCmd; e.tag = KIND_TAG.wait; }
  if (a.state === 'error'){ e.kind = 'err'; e.text = 'Falhou: ' + a.errMsg; e.tag = KIND_TAG.err; }
  if (a.state === 'idle'){ e.kind = 'done'; e.text = 'Tarefa concluída'; e.tag = KIND_TAG.done; }
  a.log.push(e); FEED.push(e);
});
FEED.sort((x,y) => y.t - x.t);
const roomCost = R => R.base + R.agents.reduce((s,a) => s + a.cost, 0);
// No modo real o total vem da soma por sala do agente (uma sessão que muda de pasta não conta duas vezes)
const totalCost = () => REAL && window.EDH_DAY_TOTAL != null ? window.EDH_DAY_TOTAL : ROOMS.reduce((s,R) => s + roomCost(R), 0);
ROOMS.forEach(R => { const end = roomCost(R); R.hist = []; let v = end*.35; for (let k=0;k<30;k++){ R.hist.push(v); v += (end - v)/(30-k)*rand(.4,1.6); } R.hist[29] = end; });
const totalHist = []; for (let k=0;k<30;k++) totalHist.push(ROOMS.reduce((s,R) => s + R.hist[k], 0));

/* XP and achievements */
const levelOf = xp => Math.floor(xp/100) + 1;
const companyLevel = () => Math.floor(COMPANY.xp/600) + 1;
const ACHIEVEMENTS = [
  {id:'t60', label:'60 tarefas no dia', test:() => COMPANY.tasks >= 60},
  {id:'t80', label:'80 tarefas no dia', test:() => COMPANY.tasks >= 80},
  {id:'t120', label:'120 tarefas no dia', test:() => COMPANY.tasks >= 120},
  {id:'deal', label:'Contrato fechado', test:() => BIZ.bell >= 1},
  {id:'deal3', label:'3 contratos no dia', test:() => BIZ.bell >= 3},
  {id:'lv10', label:'Agente nível 6', test:() => AGENTS.some(a => levelOf(a.xp) >= 6)},
  {id:'perm', label:'10 permissões liberadas', test:() => COMPANY.perms >= 10},
];
COMPANY.perms = 0;
function checkAchievements(){
  for (const A of ACHIEVEMENTS){ if (!COMPANY.unlocked.includes(A.id) && A.test()){ COMPANY.unlocked.push(A.id); toast('Conquista desbloqueada: ' + A.label); const d = AGENTS[0]; FEED.unshift({t:new Date(), a:d, kind:'xp', text:A.label, tag:KIND_TAG.xp}); dirty = true; } }
}

/* walking with floors and elevator */
function inRoom(R, p){ return p.x >= R.ox-.01 && p.x <= R.ox+RW+.01 && p.z >= R.oz-.01 && p.z <= R.oz+RD+.01; }
const accessZ = (R, via) => R.oz + (via === 'back' ? BACK : AISLE);
function doorToLounge(R){
  const dx = R.ox + DOOR_X;
  if (R.r === 0){ const zc = R.oz + RD + GAP/2, gx = Math.min(R.ox + RW + GAP/2, WW + .6); return [[dx,zc],[gx,zc],[gx,WALK]]; }
  return [[dx, WALK]];
}
function planPath(a, dest, via, destF){
  const R = a.R, p = a.pos, here = a.f, there = destF ?? R.f;
  const fromIn = here === R.f && inRoom(R, p), toIn = via !== 'open';
  const door = [R.ox+DOOR_X, R.oz+RD+.7];
  if (fromIn && toIn && here === there){
    const z1 = accessZ(R, a.via), z2 = accessZ(R, via);
    a.via = via;
    return (z1 === z2 ? [[p.x, z1],[dest.x, z2],[dest.x, dest.z]] : [[p.x, z1],[R.ox+DOOR_X, z1],[R.ox+DOOR_X, z2],[dest.x, z2],[dest.x, dest.z]]).map(([x,z]) => ({x,z}));
  }
  const out = [];
  if (fromIn){ const z1 = accessZ(R, a.via); out.push([p.x, z1],[R.ox+DOOR_X, z1], door, ...doorToLounge(R)); }
  else out.push([p.x, WALK]);
  if (here !== there){ out.push([EX, WALK],[EX, EZ], {elev: there}, [EX, WALK]); }
  if (toIn){ const z2 = accessZ(R, via); out.push(...doorToLounge(R).reverse(), door, [R.ox+DOOR_X, z2], [dest.x, z2], [dest.x, dest.z]); }
  else out.push([dest.x, WALK], [dest.x, dest.z]);
  a.via = via;
  return out.map(q => Array.isArray(q) ? {x:q[0], z:q[1]} : q);
}
function releaseSpot(a){ if (a.copa){ a.copa.by = null; a.copa = null; } a.spot = null; }
function goSeat(a){ releaseSpot(a); a.path = planPath(a, SEAT(a.R, a.desk), 'front', a.R.f); a.yawEnd = Math.PI; }
function goIdle(a){
  releaseSpot(a);
  const roll = Math.random();
  const floor = roll < .3 && a.R.f !== 0 ? 0 : a.R.f;
  if (roll < .82){
    const list = COPA[floor], free = list.filter(s => s.by === null);
    const waitingPair = free.filter(s => s.pair && list.some(o => o !== s && o.pair === s.pair && o.by !== null));
    const spot = waitingPair.length && Math.random() < .75 ? waitingPair[0] : (free.length ? pick(free) : null);
    if (spot){ spot.by = a.id; a.copa = spot; a.path = planPath(a, {x:spot.x, z:spot.z}, 'open', floor); a.yawEnd = spot.yaw; return; }
  }
  const s = idleFor(a.R)[a.idleSpot]; a.spot = s; a.path = planPath(a, {x:a.R.ox+s.x, z:a.R.oz+s.z}, s.via, a.R.f); a.yawEnd = s.yaw;
}
function setState(a, s){
  const prev = a.state; a.state = s; dirty = true;
  if (s === 'idle') goIdle(a);
  else if (prev === 'idle' || a.copa || a.spot || a.f !== a.R.f) goSeat(a);
}
function bizOnDone(a){
  if (a.kind === 'workana'){ BIZ.workana.propostas++; if (Math.random() < .4) BIZ.workana.respostas++; }
  if (a.kind === 'funnel'){ const ks = Object.keys(BIZ.funnel); const k = irand(0, ks.length - 2); if (BIZ.funnel[ks[k]] > 0){ BIZ.funnel[ks[k]]--; BIZ.funnel[ks[k+1]]++; } }
  if (a.kind === 'direct'){ BIZ.workana.contratos++; BIZ.bell++; ringBell(); toast('Contrato fechado! O sino tocou no Comercial'); }
  if (a.kind === 'prospect') BIZ.funnel.Novo += irand(2,6);
  if (a.kind === 'social'){ const s = BIZ.social[a.R.brand]; const d = s.semana.indexOf(0); if (d >= 0) s.semana[d] = 1; s.seguidores += irand(3,20); s.alcance += irand(200,1200); }
  if (a.kind === 'ads'){ BIZ.ads.leads += irand(0,2); BIZ.ads.cliques += irand(10,40); BIZ.ads.gasto += rand(1,4); }
}
function step(a, now){
  if (a.real || now < a.next) return; // agente real: o estado vem do agente local
  const R = a.R;
  if (a.state === 'idle'){
    if (Math.random() < .18){
      const opts = a.prompts.filter(x => x !== a.prompt); a.prompt = pick(opts.length ? opts : a.prompts);
      a.since = now; a.tool = 'Pensando'; a.target = 'lendo o contexto'; useTokens(a,[4e3,12e3],[200,600]);
      emit(a,'prompt','"' + a.prompt + '"'); setState(a,'working'); a.next = now + rand(1500,3000);
    } else a.next = now + rand(5000,11000);
    return;
  }
  if (a.state === 'waiting'){ if (now - a.waitSince > 55000) resolvePermission(a, true, true); else a.next = now + 1000; return; }
  if (a.state === 'error'){ if (a.kind === 'code'){ a.tool = 'Edit'; a.target = pick(R.files); useTokens(a,[3e3,9e3],[400,1500]); emit(a,'tool', a.target + ' (correção)', TOOL_PT.Edit); } else actionFor(a); setState(a,'working'); a.next = now + rand(1600,3500); return; }
  if (a.path.length || a.ride){ a.next = now + 600; return; }
  const r = Math.random(), slow = a.kind === 'code' ? 1 : 1.5;
  if (r < .022 && a.waits.length){ a.waitCmd = pick(a.waits); a.tool = 'Permissão'; a.target = a.waitCmd; a.waitSince = now; emit(a,'wait','Pede permissão: ' + a.waitCmd); setState(a,'waiting'); }
  else if (r < .065 && a.errs.length){ a.errMsg = pick(a.errs); if (a.kind === 'code'){ a.tool = 'Bash'; a.target = pick(R.cmds); } emit(a,'err','Falhou: ' + a.errMsg); setState(a,'error'); }
  else if (r < .12 && now - a.since > 25000){
    a.tool = ''; a.target = ''; R.done++; R.todo = Math.max(0, R.todo - 1); if (R.todo < 2) R.todo += irand(1,3);
    a.tasksDone++; a.xp += 25; COMPANY.tasks++; COMPANY.xp += 25; bizOnDone(a);
    const lvBefore = levelOf(a.xp - 25); emit(a,'done','Tarefa concluída'); if (levelOf(a.xp) > lvBefore) toast(`${a.name} (${a.R.name}) subiu para o nível ${levelOf(a.xp)}`);
    checkAchievements(); setState(a,'idle');
  } else actionFor(a);
  a.next = now + rand(1400,4200)*slow;
}
function resolvePermission(a, ok, auto){
  if (a && a.real) return realPermission(a, ok);
  if (!a || a.state !== 'waiting') return;
  if (ok){ emit(a,'done',(auto ? 'Aprovado por regra automática: ' : 'Você permitiu: ') + a.waitCmd, 'Aprovado'); a.tool = 'Executando'; a.target = a.waitCmd; if (!auto){ toast('Permitido: ' + a.waitCmd); COMPANY.perms++; a.xp += 5; checkAchievements(); } }
  else { emit(a,'err','Você negou: ' + a.waitCmd, 'Negado'); a.tool = 'Pensando'; a.target = 'buscando outro caminho'; toast('Negado. O agente vai buscar outro caminho.'); }
  setState(a,'working'); a.next = performance.now() + rand(1500,3000);
}
function assignTask(a, text){
  if (a.real) return realAssignTask(a, text);
  releaseSpot(a);
  a.prompt = text; a.since = performance.now(); a.tool = 'Pensando'; a.target = 'lendo o contexto';
  emit(a,'prompt','"' + text + '"');
  a.state = 'idle'; setState(a, 'working'); a.next = performance.now() + 2500;
  toast(`Tarefa enviada para ${a.name} · ${a.R.name}`);
}

/* suggestions */
let SUGG = [];
const SEV = {alerta:{label:'Alerta', c:'#FF6B5E', o:0}, economia:{label:'Economia', c:'#F5B935', o:1}, oportunidade:{label:'Oportunidade', c:'#5BD69E', o:2}};
function computeSuggestions(now){
  const out = [];
  for (const a of AGENTS.filter(x => x.state === 'waiting')) out.push({sev:'alerta', short:'Liberar ' + a.R.name, title:`${a.R.name} parado esperando você`,
    body:`O agente ${a.name} pediu para ${a.kind === 'code' ? 'executar' : ''} "${a.waitCmd}" há ${fmtSpan(now - a.waitSince)}. Se esse tipo de ação é segura, crie uma regra de permissão e ele não para mais aqui.`,
    acts:[{label:'Permitir agora', act:'allow', arg:a.id, primary:true},{label:'Ver agente', act:'agent', arg:a.id}]});
  for (const a of AGENTS.filter(x => x.state === 'error')) out.push({sev:'alerta', short:'Erro ' + a.R.name, title:`${a.R.name}: ${a.errMsg}`, body:'O agente já está tentando corrigir. Se falhar de novo, vale olhar antes de deixar ele seguir gastando.', acts:[{label:'Ver agente', act:'agent', arg:a.id}]});
  for (const R of ROOMS.filter(R => R.budget)){
    const spent = roomCost(R)*CAMBIO, pct = spent / R.budget;
    if (pct > 1) out.push({sev:'alerta', short:'Orçamento ' + short(R.name, 12), title:`${R.name} passou do orçamento do dia`, body:`Já são ${brl(spent, 2)} de ${brl(R.budget)} previstos. Confira se o escopo mudou ou se algum agente está em loop.`, acts:[{label:'Abrir sala', act:'room', arg:R.i}]});
    else if (pct > .8) out.push({sev:'economia', short:'Orçamento ' + short(R.name, 12), title:`${R.name} em ${Math.round(pct*100)}% do orçamento do dia`, body:`São ${brl(spent, 2)} de ${brl(R.budget)}. Se ainda tiver tarefa pesada hoje, passe os subagentes para o Haiku.`, acts:[{label:'Abrir sala', act:'room', arg:R.i}]});
  }
  const cs = PLAN.claude.meters[0], ci = cs ? meterInfo(cs) : {};
  if (cs && ci.over) out.push({sev:'alerta', short:'Sessão Claude', title:'A sessão do Claude vai acabar antes do reset', body:`Está em ${Math.round(cs.used)}% e reinicia em ${fmtSpan(cs.reset - Date.now())}. Passe os subagentes de testes e docs para o Haiku até lá.`, acts:[{label:'Ver planos', act:'tab', arg:'planos'}]});
  const claudeAgents = AGENTS.filter(a => a.prov === 'claude'), claudeCost = claudeAgents.reduce((s,a) => s + a.cost, 0), opus = claudeAgents.filter(a => (a.family || a.model) === 'Opus');
  const opusShare = opus.reduce((s,a) => s + a.cost, 0) / (claudeCost || 1);
  if (opusShare > .5) out.push({sev:'economia', short:`Opus ${Math.round(opusShare*100)}%`, title:`O Opus responde por ${Math.round(opusShare*100)}% do uso do Claude`, body:`As sessões de ${[...new Set(opus.map(a => a.R.name))].join(', ')} rodam no Opus. No Max 20x isso não vira conta extra, mas come a sessão mais rápido. Build, testes e ajustes rodam bem no Sonnet.`, acts:[{label:'Ver operação', act:'tab', arg:'operacao'}]});
  const w = BIZ.workana; // Workana e funil ainda são simulados: só sugerem no modo simulado
  if (!REAL && w.respostas / Math.max(1, w.propostas) < .3) out.push({sev:'oportunidade', short:'Taxa de resposta', title:`Workana: ${w.respostas} respostas em ${w.propostas} propostas hoje`, body:'A taxa está abaixo de 30%. Vale o agente de Triagem filtrar só projetos com orçamento definido e cliente com histórico, e a proposta abrir citando um projeto parecido que você já entregou.', acts:[{label:'Abrir Workana', act:'room', arg:roomAt(2,0).i}]});
  if (!REAL && BIZ.funnel.Negociação >= 3) out.push({sev:'oportunidade', short:'Negociações', title:`${BIZ.funnel.Negociação} leads em negociação`, body:'Mande o agente de Follow-up priorizar esses antes dos novos. É onde está o dinheiro mais perto de entrar.', acts:[{label:'Abrir funil', act:'room', arg:roomAt(2,1).i}]});
  const idle = AGENTS.filter(a => a.state === 'idle' && a.kind === 'code');
  if (cs && idle.length >= 2 && cs.used < 55) out.push({sev:'oportunidade', short:'Capacidade livre', title:`${idle.length} devs parados e ${Math.round(100-cs.used)}% da sessão livre`, body:`${idle.map(a => a.R.name + ' (' + a.name + ')').join(', ')} estão na convivência. Dá para puxar o próximo item do backlog antes do reset em ${fmtSpan(cs.reset - Date.now())}.`, acts:[{label:'Mandar tarefa', act:'agent', arg:idle[0].id}]});
  const hi = creditInfo(PLAN.higgs.credit);
  if (PLAN.higgs.credit && !hi.short && hi.leftover > PLAN.higgs.credit.total*.2) out.push({sev:'oportunidade', short:'Higgsfield sobra', title:`Higgsfield: ~${num(hi.leftover)} créditos devem sobrar`, body:`Renova em ${PLAN.higgs.credit.daysLeft} dias. Use nos carrosséis da EDevsHub ou nos vídeos do Revix.`, acts:[{label:'Ver planos', act:'tab', arg:'planos'}]});
  const el = creditInfo(PLAN.eleven.credit);
  if (el.short) out.push({sev:'alerta', short:'ElevenLabs acaba', title:`ElevenLabs Starter acaba em ~${Math.max(1,Math.round(el.runout))} dias`, body:`Restam ${num(PLAN.eleven.credit.left)} créditos e renova em ${PLAN.eleven.credit.daysLeft} dias. Deixe as URAs para depois da renovação ou suba de plano só neste mês.`, acts:[{label:'Ver planos', act:'tab', arg:'planos'}]});
  const gw = PLAN.gpt.meters.find(m => /semanal/i.test(m.label)) || PLAN.gpt.meters[1], gi = gw ? meterInfo(gw) : {};
  if (gw && gw.used < 35 && gi.elapsed > .3) out.push({sev:'economia', short:'Codex sobrando', title:`ChatGPT 5x em ${Math.round(gw.used)}% na semana`, body:`São ${brl(PLAN.gpt.brl)} por mês com bastante Codex sobrando. Coloque o Codex para revisar os PRs no QA em paralelo.`, acts:[{label:'Ver planos', act:'tab', arg:'planos'}]});
  return out.sort((x,y) => SEV[x.sev].o - SEV[y.sev].o);
}
