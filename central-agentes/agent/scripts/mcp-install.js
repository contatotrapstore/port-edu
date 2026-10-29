// Registra (ou remove, com --remover) o MCP "central" no Claude Code (escopo do usuário) e no Codex (~/.codex/config.toml).
// Faz backup do config do Codex antes. Uso: npm run mcp:install | npm run mcp:uninstall
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { AGENT_DIR } from '../src/config.js';

const remover = process.argv.includes('--remover');
const SCRIPT = path.join(AGENT_DIR, 'mcp', 'central-mcp.js').replace(/\\/g, '/');
const run = (cmd, args) => spawnSync(cmd, args, { shell: process.platform === 'win32', encoding: 'utf8' });

// Claude Code (o nome vem antes do -e: o -e aceita vários valores e engoliria o nome)
const existe = run('claude', ['mcp', 'get', 'central']).status === 0;
if (existe) run('claude', ['mcp', 'remove', '--scope', 'user', 'central']);
if (!remover) {
  const r = run('claude', ['mcp', 'add', '--scope', 'user', 'central', '-e', 'EDH_CLIENTE=claude', '--', 'node', process.platform === 'win32' ? `"${SCRIPT}"` : SCRIPT]);
  console.log(r.status === 0 ? 'Claude Code: MCP "central" registrado (todas as pastas).' : 'Claude Code: falhou → ' + (r.stderr || r.stdout).trim());
} else console.log('Claude Code: MCP "central" removido.');

// Codex
const TOML = path.join(os.homedir(), '.codex', 'config.toml');
let toml = fs.existsSync(TOML) ? fs.readFileSync(TOML, 'utf8') : '';
// o bloco vai do cabeçalho até a próxima linha que começa com "[" (outra seção)
const bloco = /\n?\[mcp_servers\.central\]\r?\n(?:(?!\[)[^\n]*(?:\n|$))*/;
if (toml && !fs.existsSync(TOML + '.bak-central')) fs.writeFileSync(TOML + '.bak-central', toml);   // guarda o original uma vez só
// remove a versão com marcadores e, se houver, a versão antiga sem marcadores
toml = toml.replace(/\n?# >>> central-mcp[\s\S]*?# <<< central-mcp\n?/g, '\n');
toml = toml.replace(bloco, '');
toml = toml.replace(/\n?\[mcp_servers\.central\.[^\]\n]+\]\r?\n(?:(?!\[)[^\n]*(?:\n|$))*/g, '');   // subtabelas antigas (.env, .tools.*)
// O Codex filtra o ambiente dos servidores MCP: repassa a marca de tarefa delegada (trava contra cadeia sem fim),
// identifica o cliente e libera as ferramentas do "central" sem pedir aprovação (senão o `codex exec` não consegue usá-las)
if (!remover) toml = toml.replace(/\s*$/, '\n') + `\n# >>> central-mcp (gerado por central-agentes: npm run mcp:install)\n[mcp_servers.central]\ncommand = "node"\nargs = ["${SCRIPT}"]\nenv = { EDH_CLIENTE = "codex" }\nenv_vars = ["EDH_JOB_DEPTH", "EDH_JOB_ID", "EDH_PORT"]\ndefault_tools_approval_mode = "approve"\ntool_timeout_sec = 660\n# <<< central-mcp\n`;
fs.mkdirSync(path.dirname(TOML), { recursive: true });
fs.writeFileSync(TOML, toml);
console.log(remover ? 'Codex: MCP "central" removido.' : `Codex: MCP "central" registrado em ${TOML} (backup em config.toml.bak-central).`);
console.log('Abra uma sessão nova do Claude ou do Codex para as ferramentas central_* aparecerem.');
