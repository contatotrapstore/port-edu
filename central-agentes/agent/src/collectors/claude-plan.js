// Medidores do plano do Claude (sessão de 5 h e semanais) lidos direto da conta, com o login local do Claude Code.
// É o mesmo dado que o /usage do Claude Code e apps de uso (ex.: Codenotch) mostram. Endpoint não documentado:
// se mudar ou falhar, os medidores ficam com a última leitura e o painel mostra a hora dela.
// O token nunca sai desta máquina para outro lugar e nunca é logado.
import fs from 'node:fs';
import path from 'node:path';
import { CLAUDE_HOME } from '../config.js';
import { store } from '../store.js';

const URL_USAGE = 'https://api.anthropic.com/api/oauth/usage';
const INTERVALO = 3 * 60e3;
let espera = 0;   // depois de recusa por excesso de consultas, aguarda antes de tentar de novo

function token() {
  try { return JSON.parse(fs.readFileSync(path.join(CLAUDE_HOME, '.credentials.json'), 'utf8')).claudeAiOauth?.accessToken || null; }
  catch { return null; }
}
const NOME = { session: 'Sessão atual', weekly_all: 'Semanal · todos os modelos' };

/** Converte a resposta em medidores: usa a lista "limits" (tem o nome do modelo); senão, os campos antigos. */
export function medidores(u) {
  const ms = Date.parse;
  if (Array.isArray(u.limits) && u.limits.length) {
    return u.limits.filter(l => typeof l.percent === 'number').map(l => ({
      label: NOME[l.kind] || (l.kind === 'weekly_scoped' ? 'Semanal · ' + (l.scope?.model?.display_name || 'modelo') : l.kind),
      usedPct: l.percent, resetAt: l.resets_at ? ms(l.resets_at) : 0, source: 'conta',
    }));
  }
  const m = (label, w) => w && typeof w.utilization === 'number' ? { label, usedPct: w.utilization, resetAt: w.resets_at ? ms(w.resets_at) : 0, source: 'conta' } : null;
  return [m('Sessão atual', u.five_hour), m('Semanal · todos os modelos', u.seven_day)].filter(Boolean);
}

async function poll() {
  if (Date.now() < espera) return;
  const tk = token(); if (!tk) return;
  try {
    const r = await fetch(URL_USAGE, { headers: { Authorization: 'Bearer ' + tk, 'anthropic-beta': 'oauth-2025-04-20' }, signal: AbortSignal.timeout(15e3) });
    if (r.status === 429) { espera = Date.now() + 5 * 60e3; console.log('[claude-plan] conta pediu para esperar (429): nova tentativa em 5 min'); return; }
    if (!r.ok) { console.log('[claude-plan] resposta', r.status, '(mantendo a última leitura)'); return; }
    const meters = medidores(await r.json());
    if (meters.length) { store.plans.claude = { source: 'conta', at: Date.now(), meters }; store.changed(); }
  } catch { /* sem internet: mantém a última leitura */ }
}

export function startClaudePlan() {
  console.log('[claude-plan] medidores do Claude direto da conta a cada 3 min');
  poll(); setInterval(poll, INTERVALO);
}
