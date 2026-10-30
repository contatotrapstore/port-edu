// Lê os JSONL de sessão do Codex em ~/.codex/sessions (incremental).
// Também extrai rate_limits → medidor do ChatGPT/Codex. Ver docs/FONTES-DE-DADOS.md §3.
import path from 'node:path';
import fs from 'node:fs';
import { CODEX_HOME, CODENOTCH_FRESH_MS, config } from '../config.js';
import { store } from '../store.js';
import { JsonlTail, listFiles, promptText, targetOf, toolPt, isToday } from '../util.js';

const DIR = path.join(CODEX_HOME, 'sessions');
const tail = new JsonlTail();
/** Primeira linha do arquivo (o cabeçalho session_meta), sem ler o resto. */
function primeiraLinha(file) {
  try {
    const fd = fs.openSync(file, 'r'), buf = Buffer.alloc(256 * 1024);
    const n = fs.readSync(fd, buf, 0, buf.length, 0); fs.closeSync(fd);
    const s = buf.toString('utf8', 0, n), i = s.indexOf('\n');
    return JSON.parse(i > 0 ? s.slice(0, i) : s);
  } catch { return null; }
}
const meta = new Map(); // file -> { id, cwd, model, lastTotal }
let lastLimitsAt = 0;

function limitMeter(label, r, t) {
  if (!r) return null;
  let resetAt = 0;
  if (r.resets_at) resetAt = typeof r.resets_at === 'number' ? (r.resets_at < 1e12 ? r.resets_at * 1000 : r.resets_at) : Date.parse(r.resets_at);
  else if (r.resets_in_seconds != null) resetAt = t + r.resets_in_seconds * 1000;
  // Rótulo pela duração real da janela (no Codex atual o primary é a semanal e o secondary vem null)
  const wm = Number(r.window_minutes) || 0;
  if (wm >= 1440) label = wm === 10080 ? 'Codex · semanal' : `Codex · ${Math.round(wm / 1440)} dias`;
  else if (wm) label = `Codex · janela de ${Math.round(wm / 60)}h`;
  return { label, usedPct: Number(r.used_percent ?? r.usedPercent ?? 0), resetAt, windowMinutes: r.window_minutes, source: 'codex' };
}

function handle(file, e) {
  const t = Date.parse(e.timestamp) || Date.now(), p = e.payload || {};
  let m = meta.get(file);
  if (!m) {
    m = { id: path.basename(file, '.jsonl'), cwd: '', model: '', lastTotal: null, baseline: tail.startedMid(file) };
    // Leitura começou no meio do arquivo: o cabeçalho (id e pasta da sessão) está na primeira linha
    if (m.baseline) { const h = primeiraLinha(file); if (h?.type === 'session_meta') { m.id = h.payload?.id || m.id; m.cwd = h.payload?.cwd || ''; } }
    meta.set(file, m);
  }
  if (e.type === 'session_meta') { m.id = p.id || m.id; m.cwd = p.cwd || m.cwd; return; }
  if (e.type === 'turn_context') { m.cwd = p.cwd || m.cwd; m.model = p.model || m.model; }
  const a = store.agent('codex:' + m.id, { source: 'codex', sessionId: m.id, cwd: m.cwd, model: m.model, name: 'Principal' });
  store.touch(a, t);
  const fresh = Date.now() - t < 10 * 60e3;

  if (e.type === 'response_item') {
    if (p.type === 'message' && p.role === 'user') {
      const text = promptText(p.content);
      const delegado = /Pedido de (.+?) pela Central de Agentes \(projeto/.exec(text || '');
      if (delegado && a.name === 'Principal') a.name = 'Delegado · ' + delegado[1];   // tarefa delegada (sobrevive a reinício)
      if (text && !text.startsWith('<')) { a.prompt = text.slice(0, 2000); if (fresh) { store.setState(a, 'working', t); store.event(a, 'prompt', 'Prompt', '"' + text.slice(0, 200) + '"', t); } }
    } else if (p.type === 'function_call' || p.type === 'custom_tool_call' || p.type === 'local_shell_call') {
      const name = p.name || 'shell', input = p.arguments || p.input || p.action;
      a.tool = name; a.target = targetOf(name, input);
      if (fresh) { store.setState(a, 'working', t); store.event(a, 'tool', toolPt(name), a.target, t); }
    } else if (p.type === 'message' && p.role === 'assistant') {
      // última fala do agente (pergunta ou resumo do fim do turno): aparece no cartão dele; não sobe para a nuvem
      const fala = (Array.isArray(p.content) ? p.content : []).filter(c => c && (c.type === 'output_text' || c.type === 'text') && c.text).map(c => c.text).join('\n').trim();
      if (fala) { a.resposta = fala.slice(0, 1200); a.respostaEm = t; }
    }
  }

  if (e.type === 'event_msg') {
    if (p.type === 'user_message' && p.message && fresh) { a.prompt = String(p.message).slice(0, 2000); store.setState(a, 'working', t); }
    if (p.type === 'task_complete' && isToday(t)) store.taskDone(a);
    if (p.type === 'task_complete' && fresh) { store.setState(a, 'idle', t); store.event(a, 'done', 'Concluído', 'Turno concluído', t); }
    if (p.type === 'token_count') {
      const tot = p.info?.total_token_usage;
      // O Codex grava o total ACUMULADO da sessão. Se a leitura começou no meio, o primeiro total é só ponto de partida
      // (senão tudo que a sessão gastou nos dias anteriores entraria como gasto de hoje)
      if (tot && m.baseline && !m.lastTotal) { m.lastTotal = tot; m.baseline = false; }
      else if (tot) {
        const prev = m.lastTotal || { input_tokens: 0, cached_input_tokens: 0, output_tokens: 0 };
        const dIn = Math.max(0, (tot.input_tokens || 0) - (prev.input_tokens || 0)), dCache = Math.max(0, (tot.cached_input_tokens || 0) - (prev.cached_input_tokens || 0));
        const dOut = Math.max(0, (tot.output_tokens || 0) - (prev.output_tokens || 0));
        const dWrite = Math.max(0, (tot.cache_write_input_tokens || 0) - (prev.cache_write_input_tokens || 0));
        m.lastTotal = tot;
        // input_tokens do Codex já inclui os tokens lidos e gravados no cache
        // Contexto longo (OpenAI): requisição com mais de ~272 mil tokens de entrada custa 2x na entrada e 1,5x na saída
        const ultima = p.info?.last_token_usage?.input_tokens || 0;
        const longo = ultima > (config.pricing?.limiteContextoLongo || 272000) ? { in: 2, out: 1.5 } : null;
        store.addUsage(a, null, m.model, { input_tokens: Math.max(0, dIn - dCache - dWrite), cache_read_input_tokens: dCache, cache_creation_input_tokens: dWrite, output_tokens: dOut }, t, longo);
      }
      const rl = p.rate_limits;
      const codenotchFresh = store.plans.gpt?.source === 'codenotch' && Date.now() - (store.plans.gpt.at || 0) < CODENOTCH_FRESH_MS;
      if (rl && t >= lastLimitsAt && !codenotchFresh) {
        lastLimitsAt = t;
        store.plans.gpt = { source: 'codex', at: t, meters: [limitMeter('Codex · janela de 5h', rl.primary, t), limitMeter('Codex · semanal', rl.secondary, t)].filter(Boolean) };
        store.changed();
      }
    }
  }
}

export function startCodexSessions() {
  if (!fs.existsSync(DIR)) { console.log(`[codex] pasta não encontrada: ${DIR} (ok se não usa Codex)`); return; }
  const scan = () => { for (const f of listFiles(DIR, n => n.endsWith('.jsonl'), 8 * 86400e3)) tail.read(f.file, f.size, e => handle(f.file, e)); };
  scan();
  console.log(`[codex] lendo ${DIR}`);
  setInterval(scan, 2000);
}
