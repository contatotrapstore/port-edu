# Central de Agentes · EDevsHub

Escritório virtual em 3D, estilo jogo (vibe Habbo/Sims), onde o Eduardo (Dudu) vê os agentes de IA dele trabalhando **ao vivo**: em qual projeto estão, o que estão fazendo, o prompt, quanto estão gastando, quem está pedindo permissão, e o uso dos planos (Claude, ChatGPT, Higgsfield, ElevenLabs), com sugestões de economia e de oportunidades.

Este arquivo é o contexto principal. Leia também `docs/ROADMAP.md` antes de começar qualquer tarefa.

## Quem é o usuário
- Eduardo Gouveia (Dudu), dev full-stack sênior, Pinhais/PR. Trabalha solo, com muitos projetos ao mesmo tempo (Workana + clientes diretos + projetos próprios).
- Usa Claude Code e Codex no **Windows nativo** (`C:\Users\GouveiaRx\.claude`, `C:\Users\GouveiaRx\.codex`). Medidor de uso dos planos: **Codenotch**.
- Esta pasta fica dentro do repositório do site (`Port Edu`), que é a central de projetos pessoais dele: site, agentes etc.
- Fala português do Brasil. **Toda a interface em PT-BR e valores em R$** (câmbio configurável, padrão US$ 1 = R$ 5,40).

## Estado atual
| Parte | Status |
|---|---|
| `prototipo/predio.html` | Pronto, com **dados simulados**. Prédio 3D (Three.js r145) de 4 andares + elevador, painéis, sugestões, XP, replay, modo TV. Abra direto no navegador. |
| `agent/` | Agente local em Node (sem dependências). Lê sessões reais do Claude Code e do Codex, recebe hooks, lê os medidores do Codenotch, consulta ElevenLabs, expõe API + SSE em `127.0.0.1:4321`. **Validado com os dados reais do PC em 29/10/2026** (Fases 1.1 e 1.2). Hooks instalados no `~/.claude/settings.json`. |
| `web/index.html` | Painel de depuração simples (lista ao vivo + Permitir/Negar) servido pelo agente. Serve para validar os dados antes de ligar o 3D. |
| Ligar o 3D aos dados reais | **Próxima grande tarefa** (ver ROADMAP, Fase 1.3). |

## Arquitetura (decidida)
**Fase 1 — local primeiro.** Tudo roda no PC do Eduardo. O agente lê os arquivos de sessão e recebe os hooks; o navegador abre `http://localhost:4321`. Motivos: os dados estão no PC, aprovar permissão precisa estar perto do Claude Code, e prompts/código de cliente não saem da máquina.

**Fase 2 — painel no site.** O agente envia um **resumo sanitizado** (sem prompts completos nem código) ao Supabase; uma rota `/admin` com login no site (Vercel) mostra o prédio pelo celular. Aprovação pelo celular via bot de Telegram/WhatsApp. Detalhes em `docs/ARQUITETURA.md`.

Não usar Electron/Tauri por enquanto: o painel é instalável como PWA. Reavaliar só se ele quiser ícone na bandeja.

## Estrutura
```
CLAUDE.md                 este arquivo
README.md                 como rodar
docs/ARQUITETURA.md       fluxo de dados, fases, segurança
docs/FONTES-DE-DADOS.md   formato dos JSONL do Claude Code e do Codex, hooks, APIs (com o que precisa ser conferido)
docs/CONTRATO-DE-DADOS.md formato do /api/state e dos eventos SSE (o front consome isto)
docs/ROADMAP.md           tarefas em ordem, com checklist
docs/MARCA.md             cores, tipografia, regras visuais
prototipo/predio.html     o escritório 3D (simulado)
web/index.html            painel de depuração ao vivo
agent/                    agente local (Node 20+, ES modules, zero dependências)
```

## Regras do projeto
- **PT-BR e R$ em tudo** que o usuário vê. Datas no formato brasileiro.
- **Marca:** identidade EDevsHub (petróleo/verde-escuro `#0B1210`, creme `#EDE6D6`, âmbar `#F5B935`, madeira). Ver `docs/MARCA.md`.
- **Nada de logos ou marcas de terceiros** no cenário (ex.: Monster, Red Bull, Coca). O expositor de bebidas usa latas com a marca EDevsHub ("EDEVS", "ZERO", "MATE", "CAFÉ"). Isso já foi decidido; não reintroduzir.
- **Segredos só em `agent/.env`** (gitignored). Nunca colar chave em código, log, commit ou chat. Chave da ElevenLabs deve ser só de leitura.
- O servidor do agente escuta **apenas em `127.0.0.1`**. Qualquer acesso externo é Fase 2, com autenticação.
- O hook **nunca pode travar nem quebrar o Claude Code**: se o agente estiver desligado, sai com código 0 em silêncio.
- Dados simulados devem ser rotulados como simulados na interface. Quando um dado vier de fonte real, remover o rótulo.
- Sem dependências no agente, a menos que haja motivo forte. No front, Three.js r145 via jsDelivr (versão fixa).

## Planos do usuário (valores informados por ele)
| Plano | Mensalidade | Observação |
|---|---|---|
| Claude Max 20x | R$ 1.100 | Janela de 5h + limite semanal |
| ChatGPT (plano "5x") | R$ 550 | Uso do Codex: janela de 5h + semanal |
| ElevenLabs Starter | ~R$ 33 | 30 mil créditos/mês (confirmar na API) |
| Higgsfield | a confirmar | plano e créditos a confirmar; checar se há API |

## Projetos que viram salas (mapear em `agent/config.json`)
Térreo: Recepção, Sala de reunião, TI · Infra (kingprime.com.br, beeder.me, useconvoo.com.br), Diretoria.
1º Desenvolvimento: PlanetShake, Ligou Chegou, Organzza · Kommo, QA · Code review, Revix, Meta Coleta IA, Fisko.
2º Comercial: Workana, Funil · CRM, Captação direta, Prospecção, Cabines de call.
3º Marketing: EDevsHub · Social, Revix · Social, Estúdio criativo, Tráfego & Site.

## Como trabalhar neste repo
- Rodar o agente: `cd agent && npm start` (abre em http://localhost:4321).
- Instalar hooks no Claude Code: `npm run hooks:install` (faz backup do `settings.json`). Remover: `npm run hooks:uninstall`.
- Conferir sintaxe: `node --check` nos arquivos alterados.
- Antes de mexer nos parsers, abra um JSONL real da máquina e confira os campos (ver `docs/FONTES-DE-DADOS.md`, seção "Conferir").
- Formato dos hooks do Claude Code muda entre versões: confirme na documentação oficial (docs.claude.com → Claude Code → Hooks) antes de alterar `agent/hooks/edh-hook.js`.
