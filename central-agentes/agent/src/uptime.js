// Monitor dos sites (config.json → uptime): confere a cada 5 min e guarda 24 h em memória.
// Aparece na tela da sala de TI e entra no estado como `uptime: [{ site, ok, status, ms, upPct, at }]`.
import { config } from './config.js';
import { store } from './store.js';

const EVERY = 5 * 60e3, KEEP = 24 * 3600e3;
const hist = new Map();   // url -> [[t, ok]]

async function checkOne(url) {
  const t0 = Date.now();
  try {
    const r = await fetch(url, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(15e3), headers: { 'user-agent': 'CentralDeAgentes-Uptime/1.0' } });
    return { ok: r.status < 500, status: r.status, ms: Date.now() - t0 };
  } catch (err) { return { ok: false, status: 0, ms: Date.now() - t0, erro: err.name === 'TimeoutError' ? 'sem resposta em 15 s' : 'sem conexão' }; }
}

const falhas = new Map();   // url -> falhas seguidas
async function check() {
  const out = [];
  for (const url of config.uptime || []) {
    const r = await checkOne(url), now = Date.now();
    const h = (hist.get(url) || []).filter(([t]) => now - t < KEEP); h.push([now, r.ok]); hist.set(url, h);
    falhas.set(url, r.ok ? 0 : (falhas.get(url) || 0) + 1);
    out.push({ site: url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''), ...r, falhasSeguidas: falhas.get(url), upPct: Math.round(h.filter(([, ok]) => ok).length / h.length * 1e4) / 100, at: now });
  }
  // todos fora ao mesmo tempo = o PC está sem internet, não os sites
  store.semInternet = out.length > 1 && out.every(u => !u.ok && !u.status);
  store.uptime = out; store.changed();
}

export function startUptime() {
  if (!(config.uptime || []).length) return;
  check(); setInterval(check, EVERY);
  console.log(`[uptime] conferindo ${config.uptime.length} sites a cada 5 min`);
}
