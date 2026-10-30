# Fontes de dados

Cada fonte tem uma seção **Conferir**: são pontos escritos com base no formato conhecido até meados de 2026, que podem ter mudado. Antes de confiar no parser, abra um arquivo real e compare.

## 1. Claude Code — arquivos de sessão
- Pasta: `%USERPROFILE%\.claude\projects\<pasta-codificada>\<session-id>.jsonl` (no WSL: `~/.claude/projects/...` dentro do Linux).
- Uma linha JSON por evento. Campos usados:
  - `sessionId`, `cwd`, `timestamp`, `type` (`user` | `assistant` | `summary` | `system`)
  - `isSidechain: true` → mensagem de subagente
  - `message.model` (no `assistant`)
  - `message.usage`: `input_tokens`, `output_tokens`, `cache_creation_input_tokens`, `cache_read_input_tokens`
  - `message.content[]`: itens `text`, `tool_use` (`name`, `input`), `tool_result` (`is_error`)
- Prompt do usuário: linha `type: "user"` cuja `message.content` é texto (string ou item `text`), não `tool_result`.

**Conferir**
- Subagentes podem estar em arquivos separados (ex.: pasta `subagents/` ou `agent-*.jsonl`). O coletor lê qualquer `.jsonl` recursivamente, então eles aparecem como agentes próprios; ajustar o nome para "Sub · ...".
- A mesma resposta pode aparecer em várias linhas com o mesmo `message.id` (streaming). O coletor deduplica por `message.id` antes de somar tokens. Confirmar.

**Conferido em 29/10/2026** (Claude Code no Windows nativo, Opus 5.5):
- Campos acima batem. Há outros `type` (`attachment`, `ai-title`, `last-prompt`, `queue-operation`...) que o coletor ignora.
- Streaming: a mesma `message.id` aparece em várias linhas com `usage` **idêntico**; deduplicar pela primeira está certo.
- `usage.cache_creation` separa `ephemeral_5m_input_tokens` e `ephemeral_1h_input_tokens`. O Claude Code usa cache de **1h** (2x o preço de entrada, não 1,25x): preço em `pricing.*.cacheWrite1h`.
- Subagentes ficam em `<projeto>/<sessão>/subagents/agent-*.jsonl`, com um `agent-*.meta.json` ao lado (`agentType`, `description`). O nome no painel vem daí.
- Texto colado chega como `<pasted_content ...>`; o painel mostra só o que foi digitado, ou "[texto colado]".

### Quais conversas entram (conferido em 29/10/2026)
- **Entram:** Claude Code no terminal, na extensão do VS Code e no Claude Desktop (modo Code), porque gravam em `~/.claude/projects`; Codex CLI, app do Codex e a **extensão Codex do Chrome** (o conector local roda o Codex no PC e grava em `~/.codex/sessions`); subagentes.
- **Não entram:** conversas no claude.ai (navegador ou app) e na extensão **Claude in Chrome** usada pelo painel lateral, e no chatgpt.com. Elas ficam nos servidores da Anthropic/OpenAI, sem arquivo no PC e sem API pública de histórico. Para aparecerem no prédio, rode a tarefa pelo Claude Code (que controla o Chrome pelo MCP/extensão) ou pelo Codex: aí ela cai na sala da pasta onde foi aberta.
- `~/.codex/archived_sessions`: sessões antigas, comprimidas (.zst); ignoradas.

## 2. Claude Code — hooks
Configurados em `~/.claude/settings.json` → `hooks`. O script recebe um JSON no stdin com, entre outros: `session_id`, `transcript_path`, `cwd`, `hook_event_name`, `tool_name`, `tool_input`, `prompt` (em `UserPromptSubmit`), `message` (em `Notification`).

Eventos usados: `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Notification`, `PermissionRequest`, `Stop`, `SubagentStop`, `SessionEnd`.

Resposta para `PermissionRequest` (stdout):
```json
{"hookSpecificOutput":{"hookEventName":"PermissionRequest","decision":{"behavior":"allow"}}}
```
ou `"behavior":"deny"` com `"message"`.

**Conferir** na documentação oficial (docs.claude.com → Claude Code → Hooks):
- se o evento `PermissionRequest` existe na versão instalada e o formato exato da resposta;
- se não existir, alternativa: `PreToolUse` com `permissionDecision: "allow" | "deny" | "ask"` só para as ferramentas que normalmente pedem permissão (cuidado: isso aprovaria/negaria antes da regra de permissões normal).

## 3. Codex — arquivos de sessão
- Pasta: `%USERPROFILE%\.codex\sessions\AAAA\MM\DD\rollout-*.jsonl`.
- Linhas `{ timestamp, type, payload }`:
  - `session_meta` → `payload.id`, `payload.cwd`
  - `turn_context` → `payload.cwd`, `payload.model`
  - `response_item` com `payload.type: "message"`, `role: "user"` → prompt; `payload.type: "function_call"` → ferramenta (`name`, `arguments`)
  - `event_msg` com `payload.type: "token_count"` → `payload.info.total_token_usage` (`input_tokens`, `cached_input_tokens`, `output_tokens`) e **`payload.rate_limits`** (`primary` = janela de 5h, `secondary` = semanal; `used_percent`, `window_minutes`, `resets_in_seconds` ou `resets_at`)
- Os `rate_limits` são a fonte do medidor do **ChatGPT/Codex** no painel.

**Conferido em 29/10/2026** (modelo `gpt-6-astra`, plano `prolite`):
- `rate_limits.primary` é a janela **semanal** (`window_minutes: 10080`, `resets_at` em segundos) e `secondary` vem `null`. Não há janela de 5h hoje. O rótulo do medidor é gerado por `window_minutes`.
- Não há `event_msg` `user_message`; o prompt vem de `response_item` `message`/`user`. Quando o Codex é chamado pelo plugin do Claude Code, esse "prompt" é o texto que o Claude mandou.
- Outros tipos novos ignorados: `world_state`, `token_usage_record`, `compacted`, `inter_agent_communication_metadata`.

## 4. Uso do plano Claude (sessão de 5h e semanais)
**Em uso: leitura direta da conta** (`agent/src/collectors/claude-plan.js`, a cada 3 min). Usa o login local do Claude Code (`~/.claude/.credentials.json`) para chamar `GET https://api.anthropic.com/api/oauth/usage` (header `anthropic-beta: oauth-2025-04-20`), o mesmo dado do `/usage` do Claude Code. A lista `limits` traz `kind` (`session`, `weekly_all`, `weekly_scoped`), `percent`, `resets_at` e, no escopo, `scope.model.display_name` (ex.: "Fable"). Endpoint não documentado: pode mudar. Com 429 o coletor espera 5 min; sem leitura por 30 min (`CODENOTCH_FRESH_MS`), volta para a estimativa pelos JSONL. O token nunca é logado.

Desde 30/10/2026 o **Codenotch foi desligado** (era o app que fazia essa leitura): saiu do início do Windows (valor antigo guardado em `agent/data/codenotch-desligado.json`) e os hooks dele saíram do `~/.claude/settings.json` (backup em `settings.json.bak-codenotch`). O programa continua instalado em `%LOCALAPPDATA%\Codenotch` caso queira voltar.

Codex: medidor semanal pelos `rate_limits` dos JSONL das sessões (`codex-sessions.js`).

## 5. ElevenLabs
- `GET https://api.elevenlabs.io/v1/user/subscription`, header `xi-api-key`.
- Campos: `tier`, `character_count`, `character_limit`, `next_character_count_reset_unix`.
- Chave em `agent/.env` → `ELEVENLABS_API_KEY`. Criar chave com permissão só de leitura de usuário.

## 6. Higgsfield
- Pendente: confirmar plano, créditos e se existe API de saldo. Enquanto isso, valor manual em `config.json → plans.higgs`.

## 7. Preços por token (custo equivalente em API)
Tabela em `config.json → pricing` (US$ por milhão de tokens, por prefixo do nome do modelo). Conferidos em 29/10/2026: Claude pela tabela oficial da Anthropic; OpenAI por CloudZero (21/10/2026) e MorphLLM (a página da OpenAI bloqueia leitura automática). Modelo do Codex hoje: `gpt-6-astra` (US$ 10 / 50, cache lido US$ 1). O valor é "equivalente em API": no plano Max não é cobrança real, serve para comparar projetos.
