// Central de Agentes · prédio 3D — ui.js
// Câmera, seleção, painel lateral, rótulos e replay.
// Scripts clássicos: as constantes de nível superior são compartilhadas entre os arquivos, na ordem de carga do index.html.

/* camera, floors and views */
const stage = $('stage');
const V = (x,y,z) => new THREE.Vector3(x,y,z);
let view = {floor:0, building:false}, focus = null, follow = false, fly = null, rotQueue = 0, touched = false;
function fitDist(r){ const v = THREE.MathUtils.degToRad(camera.fov)/2, h = Math.atan(Math.tan(v) * camera.aspect); return r / Math.sin(Math.min(v, h)) * .92; }
function presetFor(f){
  const fy = view.building ? 0 : FLOORS[view.floor].y;
  if (view.building){ const t = V(WW/2 + 1, EXPL*1.5, (WD + PLAZA)/2); return [t.clone().add(V(.42, .42, .8).normalize().multiplyScalar(fitDist(Math.hypot(WW/2 + 3, EXPL*2.1)) * 1.05)), t]; }
  if (f === null){ const t = V(WW/2 + 1, fy, (WD + PLAZA)/2); return [t.clone().add(V(.36, .68, .8).normalize().multiplyScalar(fitDist(Math.hypot(WW/2 + 2, (WD+PLAZA)/2)*.82))), t]; }
  if (f === 'copa'){ const zz = view.floor === 0 ? WD + 1 : 14, xx = view.floor === 0 ? 17 : view.floor === 3 ? 18 : 40; const t = V(xx, fy + .6, zz); return [t.clone().add(V(.3, .6, .8).normalize().multiplyScalar(Math.max(13, fitDist(9)))), t]; }
  const R = ROOMS[f], t = V(R.ox + RW/2, fy + .6, R.oz + RD/2 - .4);
  return [t.clone().add(V(.45, .62, .7).normalize().multiplyScalar(Math.max(11, fitDist(6.4)))), t];
}
function flyTo(pos, target){ fly = {p0: camera.position.clone(), t0: controls.target.clone(), p1: pos, t1: target, k: 0}; }
function updateTitles(){
  $('floorName').textContent = view.building ? 'Prédio' : FLOORS[view.floor].short + ' · ' + FLOORS[view.floor].name;
  $('roomName').textContent = view.building ? 'todos os andares' : focus === null ? 'visão do andar' : focus === 'copa' ? 'convivência' : ROOMS[focus].name;
  dirty = true;
}
function setView(floor, building){
  view.floor = floor; view.building = !!building; focus = null;
  FLOORS.forEach(F => { F.g.visible = view.building || F.i === view.floor; F.y = F.i * (view.building ? EXPL : FH); F.g.position.y = F.y; });
  pillars.visible = false; shaft.visible = view.building; shaft.scale.y = view.building ? EXPL/FH : 1;
  ROOM_LIGHTS.forEach(l => { l.visible = !view.building; });
  hemi.intensity = view.building ? Math.max(hemi.intensity, .7) : hemi.intensity; lastDay = -1; applyLight(); if (view.building) hemi.intensity += .35;
  const fy = view.building ? EXPL*1.5 : FLOORS[floor].y;
  sun.target.position.set(WW/2, fy, 12); sun.position.set(WW/2 - 20, fy + 34, 36);
  const [p, t] = presetFor(null); flyTo(p, t); updateTitles(); renderFloors();
}
function goFocus(f){ focus = f; follow = false; syncFollow(); const [p, t] = presetFor(f); flyTo(p, t); updateTitles(); }
function goRoom(i){ const R = ROOMS[i]; if (view.building || view.floor !== R.f) setView(R.f, false); goFocus(i); }
function goAgent(a){ if (view.building || view.floor !== a.f) setView(a.f, false); selected = a; follow = true; syncFollow(); }
controls.addEventListener('start', () => { touched = true; fly = null; if (follow){ follow = false; syncFollow(); } });
function resize(){
  const r = stage.getBoundingClientRect();
  renderer.setSize(r.width, r.height, false); camera.aspect = r.width / Math.max(1, r.height); camera.updateProjectionMatrix();
  if (!touched && focus === null && !fly){ const [p, t] = presetFor(null); camera.position.copy(p); controls.target.copy(t); }
}
new ResizeObserver(resize).observe(stage);
function zoomBy(f){ const off = camera.position.clone().sub(controls.target); off.setLength(clamp(off.length() / f, controls.minDistance, controls.maxDistance)); flyTo(controls.target.clone().add(off), controls.target.clone()); }
function rotateBy(dir){ rotQueue += dir * Math.PI/2; fly = null; }
function renderFloors(){
  const counts = FLOORS.map(F => { const ag = AGENTS.filter(a => a.f === F.i); return {w: ag.filter(a => a.state === 'waiting').length, e: ag.filter(a => a.state === 'error').length, n: ag.length}; });
  const html = [...FLOORS].reverse().map(F => { const c = counts[F.i], col = c.e ? 'var(--err)' : c.w ? 'var(--wait)' : 'var(--ok)';
    return `<button class="fbtn ${!view.building && view.floor === F.i ? 'on' : ''}" type="button" data-act="floor" data-arg="${F.i}" title="${esc(F.desc)}"><small>${F.short}</small><span>${esc(F.name)}</span><i style="background:${col}"></i></button>`; }).join('')
    + `<button class="fbtn ${view.building ? 'on' : ''}" type="button" data-act="building" title="Ver o prédio inteiro (B)"><small>▦</small><span>Prédio</span></button>`;
  setHTML($('floors'), html);
}

/* picking */
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
let downAt = null;
renderer.domElement.addEventListener('pointerdown', e => { downAt = {x:e.clientX, y:e.clientY}; });
renderer.domElement.addEventListener('pointerup', e => {
  if (!downAt || Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 8) return;
  const r = renderer.domElement.getBoundingClientRect();
  ndc.set((e.clientX - r.left)/r.width*2 - 1, -(e.clientY - r.top)/r.height*2 + 1);
  ray.setFromCamera(ndc, camera);
  const vis = a => view.building || a.f === view.floor;
  const people = AGENTS.filter(vis).map(a => a.body.g).concat(vis(DUDU) ? [DUDU.body.g] : []);
  const hit = ray.intersectObjects(people, true)[0];
  if (hit){ const root = hit.object.userData.agentRoot; if (root === DUDU.body.g) onSelect(DUDU); else { const a = AGENTS.find(x => x.body.g === root); if (a) onSelect(a); } return; }
  const floors = PICK_FLOORS.filter(m => view.building || m.userData.f === view.floor).concat(PLATFORM_TOPS.filter(m => view.building || m.userData.f === view.floor));
  const fh = ray.intersectObjects(floors, false)[0];
  if (!fh) return;
  const fl = fh.object.userData.f;
  if (view.building){ setView(fl, false); return; }
  if (fh.object.userData.room !== undefined){ if (focus !== fh.object.userData.room) goFocus(fh.object.userData.room); }
  else if (focus !== 'copa') goFocus('copa');
});
function onSelect(a){
  if (a === DUDU){ setTab('planos'); openDrawer(); toast('Seus planos e consumo'); return; }
  selected = a; a.pop = 1; setTab('agente'); openDrawer(); dirty = true;
}

/* UI */
let selected = AGENTS.find(a => a.state === 'waiting') || AGENTS[0] || null;
const agentBy = id => AGENTS.find(a => a.id === id);
let tab = 'planos', toastTimer = 0, tvTimer = 0;
function toast(msg){ const t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600); }
function syncFollow(){ $('btnFollow').classList.toggle('on', follow); }
function openDrawer(){ if (document.body.classList.contains('immersive') && !document.body.classList.contains('tv')) document.body.classList.add('drawer'); }
function toggleDrawer(){ if (document.body.classList.contains('immersive')) document.body.classList.toggle('drawer'); }
function toggleImmersive(force){
  const on = force ?? !document.body.classList.contains('immersive');
  document.body.classList.toggle('immersive', on); if (!on){ document.body.classList.remove('drawer'); document.body.classList.remove('tv'); controls.autoRotate = false; }
  $('immLabel').textContent = on ? 'Sair' : 'Tela cheia';
  try { if (on && !document.fullscreenElement && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
        if (!on && document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {}); } catch (err) {}
}
function toggleTV(){
  const on = !document.body.classList.contains('tv');
  if (on){ toggleImmersive(true); document.body.classList.add('tv'); document.body.classList.remove('drawer'); controls.autoRotate = true; tvTimer = 0; toast('Modo TV: troca de andar sozinho. Esc ou o botão no canto para sair'); }
  else { document.body.classList.remove('tv'); controls.autoRotate = false; toggleImmersive(false); }
}
document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && document.body.classList.contains('immersive')) toggleImmersive(false); });
function nextWaiting(){
  const w = AGENTS.filter(x => x.state === 'waiting'); if (!w.length){ toast('Ninguém esperando você agora'); return; }
  const a = w[(w.indexOf(selected)+1) % w.length]; a.pop = 1; goAgent(a); setTab('agente'); openDrawer(); dirty = true;
}
const keys = new Set();
window.addEventListener('keydown', e => {
  if (e.target.closest && e.target.closest('input,textarea')) return;
  const k = e.key.toLowerCase();
  if (['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(k)){ keys.add(k); fly = null; follow = false; syncFollow(); e.preventDefault(); return; }
  if (k === 'q') rotateBy(-1); else if (k === 'b' && view.building) setView(view.floor, false); else if (k === 'e') rotateBy(1);
  else if (k === '+' || k === '=') zoomBy(1.3); else if (k === '-') zoomBy(1/1.3);
  else if (k === ']' || k === 'pageup') setView(Math.min(3, view.building ? 3 : view.floor + 1), false);
  else if (k === '[' || k === 'pagedown') setView(Math.max(0, view.building ? 0 : view.floor - 1), false);
  else if (k === 'b') setView(view.floor, true);
  else if (k === '0' || k === 'c') centerView();
  else if (k >= '1' && k <= '8'){ const list = ROOMS.filter(R => R.f === view.floor).sort((x,y) => x.slot - y.slot); const R = list[+k - 1]; if (R) goRoom(R.i); }
  else if (k === '9') goFocus('copa');
  else if (k === 'r') toggleReplay();
  else if (k === 'f'){ follow = !follow; syncFollow(); } else if (k === 't') toggleImmersive(); else if (k === 'p') toggleDrawer(); else if (k === 'n') nextWaiting(); else if (k === 'v') toggleTV();
  else if (k === 'escape'){ if (document.body.classList.contains('tv')) toggleTV(); else if (document.body.classList.contains('immersive')) toggleImmersive(false); }
});
window.addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));

let lastHTML = {};
function setHTML(el, html){ if (lastHTML[el.id] !== html){ el.innerHTML = html; lastHTML[el.id] = html; } }
function setTab(t){ tab = t; dirty = true; agentShell = null; document.querySelectorAll('.tab').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === t))); $('pane').scrollTop = 0; }
function logItems(list, withWho){
  return list.map(e => {
    const mid = withWho ? `<span class="who">${esc(short(e.kind === 'xp' ? 'Empresa' : e.a.R.name,13))}</span>` : `<span class="t ${e.kind}">${esc(e.tag)}</span>`;
    const txt = withWho ? `<span class="x"><span class="t ${e.kind}">${esc(e.tag)}</span> · ${esc(e.text)}</span>` : `<span class="x">${esc(e.text)}</span>`;
    return `<li><time>${fmtTime(e.t)}</time>${mid}${txt}</li>`;
  }).join('');
}
const barColor = p => p > 85 ? 'var(--err)' : p > 60 ? 'var(--amber)' : 'var(--ok)';
function resetText(ts){ const ms = ts - Date.now(); if (ms < 24*3600e3) return 'Reinicia em ' + fmtSpan(ms); const d = new Date(ts); return 'Reinicia ' + d.toLocaleDateString('pt-BR',{weekday:'short'}) + ', às ' + d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}); }
const planPrice = p => p.brl == null ? 'a confirmar' : (p.approx ? '~' : '') + brl(p.brl);
const subsTotal = () => PLANS.reduce((s,p) => s + (p.brl || 0), 0);
function renderPlans(){
  let html = awayCard() + `<div class="card"><div class="sec"><h2>Assinaturas</h2><small>${brl(subsTotal())}/mês${REAL ? '' : ' + Higgsfield'}</small></div><p class="note">O traço branco em cada barra marca quanto da janela já passou. Barra à frente do traço significa ritmo acima do plano.</p></div>`;
  for (const p of PLANS){
    html += `<div class="card"><div class="plan-head">${brandIcon(p.id, 36) || `<span class="mono" style="--c:${p.color}">${p.mono}</span>`}<div><b>${esc(p.name)}</b><small>Plano ${esc(p.tier)}</small></div><div class="plan-cost">${planPrice(p)}<small class="note">por mês</small></div></div>`;
    if (p.meters){
      if (!p.meters.length) html += `<p class="note">${esc(p.sourceNote || 'Aguardando leitura.')}</p>`;
      for (const m of p.meters){ const info = meterInfo(m), used = Math.round(m.used);
        html += `<div class="meter"><div class="m-top"><span>${esc(m.label)}</span><small>${resetText(m.reset)}</small></div><div class="mbar"><i style="width:${clamp(m.used,0,100).toFixed(1)}%;background:${barColor(m.used)}"></i><b style="left:calc(${(info.elapsed*100).toFixed(1)}% - 1px)"></b></div><div class="m-foot">${used}% usado · ${100-used}% restante</div><div class="m-proj ${info.cls}">${esc(info.proj)}</div></div>`; }
      const sess = AGENTS.filter(a => a.prov === p.prov);
      html += `<ul class="sessions">${sess.slice(0,6).map(a => `<li><i style="background:${ST[a.state]}"></i><span>${esc(a.R.name)} · ${esc(a.name)}</span><em>${a.model}</em></li>`).join('')}${sess.length > 6 ? `<li><span style="color:var(--muted)">e mais ${sess.length-6}</span></li>` : ''}</ul>`;
    } else {
      if (!p.credit || !p.credit.total){ html +=`<p class="note">${esc(p.sourceNote || 'Sem fonte de dados ainda.')}</p></div>`; continue; }
      const c = p.credit, info = creditInfo(c), used = c.total - c.left;
      html += `<div class="meter"><div class="m-top"><span>Créditos do ciclo</span><small>Renova em ${c.daysLeft} dias</small></div><div class="mbar"><i style="width:${info.usedPct.toFixed(1)}%;background:${barColor(info.usedPct)}"></i><b style="left:calc(${(info.elapsed*100).toFixed(1)}% - 1px)"></b></div><div class="m-foot">${num(used)} usados · ${num(c.left)} de ${num(c.total)} restantes</div><div class="m-proj ${info.cls}">${esc(info.proj)}</div></div>
        <div class="meter"><div class="m-top"><span>Uso no ciclo</span><small>~${num(info.rate)} por dia</small></div><div class="m-foot">${Object.entries(c.mix).map(([k,v]) => `${esc(k)}: ${num(v)}`).join(' · ')}</div></div>`;
      const sess = AGENTS.filter(a => a.prov === p.prov);
      if (sess.length) html += `<ul class="sessions">${sess.map(a => `<li><i style="background:${ST[a.state]}"></i><span>${esc(a.name)} · ${esc(short(a.prompt, 38))}</span><em>${num(a.units)}</em></li>`).join('')}</ul>`;
    }
    html += `</div>`;
  }
  return html + `<p class="note" style="padding:0 4px 6px">${REAL ? 'Preços dos planos do config.json. Uso do Claude e do Codex pelo Codenotch (ou pelas sessões do Codex); ElevenLabs pela API; Higgsfield manual.' : 'Preços dos planos informados por você. Uso e saldos simulados (protótipo).'}</p>`;
}
function renderSuggestions(){
  if (!SUGG.length) return `<div class="card"><p class="note">Nada pedindo atenção agora. As sugestões aparecem aqui quando um plano acelera, um agente trava, um projeto passa do orçamento ou sobra crédito.</p></div>`;
  return SUGG.map(s => `<div class="sug" style="--c:${SEV[s.sev].c}"><span class="sev">${SEV[s.sev].label}</span><h3>${esc(s.title)}</h3><p>${esc(s.body)}</p><div style="display:flex;gap:6px;flex-wrap:wrap">${s.acts.map(a => `<button class="act ${a.primary?'primary':''}" type="button" data-act="${a.act}" data-arg="${a.arg}">${esc(a.label)}</button>`).join('')}</div></div>`).join('');
}
function whereText(a){
  if (a.ride) return 'no elevador';
  if (a.path.length) return a.state === 'idle' ? (a.copa ? 'indo para a convivência' : 'caminhando') : 'voltando pra mesa';
  if (a.copa) return COPA_LABEL[a.copa.kind].toLowerCase() + (a.copa.f !== a.R.f ? ' no ' + FLOORS[a.copa.f].name.toLowerCase() : '');
  if (a.spot) return a.spot.pose === 'sofa' ? 'no sofá' : a.spot.pose === 'bean' ? 'no puff' : a.spot.pose === 'chair' ? 'na mesa de reunião' : 'olhando o quadro';
  return '';
}
let agentShell = null;
function permButtons(a){
  if (!a.real || a.pendingId) return `<div class="row"><button class="allow" type="button" data-act="allow" data-arg="${a.id}">Permitir</button><button type="button" data-act="deny" data-arg="${a.id}">Negar</button></div>`;
  return `<p class="note" style="margin-top:8px">${esc(a.permNote || 'Responda no terminal.')}</p>`;
}
function renderAgentTab(now){
  const pane = $('pane'), a = selected;
  if (!a){ agentShell = null; setHTML(pane, '<div class="card"><p class="note">Nenhum agente selecionado. Toque num boneco no prédio ou numa sessão na aba Planos.</p></div>'); return; }
  if (agentShell !== a){
    agentShell = a; lastHTML.agDyn = lastHTML.agLog = null;
    pane.innerHTML = `<div id="agDyn"></div>
      ${a.real && !NUVEM ? workCard(a) : `<div class="card task"><span class="k">Mandar tarefa para ${esc(a.name)}</span><textarea id="taskText" placeholder="Ex.: ${esc(a.prompts[0] || 'Descreva a próxima tarefa')}"></textarea>
        <div class="row"><small>${a.real ? 'Não dá para escrever numa sessão aberta: o texto vai para a área de transferência. Cole no terminal de ' + esc(a.proj || a.R.name) + '.' : 'O agente sai da convivência e volta pra mesa.'}</small><button class="btn solid" type="button" data-act="sendTask">${a.real ? 'Copiar' : 'Enviar'}</button></div></div>`}
      <div class="card"><div class="sec"><h2>Chat ao vivo</h2><small id="agCount"></small></div><ul class="log" id="agLog"></ul></div>`;
    lastHTML.pane = null;
  }
  const st = a.state, credits = a.kind === 'higgs' || a.kind === 'eleven', wt = whereText(a), lv = levelOf(a.xp), into = a.xp % 100;
  let html = `<div class="card"><div class="ag-head"><span class="swatch" style="background:linear-gradient(180deg, ${a.hair} 0 18%, ${a.skin} 18% 42%, ${a.color} 42% 100%)"></span><div style="min-width:0"><div class="ag-name">${esc(a.name)}</div><div class="ag-proj">${esc(a.proj && a.proj !== a.R.name ? a.R.name + ' · ' + a.proj : a.R.name)} · ${esc(FLOORS[a.R.f].name)}</div></div><span class="model">${a.model}</span></div>
    <span class="pill s-${st}"><i></i>${ST_LABEL[st]}${wt ? ' · ' + wt : ''}</span>`;
  if (st === 'waiting') html += `<div class="perm"><span class="k" style="color:var(--wait)">Pedindo permissão há ${fmtDur(now - a.waitSince)}</span>Quer ${a.kind === 'code' ? 'executar' : 'fazer'}:<code>${esc(a.waitCmd)}</code>${permButtons(a)}</div>`;
  else if (st === 'error') html += `<div class="now"><span class="k" style="color:var(--err)">Erro</span><code style="color:var(--err)">${esc(a.target)} → ${esc(a.errMsg)}</code></div>`;
  else if (st === 'working') html += `<div class="now"><span class="k">Agora</span><code>${esc(TOOL_PT[a.tool] || a.tool)} · ${esc(a.target)}</code></div>`;
  html += `<div class="prompt"><span class="k">${st === 'idle' ? 'Último prompt' : 'Prompt em andamento'}</span><p>${esc(a.prompt)}</p></div>
    <div class="ag-actions"><button class="btn" type="button" data-act="followSel">${follow ? 'Parar de seguir' : 'Seguir no escritório'}</button>${st === 'idle' && !a.real ? `<button class="btn" type="button" data-act="wake" data-arg="${a.id}">Chamar pra mesa</button>` : ''}</div>
    <div class="stats"><div class="stat"><span>Custo equivalente</span><b>${brlFromUsd(a.cost)}</b></div><div class="stat"><span>${st === 'idle' ? 'Parado há' : 'Na tarefa'}</span><b>${fmtDur(now - a.since)}</b></div>
      <div class="stat"><span>${credits ? 'Créditos usados' : 'Tokens entrada'}</span><b>${credits ? num(a.units) : fmtTok(a.tin)}</b></div><div class="stat"><span>Nível ${lv} · ${a.tasksDone} tarefas</span><b>${num(a.xp)} XP</b><div class="xpbar"><i style="width:${into}%"></i></div></div></div></div>`;
  setHTML($('agDyn'), html);
  setHTML($('agLog'), logItems(a.log.slice(0,12), false));
  $('agCount').textContent = a.log.length + ' eventos';
}
const worstState = R => R.agents.some(x => x.state==='error') ? 'error' : R.agents.some(x => x.state==='waiting') ? 'waiting' : R.agents.some(x => x.state==='working') ? 'working' : 'idle';
function renderOps(){
  let html = `<div class="card"><div class="sec"><h2>Salas por andar</h2><small>consumo · orçamento</small></div><div class="projects">`;
  for (const F of [...FLOORS].reverse()){
    const rooms = ROOMS.filter(R => R.f === F.i && (R.agents.length || R.base > 0));
    html += `<div class="fl-h">${F.short} · ${esc(F.name)}</div>`;
    for (const R of rooms){ const w = worstState(R), c = roomCost(R)*CAMBIO, pct = R.budget ? c / R.budget : 0;
      html += `<button class="prow ${focus===R.i?'on':''}" type="button" data-act="room" data-arg="${R.i}"><span class="dot" style="background:${ST[w]};box-shadow:0 0 8px ${ST[w]}"></span><span style="min-width:0"><span class="pn">${esc(R.name)}</span><br><span class="ps">${esc(R.stack)} · ${R.agents.length} agente${R.agents.length !== 1 ? 's' : ''} · ${R.done} concluídas</span></span><span class="pc">${brl(c, 2)}${R.budget ? `<small>de ${brl(R.budget)}/dia</small>` : ''}</span>${R.budget ? `<span class="bar"><i class="${pct > 1 ? 'over' : ''}" style="width:${Math.min(100, pct*100).toFixed(1)}%"></i></span>` : ''}</button>`; }
  }
  html += `</div></div>` + orquestraCard() + costReport();
  const un = ACHIEVEMENTS.filter(A => COMPANY.unlocked.includes(A.id));
  html += `<div class="card"><div class="sec"><h2>Conquistas</h2><small>nível ${companyLevel()} · ${num(COMPANY.xp)} XP</small></div>${un.length ? `<div class="trophies">${un.map(A => `<span class="trophy"><b>★</b>${esc(A.label)}</span>`).join('')}</div>` : '<p class="note">Nenhuma ainda hoje. Elas aparecem na estante de troféus da Diretoria.</p>'}
    <p class="note" style="margin-top:8px">Top agentes: ${[...AGENTS].sort((x,y) => y.xp - x.xp).slice(0,3).map(a => `${esc(a.name)} (${esc(a.R.name)}) nível ${levelOf(a.xp)}`).join(' · ')}</p></div>`;
  html += `<div class="card"><div class="sec"><h2>Atividade ao vivo</h2><small>${FEED.length} eventos</small></div><ul class="log">${logItems(FEED.slice(0,18), true)}</ul></div>`;
  return html;
}
function renderPanel(now){
  SUGG = computeSuggestions(now);
  $('sugCount').textContent = SUGG.length;
  if (tab === 'agente') renderAgentTab(now);
  else { agentShell = null; setHTML($('pane'), tab === 'planos' ? renderPlans() : tab === 'sugestoes' ? renderSuggestions() : renderOps()); }
  $('kSpend').textContent = brlFromUsd(totalCost());
  $('kSubs').innerHTML = `${brl(subsTotal())} <small>/mês</small>`;
  const worstPlan = PLANS.filter(p => p.meters ? p.meters.length : p.credit && p.credit.total).map(p => p.meters ? [p.name, Math.max(...p.meters.map(m => m.used))] : [p.name, (p.credit.total-p.credit.left)/p.credit.total*100]).sort((a,b) => b[1]-a[1])[0];
  $('kSubsSub').textContent = `${PLANS.length} planos${worstPlan ? ` · mais usado: ${worstPlan[0]} ${Math.round(worstPlan[1])}%` : ''}`;
  $('kLevel').textContent = 'Nível ' + companyLevel();
  $('kXp').textContent = `${num(COMPANY.xp)} XP · ${COMPANY.tasks} tarefas hoje`;
  const working = AGENTS.filter(x => x.state==='working').length, waiting = AGENTS.filter(x => x.state==='waiting').length, errors = AGENTS.filter(x => x.state==='error').length;
  setHTML($('chips'), `<span class="chip"><i style="background:var(--ok)"></i>Trabalhando <b>${working}</b></span><button class="chip ${waiting?'alert':''}" type="button" data-act="next-wait"><i style="background:var(--wait)"></i>Precisam de você <b>${waiting}</b></button><span class="chip"><i style="background:var(--err)"></i>Erros <b>${errors}</b></span><button class="chip" type="button" data-act="tab" data-arg="sugestoes"><i style="background:var(--amber)"></i>Sugestões <b>${SUGG.length}</b></button>`);
  setHTML($('miniHud'), `<div><span>Consumo hoje</span><b>${brlFromUsd(totalCost())}</b></div><div><span>Sessão Claude</span><b>${PLAN.claude.meters[0] ? Math.round(PLAN.claude.meters[0].used) + '%' : '—'}</b></div><div><span>Precisam de você</span><b style="color:${waiting ? 'var(--wait)' : 'var(--fg)'}">${waiting}</b></div><div><span>Tarefas hoje</span><b>${COMPANY.tasks}</b></div>`);
  const h = totalHist, mn = Math.min(...h), mx = Math.max(...h);
  const pts = h.map((v,k) => `${(k*(110/(h.length-1))).toFixed(1)},${(29 - (v-mn)/((mx-mn)||1)*25).toFixed(1)}`).join(' ');
  setHTML($('spark'), `<polygon points="0,32 ${pts} 110,32" fill="rgba(245,185,53,.12)"/><polyline points="${pts}" fill="none" stroke="#F5B935" stroke-width="1.6"/>`);
  renderFloors();
  TROPHIES.forEach((t, i) => t.visible = i < COMPANY.unlocked.length);
}
document.addEventListener('click', e => {
  const t = e.target.closest('.tab'); if (t){ setTab(t.dataset.tab); return; }
  const b = e.target.closest('[data-act]'); if (!b) return;
  const act = b.dataset.act, arg = b.dataset.arg;
  if (act === 'allow'){ const a = agentBy(+arg); if (!a) return; selected = a; resolvePermission(a, true, false); }
  if (act === 'deny') resolvePermission(agentBy(+arg), false, false);
  if (act === 'agent'){ const a = agentBy(+arg); if (!a) return; a.pop = 1; goAgent(a); setTab('agente'); }
  if (act === 'tab') setTab(arg);
  if (act === 'costp') costPeriod = +arg;
  if (act === 'away') realToggleAway(arg === '1');
  if (act === 'room') goRoom(+arg);
  if (act === 'copa') goFocus('copa');
  if (act === 'floor') setView(+arg, false);
  if (act === 'building') setView(view.floor, true);
  if (act === 'next-wait') nextWaiting();
  if (act === 'rot') rotateBy(+arg);
  if (act === 'zoom') zoomBy(+arg > 0 ? 1.35 : 1/1.35);
  if (act === 'follow' || act === 'followSel'){ follow = !follow; syncFollow(); if (follow && selected && (view.building || view.floor !== selected.f)) setView(selected.f, false); }
  if (act === 'immersive') toggleImmersive();
  if (act === 'drawer') toggleDrawer();
  if (act === 'tv') toggleTV();
  if (act === 'light'){ lightMode = lightMode === 'auto' ? 'day' : lightMode === 'day' ? 'night' : 'auto'; $('lightLbl').textContent = {auto:'Hora real', day:'Dia', night:'Noite'}[lightMode]; lastDay = -1; applyLight(); if (view.building) hemi.intensity += .35; }
  if (act === 'wake'){ const a = agentBy(+arg); if (a && a.state === 'idle') assignTask(a, pick(a.prompts)); }
  if (act === 'delegar' || act === 'fluxo' || act === 'sessao'){ if (selected) realTrabalho(act, arg, selected); return; }
  if (act === 'sendTask'){ if (!selected) return; const ta = $('taskText'), v = ta && ta.value.trim(); if (!v){ toast('Escreva a tarefa antes de enviar'); return; } assignTask(selected, v); ta.value = ''; }
  if (act === 'live') goLive();
  if (act === 'replay') toggleReplay();
  if (act === 'center') centerView();
  dirty = true;
});

/* labels */
const tmpV = new THREE.Vector3();
function agentLabel(a, compact){
  const tp = TOOL_PT[a.tool] || a.tool;
  if (a.ride) return compact ? 'Elevador' : 'No elevador · ' + a.name;
  if (a.path.length && a.state !== 'idle') return compact ? 'Voltando' : 'Voltando pra mesa · ' + a.name;
  if (a.state === 'waiting') return compact ? 'Aguardando' : 'Precisa de você · ' + short(a.waitCmd, 24);
  if (a.state === 'error') return compact ? 'Erro' : 'Erro · ' + short(a.errMsg, 26);
  if (a.state === 'idle'){
    if (a.path.length) return compact ? 'Caminhando' : 'Caminhando · ' + a.name;
    if (a.copa){ const w = COPA_LABEL[a.copa.kind].split(' '); return compact ? (/^(na|no)$/i.test(w[0]) ? w.slice(0, 2).join(' ') : w[0]) : COPA_LABEL[a.copa.kind] + ' · ' + a.name; }
    return compact ? 'Ocioso' : 'Ocioso · ' + a.name;
  }
  return compact ? tp : tp + ' · ' + short(base(a.target || ''), 22);
}
function updateLabels(now, replaying){
  const r = stage.getBoundingClientRect(), w = r.width, h = r.height;
  for (const a of AGENTS.concat([DUDU])){
    const g = a.body.g, lab = a.lab;
    const onView = view.building || a.f === view.floor || (a.ride && (a.ride.to === view.floor || a.ride.from === view.floor));
    const st = a === DUDU ? 'boss' : a.state;
    const showB = view.building ? (st === 'waiting' || st === 'error') : onView;
    g.visible = !!(view.building || onView) && !(replaying && a !== DUDU && !replaying.s[a.id]);   // no replay, some quem ainda não existia
    if (!showB || replaying){ lab.el.style.display = 'none'; continue; }
    tmpV.set(g.position.x, g.position.y + 2.0, g.position.z).project(camera);
    if (tmpV.z > 1 || tmpV.x < -1.2 || tmpV.x > 1.2 || tmpV.y < -1.2 || tmpV.y > 1.2){ lab.el.style.display = 'none'; continue; }
    lab.el.style.display = 'flex';
    const dist = camera.position.distanceTo(g.position), compact = dist > 26 || view.building;
    const col = ST[st], txt = a === DUDU ? (compact ? 'Você' : 'Você · Dudu') : agentLabel(a, compact);
    const lv = a === DUDU || compact ? '' : `<span class="lv">Nv ${levelOf(a.xp)}</span>`;
    const html = `<i></i>${esc(txt)}${lv}${st === 'waiting' ? '<span class="bang">!</span>' : ''}`;
    if (lab.pill.dataset.h !== html){ lab.pill.innerHTML = html; lab.pill.dataset.h = html; }
    lab.el.style.setProperty('--c', col);
    lab.el.classList.toggle('sel', a === selected); lab.el.classList.toggle('dim', st === 'idle');
    const showBubble = a.bubble && a.bubble.until > now && dist < 16 && !view.building;
    if (showBubble){ if (lab.bubble.textContent !== a.bubble.text) lab.bubble.textContent = a.bubble.text; lab.bubble.hidden = false; } else if (!lab.bubble.hidden) lab.bubble.hidden = true;
    lab.el.style.transform = `translate(${((tmpV.x*.5 + .5)*w).toFixed(1)}px, ${((-tmpV.y*.5 + .5)*h).toFixed(1)}px) translate(-50%, -100%)`;
    lab.el.style.zIndex = String(2000 - Math.round(dist*10));
    lab.el.style.opacity = dist > 60 ? .6 : 1;
  }
}

/* replay */
const SNAPS = [];
const SNAP_MAX = REAL ? 6000 : 900;   // no modo real o replay também carrega o histórico do agente (fonte.js)
let replayIdx = -1;
const scrub = $('scrub');
function snapshot(){
  // por id: no modo real os bonecos entram e saem, então a posição na lista muda
  SNAPS.push({t: Date.now(), s: Object.fromEntries(AGENTS.map(a => [a.id, {f:a.f, x:a.pos.x, z:a.pos.z, state:a.state, where: whereOf(a) === 'ride' ? 'stand' : whereOf(a), yaw: a.body.g.rotation.y}]))});
  if (SNAPS.length > SNAP_MAX) SNAPS.shift();
  scrub.max = String(SNAPS.length - 1); if (replayIdx < 0) scrub.value = scrub.max;
}
scrub.addEventListener('input', () => {
  const i = +scrub.value;
  if (i >= SNAPS.length - 1){ goLive(); return; }
  replayIdx = i; $('replay').classList.add('past'); $('liveLbl').textContent = 'Voltar ao vivo';
  const d = new Date(SNAPS[i].t); $('scrubTime').textContent = d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
});
// A linha do tempo continua gravando em segundo plano; a barra só aparece quando você pede
// Volta a câmera para ver o andar inteiro (ou o prédio, na visão do prédio) e para de seguir agente
function centerView(){
  follow = false; syncFollow(); keys.clear(); rotQueue = 0; touched = false;
  if (view.building) setView(view.floor, true); else goFocus(null);
}
function toggleReplay(force){
  const el = $('replay'), on = force ?? el.hidden;
  el.hidden = !on; $('btnReplay').classList.toggle('on', on);
  if (!on) goLive();
}
function goLive(){ replayIdx = -1; $('replay').classList.remove('past'); $('liveLbl').textContent = 'Ao vivo'; $('scrubTime').textContent = 'agora'; scrub.value = scrub.max; }
