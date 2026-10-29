// Bot do Telegram: aprovar permissões e acompanhar os agentes pelo celular.
// Long polling saindo do PC (não precisa de URL pública). Só obedece ao chat em TELEGRAM_CHAT_ID.
// Configurar: TELEGRAM_BOT_TOKEN no agent/.env (criado no @BotFather) e depois `npm run telegram:parear`.
// O que vai para o Telegram: sala, nome da sessão, ferramenta e o comando pedido (para você decidir). Prompts não vão.
import { config } from './config.js';
import { store } from './store.js';

const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const CHAT = String(process.env.TELEGRAM_CHAT_ID || '');
const esc = s => String(s ?? '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const brl = usd => 'R$ ' + (usd * (config.usdBrl || 5.4)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const permMsgs = new Map();   // id do pedido -> { message_id, text }
const lastNote = new Map();   // agente -> horário do último aviso (para não inundar)
let offset = 0;

export const telegramReady = () => !!(TOKEN && CHAT);

async function call(method, body) {
  // long polling espera até 50 s; o resto, 20 s (depois de o PC hibernar a conexão pode ficar presa)
  const r = await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(method === 'getUpdates' ? 70e3 : 20e3) });
  const j = await r.json().catch(() => ({}));
  if (!j.ok) throw Object.assign(new Error(j.description || 'HTTP ' + r.status), { code: j.error_code || r.status });
  return j.result;
}

/** Mensagem para o seu chat (alertas e avisos). Sem Telegram configurado, só registra no log. */
export async function notify(html, extra = {}) {
  if (!telegramReady()) { console.log('[aviso]', html.replace(/<[^>]+>/g, '')); return null; }
  try { return await call('sendMessage', { chat_id: CHAT, text: html, parse_mode: 'HTML', disable_web_page_preview: true, ...extra }); }
  catch (err) { console.log('[telegram] falha ao enviar:', err.message); return null; }
}

function statusText() {
  const s = store.snapshot(), ag = s.agents;
  const n = st => ag.filter(a => a.state === st).length;
  const cost = s.rooms.reduce((t, r) => t + r.costUsdToday, 0), tasks = s.rooms.reduce((t, r) => t + r.tasksToday, 0);
  const meters = ['claude', 'gpt'].flatMap(k => (s.plans[k]?.meters || []).map(m => `• ${k === 'claude' ? 'Claude' : 'Codex'} · ${esc(m.label)}: <b>${Math.round(m.usedPct)}%</b>`));
  const busy = ag.filter(a => a.state !== 'idle').map(a => `• ${esc(a.room)} · ${esc(a.name)}: ${a.state === 'waiting' ? '✋ esperando você' : a.state === 'error' ? '❌ erro' : '🟢 ' + esc(a.tool || 'trabalhando')}`);
  return [`<b>Central de Agentes</b> ${store.away ? '· modo ausente ligado' : ''}`,
    `🟢 ${n('working')} trabalhando · ✋ ${n('waiting')} esperando · ❌ ${n('error')} erro · 💤 ${n('idle')} ociosos`,
    `Hoje: <b>${brl(cost)}</b> equivalente em API · ${tasks} tarefas`, '', ...meters, ...(busy.length ? ['', ...busy] : [])].join('\n');
}

const HELP = ['<b>Comandos</b>', '/status — resumo agora', '/fora — modo ausente: pedidos de permissão chegam aqui com botões', '/voltei — desliga o modo ausente (pedidos voltam para o terminal)'].join('\n');

async function onMessage(m) {
  const chat = String(m.chat?.id || ''), text = String(m.text || '').trim().split(/\s|@/)[0].toLowerCase();
  if (chat !== CHAT) return; // outro chat: ignora em silêncio
  if (text === '/fora') { store.setAway(true, 'telegram'); return notify('🧳 Modo ausente <b>ligado</b>. Pedidos de permissão vão chegar aqui. Mande /voltei quando estiver no PC.'); }
  if (text === '/voltei') { store.setAway(false, 'telegram'); return notify('💻 Modo ausente <b>desligado</b>. Pedidos voltam para o terminal (ou para o painel aberto).'); }
  if (text === '/status') return notify(statusText());
  return notify(HELP);
}

async function onCallback(q) {
  const chat = String(q.message?.chat?.id || '');
  const [kind, id, d] = String(q.data || '').split(':');
  if (chat !== CHAT || kind !== 'p') return call('answerCallbackQuery', { callback_query_id: q.id, text: 'Não autorizado' }).catch(() => {});
  const ok = store.resolvePermission(id, d === 'a' ? 'allow' : 'deny', d === 'a' ? undefined : 'Negado pelo Telegram');
  await call('answerCallbackQuery', { callback_query_id: q.id, text: ok ? (d === 'a' ? 'Permitido' : 'Negado') : 'Esse pedido já foi respondido ou expirou' }).catch(() => {});
}

async function poll() {
  for (;;) {
    try {
      const ups = await call('getUpdates', { offset, timeout: 50, allowed_updates: ['message', 'callback_query'] });
      for (const u of ups) {
        offset = u.update_id + 1;
        if (u.message) await onMessage(u.message).catch(() => {});
        if (u.callback_query) await onCallback(u.callback_query).catch(() => {});
      }
    } catch (err) {
      console.log('[telegram]', err.code === 409 ? 'outro programa está lendo este bot (o pareamento está aberto?); tentando de novo em 30 s' : 'sem conexão: ' + err.message);
      await new Promise(r => setTimeout(r, err.code === 409 ? 30e3 : 5e3));
    }
  }
}

function throttled(key, ms) { const t = lastNote.get(key) || 0; if (Date.now() - t < ms) return true; lastNote.set(key, Date.now()); return false; }

export function startTelegram() {
  if (!TOKEN) { console.log('[telegram] sem TELEGRAM_BOT_TOKEN no .env, pulando'); return; }
  if (!CHAT) { console.log('[telegram] falta TELEGRAM_CHAT_ID: rode `npm run telegram:parear` e mande /start para o bot'); return; }

  // Pedido de permissão com botões, só no modo ausente (no PC o pedido aparece no painel ou no terminal)
  store.on('permission', async p => {
    if (!store.away) return;
    const text = `🔐 <b>${esc(p.room)}</b> · ${esc(p.name)}\nquer usar <b>${esc(p.tool)}</b>:\n<code>${esc(String(p.text).slice(0, 300))}</code>\n\nSem resposta em ${Math.round(p.timeoutMs / 60e3)} min, volta para o terminal.`;
    const msg = await notify(text, { reply_markup: { inline_keyboard: [[{ text: '✅ Permitir', callback_data: `p:${p.id}:a` }, { text: '⛔ Negar', callback_data: `p:${p.id}:d` }]] } });
    if (msg) permMsgs.set(p.id, { message_id: msg.message_id, text });
  });
  store.on('permission-resolved', ({ id, decision }) => {
    const m = permMsgs.get(id); if (!m) return; permMsgs.delete(id);
    const tail = decision === 'allow' ? '✅ Permitido' : decision === 'deny' ? '⛔ Negado' : '⌛ Sem resposta: voltou para o terminal';
    call('editMessageText', { chat_id: CHAT, message_id: m.message_id, text: m.text.split('\n\nSem resposta')[0] + '\n\n' + tail, parse_mode: 'HTML' }).catch(() => {});
  });
  // No modo ausente, avisa erro e fim de turno (para você saber que pode mandar a próxima tarefa)
  store.on('event', (e, a) => {
    if (!store.away) return;
    if (e.kind === 'err' && !throttled('err:' + a.id, 5 * 60e3)) notify(`❌ <b>${esc(a.room)}</b> · ${esc(a.name)}\n${esc(String(e.text).slice(0, 200))}`);
    if (e.kind === 'done' && e.tag === 'Concluído' && !throttled('done:' + a.id, 2 * 60e3)) notify(`✅ <b>${esc(a.room)}</b> · ${esc(a.name)} terminou o turno e espera a próxima tarefa`);
    if (e.kind === 'wait' && !a.pendingId && !throttled('wait:' + a.id, 5 * 60e3)) notify(`✋ <b>${esc(a.room)}</b> · ${esc(a.name)} pede permissão no terminal`);
  });
  store.on('away', (on, origem) => { if (origem !== 'telegram') notify(on ? '🧳 Modo ausente ligado pelo painel.' : '💻 Modo ausente desligado pelo painel.'); });

  call('setMyCommands', { commands: [{ command: 'status', description: 'Resumo agora' }, { command: 'fora', description: 'Ligar o modo ausente' }, { command: 'voltei', description: 'Desligar o modo ausente' }] }).catch(() => {});
  poll();
  console.log('[telegram] bot ligado' + (store.away ? ' (modo ausente ligado)' : ''));
}
