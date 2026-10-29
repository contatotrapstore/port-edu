// Painel da Central de Agentes no site (/central). Script externo para a página rodar com CSP sem 'unsafe-inline'.
// Lê o resumo sanitizado que o agente do PC espelha no Supabase (office_state, permission_requests, office_control).
var dirty = false;   // marcas.js marca "redesenhar" quando o ícone em imagem carrega; aqui não há canvas

(async () => {
  const $ = id => document.getElementById(id);
  const show = id => ['vNoConfig', 'vLogin', 'vNoAccess', 'vApp'].forEach(v => $(v).hidden = v !== id);
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  let toastT; const toast = m => { const t = $('toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2600); };
  const ST = {working: ['var(--ok)', 'Trabalhando'], waiting: ['var(--wait)', 'Precisa de você'], error: ['var(--err)', 'Erro'], idle: ['var(--idle)', 'Ocioso']};
  const OFFLINE_MS = 3 * 60e3;   // o PC manda sinal a cada 60 s; sem sinal por 3 min = desligado ou sem internet
  const MARGEM_MS = 5e3;         // o banco só aceita resposta com mais de 5 s antes de expirar
  const cfg = await fetch('/central/config.json', {cache: 'no-store'}).then(r => r.json()).catch(() => null);
  if (!cfg || !cfg.supabaseUrl || !window.supabase) return show('vNoConfig');
  const sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);

  $('fLogin').addEventListener('submit', async e => {
    e.preventDefault();
    const btn = e.submitter; btn.disabled = true;
    const {error} = await sb.auth.signInWithOtp({email: $('email').value.trim(), options: {shouldCreateUser: false, emailRedirectTo: location.origin + '/central'}});   // só contas que já existem (mesmo Supabase do Content Studio)
    btn.disabled = false;
    // mensagem igual para conta existente ou não (não revela quais e-mails têm cadastro); só limite de envio é dito
    $('loginMsg').textContent = error && /rate|limit|seconds/i.test(error.message) ? 'Muitos pedidos seguidos. Espere um minuto e tente de novo.'
      : 'Se este e-mail tiver acesso, o link chega em instantes. Abra o e-mail neste aparelho.';
  });
  $('sair').addEventListener('click', () => sb.auth.signOut());
  sb.auth.onAuthStateChange(ev => { if (ev === 'SIGNED_OUT') location.reload(); });

  const {data: {session}} = await sb.auth.getSession();
  if (!session) return show('vLogin');
  $('sair').hidden = false;

  const {data: admin} = await sb.rpc('is_central_admin');
  if (!admin){ $('grantSql').textContent = `insert into public.central_admins (user_id) values ('${session.user.id}') on conflict do nothing;`; return show('vNoAccess'); }

  let state = null, perms = [], awayPedido = null;
  const brl = usd => 'R$ ' + (usd * ((state && state.usdBrl) || 5.4)).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  const dur = ms => { const m = Math.round(ms / 60e3); return m < 60 ? m + ' min' : m < 2880 ? Math.floor(m / 60) + 'h' + String(m % 60).padStart(2, '0') : Math.round(m / 1440) + ' dias'; };
  const resetTxt = ts => { if (!ts) return ''; const ms = ts - Date.now(); return ms <= 0 ? 'reiniciou' : 'reinicia em ' + dur(ms); };
  const restante = p => p.expires_at ? Date.parse(p.expires_at) - Date.now() : Infinity;

  function renderPerms(){
    const open = perms.filter(p => p.status === 'pending' && restante(p) > 0);
    $('cPerm').hidden = !open.length;
    $('perms').innerHTML = open.map(p => {
      const ms = restante(p), da = ms > MARGEM_MS;
      const oque = p.resumo ? `<b>${esc(p.tool)}</b> <code>${esc(p.resumo)}</code>` : `<b>${esc(p.tool)}</b>`;
      return `<div class="perm"><p><b>${esc(p.room)}</b> quer usar ${oque}.<br><span class="note">${ms === Infinity ? '' : da ? `Responda em ${Math.ceil(ms / 1e3)} s · ` : 'Tempo esgotando · '}o comando completo fica no PC e no Telegram.</span></p>`
        + (da ? `<div class="row"><button class="ok" type="button" data-id="${esc(p.id)}" data-d="allow">Permitir</button><button class="no" type="button" data-id="${esc(p.id)}" data-d="deny">Negar</button></div>` : '') + '</div>';
    }).join('');
  }

  function render(){
    renderPerms();
    if (!state) return;
    const ag = state.agents || [], rooms = state.rooms || [];
    const idade = Date.now() - (Date.parse(state.updatedAt) || 0), off = idade > OFFLINE_MS;   // updatedAt vem em ISO
    $('offline').hidden = !off;
    if (off) $('offline').textContent = `O PC está sem sinal há ${dur(idade)} (desligado, dormindo ou sem internet). Os números abaixo são de ${new Date(state.updatedAt).toLocaleString('pt-BR', {day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}.`;
    $('kCost').textContent = brl(rooms.reduce((t, r) => t + (r.costUsdToday || 0), 0));
    $('kTasks').textContent = rooms.reduce((t, r) => t + (r.tasksToday || 0), 0);
    $('kUpd').textContent = 'atualizado às ' + new Date(state.updatedAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'});
    $('chips').innerHTML = ['working', 'waiting', 'error', 'idle'].map(s => `<span class="chip"><i class="dot" style="background:${ST[s][0]}"></i>${ST[s][1]} <b>${ag.filter(a => a.state === s).length}</b></span>`).join('');
    if (awayPedido !== null && awayPedido === !!state.away) awayPedido = null;   // o PC aplicou
    const aplicando = awayPedido !== null;
    $('awayTxt').textContent = aplicando ? `Aplicando no PC… (${awayPedido ? 'ligando' : 'desligando'})` : state.away ? 'Ligado: pedidos de permissão chegam aqui e no Telegram.' : 'Desligado: pedidos ficam no terminal do PC.';
    $('awayBtn').textContent = state.away ? 'Desligar' : 'Ligar'; $('awayBtn').className = state.away ? '' : 'solid'; $('awayBtn').disabled = aplicando;
    const order = {waiting: 0, error: 1, working: 2, idle: 3};
    $('agents').innerHTML = [...ag].sort((a, b) => order[a.state] - order[b.state]).map(a => `<li class="ag"><i class="dot" style="background:${ST[a.state][0]}"></i><span class="t"><b>${esc(a.room)}</b><small>${esc(a.name)} · ${ST[a.state][1]}${a.state === 'working' && a.tool ? ' · ' + esc(a.tool) : ''}</small></span><em>${brl(a.costUsdToday || 0)}</em></li>`).join('') || '<li class="note">Nenhuma sessão aberta.</li>';
    const marcas = (state.content && state.content.marcas) || [];
    $('cConteudo').hidden = !marcas.length;
    $('conteudo').innerHTML = marcas.map(m => `<div class="row" style="margin:6px 0"><i class="dot" style="background:${m.erroPublicador || (m.saudeInstagram && m.saudeInstagram !== 'verified') ? 'var(--err)' : 'var(--ok)'}"></i><b style="flex:1">@${esc(m.instagram || m.marca)}</b><span class="note" style="margin:0">${m.publicacao ? 'publicando' : 'pausado'}</span></div>
      <p class="note" style="margin:0 0 6px">${m.publicadosHoje} hoje · ${m.agendados} agendados · ${m.emRevisao} esperando aprovação${m.proximos && m.proximos[0] ? ' · próximo ' + esc(m.proximos[0].quando) : ''}</p>`).join('');
    const deps = state.deploys || [], COR = {READY: 'var(--ok)', ERROR: 'var(--err)', BLOCKED: 'var(--err)', BUILDING: 'var(--wait)'};
    $('cDeploys').hidden = !deps.length;
    $('deploys').innerHTML = deps.map(d => `<li class="ag"><i class="dot" style="background:${COR[d.estado] || 'var(--idle)'}"></i><span class="t"><b>${esc(d.projeto)}</b><small>${esc(d.sala)} · ${d.estado === 'READY' ? 'no ar' : esc(String(d.estado).toLowerCase())}</small></span><em class="url">${esc(d.url || '')}</em></li>`).join('');
    const info = state.planInfo || {}, plans = state.plans || {};
    const head = (k, n) => `<div class="row" style="margin:12px 0 2px">${window.brandIcon ? brandIcon(k, 28) : ''}<b style="flex:1">${esc(n)}</b><span class="note" style="margin:0">${esc(info[k]?.tier || '')}</span></div>`;
    const meter = m => { const p = Math.round(m.usedPct), c = p > 85 ? 'var(--err)' : p > 60 ? 'var(--amber)' : 'var(--ok)';
      return `<div class="meter"><div class="top"><span>${esc(String(m.label).replace(/^Codex · /, ''))}</span><b>${p}%</b></div><div class="bar"><i style="width:${Math.min(100, p)}%;background:${c}"></i></div><p class="note">${resetTxt(m.resetAt)}</p></div>`; };
    const el = plans.eleven || {}, hg = info.higgs || {};
    $('plans').innerHTML = [['claude', 'Claude'], ['gpt', 'ChatGPT']].map(([k, n]) => head(k, n) + ((plans[k]?.meters || []).map(meter).join('') || '<p class="note">Sem leitura ainda.</p>')).join('')
      + head('eleven', 'ElevenLabs') + (el.limit ? meter({label: `${(el.limit - el.used).toLocaleString('pt-BR')} créditos restantes`, usedPct: el.used / el.limit * 100, resetAt: el.resetAt}) : `<p class="note">${esc(el.source || 'sem leitura')}</p>`)
      + head('higgs', 'Higgsfield') + `<p class="note">${hg.manualCreditsTotal ? `${hg.manualCreditsLeft} de ${hg.manualCreditsTotal} créditos` : `Plano ${esc(hg.tier || '—')} · ${hg.manualCreditsLeft ?? 0} créditos`}</p>`;
  }

  const loadState = async () => { const {data} = await sb.from('office_state').select('state').eq('id', 'principal').maybeSingle(); if (data) state = data.state; render(); if (!state) $('kUpd').textContent = 'sem dados: o agente do PC está ligado?'; };
  const loadPerms = async () => { const {data} = await sb.from('permission_requests').select('*').eq('status', 'pending').order('created_at', {ascending: false}).limit(20); perms = data || []; renderPerms(); };
  show('vApp'); $('sub').textContent = session.user.email;
  await loadState(); loadPerms();

  sb.channel('central')
    .on('postgres_changes', {event: '*', schema: 'public', table: 'office_state', filter: 'id=eq.principal'}, p => { if (p.new && p.new.state){ state = p.new.state; render(); } })
    .on('postgres_changes', {event: '*', schema: 'public', table: 'permission_requests'}, () => loadPerms())
    .subscribe();
  setInterval(render, 30e3);
  setInterval(() => { if (perms.length) renderPerms(); }, 1e3);   // contagem regressiva dos pedidos
  // celular volta do bloqueio/segundo plano: o tempo real pode ter caído, então busca de novo
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible'){ loadState(); loadPerms(); } });

  $('perms').addEventListener('click', async e => {
    const b = e.target.closest('button[data-id]'); if (!b) return;
    b.parentElement.querySelectorAll('button').forEach(x => x.disabled = true);
    const {error, count} = await sb.from('permission_requests').update({decision: b.dataset.d, status: 'decided', decided_at: new Date().toISOString(), decided_by: session.user.id}, {count: 'exact'}).eq('id', b.dataset.id).eq('status', 'pending');
    toast(error ? 'Não consegui responder: ' + error.message : count ? (b.dataset.d === 'allow' ? 'Permitido. Chega no PC em poucos segundos.' : 'Negado.') : 'Esse pedido já foi respondido ou expirou');
    loadPerms();
  });
  $('awayBtn').addEventListener('click', async () => {
    const on = !(state && state.away);
    awayPedido = on; render();
    const {error} = await sb.from('office_control').upsert({id: 'principal', away: on, updated_at: new Date().toISOString()});
    if (error){ awayPedido = null; render(); return toast('Não consegui mudar: ' + error.message); }
    toast(on ? 'Pedido enviado. O PC liga o modo ausente em até 10 s.' : 'Pedido enviado. O PC desliga o modo ausente em até 10 s.');
    // PC desligado não aplica: libera o botão depois de 30 s
    setTimeout(() => { if (awayPedido === on){ awayPedido = null; render(); toast('O PC não confirmou. Ele está ligado?'); } }, 30e3);
  });
})();
