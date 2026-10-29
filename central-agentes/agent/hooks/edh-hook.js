#!/usr/bin/env node
// Hook do Claude Code → agente local. Regra de ouro: NUNCA travar nem quebrar o Claude Code.
// Se o agente estiver desligado ou algo falhar, sai com código 0 sem imprimir nada.
// Formato dos hooks: conferir em docs.claude.com → Claude Code → Hooks (ver docs/FONTES-DE-DADOS.md §2).
import http from 'node:http';

const PORT = Number(process.env.EDH_PORT || 4321);
const done = (out) => { if (out) process.stdout.write(JSON.stringify(out)); process.exit(0); };

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', c => { raw += c; });
process.stdin.on('end', () => {
  let h; try { h = JSON.parse(raw); } catch { return done(); }
  const isPerm = h.hook_event_name === 'PermissionRequest';
  // Pedido de permissão pode esperar a resposta do painel; o resto é dispara-e-esquece
  const timeout = isPerm ? 10 * 60e3 : 1500;
  const body = Buffer.from(JSON.stringify(h));
  const req = http.request({ host: '127.0.0.1', port: PORT, path: '/hook' + (isPerm ? '?wait=1' : ''), method: 'POST', timeout,
    headers: { 'Content-Type': 'application/json', 'Content-Length': body.length } }, res => {
    let out = ''; res.setEncoding('utf8');
    res.on('data', c => { out += c; });
    res.on('end', () => {
      if (!isPerm) return done();
      let r; try { r = JSON.parse(out); } catch { return done(); }
      if (r && (r.decision === 'allow' || r.decision === 'deny')) {
        return done({ hookSpecificOutput: { hookEventName: 'PermissionRequest', decision: r.decision === 'allow'
          ? { behavior: 'allow' }
          : { behavior: 'deny', message: r.message || 'Negado pelo painel da Central de Agentes' } } });
      }
      done(); // sem decisão: o Claude Code mostra o pedido no terminal normalmente
    });
  });
  req.on('timeout', () => { req.destroy(); done(); });
  req.on('error', () => done());
  req.end(body);
});
setTimeout(() => done(), 11 * 60e3).unref();
