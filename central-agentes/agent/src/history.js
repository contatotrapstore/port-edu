// Histórico em disco (agent/data, fora do git):
// - AAAA-MM-DD.jsonl: linha do tempo das sessões (sala e estado), para o replay do prédio. Grava quando algo muda,
//   ou a cada 60 s; confere a cada 2 s. Mantém KEEP_DAYS dias.
// - custos.json: custo e tarefas por sala por dia, sem prazo de validade (relatório por cliente).
import fs from 'node:fs';
import path from 'node:path';
import { DATA_DIR } from './config.js';
import { store } from './store.js';

const KEEP_DAYS = 7;
const COSTS_FILE = path.join(DATA_DIR, 'custos.json');
const pad = n => String(n).padStart(2, '0');
export const dayKey = (t = Date.now()) => { const d = new Date(t); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };

let lastSig = '', lastWrite = 0;
let costs = {};

function tick() {
  const now = Date.now();
  const rows = store.snapshot().agents.map(a => [a.id, a.room, a.floor, a.state, a.name, a.model]);
  const sig = JSON.stringify(rows.map(r => [r[0], r[1], r[3]]));
  if (sig === lastSig && now - lastWrite < 60e3) return;
  lastSig = sig; lastWrite = now;
  fs.appendFile(path.join(DATA_DIR, dayKey(now) + '.jsonl'), JSON.stringify({ t: now, a: rows }) + '\n', () => {});
}

function saveCosts() {
  const k = dayKey(), today = { ...(costs[k] || {}) };
  for (const r of store.snapshot().rooms) {
    // custo: o agente recalcula lendo as sessões ao subir, então o valor atual vale; tarefas antigas do dia não voltam, então guarda o maior
    today[r.room] = { floor: r.floor, costUsd: Math.round(r.costUsdToday * 1e4) / 1e4, tasks: Math.max(r.tasksToday, today[r.room]?.tasks || 0) };
  }
  costs[k] = today;
  fs.writeFile(COSTS_FILE, JSON.stringify(costs, null, 1), () => {});
}

function prune() {
  const limit = dayKey(Date.now() - KEEP_DAYS * 86400e3);
  for (const f of fs.readdirSync(DATA_DIR)) if (/^\d{4}-\d{2}-\d{2}\.jsonl$/.test(f) && f.slice(0, 10) < limit) fs.rmSync(path.join(DATA_DIR, f), { force: true });
}

/** Linhas do dia (AAAA-MM-DD), opcionalmente só a partir de `since` (ms). */
export function readHistory(date, since = 0) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return [];
  const file = path.join(DATA_DIR, date + '.jsonl');
  if (!fs.existsSync(file)) return [];
  const out = [];
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    if (!line) continue;
    try { const r = JSON.parse(line); if (r.t >= since) out.push(r); } catch { /* linha cortada */ }
  }
  return out;
}

export const readCosts = () => costs;

export function startHistory() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  try { costs = JSON.parse(fs.readFileSync(COSTS_FILE, 'utf8')); } catch { costs = {}; }
  prune(); setInterval(prune, 6 * 3600e3);
  setInterval(tick, 2000);
  // espera os coletores lerem as sessões do dia antes de gravar o primeiro custo
  setTimeout(() => { saveCosts(); setInterval(saveCosts, 60e3); }, 15e3);
  console.log(`[histórico] gravando em ${DATA_DIR} (linha do tempo: ${KEEP_DAYS} dias; custos: sem prazo)`);
}
