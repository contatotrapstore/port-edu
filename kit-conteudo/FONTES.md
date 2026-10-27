# Fontes e investigação

## Tutorial

- https://www.youtube.com/watch?v=TZg-PgSxm3M
- Título: Crie Carrosséis VIRAIS com Motion Graphics por R$0 (Skill Gratuita).
- Autor identificado no vídeo: Felipe Borges / Fala IA.
- Data informada pelo usuário: 13/10/2026.
- Análise realizada: leitura da transcrição automática inteira e inspeção visual de amostras ao longo do vídeo e de sequência a cada 0,5 s entre aproximadamente 2:05 e 2:13. Não foi feita uma avaliação auditiva integral.
- Arquivos locais de investigação: `../tmp/tutorial-carrossel/video.mp4`, `transcricao.txt`, `video.pt-orig.json3`, `visao-geral.jpg`, `movimento.jpg`. Não redistribuir o tutorial como ativo do produto. Esses arquivos temporários não precisam entrar no commit.
- A análise remota Higgsfield ficou na fila; não foi a fonte das conclusões.

### Trechos úteis

| Tempo aproximado | Assunto |
|---|---|
| 0:00–0:59 | Código controla animação e sincronização; não é modelo gerador de vídeo |
| 1:57–2:36 | Comparação entre estático e animado; movimento demonstra layouts |
| 4:03–7:58 | CLAUDE.md, prompt, suavidade, peso e ritmo |
| 7:59–9:13 | Referência do Notion orienta o visual |
| 9:14–10:11 | Skill gratuita e instalação pelo GitHub |
| 10:12–12:20 | Imagens opcionais do Higgsfield; exemplos de produto |
| 12:21–15:50 | Sistema próprio, PNG antes de animar, acervo, tom e opções de música |
| 16:33–17:07 | Guardar referências aprovadas para próximas produções |

As legendas automáticas erram nomes como Claude e Higgsfield. Não usar transcrição como especificação literal sem cruzar imagem e repositório. O tutorial não demonstra uma rotina completa de publicação diária pelo Instagram API.

## Skill original

- https://github.com/Felpborges/criador-de-carrosseis-simples
- Commit observado em 26/10/2026: `0c0323d44ecdf69c501145a27af0796763efaff5`.
- Referência técnica: https://github.com/Felpborges/criador-de-carrosseis-simples/blob/main/references/08-carrossel-vivo.md
- A versão gratuita tem trilha editorial única; o seletor de música e de fidelidade pertence à versão completa descrita pelo autor.
- Dependências documentadas: Node/Playwright/Chromium, Python/Pillow/numpy/scipy e FFmpeg; OpenCV em uma ferramenta opcional.
- `novo-projeto.py` usa caminho padrão da máquina do autor e symlink de node_modules; parametrizar e adaptar ao Windows. `vivo.sh` usa zsh; `ocr.swift` é específico de outro ambiente. Não executar cegamente.
- A árvore consultada não apresentou arquivo LICENSE. Não presumir licença MIT ou permissão de redistribuição da skill ou de exemplos de terceiros. Registrar atribuição e esclarecer termos antes de redistribuir código/ativos. O autor convida à instalação e uso no próprio tutorial.

## Referências a verificar na implementação

Documentação oficial vigente do Claude Code para execução não interativa e autenticação; documentação Meta de Content Publishing conforme o login escolhido; documentação de autenticação, storage e banco do fornecedor que for escolhido. A atualização de pesquisa, limitações da consulta e fontes oficiais estão em API-E-AUTOMACAO.md; limites e permissões da conta real continuam pendentes. Não inventar endpoints, escopos ou limites com base em memória.
