// Teste do MCP "central" falando o protocolo de verdade (stdio): handshake, ferramentas, quadro e agentes.
// Precisa do agente rodando. Uso: node scripts/teste-mcp.mjs [pasta-do-projeto]
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const DIR = path.dirname(fileURLToPath(import.meta.url));
const cwd = process.argv[2] || path.resolve(DIR, '..', '..');
const p = spawn(process.execPath, [path.join(DIR, '..', 'mcp', 'central-mcp.js')], { cwd, env: { ...process.env, CLAUDECODE: '1' } });
let buf = ''; const pend = new Map(); let n = 0;
p.stdout.on('data', d => { buf += d; let i; while ((i = buf.indexOf('\n')) >= 0) { const m = JSON.parse(buf.slice(0, i)); buf = buf.slice(i + 1); pend.get(m.id)?.(m); } });
const rpc = (method, params) => new Promise(r => { const id = ++n; pend.set(id, r); p.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n'); });
const check = (c, msg) => { console.log((c ? 'ok   ' : 'FALHA') + ' ' + msg); if (!c) process.exitCode = 1; };
const init = await rpc('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'teste', version: '1' } });
check(init.result?.serverInfo?.name === 'central', 'handshake');
p.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');
const tools = await rpc('tools/list', {});
check(tools.result.tools.length === 6, '6 ferramentas: ' + tools.result.tools.map(t => t.name).join(', '));
const w = await rpc('tools/call', { name: 'central_quadro_escrever', arguments: { texto: 'Teste do MCP: recado de ida', para: 'codex' } });
check(!w.result.isError, 'escrever no quadro → ' + w.result.content[0].text);
const r = await rpc('tools/call', { name: 'central_quadro_ler', arguments: { limite: 3 } });
check(/recado de ida/.test(r.result.content[0].text), 'ler o quadro devolve o recado');
const a = await rpc('tools/call', { name: 'central_agentes', arguments: {} });
check(!a.result.isError && a.result.content[0].text.length > 10, 'listar agentes');
const bad = await rpc('tools/call', { name: 'central_delegar', arguments: { tarefa: 'x', para: 'gemini', modo: 'ler' } });
check(bad.result.isError, 'delegar para quem não existe é recusado');
p.kill(); process.exit();
