# Central de Agentes · EDevsHub

Escritório 3D onde os agentes de IA trabalham ao vivo, com uso dos planos e custos em R$.

## Requisitos
- Windows 10/11 (ou macOS/Linux)
- Node.js 20 ou mais novo (`node -v`)
- Claude Code e/ou Codex instalados no mesmo PC

## Rodar em 3 passos
```bash
cd agent
copy config.example.json config.json      # no macOS/Linux: cp
copy .env.example .env                    # coloque a chave da ElevenLabs aqui (opcional)
npm start
```
Abra http://localhost:4321 — painel de depuração ao vivo.
O protótipo 3D (ainda simulado) fica em http://localhost:4321/predio.

## Ligar os eventos ao vivo do Claude Code
```bash
npm run hooks:install      # adiciona os hooks em ~/.claude/settings.json (com backup)
```
Depois abra uma nova sessão do Claude Code. Para remover: `npm run hooks:uninstall`.

Sem os hooks o agente ainda funciona lendo os arquivos de sessão, só que com alguns segundos de atraso e sem os pedidos de permissão.

## Aprovar permissões pelo painel
Em `config.json`, `remoteApproval.enabled: true`. Quando o Claude Code pedir permissão, o pedido aparece no painel com Permitir/Negar. Se ninguém responder em `timeoutSeconds`, o pedido volta para o terminal normalmente.

## Deixar ligado com o Windows
Ver `docs/ROADMAP.md`, tarefa 1.5.

## Documentação
- `CLAUDE.md` — contexto completo do projeto (comece por aqui)
- `docs/ROADMAP.md` — o que falta, em ordem
- `docs/ARQUITETURA.md`, `docs/FONTES-DE-DADOS.md`, `docs/CONTRATO-DE-DADOS.md`, `docs/MARCA.md`
