// Servidor local: painel, API, SSE e entrada dos hooks. Escuta só em 127.0.0.1.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { ROOT_DIR, PORT, config } from './config.js';
import { store } from './store.js';
import { readHistory, readCosts, dayKey } from './history.js';

const TOKEN = crypto.randomBytes(16).toString('hex');
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
    if (req.method === 'GET' && p === '/api/history') return send(res, 200, readHistory(url.searchParams.get('date') || dayKey(), Number(url.searchParams.get('since')) || 0));
    // Custo e tarefas por sala por dia: { "AAAA-MM-DD": { sala: { floor, costUsd, tasks } } }
    if (req.method === 'GET' && p === '/api/costs') return send(res, 200, readCosts());
    if (req.method === 'GET' && p === '/api/events') {
      res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', Connection: 'keep-alive' });
      res.write('event: state\ndata: ' + JSON.stringify(store.snapshot()) + '\n\n');
      clients.add(res); req.on('close', () => clients.delete(res)); return;
    }
    if (req.method === 'POST' && p === '/hook') {
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
        const r = await store.requestPermission(a, h.tool_name, h.tool_input, secs * 1000);
        return send(res, 200, r || { decision: null });
      }
      store.applyHook(h);
      return send(res, 200, { ok: true });
    }
    // Modo ausente: { "on": true | false }
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
      if (!file.startsWith(WEB)) return send(res, 403, { erro: 'caminho inválido' });
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
