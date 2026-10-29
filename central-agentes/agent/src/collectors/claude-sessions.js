// Lê os JSONL de sessão do Claude Code em ~/.claude/projects (incremental).
// Formato e pontos a conferir: docs/FONTES-DE-DADOS.md §1.
import path from 'node:path';
import fs from 'node:fs';
import { CLAUDE_HOME } from '../config.js';
import { store } from '../store.js';
import { JsonlTail, listFiles, promptText, targetOf, toolPt } from '../util.js';

const DIR = path.join(CLAUDE_HOME, 'projects');
const tail = new JsonlTail();
const WEEK = 8 * 86400e3;

function agentIdFor(file, entry) {
  const base = path.basename(file, '.jsonl');
  // Subagentes em arquivo próprio viram agentes próprios na mesma sala
  if (entry.isSidechain || /^agent-/.test(base) || file.includes(path.sep + 'subagents' + path.sep)) return 'claude:' + (entry.sessionId || 'x') + ':' + base;
  return 'claude:' + (entry.sessionId || base);
}

// Nome do subagente vem do .meta.json ao lado do JSONL (description / agentType)
const subMeta = new Map();
function subName(file, entry) {
  if (!subMeta.has(file)) {
    let m = {};
    try { m = JSON.parse(fs.readFileSync(file.replace(/\.jsonl$/, '.meta.json'), 'utf8')); } catch { /* sem meta */ }
    subMeta.set(file, m);
  }
  const m = subMeta.get(file);
  return 'Sub · ' + (m.description || m.agentType || entry.agentType || 'tarefa');
}

function handle(file, e) {
  if (!e || (e.type !== 'user' && e.type !== 'assistant')) return;
  const t = Date.parse(e.timestamp) || Date.now();
  const id = agentIdFor(file, e);
  const sub = id.split(':').length > 2;
  const a = store.agent(id, { source: 'claude', sessionId: e.sessionId, cwd: e.cwd, model: e.message?.model, name: sub ? subName(file, e) : undefined });
  const fresh = Date.now() - t < 10 * 60e3;   // evento recente: pode mudar o estado
  store.touch(a, t);
  const content = e.message?.content;

  if (e.type === 'user') {
    const text = promptText(content);
    if (text && !text.startsWith('<') && !e.isMeta) {
      a.prompt = text.slice(0, 2000);
      if (fresh && Date.now() - a._hook > 5000) { a.tool = 'Pensando'; a.target = 'lendo o contexto'; store.setState(a, 'working', t); store.event(a, 'prompt', 'Prompt', '"' + text.slice(0, 200) + '"', t); }
    }
    if (Array.isArray(content)) for (const c of content) {
      if (c?.type === 'tool_result' && c.is_error && fresh) {
        const msg = (typeof c.content === 'string' ? c.content : (c.content || []).map(x => x.text || '').join(' ')).replace(/\s+/g, ' ').slice(0, 160);
        if (!/user doesn't want|rejected|negou/i.test(msg)) { a.errMsg = msg; store.event(a, 'err', 'Erro', msg, t); }
      }
    }
    return;
  }

  // assistant
  store.addUsage(a, e.message?.id || e.uuid, e.message?.model, e.message?.usage, t);
  if (!Array.isArray(content)) return;
  for (const c of content) {
    if (c?.type === 'tool_use') {
      a.tool = c.name; a.target = targetOf(c.name, c.input);
      if (fresh && Date.now() - a._hook > 5000) { if (a.state !== 'waiting') store.setState(a, 'working', t); store.event(a, 'tool', toolPt(c.name), a.target, t); }
    }
  }
}

export function startClaudeSessions() {
  if (!fs.existsSync(DIR)) { console.log(`[claude] pasta não encontrada: ${DIR} (defina CLAUDE_HOME no .env se usar WSL)`); return; }
  const scan = () => {
    for (const f of listFiles(DIR, n => n.endsWith('.jsonl'), WEEK)) tail.read(f.file, f.size, e => handle(f.file, e));
  };
  scan();
  console.log(`[claude] lendo ${DIR}`);
  setInterval(scan, 1500);
}
