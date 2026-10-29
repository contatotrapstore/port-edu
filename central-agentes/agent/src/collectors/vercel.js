// Deploys da Vercel: último deploy de cada projeto ligado a uma sala (config.json → rooms[].vercel).
// Usa o login da Vercel CLI deste PC (%APPDATA%/com.vercel.cli/Data/auth.json), só leitura, todas as contas/times.
// Aparece na sala de TI, no cartão do projeto e gera alerta quando um deploy de produção falha.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { config } from '../config.js';
import { store } from '../store.js';

const DIR = path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'), 'com.vercel.cli', 'Data');
const token = () => { try { return JSON.parse(fs.readFileSync(path.join(DIR, 'auth.json'), 'utf8')).token; } catch { return null; } };

/** nome do projeto na Vercel -> sala */
function mapa() {
  const m = new Map();
  for (const r of config.rooms || []) for (const n of [].concat(r.vercel || [])) m.set(String(n).toLowerCase(), r.room);
  return m;
}

async function poll() {
  const tk = token(); if (!tk) return;
  const h = { Authorization: 'Bearer ' + tk }, alvo = mapa(), visto = new Set(), out = [];
  try {
    const teams = (await (await fetch('https://api.vercel.com/v2/teams', { headers: h, signal: AbortSignal.timeout(20e3) })).json()).teams || [];
    for (const scope of [null, ...teams]) {
      const j = await (await fetch('https://api.vercel.com/v9/projects?limit=100' + (scope ? '&teamId=' + scope.id : ''), { headers: h, signal: AbortSignal.timeout(20e3) })).json();
      for (const p of j.projects || []) {
        if (visto.has(p.id)) continue; visto.add(p.id);
        const sala = alvo.get(p.name.toLowerCase()); if (!sala) continue;
        const d = (p.latestDeployments || []).sort((a, b) => b.createdAt - a.createdAt)[0];
        const prod = (p.targets?.production) || null;
        out.push({ sala, projeto: p.name, estado: d?.readyState || 'sem deploy', alvo: d?.target || '', quando: d?.createdAt || 0, url: prod?.alias?.[0] || d?.url || '', producao: prod ? { estado: prod.readyState, quando: prod.createdAt, id: prod.id } : null });
      }
    }
    store.deploys = out.sort((a, b) => b.quando - a.quando); store.changed();
  } catch (err) { console.log('[vercel] ' + err.message); }
}

export function startVercel() {
  if (!token()) { console.log('[vercel] sem login da Vercel CLI neste PC, pulando'); return; }
  if (!mapa().size) { console.log('[vercel] nenhuma sala com "vercel" no config.json, pulando'); return; }
  poll(); setInterval(poll, 5 * 60e3);
  console.log(`[vercel] acompanhando ${mapa().size} projetos a cada 5 min`);
}
