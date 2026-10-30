// Histórico em disco (agent/data, fora do git):
// - custos.json: custo e tarefas por projeto por dia, sem prazo de validade (relatório por cliente, gráfico de 7 dias).
// - AAAA-MM-DD.jsonl: linha do tempo do antigo replay; não é mais gravada e os arquivos antigos somem em KEEP_DAYS dias.
import fs from 'node:fs';
import path from 'node:path';
import { DATA_DIR } from './config.js';
import { store } from './store.js';

const KEEP_DAYS = 7;
const COSTS_FILE = path.join(DATA_DIR, 'custos.json');
const pad = n => String(n).padStart(2, '0');
export const dayKey = (t = Date.now()) => { const d = new Date(t); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };

let costs = {};

function saveCosts() {
  const k = dayKey(), today = { ...(costs[k] || {}) };
  for (const p of store.dayTotals().projects) {
    // por projeto (na sala de avulsos, cada pasta separada). O custo é recalculado das sessões ao subir; tarefas: guarda o maior
    today[p.project] = { room: p.room, floor: p.floor, costUsd: Math.round(p.costUsdToday * 1e4) / 1e4, tasks: Math.max(p.tasksToday, today[p.project]?.tasks || 0) };
  }
  costs[k] = today;
  fs.writeFile(COSTS_FILE, JSON.stringify(costs, null, 1), () => {});
}

function prune() {
  const limit = dayKey(Date.now() - KEEP_DAYS * 86400e3);
  for (const f of fs.readdirSync(DATA_DIR)) if (/^\d{4}-\d{2}-\d{2}\.jsonl$/.test(f) && f.slice(0, 10) < limit) fs.rmSync(path.join(DATA_DIR, f), { force: true });
}

export const readCosts = () => costs;

export function startHistory() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  try { costs = JSON.parse(fs.readFileSync(COSTS_FILE, 'utf8')); } catch { costs = {}; }
  prune(); setInterval(prune, 6 * 3600e3);
  // espera os coletores lerem as sessões do dia antes de gravar o primeiro custo
  setTimeout(() => { saveCosts(); setInterval(saveCosts, 60e3); }, 15e3);
  console.log(`[histórico] custos por projeto em ${DATA_DIR}`);
}
