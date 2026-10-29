// EXPERIMENTAL e DESLIGADO por padrão (config.plans.claude.experimentalOauthUsage).
// Algumas ferramentas de uso para Windows leem o uso do plano direto da conta, com o token
// OAuth local do Claude Code. O endpoint NÃO é documentado e pode mudar ou sumir.
// Antes de ligar: descobrir qual método a ferramenta que o Eduardo usa adota e replicar o mesmo.
// O token nunca sai desta máquina e nunca é logado.
import fs from 'node:fs';
import path from 'node:path';
import { CLAUDE_HOME, config } from '../config.js';
import { store } from '../store.js';

const URL_USAGE = 'https://api.anthropic.com/api/oauth/usage'; // conferir com a ferramenta de referência

function token() {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(CLAUDE_HOME, '.credentials.json'), 'utf8'));
    return j.claudeAiOauth?.accessToken || null;
  } catch { return null; }
}

async function poll() {
  const tk = token(); if (!tk) return;
  try {
    const r = await fetch(URL_USAGE, { headers: { Authorization: 'Bearer ' + tk, 'anthropic-beta': 'oauth-2025-04-20' } });
    if (!r.ok) { console.log('[claude-plan] resposta', r.status, '(mantendo estimativa)'); return; }
    const u = await r.json();
    const m = (label, w) => w ? { label, usedPct: Number(w.utilization ?? 0), resetAt: w.resets_at ? Date.parse(w.resets_at) : 0, source: 'conta' } : null;
    store.plans.claude = { source: 'oauth', at: Date.now(), meters: [m('Sessão atual', u.five_hour), m('Semanal · todos os modelos', u.seven_day), m('Semanal · Opus', u.seven_day_opus)].filter(Boolean) };
    store.changed();
  } catch { /* silencioso: cai na estimativa */ }
}

export function startClaudePlan() {
  if (!config.plans?.claude?.experimentalOauthUsage) return;
  console.log('[claude-plan] EXPERIMENTAL ligado');
  poll(); setInterval(poll, 5 * 60e3);
}
