# Contrato de dados (agente → front)

O front (debug e prédio 3D) só conhece isto. Se mudar aqui, mude nos dois lados.

## GET /api/state
```jsonc
{
  "updatedAt": "2026-10-29T19:40:00.000Z",
  "usdBrl": 5.4,
  "agents": [
    {
      "id": "claude:3f2a…",              // fonte:sessionId (ou caminho do arquivo para subagente)
      "source": "claude",                // "claude" | "codex"
      "sessionId": "3f2a…",
      "cwd": "C:\\dev\\planetshake",
      "room": "PlanetShake",             // de config.rooms, ou nome da pasta
      "floor": 1,                        // 0 Térreo, 1 Desenvolvimento, 2 Comercial, 3 Marketing
      "name": "Principal",               // "Principal" ou "Sub · <tipo>"
      "model": "claude-opus-…",
      "state": "working",                // working | waiting | error | idle
      "tool": "Edit",                    // última ferramenta
      "target": "src/pages/Checkout.tsx",// arquivo, comando, padrão ou URL
      "prompt": "Corrige o deep link…",  // último prompt do usuário (texto completo, só local)
      "since": 1761766800000,            // início do estado atual (ms)
      "lastActivity": 1761766812000,
      "waitCmd": null,                   // texto do pedido de permissão
      "pendingId": null,                 // id do pedido pendente no agente
      "errMsg": null,
      "tokens": { "in": 0, "out": 0, "cacheRead": 0, "cacheWrite": 0 },
      "costUsdToday": 0.0,
      "tasksToday": 0,                   // turnos concluídos (Stop) hoje
      "log": [ { "t": 1761766812000, "kind": "tool", "tag": "Editando", "text": "src/pages/Checkout.tsx" } ]
    }
  ],
  "plans": {
    "claude": { "meters": [ { "label": "Sessão atual", "usedPct": 16, "resetAt": 1761770000000, "source": "estimado" } ] },
    "gpt":    { "meters": [ { "label": "Codex · janela de 5h", "usedPct": 8, "resetAt": 0, "source": "codex" } ] },
    "eleven": { "used": 20600, "limit": 30000, "resetAt": 1762300000000, "tier": "starter", "source": "api" },
    "higgs":  { "used": null, "limit": null, "source": "manual" }
  },
  "planInfo": { "claude": { "name": "Claude", "tier": "Max 20x", "brl": 1100 }, "higgs": { "manualCreditsTotal": null, "manualCreditsLeft": null } },
  "rooms": [ { "room": "PlanetShake", "floor": 1, "costUsdToday": 6.55, "tasksToday": 4 } ],   // acumulado do dia, inclui sessões que já fecharam
  "remoteApproval": true,
  "pending": [ { "id": "p_17…", "agentId": "claude:3f2a…", "tool": "Bash", "text": "npm run deploy", "at": 1761766812000 } ],
  "feed": [ { "t": 1761766812000, "agentId": "claude:3f2a…", "kind": "wait", "tag": "Permissão", "text": "Pede permissão: npm run deploy" } ]
}
```
`kind` de evento: `prompt`, `tool`, `wait`, `err`, `done`.

## GET /api/events (SSE)
- `event: state` → mesmo JSON do `/api/state` (enviado a cada mudança, no máximo 4 por segundo).
- `event: ping` a cada 20 s.

## POST /api/permission/:id
Header `X-EDH-Token: <token>` (o agente injeta em `window.EDH_TOKEN` nas páginas que serve).
Body `{ "decision": "allow" }` ou `{ "decision": "deny", "message": "motivo" }`.

## POST /api/away
Header `X-EDH-Token`. Body `{ "on": true | false }`. Liga/desliga o modo ausente (também por `/fora` e `/voltei` no Telegram e pelo site). O estado traz `away` e `roomBudgets` (`{ sala: R$ }` do config).

## Nuvem (Supabase, Fase 2)
`office_state.state` tem o mesmo formato do `/api/state`, sanitizado por `nuvem.js`: ids de sessão viram hash, `prompt`/`target`/`cwd`/`waitCmd`/`errMsg` não existem, `log` e `feed` vêm sem `text`, subagentes se chamam "Subagente". O prédio lê isso com `?fonte=nuvem`.

## POST /api/presence
Header `X-EDH-Token`. A página manda a cada 10 s enquanto está visível. Um `PermissionRequest` só espera a resposta do painel se houve aviso nos últimos 25 s; senão vai direto para o terminal.

## GET /api/history?date=AAAA-MM-DD&since=ms
Linhas `{ "t": ms, "a": [[id, room, floor, state, name, model], …] }` do dia (padrão hoje). Usado pelo replay.

## GET /api/costs
`{ "AAAA-MM-DD": { "<sala>": { "floor": 1, "costUsd": 6.55, "tasks": 4 } } }`. Usado pelo card "Custo por projeto".

## Mapeamento para o prédio 3D
- `room` → sala do `ROOM_DEFS` com o mesmo nome. Sem par → **Projetos avulsos** (térreo), e o painel do agente mostra o nome da pasta.
- `state` → igual ao protótipo.
- `tool` → `TOOL_PT` do protótipo (Edit → Editando etc.).
- Cada sessão = um boneco. Mesas por tipo de sala (projeto 3, estúdio 2, TI e recepção 1, Diretoria 1 porque a outra é do Dudu); quem sobra trabalha no sofá da sala.
- Agente `idle` vai para a convivência (mesma lógica de hoje).
- O que continuar simulado (funil, Workana, tráfego) fica com rótulo "simulado" até ter fonte real.
