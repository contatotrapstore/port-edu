// Carrega config.json (ou o exemplo) e o .env, sem dependências.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const AGENT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const ROOT_DIR = path.resolve(AGENT_DIR, '..');

/** Nomes das chaves lidas do agent/.env: não passam para as tarefas delegadas (orquestra.js). */
export const ENV_DO_AGENTE = new Set();
function loadEnv() {
  const file = path.join(AGENT_DIR, '.env');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m || line.trim().startsWith('#')) continue;
    const val = m[2].replace(/^["']|["']$/g, '');
    if (!(m[1] in process.env)) { process.env[m[1]] = val; if (!m[1].startsWith('EDH_')) ENV_DO_AGENTE.add(m[1]); }
  }
}

function loadConfig() {
  const own = path.join(AGENT_DIR, 'config.json');
  const example = path.join(AGENT_DIR, 'config.example.json');
  const file = fs.existsSync(own) ? own : example;
  const cfg = JSON.parse(fs.readFileSync(file, 'utf8'));
  cfg._file = file;
  cfg.rooms = (cfg.rooms || []).map(compileRoom);
  cfg.layout = buildLayout(cfg);
  return cfg;
}
const compileRoom = r => ({ ...r, re: r.match ? new RegExp(r.match, 'i') : null });

/** Troca salas e andares em uso (editor de salas) e grava no config.json, preservando o resto do arquivo. */
export function aplicarSalas(rooms, floors) {
  const salas = rooms.map(r => { const o = { ...r }; delete o.re; delete o.noSlot; return o; });
  for (const r of salas) if (r.match) { if (String(r.match).length > 200) throw new Error('expressão longa demais'); new RegExp(r.match, 'i'); }   // inválida: nada é gravado
  const file = path.join(AGENT_DIR, 'config.json');
  const raw = JSON.parse(fs.readFileSync(fs.existsSync(file) ? file : path.join(AGENT_DIR, 'config.example.json'), 'utf8'));
  raw.rooms = salas; if (floors) raw.floors = floors;
  if (fs.existsSync(file)) fs.copyFileSync(file, file + '.bak');
  fs.writeFileSync(file + '.tmp', JSON.stringify(raw, null, 2) + '\n'); fs.renameSync(file + '.tmp', file);   // gravação atômica
  config.rooms = salas.map(compileRoom); if (floors) config.floors = floors;
  config.layout = buildLayout(config);
  return config.layout;
}

// Vagas de sala por andar no prédio 3D (o resto do andar é área de convivência)
const SLOTS = [[0, 1, 2, 3], [0, 1, 2, 3, 4, 5, 6], [0, 1, 2, 3, 4], [0, 1, 2, 3]];
/** Layout do prédio: andares + salas com vaga. Sala sem vaga livre no andar fica de fora (aviso no log). */
function buildLayout(cfg) {
  const used = SLOTS.map(() => new Set()), rooms = [];
  for (const r of cfg.rooms) if (Number.isInteger(r.slot) && SLOTS[r.floor]?.includes(r.slot)) used[r.floor].add(r.slot);
  for (const r of cfg.rooms) {
    let slot = Number.isInteger(r.slot) && SLOTS[r.floor]?.includes(r.slot) ? r.slot : SLOTS[r.floor]?.find(s => !used[r.floor].has(s));
    if (slot == null) { console.log(`[config] sem vaga no andar ${r.floor} para a sala "${r.room}"; as sessões dela vão para a sala de projetos avulsos`); r.noSlot = true; continue; }
    used[r.floor].add(slot);
    rooms.push({ room: r.room, floor: r.floor, slot, type: r.type || 'project', stack: r.stack || '', cliente: r.cliente || null, budgetBrl: r.budgetBrl || 0, fallback: !!r.fallback });
  }
  if (!rooms.some(r => r.floor === 0 && r.slot === 3 && r.type === 'control')) console.log('[config] a Diretoria (type "control") precisa ficar no térreo, vaga 3: é a mesa do Dudu');
  return { floors: cfg.floors || [], rooms };
}

loadEnv();
export const config = loadConfig();
export const PORT = Number(process.env.EDH_PORT || 4321);
export const CLAUDE_HOME = process.env.CLAUDE_HOME || path.join(os.homedir(), '.claude');
export const CODEX_HOME = process.env.CODEX_HOME || path.join(os.homedir(), '.codex');
export const DATA_DIR = path.join(AGENT_DIR, 'data');
export const CODENOTCH_FRESH_MS = 30 * 60e3; // medidor do Codenotch mais velho que isso: volta para a estimativa / JSONL

export function roomFor(cwd) {
  const norm = String(cwd || '').replace(/\\/g, '/');
  const base = norm.split('/').filter(Boolean).pop() || 'Sem pasta';
  for (const r of config.rooms) if (r.re && !r.noSlot && r.re.test(norm)) return { room: r.room, floor: r.floor, project: r.fallback ? base : r.room };
  // Pasta sem sala: vai para a sala de projetos avulsos, com o nome da pasta como projeto
  const fb = config.rooms.find(r => r.fallback && !r.noSlot);
  return fb ? { room: fb.room, floor: fb.floor, project: base } : { room: base, floor: config.defaultFloor ?? 1, project: base };
}

export function priceFor(model) {
  const p = config.pricing || {};
  const key = Object.keys(p).filter(k => k !== 'default' && !k.startsWith('_')).sort((a, b) => b.length - a.length)
    .find(k => String(model || '').toLowerCase().startsWith(k));
  return p[key] || p.default || { in: 0, out: 0, cacheRead: 0, cacheWrite: 0 };
}
