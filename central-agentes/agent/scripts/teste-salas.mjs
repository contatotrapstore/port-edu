// Mostra em qual sala cada pasta cai e o layout do prédio. Uso: node scripts/teste-salas.mjs
import { config, roomFor } from '../src/config.js';

const pastas = [
  'c:\\Users\\GouveiaRx\\Downloads\\Port Edu', 'c:\\Users\\GouveiaRx\\Downloads\\Port Edu\\central-agentes', 'C:\\Users\\GouveiaRx\\Downloads\\Port Edu\\central-agentes\\agent',
  'C:\\Users\\GouveiaRx\\.codex\\worktrees\\content-studio\\Port Edu', 'C:\\Users\\GouveiaRx\\Downloads\\Marcelo', 'C:\\Users\\GouveiaRx\\Downloads\\Marcelo-wt\\testes-relogio',
  'c:\\Users\\GouveiaRx\\Downloads\\Kommo', 'c:\\Users\\GouveiaRx\\Downloads\\Beeder', 'c:\\Users\\GouveiaRx\\Downloads\\Planet', 'c:\\Users\\GouveiaRx\\Downloads\\Renato',
  'C:\\Users\\GouveiaRx\\Downloads\\Financeiro', 'c:\\Users\\GouveiaRx\\Downloads\\AntiCassino', 'C:\\Users\\GouveiaRx\\Documents\\Codex\\2026-10-22\\se',
  'c:\\Users\\GouveiaRx\\Downloads\\Alberto', 'c:\\Users\\GouveiaRx\\Downloads\\Fernando', 'c:\\Users\\GouveiaRx\\Downloads\\Revix', 'c:\\Users\\GouveiaRx\\Downloads\\Elyndra-Market-2026-10-23',
  'C:\\Users\\GouveiaRx\\Downloads\\Fernando\\web', 'c:\\Users\\GouveiaRx\\Downloads\\Plat Fernando', 'c:\\Users\\GouveiaRx\\Downloads\\Danyllo', 'c:\\Users\\GouveiaRx\\Downloads\\Valoran',
  'c:\\Users\\GouveiaRx\\Documents\\Site Mae', 'c:\\Users\\GouveiaRx\\Downloads\\Aion Test', 'C:\\Users\\GouveiaRx', 'd:\\DOCS\\Automação', 'c:\\Users\\GouveiaRx\\Downloads\\Hospedagens',
];
for (const p of pastas) { const r = roomFor(p); console.log(`${r.room.padEnd(26)} ${String(r.floor)}  ${r.project.padEnd(26)} ← ${p}`); }
console.log('\nlayout:'); for (const r of config.layout.rooms) console.log(`  andar ${r.floor} vaga ${r.slot}  ${r.type.padEnd(9)} ${r.room}`);
