// Servidor local: painel, API, SSE e entrada dos hooks. Escuta só em 127.0.0.1.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { ROOT_DIR, PORT, config, DATA_DIR, roomFor, ENV_DO_AGENTE } from './config.js';
import { store } from './store.js';
import { readCosts } from './history.js';
import { spawn } from 'node:child_process';
import { postar, lerQuadro, delegar, tarefa, listaTarefas, modelosFluxo, iniciarFluxo, pastaDoProjeto } from './orquestra.js';
import { infoProjeto, relatorioHTML } from './projetos.js';
import { sessoesDaSala, pastaDaSessao } from './sessoes.js';
import { aplicarSalas } from './config.js';

const TOKEN = crypto.randomBytes(16).toString('hex');
// Token fixo do MCP "central" (as sessões do Claude/Codex usam para falar com o agente). Fica em data/, fora do git.
const MCP_TOKEN = (() => {
  const f = path.join(DATA_DIR, 'mcp-token');
  try { return fs.readFileSync(f, 'utf8').trim(); } catch { fs.mkdirSync(DATA_DIR, { recursive: true }); const t = crypto.randomBytes(24).toString('hex'); fs.writeFileSync(f, t); return t; }
})();
const authed = req => [TOKEN, MCP_TOKEN].includes(req.headers['x-edh-token']);
// Pedido vindo de uma página de outro site: recusado (o navegador sempre manda Origin em POST)
const origemOk = req => !req.headers.origin || /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(req.headers.origin);
const jsonOk = req => /application\/json/i.test(req.headers['content-type'] || '');
/** Sessão interativa nova num terminal próprio, na pasta do projeto. O texto vai por variável de ambiente, nunca pela linha de comando. */
// sid: Claude novo com id já escolhido (o boneco senta no PC reservado); retomar: continua uma conversa (Claude --resume / codex resume)
function abrirSessao(cwd, para, prompt, { sid = '', retomar = false } = {}) {
  const cmd = para === 'codex' ? 'codex' : 'claude';
  const inicio = retomar ? (para === 'codex' ? 'codex resume $env:EDH_SID' : 'claude --resume $env:EDH_SID')
    : sid ? 'claude --session-id $env:EDH_SID' : cmd;
  const script = `Set-Location -LiteralPath $env:EDH_CWD; $host.UI.RawUI.WindowTitle = 'Central · ' + $env:EDH_TITULO; if ($env:EDH_PROMPT) { ${inicio} $env:EDH_PROMPT } else { ${inicio} }`;
  const p = spawn('powershell.exe', ['-NoExit', '-NoProfile', '-Command', script], { cwd, detached: true, stdio: 'ignore', windowsHide: false,
    env: { ...Object.fromEntries(Object.entries(process.env).filter(([k]) => !ENV_DO_AGENTE.has(k))), EDH_CWD: cwd, EDH_PROMPT: prompt || '', EDH_SID: sid, EDH_TITULO: roomFor(cwd).project } });
  p.unref();
}
const WEB = path.join(ROOT_DIR, 'web');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.ico': 'image/x-icon' };
const clients = new Set();
// Último aviso de "painel aberto e visível" (POST /api/presence). Pedido de permissão só espera o painel
// se alguém está olhando para ele; senão cai direto no terminal, sem atraso.
let panelSeenAt = 0;
const PANEL_FRESH_MS = 25e3;

function send(res, code, body, type = 'application/json; charset=utf-8') {
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}
function readBody(req, limit = 1e6) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => { size += c.length; if (size > limit) { reject(new Error('grande demais')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => { try { resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {}); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}
function serveFile(res, file) {
  fs.readFile(file, (err, buf) => {
    if (err) return send(res, 404, 'Não encontrado', 'text/plain; charset=utf-8');
    const ext = path.extname(file);
    // Token da API e layout do prédio (salas do config.json) vão junto com a página
    if (ext === '.html') buf = Buffer.from(buf.toString('utf8').replace('</head>', `<script>window.EDH_TOKEN=${JSON.stringify(TOKEN)};window.EDH_LAYOUT=${JSON.stringify(config.layout).replace(/</g, '\\u003c')}</script>\n</head>`));
    send(res, 200, buf, TYPES[ext] || 'application/octet-stream');
  });
}

store.on('change', () => {
  const data = 'event: state\ndata: ' + JSON.stringify(store.snapshot()) + '\n\n';
  for (const res of clients) res.write(data);
});
setInterval(() => { for (const res of clients) res.write('event: ping\ndata: {}\n\n'); }, 20000);

const server = http.createServer(async (req, res) => {
  // Proteção contra DNS rebinding: só aceita Host local
  const host = String(req.headers.host || '').split(':')[0];
  if (!['127.0.0.1', 'localhost'].includes(host)) return send(res, 403, { erro: 'host não permitido' });
  const url = new URL(req.url, 'http://127.0.0.1');
  const p = url.pathname;
  try {
    if (req.method === 'GET' && p === '/api/state') return send(res, 200, store.snapshot());
    // Linha do tempo do dia para o replay: ?date=AAAA-MM-DD (padrão hoje) &since=ms
    // Custo e tarefas por sala por dia: { "AAAA-MM-DD": { sala: { floor, costUsd, tasks } } }
    if (req.method === 'GET' && p === '/api/costs') return send(res, 200, readCosts());
    if (req.method === 'GET' && p === '/api/events') {
      res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', Connection: 'keep-alive' });
      res.write('event: state\ndata: ' + JSON.stringify(store.snapshot()) + '\n\n');
      clients.add(res); req.on('close', () => clients.delete(res)); return;
    }
    // Qualquer POST: só de origem local e com corpo JSON (bloqueia formulários e fetch "no-cors" de outros sites)
    if (req.method === 'POST' && (!origemOk(req) || !jsonOk(req))) return send(res, 403, { erro: 'origem ou tipo de conteúdo não permitido' });
    if (req.method === 'POST' && p === '/hook') {
      if (req.headers['x-edh-token'] !== MCP_TOKEN) return send(res, 403, { erro: 'token do hook inválido' });
      const h = await readBody(req);
      if (h.hook_event_name === 'PermissionRequest') {
        const a = store.applyHook({ ...h, hook_event_name: 'Notification', message: '' }) || null;
        if (!a) return send(res, 200, { decision: null });
        const ra = config.remoteApproval || {};
        // Espera resposta remota se o painel está à vista ou se o modo ausente está ligado (celular); senão, terminal
        const panelVisible = Date.now() - panelSeenAt <= PANEL_FRESH_MS;
        if (!ra.enabled || (!panelVisible && !store.away)) {
          const text = (h.tool_name || '') + ' ' + JSON.stringify(h.tool_input || {}).slice(0, 120);
          store.setState(a, 'waiting'); a.waitCmd = text; store.event(a, 'wait', 'Permissão', 'Pede permissão no terminal: ' + text);
          return send(res, 200, { decision: null });
        }
        const secs = store.away && !panelVisible ? (ra.timeoutAusenteSeconds || 300) : (ra.timeoutSeconds || 45);
        const pr = store.requestPermission(a, h.tool_name, h.tool_input, secs * 1000);
        // Claude Code desistiu (Esc, timeout do hook): encerra o pedido em vez de deixá-lo pendurado
        res.on('close', () => { if (!res.writableEnded) store.resolvePermission(pr.id, null); });
        const r = await pr;
        return send(res, 200, r || { decision: null });
      }
      store.applyHook(h);
      return send(res, 200, { ok: true });
    }
    // Modo ausente: { "on": true | false }
    /* ---- orquestra: quadro, tarefas delegadas, fluxos e sessões novas (painel e MCP) ---- */
    // Pasta do pedido: da sessão escolhida no painel (agente), do nome do projeto, ou a pasta de onde o MCP chamou (cwd)
    const pastaDe = b => {
      if (b.agente) { const a = store.agents.get(b.agente); if (a?.cwd) return a.cwd; }
      if (b.projeto) { const c = pastaDoProjeto(b.projeto); if (c) return c; }
      if (b.cwd && fs.existsSync(b.cwd)) {
        const alvo = path.resolve(b.cwd).toLowerCase();
        const conhecida = [...store.agents.values()].find(a => a.cwd && path.resolve(a.cwd).toLowerCase() === alvo);
        if (conhecida) return conhecida.cwd;
      }
      return null;
    };
    if (p === '/api/quadro' && req.method === 'GET') {
      // projeto pelo nome ou pela pasta da sessão (mesma regra de salas usada para gravar)
      const cwd = url.searchParams.get('cwd');
      const projeto = url.searchParams.get('projeto') || (cwd ? roomFor(cwd).project : '');
      return send(res, 200, lerQuadro(projeto, Number(url.searchParams.get('limite')) || 30));
    }
    if (p.startsWith('/api/tarefas') && req.method === 'GET') {
      const id = p.split('/')[3];
      return send(res, 200, id ? (tarefa(id) || { erro: 'não encontrada' }) : listaTarefas());
    }
    if (p === '/api/fluxos' && req.method === 'GET') return send(res, 200, modelosFluxo());
    // Conversas da sala (abertas e antigas) para "Continuar" no PC clicado
    if (p === '/api/sessoes' && req.method === 'GET') return send(res, 200, sessoesDaSala(url.searchParams.get('sala') || '', 12));
    // Cartão do projeto (clique na sala) e relatório mensal por cliente (página para imprimir/salvar em PDF)
    if (p === '/api/projeto' && req.method === 'GET') return send(res, 200, infoProjeto(url.searchParams.get('sala') || ''));
    if (p === '/relatorio' && req.method === 'GET') return send(res, 200, relatorioHTML(url.searchParams.get('cliente') || '', url.searchParams.get('mes') || ''), 'text/html; charset=utf-8');
    // Editor de salas: lê e grava config.json → rooms/floors, sem reiniciar o agente
    if (p === '/api/config/salas' && req.method === 'GET') return send(res, 200, { floors: config.floors || [], rooms: config.rooms.map(({ re, noSlot, ...r }) => r) });
    if (p === '/api/config/salas' && req.method === 'POST') {
      if (!authed(req)) return send(res, 403, { erro: 'token inválido' });
      const b = await readBody(req);
      if (!Array.isArray(b.rooms) || !b.rooms.length) return send(res, 400, { erro: 'lista de salas vazia' });
      const vagas = new Set();
      for (const r of b.rooms) {
        if (!r.room || !String(r.room).trim()) return send(res, 400, { erro: 'sala sem nome' });
        const k = r.floor + ':' + r.slot; if (Number.isInteger(r.slot) && vagas.has(k)) return send(res, 400, { erro: `duas salas na mesma vaga (andar ${r.floor}, vaga ${r.slot})` }); vagas.add(k);
      }
      if (!b.rooms.some(r => r.type === 'control' && r.floor === 0 && r.slot === 3)) return send(res, 400, { erro: 'a Diretoria (tipo control) precisa ficar no térreo, vaga 3' });
      try { aplicarSalas(b.rooms, b.floors); } catch (err) { return send(res, 400, { erro: 'expressão de pasta inválida: ' + err.message }); }
      for (const a of store.agents.values()) if (a.cwd) Object.assign(a, roomFor(a.cwd));
      store.changed();
      return send(res, 200, { ok: true });
    }
    if (req.method === 'POST' && ['/api/quadro', '/api/tarefas', '/api/fluxos', '/api/sessao'].includes(p)) {
      if (!authed(req)) return send(res, 403, { erro: 'token inválido' });
      const b = await readBody(req);
      try {
        if (p === '/api/quadro') {
          // recado não executa nada: a pasta de quem escreve só decide o quadro (mesma regra de salas da leitura)
          const cwd = b.agente || b.projeto ? pastaDe(b) : b.cwd, r = cwd ? roomFor(cwd) : { room: b.projeto, project: b.projeto };
          return send(res, 200, postar({ projeto: r.project, sala: r.room, de: b.de, para: b.para, texto: b.texto }) || { erro: 'mensagem vazia' });
        }
        const mesa = Number.isInteger(b.mesa) && b.mesa >= 0 && b.mesa < 8 ? b.mesa : null;
        // continuar uma conversa: a pasta vem da própria conversa
        if (p === '/api/sessao' && b.retomar) {
          const fonte = b.retomar.fonte === 'codex' ? 'codex' : 'claude', id = String(b.retomar.id || '');
          if (!/^[A-Za-z0-9-]{8,64}$/.test(id)) return send(res, 400, { erro: 'conversa inválida' });
          const pasta = pastaDaSessao(fonte, id);
          if (!pasta || !fs.existsSync(pasta)) return send(res, 400, { erro: 'não achei a pasta dessa conversa' });
          store.reservar(fonte + ':' + id, roomFor(pasta).room, mesa);
          abrirSessao(pasta, fonte, '', { sid: id, retomar: true });
          return send(res, 200, { ok: true, pasta });
        }
        const cwd = pastaDe(b);
        if (!cwd) return send(res, 400, { erro: 'não sei a pasta desse projeto: abra uma sessão nele antes ou informe a pasta' });
        // tarefa delegada não delega de novo: o MCP manda o id da tarefa em que roda
        const prof = b.job || Number(b.profundidade) ? 1 : 0;
        if (p === '/api/tarefas') return send(res, 200, delegar({ para: b.para, modo: b.modo, tarefa: b.tarefa, cwd, de: b.de || 'painel', profundidade: prof, mesa }));
        if (p === '/api/fluxos' && prof) return send(res, 400, { erro: 'tarefa delegada não pode iniciar fluxo' });
        if (p === '/api/fluxos') return send(res, 200, iniciarFluxo({ modelo: b.modelo, objetivo: b.objetivo, cwd, de: b.de || 'painel' }));
        if (p === '/api/sessao') {
          const sala = roomFor(cwd).room, prompt = String(b.prompt || '').slice(0, 8000);
          if (b.para === 'codex') { store.reservarCodex(sala, mesa); abrirSessao(cwd, 'codex', prompt); }
          else { const sid = crypto.randomUUID(); store.reservar('claude:' + sid, sala, mesa); abrirSessao(cwd, 'claude', prompt, { sid }); }
          return send(res, 200, { ok: true, pasta: cwd });
        }
      } catch (err) { return send(res, 400, { erro: err.message }); }
    }
    if (req.method === 'POST' && p === '/api/away') {
      if (req.headers['x-edh-token'] !== TOKEN) return send(res, 403, { erro: 'token inválido' });
      const b = await readBody(req); store.setAway(!!b.on, 'painel'); return send(res, 200, { away: store.away });
    }
    if (req.method === 'POST' && p === '/api/presence') {
      if (req.headers['x-edh-token'] !== TOKEN) return send(res, 403, { erro: 'token inválido' });
      panelSeenAt = Date.now(); return send(res, 200, { ok: true, remoteApproval: !!config.remoteApproval?.enabled });
    }
    if (req.method === 'POST' && p.startsWith('/api/permission/')) {
      if (req.headers['x-edh-token'] !== TOKEN) return send(res, 403, { erro: 'token inválido' });
      const id = decodeURIComponent(p.split('/').pop()), b = await readBody(req);
      if (!['allow', 'deny'].includes(b.decision)) return send(res, 400, { erro: 'decision deve ser allow ou deny' });
      return send(res, store.resolvePermission(id, b.decision, b.message) ? 200 : 404, { ok: true });
    }
    if (req.method === 'GET') {
      if (p === '/' || p === '/index.html') return serveFile(res, path.join(WEB, 'index.html'));
      // Com barra no fim, os scripts relativos do prédio (dados.js, cena.js…) resolvem dentro de /predio/
      if (p === '/predio') { res.writeHead(302, { Location: '/predio/' + url.search }); return res.end(); }
      if (p === '/predio/') return serveFile(res, path.join(WEB, 'predio', 'index.html'));
      const file = path.normalize(path.join(WEB, p));
      if (file !== WEB && !file.startsWith(WEB + path.sep)) return send(res, 403, { erro: 'caminho inválido' });
      return serveFile(res, file);
    }
    send(res, 404, { erro: 'rota não encontrada' });
  } catch (err) {
    send(res, 500, { erro: String(err.message || err) });
  }
});

export function startServer() {
  return new Promise((resolve, reject) => {
    server.once('error', err => {
      if (err.code === 'EADDRINUSE') console.error(`[server] porta ${PORT} ocupada. O agente já está rodando? Ou mude EDH_PORT no .env.`);
      reject(err);
    });
    server.listen(PORT, '127.0.0.1', () => { console.log(`[server] painel em http://localhost:${PORT}  ·  prédio em http://localhost:${PORT}/predio`); resolve(); });
  });
}
