# Roadmap

Marque `[x]` ao concluir. Faça na ordem; cada item diz como saber que terminou.

## Fase 0 — pendências do Eduardo
- [x] Node 20+ instalado (`node -v`) — v22.23.2
- [x] Claude Code roda no Windows nativo ou no WSL? — **Windows nativo** (`C:UsersGouveiaRx.claude`)
- [x] Nome da ferramenta de uso do Windows — **Codenotch** (`%APPDATA%\codenotch`); o agente lê os arquivos dele
- [ ] Plano e créditos da Higgsfield; existe API de saldo?
- [ ] Dia de renovação de cada plano
- [ ] Chave da ElevenLabs só de leitura, colada em `agent/.env` (nunca no chat)

## Fase 1 — local, com dados reais
### 1.1 Validar o agente
- [x] `npm start` sobe sem erro; http://localhost:4321 abre o painel de depuração (29/10/2026)
- [x] Sessões abertas do Claude Code aparecem com sala, modelo, prompt e ferramenta corretos (subagentes com nome do `.meta.json`; texto colado vira "[texto colado]")
- [x] Sessões do Codex aparecem; medidor vem do Codenotch (o Codex hoje só tem a janela **semanal**: `primary`, 10080 min; `secondary: null`). Sem Codenotch, cai nos `rate_limits` do JSONL
- [ ] Tokens e custo do dia batem — preços Claude e OpenAI conferidos (29/10/2026), cache de 1h cobrado a 2x. Falta: comparar com uma ferramenta externa; a regra de contexto longo da OpenAI (>272 mil tokens) não é aplicada
- [x] Ajustar parsers onde os campos reais forem diferentes do documentado em `FONTES-DE-DADOS.md` (ver "Conferido em 29/10/2026" lá)

### 1.2 Hooks
- [x] `npm run hooks:install`; abrir nova sessão do Claude Code (instalado em 29/10/2026; hooks do Codenotch, rtk e plan-mode preservados)
- [x] Estado muda na hora (working/idle) ao mandar prompt e ao terminar (testado com `claude -p`: SessionStart → prompt → ferramenta → Stop → SessionEnd)
- [x] Com o agente **desligado**, o Claude Code continua funcionando normal (hook sai com 0, sem saída, ~140 ms)
- [x] `PermissionRequest` existe (Claude Code 2.1.170, formato conferido na doc). Testado com o hook real + API: Permitir e Negar chegam certos; sem token dá 403. `remoteApproval` fica **desligado** por padrão: ligado, todo pedido de permissão espera o painel até `timeoutSeconds` antes de cair no terminal
- [ ] Melhoria: só esperar o painel se houver um painel aberto (cliente SSE conectado); aí dá para deixar `remoteApproval` sempre ligado

### 1.3 Ligar o prédio 3D aos dados reais (tarefa principal)
- [ ] Mover `prototipo/predio.html` para `web/predio.html` e separar em `web/predio/{index.html, app.js, cena.js, sim.js, ui.js}` (o arquivo único passou de 2.000 linhas)
- [ ] Criar `web/predio/fonte.js` com duas fontes: `simulada` (o `sim` atual) e `real` (SSE `/api/events`). Chave na URL: `?fonte=real` (padrão quando servido pelo agente)
- [ ] Gerar `ROOMS` a partir de `config.rooms` + salas fixas (Recepção, Reunião, Diretoria, Cabines, Estúdio)
- [ ] Criar/remover bonecos conforme as sessões entram e saem (animação de entrar pelo elevador)
- [ ] Botões Permitir/Negar chamam `POST /api/permission/:id`
- [ ] "Mandar tarefa" no modo real: por enquanto copia o texto e mostra "cole no terminal da sala X" (não dá para injetar prompt numa sessão aberta). Ver 3.x
- [ ] Planos: usar `state.plans`; esconder campos sem fonte
- [ ] Remover o rótulo "dados simulados" das partes que vierem do agente

### 1.4 Medidores dos planos
- [ ] Codex: pelos `rate_limits` dos JSONL
- [x] Claude: lido do Codenotch (sessão, semanal e semanal por modelo); a estimativa por tokens só entra se o Codenotch estiver parado há mais de 30 min
- [ ] ElevenLabs: API
- [ ] Higgsfield: manual em `config.json` até ter API

### 1.5 Ligar com o Windows
- [ ] Script `agent/scripts/autostart-windows.ps1` que cria um atalho na pasta Inicializar rodando `node src/index.js` minimizado (ou usar `pm2` + `pm2-windows-startup`)
- [ ] Manifest PWA + ícone EDevsHub em `web/` para instalar como app

### 1.6 Histórico
- [ ] Gravar snapshot a cada 2 s em `agent/data/AAAA-MM-DD.jsonl` (rotacionar por dia, manter 7 dias)
- [ ] Replay do prédio lê esse histórico (hoje só guarda em memória)
- [ ] Custo por projeto por dia/semana/mês, para relatório por cliente

## Fase 2 — celular e site
- [ ] Supabase: tabela `office_state` e `permission_requests` (RLS: só o usuário dele)
- [ ] Agente envia resumo sanitizado (sem prompt completo, sem caminhos, sem código)
- [ ] `/admin` no site no Vercel (Next.js) com login, prédio 3D lendo do Supabase Realtime
- [ ] Bot do Telegram: avisa "precisa de você" com botões Permitir/Negar; decisão volta ao agente local
- [ ] Alerta quando plano vai estourar antes do reset ou projeto passa do orçamento

## Fase 3 — ideias guardadas
- Disparar tarefas de verdade: iniciar `claude -p "<prompt>"` na pasta do projeto a partir do painel (sessão nova, não a aberta)
- Relatório PDF de custo por cliente (identidade EDevsHub)
- Sala "somente leitura" para mostrar a um cliente o andamento do projeto dele
- Integrações reais do Comercial (Workana não tem API pública: avaliar só entrada manual) e Marketing (Meta Graph API para seguidores e alcance)
