// Carrega config.json (ou o exemplo) e o .env, sem dependências.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const AGENT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const ROOT_DIR = path.resolve(AGENT_DIR, '..');

function loadEnv() {
  const file = path.join(AGENT_DIR, '.env');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m || line.trim().startsWith('#')) continue;
    const val = m[2].replace(/^["']|["']$/g, '');
    if (!(m[1] in process.env)) process.env[m[1]] = val;
  }
}

function loadConfig() {
  const own = path.join(AGENT_DIR, 'config.json');
  const example = path.join(AGENT_DIR, 'config.example.json');
  const file = fs.existsSync(own) ? own : example;
  const cfg = JSON.parse(fs.readFileSync(file, 'utf8'));
  cfg._file = file;
  cfg.rooms = (cfg.rooms || []).map(r => ({ ...r, re: new RegExp(r.match, 'i') }));
  return cfg;
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
  for (const r of config.rooms) if (r.re.test(norm)) return { room: r.room, floor: r.floor };
  const base = norm.split('/').filter(Boolean).pop() || 'Sem pasta';
  return { room: base, floor: config.defaultFloor ?? 1 };
}

export function priceFor(model) {
  const p = config.pricing || {};
  const key = Object.keys(p).filter(k => k !== 'default' && !k.startsWith('_')).sort((a, b) => b.length - a.length)
    .find(k => String(model || '').toLowerCase().startsWith(k));
  return p[key] || p.default || { in: 0, out: 0, cacheRead: 0, cacheWrite: 0 };
}
