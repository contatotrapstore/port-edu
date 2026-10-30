// Utilitários compartilhados.
import fs from 'node:fs';
import path from 'node:path';

export const TOOL_PT = {
  Edit: 'Editando', MultiEdit: 'Editando', Write: 'Criando', Read: 'Lendo', Bash: 'Executando', Grep: 'Buscando', Glob: 'Procurando',
  WebFetch: 'Consultando', WebSearch: 'Pesquisando', Task: 'Delegando', Agent: 'Delegando', TodoWrite: 'Planejando', NotebookEdit: 'Editando',
  shell: 'Executando', apply_patch: 'Editando', update_plan: 'Planejando', exec_command: 'Executando',
};
export const toolPt = t => TOOL_PT[t] || (String(t).startsWith('mcp__') ? 'Integração' : t);

/** Resumo curto do alvo de uma ferramenta: arquivo, comando, padrão ou URL. */
export function targetOf(tool, input) {
  if (!input) return '';
  if (typeof input === 'string') { try { input = JSON.parse(input); } catch { return input.slice(0, 160); } }
  // pergunta do agente (AskUserQuestion): mostra o texto da pergunta, não o JSON
  if (Array.isArray(input.questions) && input.questions[0]?.question) return 'Pergunta: ' + String(input.questions[0].question).replace(/\s+/g, ' ').trim().slice(0, 150);
  const v = input.file_path || input.notebook_path || input.path || input.command || input.cmd || input.pattern || input.url || input.query || input.description || input.prompt;
  let s = Array.isArray(v) ? v.join(' ') : String(v ?? '');
  if (input.file_path || input.notebook_path) s = s.replace(/\\/g, '/');
  return s.replace(/\s+/g, ' ').trim().slice(0, 160);
}

/** Texto de prompt de uma mensagem de usuário (ignora tool_result). */
export function promptText(content) {
  let text;
  if (typeof content === 'string') text = content;
  else if (!Array.isArray(content) || content.some(c => c && c.type === 'tool_result')) return '';
  else text = content.filter(c => c && (c.type === 'text' || c.type === 'input_text')).map(c => c.text).join('\n');
  // Texto colado vem embrulhado em <pasted_content>; mostra só o que o usuário digitou (ou "[texto colado]")
  if (/<pasted_content\b/.test(text)) text = text.replace(/<pasted_content\b[^>]*>[\s\S]*?(<\/pasted_content>|$)/g, ' ').trim() || '[texto colado]';
  return text.trim();
}

export const isToday = ts => { const d = new Date(ts), n = new Date(); return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate(); };

/** Lista arquivos recursivamente, com filtro e limite de idade. */
export function listFiles(dir, test, maxAgeMs) {
  const out = [], now = Date.now();
  const walk = d => {
    let ents; try { ents = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of ents) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (test(e.name)) { try { const st = fs.statSync(p); if (!maxAgeMs || now - st.mtimeMs < maxAgeMs) out.push({ file: p, size: st.size, mtime: st.mtimeMs }); } catch {} }
    }
  };
  walk(dir); return out;
}

/** Lê só as linhas novas de arquivos JSONL (guarda posição e linha parcial). */
export class JsonlTail {
  // 64 MB: sessões longas passam de 10-20 MB; começar pelo meio perde o cabeçalho e o histórico do dia
  constructor({ maxInitialBytes = 64 * 1024 * 1024 } = {}) { this.pos = new Map(); this.partial = new Map(); this.maxInitial = maxInitialBytes; this.mid = new Set(); }
  /** true se a primeira leitura deste arquivo começou no meio (arquivo maior que o limite). */
  startedMid(file) { return this.mid.has(file); }
  read(file, size, onLine) {
    let start = this.pos.get(file);
    if (start === undefined) { start = Math.max(0, size - this.maxInitial); if (start > 0) this.mid.add(file); }
    if (size < start) start = 0; // arquivo truncado/recriado
    if (size === start) return 0;
    const fd = fs.openSync(file, 'r');
    try {
      const len = size - start, buf = Buffer.alloc(len);
      fs.readSync(fd, buf, 0, len, start);
      this.pos.set(file, size);
      // a sobra da leitura anterior fica em bytes: um acento cortado no meio não vira "�"
      const all = Buffer.concat([this.partial.get(file) || Buffer.alloc(0), buf]);
      const fim = all.lastIndexOf(10);
      this.partial.set(file, fim < 0 ? all : all.subarray(fim + 1));
      const lines = fim < 0 ? [] : all.subarray(0, fim).toString('utf8').split('\n');
      let n = 0;
      for (const line of lines) { if (!line.trim()) continue; try { onLine(JSON.parse(line)); n++; } catch { /* linha cortada no início da leitura */ } }
      return n;
    } finally { fs.closeSync(fd); }
  }
}
