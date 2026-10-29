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
| `web/predio/` | Prédio 3D (Three.js r145) **com dados reais** do agente (Fase 1.3): um boneco por sessão, entra pelo elevador, Permitir/Negar de verdade, planos do Codenotch, custo por projeto, replay com o histórico do dia. `?fonte=simulada` mostra o protótipo antigo. Números do Comercial e do Marketing (Workana, funil, tráfego, redes) ainda simulados e rotulados. |
| `agent/` | Agente local em Node (sem dependências). Lê sessões reais do Claude Code e do Codex, recebe hooks, lê os medidores do Codenotch, consulta ElevenLabs, grava histórico em `agent/data`, expõe API + SSE em `127.0.0.1:4321`. **Fase 1 concluída em 29/10/2026.** Hooks instalados no `~/.claude/settings.json`; sobe sozinho com o Windows (`npm run autostart:on`). |
| `web/index.html` | Painel de depuração simples (lista ao vivo + Permitir/Negar) servido pelo agente. |
| Fase 2 | **Código pronto e testado**, inativo até as chaves: Telegram (`agent/src/telegram.js`), alertas, espelho sanitizado no Supabase (`nuvem.js`, SQL em `supabase/`), painel `/central` no site (fonte em `site/central`, copiado para `public/central` por `npm run site:sync`). Falta o Eduardo criar o bot e o projeto Supabase (ROADMAP, "Para ligar a Fase 2"). |

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
web/predio/               o escritório 3D: index.html, predio.css, dados.js, sim.js, cena.js, ui.js, fonte.js (dados reais), app.js
web/index.html            painel de depuração ao vivo
web/manifest.webmanifest  PWA (ícones em web/icones)
site/central/index.html   painel do celular (login + resumo); npm run site:sync copia para ../public/central
supabase/                 SQL da Fase 2 (tabelas, RLS, Realtime)
agent/                    agente local (Node 20+, ES modules, zero dependências)
```

## Regras do projeto
- **PT-BR e R$ em tudo** que o usuário vê. Datas no formato brasileiro.
- **Marca:** identidade EDevsHub (petróleo/verde-escuro `#0B1210`, creme `#EDE6D6`, âmbar `#F5B935`, madeira). Ver `docs/MARCA.md`.
- **Nada de logos ou marcas de terceiros** no cenário (ex.: Monster, Red Bull, Coca). O expositor de bebidas usa latas com a marca EDevsHub ("EDEVS", "ZERO", "MATE", "CAFÉ"). Isso já foi decidido; não reintroduzir.
- **Segredos só em `agent/.env`** (gitignored). Nunca colar chave em código, log, commit ou chat. Chave da ElevenLabs deve ser só de leitura.
- O servidor do agente escuta **apenas em `127.0.0.1`**. Acesso externo só pelo Supabase (resumo sanitizado, login + RLS) e pelo Telegram (só o chat pareado).
- Para a nuvem nunca vai: prompt, comando pedido, caminho de pasta, texto do feed, nome de subagente. Se mudar `sanitize()` em `nuvem.js`, rode `npm test`.
- Scripts de CDN no site (/central) têm SRI (`integrity`). Trocou a versão? Recalcule o hash.
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
