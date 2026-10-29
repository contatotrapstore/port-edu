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

## Mapeamento para o prédio 3D
- `floor` + `room` → sala do `ROOM_DEFS`. Sala sem par no protótipo → criar sala genérica no andar (o prédio tem 8 vagas por andar; ver `slot`).
- `state` → igual ao protótipo.
- `tool` → `TOOL_PT` do protótipo (Edit → Editando etc.).
- Cada sessão ativa = um boneco. Subagentes sentam nas mesas 2 e 3 da mesma sala. Mais de 3 → excedentes ficam no sofá da sala com etiqueta.
- Agente `idle` vai para a convivência (mesma lógica de hoje).
- O que continuar simulado (funil, Workana, tráfego) fica com rótulo "simulado" até ter fonte real.
