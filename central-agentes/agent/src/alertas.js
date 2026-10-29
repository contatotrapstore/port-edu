// Alertas para o celular (Telegram; sem bot configurado, vão para o log):
// - plano em 90% ou que, no ritmo atual, acaba antes do reinício (só com leitura confiável: Codenotch, Codex, conta)
// - projeto que passou do orçamento do dia (config.json → rooms[].budgetBrl)
// - site fora do ar (config.json → uptime), uma vez por site por dia
// Cada alerta sai uma vez por janela (ou por dia, no orçamento). As chaves já enviadas ficam em data/alertas.json.
import fs from 'node:fs';
import path from 'node:path';
import { config, DATA_DIR } from './config.js';
import { store } from './store.js';
import { notify } from './telegram.js';
import { dayKey } from './history.js';

const FILE = path.join(DATA_DIR, 'alertas.json');
const H5 = 5 * 3600e3, D7 = 7 * 86400e3;
const RELIABLE = new Set(['codenotch', 'codex', 'oauth']);
const esc = s => String(s ?? '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const brl = v => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const when = ts => new Date(ts).toLocaleString('pt-BR', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
const span = ms => { const m = Math.max(1, Math.round(ms / 60e3)); return m < 60 ? m + ' min' : m < 2880 ? Math.floor(m / 60) + 'h' + String(m % 60).padStart(2, '0') : Math.round(m / 1440) + ' dias'; };

let sent = new Set();
function mark(key) { sent.add(key); try { fs.writeFileSync(FILE, JSON.stringify([...sent].slice(-500))); } catch { /* ok */ } }

/** Projeção de um medidor: usado agora e quando acaba no ritmo atual (null se não acaba antes do reinício). */
export function projectMeter(m, now = Date.now()) {
  const win = /semanal|dias/i.test(m.label) ? D7 : H5;
  const elapsed = Math.min(1, Math.max(0.02, 1 - (m.resetAt - now) / win));
  const rate = m.usedPct / (elapsed * win);
  const at = m.usedPct + rate * (m.resetAt - now);
  return { elapsed, endsIn: at > 100 && rate > 0 ? (100 - m.usedPct) / rate : null };
}

function check() {
  const s = store.snapshot(), now = Date.now();
  for (const [k, nome] of [['claude', 'Claude'], ['gpt', 'Codex']]) {
    const plan = s.plans[k];
    if (!plan || !RELIABLE.has(plan.source)) continue;
    for (const m of plan.meters || []) {
      if (!m.resetAt || m.resetAt <= now) continue;
      const key = `${k}|${m.label}|${m.resetAt}`, p = projectMeter(m, now);
      if (m.usedPct >= 90 && !sent.has(key + '|90')) {
        mark(key + '|90');
        notify(`🚨 <b>${nome} · ${esc(m.label)}</b> em ${Math.round(m.usedPct)}%. Reinicia ${when(m.resetAt)}.`);
      } else if (m.usedPct >= 25 && p.elapsed > 0.1 && p.endsIn != null && !sent.has(key + '|ritmo')) {
        mark(key + '|ritmo');
        notify(`⚠️ <b>${nome} · ${esc(m.label)}</b> em ${Math.round(m.usedPct)}%. No ritmo atual acaba em ${span(p.endsIn)}, antes do reinício (${when(m.resetAt)}).`);
      }
    }
  }
  const usdBrl = config.usdBrl || 5.4, today = dayKey();
  for (const m of s.content?.marcas || []) {
    const k = `ig|${m.marca}|${today}`;
    if (m.erroPublicador && !sent.has(k + '|pub')) { mark(k + '|pub'); notify(`📸 <b>@${esc(m.instagram || m.marca)}</b>: o publicador do Content Studio registrou erro. Confira em /admin.`); }
    if (m.instagram && m.saudeInstagram && m.saudeInstagram !== 'verified' && !sent.has(k + '|saude')) { mark(k + '|saude'); notify(`📸 <b>@${esc(m.instagram)}</b>: conexão com o Instagram "${esc(m.saudeInstagram)}". Os posts automáticos podem parar.`); }
    if (m.tokenExpiraEm && Date.parse(m.tokenExpiraEm) - Date.now() < 7 * 86400e3 && !sent.has(k + '|token')) { mark(k + '|token'); notify(`📸 <b>@${esc(m.instagram || m.marca)}</b>: o acesso ao Instagram expira em ${when(Date.parse(m.tokenExpiraEm))}. Renove no Content Studio.`); }
    if (m.jobsFalhos24h > 0 && !sent.has(k + '|jobs')) { mark(k + '|jobs'); notify(`📸 <b>${esc(m.marca)}</b>: ${m.jobsFalhos24h} geração(ões) de post falharam nas últimas 24 h.`); }
  }
  for (const u of s.uptime || []) {
    const key = `site|${u.site}|${today}`;
    if (!u.ok && !sent.has(key)) { mark(key); notify(`🌐 <b>${esc(u.site)}</b> fora do ar (${u.status ? 'HTTP ' + u.status : esc(u.erro || 'sem resposta')}).`); }
  }
  for (const r of config.rooms || []) {
    if (!r.budgetBrl) continue;
    const d = s.rooms.find(x => x.room === r.room); if (!d) continue;
    const spent = d.costUsdToday * usdBrl, key = `orc|${r.room}|${today}`;
    if (spent > r.budgetBrl && !sent.has(key)) {
      mark(key);
      notify(`💸 <b>${esc(r.room)}</b> passou do orçamento do dia: ${brl(spent)} de ${brl(r.budgetBrl)} (equivalente em API). Confira se algum agente está em loop.`);
    }
  }
}

export function startAlertas() {
  try { sent = new Set(JSON.parse(fs.readFileSync(FILE, 'utf8'))); } catch { sent = new Set(); }
  setTimeout(() => { check(); setInterval(check, 60e3); }, 20e3); // espera os coletores lerem o dia
  console.log('[alertas] conferindo planos e orçamentos a cada minuto');
}
