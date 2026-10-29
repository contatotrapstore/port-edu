// Teste do bot do Telegram sem rede: troca a API do Telegram por uma falsa e confere o fluxo de ponta a ponta.
// Uso: node scripts/teste-telegram.mjs   (não precisa de token real; não mexe no agente que estiver rodando)
process.env.TELEGRAM_BOT_TOKEN = 'teste:token';
process.env.TELEGRAM_CHAT_ID = '111';

const sent = [], edits = [], answers = [];
let queue = [];
let updateId = 1;
const push = u => queue.push({ update_id: updateId++, ...u });
globalThis.fetch = async (url, opts) => {
  const method = String(url).split('/').pop(), body = JSON.parse(opts?.body || '{}');
  const ok = result => new Response(JSON.stringify({ ok: true, result }));
  if (method === 'getUpdates') { await new Promise(r => setTimeout(r, 50)); const out = queue; queue = []; return ok(out); }
  if (method === 'sendMessage') { sent.push(body); return ok({ message_id: sent.length }); }
  if (method === 'editMessageText') { edits.push(body); return ok(true); }
  if (method === 'answerCallbackQuery') { answers.push(body); return ok(true); }
  return ok(true);
};

const { store } = await import('../src/store.js');
const { startTelegram } = await import('../src/telegram.js');
const wasAway = store.away;
startTelegram();
const wait = ms => new Promise(r => setTimeout(r, ms));
const check = (cond, msg) => { console.log((cond ? 'ok   ' : 'FALHA') + ' ' + msg); if (!cond) process.exitCode = 1; };

push({ message: { chat: { id: 999 }, text: '/fora' } });                    // chat estranho
await wait(200);
check(!store.away || wasAway, 'chat desconhecido é ignorado');

push({ message: { chat: { id: 111 }, text: '/status' } });
await wait(200);
check(sent.some(m => /Central de Agentes/.test(m.text)), '/status responde com o resumo');

push({ message: { chat: { id: 111 }, text: '/fora' } });
await wait(200);
check(store.away === true, '/fora liga o modo ausente');

const a = store.agent('claude:teste-tg', { source: 'claude', cwd: 'C:/Users/x/Downloads/Planet' });
const pedido = store.requestPermission(a, 'Bash', { command: 'npm run deploy' }, 60e3);
await wait(100);
const msg = sent.at(-1);
check(/PlanetShake/.test(msg.text) && /npm run deploy/.test(msg.text) && msg.reply_markup?.inline_keyboard?.[0]?.length === 2, 'pedido chega com sala, comando e dois botões');

const data = msg.reply_markup.inline_keyboard[0][0].callback_data;
push({ callback_query: { id: 'cb1', data, message: { chat: { id: 111 } } } });
const r = await pedido;
await wait(100);
check(r?.decision === 'allow', 'Permitir no Telegram libera o pedido no agente');
check(edits.some(e => /Permitido/.test(e.text)), 'mensagem é editada com o resultado');

push({ callback_query: { id: 'cb2', data, message: { chat: { id: 111 } } } });
await wait(200);
check(answers.some(x => x.callback_query_id === 'cb2' && /já foi respondido|expirou/.test(x.text)), 'segundo clique avisa que já foi respondido');

push({ message: { chat: { id: 111 } , text: '/voltei' } });
await wait(200);
check(store.away === false, '/voltei desliga o modo ausente');
store.setAway(wasAway, 'teste');
process.exit();
