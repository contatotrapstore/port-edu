// Remove só os hooks da Central de ~/.claude/settings.json (faz backup antes).
import fs from 'node:fs';
import path from 'node:path';
import { CLAUDE_HOME } from '../src/config.js';

const SETTINGS = path.join(CLAUDE_HOME, 'settings.json');
if (!fs.existsSync(SETTINGS)) { console.log('Nada para remover.'); process.exit(0); }
const raw = fs.readFileSync(SETTINGS, 'utf8');
let s; try { s = JSON.parse(raw); } catch { console.error('settings.json inválido, nada alterado.'); process.exit(1); }
fs.writeFileSync(SETTINGS + '.bak-' + new Date().toISOString().replace(/[:.]/g, '-'), raw);
let n = 0;
for (const ev of Object.keys(s.hooks || {})) {
  for (const g of s.hooks[ev]) { const before = (g.hooks || []).length; g.hooks = (g.hooks || []).filter(h => !String(h.command || '').includes('edh-hook.js')); n += before - g.hooks.length; }
  s.hooks[ev] = s.hooks[ev].filter(g => g.hooks.length);
  if (!s.hooks[ev].length) delete s.hooks[ev];
}
if (s.hooks && !Object.keys(s.hooks).length) delete s.hooks;
fs.writeFileSync(SETTINGS, JSON.stringify(s, null, 2));
console.log(`${n} hook(s) da Central removido(s).`);
