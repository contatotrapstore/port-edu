// Central de Agentes · prédio 3D — cena.js
// Cena 3D: materiais, salas, área aberta, luz e bonecos.
// Scripts clássicos: as constantes de nível superior são compartilhadas entre os arquivos, na ordem de carga do index.html.

/* =============================== 3D =============================== */
renderer.setPixelRatio(Math.min(MOBILE ? 1.5 : 2, window.devicePixelRatio || 1));
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = .95;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
const NIGHT_BG = new THREE.Color('#0B1210'), DAY_BG = new THREE.Color('#48635A');
scene.background = NIGHT_BG.clone();
scene.fog = new THREE.Fog('#0B1210', 60, 140);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new THREE.RoomEnvironment(), .04).texture;
const camera = new THREE.PerspectiveCamera(MOBILE ? 46 : 36, 1, .1, 300);
const controls = new THREE.MapControls(camera, renderer.domElement);
Object.assign(controls, {enableDamping:true, dampingFactor:.08, screenSpacePanning:false, maxPolarAngle:Math.PI/2.25, minPolarAngle:.2, minDistance:3.5, maxDistance:120, zoomSpeed:1.1, rotateSpeed:.7, autoRotateSpeed:.45});
const ENV = .28;
const font = (w, s) => `${w} ${s}px "Instrument Sans", sans-serif`;
function mat(color, o = {}){
  const p = {color, roughness: o.r ?? .7, metalness: o.m ?? 0, envMapIntensity: (o.env ?? .5) * ENV};
  if (o.e){ p.emissive = new THREE.Color(o.e); p.emissiveIntensity = o.ei ?? 1; }
  if (o.map) p.map = o.map;
  if (o.t){ p.transparent = true; p.opacity = o.o ?? .5; p.depthWrite = false; }
  if (o.side) p.side = o.side;
  if (o.flat) p.flatShading = true;
  return new THREE.MeshStandardMaterial(p);
}
const GEO = new Map();
const geo = (key, make) => { if (!GEO.has(key)) GEO.set(key, make()); return GEO.get(key); };
function add(parent, g, m, x = 0, y = 0, z = 0, o = {}){
  const mesh = new THREE.Mesh(g, m); mesh.position.set(x, y, z);
  mesh.castShadow = o.cast ?? true; mesh.receiveShadow = o.recv ?? true;
  if (o.ry) mesh.rotation.y = o.ry; if (o.rx) mesh.rotation.x = o.rx; if (o.rz) mesh.rotation.z = o.rz;
  if (o.dyn) mesh.userData.dyn = true;
  parent.add(mesh); return mesh;
}
const box = (p, w, h, d, m, x, y, z, o) => add(p, geo(`b${w},${h},${d}`, () => new THREE.BoxGeometry(w, h, d)), m, x, y, z, o);
const rbox = (p, w, h, d, r, m, x, y, z, o) => add(p, geo(`r${w},${h},${d},${r}`, () => new THREE.RoundedBoxGeometry(w, h, d, 3, r)), m, x, y, z, o);
const cyl = (p, rt, rb, h, m, x, y, z, o) => add(p, geo(`c${rt},${rb},${h},${o?.seg||20}`, () => new THREE.CylinderGeometry(rt, rb, h, o?.seg || 20)), m, x, y, z, o);
const sph = (p, r, m, x, y, z, o) => add(p, geo(`s${r}`, () => new THREE.SphereGeometry(r, 16, 12)), m, x, y, z, o);
const plane = (p, w, h, m, x, y, z, ry, o) => add(p, geo(`p${w},${h}`, () => new THREE.PlaneGeometry(w, h)), m, x, y, z, Object.assign({ry, cast:false}, o));
function canvasTex(w, h, draw){
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'); draw(g, w, h);
  const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  t.userData = {c, g, draw}; return t;
}
function redraw(t){ t.userData.draw(t.userData.g, t.userData.c.width, t.userData.c.height); t.needsUpdate = true; }
const screenMat = tex => new THREE.MeshBasicMaterial({map: tex, toneMapped: false});
function rr(g, x, y, w, h, r){ g.beginPath(); if (g.roundRect) g.roundRect(x, y, w, h, r); else g.rect(x, y, w, h); }
function mergeStatic(group){
  group.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(group.matrixWorld).invert(), buckets = new Map(), kill = [];
  group.traverse(o => {
    if (!o.isMesh || o.isInstancedMesh || o.userData.dyn || Array.isArray(o.material)) return;
    for (let p = o.parent; p && p !== group; p = p.parent) if (p.userData.dyn) return;
    let gg = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
    for (const k of Object.keys(gg.attributes)) if (!['position','normal','uv'].includes(k)) gg.deleteAttribute(k);
    if (!gg.attributes.uv) gg.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(gg.attributes.position.count*2), 2));
    if (!gg.attributes.normal) gg.computeVertexNormals();
    gg.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld));
    const key = o.material.uuid + '|' + o.castShadow;
    if (!buckets.has(key)) buckets.set(key, {m:o.material, cast:o.castShadow, list:[]});
    buckets.get(key).list.push(gg); kill.push(o);
  });
  kill.forEach(o => o.parent.remove(o));
  for (const {m, cast, list} of buckets.values()){ const merged = THREE.BufferGeometryUtils.mergeBufferGeometries(list, false); if (!merged) continue; const mesh = new THREE.Mesh(merged, m); mesh.castShadow = cast; mesh.receiveShadow = true; group.add(mesh); }
}
const M = {
  woodDesk: mat('#A8682C', {r:.55, env:.4}), woodDark: mat('#5A3B22', {r:.6}), woodShelf: mat('#6B4A2E', {r:.7}),
  white: mat('#D9D3C4', {r:.5}), charcoal: mat('#2B302D', {r:.8}), steel: mat('#9EA3A0', {r:.25, m:.9, env:1}),
  chrome: mat('#E5E7E6', {r:.12, m:1, env:1.6}), black: mat('#141917', {r:.45, m:.3}), bezel: mat('#151a18', {r:.35, m:.2}),
  matGreen: mat('#3E5A44', {r:.95}), keys: mat('#C9C6BE', {r:.6}), wall: mat('#1A2621', {r:.92, env:.3}), base: mat('#2A2119', {r:.8}),
  neon: new THREE.MeshBasicMaterial({color:'#FFC54D', toneMapped:false}), neonDim: new THREE.MeshBasicMaterial({color:'#8A6820', toneMapped:false}),
  glass: mat('#9FC2B4', {r:.05, m:.1, t:true, o:.12, env:1.4}), pot: mat('#C9BFA8', {r:.7}), soil: mat('#2B2119'),
  leaf: mat('#2F7A4E', {r:.6, flat:true}), leaf2: mat('#3E955F', {r:.6, flat:true}), sofa: mat('#3E5A44', {r:.9, env:.3}),
  leather: mat('#9C5E2B', {r:.55, env:.6}), cushion: mat('#B06C34', {r:.6}), rug: mat('#26332C', {r:1}), mug: mat('#EDE6D6', {r:.4}),
  headset: mat('#1B201E', {r:.4}), gold: mat('#E0B347', {r:.25, m:1, env:1.6}), brass: mat('#C9A04A', {r:.3, m:1, env:1.4}),
  slab: mat('#0E1613', {r:.9}), pillar: mat('#1A2621', {r:.8}),
  // porta, janela e fachada
  doorGlass: mat('#A9CFC0', {r:.04, m:.1, t:true, o:.22, env:1.8}), windowGlass: mat('#CFE6DD', {r:.02, m:.2, t:true, o:.1, env:2.2}),
  frame: mat('#20262A', {r:.35, m:.6, env:.8}), sill: mat('#CFC6B2', {r:.55}), blind: mat('#D8D1C1', {r:.95, side:THREE.DoubleSide}), blindSlat: mat('#B9B1A0', {r:.8}),
};
const BOOK_COLORS = ['#8C3B2E','#C79A3E','#3E5A44','#2F4C66','#D9D3C4','#A8682C'].map(c => mat(c, {r:.8}));

function planks(base){
  const t = canvasTex(1024, 1024, (g, w, h) => {
    const rows = 10, rh = h/rows;
    for (let r=0;r<rows;r++){
      let x = (r*173) % 260 - 260;
      while (x < w){ const len = 260 + ((r*37 + x) % 140), shade = ((r*53 + Math.floor(x)) % 7)/7;
        g.fillStyle = `hsl(${24 + shade*6}, ${38 + shade*8}%, ${base + shade*5}%)`; g.fillRect(x, r*rh, len, rh);
        g.strokeStyle = 'rgba(0,0,0,.08)'; g.lineWidth = 1;
        for (let k=0;k<6;k++){ g.beginPath(); const yy = r*rh + 8 + k*rh/6; g.moveTo(x, yy); g.bezierCurveTo(x+len*.3, yy+3, x+len*.6, yy-3, x+len, yy+1); g.stroke(); }
        g.fillStyle = 'rgba(0,0,0,.5)'; g.fillRect(x, r*rh, 2, rh); x += len; }
      g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(0, r*rh, w, 2);
    }
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2.4, 2); return t;
}
const FLOOR_MAT = new THREE.MeshStandardMaterial({map: planks(17), roughness:.55, envMapIntensity:.22});
const FLOOR_MAT_DIR = new THREE.MeshStandardMaterial({map: planks(21), roughness:.5, envMapIntensity:.22});
const concrete = canvasTex(512, 512, (g, w, h) => {
  g.fillStyle = '#121C18'; g.fillRect(0,0,w,h);
  for (let i=0;i<5000;i++){ g.fillStyle = `rgba(${Math.random()<.5?255:0},${Math.random()<.5?255:0},${Math.random()<.5?255:0},${Math.random()*.035})`; g.fillRect(Math.random()*w, Math.random()*h, 2, 2); }
  g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 2; g.strokeRect(0,0,w,h);
});
concrete.wrapS = concrete.wrapT = THREE.RepeatWrapping;
function cityDraw(day){
  return (c, w, h) => {
    const sky = c.createLinearGradient(0,0,0,h);
    if (day){ sky.addColorStop(0,'#8EC1E0'); sky.addColorStop(1,'#D8E6E0'); } else { sky.addColorStop(0,'#0E2230'); sky.addColorStop(1,'#132A24'); }
    c.fillStyle = sky; c.fillRect(0,0,w,h);
    c.fillStyle = day ? 'rgba(255,248,220,.9)' : 'rgba(237,230,214,.8)'; c.beginPath(); c.arc(420, 40, 14, 0, 7); c.fill();
    let x = 0, seed = 7; const rnd = () => (seed = (seed*9301 + 49297) % 233280) / 233280;
    while (x < w){ const bw = 20 + rnd()*46, bh = 40 + rnd()*140; c.fillStyle = day ? '#7D8E8A' : '#0A1210'; c.fillRect(x, h-bh, bw, bh);
      for (let i=0;i<10;i++){ c.fillStyle = day ? 'rgba(220,235,240,.6)' : (rnd()<.7 ? 'rgba(245,185,53,.75)' : 'rgba(127,214,207,.7)'); c.fillRect(x + 3 + rnd()*(bw-8), h - bh + 4 + rnd()*(bh-10), 2.5, 2.5); }
      x += bw + 3; }
  };
}
const cityTex = canvasTex(512, 200, cityDraw(false));
const CITY = screenMat(cityTex);

let tick = 0;
function codeDraw(accent, bg, seed){
  return (g, w, h) => {
    g.fillStyle = bg; g.fillRect(0,0,w,h); g.fillStyle = 'rgba(255,255,255,.04)'; g.fillRect(0,0,w,18);
    for (let k=0;k<3;k++){ g.fillStyle = ['#FF6B5E','#FFD84A','#5BD69E'][k]; g.beginPath(); g.arc(10 + k*10, 9, 3, 0, 7); g.fill(); }
    for (let i=0;i<13;i++){ const n = (i + tick + seed) % 17, ind = (n*7) % 4, len = 30 + ((n*53) % 150);
      g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(6, 26 + i*9.5, 12, 4);
      g.fillStyle = n % 5 === 0 ? '#F5B935' : n % 3 === 0 ? '#9EC5E8' : accent; g.globalAlpha = .85; g.fillRect(24 + ind*10, 26 + i*9.5, len, 4); g.globalAlpha = 1; }
  };
}
function docDraw(bg, accent){
  return (g, w, h) => {
    g.fillStyle = bg; g.fillRect(0,0,w,h); g.fillStyle = '#EDE6D6'; g.fillRect(30, 14, w-60, h-14);
    g.fillStyle = accent; g.fillRect(44, 26, 90, 8);
    for (let i=0;i<9;i++){ const n = (i + tick) % 11; g.fillStyle = 'rgba(30,30,30,.45)'; g.fillRect(44, 44 + i*10, 60 + ((n*41) % 110), 4); }
  };
}
const SCREENS = {
  working: canvasTex(256, 150, codeDraw('#5BD69E', '#0E241C', 0)),
  working2: canvasTex(256, 150, codeDraw('#8FD3B4', '#0E1F22', 5)),
  doc: canvasTex(256, 150, docDraw('#1B2A24', '#F5B935')),
  social: canvasTex(256, 150, (g, w, h) => { g.fillStyle = '#16120E'; g.fillRect(0,0,w,h); for (let k=0;k<6;k++){ const x = 14 + (k%3)*80, y = 14 + Math.floor(k/3)*66; g.fillStyle = ['#B07A5A','#F5B935','#3E5A44','#D9C2A7','#8E5BC2','#C26B3A'][(k + Math.floor(tick/6)) % 6]; g.fillRect(x, y, 72, 58); } }),
  error: canvasTex(256, 150, (g, w, h) => { g.fillStyle = '#2A1210'; g.fillRect(0,0,w,h); g.fillStyle = '#FF6B5E'; g.font = font(700, 18); g.fillText('✕ falhou', 18, 44); for (let i=0;i<7;i++){ g.fillStyle = i%2 ? 'rgba(255,107,94,.5)' : 'rgba(237,230,214,.35)'; g.fillRect(18, 62 + i*11, 60 + ((i*41)%140), 4); } }),
  waiting: canvasTex(256, 150, (g, w, h) => { g.fillStyle = '#2A2410'; g.fillRect(0,0,w,h); g.fillStyle = '#FFD84A'; g.font = font(700, 20); g.fillText('Permitir?', 18, 52); g.fillStyle = 'rgba(237,230,214,.6)'; g.fillRect(18, 72, 170, 6); g.fillRect(18, 86, 120, 6); g.fillStyle = '#FFD84A'; rr(g, 18, 104, 80, 26, 13); g.fill(); g.fillStyle = '#1A1405'; g.font = font(700, 13); g.fillText('Sim', 44, 122); }),
  boss: canvasTex(256, 150, (g, w, h) => {
    g.fillStyle = '#16120A'; g.fillRect(0,0,w,h); g.fillStyle = '#F5B935'; g.font = font(700, 13); g.fillText('CONSUMO HOJE', 14, 24);
    g.fillStyle = '#EDE6D6'; g.font = font(700, 24); g.fillText(brlFromUsd(totalCost()), 14, 56);
    g.strokeStyle = '#F5B935'; g.lineWidth = 2.5; g.beginPath(); const mn = Math.min(...totalHist), mx = Math.max(...totalHist);
    totalHist.forEach((v,k) => { const x = 14 + k*(228/29), y = 136 - (v-mn)/(mx-mn||1)*60; k ? g.lineTo(x,y) : g.moveTo(x,y); }); g.stroke();
  }),
  idle: canvasTex(256, 150, (g, w, h) => { g.fillStyle = '#0E1513'; g.fillRect(0,0,w,h); g.fillStyle = 'rgba(237,230,214,.25)'; g.font = font(700, 18); g.fillText('EDevsHub', 70, 82); }),
  empty: canvasTex(64, 40, (g, w, h) => { g.fillStyle = '#070B0A'; g.fillRect(0,0,w,h); }),
};
const SCREEN_MAT = Object.fromEntries(Object.entries(SCREENS).map(([k,t]) => [k, screenMat(t)]));
const workScreenFor = (R, alt) => R.kind === 'code' || R.kind === 'ops' ? (alt ? 'working2' : 'working') : R.type === 'studio' ? 'social' : 'doc';

/* furniture */
function plant(p, x, z, s = 1){
  const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); p.add(g);
  cyl(g, .2, .16, .38, M.pot, 0, .19, 0); cyl(g, .19, .19, .02, M.soil, 0, .38, 0, {cast:false});
  [[0,.75,0,.3],[.15,.62,.1,.22],[-.14,.66,-.06,.24],[.05,.98,-.08,.2],[-.08,.9,.12,.18]].forEach(([lx,ly,lz,r],i) => add(g, geo('ico' + r, () => new THREE.IcosahedronGeometry(r, 0)), i%2 ? M.leaf2 : M.leaf, lx, ly, lz, {ry:i}));
  return g;
}
function chair(p, x, z, ry = 0){
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; p.add(g);
  for (let k=0;k<5;k++){ const a = k/5*Math.PI*2; box(g, .03, .03, .28, M.charcoal, Math.sin(a)*.14, .05, Math.cos(a)*.14, {ry:a}); }
  cyl(g, .025, .025, .36, M.steel, 0, .24, 0); rbox(g, .5, .08, .48, .03, M.charcoal, 0, .46, 0); rbox(g, .48, .5, .07, .03, M.charcoal, 0, .78, .23);
  return g;
}
function stool(p, x, z){ cyl(p, .18, .18, .05, M.charcoal, x, .74, z); cyl(p, .025, .025, .72, M.steel, x, .36, z); cyl(p, .16, .18, .02, M.steel, x, .01, z); }
function desk(p, x, z, opts = {}){
  const w = opts.w || 1.8, g = new THREE.Group(); g.position.set(x, 0, z); p.add(g);
  rbox(g, w, .05, .8, .015, opts.top || M.woodDesk, 0, .74, 0);
  box(g, .05, .72, .66, M.white, -w/2 + .08, .36, 0); box(g, .05, .72, .66, M.white, w/2 - .08, .36, 0);
  box(g, w - .5, .006, .4, M.matGreen, 0, .768, .12, {cast:false});
  rbox(g, .6, .02, .18, .008, M.keys, -.05, .78, .16); rbox(g, .07, .025, .11, .012, M.keys, .38, .78, .18);
  cyl(g, .045, .04, .1, M.mug, w/2 - .28, .82, .2);
  if (opts.headphones) add(g, geo('hp', () => new THREE.TorusGeometry(.09, .016, 8, 20, Math.PI)), M.headset, -w/2 + .3, .8, .05, {rx:-Math.PI/2});
  cyl(g, .07, .08, .02, M.white, w/2 - .2, .775, -.22); cyl(g, .012, .012, .5, M.white, w/2 - .2, 1.02, -.22);
  add(g, geo('shade', () => new THREE.ConeGeometry(.11, .14, 20, 1, true)), mat('#2B302D', {r:.5, side:THREE.DoubleSide}), w/2 - .3, 1.26, -.18, {rz:.5});
  sph(g, .035, M.neon, w/2 - .32, 1.21, -.17, {cast:false});
  const mons = [], n = opts.monitors ?? 1;
  for (let m=0;m<n;m++){
    const mx = n === 1 ? 0 : (m - (n-1)/2) * 1.02, mg = new THREE.Group(); mg.position.set(mx, 0, -.2); g.add(mg);
    if (n > 1) mg.rotation.y = (m === 0 ? 1 : -1) * .14;
    box(mg, .24, .015, .16, M.steel, 0, .775, 0); box(mg, .04, .3, .04, M.steel, 0, .92, -.02); rbox(mg, .98, .58, .035, .012, M.bezel, 0, 1.2, 0);
    mons.push(plane(mg, .92, .52, SCREEN_MAT[opts.screen || 'idle'], 0, 1.2, .019, 0, {dyn:true}));
    if (opts.notes) box(mg, .08, .08, .004, mat(['#F5D76E','#F2A28E','#A8D5A2'][m % 3], {r:.9}), .44, 1.44, .02, {cast:false});
  }
  const edge = box(g, w, .012, .012, new THREE.MeshBasicMaterial({color: ST.idle, toneMapped:false}), 0, .74, .405, {cast:false, dyn:true});
  g.userData.mons = mons; g.userData.edge = edge;
  return g;
}
function setDesk(d, state, R){
  const key = state === 'waiting' ? 'waiting' : state === 'error' ? 'error' : state === 'boss' ? 'boss' : state === 'idle' ? 'idle' : state === 'empty' ? 'empty' : workScreenFor(R, d.userData.alt);
  d.userData.mons.forEach(s => { if (s.material !== SCREEN_MAT[key]) s.material = SCREEN_MAT[key]; });
  const col = state === 'empty' ? ST.empty : ST[state] || ST.idle;
  if (d.userData.col !== col){ d.userData.edge.material.color.set(col); d.userData.col = col; }
}
function sofa(p, x, z, ry, m, w = 2.6){
  const s = new THREE.Group(); s.position.set(x, 0, z); s.rotation.y = ry || 0; p.add(s);
  rbox(s, w, .36, .85, .08, m, 0, .22, 0); rbox(s, w, .55, .22, .08, m, 0, .55, .36);
  rbox(s, .22, .5, .85, .08, m, -w/2, .35, 0); rbox(s, .22, .5, .85, .08, m, w/2, .35, 0);
  return s;
}
function bean(p, x, z, color){ add(p, geo('bean', () => { const gg = new THREE.SphereGeometry(.42, 20, 14); gg.scale(1, .55, 1); return gg; }), mat(color, {r:.9}), x, .2, z); }
function rug(p, w, d, x, z, round){ add(p, geo(round ? `rugr${w}` : `rug${w},${d}`, () => round ? new THREE.CylinderGeometry(w, w, .01, 40) : new THREE.BoxGeometry(w, .01, d)), M.rug, x, .014, z, {cast:false}); }
function coffeeBar(p, x, z, w = 3.2){
  const g = new THREE.Group(); g.position.set(x, 0, z); p.add(g);
  rbox(g, w, .9, .7, .02, M.white, 0, .45, 0); rbox(g, w + .1, .05, .78, .015, M.woodDesk, 0, .925, 0);
  rbox(g, .55, .48, .42, .03, mat('#1B1F1D', {r:.35, m:.5}), -w/2 + .6, 1.19, -.08);
  box(g, .5, .04, .1, M.chrome, -w/2 + .6, 1.06, .16); cyl(g, .025, .025, .12, M.chrome, -w/2 + .48, 1.0, .1); cyl(g, .025, .025, .12, M.chrome, -w/2 + .72, 1.0, .1);
  sph(g, .02, M.neon, -w/2 + .75, 1.38, .14, {cast:false});
  for (const mx of [-.3, -.12, .06]) cyl(g, .04, .035, .09, M.mug, mx, .995, .12);
  for (let k=0;k<3;k++) cyl(g, .1, .1, .22, mat(['#C79A3E','#8C3B2E','#3E5A44'][k], {r:.5}), .2 + k*.25, 1.06, -.15);
  return g;
}
function waterCooler(p, x, z){ rbox(p, .4, 1.0, .4, .03, M.white, x, .5, z); cyl(p, .17, .17, .45, mat('#9EC5E8', {r:.1, t:true, o:.55}), x, 1.23, z, {cast:false}); }
function bookshelf(p, x, z, seed){
  const b = new THREE.Group(); b.position.set(x, 0, z); p.add(b);
  box(b, .45, 1.9, 1.8, M.woodDark, 0, .95, 0);
  for (let s=0;s<4;s++){
    box(b, .42, .03, 1.74, M.woodShelf, .01, .2 + s*.45, 0, {cast:false});
    let zz = -.8, k = seed*7 + s*3;
    while (zz < .78){ const bw = .06 + ((k*17)%6)/100, bh = .26 + ((k*13)%10)/100; box(b, .3, +bh.toFixed(2), +bw.toFixed(2), BOOK_COLORS[k % 6], .05, .22 + s*.45 + bh/2, zz + bw/2, {cast:false}); zz += bw + .01; k++; }
  }
  return b;
}

/* rooms */
const FLOOR_GROUPS = FLOORS.map(F => { const g = new THREE.Group(); g.position.y = F.y; scene.add(g); F.g = g; return g; });
const WALLSETS = [], PICK_FLOORS = [], ROOM_LIGHTS = [];
function buildShell(R){
  const g = new THREE.Group(); g.position.set(R.ox, 0, R.oz); FLOORS[R.f].g.add(g); R.g = g;
  const st = new THREE.Group(); g.add(st); R.st = st;
  const fl = add(g, geo('floor', () => new THREE.PlaneGeometry(RW, RD)), R.type === 'control' ? FLOOR_MAT_DIR : FLOOR_MAT, RW/2, .011, RD/2, {rx:-Math.PI/2, cast:false});
  fl.userData.room = R.i; fl.userData.f = R.f; PICK_FLOORS.push(fl);
  R.tint = add(g, geo('floor', () => new THREE.PlaneGeometry(RW, RD)), new THREE.MeshBasicMaterial({color:'#FFD84A', transparent:true, opacity:0, depthWrite:false, toneMapped:false}), RW/2, .02, RD/2, {rx:-Math.PI/2, cast:false, recv:false});
  R.sides = {};
  const mk = (key, len, pos, ry, normal, gap) => {
    const tall = new THREE.Group(), low = new THREE.Group();
    tall.position.set(...pos); tall.rotation.y = ry; low.position.set(...pos); low.rotation.y = ry;
    const segs = gap ? [[-len/2, gap[0]], [gap[1], len/2]] : [[-len/2, len/2]];
    for (const [a, b] of segs){
      const sl = +(b - a).toFixed(3), cx = (a + b)/2;
      box(tall, sl, WH, .12, M.wall, cx, WH/2, 0); box(tall, sl, .1, .14, M.base, cx, .05, 0, {cast:false}); box(tall, sl, .035, .15, M.neon, cx, WH + .015, 0, {cast:false});
      box(low, sl, .5, .05, M.glass, cx, .25, 0, {cast:false, recv:false}); box(low, sl, .03, .07, M.neon, cx, .51, 0, {cast:false}); box(low, sl, .02, .07, M.neonDim, cx, .01, 0, {cast:false});
    }
    if (gap) box(tall, +(gap[1]-gap[0]).toFixed(3), +(WH - 2.15).toFixed(3), .12, M.wall, (gap[0]+gap[1])/2, 2.15 + (WH-2.15)/2, 0);
    g.add(tall); g.add(low);
    const s = {key, tall, low, f:R.f, normal: new THREE.Vector3(...normal), center: new THREE.Vector3(R.ox + pos[0], 0, R.oz + pos[2])};
    R.sides[key] = s; WALLSETS.push(s); return s;
  };
  mk('N', RW, [RW/2, 0, 0], 0, [0,0,-1]);
  const S = mk('S', RW, [RW/2, 0, RD], Math.PI, [0,0,1], [-RW/2 + .8, -RW/2 + 2.4]);
  mk('W', RD, [0, 0, RD/2], Math.PI/2, [-1,0,0]);
  const E = mk('E', RD, [RW, 0, RD/2], -Math.PI/2, [1,0,0]);
  const plate = canvasTex(512, 64, (c, w, h) => { c.fillStyle = '#0B1210'; c.fillRect(0,0,w,h); c.strokeStyle = '#F5B935'; c.lineWidth = 3; c.strokeRect(2,2,w-4,h-4); c.fillStyle = '#EDE6D6'; c.font = font(700, 30); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(R.name.toUpperCase(), w/2, h/2 + 2); });
  const pm2 = screenMat(plate);
  plane(S.low, 2.6, .3, pm2, 1.2, .3, -.04, Math.PI); plane(S.low, 2.6, .3, pm2, -1.2, .3, .04); plane(S.tall, 2.6, .3, pm2, -1.2, 2.32, .065);
  // Porta de vidro no vão da parede sul: batente, folha com puxador e dobradiça; abre quando alguém chega (app.js)
  const [da, db] = [-RW/2 + .8, -RW/2 + 2.4], dw = db - da;
  box(S.tall, .07, 2.18, .17, M.steel, da, 1.09, 0); box(S.tall, .07, 2.18, .17, M.steel, db, 1.09, 0); box(S.tall, dw + .14, .07, .17, M.steel, (da + db)/2, 2.17, 0);
  const pivo = new THREE.Group(); pivo.position.set(da + .04, 0, 0); pivo.userData.dyn = true; S.tall.add(pivo);
  box(pivo, dw - .1, 2.06, .025, M.doorGlass, (dw - .1)/2 + .01, 1.07, 0, {cast:false, recv:false});
  for (const yy of [.06, 2.08]) box(pivo, dw - .08, .06, .045, M.steel, (dw - .08)/2, yy, 0);
  for (const xx of [.03, dw - .1]) box(pivo, .05, 2.06, .045, M.steel, xx, 1.07, 0);
  box(pivo, .03, .55, .03, M.neon, dw - .22, 1.05, .05, {cast:false}); box(pivo, .03, .55, .03, M.neon, dw - .22, 1.05, -.05, {cast:false});
  R.door = {pivo, ang: 0};
  // Janela de verdade na parede leste: cidade lá fora, vidro com reflexo, moldura, travessa, peitoril e persiana meio baixada
  plane(E.tall, 5.2, 1.4, CITY, .4, 1.55, .065);
  plane(E.tall, 5.2, 1.4, M.windowGlass, .4, 1.55, .075, 0, {recv:false});
  box(E.tall, 5.44, .08, .13, M.frame, .4, .81, .09); box(E.tall, 5.44, .08, .13, M.frame, .4, 2.29, .09);
  box(E.tall, .08, 1.56, .13, M.frame, -2.28, 1.55, .09); box(E.tall, .08, 1.56, .13, M.frame, 3.08, 1.55, .09);
  box(E.tall, 5.6, .05, .24, M.sill, .4, .76, .15);
  box(E.tall, 5.2, .035, .05, M.frame, .4, 1.92, .09);
  for (const fx of [-.9, .4, 1.7]) box(E.tall, .045, 1.44, .06, M.frame, fx, 1.55, .09);
  box(E.tall, 5.36, .13, .12, M.frame, .4, 2.4, .1);
  plane(E.tall, 5.2, .34, M.blind, .4, 2.17, .1, 0, {recv:false});
  for (let k = 0; k < 5; k++) box(E.tall, 5.2, .012, .02, M.blindSlat, .4, 2.32 - k * .075, .105, {cast:false});
  for (const lx of [1.7, 4.8, 7.9]){ cyl(st, .18, .18, .03, M.neon, lx, WH + .3, 3.0, {cast:false}); cyl(st, .006, .006, .5, M.charcoal, lx, WH + .57, 3.0, {cast:false}); }
  const l = new THREE.PointLight('#FFB547', 2.3, 10, 2); l.position.set(RW/2, 2.5, 3.4); g.add(l); ROOM_LIGHTS.push(l); R.light = l;
  return g;
}
function wallScreen(parent, w, h, x, y, tex){ rbox(parent, w + .1, h + .1, .06, .02, M.bezel, x, y, .1); plane(parent, w, h, screenMat(tex), x, y, .135); }
function wallBoard(parent, w, h, x, y, tex){ plane(parent, w, h, new THREE.MeshStandardMaterial({map:tex, roughness:.5, envMapIntensity:.15}), x, y, .07); }
function bigScreenTex(R, draw){
  return canvasTex(1024, 220, (g, w, h) => { g.fillStyle = '#0B1210'; g.fillRect(0,0,w,h); g.strokeStyle = R.accent || '#F5B935'; g.lineWidth = 5; g.strokeRect(3,3,w-6,h-6); g.fillStyle = R.accent || '#F5B935'; g.font = font(700, 30); g.fillText(R.name.toUpperCase(), 34, 56); draw(g, w, h); });
}
function sparkOn(g, hist, x, y, w, h, col){
  const mn = Math.min(...hist), mx = Math.max(...hist);
  g.strokeStyle = col; g.lineWidth = 4; g.beginPath(); hist.forEach((v,k) => { const px = x + k*(w/(hist.length-1)), py = y + h - (v-mn)/((mx-mn)||1)*h; k ? g.lineTo(px, py) : g.moveTo(px, py); }); g.stroke();
}
function statusTex(R){
  return canvasTex(256, 120, (g, w, h) => {
    g.fillStyle = '#0B1210'; g.fillRect(0,0,w,h); g.strokeStyle = '#5BD69E'; g.lineWidth = 4; g.strokeRect(2,2,w-4,h-4);
    g.fillStyle = '#8E9A92'; g.font = font(600, 16); g.fillText('STATUS', 16, 30);
    ['working','waiting','error','idle'].forEach((s,k) => { const n = R.agents.filter(a => a.state === s).length; g.fillStyle = ST[s]; g.fillRect(16 + k*58, 62, 12, 12); g.fillStyle = '#EDE6D6'; g.font = font(700, 30); g.fillText(String(n), 34 + k*58, 80); });
  });
}
const quebrar = (t, n) => { const out = []; let l = ''; for (const w of String(t || '').split(/\s+/)){ if ((l + ' ' + w).trim().length > n){ if (l) out.push(l); l = w; } else l = (l + ' ' + w).trim(); } if (l) out.push(l); return out; };
function kanbanReal(R, g, w, h){
  g.fillStyle = '#2B302D'; g.font = font(700, 24); g.fillText(short('AGORA · ' + R.name.toUpperCase(), 40), 30, 46);
  g.fillStyle = '#5C625D'; g.font = font(600, 20); g.fillText('Fazendo', 30, 84); g.fillText('Feito hoje', 520, 84);
  g.fillStyle = 'rgba(43,48,45,.25)'; g.fillRect(500, 64, 3, 270);
  const ativos = R.agents.filter(a => a.state !== 'idle').slice(0, 3);
  if (!ativos.length){ g.fillStyle = '#8C8F8A'; g.font = font(500, 20); g.fillText('Ninguém trabalhando agora', 30, 130); }
  ativos.forEach((a, j) => { const y = 100 + j*82; g.fillStyle = a.state === 'waiting' ? '#F5D76E' : a.state === 'error' ? '#F2A28E' : '#A8D5A2'; g.fillRect(30, y, 450, 72);
    g.fillStyle = '#1E1E1E'; g.font = font(700, 16); g.fillText(short(a.name, 40), 42, y + 22);
    g.font = font(500, 15); quebrar(a.prompt || (TOOL_PT[a.tool] || a.tool), 52).slice(0, 2).forEach((l, i) => g.fillText(l, 42, y + 44 + i*18)); });
  g.fillStyle = '#2B302D'; g.font = font(700, 72); g.fillText(String(R.done), 520, 170);
  g.fillStyle = '#5C625D'; g.font = font(500, 18); g.fillText(R.done === 1 ? 'tarefa concluída' : 'tarefas concluídas', 520, 198);
  const feitos = R.agents.filter(a => a.state === 'idle' && a.prompt).slice(0, 3);
  feitos.forEach((a, j) => { g.fillStyle = '#1E1E1E'; g.font = font(500, 15); g.fillText('✓ ' + short(a.prompt.replace(/^["\s]+/, ''), 26), 520, 236 + j*26); });
}
function kanbanTex(R){
  return canvasTex(768, 360, (g, w, h) => {
    g.fillStyle = '#E4DED0'; g.fillRect(0,0,w,h); g.strokeStyle = '#8C8F8A'; g.lineWidth = 8; g.strokeRect(4,4,w-8,h-8);
    kanbanReal(R, g, w, h);
  });
}
function officeDecor(R){ bookshelf(R.st, .32, 5.4, R.i); rug(R.st, 1.6, 0, 4.6, 6.0, true); sofa(R.st, 4.6, 6.3, 0, M.sofa); plant(R.st, .7, 7.3, 1.2); plant(R.st, 9.4, .8, .95); plant(R.st, 9.4, 7.3, 1); }
function officeDesks(R, n){ R.desks = DESK_X.slice(0, n).map((dx, i) => { const d = desk(R.st, dx, 2.6, {screen:'idle', headphones: i === 1, notes: i === 0}); chair(R.st, dx, 3.45, 0); d.userData.alt = i === 2; return d; }); }
function budgetLine(g, R, y){
  if (!R.budget) return;
  const spent = roomCost(R)*CAMBIO, pct = spent / R.budget;
  g.fillStyle = '#8E9A92'; g.font = font(500, 20); g.fillText(`Orçamento do dia: ${brl(spent, 2)} de ${brl(R.budget)}`, 560, y);
  g.fillStyle = '#1F2C27'; g.fillRect(560, y + 12, 420, 10); g.fillStyle = pct > 1 ? '#FF6B5E' : pct > .8 ? '#F5B935' : '#5BD69E'; g.fillRect(560, y + 12, 420*Math.min(1, pct), 10);
}

function projectRoom(R){
  buildShell(R);
  R.big = bigScreenTex(R, (g) => {
    const working = R.agents.filter(a => a.state === 'working').length;
    g.fillStyle = '#8E9A92'; g.font = font(500, 22); g.fillText(`${R.agents.length} ${R.agents.length === 1 ? 'sessão' : 'sessões'} · ${working} em execução · ${R.done} concluídas hoje`, 34, 92);
    g.fillStyle = '#EDE6D6'; g.font = font(700, 60); g.fillText(brlFromUsd(roomCost(R)), 34, 172);
    sparkOn(g, R.hist, 560, 60, 420, 70, '#F5B935'); budgetLine(g, R, 168);
  });
  wallScreen(R.sides.N.tall, 5.2, 1.12, -1.6, 1.75, R.big);
  R.status = statusTex(R); wallScreen(R.sides.N.tall, 2.0, .94, 2.7, 1.72, R.status);
  R.board = kanbanTex(R); wallBoard(R.sides.W.tall, 3.6, 1.7, 1.6, 1.55, R.board);
  officeDesks(R, 3); officeDecor(R); mergeStatic(R.st);
}
function studioRoom(R){
  buildShell(R); R.accent = '#C8B6F0';
  R.big = bigScreenTex(R, (g) => {
    const NONE = {left: 0, total: 1, none: true}, H = PLAN.higgs.credit || NONE, E = PLAN.eleven.credit || NONE;
    const left = c => c.label ? c.label.split(' ·')[0] : c.none ? 'sem fonte' : num(c.left);
    const frac = c => c.total ? c.left / c.total : 0;
    const marcas = window.EDH_CONTENT ? window.EDH_CONTENT.marcas || [] : [];
    if (marcas.length){
      // Esquerda: Instagram automático (Content Studio). Direita: créditos de voz e imagem
      const m = marcas[0];
      g.fillStyle = '#8E9A92'; g.font = font(500, 22); g.fillText(`@${m.instagram || m.marca} · ${m.publicacao ? (m.modo === 'approved' ? 'publica o que você aprovar' : 'publicação automática') : 'publicação pausada'}`, 34, 98);
      g.fillStyle = '#EDE6D6'; g.font = font(700, 56); g.fillText(`${m.publicadosHoje} hoje`, 34, 160);
      g.fillStyle = '#8E9A92'; g.font = font(500, 20); g.fillText(`${m.agendados} agendados · ${m.emRevisao} em revisão · ${m.publicados7d} na semana`, 34, 194);
      g.fillStyle = m.erroPublicador || (m.saudeInstagram && m.saudeInstagram !== 'verified') ? '#FF6B5E' : '#5BD69E'; g.beginPath(); g.arc(300, 140, 9, 0, 7); g.fill();
      if (marcas.length > 1){ g.fillStyle = '#8E9A92'; g.font = font(500, 18); g.fillText(short('+ ' + marcas.slice(1).map(x => '@' + (x.instagram || x.marca) + ' ' + x.publicadosHoje + ' hoje').join(' · '), 30), 330, 150); }
      g.fillStyle = '#8E9A92'; g.font = font(500, 20); g.fillText('ElevenLabs', 640, 98); g.fillText('Higgsfield', 840, 98);
      g.fillStyle = '#EDE6D6'; g.font = font(700, 38); g.fillText(left(E), 640, 150); g.fillText(left(H), 840, 150);
      g.fillStyle = '#1F2C27'; g.fillRect(640, 172, 170, 10); g.fillRect(840, 172, 140, 10);
      g.fillStyle = E.total && frac(E) < .35 ? '#FF6B5E' : '#F0E2B6'; g.fillRect(640, 172, 170*frac(E), 10); g.fillStyle = '#C8B6F0'; g.fillRect(840, 172, 140*frac(H), 10);
      return;
    }
    g.fillStyle = '#8E9A92'; g.font = font(500, 22); g.fillText('Higgsfield · créditos', 34, 98); g.fillText('ElevenLabs · créditos', 540, 98);
    g.fillStyle = '#EDE6D6'; g.font = font(700, 56); g.fillText(left(H), 34, 160); g.fillText(left(E), 540, 160);
    g.fillStyle = '#1F2C27'; g.fillRect(34, 180, 440, 12); g.fillRect(540, 180, 440, 12);
    g.fillStyle = '#C8B6F0'; g.fillRect(34, 180, 440*frac(H), 12); g.fillStyle = E.total && frac(E) < .35 ? '#FF6B5E' : '#F0E2B6'; g.fillRect(540, 180, 440*frac(E), 12);
  });
  wallScreen(R.sides.N.tall, 5.2, 1.12, -1.6, 1.75, R.big);
  const mood = canvasTex(768, 300, (g, w, h) => {
    const fila = window.EDH_CONTENT ? (window.EDH_CONTENT.marcas || []).flatMap(m => (m.proximos || []).map(p => ({...p, marca: m.marca}))).slice(0, 5) : [];
    if (fila.length){   // fila real de posts agendados no Content Studio
      g.fillStyle = '#1A1F1D'; g.fillRect(0,0,w,h); g.fillStyle = '#C8B6F0'; g.font = font(700, 22); g.fillText('PRÓXIMOS POSTS', 24, 40);
      fila.forEach((p, i) => { const y = 82 + i*46; g.fillStyle = '#F5D76E'; g.font = font(700, 19); g.fillText(p.quando, 24, y); g.fillStyle = '#EDE6D6'; g.font = font(500, 19); g.fillText(short(p.tema || '', 48), 160, y); });
      return;
    }
    g.fillStyle = '#1A1F1D'; g.fillRect(0,0,w,h); g.fillStyle = '#8E9A92'; g.font = font(700, 22); g.fillText('MOODBOARD · CAMPANHAS', 24, 40);
    ['#B07A5A','#D9C2A7','#6B4E3D','#E8D9C4','#F5B935','#16211D','#FF6B5E','#D4B596'].forEach((c,k) => { const x = 24 + (k%4)*182, y = 60 + Math.floor(k/4)*118; g.fillStyle = c; g.fillRect(x, y, 170, 106); g.fillStyle = 'rgba(255,255,255,.14)'; g.fillRect(x, y, 170, 22); });
  });
  wallBoard(R.sides.W.tall, 4.6, 1.8, -.6, 1.5, mood); R.board = mood;   // redesenha junto com as outras telas
  R.desks = [1.7, 4.8].map((dx, i) => { const d = desk(R.st, dx, 2.6, {screen:'idle', headphones:true}); chair(R.st, dx, 3.45, 0); return d; });
  const bg = new THREE.Group(); bg.position.set(8.1, 0, 2.1); R.st.add(bg);
  box(bg, 2.6, .05, 2.6, M.charcoal, 0, .025, 0);
  const foam = mat('#2A2535', {r:1});
  for (let i=0;i<4;i++) for (let j=0;j<3;j++){ box(bg, .55, .5, .06, foam, -.9 + i*.6, .5 + j*.55, -1.26); box(bg, .06, .5, .55, foam, -1.26, .5 + j*.55, -.9 + i*.6); }
  cyl(bg, .02, .02, 1.3, M.steel, 0, .65, .1); cyl(bg, .12, .14, .02, M.steel, 0, .01, .1);
  add(bg, geo('mic', () => new THREE.CapsuleGeometry(.05, .12, 6, 12)), M.black, 0, 1.38, .1, {rx:.3});
  add(bg, geo('pop', () => new THREE.TorusGeometry(.09, .008, 6, 24)), M.steel, 0, 1.38, .25);
  const bglass = new THREE.MeshStandardMaterial({color:'#C8B6F0', transparent:true, opacity:.1, roughness:.05, metalness:.1, envMapIntensity:.45, depthWrite:false});
  box(bg, 2.6, 1.9, .02, bglass, 0, 1.0, 1.3, {cast:false, recv:false}); box(bg, .02, 1.9, 2.6, bglass, -1.3, 1.0, 0, {cast:false, recv:false});
  const purple = new THREE.MeshBasicMaterial({color:'#C8B6F0', toneMapped:false});
  box(bg, 2.62, .025, .03, purple, 0, 1.95, 1.3, {cast:false}); box(bg, .03, .025, 2.62, purple, -1.3, 1.95, 0, {cast:false});
  const onAirTex = canvasTex(256, 80, (c, w, h) => { c.fillStyle = '#000'; c.fillRect(0,0,w,h); c.fillStyle = '#fff'; c.font = font(700, 44); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('NO AR', w/2, h/2 + 3); });
  R.onAir = new THREE.MeshBasicMaterial({color:'#3A2422', map:onAirTex, toneMapped:false});
  add(bg, geo('onair', () => new THREE.BoxGeometry(.8, .25, .05)), R.onAir, 0, 2.15, 1.25, {dyn:true, cast:false});
  cyl(R.st, .02, .02, 1.4, M.steel, .55, .7, 4.3); add(R.st, geo('ringl', () => new THREE.TorusGeometry(.22, .025, 10, 40)), new THREE.MeshBasicMaterial({color:'#FFF4D6', toneMapped:false}), .55, 1.55, 4.3, {cast:false, ry:Math.PI/2});
  rug(R.st, 4.2, 2.0, 3.85, 6.5); [[2.55,'#8E5BC2'],[3.85,'#C26B3A'],[5.15,'#3E5A44']].forEach(([bx, c]) => bean(R.st, bx, 6.45, c));
  plant(R.st, 9.3, 7.2, 1.1); plant(R.st, .7, 7.3, 1);
  mergeStatic(R.st);
}
let TROPHIES = [];
function controlRoom(R){
  buildShell(R);
  R.tvs = PLANS.map(p => canvasTex(512, 300, (g, w, h) => {
    g.fillStyle = '#0B1210'; g.fillRect(0,0,w,h); let pct, big, sub;
    if (p.meters){ const m = p.meters[0]; if (m){ pct = m.used; big = Math.round(m.used) + '%'; sub = m.label.toLowerCase(); } else { pct = 0; big = '—'; sub = 'aguardando leitura'; } }
    else { const c = p.credit; if (c && c.total){ pct = (c.total - c.left)/c.total*100; big = num(c.left); sub = c.unit + ' restantes'; } else if (c){ pct = 0; big = num(c.left); sub = 'créditos · ' + (c.label || 'sem saldo'); } else { pct = 0; big = '—'; sub = 'sem fonte de dados'; } }
    const col = pct > 85 ? '#FF6B5E' : pct > 60 ? '#F5B935' : p.color;
    g.strokeStyle = col; g.lineWidth = 6; g.strokeRect(3,3,w-6,h-6);
    if (!drawBrand(g, p.id, 28, 28, 44)){ g.fillStyle = p.color; rr(g, 28, 28, 44, 44, 9); g.fill(); g.fillStyle = '#0B1210'; g.font = font(700, 26); g.textAlign = 'center'; g.fillText(p.mono, 50, 60); g.textAlign = 'left'; }
    g.fillStyle = '#EDE6D6'; g.font = font(700, 30); g.fillText(p.name, 86, 50); g.fillStyle = '#8E9A92'; g.font = font(500, 18); g.fillText('Plano ' + p.tier, 86, 74);
    g.fillStyle = '#EDE6D6'; g.font = font(700, 76); g.fillText(big, 28, 176); g.fillStyle = '#8E9A92'; g.font = font(500, 20); g.fillText(sub, 28, 214);
    g.fillStyle = '#1F2C27'; g.fillRect(28, 246, w-56, 14); g.fillStyle = col; g.fillRect(28, 246, (w-56)*Math.min(1, pct/100), 14);
  }));
  R.tvs.forEach((t, i) => wallScreen(R.sides.N.tall, 2.08, 1.2, -3.6 + i*2.4, 1.7, t));
  R.board = canvasTex(768, 360, (g, w, h) => {
    g.fillStyle = '#5A3B22'; g.fillRect(0,0,w,h); g.fillStyle = '#B79A72'; g.fillRect(14,14,w-28,h-28);
    g.fillStyle = '#2B302D'; g.font = font(700, 24); g.fillText('SUGESTÕES AGORA', 34, 52);
    SUGG.slice(0,6).forEach((s, k) => { const x = 34 + (k%3)*240, y = 80 + Math.floor(k/3)*130, r = ((k*37)%9 - 4)/120;
      g.save(); g.translate(x+100, y+55); g.rotate(r); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(-96, -46, 200, 110);
      g.fillStyle = s.sev === 'alerta' ? '#F2A28E' : s.sev === 'economia' ? '#F5D76E' : '#A8D5A2'; g.fillRect(-100, -52, 200, 110);
      g.fillStyle = '#C0392B'; g.beginPath(); g.arc(0, -44, 6, 0, 7); g.fill(); g.fillStyle = '#1E1E1E'; g.font = font(700, 21); g.fillText(short(s.short, 16), -86, -6); g.font = font(500, 16); g.fillText(SEV[s.sev].label, -86, 22); g.restore(); });
    const mk = ACHIEVEMENTS.filter(A => COMPANY.unlocked.includes(A.id)).map(A => A.label);
    g.fillStyle = '#2B302D'; g.font = font(700, 18); g.fillText('MARCOS DE HOJE: ' + (mk.length ? short(mk.join(' · '), 58).toUpperCase() : 'NENHUM AINDA'), 34, h - 30);
  });
  wallBoard(R.sides.W.tall, 4.6, 2.16, .4, 1.45, R.board);
  R.desks = [];
  R.ceo = desk(R.st, 2.0, 2.6, {w:2.6, monitors:2, screen:'boss'}); chair(R.st, 2.0, 3.45, 0);
  R.desks[2] = desk(R.st, 7.9, 2.6, {screen:'idle', headphones:true}); chair(R.st, 7.9, 3.45, 0);
  const t = new THREE.Group(); t.position.set(5.8, 0, 5.6); R.st.add(t);
  rbox(t, 3.6, .07, 1.3, .03, M.woodDesk, 0, .74, 0);
  for (const [lx, lz] of [[-1.6,-.5],[1.6,-.5],[-1.6,.5],[1.6,.5]]) cyl(t, .03, .03, .72, M.white, lx, .36, lz);
  rbox(t, .55, .02, .38, .01, M.keys, -.6, .785, 0); cyl(t, .04, .035, .1, M.mug, .5, .82, .1);
  for (const cx of [-1.1, 0, 1.1]){ chair(t, cx, -1.0, Math.PI); chair(t, cx, 1.05, 0); }
  // trophy shelf on the E side
  const sh = new THREE.Group(); sh.position.set(9.55, 0, 6.0); R.g.add(sh);
  box(sh, .4, 1.6, 1.6, M.woodDark, 0, .8, 0);
  for (let s=0;s<3;s++) box(sh, .38, .03, 1.56, M.woodShelf, -.01, .35 + s*.48, 0, {cast:false});
  for (let k=0;k<9;k++){
    const tg = new THREE.Group(); tg.position.set(-.05, .37 + Math.floor(k/3)*.48, -.5 + (k%3)*.5); sh.add(tg);
    cyl(tg, .06, .08, .05, M.black, 0, .025, 0); cyl(tg, .015, .015, .1, M.gold, 0, .1, 0); add(tg, geo('cup', () => new THREE.CylinderGeometry(.09, .04, .14, 16, 1, true)), M.gold, 0, .22, 0);
    tg.visible = false; TROPHIES.push(tg);
  }
  plant(R.st, .7, 7.2, 1.2); plant(R.st, 9.3, .8, 1);
  mergeStatic(R.st);
}
function receptionRoom(R){
  buildShell(R);
  const logo = canvasTex(1024, 300, (c, w, h) => {
    c.fillStyle = '#1A2621'; c.fillRect(0,0,w,h); c.shadowColor = '#F5B935'; c.shadowBlur = 24; c.fillStyle = '#FFE3A1';
    rr(c, 80, 70, 34, 150, 17); c.fill(); rr(c, 216, 70, 34, 150, 17); c.fill(); c.fillRect(114, 136, 24, 22); c.fillRect(192, 136, 24, 22);
    c.fillStyle = '#F5B935'; c.beginPath(); c.arc(165, 146, 18, 0, 7); c.fill();
    c.fillStyle = '#FFE3A1'; c.font = font(700, 120); c.textBaseline = 'middle'; c.fillText('EDevsHub', 300, 140);
    c.shadowBlur = 10; c.fillStyle = '#EDE6D6'; c.font = font(500, 40); c.fillText('Software, sistemas e IA', 310, 236);
  });
  plane(R.sides.N.tall, 5.6, 1.6, screenMat(logo), -.6, 1.6, .07);
  R.board = canvasTex(768, 360, (g, w, h) => { g.fillStyle = '#0B1210'; g.fillRect(0,0,w,h); g.strokeStyle = '#F5B935'; g.lineWidth = 5; g.strokeRect(3,3,w-6,h-6);
    g.fillStyle = '#F5B935'; g.font = font(700, 30); g.fillText('BEM-VINDO', 34, 64); g.fillStyle = '#EDE6D6'; g.font = font(600, 24); g.fillText('Hoje na Central', 34, 120);
    const n = st => AGENTS.filter(a => a.state === st).length, busy = [...new Set(AGENTS.filter(a => a.state !== 'idle').map(a => a.R.name))];
    [`${n('working')} trabalhando · ${n('waiting')} esperando você · ${n('error')} com erro`, `${COMPANY.tasks} tarefas · ${brlFromUsd(totalCost())} em API`, busy.length ? 'Agora: ' + short(busy.join(', '), 44) : 'Ninguém trabalhando agora'].forEach((t, i) => { g.fillStyle = '#CFC9BB'; g.font = font(500, 22); g.fillText(t, 34, 170 + i*48); }); });
  wallScreen(R.sides.W.tall, 3.2, 1.5, 1.6, 1.6, R.board);
  R.desks = [];
  const counter = desk(R.st, 4.8, 2.6, {w:3.2, screen:'idle', top:M.white}); chair(R.st, 4.8, 3.45, 0);
  box(R.st, 3.3, .95, .06, M.woodDesk, 4.8, .475, 2.15, {});
  R.desks[1] = counter; R.agentDeskMap = {0:1};
  rug(R.st, 1.6, 0, 4.6, 6.0, true); sofa(R.st, 4.6, 6.3, 0, M.leather); plant(R.st, .7, 7.3, 1.3); plant(R.st, 9.3, .8, 1.1); plant(R.st, 9.3, 7.2, 1.1);
  mergeStatic(R.st);
}
function deploysTex(R){
  const COR = {READY: '#5BD69E', ERROR: '#FF6B5E', BLOCKED: '#FF6B5E', BUILDING: '#F5B935', QUEUED: '#F5B935', CANCELED: '#6F837B'};
  return canvasTex(768, 360, (g, w, h) => {
    g.fillStyle = '#0B1210'; g.fillRect(0,0,w,h); g.strokeStyle = '#9EC5E8'; g.lineWidth = 5; g.strokeRect(3,3,w-6,h-6);
    g.fillStyle = '#9EC5E8'; g.font = font(700, 24); g.fillText('DEPLOYS · VERCEL', 26, 44);
    const ds = window.EDH_DEPLOYS || [];
    if (!ds.length){ g.fillStyle = '#8E9A92'; g.font = font(500, 22); g.fillText('Sem projetos ligados à Vercel', 26, 100); return; }
    ds.slice(0, 7).forEach((d, i) => { const y = 88 + i*38, e = (d.producao && d.producao.estado) || d.estado;
      g.fillStyle = COR[e] || '#8E9A92'; g.beginPath(); g.arc(36, y - 7, 8, 0, 7); g.fill();
      g.fillStyle = '#EDE6D6'; g.font = font(600, 22); g.fillText(short(d.projeto, 22), 54, y);
      g.fillStyle = '#8E9A92'; g.font = font(500, 18); g.fillText(short(d.sala, 18), 340, y); g.fillText(d.quando ? fmtSpan(Date.now() - d.quando) : '', 600, y); });
  });
}
function infraRoom(R){
  buildShell(R); R.accent = '#9EC5E8';
  R.big = bigScreenTex(R, (g) => {
    // PC sem internet: os sites não foram conferidos (não é queda deles)
    if (typeof realState !== 'undefined' && realState && realState.semInternet){ g.fillStyle = '#FF6B5E'; g.font = font(700, 24); g.textAlign = 'right'; g.fillText('PC SEM INTERNET · SITES NÃO CONFERIDOS', 990, 56); g.textAlign = 'left'; }
    if (!BIZ.uptime.length){ g.fillStyle = '#8E9A92'; g.font = font(500, 24); g.fillText('Conferindo os sites…', 34, 110); }
    BIZ.uptime.slice(0, 6).forEach(([site, up, ok], i) => { const x = 34 + (i%2)*480, y = 92 + Math.floor(i/2)*46; g.fillStyle = ok === false ? '#FF6B5E' : up >= 99.95 ? '#5BD69E' : '#F5B935'; g.beginPath(); g.arc(x + 8, y - 8, 8, 0, 7); g.fill(); g.fillStyle = '#EDE6D6'; g.font = font(600, 26); g.fillText(site, x + 28, y); g.fillStyle = '#8E9A92'; g.font = font(500, 22); g.fillText(up.toFixed(2).replace('.',',') + '%', x + 330, y); });
  });
  wallScreen(R.sides.N.tall, 5.2, 1.12, -1.6, 1.75, R.big);
  R.status = statusTex(R); wallScreen(R.sides.N.tall, 2.0, .94, 2.7, 1.72, R.status);
  R.board = deploysTex(R); wallBoard(R.sides.W.tall, 3.6, 1.7, 1.6, 1.55, R.board);
  R.desks = [desk(R.st, 1.7, 2.6, {screen:'idle', monitors:2, headphones:true})]; chair(R.st, 1.7, 3.45, 0);
  R.rackTex = canvasTex(64, 200, (g, w, h) => { g.fillStyle = '#0A0D0C'; g.fillRect(0,0,w,h); for (let i=0;i<9;i++){ g.fillStyle = '#1C2321'; g.fillRect(4, 8 + i*21, w-8, 16); for (let k=0;k<4;k++){ g.fillStyle = Math.random() < .55 ? '#5BD69E' : (Math.random() < .5 ? '#F5B935' : '#16211D'); g.fillRect(8 + k*6, 13 + i*21, 3, 3); } } });
  const rackM = screenMat(R.rackTex);
  for (const rx of [5.6, 6.4, 7.2, 8.0]){ rbox(R.st, .7, 2.0, .8, .02, mat('#121615', {r:.4, m:.5}), rx, 1.0, 1.6); plane(R.st, .62, 1.9, rackM, rx, 1.0, 2.01); }
  rug(R.st, 1.6, 0, 4.6, 6.0, true); sofa(R.st, 4.6, 6.3, 0, M.sofa); plant(R.st, .7, 7.3, 1.2); plant(R.st, 9.4, 7.3, 1);
  mergeStatic(R.st);
}
const BUILD = {project:projectRoom, studio:studioRoom, control:controlRoom, reception:receptionRoom, infra:infraRoom};   // os tipos de sala do config.json (dados.js → TIPOS_REAIS)
ROOMS.forEach(R => (BUILD[R.type] || projectRoom)(R));
// Uma cor por cliente, na ordem em que aparecem no config (sem repetir até 12 clientes)
const CORES_CLIENTE = ['#F5B935','#5BD69E','#9EC5E8','#C8B6F0','#F2A28E','#7FD1C7','#E39B6B','#D9C27A','#8FB8FF','#F08BB4','#B5D96B','#FFB86B'];
const ORDEM_CLIENTES = [...new Set(ROOMS.map(R => R.cliente).filter(Boolean))];
const corCliente = c => { const i = ORDEM_CLIENTES.indexOf(c); return i < 0 ? '#8E9A92' : CORES_CLIENTE[i % CORES_CLIENTE.length]; };
ROOMS.forEach(R => {
  if (R.type === 'reception') return;
  R.cor = corCliente(R.cliente || R.name);
  const tex = canvasTex(512, 112, (c, w, h) => { c.fillStyle = '#0B1210'; c.fillRect(0,0,w,h); c.fillStyle = R.cor; c.fillRect(0,0,14,h);
    c.fillStyle = '#EDE6D6'; c.font = font(700, 40); c.fillText(short(R.name, 20), 32, 50); c.fillStyle = R.cor; c.font = font(600, 26); c.fillText(short(R.cliente || R.stack || '', 30), 32, 92); });
  add(FLOORS[R.f].g, geo('placa', () => new THREE.PlaneGeometry(5.2, 1.13)), new THREE.MeshBasicMaterial({map: tex, toneMapped: false}), R.ox + RW/2, .03, R.oz + RD + .95, {rx: -Math.PI/2, cast: false, recv: false});
});

/* drink display (EDevsHub own design) */
let bellG = null;
function drinkDisplay(p, x, z){
  const g = new THREE.Group(); g.position.set(x, 0, z); p.add(g);
  const blk = mat('#0E1210', {r:.35, m:.5}), wood = M.woodDesk;
  rbox(g, 6.0, .12, 1.4, .03, blk, 0, .06, 0);
  const canTex = (bg, band, txt, txtCol) => canvasTex(256, 128, (c, w, h) => { c.fillStyle = bg; c.fillRect(0,0,w,h); c.fillStyle = band; c.fillRect(0, 44, w, 40); c.fillStyle = txtCol; c.font = font(700, 26); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, w/2, 66); c.fillStyle = '#C7C9C8'; c.fillRect(0,0,w,7); c.fillRect(0,h-7,w,7); });
  const variants = [
    new THREE.MeshStandardMaterial({map: canTex('#0E1210', '#F5B935', 'EDEVS', '#0E1210'), roughness:.3, metalness:.45}),
    new THREE.MeshStandardMaterial({map: canTex('#EDE6D6', '#16211D', 'ZERO', '#F5B935'), roughness:.3, metalness:.45}),
    new THREE.MeshStandardMaterial({map: canTex('#2F6E47', '#EDE6D6', 'MATE', '#2F6E47'), roughness:.3, metalness:.45}),
    new THREE.MeshStandardMaterial({map: canTex('#5A3B22', '#F5D76E', 'CAFÉ', '#5A3B22'), roughness:.3, metalness:.45}),
  ];
  const canGeo = geo('dcan', () => new THREE.CylinderGeometry(.045, .045, .16, 16));
  const shelfUnit = (sx) => {
    const u = new THREE.Group(); u.position.set(sx, 0, 0); g.add(u);
    box(u, 1.9, 2.1, .06, blk, 0, 1.17, -.6);
    for (let s=0;s<4;s++){
      const y = .38 + s*.46;
      rbox(u, 1.9, .04, 1.0, .01, blk, 0, y, -.1);
      box(u, 1.88, .02, .02, M.neon, 0, y + .03, .4, {cast:false});
      const v = variants[(s + (sx > 0 ? 1 : 0)) % 4], inst = new THREE.InstancedMesh(canGeo, v, 36), tmp = new THREE.Object3D(); let k = 0;
      for (let row=0;row<3;row++) for (let col=0;col<12;col++){ tmp.position.set(-.84 + col*.153, y + .1, .25 - row*.17); tmp.rotation.set(0, col*.5, 0); tmp.updateMatrix(); inst.setMatrixAt(k++, tmp.matrix); }
      inst.castShadow = false; u.add(inst);
    }
    rbox(u, .12, 2.2, 1.0, .04, wood, -1.0, 1.1, -.1); rbox(u, .12, 2.2, 1.0, .04, wood, 1.0, 1.1, -.1);
  };
  shelfUnit(-2.0); shelfUnit(2.0);
  // central cooler
  const c = new THREE.Group(); g.add(c);
  box(c, 1.6, 2.3, .06, blk, 0, 1.27, -.6); box(c, .06, 2.3, 1.2, blk, -.8, 1.27, 0); box(c, .06, 2.3, 1.2, blk, .8, 1.27, 0); rbox(c, 1.6, .2, 1.2, .02, blk, 0, 2.42, 0);
  plane(c, 1.5, 2.1, new THREE.MeshStandardMaterial({color:'#2A1F0A', emissive:'#F5B935', emissiveIntensity:.35, roughness:.6}), 0, 1.27, -.56);
  for (let s=0;s<4;s++){ const y = .45 + s*.48; box(c, 1.5, .012, 1.0, new THREE.MeshStandardMaterial({color:'#FFF0CC', transparent:true, opacity:.35, depthWrite:false}), 0, y, -.05, {cast:false, recv:false});
    const inst = new THREE.InstancedMesh(canGeo, variants[s % 2 === 0 ? 0 : 1], 18), tmp = new THREE.Object3D(); let k = 0;
    for (let row=0;row<2;row++) for (let col=0;col<9;col++){ tmp.position.set(-.64 + col*.16, y + .09, .2 - row*.2); tmp.updateMatrix(); inst.setMatrixAt(k++, tmp.matrix); }
    c.add(inst); }
  plane(c, 1.5, 2.1, new THREE.MeshStandardMaterial({color:'#FFE3A1', transparent:true, opacity:.09, roughness:.04, metalness:.2, envMapIntensity:.8, depthWrite:false}), 0, 1.27, .6);
  cyl(c, .014, .014, 1.0, M.chrome, .66, 1.25, .66);
  // lit columns
  for (const cx of [-3.1, 3.1]){ rbox(g, .22, 2.4, .5, .08, blk, cx, 1.2, -.2); box(g, .04, 2.1, .02, M.neon, cx, 1.2, .06, {cast:false}); }
  // header sign
  const head = canvasTex(1024, 160, (cc, w, h) => {
    cc.fillStyle = '#0B0F0D'; cc.fillRect(0,0,w,h); cc.shadowColor = '#F5B935'; cc.shadowBlur = 22; cc.fillStyle = '#FFD36E';
    rr(cc, 40, 34, 22, 92, 11); cc.fill(); rr(cc, 124, 34, 22, 92, 11); cc.fill(); cc.fillRect(62, 74, 14, 12); cc.fillRect(110, 74, 14, 12); cc.beginPath(); cc.arc(93, 80, 11, 0, 7); cc.fill();
    cc.font = font(700, 78); cc.textBaseline = 'middle'; cc.fillText('EDevsHub', 180, 72); cc.shadowBlur = 10; cc.fillStyle = '#EDE6D6'; cc.font = font(600, 34); cc.fillText('ENERGIA · ZERO · MATE · CAFÉ GELADO', 184, 128);
  });
  rbox(g, 6.4, .55, .3, .04, blk, 0, 2.85, -.4); plane(g, 6.2, .5, screenMat(head), 0, 2.85, -.24);
  const pl = new THREE.PointLight('#FFB547', 1.8, 6, 2); pl.position.set(0, 1.6, 1.4); g.add(pl);
  return g;
}

/* open areas per floor */
const OPEN_GROUPS = [];
function openArea(f){
  const g = new THREE.Group(); FLOORS[f].g.add(g); const st = new THREE.Group(); g.add(st); OPEN_GROUPS.push(st);
  const LZ = WD + .9;
  if (f === 0){
    drinkDisplay(st, 16.2, 12.6);
    // bleachers (arquibancada)
    const b = new THREE.Group(); b.position.set(30, 0, 13.8); st.add(b);
    for (let s=0;s<3;s++){ rbox(b, 6, .4, .9, .04, M.woodDesk, 0, .2 + s*.4, -.9*s, {}); box(b, 6, .4*(s+1), .9, M.woodDark, 0, .2*(s+1), -.9*s); }
    for (let k=0;k<5;k++) rbox(b, .7, .1, .55, .05, mat(['#F5B935','#3E5A44','#C26B3A','#8E5BC2','#EDE6D6'][k], {r:.9}), -2.4 + k*1.2, .45 + (k%2)*.4, -.9*(k%2));
    const screen = canvasTex(1024, 400, (c, w, h) => { c.fillStyle = '#0B1210'; c.fillRect(0,0,w,h); c.fillStyle = '#F5B935'; c.font = font(700, 52); c.fillText('HOJE NA EDEVSHUB', 50, 110); c.fillStyle = '#EDE6D6'; c.font = font(500, 36); c.fillText(`${brlFromUsd(totalCost())} de API · ${AGENTS.filter(a => a.state !== 'idle').length} agentes ativos agora`, 50, 190);
      c.fillStyle = '#8E9A92'; c.font = font(500, 30); c.fillText(`${COMPANY.tasks} tarefas concluídas hoje · ${AGENTS.length} sessões abertas`, 50, 280); });
    OPEN_GROUPS.screens = [screen];
    const sp = new THREE.Group(); sp.position.set(30, 0, 10.9); st.add(sp); cyl(sp, .04, .04, 2.6, M.charcoal, -2.4, 1.3, 0); cyl(sp, .04, .04, 2.6, M.charcoal, 2.4, 1.3, 0);
    rbox(sp, 5.0, 2.0, .1, .03, M.bezel, 0, 2.2, 0); plane(sp, 4.8, 1.88, screenMat(screen), 0, 2.2, .06, Math.PI);
    rug(st, 7, 4, 16, 16.2); sofa(st, 16, 17.0, Math.PI, M.sofa, 3.2);
    [[2.5, 12],[9.5, 12],[22, 12],[38.5, 12.5],[46, 12.5],[38.5, 17.5],[46, 17.5]].forEach(([x,z]) => plant(st, x, z, 1.2));
    // reception kiosk style big rug + lounge chairs
    rug(st, 6, 4, 42, 15); sofa(st, 42, 16.2, Math.PI, M.leather, 3.0); bean(st, 40.5, 13.8, '#F5B935'); bean(st, 43.5, 13.8, '#3E5A44');
    // plaza: coffee, ping-pong, sofa, foosball, arcade, brand wall
    coffeeBar(st, 18.0, LZ - .5);
    const menu = canvasTex(512, 160, (c, w, h) => { c.fillStyle = '#0B1210'; c.fillRect(0,0,w,h); c.strokeStyle = '#F5B935'; c.lineWidth = 4; c.strokeRect(2,2,w-4,h-4); c.fillStyle = '#F5B935'; c.font = font(700, 44); c.fillText('CAFÉ · COPA', 28, 70); c.fillStyle = '#8E9A92'; c.font = font(500, 26); c.fillText('espresso · coado · água', 28, 118); });
    cyl(st, .02, .02, 1.8, M.charcoal, 16.7, .9, LZ - .92); cyl(st, .02, .02, 1.8, M.charcoal, 19.3, .9, LZ - .92); plane(st, 2.4, .75, screenMat(menu), 18.0, 1.75, LZ - .9);
    const pg = new THREE.Group(); pg.position.set(5.0, 0, WD + 4.1); st.add(pg);
    rbox(pg, 2.74, .04, 1.52, .01, mat('#1F5C4A', {r:.5}), 0, .76, 0);
    const line = new THREE.MeshBasicMaterial({color:'#EDE6D6'});
    box(pg, 2.74, .002, .02, line, 0, .781, 0, {cast:false}); box(pg, 2.74, .002, .02, line, 0, .781, .75, {cast:false}); box(pg, 2.74, .002, .02, line, 0, .781, -.75, {cast:false}); box(pg, .02, .002, 1.52, line, 1.36, .781, 0, {cast:false}); box(pg, .02, .002, 1.52, line, -1.36, .781, 0, {cast:false});
    box(pg, .015, .15, 1.72, new THREE.MeshStandardMaterial({color:'#EDE6D6', transparent:true, opacity:.55, depthWrite:false}), 0, .855, 0, {cast:false});
    for (const [lx, lz] of [[-1.2,-.6],[1.2,-.6],[-1.2,.6],[1.2,.6]]) cyl(pg, .03, .03, .74, M.charcoal, lx, .37, lz);
    rug(st, 4.6, 2.6, 17.0, WD + 4.1); const s = sofa(st, 17.0, WD + 4.75, 0, M.leather, 3.6); for (const cx of [-1.1, 0, 1.1]) rbox(s, 1.05, .14, .7, .06, M.cushion, cx, .46, -.06);
    const fg = new THREE.Group(); fg.position.set(29.5, 0, WD + 4.1); st.add(fg);
    rbox(fg, 1.4, .3, .8, .03, M.woodDesk, 0, .78, 0); box(fg, 1.3, .01, .7, mat('#2F6E47', {r:.8}), 0, .935, 0, {cast:false});
    for (const [lx, lz] of [[-.6,-.32],[.6,-.32],[-.6,.32],[.6,.32]]) box(fg, .08, .64, .08, M.woodDark, lx, .32, lz);
    for (let k=0;k<6;k++){ const xx = -.5 + k*.2; cyl(fg, .01, .01, 1.15, M.chrome, xx, .98, 0, {rx:Math.PI/2}); rbox(fg, .03, .04, .12, .01, M.black, xx, .98, .5 + (k%2)*.05); rbox(fg, .03, .04, .12, .01, M.black, xx, .98, -.5 - (k%2)*.05); box(fg, .04, .1, .04, k < 3 ? mat('#B8484E') : mat('#3C7FB0'), xx, .95, 0, {cast:false}); }
    const ag = new THREE.Group(); ag.position.set(27.0, 0, LZ - .45); st.add(ag);
    rbox(ag, .8, 1.75, .75, .03, mat('#2B2140', {r:.45, m:.2}), 0, .875, 0); box(ag, .72, .52, .02, M.black, 0, 1.38, .37);
    plane(ag, .64, .46, screenMat(arcadeTex), 0, 1.38, .385, 0, {dyn:true}); box(ag, .84, .1, .4, mat('#3A2D58', {r:.5}), 0, .98, .48); sph(ag, .04, mat('#FF6B5E', {r:.3}), -.15, 1.07, .5);
    const marquee = canvasTex(256, 64, (c, w, h) => { c.fillStyle = '#1A1230'; c.fillRect(0,0,w,h); c.fillStyle = '#F5B935'; c.font = font(700, 34); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('FLIPERAMA', w/2, h/2 + 2); });
    plane(ag, .74, .18, screenMat(marquee), 0, 1.72, .38);
    const bw = new THREE.Group(); bw.position.set(41.3, 0, LZ - .55); st.add(bw);
    box(bw, 5.2, 2.6, .25, M.wall, 0, 1.3, 0); box(bw, 5.2, .035, .27, M.neon, 0, 2.62, 0, {cast:false});
    const logo = canvasTex(1024, 300, (c, w, h) => { c.fillStyle = '#1A2621'; c.fillRect(0,0,w,h); c.shadowColor = '#F5B935'; c.shadowBlur = 24; c.fillStyle = '#FFE3A1'; rr(c, 60, 70, 34, 150, 17); c.fill(); rr(c, 196, 70, 34, 150, 17); c.fill(); c.fillRect(94, 136, 24, 22); c.fillRect(172, 136, 24, 22); c.fillStyle = '#F5B935'; c.beginPath(); c.arc(145, 146, 18, 0, 7); c.fill(); c.fillStyle = '#FFE3A1'; c.font = font(700, 120); c.textBaseline = 'middle'; c.fillText('EDevsHub', 280, 140); c.shadowBlur = 12; c.fillStyle = '#EDE6D6'; c.font = font(500, 42); c.fillText('Feito é melhor que perfeito', 290, 240); });
    plane(bw, 4.6, 1.35, screenMat(logo), 0, 1.6, .13);
    plane(bw, .55, .55, new THREE.MeshBasicMaterial({map:clockTex, transparent:true, toneMapped:false}), 2.1, .55, .131, 0, {dyn:true});
    [[40.3,'#8E5BC2'],[42.3,'#C26B3A'],[44.0,'#3E5A44']].forEach(([bx, c]) => bean(st, bx, WD + 3.25, c)); rug(st, 5, 2.2, 42, WD + 3.3);
    const t = canvasTex(1024, 160, (cc, w, h) => { cc.clearRect(0,0,w,h); cc.fillStyle = 'rgba(237,230,214,.16)'; cc.fillRect(20, 30, 22, 100); cc.fillRect(108, 30, 22, 100); cc.fillRect(42, 72, 16, 16); cc.fillRect(92, 72, 16, 16); cc.fillStyle = 'rgba(245,185,53,.55)'; cc.beginPath(); cc.arc(75, 80, 13, 0, 7); cc.fill(); cc.fillStyle = 'rgba(237,230,214,.16)'; cc.font = font(700, 92); cc.textBaseline = 'middle'; cc.fillText('EDevsHub', 160, 84); });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(9, 1.4), new THREE.MeshBasicMaterial({map:t, transparent:true, depthWrite:false})); m.rotation.x = -Math.PI/2; m.position.set(WW/2, .02, WD + 5.6); g.add(m);
    [[1.2, LZ - .3, 1.3],[9.6, LZ - .3, 1.1],[12.6, LZ - .3, 1],[20.2, LZ - .3, 1],[32.0, LZ - .3, 1.1],[-.4, WD + 5.2, 1.2]].forEach(([x,z,s2]) => plant(st, x, z, s2));
    [[17.0, 2.2, WD + 3.8],[5.0, 2.4, WD + 4.1],[29.5, 2.4, WD + 4.1],[30, 3.0, 14],[16.2, 3.0, 15.2]].forEach(([x, y, z]) => { const l = new THREE.PointLight('#FFB547', 1.6, 7, 2); l.position.set(x, y, z); g.add(l); ROOM_LIGHTS.push(l); });
  }
  if (f === 1 || f === 2 || f === 3){
    // shared bits: coffee and water at each floor's open area
    const cx = f === 3 ? 28.6 : 40.6;
    coffeeBar(st, cx - .2, 11.8, 2.2); waterCooler(st, cx + 1.3, 11.8);
    [[f === 1 ? 38.8 : 2.0, 17.6],[46.6, 11.2],[f === 1 ? 46.6 : 36.0, 17.8]].forEach(([x,z]) => plant(st, x, z, 1.2));
    const l = new THREE.PointLight('#FFB547', 1.5, 8, 2); l.position.set(cx, 2.6, 13); g.add(l); ROOM_LIGHTS.push(l);
  }
  if (f === 1){
    const wb = new THREE.Group(); wb.position.set(44.1, 0, 13.8); st.add(wb);
    for (const lx of [-1.0, 1.0]) cyl(wb, .02, .02, 1.9, M.steel, lx, .95, 0);
    const daily = canvasTex(768, 400, (c, w, h) => { c.fillStyle = '#F2EFE6'; c.fillRect(0,0,w,h); c.fillStyle = '#2B302D'; c.font = font(700, 34); c.fillText('DAILY · ' + FLOORS[1].name.toUpperCase(), 30, 56);
      const fl = ROOMS.filter(R => R.f === 1), on = fl.filter(R => R.agents.some(a => a.state !== 'idle')).map(R => R.name), wait = fl.filter(R => R.agents.some(a => a.state === 'waiting' || a.state === 'error')).map(R => R.name);
      const lines = ['Agora: ' + (on.length ? short(on.join(', '), 34) : 'ninguém'), 'Hoje: ' + fl.reduce((t, R) => t + R.done, 0) + ' tarefas no andar', 'Bloqueios: ' + (wait.length ? short(wait.join(', '), 30) : 'nenhum')];
      lines.forEach((s, i) => { c.font = font(500, 28); c.fillText('• ' + s, 30, 130 + i*70); }); });
    OPEN_GROUPS.daily = daily;
    rbox(wb, 2.2, 1.2, .05, .02, M.white, 0, 1.4, 0); plane(wb, 2.1, 1.1, new THREE.MeshStandardMaterial({map:daily, roughness:.4}), 0, 1.4, .03);
    cyl(st, .4, .4, .05, M.woodDesk, 44.1, 1.05, 15.2); cyl(st, .04, .04, 1.03, M.steel, 44.1, .52, 15.2);
    [[20.0,'#F5B935'],[22.0,'#3E5A44']].forEach(([x, c]) => bean(st, x, WD + 3.65, c));
    rug(st, 7, 5, 42, 15);
  }
  if (f === 2){
    const bg = new THREE.Group(); bg.position.set(26, 0, 12.0); st.add(bg);
    cyl(bg, .05, .07, 1.5, M.woodDark, 0, .75, 0); box(bg, .8, .06, .06, M.woodDark, 0, 1.52, 0);
    bellG = new THREE.Group(); bellG.position.set(0, 1.5, 0); bg.add(bellG); bellG.userData.dyn = true;
    add(bellG, geo('bell', () => new THREE.CylinderGeometry(.08, .22, .32, 20, 1, true)), new THREE.MeshStandardMaterial({color:'#C9A04A', roughness:.3, metalness:1, envMapIntensity:.6, side:THREE.DoubleSide}), 0, -.2, 0, {dyn:true});
    const sign = canvasTex(512, 128, (c, w, h) => { c.fillStyle = '#0B1210'; c.fillRect(0,0,w,h); c.fillStyle = '#F5B935'; c.font = font(700, 44); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('SINO DAS ENTREGAS', w/2, h/2); });
    cyl(st, .02, .02, 1.6, M.charcoal, 25.0, .8, 11.4); cyl(st, .02, .02, 1.6, M.charcoal, 27.0, .8, 11.4); plane(st, 2.1, .5, screenMat(sign), 26, 1.85, 11.4);
    rug(st, 5, 3, 31, 15.8); sofa(st, 31, 15.6, 0, M.leather, 3.2); bean(st, 44, 15.6, '#C26B3A');
    const goal = canvasTex(1024, 300, (c, w, h) => { c.fillStyle = '#0B1210'; c.fillRect(0,0,w,h); c.fillStyle = '#F5B935'; c.font = font(700, 46); c.fillText('O QUE OS PLANOS RENDERAM NO MÊS', 40, 80);
      const mes = typeof monthApiUsd === 'function' ? monthApiUsd() : 0, subs = PLANS.reduce((t, p) => t + (p.brl || 0), 0), pct = Math.min(1, mes*CAMBIO/Math.max(1, subs)); c.fillStyle = '#1F2C27'; c.fillRect(40, 130, 940, 50); c.fillStyle = '#5BD69E'; c.fillRect(40, 130, 940*pct, 50); c.fillStyle = '#EDE6D6'; c.font = font(700, 40); c.fillText(`${brlFromUsd(mes)} de API por ${brl(subs)} de assinatura`, 40, 250); });
    OPEN_GROUPS.goal = goal;
    const gp = new THREE.Group(); gp.position.set(18, 0, 11.0); st.add(gp); cyl(gp, .04, .04, 2.4, M.charcoal, -2.2, 1.2, 0); cyl(gp, .04, .04, 2.4, M.charcoal, 2.2, 1.2, 0);
    rbox(gp, 4.6, 1.4, .08, .03, M.bezel, 0, 1.9, 0); plane(gp, 4.4, 1.3, screenMat(goal), 0, 1.9, .05);
  }
  if (f === 3){
    const ps = new THREE.Group(); ps.position.set(6, 0, 13.2); st.add(ps);
    const paper = mat('#EDE6D6', {r:.95});
    const curve = new THREE.CylinderGeometry(1.2, 1.2, 3.6, 24, 1, true, Math.PI, Math.PI/2);
    add(ps, curve, mat('#EDE6D6', {r:.95, side:THREE.DoubleSide}), 0, 1.2, 1.2, {rz:Math.PI/2});
    box(ps, 3.6, 2.4, .02, paper, 0, 2.4, 0); box(ps, 3.6, .02, 1.8, paper, 0, .01, 2.1, {cast:false});
    for (const sx of [-2.6, 2.6]){ cyl(ps, .02, .02, 2.0, M.steel, sx, 1.0, 2.6); rbox(ps, .7, .6, .3, .03, new THREE.MeshBasicMaterial({color:'#FFF4D6', toneMapped:false}), sx, 2.1, 2.6); }
    cyl(ps, .015, .015, 1.4, M.steel, -1.0, .7, 3.6); rbox(ps, .2, .14, .14, .02, M.black, -1.0, 1.45, 3.5);
    [[17.0,'#F5B935'],[18.6,'#C26B3A']].forEach(([x, c]) => bean(st, x, 15.0, c)); rug(st, 4, 2.4, 17.8, 15);
    rug(st, 5, 3, 41, 15.8); sofa(st, 41, 15.6, 0, M.sofa, 3.2);
    const mural = canvasTex(1024, 400, (c, w, h) => { c.fillStyle = '#16211D'; c.fillRect(0,0,w,h); c.fillStyle = '#F5B935'; c.font = font(700, 60); c.fillText('IDEIAS > PERFEIÇÃO', 50, 120); for (let k=0;k<12;k++){ c.fillStyle = ['#F5D76E','#F2A28E','#A8D5A2','#9EC5E8'][k%4]; c.fillRect(50 + (k%6)*155, 170 + Math.floor(k/6)*110, 140, 90); } });
    const mp = new THREE.Group(); mp.position.set(41, 0, 11.0); st.add(mp); rbox(mp, 5, 2.4, .12, .03, M.wall, 0, 1.2, 0); plane(mp, 4.8, 2.0, new THREE.MeshStandardMaterial({map:mural, roughness:.6}), 0, 1.3, .07);
  }
  mergeStatic(st);
}
const clockTex = canvasTex(256, 256, (g, w, h) => {
  g.clearRect(0,0,w,h); g.fillStyle = '#EDE6D6'; g.beginPath(); g.arc(128,128,118,0,7); g.fill(); g.strokeStyle = '#2B302D'; g.lineWidth = 10; g.stroke();
  for (let k=0;k<12;k++){ const a = k/12*Math.PI*2; g.fillStyle = '#2B302D'; g.fillRect(128 + Math.sin(a)*96 - 4, 128 - Math.cos(a)*96 - 4, 8, 8); }
  const d = new Date(), hh = (d.getHours()%12 + d.getMinutes()/60)/12*Math.PI*2, mm = d.getMinutes()/60*Math.PI*2, ss = d.getSeconds()/60*Math.PI*2;
  const hand = (a, len, wdt, col) => { g.strokeStyle = col; g.lineWidth = wdt; g.lineCap = 'round'; g.beginPath(); g.moveTo(128,128); g.lineTo(128 + Math.sin(a)*len, 128 - Math.cos(a)*len); g.stroke(); };
  hand(hh, 56, 10, '#2B302D'); hand(mm, 84, 7, '#2B302D'); hand(ss, 90, 3, '#F5B935'); g.fillStyle = '#F5B935'; g.beginPath(); g.arc(128,128,8,0,7); g.fill();
});
const arcadeTex = canvasTex(160, 200, (g, w, h) => {
  g.fillStyle = '#140F2A'; g.fillRect(0,0,w,h); const t = tick;
  for (let r=0;r<3;r++) for (let c=0;c<5;c++){ g.fillStyle = ['#FFD84A','#5BD69E','#FF6B5E'][r]; const x = 16 + c*26 + (t%10)*2 - 10, y = 30 + r*24 + Math.floor(t/10)%4*2; g.fillRect(x, y, 16, 10); g.fillRect(x+3, y+10, 3, 4); g.fillRect(x+10, y+10, 3, 4); }
  g.fillStyle = '#9EC5E8'; g.fillRect(70 + Math.sin(t*.3)*40, 176, 20, 8); g.fillStyle = '#EDE6D6'; g.fillRect(79 + Math.sin(t*.3)*40, 170 - (t%12)*10, 2, 6);
});
FLOORS.forEach(F => openArea(F.i));

/* ---------- marca: o "H" da EDevsHub desenhado em canvas ---------- */
function desenhaMarca(g, x, y, s, cor = '#EDE6D6', ponto = '#F5B935'){
  const u = s / 30;   // o símbolo original é 30 × 30
  g.fillStyle = cor;
  rr(g, x + 3*u, y + 3*u, 5*u, 24*u, 2.5*u); g.fill();
  rr(g, x + 22*u, y + 3*u, 5*u, 24*u, 2.5*u); g.fill();
  g.fillRect(x + 8*u, y + 13.5*u, 3*u, 3*u); g.fillRect(x + 19*u, y + 13.5*u, 3*u, 3*u);
  g.fillStyle = ponto; g.beginPath(); g.arc(x + 15*u, y + 15*u, 2.6*u, 0, 7); g.fill();
}

/* slabs, pillars, elevator */
const PLATFORM_TOPS = [];
FLOORS.forEach(F => {
  const g = F.g, w = WW + 3, d = WD + PLAZA + 1.5, cx = WW/2, cz = (WD + PLAZA)/2 - .25;
  const topM = new THREE.MeshStandardMaterial({map: (() => { const t = concrete.clone(); t.needsUpdate = true; t.repeat.set(w/4, d/4); return t; })(), roughness:.85, envMapIntensity:.1});
  const top = new THREE.Mesh(new THREE.BoxGeometry(w, .3, d), [M.slab, M.slab, topM, M.slab, M.slab, M.slab]);
  top.position.set(cx, -.15, cz); top.receiveShadow = true; top.castShadow = F.i > 0; g.add(top); top.userData.f = F.i; PLATFORM_TOPS.push(top);
  const lobby = new THREE.Mesh(new THREE.BoxGeometry(4, .3, 6), [M.slab, M.slab, topM, M.slab, M.slab, M.slab]); lobby.position.set(EX, -.15, EZ - .3); lobby.receiveShadow = true; g.add(lobby); lobby.userData.f = F.i; PLATFORM_TOPS.push(lobby);
  for (const [ew, ed, ex, ez] of [[w, .05, cx, cz - d/2],[w, .05, cx, cz + d/2],[.05, d, cx - w/2, cz],[.05, d, cx + w/2, cz]]) box(g, ew, .03, ed, M.neon, ex, .005, ez, {cast:false});
  const runner = mat('#1E2E26', {r:.95});
  add(g, new THREE.PlaneGeometry(WW, GAP - .8), runner, WW/2, .006, RD + GAP/2, {rx:-Math.PI/2, cast:false});
  add(g, new THREE.PlaneGeometry(WW + 4.5, 1.0), runner, WW/2 + 1.8, .006, WALK, {rx:-Math.PI/2, cast:false});
  // placa do andar no elevador, com o símbolo da EDevsHub
  const sign = canvasTex(640, 96, (c, ww, hh) => { c.fillStyle = '#0B1210'; c.fillRect(0,0,ww,hh); c.fillStyle = '#F5B935'; c.fillRect(0, hh - 5, ww, 5); desenhaMarca(c, 14, 14, 68); c.fillStyle = '#EDE6D6'; c.font = font(700, 40); c.textBaseline = 'middle'; c.fillText(F.short + ' · ' + F.name.toUpperCase(), 100, hh/2); });
  plane(g, 4.25, .64, screenMat(sign), EX - .2, 2.9, EZ - 3.2, 0);
  add(g, new THREE.PlaneGeometry(9, 1), new THREE.MeshBasicMaterial({visible:false}), WW/2, .02, WD + 3.25, {rx:-Math.PI/2, cast:false}).userData = {f:F.i, plaza:true};
});
const EXPL = 8.6;
const pillars = new THREE.Group(); scene.add(pillars);
for (const [px, pz] of [[-1.5, -1.0],[WW + 1.5, -1.0],[-1.5, WD + PLAZA + .5],[WW + 1.5, WD + PLAZA + .5]]) box(pillars, .5, FH*4 - .3, .5, M.pillar, px, (FH*4 - .3)/2 - .3, pz);
const shaft = new THREE.Group(); scene.add(shaft);
for (const [sx, sz] of [[-1,-1],[1,-1],[-1,1],[1,1]]) box(shaft, .1, FH*3 + 2.6, .1, M.steel, EX + sx*1.0, (FH*3 + 2.6)/2, EZ + sz*1.0);
box(shaft, .02, FH*3 + 2.6, 2.0, mat('#9FC2B4', {t:true, o:.08}), EX + 1.0, (FH*3 + 2.6)/2, EZ, {cast:false, recv:false});
const cab = new THREE.Group(); scene.add(cab);
rbox(cab, 1.8, .08, 1.8, .02, M.steel, 0, 0, 0); rbox(cab, 1.8, .08, 1.8, .02, M.steel, 0, 2.4, 0);
box(cab, 1.8, 2.4, .03, mat('#BFE0D0', {t:true, o:.18}), 0, 1.2, -.9, {cast:false}); box(cab, .03, 2.4, 1.8, mat('#BFE0D0', {t:true, o:.18}), .9, 1.2, 0, {cast:false});
box(cab, 1.8, .03, .05, M.neon, 0, 2.42, .9, {cast:false});
cab.position.set(EX, 0, EZ); let cabTarget = 0;
const bellRing = {t:0};
function ringBell(){ bellRing.t = 2.2; }

/* lights and day/night */
const hemi = new THREE.HemisphereLight('#3A5246', '#0B1210', .32); scene.add(hemi);
const sun = new THREE.DirectionalLight('#BFD6FF', .55);
sun.castShadow = true; sun.shadow.mapSize.set(MOBILE ? 1024 : 2048, MOBILE ? 1024 : 2048);
Object.assign(sun.shadow.camera, {left:-32, right:32, top:24, bottom:-24, near:1, far:140}); sun.shadow.bias = -.0006; sun.shadow.normalBias = .03;
scene.add(sun); scene.add(sun.target);
let lightMode = 'auto';
function dayAmount(){
  if (lightMode === 'day') return 1; if (lightMode === 'night') return 0;
  const d = new Date(), h = d.getHours() + d.getMinutes()/60;
  if (h < 5.5 || h > 19.5) return 0; if (h < 7.5) return (h - 5.5)/2; if (h > 17.5) return (19.5 - h)/2; return 1;
}
let lastDay = -1;
function applyLight(){
  const k = dayAmount(); if (Math.abs(k - lastDay) < .01) return; lastDay = k;
  scene.background.copy(NIGHT_BG).lerp(DAY_BG, k); scene.fog.color.copy(scene.background);
  hemi.intensity = .32 + k*.7; hemi.color.set(k > .5 ? '#DDEBE4' : '#3A5246');
  sun.color.set(k > .5 ? '#FFF1D6' : '#BFD6FF'); sun.intensity = .55 + k*1.0;
  ROOM_LIGHTS.forEach(l => l.intensity = (l.userData.base ?? (l.userData.base = l.intensity)) * (1 - k*.55));
  cityTex.userData.draw = cityDraw(k > .5); redraw(cityTex);
  renderer.toneMappingExposure = .95 - k*.1;
}

/* people */
const capsule = (r, l) => geo(`cap${r},${l}`, () => new THREE.CapsuleGeometry(r, l, 6, 12));
function person(o){
  const g = new THREE.Group();
  const shirt = mat(o.color, {r:.75}), pants = mat('#262B2F', {r:.8}), skin = mat(o.skin, {r:.6}), hair = mat(o.hair, {r:.8}), shoe = mat('#141917', {r:.5});
  const legs = [-.09, .09].map(x => { const p = new THREE.Group(); p.position.set(x, .52, 0); g.add(p); add(p, capsule(.075, .3), pants, 0, -.22, 0); add(p, geo('shoe', () => new THREE.BoxGeometry(.12, .07, .2)), shoe, 0, -.47, .03); return p; });
  const torso = add(g, capsule(.2, .26), shirt, 0, .9, 0); torso.scale.set(1, 1, .72);
  if (o.hoodie) add(g, geo('hood', () => new THREE.TorusGeometry(.13, .04, 8, 20)), shirt, 0, 1.14, -.06, {rx:Math.PI/2});
  const arms = [-.27, .27].map(x => { const p = new THREE.Group(); p.position.set(x, 1.12, 0); g.add(p); add(p, capsule(.06, .28), shirt, 0, -.18, 0); add(p, geo('hand', () => new THREE.SphereGeometry(.06, 10, 8)), skin, 0, -.38, 0); return p; });
  const head = new THREE.Group(); head.position.set(0, 1.42, 0); g.add(head);
  add(head, geo('head', () => new THREE.SphereGeometry(.21, 22, 16)), skin);
  const cap = add(head, geo('hair', () => new THREE.SphereGeometry(.222, 22, 12, 0, Math.PI*2, 0, Math.PI*.55)), hair, 0, .01, -.01); cap.rotation.x = -.25;
  const eye = mat('#141917', {r:.3});
  for (const ex of [-.075, .075]) add(head, geo('eye', () => new THREE.SphereGeometry(.026, 8, 6)), eye, ex, .02, .19, {cast:false});
  if (o.headset){ add(head, geo('hs', () => new THREE.TorusGeometry(.22, .018, 8, 24, Math.PI)), M.headset, 0, .02, 0); add(head, geo('hsc', () => new THREE.SphereGeometry(.05, 10, 8)), M.headset, .22, -.02, 0); add(head, geo('hsc', () => new THREE.SphereGeometry(.05, 10, 8)), M.headset, -.22, -.02, 0); }
  const hold = new THREE.Group(); hold.position.set(0, -.42, .04); arms[1].add(hold);
  const items = {
    can: add(hold, geo('hcan', () => new THREE.CylinderGeometry(.04, .04, .14, 14)), new THREE.MeshStandardMaterial({color:'#0E1210', emissive:'#F5B935', emissiveIntensity:.35, roughness:.3, metalness:.4}), 0, 0, .02),
    cup: add(hold, geo('hcup', () => new THREE.CylinderGeometry(.045, .04, .1, 14)), M.mug, 0, 0, .02),
    paddle: add(hold, geo('pad', () => new THREE.CylinderGeometry(.08, .08, .015, 20)), mat('#B8484E', {r:.5}), 0, -.06, .02, {rx:Math.PI/2}),
    phone: add(hold, geo('phone', () => new THREE.BoxGeometry(.08, .14, .015)), M.black, 0, 0, .04),
  };
  Object.values(items).forEach(m => m.visible = false);
  const ring = new THREE.Mesh(geo('ring2', () => new THREE.RingGeometry(.34, .4, 40)), new THREE.MeshBasicMaterial({color:'#ffffff', transparent:true, opacity:.6, toneMapped:false, depthWrite:false}));
  ring.rotation.x = -Math.PI/2; ring.position.y = .025; g.add(ring);
  g.traverse(m => { if (m.isMesh){ m.castShadow = m !== ring; m.userData.agentRoot = g; } });
  return {g, legs, arms, head, torso, ring, items};
}
const labelsEl = $('labels');
function mkLabel(a){
  const el = document.createElement('div'); el.className = 'lb';
  el.innerHTML = '<div class="bubble" hidden></div><div class="pillx"></div>';
  labelsEl.appendChild(el); el.querySelector('.pillx').addEventListener('click', () => onSelect(a));
  return {el, bubble: el.querySelector('.bubble'), pill: el.querySelector('.pillx')};
}
const BOSS_ROOM = ROOMS.find(R => R.type === 'control') || ROOMS[0];
const DUDU = {id:'dudu', name:'Dudu', color:AMBER, skin:'#E2BB96', hair:'#1A1412', hoodie:true, R:BOSS_ROOM, f:BOSS_ROOM.f, pos:SEAT(BOSS_ROOM, 0), state:'boss'};
DUDU.body = person(DUDU); scene.add(DUDU.body.g); DUDU.lab = mkLabel(DUDU);

/* poses */
let T = 0;
function whereOf(a){
  if (a.ride) return 'ride';
  if (a.path.length) return 'walk';
  if (a.state !== 'idle' && !a.copa && !a.spot) return 'desk';
  if (a.copa) return a.copa.kind;
  if (a.spot) return a.spot.pose;
  return 'stand';
}
function pose(a, dt, snap){
  const b = a.body, sw = s => RM ? 0 : s;
  const where = snap ? snap.where : whereOf(a), state = snap ? snap.state : a.state;
  const px = snap ? snap.x : a.pos.x, pz = snap ? snap.z : a.pos.z, f = snap ? snap.f : a.f;
  b.items.can.visible = where === 'drink'; b.items.cup.visible = where === 'coffee' || where === 'water'; b.items.paddle.visible = where === 'pong'; b.items.phone.visible = where === 'shoot';
  let y = 0;
  b.head.rotation.set(0, 0, 0);
  const sit = (r) => b.legs.forEach(l => l.rotation.set(r, 0, 0));
  const stand = () => { b.legs.forEach(l => l.rotation.set(0, 0, 0)); b.arms[0].rotation.set(0, 0, .06); b.arms[1].rotation.set(0, 0, -.06); };
  if (where === 'walk'){
    const s = sw(Math.sin(T*9 + a.id)*.55);
    b.legs[0].rotation.set(s, 0, 0); b.legs[1].rotation.set(-s, 0, 0); b.arms[0].rotation.set(-s*.7, 0, .06); b.arms[1].rotation.set(s*.7, 0, -.06);
    y = Math.abs(Math.sin(T*9 + a.id))*.03;
  } else if (where === 'ride'){ stand(); }
  else if (where === 'desk'){
    sit(-Math.PI/2.1); y = .03;
    if (state === 'waiting'){ b.arms[1].rotation.set(Math.PI*.95, 0, -.15 + sw(Math.sin(T*6))*.12); b.arms[0].rotation.set(-1.1, 0, 0); b.head.rotation.x = -.15; }
    else if (state === 'error'){ b.arms[0].rotation.set(-2.4, 0, .5); b.arms[1].rotation.set(-2.4, 0, -.5); b.head.rotation.x = .25; }
    else { const k = sw(Math.sin(T*14 + a.id)*.08); b.arms[0].rotation.set(-1.15 + k, 0, .12); b.arms[1].rotation.set(-1.15 - k, 0, -.12); b.head.rotation.x = .08; }
  } else if (['sofa','chair','bean','bench'].includes(where)){
    sit(-Math.PI/2.1); y = where === 'sofa' ? -.06 : where === 'bean' ? -.2 : where === 'bench' ? -.04 : .03;
    b.arms[0].rotation.set(-.5, 0, .25); b.arms[1].rotation.set(-.5, 0, -.25); b.head.rotation.y = sw(Math.sin(T*.6 + a.id))*.3;
    if (where === 'bench') y += snap ? 0 : (a.copa ? (a.copa.x === 30 ? .4 : 0) : 0);
  } else {
    stand();
    if (where === 'drink') b.arms[1].rotation.set(-1.3, 0, -.2);
    if (where === 'coffee' || where === 'water') b.arms[1].rotation.set(-1.6 - sw(Math.sin(T*.8))*.4, 0, -.25);
    if (where === 'pong'){ const ph = (T*1.3) % 2, hit = (snap ? snap.yaw : a.copa.yaw) > 0 ? ph < .25 : (ph > 1 && ph < 1.25); b.arms[1].rotation.set(-.9 - (hit && !RM ? .6 : 0), 0, -.2); }
    if (where === 'foos' || where === 'arcade'){ const k = sw(Math.sin(T*10 + a.id)*.15); b.arms[0].rotation.set(-1.2 + k, 0, .1); b.arms[1].rotation.set(-1.2 - k, 0, -.1); }
    if (where === 'look'){ b.head.rotation.x = -.1; b.arms[1].rotation.set(-.4, 0, -.1); }
    if (where === 'standup'){ b.arms[0].rotation.set(-.3, 0, .2); b.arms[1].rotation.set(sw(Math.sin(T*2 + a.id))*.4 - .6, 0, -.2); }
    if (where === 'bell'){ b.arms[1].rotation.set(-2.6 + sw(Math.sin(T*10))*.3, 0, -.2); }
    if (where === 'photo'){ b.arms[0].rotation.set(0, 0, .6); b.arms[1].rotation.set(-2.8, 0, -.3); }
    if (where === 'shoot'){ b.arms[0].rotation.set(-1.4, 0, .2); b.arms[1].rotation.set(-1.4, 0, -.2); }
  }
  if (!snap && a.pop > 0){ y += sw(Math.sin(a.pop*Math.PI))*.2; a.pop = Math.max(0, a.pop - dt*2); }
  let fy = FLOORS[f].y;
  if (!snap && a.ride){ const r = a.ride, e = r.t < .5 ? 2*r.t*r.t : 1 - Math.pow(-2*r.t + 2, 2)/2; fy = FLOORS[r.from].y + (FLOORS[r.to].y - FLOORS[r.from].y)*e; }
  const wx = px + (where === 'pong' ? sw(Math.sin(T*1.7 + a.id))*.15 : 0), wz = where === 'desk' ? pz + .05 : pz;
  b.g.position.set(wx, fy + y + (where === 'bench' && !snap && a.copa && a.copa.x === 30 ? .4 : 0), wz);
  const target = snap ? snap.yaw : (where === 'walk' ? (a.walkYaw ?? b.g.rotation.y) : (a.yawEnd ?? a.yaw));
  const d = ((target - b.g.rotation.y + Math.PI*3) % (Math.PI*2)) - Math.PI;
  b.g.rotation.y += snap ? d : d * Math.min(1, dt*10);
  return where;
}
function poseDudu(){
  const b = DUDU.body; b.legs.forEach(l => l.rotation.set(-Math.PI/2.1, 0, 0));
  const k = RM ? 0 : Math.sin(T*12)*.07; b.arms[0].rotation.set(-1.15 + k, 0, .12); b.arms[1].rotation.set(-1.15 - k, 0, -.12);
  b.g.position.set(DUDU.pos.x, FLOORS[DUDU.f].y + .03, DUDU.pos.z + .05); b.g.rotation.y = Math.PI;
  if (BOSS_ROOM.type !== 'control') b.g.visible = false;
}
