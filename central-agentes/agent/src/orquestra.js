// Orquestra: os agentes conversam e delegam trabalho entre si.
// - Quadro: mensagens por projeto (o MCP "central" deixa qualquer sessão do Claude ou do Codex ler e escrever)
// - Tarefas: uma sessão (ou o painel) delega para o Claude (`claude -p`) ou o Codex (`codex exec`) na mesma pasta
// - Fluxos: modelos encadeados (ex.: Claude planeja → Codex executa → Claude revisa), em config.json → orquestra.fluxos
// Segurança: o texto da tarefa vai pela entrada padrão (nunca vira argumento de linha de comando); modo "ler" não edita;
// modo "editar" só mexe na pasta do projeto; no máximo `maxTarefas` ao mesmo tempo; tarefa delegada não delega de novo.
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { config, DATA_DIR, roomFor, ENV_DO_AGENTE } from './config.js';
const TAREFAS_FILE = path.join(DATA_DIR, 'tarefas.json');
const salvarTarefas = () => fs.writeFile(TAREFAS_FILE, JSON.stringify([...tarefas.values()].slice(-100).map(pub)), () => {});
/** Encerra o processo e os filhos (no Windows, matar só o cmd.exe deixa o node do claude/codex rodando). */
function matar(p) {
  if (!p || p.exitCode !== null) return;
  if (process.platform === 'win32') spawn('taskkill', ['/pid', String(p.pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' });
  else p.kill();
}
// Com shell (Windows), argumentos com espaço ou símbolos precisam de aspas
const q = a => process.platform === 'win32' && /[\s()*&|<>^]/.test(a) ? '"' + a + '"' : a;
// Modo "ler": sem WebFetch (um texto malicioso lido no projeto poderia mandar dados para fora pela URL) e git só nas
// formas exatas abaixo (diff/log/show aceitam --output=arquivo, que escreveria no disco). Status não escreve nada.
const LEITURA = ['Read', 'Grep', 'Glob', 'WebSearch', 'Bash(git status:*)',
  'Bash(git diff)', 'Bash(git diff --stat)', 'Bash(git diff --cached)', 'Bash(git diff --cached --stat)', 'Bash(git diff HEAD)', 'Bash(git diff HEAD --stat)',
  'Bash(git log --oneline -20)', 'Bash(git log --oneline -50)', 'Bash(git log -5 --stat)', 'Bash(git show HEAD)', 'Bash(git show --stat HEAD)'];
import { store } from './store.js';
import { pastaRecente } from './sessoes.js';

const CFG = { maxTarefas: 2, minutosMax: 30, maxUsdClaude: 3, ...(config.orquestra || {}) };
const QUADRO_FILE = path.join(DATA_DIR, 'quadro.jsonl');
const quadro = [];                 // [{t, projeto, sala, de, para, texto}]
const tarefas = new Map();         // id -> tarefa
const fila = [];
let rodando = 0;

/* ------------------------------- quadro ------------------------------- */
export function postar({ projeto, sala, de, para = 'todos', texto }) {
  const m = { t: Date.now(), projeto: String(projeto || 'Geral').slice(0, 80), sala: sala || projeto, de: String(de || 'alguém').slice(0, 60), para: String(para || 'todos').slice(0, 40), texto: String(texto || '').slice(0, 4000) };
  if (!m.texto.trim()) return null;
  quadro.push(m); if (quadro.length > 2000) quadro.splice(0, quadro.length - 2000);
  fs.appendFile(QUADRO_FILE, JSON.stringify(m) + '\n', () => {});
  store.emit('quadro', m);
  // aparece no feed do prédio como fala da sala
  store.feed.unshift({ t: m.t, agentId: 'quadro:' + m.projeto, kind: 'msg', tag: 'Quadro', text: `${m.de} → ${m.para}: ${m.texto.slice(0, 200)}`, room: m.sala });
  if (store.feed.length > 200) store.feed.length = 200;
  store.changed();
  return m;
}
export function lerQuadro(projeto, limite = 30) {
  const out = projeto ? quadro.filter(m => m.projeto === projeto || m.sala === projeto) : quadro;
  return out.slice(-Math.min(200, limite));
}

/* ------------------------------- tarefas ------------------------------- */
const pub = t => t.criadaEm && !t.cwd ? t : ({ id: t.id, para: t.para, modo: t.modo, projeto: t.projeto, sala: t.sala, de: t.de, tarefa: t.tarefa.slice(0, 300), status: t.status, criadaEm: t.criadaEm, inicio: t.inicio, fim: t.fim, custoUsd: t.custoUsd, resultado: t.resultado, erro: t.erro, fluxo: t.fluxo });

/** Cria uma tarefa delegada. `cwd` = pasta do projeto (onde o trabalhador roda). */
export function delegar({ para, modo = 'ler', tarefa, cwd, de = 'painel', profundidade = 0, fluxo = null, mesa = null }) {
  if (!['claude', 'codex'].includes(para)) throw new Error('para deve ser "claude" ou "codex"');
  if (!['ler', 'editar'].includes(modo)) throw new Error('modo deve ser "ler" ou "editar"');
  if (!tarefa || !String(tarefa).trim()) throw new Error('tarefa vazia');
  if (!cwd || !fs.existsSync(cwd) || !fs.statSync(cwd).isDirectory()) throw new Error('pasta do projeto não encontrada');
  if (fila.length >= 10) throw new Error('fila cheia (10 tarefas esperando): aguarde as atuais terminarem');
  if (profundidade >= 1) throw new Error('tarefa delegada não pode delegar de novo (evita cadeia sem fim)');
  const { room, project } = roomFor(cwd);
  const t = { id: 'j_' + Date.now().toString(36) + crypto.randomBytes(2).toString('hex'), para, modo, tarefa: String(tarefa).slice(0, 20000), cwd, projeto: project, sala: room, de, status: 'na fila', criadaEm: Date.now(), custoUsd: 0, resultado: '', erro: '', fluxo, mesa: Number.isInteger(mesa) ? mesa : null };
  tarefas.set(t.id, t); fila.push(t); salvarTarefas();
  postar({ projeto: t.projeto, sala: t.sala, de, para: para === 'claude' ? 'Claude' : 'Codex', texto: `Tarefa (${modo}): ${t.tarefa.slice(0, 500)}` });
  proxima();
  return pub(t);
}
export const tarefa = id => tarefas.get(id) ? pub(tarefas.get(id)) : null;
export const listaTarefas = () => [...tarefas.values()].sort((a, b) => b.criadaEm - a.criadaEm).slice(0, 50).map(pub);

function proxima() {
  while (rodando < CFG.maxTarefas && fila.length) executar(fila.shift());
}

function executar(t) {
  rodando++; t.status = 'rodando'; t.inicio = Date.now(); store.changed();
  // tarefa delegada não herda as chaves do agent/.env (Supabase service_role, ElevenLabs, Telegram)
  const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => !ENV_DO_AGENTE.has(k)));
  Object.assign(env, { EDH_JOB_DEPTH: '1', EDH_JOB_ID: t.id });
  let args, saidaFinal = null;
  const regra = t.modo === 'ler'
    ? 'Modo leitura: analise e responda; não edite arquivos.'
    : 'Modo edição: faça a mudança só nesta pasta, rode os testes que existirem e resuma o que mudou.';
  const prompt = `${t.tarefa}\n\n---\nPedido de ${t.de} pela Central de Agentes (projeto ${t.projeto}). ${regra} Termine com um resumo curto em português.`;
  if (t.para === 'claude') {
    t.sessionId = crypto.randomUUID();
    store.jobSessions.set(t.sessionId, `Delegado · ${t.de}`);
    store.reservar('claude:' + t.sessionId, t.sala, t.mesa);   // PC escolhido no prédio
    // ler: modo plan (não edita nada) com leitura e git liberados; editar: bypass, aceita tudo sem perguntar (escolha do Eduardo)
    args = ['-p', '--output-format', 'json', '--session-id', t.sessionId, '--max-budget-usd', String(CFG.maxUsdClaude),
      ...(t.modo === 'ler' ? ['--permission-mode', 'plan', '--allowedTools', ...LEITURA] : ['--permission-mode', 'bypassPermissions'])].map(q);
    if (/^[\w.-]+$/.test(CFG.modeloClaude || '')) args.push('--model', CFG.modeloClaude);   // ex.: "sonnet" para gastar menos da janela
  } else {
    saidaFinal = path.join(os.tmpdir(), `edh-${t.id}.txt`);
    store.reservarCodex(t.sala, t.mesa);
    // editar: sem sandbox, como o bypass do Claude
    args = ['exec', '--json', '--skip-git-repo-check', '-s', t.modo === 'ler' ? 'read-only' : 'danger-full-access', '-o', q(saidaFinal), '-'];
  }
  // .cmd do npm precisa de shell no Windows; os argumentos são fixos e o texto vai pela entrada padrão
  const p = spawn(t.para, args, { cwd: t.cwd, env, shell: process.platform === 'win32', windowsHide: true });
  t._proc = p;
  let out = '', errOut = '';
  p.stdout.on('data', d => {
    out += d; if (out.length > 4e6) out = out.slice(-2e6);
    if (t.para === 'codex' && !t.sessionId) { const m = /"(?:thread_id|session_id|conversation_id)"\s*:\s*"([0-9a-f-]{20,})"/.exec(String(d)); if (m) { t.sessionId = m[1]; store.jobSessions.set(m[1], `Delegado · ${t.de}`); } }
  });
  p.stderr.on('data', d => { errOut += d; if (errOut.length > 2e5) errOut = errOut.slice(-1e5); });
  p.stdin.end(prompt);
  const limite = setTimeout(() => { t.erro = `passou de ${CFG.minutosMax} min`; matar(p); }, CFG.minutosMax * 60e3);
  p.on('close', code => {
    clearTimeout(limite); rodando--; t.fim = Date.now();
    try {
      if (t.para === 'claude') {
        const j = JSON.parse(out.trim().split('\n').pop());
        t.resultado = String(j.result || '').slice(0, 20000); t.custoUsd = j.total_cost_usd || 0;
        if (j.is_error) t.erro = t.erro || String(j.subtype || 'erro');
      } else {
        t.resultado = fs.existsSync(saidaFinal) ? fs.readFileSync(saidaFinal, 'utf8').slice(0, 20000) : '';
        fs.rm(saidaFinal, { force: true }, () => {});
      }
    } catch { t.resultado = t.resultado || out.slice(-4000); }
    if (code !== 0 && !t.erro) t.erro = (errOut.trim().split('\n').pop() || `saiu com código ${code}`).slice(0, 300);
    t.status = t.erro ? 'falhou' : 'concluída'; t._proc = null; salvarTarefas();
    postar({ projeto: t.projeto, sala: t.sala, de: t.para === 'claude' ? 'Claude' : 'Codex', para: t.de, texto: t.erro ? `Falhou: ${t.erro}` : `Pronto. ${t.resultado.slice(0, 1500)}` });
    store.emit('tarefa', pub(t));
    store.changed();
    if (t.fluxo) seguirFluxo(t);
    proxima();
  });
  p.on('error', err => { t.erro = 'não consegui iniciar: ' + err.message; });
}

/* ------------------------------- fluxos ------------------------------- */
export const modelosFluxo = () => (CFG.fluxos || []).map(f => ({ id: f.id, nome: f.nome, passos: f.passos.map(p => `${p.para === 'claude' ? 'Claude' : 'Codex'} (${p.modo})`) }));
const fluxos = new Map();

export function iniciarFluxo({ modelo, objetivo, cwd, de = 'painel' }) {
  const m = (CFG.fluxos || []).find(f => f.id === modelo);
  if (!m) throw new Error('fluxo não encontrado: ' + modelo);
  const f = { id: 'f_' + Date.now().toString(36), modelo: m, objetivo: String(objetivo || '').slice(0, 8000), cwd, de, passo: 0, saidas: [] };
  fluxos.set(f.id, f);
  rodarPasso(f);
  return { id: f.id, nome: m.nome, passos: m.passos.length };
}
function rodarPasso(f) {
  const p = f.modelo.passos[f.passo];
  const preencher = s => s.replace(/\{\{objetivo\}\}/g, f.objetivo).replace(/\{\{anterior\}\}/g, f.saidas[f.saidas.length - 1] || '').replace(/\{\{passo(\d)\}\}/g, (_, n) => f.saidas[+n - 1] || '');
  delegar({ para: p.para, modo: p.modo, tarefa: preencher(p.prompt), cwd: f.cwd, de: `${f.de} · ${f.modelo.nome} ${f.passo + 1}/${f.modelo.passos.length}`, fluxo: f.id });
}
function seguirFluxo(t) {
  const f = fluxos.get(t.fluxo); if (!f) return;
  if (t.status !== 'concluída') { postar({ projeto: t.projeto, sala: t.sala, de: 'Central', texto: `Fluxo "${f.modelo.nome}" parou no passo ${f.passo + 1}: ${t.erro}` }); return; }
  f.saidas.push(t.resultado); f.passo++;
  if (f.passo < f.modelo.passos.length) rodarPasso(f);
  else postar({ projeto: t.projeto, sala: t.sala, de: 'Central', texto: `Fluxo "${f.modelo.nome}" concluído (${f.modelo.passos.length} passos).` });
}

/** Pasta do projeto a partir do nome da sala/projeto: a sessão mais recente que esteve lá. */
export function pastaDoProjeto(nome) {
  const a = [...store.agents.values()].filter(x => (x.project === nome || x.room === nome) && x.cwd).sort((x, y) => y.lastActivity - x.lastActivity)[0];
  return a ? a.cwd : pastaRecente(nome);   // sala sem sessão aberta: a pasta da conversa mais recente dela
}

/** Encerra todas as tarefas em andamento (agente desligando). */
export function encerrarTarefas() { for (const t of tarefas.values()) if (t._proc) matar(t._proc); }

export function startOrquestra() {
  // tarefas da execução anterior: as que estavam rodando ou na fila foram interrompidas pelo reinício
  try { for (const t of JSON.parse(fs.readFileSync(TAREFAS_FILE, 'utf8'))) { if (['rodando', 'na fila'].includes(t.status)) { t.status = 'interrompida'; t.erro = 'o agente reiniciou'; } tarefas.set(t.id, t); } } catch { /* primeiro uso */ }
  process.on('exit', encerrarTarefas);
  try { for (const l of fs.readFileSync(QUADRO_FILE, 'utf8').split('\n').slice(-2000)) if (l) quadro.push(JSON.parse(l)); } catch { /* primeiro uso */ }
  console.log(`[orquestra] quadro e tarefas prontos (até ${CFG.maxTarefas} tarefas juntas, ${CFG.minutosMax} min cada)`);
}
