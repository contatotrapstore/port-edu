// Adiciona os hooks da Central em ~/.claude/settings.json (faz backup antes).
// Idempotente: rodar de novo não duplica. Remover: npm run hooks:uninstall
import fs from 'node:fs';
import path from 'node:path';
import { AGENT_DIR, CLAUDE_HOME, config } from '../src/config.js';

const SETTINGS = path.join(CLAUDE_HOME, 'settings.json');
const HOOK = path.join(AGENT_DIR, 'hooks', 'edh-hook.js');
const MARK = 'edh-hook.js';
const cmd = `node "${HOOK.replace(/\\/g, '/')}"`;

// Eventos com matcher de ferramenta vs. eventos sem matcher
const TOOL_EVENTS = ['PreToolUse', 'PostToolUse', 'PermissionRequest'];
const OTHER_EVENTS = ['SessionStart', 'UserPromptSubmit', 'Notification', 'Stop', 'SubagentStop', 'SessionEnd'];

fs.mkdirSync(CLAUDE_HOME, { recursive: true });
let settings = {};
if (fs.existsSync(SETTINGS)) {
  const raw = fs.readFileSync(SETTINGS, 'utf8');
  try { settings = JSON.parse(raw); } catch { console.error(`Não consegui ler ${SETTINGS} (JSON inválido). Nada foi alterado.`); process.exit(1); }
  const bak = SETTINGS + '.bak-' + new Date().toISOString().replace(/[:.]/g, '-');
  fs.writeFileSync(bak, raw); console.log('Backup:', bak);
}
settings.hooks ||= {};
const permTimeout = Math.max(60, (config.remoteApproval?.timeoutSeconds || 45) + 15);

for (const ev of [...TOOL_EVENTS, ...OTHER_EVENTS]) {
  const list = (settings.hooks[ev] ||= []);
  // remove instalações anteriores da Central
  for (const grp of list) grp.hooks = (grp.hooks || []).filter(h => !String(h.command || '').includes(MARK));
  settings.hooks[ev] = list.filter(g => (g.hooks || []).length);
  const entry = { type: 'command', command: cmd, timeout: ev === 'PermissionRequest' ? permTimeout : 5 };
  settings.hooks[ev].push(TOOL_EVENTS.includes(ev) ? { matcher: '*', hooks: [entry] } : { hooks: [entry] });
}

fs.writeFileSync(SETTINGS, JSON.stringify(settings, null, 2));
console.log(`Hooks instalados em ${SETTINGS}`);
console.log('Abra uma NOVA sessão do Claude Code para valer. Confira com /hooks dentro do Claude Code.');
