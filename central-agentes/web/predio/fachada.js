// Central de Agentes · prédio 3D — fachada.js
// O lado de fora do prédio: rua, calçada, árvores e postes, totem da EDevsHub na entrada, estrutura e pele de vidro
// nos fundos de cada andar e, no topo, o letreiro iluminado (só na vista "Prédio"). Carregado depois do cena.js.

const FACHADA = new THREE.Group(); scene.add(FACHADA);
const FM = {
  asfalto: mat('#101613', {r:.95, env:.1}), calcada: mat('#1D2622', {r:.9, env:.15}), faixa: mat('#3B4440', {r:.9}),
  grama: mat('#1E3A2A', {r:1, env:.1}), meioFio: mat('#2E3833', {r:.85}),
  poste: mat('#2A302D', {r:.4, m:.7, env:.8}), luz: new THREE.MeshBasicMaterial({color:'#FFE7B8', toneMapped:false}),
  tronco: mat('#4A3626', {r:.9}), totem: mat('#121A17', {r:.4, m:.3, env:.8}),
  vidroFundo: mat('#7FA597', {r:.05, m:.3, t:true, o:.16, env:2}), estrutura: mat('#1B2421', {r:.5, m:.5, env:.6}),
  antenaLuz: new THREE.MeshBasicMaterial({color:'#FF4B3E', toneMapped:false}),
};

/* ---------- chão da cidade ---------- */
const CX = WW / 2, FRENTE = WD + PLAZA + 1;   // frente do terreno (z), onde fica a entrada
add(FACHADA, new THREE.PlaneGeometry(260, 260), FM.asfalto, CX, -.34, 12, {rx: -Math.PI/2, cast: false});
add(FACHADA, new THREE.PlaneGeometry(WW + 16, WD + PLAZA + 15), FM.calcada, CX, -.32, (WD + PLAZA)/2 + 1.5, {rx: -Math.PI/2, cast: false});
// canteiros nas laterais e meio-fio
for (const lado of [-1, 1]) add(FACHADA, new THREE.PlaneGeometry(4.2, WD + PLAZA + 6), FM.grama, CX + lado * (WW/2 + 5.4), -.315, (WD + PLAZA)/2 + 1, {rx: -Math.PI/2, cast: false});
box(FACHADA, WW + 16, .12, .25, FM.meioFio, CX, -.28, FRENTE + 8.5, {cast: false});
// rua com faixa tracejada
add(FACHADA, new THREE.PlaneGeometry(260, 9), mat('#0C110F', {r:.9}), CX, -.33, FRENTE + 13.2, {rx: -Math.PI/2, cast: false});
for (let x = -60; x < 110; x += 6) add(FACHADA, new THREE.PlaneGeometry(2.6, .16), FM.faixa, x, -.325, FRENTE + 13.2, {rx: -Math.PI/2, cast: false});

/* ---------- postes e árvores na calçada ---------- */
function poste(x, z){
  cyl(FACHADA, .06, .08, 4.4, FM.poste, x, 1.9, z, {seg: 10});
  box(FACHADA, .9, .06, .08, FM.poste, x - .4, 4.05, z, {cast: false});
  box(FACHADA, .34, .05, .18, FM.luz, x - .82, 3.99, z, {cast: false});
}
function arvore(x, z, s = 1){
  cyl(FACHADA, .08*s, .12*s, 1.6*s, FM.tronco, x, .48*s - .32, z, {seg: 8});
  add(FACHADA, geo('copa1', () => new THREE.IcosahedronGeometry(.9, 0)), M.leaf, x, 1.75*s - .32, z).scale.setScalar(s);
  add(FACHADA, geo('copa2', () => new THREE.IcosahedronGeometry(.62, 0)), M.leaf2, x + .35*s, 2.3*s - .32, z - .2*s).scale.setScalar(s);
}
for (let x = -4; x <= WW + 4; x += 10.5) poste(x, FRENTE + 7.6);
for (let x = 1; x <= WW; x += 10.5) arvore(x, FRENTE + 7.2, .95 + (Math.round(x) % 3) * .08);
for (const z of [2, 9, 16]) { arvore(-5.4, z, 1.05); arvore(WW + 5.4, z, 1.05); }

/* ---------- totem da marca na entrada ---------- */
const totemTex = canvasTex(256, 768, (g, w, h) => {
  g.fillStyle = '#0B1210'; g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(245,185,53,.55)'; g.lineWidth = 4; g.strokeRect(10, 10, w - 20, h - 20);
  desenhaMarca(g, w/2 - 70, 70, 140);
  g.save(); g.translate(w/2 + 26, h - 70); g.rotate(-Math.PI/2);
  g.fillStyle = '#EDE6D6'; g.font = font(700, 74); g.textBaseline = 'middle'; g.fillText('EDevsHub', 0, -20);
  g.fillStyle = '#F5B935'; g.font = font(600, 30); g.fillText('SOFTWARE, SISTEMAS E IA', 0, 46); g.restore();
});
const TOTEM = new THREE.Group(); TOTEM.position.set(WW - 4, -.32, FRENTE + 5.2); FACHADA.add(TOTEM);
box(TOTEM, 1.25, 3.6, .42, FM.totem, 0, 1.8, 0);
plane(TOTEM, 1.12, 3.36, screenMat(totemTex), 0, 1.8, .215, 0);
box(TOTEM, 1.3, .06, .48, M.neon, 0, .03, 0, {cast: false});

/* ---------- estrutura e pele de vidro nos fundos de cada andar ---------- */
const FUNDO_Z = -1.15, X0 = -1.5, X1 = WW + 1.5, ALT = FH - .3;
FLOORS.forEach(F => {
  const g = new THREE.Group(); g.userData.fachada = true; F.g.add(g);
  for (let x = X0; x <= X1 + .01; x += (X1 - X0) / 8) box(g, .22, ALT, .22, FM.estrutura, x, ALT/2, FUNDO_Z);   // pilares
  box(g, X1 - X0, .22, .26, FM.estrutura, (X0 + X1)/2, ALT - .11, FUNDO_Z);                                       // viga
  add(g, new THREE.PlaneGeometry(X1 - X0, ALT - .3), FM.vidroFundo, (X0 + X1)/2, (ALT - .3)/2, FUNDO_Z - .02, {cast: false, recv: false});
  for (let x = X0 + (X1 - X0) / 16; x < X1; x += (X1 - X0) / 8) box(g, .04, ALT - .3, .05, FM.estrutura, x, (ALT - .3)/2, FUNDO_Z - .03, {cast: false});
  box(g, X1 - X0, .04, .05, FM.estrutura, (X0 + X1)/2, 1.05, FUNDO_Z - .03, {cast: false});
  // pilares das esquinas da frente (estrutura do prédio, finos para não tampar a vista)
  for (const x of [X0, X1]) box(g, .22, ALT, .22, FM.estrutura, x, ALT/2, WD + PLAZA + .5);
});

/* ---------- topo: letreiro iluminado, casa de máquinas e antena (só na vista "Prédio") ---------- */
const letreiroTex = canvasTex(1024, 256, (g, w, h) => {
  g.clearRect(0, 0, w, h);
  desenhaMarca(g, 40, 38, 180);
  g.fillStyle = '#EDE6D6'; g.font = font(700, 132); g.textBaseline = 'alphabetic'; g.fillText('EDevsHub', 250, 168);
  g.fillStyle = '#F5B935'; g.font = font(600, 34); g.fillText('CENTRAL DE AGENTES', 256, 222);
});
const TOPO = new THREE.Group(); TOPO.position.set(0, WH + .9, 0); TOPO.visible = false; FLOORS[FLOORS.length - 1].g.add(TOPO);
const letreiro = new THREE.Mesh(new THREE.PlaneGeometry(13, 3.25), new THREE.MeshBasicMaterial({map: letreiroTex, transparent: true, alphaTest: .05, toneMapped: false, side: THREE.DoubleSide}));
letreiro.position.set(CX - 4, 2.3, FUNDO_Z + .1); TOPO.add(letreiro);
for (const x of [-5.6, -1.9, 1.9, 5.6]) box(TOPO, .08, 2.6, .08, FM.poste, CX - 4 + x, 1.3, FUNDO_Z - .15);
box(TOPO, 12.4, .08, .08, FM.poste, CX - 4, 1.0, FUNDO_Z - .15); box(TOPO, 12.4, .08, .08, FM.poste, CX - 4, 3.3, FUNDO_Z - .15);
box(TOPO, 13.4, .05, .3, M.neon, CX - 4, .62, FUNDO_Z + .1, {cast: false});
// casa de máquinas e caixas de ar-condicionado
box(TOPO, 4.2, 1.6, 2.6, FM.estrutura, WW - 6, .8, 1.2);
for (const [x, z] of [[WW - 11, .6], [WW - 13.2, .6], [8, .6]]) { box(TOPO, 1.6, .9, 1.2, mat('#3A4440', {r:.6, m:.4}), x, .45, z); cyl(TOPO, .4, .4, .08, M.charcoal, x, .94, z, {seg: 16}); }
// antena com luz piscando
cyl(TOPO, .04, .06, 5, FM.poste, WW - 6, 4.1, 1.2, {seg: 8});
const ANTENA = sph(TOPO, .12, FM.antenaLuz, WW - 6, 6.65, 1.2, {cast: false});

/** Chamado a cada quadro (app.js): letreiro e antena só aparecem na vista do prédio inteiro. */
function fachadaTick(t){
  TOPO.visible = view.building;
  if (TOPO.visible) ANTENA.visible = (t % 1.6) < .25;
}
