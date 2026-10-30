// Teste do estado dos agentes sem rede nem arquivos de sessão: hooks do Claude Code, custo, permissões e salas.
// Uso: node scripts/teste-store.mjs
import assert from 'node:assert/strict';
import { config, roomFor } from '../src/config.js';
import { store } from '../src/store.js';

let ok = 0;
const caso = (nome, fn) => { fn(); ok++; console.log('ok ·', nome); };
const sid = 'teste-' + Date.now(), cwd = 'C:\\pasta-que-nao-existe\\projeto-teste';
const ultimo = a => a.log[0];

caso('pasta desconhecida cai na sala de avulsos, com o nome da pasta como projeto', () => {
  const fb = config.rooms.find(r => r.fallback && !r.noSlot);
  const r = roomFor(cwd);
  assert.equal(r.room, fb.room); assert.equal(r.project, 'projeto-teste');
});

caso('SessionStart cria a sessão na sala certa', () => {
  const a = store.applyHook({ hook_event_name: 'SessionStart', session_id: sid, cwd });
  assert.equal(a.id, 'claude:' + sid); assert.equal(a.project, 'projeto-teste');
});

caso('UserPromptSubmit → trabalhando, com o prompt guardado', () => {
  const a = store.applyHook({ hook_event_name: 'UserPromptSubmit', session_id: sid, cwd, prompt: 'arrumar o login' });
  assert.equal(a.state, 'working'); assert.equal(a.prompt, 'arrumar o login');
});

caso('PreToolUse marca a ferramenta aberta; PostToolUse fecha', () => {
  let a = store.applyHook({ hook_event_name: 'PreToolUse', session_id: sid, cwd, tool_name: 'Bash', tool_input: { command: 'npm test' } });
  assert.equal(a.tool, 'Bash'); assert.ok(a._toolOpen > 0);
  a = store.applyHook({ hook_event_name: 'PostToolUse', session_id: sid, cwd, tool_name: 'Bash' });
  assert.equal(a._toolOpen, 0); assert.equal(a.state, 'working');
});

caso('Stop → ocioso, sem ferramenta, evento "Concluído"', () => {
  const a = store.applyHook({ hook_event_name: 'Stop', session_id: sid, cwd });
  assert.equal(a.state, 'idle'); assert.equal(a.tool, ''); assert.equal(ultimo(a).tag, 'Concluído');
});

caso('custo: mesma resposta lida duas vezes conta uma vez só', () => {
  const a = store.agents.get('claude:' + sid), antes = a.costUsdToday;
  const uso = { input_tokens: 1000, output_tokens: 500 };
  store.addUsage(a, 'msg-1', 'claude-opus-5-5', uso, Date.now());
  const depois = a.costUsdToday;
  store.addUsage(a, 'msg-1', 'claude-opus-5-5', uso, Date.now());
  assert.ok(depois > antes, 'custo deveria subir'); assert.equal(a.costUsdToday, depois);
  const sala = store.dayTotals().projects.find(p => p.project === 'projeto-teste');
  assert.ok(sala && sala.costUsdToday > 0, 'custo deveria aparecer no projeto');
});

caso('contexto longo da OpenAI: fator dobra a entrada', () => {
  const a = store.agent('codex:teste-' + sid, { source: 'codex', sessionId: 'x', cwd });
  store.addUsage(a, 'c1', 'gpt-5', { input_tokens: 1e6, output_tokens: 0 }, Date.now());
  const simples = a.costUsdToday;
  store.addUsage(a, 'c2', 'gpt-5', { input_tokens: 1e6, output_tokens: 0 }, Date.now(), { in: 2, out: 1.5 });
  assert.ok(Math.abs(a.costUsdToday - simples * 3) < 1e-9);
});

caso('SessionEnd encerra a sessão', () => {
  const a = store.applyHook({ hook_event_name: 'SessionEnd', session_id: sid, cwd });
  assert.equal(a.ended, true); assert.equal(a.state, 'idle');
});

caso('PC escolhido: sessão do Claude reservada senta na mesa certa', () => {
  const fb = roomFor(cwd).room;
  store.reservar('claude:mesa-' + sid, fb, 2);
  const a = store.applyHook({ hook_event_name: 'SessionStart', session_id: 'mesa-' + sid, cwd });
  assert.equal(a.mesa, 2);
});

caso('PC escolhido: Codex novo pega a reserva da sala; sessão antiga não rouba', () => {
  const fb = roomFor(cwd).room;
  const velho = store.agent('codex:velho-' + sid, { source: 'codex', sessionId: 'velho', cwd });
  velho._criado = Date.now() - 60e3;
  store.reservarCodex(fb, 1);
  store.agent('codex:velho-' + sid, { source: 'codex', cwd });   // sessão antiga se mexendo
  assert.equal(velho.mesa, undefined);
  const novo = store.agent('codex:novo-' + sid, { source: 'codex', sessionId: 'novo', cwd });
  assert.equal(novo.mesa, 1);
});

// pedido de permissão: decisão chega na promise e o agente sai de "esperando"
const a = store.applyHook({ hook_event_name: 'UserPromptSubmit', session_id: sid, cwd, prompt: 'de novo' });
const pedido = store.requestPermission(a, 'Bash', { command: 'git push' }, 5000);
assert.equal(a.state, 'waiting');
store.resolvePermission(a.pendingId, 'allow');
const r = await pedido;
assert.equal(r?.decision ?? r, 'allow');
ok++; console.log('ok · pedido de permissão resolvido pelo painel');

console.log(`\n${ok} casos passaram.`);
process.exit(0);
