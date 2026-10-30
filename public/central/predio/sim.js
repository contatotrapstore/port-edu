// Central de Agentes · prédio 3D — sim.js
// Estado comum dos agentes, caminhos pelo prédio, marcos do dia e sugestões.
// Scripts clássicos: as constantes de nível superior são compartilhadas entre os arquivos, na ordem de carga do index.html.
/* agents */
const SKINS = ['#E8C6A3','#C69467','#8E5B3B','#F0D2B6','#A9734C'];
const HAIR = ['#1A1412','#3B2A1E','#6B4A2E','#C9A46A','#2B2B2B','#7A3B2A'];
// Os bonecos vêm do agente local ou da nuvem (fonte.js cria, atualiza e remove)
const AGENTS = [];
let dirty = true;
const FEED = [];
const COMPANY = {tasks:0, unlocked:[], perms:0};
ROOMS.forEach(R => R.agents = []);
const roomCost = R => R.base + R.agents.reduce((s,a) => s + a.cost, 0);
// O total vem da soma por sala do agente (uma sessão que muda de pasta não conta duas vezes)
const totalCost = () => window.EDH_DAY_TOTAL != null ? window.EDH_DAY_TOTAL : ROOMS.reduce((s,R) => s + roomCost(R), 0);
// Séries de 7 dias: zeradas até o agente mandar os custos (fonte.js → atualizarSeries)
ROOMS.forEach(R => { R.hist = new Array(7).fill(0); });
const totalHist = new Array(7).fill(0);

/* marcos do dia (estante de troféus da Diretoria) */
const ACHIEVEMENTS = [
  {id:'t60', label:'60 tarefas no dia', test:() => COMPANY.tasks >= 60},
  {id:'t80', label:'80 tarefas no dia', test:() => COMPANY.tasks >= 80},
  {id:'t120', label:'120 tarefas no dia', test:() => COMPANY.tasks >= 120},
  {id:'perm', label:'10 permissões liberadas', test:() => COMPANY.perms >= 10},
];
const MARCOS_KEY = 'edh-marcos-' + new Date().toDateString();
try { COMPANY.unlocked = JSON.parse(localStorage.getItem(MARCOS_KEY) || '[]'); } catch { /* sem armazenamento */ }
function checkAchievements(){
  for (const A of ACHIEVEMENTS){ if (!COMPANY.unlocked.includes(A.id) && A.test()){ COMPANY.unlocked.push(A.id); try { localStorage.setItem(MARCOS_KEY, JSON.stringify(COMPANY.unlocked)); } catch {} dirty = true; } }
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
// Permitir/Negar no painel: responde ao pedido real (agente local ou nuvem, fonte.js)
function resolvePermission(a, ok){ if (a) return realPermission(a, ok); }

/* suggestions */
let SUGG = [];
const SEV = {alerta:{label:'Alerta', c:'#FF6B5E', o:0}, economia:{label:'Economia', c:'#F5B935', o:1}, oportunidade:{label:'Oportunidade', c:'#5BD69E', o:2}};
function computeSuggestions(now){
  const out = [];
  for (const a of AGENTS.filter(x => x.state === 'waiting')) out.push({sev:'alerta', short:'Liberar ' + a.R.name, title:`${a.R.name} parado esperando você`,
    body:`O agente ${a.name} pediu para ${a.kind === 'code' ? 'executar' : ''} "${a.waitCmd}" há ${fmtSpan(now - a.waitSince)}. Se esse tipo de ação é segura, crie uma regra de permissão e ele não para mais aqui.`,
    acts:[{label:'Permitir agora', act:'allow', arg:a.id, primary:true},{label:'Ver agente', act:'agent', arg:a.id}]});
  for (const a of AGENTS.filter(x => x.state === 'error')) out.push({sev:'alerta', short:'Erro ' + a.R.name, title:`${a.R.name}: ${a.errMsg}`, body: 'Veja o erro no painel do agente ou no terminal da sessão antes de deixar ele seguir gastando.', acts:[{label:'Ver agente', act:'agent', arg:a.id}]});
  for (const R of ROOMS.filter(R => R.budget)){
    const spent = roomCost(R)*CAMBIO, pct = spent / R.budget;
    if (pct > 1) out.push({sev:'alerta', short:'Orçamento ' + short(R.name, 12), title:`${R.name} passou do orçamento do dia`, body:`Já são ${brl(spent, 2)} de ${brl(R.budget)} previstos. Confira se o escopo mudou ou se algum agente está em loop.`, acts:[{label:'Abrir sala', act:'room', arg:R.i}]});
    else if (pct > .8) out.push({sev:'economia', short:'Orçamento ' + short(R.name, 12), title:`${R.name} em ${Math.round(pct*100)}% do orçamento do dia`, body:`São ${brl(spent, 2)} de ${brl(R.budget)}. Se ainda tiver tarefa pesada hoje, passe os subagentes para o Haiku.`, acts:[{label:'Abrir sala', act:'room', arg:R.i}]});
  }
  const cs = PLAN.claude.meters[0], ci = cs ? meterInfo(cs) : {};
  if (cs && ci.over) out.push({sev:'alerta', short:'Sessão Claude', title:'A sessão do Claude vai acabar antes do reset', body:`Está em ${Math.round(cs.used)}% e reinicia em ${fmtSpan(cs.reset - Date.now())}. Segure as tarefas pesadas ou delegue ao Codex até lá.`, acts:[{label:'Ver planos', act:'tab', arg:'planos'}]});
  const claudeAgents = AGENTS.filter(a => a.prov === 'claude'), claudeCost = claudeAgents.reduce((s,a) => s + a.cost, 0), opus = claudeAgents.filter(a => (a.family || a.model) === 'Opus');
  const opusShare = opus.reduce((s,a) => s + a.cost, 0) / (claudeCost || 1);
  if (opusShare > .5) out.push({sev:'economia', short:`Opus ${Math.round(opusShare*100)}%`, title:`O Opus responde por ${Math.round(opusShare*100)}% do uso do Claude`, body:`As sessões de ${[...new Set(opus.map(a => a.R.name))].join(', ')} rodam no Opus. No Max 20x isso não vira conta extra, mas come a sessão mais rápido. Build, testes e ajustes rodam bem no Sonnet.`, acts:[{label:'Ver operação', act:'tab', arg:'operacao'}]});
  const hi = creditInfo(PLAN.higgs.credit);
  if (PLAN.higgs.credit && !hi.short && hi.leftover > PLAN.higgs.credit.total*.2) out.push({sev:'oportunidade', short:'Higgsfield sobra', title:`Higgsfield: ~${num(hi.leftover)} créditos devem sobrar`, body:`Renova em ${PLAN.higgs.credit.daysLeft} dias. Use nos carrosséis da EDevsHub ou nos vídeos do Revix.`, acts:[{label:'Ver planos', act:'tab', arg:'planos'}]});
  const el = creditInfo(PLAN.eleven.credit);
  if (el.short) out.push({sev:'alerta', short:'ElevenLabs acaba', title:`ElevenLabs Starter acaba em ~${Math.max(1,Math.round(el.runout))} dias`, body:`Restam ${num(PLAN.eleven.credit.left)} créditos e renova em ${PLAN.eleven.credit.daysLeft} dias. Deixe as URAs para depois da renovação ou suba de plano só neste mês.`, acts:[{label:'Ver planos', act:'tab', arg:'planos'}]});
  const gw = PLAN.gpt.meters.find(m => /semanal/i.test(m.label)) || PLAN.gpt.meters[1], gi = gw ? meterInfo(gw) : {};
  if (gw && gw.used < 35 && gi.elapsed > .3) out.push({sev:'economia', short:'Codex sobrando', title:`${PLAN.gpt.name} ${String(PLAN.gpt.tierBase || PLAN.gpt.tier).split(' ·')[0]} em ${Math.round(gw.used)}% na semana`, body:`São ${brl(PLAN.gpt.brl)} por mês com bastante Codex sobrando. Delegue revisões e investigações ao Codex (aba Agente → Delegar ao Codex).`, acts:[{label:'Ver planos', act:'tab', arg:'planos'}]});
  const ti = ROOMS.find(R => R.type === 'infra');
  for (const d of window.EDH_DEPLOYS || []){ const e = (d.producao && d.producao.estado) || d.estado;
    if (['ERROR', 'BLOCKED'].includes(e)) out.push({sev:'alerta', short:'Deploy ' + d.projeto, title:`${d.projeto}: deploy de produção ${e === 'ERROR' ? 'com erro' : 'bloqueado'}`, body:`Na Vercel, o último deploy de produção de ${d.projeto} (${d.sala}) está ${e === 'ERROR' ? 'com erro' : 'bloqueado'}. O site pode estar desatualizado.`, acts: ti ? [{label:'Abrir TI', act:'room', arg:ti.i}] : []}); }
  const fb = ROOMS.find(R => R.fallback);
  if (fb && !NUVEM) for (const proj of [...new Set(fb.agents.map(a => a.proj).filter(p => p && p !== fb.name))]) out.push({sev:'oportunidade', short:'Pasta ' + proj, title:`A pasta "${proj}" está sem sala`, body:'As sessões dessa pasta caem em Projetos avulsos. Crie uma sala para separar custo, tarefas e o histórico do projeto.', acts:[{label:'Criar sala', act:'novaSala', arg:proj, primary:true}]});
  if (window.EDH_CONTENT){
    const studio = ROOMS.find(R => R.type === 'studio');
    for (const m of window.EDH_CONTENT.marcas || []){
      const arroba = '@' + (m.instagram || m.marca), acts = studio ? [{label:'Abrir estúdio', act:'room', arg:studio.i}] : [];
      if (m.erroPublicador || (m.saudeInstagram && m.saudeInstagram !== 'verified')) out.push({sev:'alerta', short:'Instagram ' + arroba, title:`${arroba}: publicação automática com problema`, body: m.erroPublicador ? 'O publicador do Content Studio registrou erro. Os próximos posts podem não sair; confira em /admin.' : `A conexão com o Instagram está "${m.saudeInstagram}". Reconecte no Content Studio.`, acts});
      if (m.emRevisao > 0) out.push({sev:'oportunidade', short:`${m.emRevisao} posts p/ aprovar`, title:`${arroba}: ${m.emRevisao} posts esperando sua aprovação`, body:`Com ${m.agendados} já agendados. Aprovar agora mantém a fila cheia${m.proximos && m.proximos[0] ? '; o próximo sai ' + m.proximos[0].quando : ''}.`, acts});
      if (m.publicacao && m.agendados === 0) out.push({sev:'alerta', short:'Fila vazia ' + arroba, title:`${arroba} sem nenhum post agendado`, body:'A publicação está ligada, mas a fila acabou. Gere ou aprove posts no Content Studio.', acts});
    }
  }
  return out.sort((x,y) => SEV[x.sev].o - SEV[y.sev].o);
}
