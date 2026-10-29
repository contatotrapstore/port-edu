// Saldo da ElevenLabs pela API oficial (chave só de leitura no .env).
import { store } from '../store.js';

async function poll() {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) return;
  try {
    const r = await fetch('https://api.elevenlabs.io/v1/user/subscription', { headers: { 'xi-api-key': key } });
    if (!r.ok) { store.plans.eleven = { source: 'erro ' + r.status }; store.changed(); return; }
    const s = await r.json();
    store.plans.eleven = {
      source: 'api', at: Date.now(), tier: s.tier,
      used: s.character_count, limit: s.character_limit,
      resetAt: s.next_character_count_reset_unix ? s.next_character_count_reset_unix * 1000 : 0,
    };
    store.changed();
  } catch (err) {
    store.plans.eleven = { source: 'sem conexão' }; store.changed();
  }
}

export function startElevenLabs() {
  if (!process.env.ELEVENLABS_API_KEY) { console.log('[elevenlabs] sem ELEVENLABS_API_KEY no .env, pulando'); return; }
  poll(); setInterval(poll, 10 * 60e3);
  console.log('[elevenlabs] consultando a cada 10 min');
}
