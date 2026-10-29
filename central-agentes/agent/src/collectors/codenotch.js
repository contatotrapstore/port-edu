// Medidores dos planos lidos do Codenotch (app de uso que o Eduardo já roda no Windows).
// O Codenotch consulta a conta e grava o resultado em %APPDATA%\codenotch\{usage,codex}.json.
// Lendo esses arquivos o agente mostra o mesmo número do Codenotch, sem tocar em token nem em endpoint.
// Formato (conferido em 29/10/2026): { status, windows: [{ id, label, used (0-1), resets_at (ms) }], fetched_at (ms), note }
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { CODENOTCH_FRESH_MS } from '../config.js';
import { store } from '../store.js';

const DIR = process.env.CODENOTCH_DIR || path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'), 'codenotch');

function labelFor(w, prefix = '') {
  if (w.id === 'session') return 'Sessão atual';
  if (w.id === 'weekly_all') return 'Semanal · todos os modelos';
  if (w.id === 'weekly_scoped') { const m = /\(([^)]+)\)/.exec(w.label || ''); return 'Semanal · ' + (m ? m[1] : 'modelo'); }
  if (/weekly/i.test(w.label || '')) return prefix + 'semanal';
  if (/5\s*h|session/i.test(w.label || '')) return prefix + 'janela de 5h';
  return prefix + (w.label || w.id);
}

function read(file) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(DIR, file), 'utf8'));
    if (j.status !== 'ok' || !Array.isArray(j.windows) || Date.now() - (j.fetched_at || 0) > CODENOTCH_FRESH_MS) return null;
    return j;
  } catch { return null; }
}

function poll() {
  const c = read('usage.json');
  if (c) {
    store.plans.claude = {
      source: 'codenotch', at: c.fetched_at,
      meters: c.windows.map(w => ({ label: labelFor(w), usedPct: Number(w.used || 0) * 100, resetAt: w.resets_at || 0, source: 'codenotch' })),
    };
  }
  const x = read('codex.json');
  if (x) {
    store.plans.gpt = {
      source: 'codenotch', at: x.fetched_at, note: String(x.note || '').replace(/Â/g, ''),
      meters: x.windows.map(w => ({ label: labelFor(w, 'Codex · '), usedPct: Number(w.used || 0) * 100, resetAt: w.resets_at || 0, source: 'codenotch' })),
    };
  }
  if (c || x) store.changed();
}

export function startCodenotch() {
  if (!fs.existsSync(DIR)) { console.log(`[codenotch] pasta não encontrada: ${DIR} (usando estimativa)`); return; }
  poll(); setInterval(poll, 30e3);
  console.log(`[codenotch] lendo medidores de ${DIR}`);
}
