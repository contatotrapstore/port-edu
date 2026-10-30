// Conversas do Claude Code e do Codex de cada sala, para o painel "Continuar uma conversa" (clique num PC do prédio).
// Junta as sessões vistas agora (estado) com as antigas (arquivos em ~/.claude/projects e ~/.codex/sessions, últimos 30 dias).
// Só lê o começo de cada arquivo (título = primeiro pedido); o resultado fica em cache por 60 s.
import fs from 'node:fs';
import path from 'node:path';
import { CLAUDE_HOME, CODEX_HOME, roomFor } from './config.js';
import { store } from './store.js';
import { listFiles, promptText } from './util.js';

const DIAS = 30, CABECA = 256 * 1024, CACHE_MS = 60e3;
let cache = { t: 0, lista: [] };

/** Primeiras linhas JSON de um arquivo (lê só o começo). */
function cabeca(file, max = CABECA) {
  let fd; try {
    fd = fs.openSync(file, 'r'); const buf = Buffer.alloc(max); const n = fs.readSync(fd, buf, 0, max, 0);
    const linhas = buf.subarray(0, n).toString('utf8').split('\n'); if (n === max) linhas.pop();   // última pode estar cortada
    return linhas.map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  } catch { return []; } finally { if (fd !== undefined) fs.closeSync(fd); }
}
const DELEGADA = /pela Central de Agentes \(projeto/;
const titulo = t => String(t || '').replace(/\s+/g, ' ').trim().slice(0, 140);

function claude() {
  const out = [], base = path.join(CLAUDE_HOME, 'projects');
  for (const f of listFiles(base, n => n.endsWith('.jsonl'), DIAS * 86400e3)) {
    if (/[\\/]subagents[\\/]/.test(f.file) || f.size < 200) continue;
    let cwd = '', primeiro = '', resumo = '', auto = false;
    for (const e of cabeca(f.file)) {
      if (!cwd && e.cwd) cwd = e.cwd;
      if (/^sdk/.test(e.entrypoint || '')) auto = true;   // claude -p / SDK: tarefa automática, não conversa
      if (e.type === 'summary' && e.summary && !resumo) resumo = e.summary;
      if (!primeiro && e.type === 'user' && !e.isMeta && !e.isSidechain) { const t = promptText(e.message?.content); if (t && !t.startsWith('<')) primeiro = t; }
      if (cwd && primeiro) break;
    }
    if (!cwd || !primeiro || auto || DELEGADA.test(primeiro)) continue;   // vazia (abriu e fechou), automática ou delegada
    out.push({ fonte: 'claude', id: path.basename(f.file, '.jsonl'), cwd, titulo: titulo(resumo || primeiro), quando: f.mtime });
  }
  return out;
}

function codex() {
  const out = [];
  for (const f of listFiles(path.join(CODEX_HOME, 'sessions'), n => /^rollout-.*\.jsonl$/.test(n), DIAS * 86400e3)) {
    let id = '', cwd = '', primeiro = '', auto = false;
    for (const e of cabeca(f.file)) {
      const p = e.payload || {};
      // subagente (source = objeto) ou "codex exec" (source = "exec"): automático, não é conversa sua
      if (e.type === 'session_meta') { id = p.id || id; cwd = p.cwd || cwd; auto = (p.source && typeof p.source === 'object') || p.source === 'exec'; if (auto) break; }
      if (!primeiro && e.type === 'event_msg' && p.type === 'user_message' && p.message) primeiro = String(p.message);
      // formato novo: o pedido vem como mensagem de usuário, depois do contexto (<environment_context>, AGENTS.md)
      if (!primeiro && e.type === 'response_item' && p.type === 'message' && p.role === 'user') {
        const t = promptText(p.content); if (t && !t.startsWith('<') && !/^# AGENTS\.md/.test(t)) primeiro = t;
      }
      if (id && cwd && primeiro) break;
    }
    if (auto || !id || !cwd || !primeiro || DELEGADA.test(primeiro)) continue;   // tarefa delegada não é conversa
    out.push({ fonte: 'codex', id, cwd, titulo: titulo(primeiro), quando: f.mtime });
  }
  return out;
}

function todas() {
  if (Date.now() - cache.t < CACHE_MS) return cache.lista;
  const lista = [...claude(), ...codex()].map(s => ({ ...s, ...roomFor(s.cwd) }));
  cache = { t: Date.now(), lista };
  return lista;
}

/** Conversas de uma sala (mais recentes primeiro), marcando as que estão abertas agora. */
export function sessoesDaSala(sala, limite = 12) {
  const agora = Date.now();
  return todas().filter(s => s.room === sala).map(s => {
    const a = store.agents.get(s.fonte + ':' + s.id);
    const aberta = !!a && !a.ended && agora - (a.lastActivity || 0) < 15 * 60e3;
    return { fonte: s.fonte, id: s.id, titulo: s.titulo, projeto: s.project, quando: Math.max(s.quando, a?.lastActivity || 0), aberta, estado: a?.state || null, nome: a?.name || null };
  }).sort((x, y) => (y.aberta - x.aberta) || (y.quando - x.quando)).slice(0, limite);
}

/** Pasta de uma conversa conhecida (para retomar no lugar certo). */
export function pastaDaSessao(fonte, id) {
  return todas().find(s => s.fonte === fonte && s.id === id)?.cwd || store.agents.get(fonte + ':' + id)?.cwd || null;
}

/** Pasta da conversa mais recente de uma sala ou projeto (sala sem sessão aberta). */
export function pastaRecente(nome) {
  const s = todas().filter(x => (x.room === nome || x.project === nome) && fs.existsSync(x.cwd)).sort((x, y) => y.quando - x.quando)[0];
  return s ? s.cwd : null;
}

export const limparCacheSessoes = () => { cache.t = 0; };
