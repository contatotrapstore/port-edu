// Pareia o bot do Telegram com o seu chat: espera um /start, grava TELEGRAM_CHAT_ID no agent/.env e confirma.
// Antes: crie o bot no @BotFather e coloque TELEGRAM_BOT_TOKEN=... no agent/.env. Uso: npm run telegram:parear
import fs from 'node:fs';
import path from 'node:path';
import { AGENT_DIR } from '../src/config.js';

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ENV = path.join(AGENT_DIR, '.env');
if (!TOKEN) { console.error('Falta TELEGRAM_BOT_TOKEN no agent/.env. Crie o bot no @BotFather (/newbot) e cole o token lá.'); process.exit(1); }

const call = async (method, body) => {
  const r = await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json(); if (!j.ok) throw new Error(j.description); return j.result;
};

const me = await call('getMe', {}).catch(err => { console.error('Token recusado pelo Telegram:', err.message); process.exit(1); });
console.log(`Bot @${me.username} encontrado. Abra https://t.me/${me.username} e mande /start (espero 3 minutos).`);
console.log('Se o agente estiver rodando com o bot ligado, ele pode disputar as mensagens; tudo bem, é só repetir.');

let offset = 0;
const until = Date.now() + 3 * 60e3;
while (Date.now() < until) {
  const ups = await call('getUpdates', { offset, timeout: 25, allowed_updates: ['message'] }).catch(() => []);
  for (const u of ups) {
    offset = u.update_id + 1;
    const m = u.message;
    if (!m || m.chat?.type !== 'private' || !/^\/start/.test(m.text || '')) continue;
    const id = String(m.chat.id);
    let env = fs.existsSync(ENV) ? fs.readFileSync(ENV, 'utf8') : '';
    env = /^TELEGRAM_CHAT_ID=.*$/m.test(env) ? env.replace(/^TELEGRAM_CHAT_ID=.*$/m, 'TELEGRAM_CHAT_ID=' + id) : env.replace(/\s*$/, '') + '\nTELEGRAM_CHAT_ID=' + id + '\n';
    fs.writeFileSync(ENV, env);
    await call('getUpdates', { offset, timeout: 0 }).catch(() => {}); // confirma a leitura para o agente não ver este /start de novo
    await call('sendMessage', { chat_id: id, text: 'Pareado com a Central de Agentes. Reinicie o agente; depois mande /status para testar e /fora quando sair do PC.' });
    console.log(`Pareado com ${m.from?.first_name || 'você'} (chat ${id}). TELEGRAM_CHAT_ID gravado no agent/.env. Reinicie o agente.`);
    process.exit(0);
  }
}
console.error('Nenhum /start chegou em 3 minutos. Rode de novo.');
process.exit(1);
