#!/usr/bin/env node
// MCP "central": liga as sessões do Claude Code e do Codex à Central de Agentes (localhost:4321).
// Cada sessão enxerga o quadro do projeto onde está aberta, pode deixar recados para as outras, delegar trabalho
// para o Claude ou o Codex e rodar fluxos (um planeja, outro executa, outro revisa).
// Protocolo MCP por stdio (JSON-RPC, uma mensagem por linha), sem dependências.
// Instalar nas duas ferramentas: npm run mcp:install (no agent). Remover: npm run mcp:uninstall.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const BASE = `http://127.0.0.1:${process.env.EDH_PORT || 4321}`;
const TOKEN = (() => { try { return fs.readFileSync(path.join(DIR, '..', 'data', 'mcp-token'), 'utf8').trim(); } catch { return ''; } })();
const QUEM = process.env.EDH_CLIENTE === 'codex' ? 'Codex' : process.env.CLAUDECODE ? 'Claude' : Object.keys(process.env).some(k => k.startsWith('CODEX')) ? 'Codex' : 'Agente';
const PROFUNDIDADE = Number(process.env.EDH_JOB_DEPTH || 0);
const CWD = process.env.CLAUDE_PROJECT_DIR || process.cwd();

async function api(method, p, body) {
  const r = await fetch(BASE + p, { method, headers: { 'Content-Type': 'application/json', 'X-EDH-Token': TOKEN }, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(15e3) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.erro || `Central respondeu ${r.status}`);
  return j;
}
const projetoAqui = async () => (await api('GET', '/api/state')).agents.find(a => a.cwd && path.resolve(a.cwd) === path.resolve(CWD))?.project;
const linha = m => `[${new Date(m.t).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}] ${m.de} → ${m.para}: ${m.texto}`;
const resumoTarefa = t => `Tarefa ${t.id} · ${t.para} (${t.modo}) · ${t.status}${t.custoUsd ? ` · US$ ${t.custoUsd.toFixed(2)}` : ''}${t.erro ? `\nErro: ${t.erro}` : ''}${t.resultado ? `\n\nResultado:\n${t.resultado}` : ''}`;

const TOOLS = [
  { name: 'central_quadro_ler', description: 'Lê o quadro de recados do projeto desta pasta na Central de Agentes: mensagens entre você, outras sessões do Claude e do Codex e o Eduardo, e o resultado de tarefas delegadas. Use no começo de um trabalho para saber o que já foi combinado.',
    inputSchema: { type: 'object', properties: { limite: { type: 'number', description: 'Quantas mensagens (padrão 20)' }, projeto: { type: 'string', description: 'Outro projeto (nome da sala). Padrão: o desta pasta' } } } },
  { name: 'central_quadro_escrever', description: 'Deixa um recado no quadro do projeto desta pasta, para as outras sessões (Claude ou Codex) e para o Eduardo. Bom para registrar decisões, o que você terminou e o que falta.',
    inputSchema: { type: 'object', properties: { texto: { type: 'string' }, para: { type: 'string', description: '"claude", "codex", "eduardo" ou "todos" (padrão)' } }, required: ['texto'] } },
  { name: 'central_delegar', description: 'Delega uma tarefa para outro agente rodar nesta mesma pasta, em segundo plano: "claude" (Claude Code) ou "codex" (Codex). modo "ler" só analisa (revisão, investigação, plano); modo "editar" pode mudar arquivos desta pasta. Devolve o id; acompanhe com central_tarefa. O resultado também cai no quadro. Use para segunda opinião, revisão independente ou dividir trabalho.',
    inputSchema: { type: 'object', properties: { tarefa: { type: 'string', description: 'O que fazer, com o contexto necessário (o outro agente não vê esta conversa)' }, para: { type: 'string', enum: ['claude', 'codex'] }, modo: { type: 'string', enum: ['ler', 'editar'] }, esperar_segundos: { type: 'number', description: 'Esperar o resultado até N segundos (máx. 600). Padrão: não espera' } }, required: ['tarefa', 'para', 'modo'] } },
  { name: 'central_tarefa', description: 'Situação e resultado de uma tarefa delegada (id devolvido por central_delegar ou central_fluxo).',
    inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
  { name: 'central_fluxo', description: 'Roda um fluxo de vários agentes nesta pasta, em segundo plano. Modelos: "planejar-executar-revisar" (Claude planeja, Codex executa, Claude revisa), "investigar-corrigir" (Codex investiga, Claude corrige, Codex confere), "segunda-opiniao" (Codex revisa). Cada passo publica o resultado no quadro.',
    inputSchema: { type: 'object', properties: { modelo: { type: 'string' }, objetivo: { type: 'string', description: 'O que o fluxo deve alcançar, com contexto suficiente' } }, required: ['modelo', 'objetivo'] } },
  { name: 'central_agentes', description: 'Quem está trabalhando agora na Central de Agentes: sala/projeto, sessão, estado e ferramenta em uso. Útil para não pisar no trabalho de outra sessão.',
    inputSchema: { type: 'object', properties: {} } },
];

async function call(name, a = {}) {
  if (name === 'central_quadro_ler') {
    const projeto = a.projeto || await projetoAqui() || '';
    const ms = await api('GET', `/api/quadro?projeto=${encodeURIComponent(projeto)}&limite=${Math.min(100, a.limite || 20)}`);
    return ms.length ? `Quadro de ${projeto || 'todos os projetos'}:\n` + ms.map(linha).join('\n') : `Quadro de ${projeto || 'todos'} vazio.`;
  }
  if (name === 'central_quadro_escrever') {
    const m = await api('POST', '/api/quadro', { cwd: CWD, de: QUEM, para: a.para || 'todos', texto: a.texto });
    return `Recado publicado no quadro de ${m.projeto}.`;
  }
  if (name === 'central_delegar') {
    if (PROFUNDIDADE >= 1) throw new Error('Esta sessão já é uma tarefa delegada; não pode delegar de novo.');
    let t = await api('POST', '/api/tarefas', { cwd: CWD, de: QUEM, para: a.para, modo: a.modo, tarefa: a.tarefa, profundidade: PROFUNDIDADE });
    const ate = Date.now() + Math.min(600, Math.max(0, a.esperar_segundos || 0)) * 1000;
    while (Date.now() < ate && !['concluída', 'falhou'].includes(t.status)) { await new Promise(r => setTimeout(r, 5000)); t = await api('GET', '/api/tarefas/' + t.id); }
    return resumoTarefa(t) + (['concluída', 'falhou'].includes(t.status) ? '' : '\n\nAinda rodando: consulte com central_tarefa.');
  }
  if (name === 'central_tarefa') return resumoTarefa(await api('GET', '/api/tarefas/' + encodeURIComponent(a.id)));
  if (name === 'central_fluxo') {
    if (PROFUNDIDADE >= 1) throw new Error('Esta sessão já é uma tarefa delegada; não pode iniciar fluxo.');
    const f = await api('POST', '/api/fluxos', { cwd: CWD, de: QUEM, modelo: a.modelo, objetivo: a.objetivo });
    return `Fluxo "${f.nome}" iniciado (${f.passos} passos). Os resultados de cada passo vão para o quadro (central_quadro_ler).`;
  }
  if (name === 'central_agentes') {
    const s = await api('GET', '/api/state');
    const ativos = s.agents.filter(x => x.state !== 'idle');
    return (ativos.length ? ativos : s.agents.slice(0, 15)).map(x => `${x.room}${x.project !== x.room ? ' · ' + x.project : ''} — ${x.name} (${x.source}) · ${x.state}${x.tool ? ' · ' + x.tool : ''}`).join('\n') || 'Nenhuma sessão.';
  }
  throw new Error('ferramenta desconhecida: ' + name);
}

const send = m => process.stdout.write(JSON.stringify(m) + '\n');
let buf = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', async chunk => {
  buf += chunk;
  let i;
  while ((i = buf.indexOf('\n')) >= 0) {
    const raw = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
    if (!raw) continue;
    let msg; try { msg = JSON.parse(raw); } catch { continue; }
    const { id, method, params } = msg;
    if (id === undefined) continue; // notificações
    try {
      if (method === 'initialize') send({ jsonrpc: '2.0', id, result: { protocolVersion: params?.protocolVersion || '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'central', version: '1.0.0' },
        instructions: 'Central de Agentes da EDevsHub: quadro de recados por projeto e delegação de tarefas entre Claude e Codex nesta pasta. Comece lendo o quadro; registre decisões e entregas nele.' } });
      else if (method === 'ping') send({ jsonrpc: '2.0', id, result: {} });
      else if (method === 'tools/list') send({ jsonrpc: '2.0', id, result: { tools: TOOLS } });
      else if (method === 'tools/call') {
        try { send({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: await call(params.name, params.arguments) }] } }); }
        catch (err) { send({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: 'Erro: ' + (err.cause?.code === 'ECONNREFUSED' ? 'a Central (localhost:4321) está desligada' : err.message) }], isError: true } }); }
      }
      else send({ jsonrpc: '2.0', id, error: { code: -32601, message: 'método não suportado: ' + method } });
    } catch (err) { send({ jsonrpc: '2.0', id, error: { code: -32603, message: err.message } }); }
  }
});
