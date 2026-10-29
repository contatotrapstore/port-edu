// Fase 2: espelha um RESUMO SANITIZADO no Supabase para o painel /central do site (celular) e traz de volta
// as decisões de permissão e o modo ausente. Desligado se faltar SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY no .env.
// Nunca sai do PC: prompt, comando pedido, caminho de pasta, texto do feed, nome de subagente (pode citar cliente).
// Tabelas e regras de acesso: central-agentes/supabase/central-agentes.sql
import crypto from 'node:crypto';
import { store } from './store.js';

const BASE = String(process.env.SUPABASE_URL || '').replace(/\/+$/, '');
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const hid = id => crypto.createHash('sha256').update(String(id)).digest('hex').slice(0, 12);
const mirrored = new Set();   // pedidos de permissão que estão no Supabase
let pushTimer = null, lastControlAt = null;

async function rest(method, pathQ, body, prefer = 'return=minimal') {
  const r = await fetch(`${BASE}/rest/v1/${pathQ}`, { method, headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json', Prefer: prefer }, body: body ? JSON.stringify(body) : undefined });
  if (!r.ok) throw new Error(`${method} ${pathQ.split('?')[0]}: ${r.status} ${(await r.text()).slice(0, 160)}`);
  return r.status === 204 ? null : r.json().catch(() => null);
}

/** O que vai para a nuvem: mesmo formato do /api/state, sem texto livre. */
export function sanitize(s) {
  return {
    updatedAt: s.updatedAt, usdBrl: s.usdBrl, away: s.away, remoteApproval: s.remoteApproval,
    agents: s.agents.map(a => ({
      id: hid(a.id), source: a.source, room: a.room, project: a.project, floor: a.floor, name: /^Sub/.test(a.name) ? 'Subagente' : a.name,
      model: a.model, state: a.state, tool: a.tool, since: a.since, lastActivity: a.lastActivity, pendingId: a.pendingId,
      costUsdToday: a.costUsdToday, tasksToday: a.tasksToday, tokens: a.tokens,
      log: a.log.slice(0, 8).map(e => ({ t: e.t, kind: e.kind, tag: e.tag, text: '' })),
    })),
    plans: s.plans, planInfo: s.planInfo, rooms: s.rooms, projects: s.projects, roomBudgets: s.roomBudgets, layout: s.layout,
    content: s.content,
    // tarefas delegadas: só situação (o texto da tarefa e o resultado ficam no PC); quadro não sobe
    tarefas: (s.tarefas || []).map(({ id, para, modo, projeto, status, criadaEm, fim, custoUsd }) => ({ id, para, modo, projeto, status, criadaEm, fim, custoUsd })),   // contagens e temas dos posts públicos do Instagram (sem tokens)
    uptime: (s.uptime || []).map(({ site, ok, status, ms, upPct, at }) => ({ site, ok, status, ms, upPct, at })),
    pending: s.pending.map(p => ({ id: p.id, agentId: hid(p.agentId), tool: p.tool, at: p.at })),
    feed: s.feed.slice(0, 40).map(e => ({ t: e.t, agentId: hid(e.agentId), kind: e.kind, tag: e.tag, text: '' })),
  };
}

async function push() {
  pushTimer = null;
  try { await rest('POST', 'office_state?on_conflict=id', [{ id: 'principal', state: sanitize(store.snapshot()), updated_at: new Date().toISOString() }], 'resolution=merge-duplicates,return=minimal'); }
  catch (err) { console.log('[nuvem]', err.message); }
}

async function pollDecisions() {
  if (!mirrored.size) return;
  try {
    const rows = await rest('GET', 'permission_requests?status=eq.decided&select=id,decision', null, '');
    for (const r of rows || []) {
      if (!mirrored.has(r.id)) continue;
      store.resolvePermission(r.id, r.decision, r.decision === 'deny' ? 'Negado pelo site' : undefined);
    }
  } catch (err) { console.log('[nuvem]', err.message); }
}

async function pollControl() {
  try {
    const [c] = await rest('GET', 'office_control?id=eq.principal&select=away,updated_at', null, '') || [];
    if (!c) return;
    if (lastControlAt === null) { lastControlAt = c.updated_at; return; }   // ao subir, não aplica comando antigo
    if (c.updated_at !== lastControlAt) { lastControlAt = c.updated_at; if (!!c.away !== store.away) store.setAway(!!c.away, 'site'); }
  } catch (err) { console.log('[nuvem]', err.message); }
}

export function startNuvem() {
  if (!BASE || !KEY) { console.log('[nuvem] sem SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY no .env, painel do site desligado'); return; }
  store.on('change', () => { if (!pushTimer) pushTimer = setTimeout(push, 3000); });
  store.on('permission', p => {
    rest('POST', 'permission_requests', [{ id: p.id, room: p.room, tool: p.tool, status: 'pending', expires_at: new Date(Date.now() + p.timeoutMs).toISOString() }])
      .then(() => mirrored.add(p.id)).catch(err => console.log('[nuvem]', err.message));
  });
  store.on('permission-resolved', ({ id, decision }) => {
    if (!mirrored.has(id)) return; mirrored.delete(id);
    rest('PATCH', `permission_requests?id=eq.${encodeURIComponent(id)}`, { status: decision ? 'resolved' : 'expired', decision: decision || null }).catch(err => console.log('[nuvem]', err.message));
  });
  store.on('away', (on, origem) => {
    if (origem === 'site') return;
    const at = new Date().toISOString(); lastControlAt = at;
    rest('POST', 'office_control?on_conflict=id', [{ id: 'principal', away: on, updated_at: at }], 'resolution=merge-duplicates,return=minimal').catch(err => console.log('[nuvem]', err.message));
  });
  setInterval(pollDecisions, 3000);
  setInterval(pollControl, 10e3); pollControl();
  push();
  console.log('[nuvem] espelhando resumo sanitizado no Supabase');
}
