// Central de Agentes · prédio 3D — boot.js
// Carrega os scripts do prédio na ordem certa. Na nuvem (?fonte=nuvem, servido pelo site em /central/predio) faz antes
// o login e busca o estado no Supabase, porque o layout das salas vem dele e precisa existir antes de montar a cena.
(() => {
  // No site, o prédio só abre com login (dados reais da nuvem); sem "?fonte=nuvem" não mostra mais dados de exemplo
  const local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const nuvemPedida = new URLSearchParams(location.search).get('fonte') === 'nuvem';
  if (!local && !nuvemPedida){ location.replace('/central/predio?fonte=nuvem'); return; }
  // sem o agente (token) e sem a nuvem não há dados: avisa e não monta o prédio (o resto dos scripts nem carrega)
  if (!nuvemPedida && !window.EDH_TOKEN){ const el = document.getElementById('loading'); if (el) el.textContent = 'Abra pelo app do PC (localhost:4321) ou pelo site /central'; return; }
  const FILES = ['marcas.js', 'dados.js', 'sim.js', 'cena.js', 'fachada.js', 'ui.js', 'fonte.js', 'pc.js', 'tv.js', 'app.js'];
  const base = document.currentScript.src.replace(/boot\.js(\?.*)?$/, '');
  const load = () => { for (const f of FILES){ const s = document.createElement('script'); s.src = base + f; s.async = false; document.body.appendChild(s); } };
  const msg = t => { const el = document.getElementById('loading'); if (el) el.textContent = t; };
  const addScript = (src, integrity) => new Promise((ok, bad) => { const s = document.createElement('script'); s.src = src; if (integrity){ s.integrity = integrity; s.crossOrigin = 'anonymous'; } s.onload = ok; s.onerror = bad; document.head.appendChild(s); });
  // Seletor Central | Conteúdo: alterna na mesma janela. No app do PC (localhost) vai para o admin do site com "volta=pc",
  // e o "Central" do admin traz de volta para este prédio (mesma janela, mesmo perfil do Chrome)
  const conteudo = document.getElementById('linkConteudo');
  if (conteudo && local) conteudo.href = 'https://www.edevshub.com/admin/conteudo?volta=pc';

  async function nuvem(){
    msg('Entrando na Central…');
    const cfg = await fetch('/central/config.json', {cache: 'no-store'}).then(r => r.json()).catch(() => null);
    if (!cfg || !cfg.supabaseUrl){ window.EDH_NUVEM_ERRO = 'Central sem Supabase configurado'; return; }
    await addScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.118.0/dist/umd/supabase.min.js', 'sha384-UagCvVPT5XXA0Hx+nJYUAGBFseHT9zBgpJMSebsAxl9lciTwbT+39j5VfRjdP5Tp');
    await addScript(base + 'sessao.js');   // sessão em cookie, a mesma do admin (/admin)
    const sb = window.edhSupabase(cfg.supabaseUrl, cfg.supabaseAnonKey);
    const {data: {session}} = await sb.auth.getSession();
    if (!session){ location.href = '/central'; throw new Error('sem login'); }
    window.EDH_SB = sb;
    const {data, error} = await sb.from('office_state').select('state').eq('id', 'principal').maybeSingle();
    if (error){ window.EDH_NUVEM_ERRO = 'Sem acesso: ' + error.message; return; }
    if (data && data.state){ window.EDH_FIRST_STATE = data.state; window.EDH_LAYOUT = data.state.layout || null; }
  }

  if (new URLSearchParams(location.search).get('fonte') === 'nuvem') nuvem().then(load, err => { if (err.message !== 'sem login') { window.EDH_NUVEM_ERRO = 'Não consegui abrir a nuvem: ' + err.message; load(); } });
  else load();
})();
