// Codenotch (app de uso dos planos) só enquanto a Central está FECHADA.
// - Central aberta (o app do atalho ou qualquer aba do prédio local conectada ao agente, mesmo minimizada): fecha o Codenotch.
// - Central fechada e Claude ou Codex rodando: abre o Codenotch (espera alguns segundos, para um recarregar da página não piscar).
// - Sem Claude nem Codex abertos: fecha (como fazia o antigo vigia %LOCALAPPDATA%\CodenotchWatch\watch.ps1, que fica desligado).
// Desligar: config.json → "codenotch": { "gerenciar": false }.
import fs from 'node:fs';
import path from 'node:path';
import { spawn, execFile } from 'node:child_process';
import { config } from './config.js';
import { paineisConectados } from './server.js';

const EXE = config.codenotch?.exe || path.join(process.env.LOCALAPPDATA || '', 'Codenotch', 'codenotch.exe');
const INTERVALO = 3000, ESPERA_ABRIR = 10e3;
let fechadaDesde = 0, ultimoEstado = '';

/** Processos que interessam, numa chamada só ao tasklist (nomes em minúsculas). */
function processos() {
  return new Promise(res => execFile('tasklist', ['/FO', 'CSV', '/NH'], { windowsHide: true, maxBuffer: 8 << 20 }, (err, out) => {
    if (err) return res(null);
    res(new Set(String(out).split(/\r?\n/).map(l => (l.match(/^"([^"]+)"/) || [])[1]).filter(Boolean).map(n => n.toLowerCase())));
  }));
}
const registrar = e => { if (e !== ultimoEstado) { ultimoEstado = e; console.log('[codenotch] ' + e); } };

async function tick() {
  const ps = await processos(); if (!ps) return;
  const rodando = ps.has('codenotch.exe');
  const agentes = ps.has('claude.exe') || ps.has('codex.exe');
  const central = paineisConectados() > 0;
  if (central) fechadaDesde = 0; else if (!fechadaDesde) fechadaDesde = Date.now();
  const deveRodar = agentes && !central && Date.now() - fechadaDesde >= ESPERA_ABRIR;
  if (deveRodar && !rodando) {
    try { spawn(EXE, [], { detached: true, stdio: 'ignore', windowsHide: false }).unref(); registrar('aberto (Central fechada)'); } catch (err) { registrar('não abriu: ' + err.message); }
  } else if (!deveRodar && rodando && (central || !agentes)) {
    execFile('taskkill', ['/IM', 'codenotch.exe', '/F'], { windowsHide: true }, () => {});
    registrar(central ? 'fechado (Central aberta)' : 'fechado (sem Claude nem Codex abertos)');
  }
}

export function startCodenotch() {
  if (process.platform !== 'win32' || config.codenotch?.gerenciar === false) return;
  if (!fs.existsSync(EXE)) { console.log('[codenotch] não instalado em ' + EXE + ' (nada a fazer)'); return; }
  console.log('[codenotch] só com a Central fechada (abre com Claude/Codex rodando, fecha quando a Central abre)');
  setTimeout(tick, 5000); setInterval(tick, INTERVALO);
}
