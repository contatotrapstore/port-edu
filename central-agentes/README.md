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
Abra http://localhost:4321/predio — o prédio 3D com os agentes ao vivo.
Painel de depuração (lista simples): http://localhost:4321. Protótipo com dados simulados: http://localhost:4321/predio/?fonte=simulada.

No Chrome ou Edge dá para instalar como app: ícone de instalar na barra de endereço.

## Ligar os eventos ao vivo do Claude Code
```bash
npm run hooks:install      # adiciona os hooks em ~/.claude/settings.json (com backup)
```
Depois abra uma nova sessão do Claude Code. Para remover: `npm run hooks:uninstall`.

Sem os hooks o agente ainda funciona lendo os arquivos de sessão, só que com alguns segundos de atraso e sem os pedidos de permissão.

## Aprovar permissões pelo painel
Vem ligado (`config.json` → `remoteApproval.enabled`). Quando o Claude Code pedir permissão **e o painel estiver aberto e visível**, o pedido aparece com Permitir/Negar. Se ninguém responder em `timeoutSeconds`, ou se o painel estiver fechado ou em outra aba, o pedido fica no terminal como sempre.

## Deixar ligado com o Windows
```bash
npm run autostart:on     # atalho na pasta Inicializar + já inicia o agente sem janela (log em agent/data/agente.log)
npm run autostart:off    # remove o atalho
```
Para parar o agente que está rodando: Gerenciador de Tarefas → node.exe, ou feche pela porta 4321.

## Agentes conversando (MCP "central")
`npm run mcp:install` registra o MCP no Claude Code (todas as pastas) e no Codex. Em qualquer sessão dá para pedir, por exemplo:
- "leia o quadro da Central" / "deixe no quadro o que você terminou"
- "delegue ao Codex uma revisão deste módulo (modo ler)"
- "rode o fluxo planejar-executar-revisar para: …"
O trabalho delegado roda em segundo plano na mesma pasta e aparece no prédio. Pelo painel: selecione um agente (ou clique numa sala) e use Delegar / Rodar fluxo / Abrir aqui. Limites em `config.json → orquestra`. Teste: `node scripts/teste-mcp.mjs`.

## Celular (Fase 2)
- **Telegram:** crie o bot no @BotFather, coloque `TELEGRAM_BOT_TOKEN` no `agent/.env`, rode `npm run telegram:parear` e mande /start. Comandos: /status, /fora (modo ausente: pedidos de permissão chegam com botões) e /voltei.
- **Site:** rode o SQL de `supabase/central-agentes.sql`, preencha as chaves do Supabase no `.env`, rode `npm run site:sync` e publique o site. Painel em https://www.edevshub.com/central (login por link no e-mail).
- Passo a passo completo: `docs/ROADMAP.md`, "Para ligar a Fase 2".
- Testes sem rede: `npm test`.

## Histórico
O agente grava em `agent/data/` (fora do git): a linha do tempo do dia (`AAAA-MM-DD.jsonl`, 7 dias) usada no replay do prédio e o custo por projeto por dia (`custos.json`), que aparece na aba Operação.

## Documentação
- `CLAUDE.md` — contexto completo do projeto (comece por aqui)
- `docs/ROADMAP.md` — o que falta, em ordem
- `docs/ARQUITETURA.md`, `docs/FONTES-DE-DADOS.md`, `docs/CONTRATO-DE-DADOS.md`, `docs/MARCA.md`
