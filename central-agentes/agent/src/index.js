// Ponto de entrada do agente local da Central de Agentes EDevsHub.
import { config } from './config.js';
import { store } from './store.js';
import { startServer } from './server.js';
import { startClaudeSessions } from './collectors/claude-sessions.js';
import { startCodexSessions } from './collectors/codex-sessions.js';
import { startElevenLabs } from './collectors/elevenlabs.js';
import { startClaudePlan } from './collectors/claude-plan.js';
import { startCodenotch } from './collectors/codenotch.js';

const [maj] = process.versions.node.split('.').map(Number);
if (maj < 20) { console.error(`Node ${process.versions.node} é antigo. Instale o Node 20 ou mais novo.`); process.exit(1); }

console.log('Central de Agentes · EDevsHub');
console.log(`[config] ${config._file}${config._file.endsWith('example.json') ? '  (copie para config.json e ajuste as salas)' : ''}`);

await startServer();
startClaudeSessions();
startCodexSessions();
startElevenLabs();
startClaudePlan();
startCodenotch();
setInterval(() => store.sweep(), 5000);
store.sweep();

process.on('uncaughtException', err => console.error('[erro]', err));
