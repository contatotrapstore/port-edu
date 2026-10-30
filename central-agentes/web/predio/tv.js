// Central de Agentes · prédio 3D — tv.js
// Modo TV (tecla V): o prédio vira painel de recepção. Marca e "ao vivo" no alto, relógio, legenda do andar que está passando,
// números grandes do dia, quem está trabalhando agora e uma faixa com o que acabou de acontecer. Atualiza 1×/s.

const TV_LOGO = '<svg viewBox="0 0 30 30" width="34" height="34" aria-hidden="true"><rect x="3" y="3" width="5" height="24" rx="2.5" fill="#EDE6D6"/><rect x="22" y="3" width="5" height="24" rx="2.5" fill="#EDE6D6"/><rect x="8" y="13.5" width="3" height="3" fill="#EDE6D6"/><rect x="19" y="13.5" width="3" height="3" fill="#EDE6D6"/><circle cx="15" cy="15" r="2.6" fill="#F5B935"/></svg>';
let tvUlt = 0, tvAndar = '', tvAndarAte = 0, tvFaixa = null, tvMontado = false;

function tvMontar(el){
  el.innerHTML = `
    <div class="tv-brand">${TV_LOGO}<div><b>EDevsHub</b><small>Central de Agentes</small></div><span class="tv-live"><i></i>AO VIVO</span></div>
    <div class="tv-floor" id="tvAndar"><small>Agora na tela</small><b id="tvAndarNome"></b><span id="tvAndarSub"></span></div>
    <div class="tv-side">
      <div class="tv-clock"><b id="tvHora"></b><small id="tvData"></small></div>
      <div class="tv-kpis">
        <div><small>Consumo hoje</small><b id="tvGasto"></b></div>
        <div><small>Tarefas hoje</small><b id="tvTarefas"></b></div>
        <div><small>Trabalhando</small><b id="tvTrab" style="color:var(--ok)"></b></div>
        <div id="tvEspBox"><small>Precisam de você</small><b id="tvEsp"></b></div>
      </div>
      <div class="tv-now"><small>Agora</small><ul id="tvAgora"></ul></div>
    </div>
    <div class="tv-ticker"><div class="tv-track" id="tvTrack"></div></div>`;
  tvMontado = true; tvFaixa = null;
}

function tvTick(now){
  if (!document.body.classList.contains('tv')) return;
  if (now - tvUlt < 1000) return; tvUlt = now;
  const el = $('tvHud'); if (!el) return;
  if (!tvMontado) tvMontar(el);
  const d = new Date();
  $('tvHora').textContent = d.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'});
  $('tvData').textContent = d.toLocaleDateString('pt-BR', {weekday: 'long', day: 'numeric', month: 'long'});
  const trab = AGENTS.filter(a => a.state === 'working'), esp = AGENTS.filter(a => a.state === 'waiting'), err = AGENTS.filter(a => a.state === 'error'), fim = AGENTS.filter(a => vis(a) === 'done');
  // legenda do andar: aparece por alguns segundos quando o andar troca
  const andar = view.building ? 'O prédio inteiro' : FLOORS[view.floor].short + ' · ' + FLOORS[view.floor].name;
  if (andar !== tvAndar){ tvAndar = andar; tvAndarAte = now + 6000; }
  const salas = view.building ? ROOMS : ROOMS.filter(R => R.f === view.floor);
  const ativos = salas.reduce((n, R) => n + R.agents.filter(a => a.state !== 'idle').length, 0);
  $('tvAndar').classList.toggle('on', now < tvAndarAte);
  $('tvAndarNome').textContent = tvAndar;
  $('tvAndarSub').textContent = `${salas.length} salas · ${ativos} ${ativos === 1 ? 'pessoa trabalhando' : 'pessoas trabalhando'}`;
  $('tvGasto').textContent = brlFromUsd(totalCost());
  $('tvTarefas').textContent = COMPANY.tasks;
  $('tvTrab').textContent = trab.length;
  $('tvEsp').textContent = esp.length; $('tvEspBox').classList.toggle('alert', esp.length > 0);
  setHTML($('tvAgora'), [...esp, ...err, ...fim, ...trab].slice(0, 6).map(a => `<li><i style="background:${ST[vis(a)]}"></i><span><b>${esc(a.R.name)}</b><small>${esc(a.name)}${a.state === 'working' && a.tool ? ' · ' + esc(TOOL_PT[a.tool] || a.tool) : a.state === 'waiting' ? ' · precisa de você' : a.state === 'error' ? ' · erro' : vis(a) === 'done' ? ' · terminou, não visto' : ''}</small></span></li>`).join('') || '<li class="vazio">Todo mundo em pausa</li>');
  // faixa: só troca quando chega coisa nova (trocar a cada segundo reiniciaria a animação)
  // num telão não aparecem comandos nem textos de pedido: só quem fez o quê (sala · acontecimento)
  // erro de ferramenta (um comando que falhou) é comum e assusta no telão: o erro de verdade já aparece no "Agora" e na cor do boneco
  const FRASE = {done: 'concluiu', wait: 'pediu sua permissão', prompt: 'recebeu um pedido novo'};
  const ev = FEED.slice(0, 16).map(e => {
    const sala = (e.a && e.a.R && e.a.R.name) || '', frase = e.kind in FRASE ? FRASE[e.kind] : null;
    if (!sala || sala === 'Sessão encerrada') return '';
    // ferramentas (ler, editar, rodar comando) mudam toda hora: a faixa fica só com o que importa
    return frase ? `<span><b>${esc(sala)}</b> ${frase}</span>` : '';
  }).filter(Boolean).filter((x, i, arr) => arr.indexOf(x) === i).slice(0, 10);
  const chave = ev.join('|');
  if (chave !== tvFaixa){
    tvFaixa = chave; const track = $('tvTrack'), lista = ev.join('<em>•</em>');
    // com poucos acontecimentos a faixa fica parada (rolar 2 itens em loop parecia repetido)
    const rola = ev.length >= 4; track.classList.toggle('parado', !rola);
    track.innerHTML = !ev.length ? '<span>Sem novidades por enquanto</span>' : rola ? lista + '<em>•</em>' + lista : lista;
  }
}
