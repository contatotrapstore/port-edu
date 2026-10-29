// Teste da sincronização com o Supabase sem rede: troca a API REST por uma falsa em memória.
// Uso: node scripts/teste-nuvem.mjs
process.env.SUPABASE_URL = 'https://teste.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-teste';

const db = { office_state: new Map(), permission_requests: new Map(), office_control: new Map() };
const calls = [];
globalThis.fetch = async (url, opts = {}) => {
  const u = new URL(url), table = u.pathname.split('/').pop(), method = opts.method || 'GET', body = opts.body ? JSON.parse(opts.body) : null;
  calls.push(method + ' ' + table);
  const eq = [...u.searchParams].filter(([, v]) => v.startsWith('eq.')).map(([k, v]) => [k, decodeURIComponent(v.slice(3))]);
  const match = row => eq.every(([k, v]) => String(row[k]) === v);
  if (method === 'POST') { for (const r of body) db[table].set(r.id, { ...(db[table].get(r.id) || {}), ...r }); return new Response(null, { status: 201 }); }
  if (method === 'PATCH') { for (const r of db[table].values()) if (match(r)) Object.assign(r, body); return new Response(null, { status: 204 }); }
  return new Response(JSON.stringify([...db[table].values()].filter(match)), { status: 200 });
};

const { store } = await import('../src/store.js');
const { startNuvem } = await import('../src/nuvem.js');
const wasAway = store.away;
const wait = ms => new Promise(r => setTimeout(r, ms));
const check = (cond, msg) => { console.log((cond ? 'ok   ' : 'FALHA') + ' ' + msg); if (!cond) process.exitCode = 1; };

const a = store.agent('claude:teste-nuvem', { source: 'claude', cwd: 'C:/Users/x/Downloads/Planet' });
a.prompt = 'segredo do cliente'; a.target = 'C:/Users/x/Downloads/Planet/.env'; store.touch(a);
startNuvem();
await wait(300);
const st = db.office_state.get('principal')?.state;
check(!!st && st.agents.some(x => x.room === 'PlanetShake'), 'estado sobe para office_state');
check(!JSON.stringify(st).includes('segredo') && !JSON.stringify(st).includes('.env'), 'prompt e caminho não sobem');

const pedido = store.requestPermission(a, 'Bash', { command: 'rm -rf build' }, 30e3);
await wait(200);
const row = [...db.permission_requests.values()][0];
check(row?.status === 'pending' && row.tool === 'Bash' && !JSON.stringify(row).includes('rm -rf'), 'pedido espelhado sem o comando');

Object.assign(row, { status: 'decided', decision: 'deny' });   // o site respondeu
const r = await pedido;
check(r?.decision === 'deny', 'Negar no site resolve o pedido no agente');
await wait(100);
check(row.status === 'resolved', 'pedido marcado como resolvido na nuvem');

db.office_control.set('principal', { id: 'principal', away: false, updated_at: 't1' });
await wait(10500);   // primeira leitura só guarda a referência; a seguinte aplica
db.office_control.set('principal', { id: 'principal', away: true, updated_at: 't2' });
await wait(10500);
check(store.away === true, 'modo ausente ligado pelo site chega no agente');
store.setAway(wasAway, 'site');
process.exit();
