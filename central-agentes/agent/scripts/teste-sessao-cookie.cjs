// Confere que o sessao.js (Central, /central) e o @supabase/ssr do site (admin, /admin) leem e gravam o mesmo cookie de sessão.
// Usa o @supabase/ssr instalado na raiz do site (npm install lá). Uso: node scripts/teste-sessao-cookie.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const SITE = path.resolve(__dirname, '..', '..', '..');
const daRaiz = m => require.resolve(m, { paths: [SITE] });
let SSR, COOKIE;
try { SSR = path.join(path.dirname(daRaiz('@supabase/ssr/package.json')), 'dist', 'main', 'cookies.js'); COOKIE = daRaiz('cookie'); }
catch { console.log('pulado · @supabase/ssr não instalado na raiz do site (rode npm install lá)'); process.exit(0); }
const { createStorageFromOptions } = require(SSR);
const { serialize } = require(COOKIE);

// navegador falso: um pote de cookies com a semântica de document.cookie
const pote = new Map();
const documentoFalso = {
  get cookie() { return [...pote].map(([k, v]) => `${k}=${v}`).join('; '); },
  set cookie(linha) {
    const [par, ...attrs] = linha.split(/;\s*/); const i = par.indexOf('=');
    const nome = par.slice(0, i), valor = par.slice(i + 1);
    const idade = attrs.find(a => /^max-age=/i.test(a));
    if (idade && Number(idade.split('=')[1]) <= 0) pote.delete(nome); else pote.set(nome, valor);
  },
};
const ctx = { document: documentoFalso, location: { protocol: 'https:' }, window: {}, localStorage: { getItem: () => null, removeItem() {} }, TextEncoder, TextDecoder, btoa, atob, URL, Uint8Array, String, Object, Set, JSON };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', '..', 'web', 'predio', 'sessao.js'), 'utf8'), ctx);
const central = ctx.window.edhSessaoCookie;

// lado do admin: @supabase/ssr no servidor, lendo/gravando o mesmo pote (como os cabeçalhos Cookie/Set-Cookie)
const { storage: admin } = createStorageFromOptions({
  cookieEncoding: 'base64url',
  cookies: {
    getAll: () => [...pote].map(([name, value]) => ({ name, value: decodeURIComponent(value) })),
    setAll: lista => { for (const { name, value, options } of lista) documentoFalso.cookie = serialize(name, value, options); },
  },
}, false);   // modo que grava na hora; o servidor usa o mesmo formato ao fim da requisição

const CHAVE = 'sb-kcjshrnjkrmtzgpwnygc-auth-token';
const sessao = (n) => JSON.stringify({ access_token: 'a'.repeat(n), refresh_token: 'r123', user: { email: 'gouveia@exemplo.com', nome: 'Eduardo · ação' } });

(async () => {
  for (const tam of [200, 9000]) {   // 9000: passa de 3180 e vira cookies .0 .1 .2
    pote.clear();
    central.setItem(CHAVE, sessao(tam));
    assert.equal(await admin.getItem(CHAVE), sessao(tam), `admin lê o que a Central gravou (${tam})`);
    if (tam > 3180) assert.ok(pote.has(CHAVE + '.0') && !pote.has(CHAVE), 'dividido em pedaços');

    pote.clear();
    await admin.setItem(CHAVE, sessao(tam));
    await new Promise(r => setTimeout(r, 0));
    assert.equal(central.getItem(CHAVE), sessao(tam), `Central lê o que o admin gravou (${tam})`);

    central.removeItem(CHAVE);
    assert.equal([...pote.keys()].filter(k => k.startsWith(CHAVE)).length, 0, 'sair apaga todos os pedaços');
  }
  // sessão grande que encolhe: pedaços velhos somem
  pote.clear(); central.setItem(CHAVE, sessao(9000)); central.setItem(CHAVE, sessao(100));
  assert.deepEqual([...pote.keys()].filter(k => k.startsWith(CHAVE)), [CHAVE]);
  assert.equal(await admin.getItem(CHAVE), sessao(100));
  // chave vizinha (verificador do PKCE) não é apagada junto
  pote.clear(); central.setItem(CHAVE + '-code-verifier', '"abc"'); central.setItem(CHAVE, sessao(50)); central.removeItem(CHAVE);
  assert.equal(central.getItem(CHAVE + '-code-verifier'), '"abc"');
  console.log('ok · Central e admin compartilham a sessão (pequena, em pedaços, encolhendo e saindo)');
})().catch(e => { console.error('FALHOU', e.message); process.exit(1); });
