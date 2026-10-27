# Piloto 01 — do atendimento ao CRM

Status: brief e storyboard propostos; ainda não renderizado nem aprovado.

Objetivo: mostrar por que a continuidade dos dados importa e apresentar o tipo de integração que a edevshub desenvolve. Público: responsável pelo atendimento/comercial de uma empresa. Fonte factual: `kit-organico/publicacoes.md`, case Muda Paisagens e materiais públicos do projeto. Exemplo de fluxo ilustrativo deve ser identificado como tal; não fingir que é uma captura do sistema.

## Slides

| # | Texto principal e apoio | Movimento proposto | Duração |
|---|---|---|---|
| 1 | **Seu atendimento termina. Os dados chegam ao CRM?** / Conversa boa precisa virar informação útil. | Mensagem percorre o caminho até o CRM; uma interrupção destaca a pergunta; retorna ao quadro inicial. | 8 s |
| 2 | **Copiar e colar virou uma etapa do processo?** / Nome, contato e contexto não deveriam depender da memória de alguém. | Três cartões repetem o percurso manual; pausa revela a repetição. | 6 s |
| 3 | **Primeiro, defina o que precisa chegar.** / Dados de contato · necessidade · próxima ação. | Campos entram um por batida, com etiquetas legíveis. | 6 s |
| 4 | **Depois, conecte entrada, regra e destino.** / Atendimento → qualificação → registro no CRM. | Linha é desenhada; cartões percorrem as etapas; destacar “fluxo ilustrativo”. | 6 s |
| 5 | **A integração precisa saber quando parar.** / Campo faltando? Peça complemento. Falha no destino? Registre e tente de novo. | Bifurcação em dois caminhos; estado de falha permanece visível antes de retomar. | 6 s |
| 6 | **É esse caminho que eu desenvolvo.** / No Muda Paisagens, conectei o pré-atendimento no WhatsApp ao Pipefy usando Make. | Screenshot original, se disponível e sem dados privados; etiquetas apontam componentes reais. | 6 s |
| 7 | **Qual informação sua equipe ainda copia à mão?** / Veja o case Muda Paisagens no portfólio. @edevshub | Pergunta em duas etapas; CTA discreto; repouso antes do loop. | 8 s |

Sete slides são uma proposta para este assunto; o tutorial permite outras quantidades. Não alongar para dez sem conteúdo útil.

## Legenda proposta

O atendimento não deveria terminar com informações espalhadas.

Antes de automatizar, defina quais dados precisam ser registrados, quais regras devem ser respeitadas e o que acontece quando algo falha.

No Muda Paisagens, desenvolvi o fluxo de pré-atendimento pelo WhatsApp com qualificação e registro no Pipefy, usando Make para conectar as etapas.

Qual informação sua equipe ainda copia de um lugar para outro? Veja o case Muda Paisagens no portfólio da edevshub.

Destino de campanha proposto: `https://www.edevshub.com/projetos/mudapaisagens?utm_source=instagram&utm_medium=organic_social&utm_campaign=carrosseis&utm_content=crm_piloto01`. Conferir destino antes de usar. Não afirmar “link na bio” sem conferir a bio.

## Som e conferência

Usar a trilha editorial sintetizada da skill e cues por batida; nenhuma geração paga de imagem é necessária ao piloto. Exportar MP4 individual por slide, 1080×1350, 30 fps, H.264, yuv420p; validar áudio e compatibilidade no destino antes de publicar. A referência técnica da skill usa 120 BPM e alvo de -14 LUFS.

Conferir: grafia, cortes, contraste, legibilidade em celular, arquivos na ordem, fontes carregadas, quadro inicial igual ao PNG de origem antes da compressão, fim voltando ao início, áudio sem clique na emenda. Após compressão H.264 usar tolerância visual/PSNR adequada; não exigir igualdade pixel a pixel com PNG no arquivo com perdas.

A prévia deve permitir selecionar slide, tocar/pausar e ligar som. Não aceitar apenas mocks ou capturas como prova de exportação.
