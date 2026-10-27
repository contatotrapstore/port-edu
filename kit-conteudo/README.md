# EDevsHub — produção de conteúdo e painel

Preparado em 26/10/2026. **Etapa atual: preparação para o Claude Code.** Nenhum painel, login, agendamento ou publicação foi ativado.

## Comece por aqui

1. [ESCOPO.md](ESCOPO.md): produto proposto, arquitetura e decisões pendentes.
2. [PLANO.md](PLANO.md): sequência de implementação e verificações.
3. [MARCA.md](MARCA.md): contexto editorial e referências visuais.
4. [PILOTO.md](PILOTO.md): primeiro carrossel, texto, movimentos e critérios de aceite.
5. [FONTES.md](FONTES.md): tutorial, skill, versão e evidências locais.
6. [ESTRATEGIA-EDITORIAL.md](ESTRATEGIA-EDITORIAL.md): pilares, copy, horários e teste de frequência.
7. [API-E-AUTOMACAO.md](API-E-AUTOMACAO.md): API, radar de IA, métricas e slots extras.
8. [PROMPT-CLAUDE.md](PROMPT-CLAUDE.md): mensagem pronta para continuar no Claude Code.

## Pedido confirmado

Produzir conteúdo diário para @edevshub, combinando serviços/cases com IA, agentes, Claude e Codex; testar posts extras conforme ESTRATEGIA-EDITORIAL.md, mantendo carrosséis animados com o método do tutorial de Felipe Borges. Usar Claude Code. Incluir um painel na área administrativa do próprio domínio/site. Organizar o trabalho antes de transferir a implementação ao Claude.

## Entrega proposta

`pauta → brief → texto → slides estáticos → storyboard → MP4 com som → conferência → agenda → Instagram → histórico`

Primeiro validar o piloto; depois conectar o painel; por último ativar a rotina diária. O objetivo final continua sendo a publicação automática, pesquisa de notícias verificadas e melhoria orientada por métricas. A revisão manual inicial serve para calibrar o padrão, não como exigência permanente para cada postagem.

## O que já existe

Pesquisa adicional: [ANALISE-JEV-HERMES.md](ANALISE-JEV-HERMES.md) avalia JEV para triagem editorial e Hermes como executor opcional. Recomendação: testar separadamente, sem torná-los pré-requisitos do piloto. Não foram instalados ou contratados.

- Next.js 16.2.1 / React 19.2.4 / TypeScript / Tailwind 4.
- Origem canônica: https://www.edevshub.com, conforme `src/lib/site.ts`.
- Hospedagem Vercel e deploy por push em main, segundo o README.
- Conteúdo de serviços/cases, kit orgânico e peças em `Rebranding/`.
- Não foram encontrados auth, banco ou painel admin implementados no código examinado.
- Python, FFmpeg e yt-dlp disponíveis localmente; isso não comprova todas as dependências do render.
- Há alterações preexistentes no Git. Não resetar, limpar, incluir em commit ou sobrescrever essas mudanças.
- `RTK.md` e `CODEX.md`, mencionados nas instruções do usuário, não foram encontrados na raiz nem nos dois diretórios ancestrais examinados. Localizá-los antes da implementação se forem fornecidos; não inventar seu conteúdo.

## Decisões ainda necessárias

Não impedem o piloto local: ativação dos horários propostos de teste (12h30 e 19h00, America/Sao_Paulo), conta administradora, infraestrutura do worker, limite de gasto, identidade final e conexão/autorização do Instagram. Não solicitar senhas nem tokens em conversa; usar configuração segura dos serviços.

Não há data prometida de ativação nem orçamento aprovado. O tutorial não significa custo total zero: processamento, Claude, hospedagem e imagens opcionais podem ter custos.
