// Central de Agentes · prédio 3D — boot.js
// Carrega os scripts do prédio na ordem certa. Na nuvem (?fonte=nuvem, servido pelo site em /central/predio) faz antes
// o login e busca o estado no Supabase, porque o layout das salas vem dele e precisa existir antes de montar a cena.
(() => {
  const FILES = ['marcas.js', 'dados.js', 'sim.js', 'cena.js', 'ui.js', 'fonte.js', 'app.js'];
  const base = document.currentScript.src.replace(/boot\.js(\?.*)?$/, '');
  const load = () => { for (const f of FILES){ const s = document.createElement('script'); s.src = base + f; s.async = false; document.body.appendChild(s); } };
  const msg = t => { const el = document.getElementById('loading'); if (el) el.textContent = t; };
  const addScript = (src, integrity) => new Promise((ok, bad) => { const s = document.createElement('script'); s.src = src; if (integrity){ s.integrity = integrity; s.crossOrigin = 'anonymous'; } s.onload = ok; s.onerror = bad; document.head.appendChild(s); });
  // Seletor Central | Conteúdo: no PC (localhost) o admin de vídeos e reels abre no site, em outra janela
  const conteudo = document.getElementById('linkConteudo');
  if (conteudo && /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) { conteudo.href = 'https://www.edevshub.com/admin/conteudo'; conteudo.target = '_blank'; conteudo.rel = 'noopener'; }

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
