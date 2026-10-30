// Sessão do Supabase guardada em cookie, no mesmo formato do @supabase/ssr usado pelo Content Studio (/admin):
// entrar na Central entra no admin e vice-versa; sair de um sai dos dois. Usa o supabase-js UMD já carregado (window.supabase).
// Formato: cookie "sb-<projeto>-auth-token" com "base64-" + base64url(JSON), dividido em .0, .1… acima de 3180 caracteres.
(function(){
  const PREFIXO = 'base64-', PEDACO = 3180, IDADE = 400 * 24 * 60 * 60;
  const seguro = location.protocol === 'https:' ? '; Secure' : '';
  const dec = v => { try { return decodeURIComponent(v); } catch { return v; } };
  const cookies = () => {
    const out = {};
    for (const c of document.cookie.split(/;\s*/)) { const i = c.indexOf('='); if (i > 0) out[c.slice(0, i)] = dec(c.slice(i + 1)); }
    return out;
  };
  const gravar = (nome, valor, idade) => { document.cookie = `${nome}=${encodeURIComponent(valor)}; Path=/; Max-Age=${idade}; SameSite=Lax${seguro}`; };
  const paraB64 = s => { const b = new TextEncoder().encode(s); let bin = ''; for (let i = 0; i < b.length; i++) bin += String.fromCharCode(b[i]); return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
  const deB64 = s => { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; const bin = atob(s); return new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0))); };
  // a própria chave e os pedaços dela (chave.0, chave.1…), sem pegar outras chaves que começam igual
  const nomesDe = (todos, chave) => Object.keys(todos).filter(n => n === chave || (n.startsWith(chave + '.') && /^\d+$/.test(n.slice(chave.length + 1))));

  const armazenamento = {
    getItem(chave){
      const t = cookies();
      let v = t[chave] != null ? t[chave] : null;
      if (v == null) { const partes = []; for (let i = 0; t[chave + '.' + i] != null; i++) partes.push(t[chave + '.' + i]); v = partes.length ? partes.join('') : null; }
      if (v == null || !v.startsWith(PREFIXO)) return v;
      try { const s = deB64(v.slice(PREFIXO.length)); JSON.parse(s); return s; } catch { return null; }   // pedaços misturados: trata como sem sessão
    },
    setItem(chave, valor){
      const cod = PREFIXO + paraB64(valor), novos = [];
      if (cod.length <= PEDACO) novos.push([chave, cod]);
      else for (let i = 0, k = 0; i < cod.length; i += PEDACO, k++) novos.push([chave + '.' + k, cod.slice(i, i + PEDACO)]);
      const ficam = new Set(novos.map(n => n[0]));
      for (const n of nomesDe(cookies(), chave)) if (!ficam.has(n)) gravar(n, '', 0);
      for (const [n, v] of novos) gravar(n, v, IDADE);
    },
    removeItem(chave){ for (const n of nomesDe(cookies(), chave)) gravar(n, '', 0); },
  };

  /** Cliente do Supabase com a sessão compartilhada com o /admin. */
  window.edhSupabase = (url, chaveAnon) => {
    const storageKey = 'sb-' + new URL(url).hostname.split('.')[0] + '-auth-token';
    // sessão antiga da Central (guardada no navegador antes do login único): passa para o cookie uma vez
    try {
      const antiga = localStorage.getItem(storageKey);
      if (antiga) { if (!armazenamento.getItem(storageKey)) armazenamento.setItem(storageKey, antiga); localStorage.removeItem(storageKey); }
    } catch {}
    return window.supabase.createClient(url, chaveAnon, { auth: { storage: armazenamento, storageKey, flowType: 'pkce', persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
  };
  window.edhSessaoCookie = armazenamento;   // para testes
})();
