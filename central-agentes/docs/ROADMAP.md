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
- [x] Melhoria: só espera o painel se ele estiver aberto **e visível** (a página avisa `POST /api/presence` a cada 10 s). `remoteApproval` agora vem ligado

### 1.3 Ligar o prédio 3D aos dados reais (tarefa principal)
- [x] Mover `prototipo/predio.html` para `web/predio/` e separar em `index.html, predio.css, dados.js, sim.js, cena.js, ui.js, app.js` (corte mecânico, scripts clássicos com escopo global compartilhado)
- [x] Criar `web/predio/fonte.js` com duas fontes: `simulada` (o `sim` atual) e `real` (SSE `/api/events`). Chave na URL: `?fonte=simulada` / `?fonte=real` (real é o padrão quando servido pelo agente)
- [x] Salas: o prédio mantém as salas fixas e casa pelo nome que o `config.rooms` gera. Pasta sem sala vai para **Projetos avulsos** (a antiga Sala de reunião, no térreo); o painel do agente mostra o nome da pasta
- [x] Criar/remover bonecos conforme as sessões entram e saem (sessão nova chega pelo elevador do térreo; na primeira carga todos já aparecem no lugar). Mesas por tipo de sala; quem sobra senta no sofá
- [x] Botões Permitir/Negar chamam `POST /api/permission/:id` (testado com o hook real: `allow` voltou para o Claude Code). Sem pedido pendente no agente, o painel diz para responder no terminal
- [x] "Mandar tarefa" no modo real copia o texto e mostra "cole no terminal de X" (não dá para injetar prompt numa sessão aberta). Ver Fase 3
- [x] Planos: usam `state.plans` + `state.planInfo` (nome, plano, mensalidade do config). Sem fonte → "sem fonte de dados" com o que falta configurar
- [x] Rótulo agora diz "Dados reais · agente local", avisando que os números do Comercial e do Marketing ainda são simulados. Orçamentos inventados das salas desligados no modo real

### 1.4 Medidores dos planos
- [x] Codex: Codenotch; sem ele, pelos `rate_limits` dos JSONL
- [x] Claude: lido do Codenotch (sessão, semanal e semanal por modelo); a estimativa por tokens só entra se o Codenotch estiver parado há mais de 30 min
- [x] ElevenLabs: API pronta no agente e no prédio — **falta a chave** (só leitura) em `agent/.env`
- [x] Higgsfield: manual em `config.json` (`manualCreditsTotal`, `manualCreditsLeft`, `renewInDays`) até ter API — **falta preencher**

### 1.5 Ligar com o Windows
- [x] `npm run autostart:on` / `autostart:off`: `agent/scripts/autostart-windows.ps1` cria o atalho na pasta Inicializar, que roda `iniciar-oculto.vbs` (sem janela, log em `agent/data/agente.log`)
- [x] Manifest PWA + ícone EDevsHub (`web/manifest.webmanifest`, `web/icones/`), abre direto no prédio

### 1.6 Histórico
- [x] Linha do tempo em `agent/data/AAAA-MM-DD.jsonl` (confere a cada 2 s, grava quando muda ou a cada 60 s, para o arquivo não crescer à toa; mantém 7 dias). `GET /api/history`
- [x] Replay do prédio carrega as últimas 8 h do histórico; sessões que já fecharam aparecem como bonecos só durante o replay
- [x] Custo por projeto por dia em `agent/data/custos.json` (sem prazo), `GET /api/costs`, card na aba Operação com Hoje / 7 dias / 30 dias. Tarefas do Claude contadas pelo fim de turno nos arquivos de sessão (sobrevive a reinício)

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
