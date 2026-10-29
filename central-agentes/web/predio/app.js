// Central de Agentes · prédio 3D — app.js
// Laço de animação e inicialização.
// Scripts clássicos: as constantes de nível superior são compartilhadas entre os arquivos, na ordem de carga do index.html.

/* loop */
const clock = new THREE.Clock();
let accScreen = 0, accWall = 0, lastPanel = 0, lastHist = performance.now(), lastSnap = 0, lastLightCheck = 0;
function frame(){
  const dt = Math.min(.05, clock.getDelta()), now = performance.now(); T += dt;
  for (const a of AGENTS){
    step(a, now);
    if (a.ride){ a.ride.t = Math.min(1, a.ride.t + dt/2.4); cabTarget = a.ride.t; cab.position.y = FLOORS[a.ride.from].y + (FLOORS[a.ride.to].y - FLOORS[a.ride.from].y)*(a.ride.t < .5 ? 2*a.ride.t*a.ride.t : 1 - Math.pow(-2*a.ride.t + 2, 2)/2); if (a.ride.t >= 1){ a.f = a.ride.to; a.ride = null; } }
    else if (a.path.length){
      const p = a.path[0];
      if (p.elev !== undefined){ a.path.shift(); if (p.elev !== a.f){ a.ride = {from:a.f, to:p.elev, t:0}; a.walkYaw = Math.PI; } }
      else { const dx = p.x - a.pos.x, dz = p.z - a.pos.z, d = Math.hypot(dx, dz), sp = 2.0*dt;
        if (RM || d <= sp){ a.pos.x = p.x; a.pos.z = p.z; a.path.shift(); if (!a.path.length) dirty = true; }
        else { a.pos.x += dx/d*sp; a.pos.z += dz/d*sp; a.walkYaw = Math.atan2(dx, dz); } }
    }
  }
  if (!AGENTS.some(x => x.ride)) cab.position.y += (FLOORS[view.floor].y - cab.position.y) * Math.min(1, dt*2);
  const replaying = replayIdx >= 0 && SNAPS[replayIdx];
  AGENTS.forEach(a => pose(a, dt, replaying ? SNAPS[replayIdx].s[a.id] || null : null));
  if (REAL) poseGhosts(dt, replaying);
  poseDudu(); DUDU.body.ring.material.color.set(AMBER);
  for (const a of AGENTS){ const sn = replaying && SNAPS[replayIdx].s[a.id], st = sn ? sn.state : a.state; a.body.ring.material.color.set(ST[st]); a.body.ring.material.opacity = a === selected ? .95 : .45; a.body.ring.scale.setScalar(a === selected ? 1.15 + (RM ? 0 : Math.sin(T*4)*.05) : 1); }
  for (const R of ROOMS){
    if (!view.building && R.f !== view.floor) continue;
    if (R.ceo) setDesk(R.ceo, 'boss', R);
    (R.desks || []).forEach((d, i) => { if (!d) return; const a = R.agents.find(x => (R.type === 'reception' ? 1 : x.desk) === i); const st = !a ? 'empty' : (a.state !== 'idle' && a.f === R.f && !a.path.length && !a.copa && !a.spot && !a.ride) ? a.state : 'idle'; setDesk(d, st, R); });
    const w = R.agents.length ? worstState(R) : 'idle', pulse = RM ? .5 : .5 + .5*Math.sin(T*3.2);
    if (w === 'error' || w === 'waiting'){ R.tint.material.color.set(ST[w]); R.tint.material.opacity = .03 + .05*pulse; } else R.tint.material.opacity = 0;
    // sala acesa com gente trabalhando, meia-luz quando vazia
    if (REAL && R.light){ const alvo = R.agents.some(a => a.state !== 'idle') ? 2.3 : .55; R.light.intensity += (alvo - R.light.intensity) * Math.min(1, dt*2); }
    if (R.onAir){ const on = R.agents.some(a => a.kind === 'eleven' && a.state === 'working' && !a.path.length && !a.copa && !a.spot); R.onAir.color.set(on ? '#FF5A4E' : '#3A2422'); }
  }
  if (bellG){ if (bellRing.t > 0){ bellRing.t -= dt; bellG.rotation.z = Math.sin(T*18) * .35 * Math.min(1, bellRing.t); } else bellG.rotation.z = 0; }
  // screens
  accScreen += dt; accWall += dt;
  if (accScreen > .22){ accScreen = 0; tick++; redraw(SCREENS.working); redraw(SCREENS.working2); if (tick % 3 === 0){ redraw(SCREENS.doc); redraw(SCREENS.social); redraw(arcadeTex); } if (tick % 5 === 0){ redraw(SCREENS.boss); redraw(clockTex); const inf = ROOMS.find(R => R.rackTex); if (inf && (view.building || view.floor === inf.f)) redraw(inf.rackTex); } }
  if (accWall > 2){ accWall = 0; ROOMS.forEach(R => { if (!view.building && R.f !== view.floor) return; [R.big, R.status, R.board].forEach(t => t && redraw(t)); if (R.tvs) R.tvs.forEach(redraw); }); if (OPEN_GROUPS.screens && (view.building || view.floor === 0)) OPEN_GROUPS.screens.forEach(redraw); if (OPEN_GROUPS.goal && (view.building || view.floor === 2)) redraw(OPEN_GROUPS.goal); if (OPEN_GROUPS.daily && (view.building || view.floor === 1)) redraw(OPEN_GROUPS.daily); }
  if (now - lastHist > 4000){ lastHist = now; ROOMS.forEach(R => { R.hist.push(roomCost(R)); if (R.hist.length > 30) R.hist.shift(); }); totalHist.push(totalCost()); if (totalHist.length > 30) totalHist.shift(); }
  if (now - lastSnap > 2000){ lastSnap = now; snapshot(); }
  if (now - lastLightCheck > 30000){ lastLightCheck = now; if (lightMode === 'auto'){ applyLight(); if (view.building) hemi.intensity += .35; } }
  // TV mode cycles floors
  if (document.body.classList.contains('tv')){ tvTimer += dt; if (tvTimer > 24){ tvTimer = 0; if (view.building) setView(0, false); else if (view.floor < 3) setView(view.floor + 1, false); else setView(0, true); } }
  // camera
  if (fly){ fly.k = Math.min(1, fly.k + dt/1.0); const e = 1 - Math.pow(1 - fly.k, 3); camera.position.lerpVectors(fly.p0, fly.p1, e); controls.target.lerpVectors(fly.t0, fly.t1, e); if (fly.k >= 1) fly = null; }
  if (Math.abs(rotQueue) > 1e-4){ const rs = RM ? rotQueue : rotQueue * Math.min(1, dt*6); rotQueue -= rs; const off = camera.position.clone().sub(controls.target); off.applyAxisAngle(new THREE.Vector3(0,1,0), rs); camera.position.copy(controls.target).add(off); }
  if (keys.size){
    const fwd = controls.target.clone().sub(camera.position); fwd.y = 0; fwd.normalize(); const right = new THREE.Vector3().crossVectors(fwd, new THREE.Vector3(0,1,0));
    const sp = camera.position.distanceTo(controls.target) * dt * .9, mv = new THREE.Vector3();
    if (keys.has('w') || keys.has('arrowup')) mv.add(fwd); if (keys.has('s') || keys.has('arrowdown')) mv.sub(fwd);
    if (keys.has('d') || keys.has('arrowright')) mv.add(right); if (keys.has('a') || keys.has('arrowleft')) mv.sub(right);
    mv.multiplyScalar(sp); camera.position.add(mv); controls.target.add(mv);
  }
  if (follow && selected && !replaying){ const g = selected.body.g, tg = V(g.position.x, g.position.y + .8, g.position.z), delta = tg.sub(controls.target).multiplyScalar(Math.min(1, dt*3)); controls.target.add(delta); camera.position.add(delta); }
  controls.target.x = clamp(controls.target.x, -4, WW + 6); controls.target.z = clamp(controls.target.z, -4, WD + PLAZA + 3); controls.target.y = clamp(controls.target.y, 0, EXPL*3 + 2);
  controls.update();
  for (const s of WALLSETS){ if (!view.building && s.f !== view.floor) continue; tmpV.copy(camera.position); tmpV.y = 0; tmpV.sub(s.center); const facing = tmpV.x*s.normal.x + tmpV.z*s.normal.z > 0; s.tall.visible = !facing; s.low.visible = facing; }
  renderer.render(scene, camera);
  updateLabels(now, replaying || null);
  if (dirty || now - lastPanel > 1000){ renderPanel(now); lastPanel = now; dirty = false; }
  requestAnimationFrame(frame);
}
applyLight();
setTab('planos');
setView(0, false);
resize();
{ const [p, t] = presetFor(null); camera.position.copy(p); controls.target.copy(t); fly = null; }
loadingEl.remove();
if (REAL) startReal();
requestAnimationFrame(frame);
