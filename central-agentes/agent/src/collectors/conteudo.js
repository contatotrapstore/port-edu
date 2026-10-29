// Posts e reels automáticos do Content Studio (mesmo Supabase): resumo por marca a cada 5 min.
// Vem da função public.central_content_summary() (supabase/central-conteudo.sql), que só a service_role executa.
// Aparece no Estúdio do prédio, nas sugestões e no /central. Desligado se faltar o Supabase no .env.
import { store } from '../store.js';

const BASE = String(process.env.SUPABASE_URL || '').replace(/\/+$/, '');
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
let warned = false;

async function poll() {
  try {
    const r = await fetch(`${BASE}/rest/v1/rpc/central_content_summary`, { method: 'POST', headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }, body: '{}', signal: AbortSignal.timeout(20e3) });
    if (!r.ok) { if (!warned) console.log('[conteúdo] resumo indisponível (' + r.status + '): rode supabase/central-conteudo.sql'); warned = true; return; }
    store.content = { at: Date.now(), marcas: await r.json() }; warned = false;
    store.changed();
  } catch (err) { if (!warned) console.log('[conteúdo] sem conexão: ' + err.message); warned = true; }
}

export function startConteudo() {
  if (!BASE || !KEY) return;
  poll(); setInterval(poll, 5 * 60e3);
  console.log('[conteúdo] lendo posts e reels do Content Studio a cada 5 min');
}
