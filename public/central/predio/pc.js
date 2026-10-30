// Central de Agentes · prédio 3D — pc.js
// Clique num PC (mesa) do prédio: chama o Claude ou o Codex para trabalhar ali.
//  - Conversar: abre o chat num terminal novo na pasta do projeto (o boneco senta neste PC quando a sessão começa)
//  - Sozinho: tarefa em segundo plano (só ler ou pode editar); o resultado cai no quadro
// E lista as conversas da sala (abertas agora e antigas) para continuar de onde parou.
// Só funciona no app do PC (localhost), que fala com o agente; na nuvem o clique na mesa só mostra quem está nela.

let PC = null;                    // { R, mesa } PC livre escolhido (mesa = índice da vaga, como no agente)
let pcShell = '';                 // assinatura do cartão montado (evita recriar o textarea a cada quadro)
const LANC = {quem: 'claude', como: 'conversa', editar: false, texto: ''};   // última escolha
const SESS = new Map();           // sala -> { at, lista, carregando }
const PC_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 20h6M12 16v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
const podeLancar = () => !NUVEM;

/* ---------- mesas clicáveis ---------- */
// vaga do agente -> mesa desenhada (na recepção a vaga 0 é o balcão, mesa 1)
const meshDaVaga = (R, v) => R.desks && R.desks[(R.agentDeskMap && R.agentDeskMap[v] !== undefined) ? R.agentDeskMap[v] : v];
// A mesa desenhada foi mesclada na otimização (só sobram as telas): cada PC ganha uma caixa de clique invisível do tamanho dele
const MAT_CLIQUE = new THREE.MeshBasicMaterial({visible: false});
function caixaDe(d){
  if (d.userData.clique) return d.userData.clique;
  const box = new THREE.Box3().setFromObject(d), c = box.getCenter(new THREE.Vector3()), s = box.getSize(new THREE.Vector3());
  const m = new THREE.Mesh(new THREE.BoxGeometry(Math.max(1.6, s.x + .3), Math.max(1.4, s.y + .5), Math.max(1.1, s.z + .3)), MAT_CLIQUE);
  d.add(m); m.position.copy(d.worldToLocal(c.clone())); m.position.y = Math.max(m.position.y, .7);
  d.userData.clique = m; return m;
}
function mesasVisiveis(){
  const out = [];
  if (view.building) return out;
  for (const R of ROOMS) if (R.f === view.floor) for (const v of seatsOf(R)) { const d = meshDaVaga(R, v); if (d) out.push({obj: caixaDe(d), R, mesa: v}); }
  return out;
}
/** Raio do clique acertou um PC? Devolve {R, mesa}. */
function pcPick(ray){
  const ms = mesasVisiveis(); if (!ms.length) return null;
  const hit = ray.intersectObjects(ms.map(m => m.obj), false)[0];
  return hit ? ms.find(m => m.obj === hit.object) || null : null;
}
const ocupante = (R, mesa) => R.agents.find(a => a.desk === mesa);
const primeiraLivre = R => seatsOf(R).find(v => !ocupante(R, v));

/* ---------- marcador sobre o PC escolhido ---------- */
const PC_MARK = (() => {
  const g = new THREE.Group();
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.42, .045, 8, 40), new THREE.MeshBasicMaterial({color: 0xF5B935, toneMapped: false}));
  ring.rotation.x = Math.PI / 2; g.add(ring);
  const seta = new THREE.Mesh(new THREE.ConeGeometry(.16, .3, 4), new THREE.MeshBasicMaterial({color: 0xF5B935, toneMapped: false}));
  seta.rotation.x = Math.PI; seta.position.y = .55; g.add(seta);
  g.visible = false; scene.add(g); return g;
})();
function pcMarkTick(t){
  if (!PC){ PC_MARK.visible = false; return; }
  const d = meshDaVaga(PC.R, PC.mesa);
  if (!d || ocupante(PC.R, PC.mesa) || view.building || view.floor !== PC.R.f){ PC_MARK.visible = false; return; }
  d.getWorldPosition(PC_MARK.position); PC_MARK.position.y += 1.55 + Math.sin(t * 3) * .08; PC_MARK.rotation.y = t * 1.2; PC_MARK.visible = true;
}

/* ---------- abrir o PC ---------- */
function abrirPC(R, mesa){
  const a = mesa != null ? ocupante(R, mesa) : null;
  if (a){ PC = null; onSelect(a); return; }
  if (!podeLancar()){ toast('Para chamar alguém, use o app do PC (localhost:4321)'); return; }
  PC = {R, mesa: mesa ?? primeiraLivre(R) ?? null}; selected = null; pcShell = '';
  setTab('agente'); openDrawer();
  if (focus !== R.i){ if (view.building || view.floor !== R.f) setView(R.f, false); goFocus(R.i); setTab('agente'); }
  carregarSessoes(R.name); dirty = true;
}
async function carregarSessoes(sala, forcar){
  const c = SESS.get(sala);
  if (!podeLancar() || (c && (c.carregando || (!forcar && Date.now() - c.at < 30e3)))) return;
  SESS.set(sala, {at: c ? c.at : 0, lista: c ? c.lista : null, carregando: true});
  try { const lista = await (await fetch('/api/sessoes?sala=' + encodeURIComponent(sala))).json(); SESS.set(sala, {at: Date.now(), lista, carregando: false}); }
  catch { SESS.set(sala, {at: Date.now(), lista: c ? c.lista : [], carregando: false}); }
  dirty = true;
}

/* ---------- cartão ---------- */
const NOME_QUEM = {claude: 'Claude', codex: 'Codex'};
const COMO = {
  conversa: ['Conversar', 'abre o chat num terminal'],
  sozinho: ['Sozinho', 'trabalha em segundo plano'],
};
function textoBotao(){
  const lugar = PC && PC.mesa != null ? ` no PC ${PC.mesa + 1}` : '';
  return (LANC.como === 'conversa' ? 'Abrir o chat do ' : 'Mandar o ') + NOME_QUEM[LANC.quem] + lugar;
}
function dicaComo(){
  if (LANC.como === 'conversa') return 'Abre um terminal novo na pasta do projeto, já com o seu pedido. Você continua a conversa por lá; aqui o boneco senta no PC e mostra o que está fazendo.';
  return (LANC.editar ? 'Pode mudar arquivos desta pasta sem pedir permissão.' : 'Só lê: revisa, investiga ou planeja, sem mudar nada.') + ' O outro agente não vê suas conversas: explique o contexto. O resultado cai no quadro (aba Operação).';
}
function lancadorHTML(R){
  const livre = PC && PC.mesa != null, F = FLOORS[R.f];
  const seg = (grupo, val, html, extra = '') => `<button type="button" class="seg-b${LANC[grupo] === val ? ' on' : ''}" role="radio" aria-checked="${LANC[grupo] === val}" data-act="lanc" data-arg="${grupo}:${val}"${extra}>${html}</button>`;
  return `<div class="card launch">
    <div class="launch-head"><span class="pc-ic">${PC_ICON}</span><div style="min-width:0"><b>${livre ? `PC ${PC.mesa + 1} · ` : ''}${esc(R.name)}</b><small>${esc(F ? F.name : '')}${livre ? ' · livre' : ' · todos os PCs ocupados: vai trabalhar no sofá'}</small></div></div>
    <span class="k">Quem vai trabalhar</span>
    <div class="seg" role="radiogroup" aria-label="Quem vai trabalhar">${seg('quem', 'claude', `${brandIcon('claude', 22)}<span>Claude Code</span>`)}${seg('quem', 'codex', `${brandIcon('gpt', 22)}<span>Codex</span>`)}</div>
    <span class="k">Como</span>
    <div class="seg seg-2" role="radiogroup" aria-label="Como">${Object.entries(COMO).map(([k, [t, s]]) => seg('como', k, `<b>${t}</b><small>${s}</small>`)).join('')}</div>
    ${LANC.como === 'sozinho' ? `<label class="switch"><input type="checkbox" data-act="lanc" data-arg="editar:toggle"${LANC.editar ? ' checked' : ''}><span class="sw"></span><span><b>Pode editar arquivos</b><small>${LANC.editar ? 'muda a pasta sem perguntar' : 'desligado: só lê e responde'}</small></span></label>` : ''}
    <span class="k">${LANC.como === 'conversa' ? 'Primeiro pedido (opcional)' : 'O que fazer'}</span>
    <textarea id="lancTexto" rows="3" placeholder="${LANC.como === 'conversa' ? 'Ex.: revise o checkout e me diga o que falta' : 'Ex.: revise as mudanças de hoje e aponte bugs (explique o contexto: o agente não vê suas conversas)'}">${esc(LANC.texto)}</textarea>
    <button class="btn solid launch-go" type="button" data-act="lancar">${textoBotao()}</button>
    <p class="note" style="margin:8px 0 0">${dicaComo()}</p>
  </div>
  <div class="card"><div class="sec"><h2>Continuar uma conversa</h2><small>Claude e Codex desta sala</small></div><ul class="convs" id="pcConvs"></ul></div>`;
}
function convsHTML(R){
  const c = SESS.get(R.name);
  if (!c || !c.lista) return '<li class="note">Carregando conversas…</li>';
  if (!c.lista.length) return '<li class="note">Nenhuma conversa nos últimos 30 dias nesta sala.</li>';
  return c.lista.map(s => `<li>${brandIcon(s.fonte === 'codex' ? 'gpt' : 'claude', 26)}<span class="t"><b>${esc(short(s.titulo, 90))}</b><small>${s.aberta ? '<em class="on">aberta agora</em> · ' : ''}${fmtSpan(Date.now() - s.quando)} atrás${s.projeto && s.projeto !== R.name ? ' · ' + esc(s.projeto) : ''}</small></span>`
    + (s.aberta ? `<button class="btn" type="button" data-act="verSessao" data-arg="${esc(s.fonte)}:${esc(s.id)}">Ver</button>` : `<button class="btn" type="button" data-act="retomar" data-arg="${esc(s.fonte)}:${esc(s.id)}">Continuar</button>`) + '</li>').join('');
}
/** Aba Agente quando um PC livre está escolhido. */
function renderPCTab(){
  const R = PC.R, assin = [R.name, PC.mesa, LANC.quem, LANC.como, LANC.editar].join('|');
  if (pcShell !== assin){ pcShell = assin; $('pane').innerHTML = lancadorHTML(R); lastHTML.pcConvs = null; }
  setHTML($('pcConvs'), convsHTML(R));
  if (Date.now() - (SESS.get(R.name)?.at || 0) > 30e3) carregarSessoes(R.name);
}

/** No cartão de um agente: atalho para chamar mais alguém para a mesma sala (substitui o antigo "Trabalho em…"). */
function pcConvite(a){
  const livre = primeiraLivre(a.R);
  return `<div class="card invite"><span class="pc-ic">${PC_ICON}</span><span style="flex:1;min-width:0"><b>Precisa de mais alguém em ${esc(a.R.name)}?</b><small>${livre != null ? `PC ${livre + 1} está livre` : 'Todos os PCs ocupados'} · Claude ou Codex, conversa ou sozinho</small></span><button class="btn solid" type="button" data-act="pcSala" data-arg="${a.R.i}">Chamar</button></div>`;
}

/* ---------- ações ---------- */
document.addEventListener('input', e => { if (e.target.id === 'lancTexto') LANC.texto = e.target.value; });
const postar = async (rota, corpo) => {
  const r = await fetch(rota, {method: 'POST', headers: {'Content-Type': 'application/json', 'X-EDH-Token': window.EDH_TOKEN || ''}, body: JSON.stringify(corpo)});
  const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.erro || r.status); return j;
};
async function lancar(){
  if (!PC) return;
  const R = PC.R, mesa = PC.mesa, texto = LANC.texto.trim(), quem = NOME_QUEM[LANC.quem];
  if (LANC.como !== 'conversa' && !texto){ toast('Escreva o que fazer'); $('lancTexto')?.focus(); return; }
  const btn = document.querySelector('.launch-go'); if (btn) btn.disabled = true;
  try {
    if (LANC.como === 'conversa'){ await postar('/api/sessao', {projeto: R.name, para: LANC.quem, prompt: texto, mesa}); toast(`Chat do ${quem} aberto. Ele senta ${mesa != null ? 'no PC ' + (mesa + 1) : 'na sala'} quando a sessão começar.`); }
    else { await postar('/api/tarefas', {projeto: R.name, para: LANC.quem, modo: LANC.editar ? 'editar' : 'ler', tarefa: texto, de: 'Eduardo', mesa}); toast(`${quem} a caminho (${LANC.editar ? 'pode editar' : 'só ler'}). O resultado cai no quadro.`); }
    LANC.texto = ''; pcShell = '';
  } catch (err){ toast('Não deu: ' + err.message); }
  finally { if (btn) btn.disabled = false; dirty = true; }
}
async function retomar(fonte, id){
  try { await postar('/api/sessao', {retomar: {fonte, id}, mesa: PC ? PC.mesa : null}); toast(`Conversa do ${fonte === 'codex' ? 'Codex' : 'Claude'} reaberta num terminal`); setTimeout(() => PC && carregarSessoes(PC.R.name, true), 4000); }
  catch (err){ toast('Não deu: ' + err.message); }
}
function pcAcao(act, arg){
  if (act === 'lanc'){
    const [k, v] = String(arg).split(':');
    if (k === 'editar') LANC.editar = !LANC.editar; else LANC[k] = v;
    return true;
  }
  if (act === 'lancar'){ lancar(); return true; }
  if (act === 'retomar'){ const [f, id] = String(arg).split(':'); retomar(f, id); return true; }
  if (act === 'verSessao'){ const [f, id] = String(arg).split(':'); const a = REAL_AGENTS.get(f + ':' + id); if (a){ PC = null; goAgent(a); onSelect(a); } else toast('Essa conversa está aberta num terminal do PC'); return true; }
  if (act === 'pcSala'){ const R = ROOMS[+arg]; if (R) abrirPC(R, primeiraLivre(R) ?? null); return true; }
  if (act === 'pcFechar'){ PC = null; dirty = true; return true; }
  return false;
}
