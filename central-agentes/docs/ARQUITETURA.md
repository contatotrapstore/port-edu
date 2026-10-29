# Arquitetura

## Fase 1 — local (agora)

```
 Claude Code ──hooks (stdin JSON)──► agent/hooks/edh-hook.js ──POST /hook──┐
 Claude Code ──~/.claude/projects/**/*.jsonl ──(leitura incremental)──────┤
 Codex ───────~/.codex/sessions/**/rollout-*.jsonl ──(leitura)────────────┤
 ElevenLabs ──GET /v1/user/subscription (a cada 10 min)───────────────────┤
                                                                          ▼
                                                   agent (Node, 127.0.0.1:4321)
                                                   store em memória + data/state.json
                                                          │
                              GET /api/state  ·  GET /api/events (SSE)  ·  POST /api/permission/:id
                                                          ▼
                                    navegador: web/index.html (debug) e o prédio 3D
```

### Por que hooks **e** arquivos JSONL
- **Hooks** chegam na hora e dizem o estado com precisão: prompt enviado, ferramenta usada, pedido de permissão, fim do turno. Não trazem contagem de tokens.
- **JSONL** traz modelo e uso de tokens de cada resposta (para custo) e funciona mesmo sem hooks instalados ou com o agente desligado (lê o histórico ao ligar).
- O store junta os dois pela `session_id`.

### Estado de cada agente
| Estado | Como é detectado |
|---|---|
| `working` | `UserPromptSubmit`, `PreToolUse`, `PostToolUse`; ou atividade no JSONL nos últimos 90 s |
| `waiting` | `PermissionRequest`, ou `Notification` cujo texto fala em permissão |
| `error` | Resultado de ferramenta com `is_error: true` no JSONL (melhorar depois) |
| `idle` | `Stop`, `Notification` de "aguardando entrada", ou sem atividade há 90 s |
| encerrado | `SessionEnd`, ou sem atividade há mais de `idleHideMinutes` |

### Aprovação de permissão
1. O Claude Code dispara `PermissionRequest` → o hook faz `POST /hook?wait=1`.
2. Se `remoteApproval.enabled` for falso, o agente responde na hora com `decision: null` e o terminal mostra o pedido normalmente.
3. Se for verdadeiro, o agente segura a requisição, publica o pedido no SSE e espera `POST /api/permission/:id` com `allow` ou `deny`, até `timeoutSeconds`.
4. Sem resposta, `decision: null` → o pedido aparece no terminal como sempre.

Atenção: enquanto o hook espera, o terminal fica aguardando. Por isso o timeout padrão é curto (45 s) e o recurso vem desligado.

### Sala de cada agente
`config.json → rooms[]`: cada item tem `match` (texto ou regex que casa com o `cwd` da sessão), `room`, `floor`. Sem casamento, a sala vira o nome da pasta.

## Fase 2 — painel no site (depois)
- O agente envia a cada 10–15 s um **resumo sanitizado** para o Supabase (tabela `office_state`, uma linha por agente + uma linha de planos). Sem prompts completos, sem caminhos de arquivo de cliente, sem código. Prompt vira um título curto, opcionalmente.
- Rota `/admin` no site (Vercel, Next.js), protegida por login do Supabase Auth, só o e-mail do Eduardo. Lê com Realtime.
- Pedidos de permissão vão para um bot (Telegram é o mais simples; WhatsApp via API oficial ou Baileys). O botão do bot grava a decisão no Supabase; o agente local escuta e responde ao hook.
- Nunca expor a porta local para a internet. Se quiser acesso remoto direto ao local, usar Tailscale.

## Segurança
- Servidor só em `127.0.0.1`. Checar o header `Host` para evitar DNS rebinding (já feito no `server.js`).
- `POST /api/permission` só aceita requisições com header `X-EDH-Token` igual ao token gerado na inicialização (o painel recebe o token embutido na página). Isso impede outro site aberto no navegador de aprovar comandos.
- `.env` e `config.json` no `.gitignore`.
