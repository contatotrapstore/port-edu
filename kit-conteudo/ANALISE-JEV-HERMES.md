# JEV e Hermes Agent — análise para a edevshub

26/10/2026. Pesquisa e recomendação; nenhum software instalado, contratação, chave configurada ou chamada paga de inferência realizada. A arquitetura existente permanece a base.

## Conclusão

**JEV merece um teste opcional na triagem editorial; Hermes merece uma prova de operação quando chegarmos à hospedagem. Nenhum precisa bloquear o piloto.** Eles têm papéis diferentes: JEV avalia escolhas delimitadas; Hermes executa tarefas com modelos, ferramentas e agenda. Claude Code continua como ambiente de construção do projeto, e o publicador continua usando API oficial da Meta.

## O que foi analisado

Vídeo: https://www.youtube.com/watch?v=gHDMmQJNnHo — “5 usos do JEV + HERMES AGENT que eu queria ter descoberto ANTES”, Felipe Borges.

Lida a transcrição completa (~16 minutos); examinados quadros distribuídos pelo vídeo e o frame de 10:25. Arquivos de investigação em `../tmp/tutorial-hermes/`: `video.mp4`, `transcricao.txt`, `visao-geral.jpg`, `selecao.jpg`. Não houve auditoria do código/backend usado na demonstração, nem avaliação auditiva integral.

O vídeo demonstra classificação de comentários, roteamento de modelo, composição de carrossel e comparações de materiais. As escolhas mostradas não constituem um benchmark de engajamento ou qualidade da edevshub. Na demonstração de carrossel, o frame de 10:25 informa explicitamente que a decisão usa mensagem, rubrica e descrições observadas, não pixels. Logo, não comprova inspeção direta da tipografia, alinhamento ou animação pelo JEV.

## O que as fontes oficiais confirmam

- JEV devolve escolhas, notas e probabilidades estruturadas, em vez de escrever copy ou código. Perguntas pequenas e separadas são o uso indicado. Fonte: https://docs.typesafe.ai/introduction
- A documentação de imagens oferece entrada visual, mas a marca como experimental, ainda não pronta para produção. Portanto, nem “JEV nunca vê imagens” nem “JEV já resolve nossa revisão visual” são conclusões adequadas. Fonte: https://docs.typesafe.ai/images
- A tabela consultada lista JEV 1.14 e 1.13 a **US$ 0,042 por milhão de tokens de entrada**, saída gratuita. Não é preço por requisição. Áudio/vídeo não são entradas aceitas nessa referência. O fornecedor recomenda testar outros idiomas, pois inglês é o principal. Fonte: https://docs.typesafe.ai/models
- Existe skill oficial para Claude Code, Codex e outros ambientes. **Não é necessário adotar Hermes para chamar JEV.** Fonte: https://docs.typesafe.ai/agent-skill
- Hermes oferece agendamento, skills por tarefa, execução em sessões novas e opção de executar scripts sem LLM. Seu gateway precisa de uma implantação operacional adequada. Isso não elimina a necessidade de guardar revisões e resultados no nosso banco. Fonte: https://hermes-agent.nousresearch.com/docs/user-guide/features/cron

Os exemplos de cron retornados pelo índice Context7 diferiam do nome atual na página oficial. Na implantação, fixar versão e verificar a documentação correspondente, sem copiar comandos de versões distintas.

## Aplicação concreta

| Etapa | Recomendação | Limite |
|---|---|---|
| Classificar pauta como case, aplicação, notícia ou opinião | Testar JEV | Não determina se o fato é verdadeiro |
| Priorizar notícias pelo público e objetivo | Testar JEV com fontes já coletadas | Relevância prevista não é engajamento medido |
| Escolher entre três ganchos/CTAs | Testar, com rubrica da marca | Seleciona entre opções; Claude/modelo gerador escreve |
| Selecionar modelo por tipo de tarefa | Começar com tabela fixa; comparar JEV depois | Precisa de catálogo e avaliações reais, não adivinha o melhor modelo |
| Comparar capas | Adiar JEV visual; possível protótipo separado | Descrição textual pode omitir defeitos visuais |
| Conferir loop, áudio, fonte e cortes | Manter QA visual e verificações de render | JEV não substitui testes de mídia |
| Coletar fontes e preparar brief periodicamente | Hermes opcional como executor | Não confundir memória da conversa com estado transacional |
| Publicar, reconciliar timeout, impedir duplicatas | Código e API Meta | Não delegar estas garantias ao julgamento probabilístico |
| Melhor horário/frequência | Experimento com Insights | Classificador não sabe o melhor horário sem evidência |

Triagem de comentários pode ser futura extensão se houver volume e autorização de acesso. Não incluir envio de respostas/DMs, moderação automática ou prospecção como efeito colateral desta análise.

## Arquitetura recomendada

Painel + banco/fila continuam sendo a fonte de verdade. Worker faz coleta, geração e render. Dentro dele, `DecisionProvider` opcional chama JEV para decisões estreitas. Regras de data, quantidade, orçamento, validade e publicação ficam em código.

Se adotarmos Hermes, ele roda em perfil isolado e chama ferramentas restritas do projeto para consultar candidatos, salvar brief e enfileirar render. O serviço publicador conserva credenciais da Meta; não precisa expô-las a todo contexto do agente. Hermes não recebe uma segunda agenda independente para o mesmo post: um único dono agenda cada ocorrência `(accountId, localDate, slotId)` no banco. Cron do Hermes pode apenas disparar uma solicitação idempotente ao scheduler do produto.

Não expor terminal/Web UI de administração do Hermes como o nosso painel público. O painel editorial tem permissões e ações específicas. Hostinger é a opção comercial exibida pelo autor; não é requisito técnico do método. Uma VPS também exige atualizações, backups, supervisão e tratamento de credenciais; a hospedagem não garante ausência de interrupções ou segurança por si só.

## Custo: onde pode valer

Exemplo hipotético: 100 candidatos/dia × 1.500 tokens totais de entrada por candidato × 30 dias = 4,5 milhões de tokens; à tarifa consultada, **US$ 0,189 em JEV**. A conta considera uma única avaliação por candidato, incluindo rubrica; reenvios, traduções e outras perguntas podem alterar o volume faturado. Não inclui pesquisa, modelo criador, visão, render, storage, servidor ou manutenção.

Portanto, JEV pode ser barato na etapa de decisão, mas não torna a operação inteira quase gratuita. Em 7–10 posts semanais, integrar e manter mais uma dependência pode custar mais que a economia de tokens. O ganho potencial cresce com o número de itens examinados, não apenas de posts publicados. Não projetar os “100×” do vídeo para nosso orçamento sem comparação equivalente de qualidade e entrada.

## Teste proposto antes de adotar

1. Montar 100 exemplos representativos em português: 40 notícias com fontes, 30 escolhas de pilar e 30 pares de ganchos/CTAs. Usar material público e copy nossa. Incluir irrelevantes, desatualizados e ambíguos.
2. Rotular com revisão humana. Usar 60 para ajustar critérios e 40 reservados para avaliação; amostra piloto, não certificação estatística.
3. Comparar regras fixas, modelo pequeno já disponível e JEV nas mesmas entradas. Medir qualidade por tarefa, falsas exclusões, casos encaminhados à revisão, custo total e latência p50/p95. Reordenar alternativas para verificar sensibilidade.
4. Critério inicial proposto: não piorar acerto em classificação/priorização no conjunto reservado, não aumentar exclusão de pautas relevantes e reduzir ao menos 30% do custo variável da etapa na mesma cobertura automática. Em resultado próximo/inconclusivo, ampliar amostra; não promover pelo custo sozinho. Para copy, comparar preferências cegas e depois resultados reais, não chamar gosto subjetivo de verdade objetiva.
5. Começar em modo de observação: registrar recomendações sem mudar a fila automaticamente. Um limiar de confiança exige calibração local; não escolher 0,9 arbitrariamente como garantia de acerto.
6. Usar fallback em timeout, resposta inválida ou dúvida: revisão/modelo existente. JEV indisponível não pode parar toda a produção ou liberar publicação sem QA.

Testar Hermes separadamente: duas semanas de pesquisa e briefs sem envio, com reinício, fonte indisponível, modelo fora do ar e execução duplicada. Comparar com o worker/scheduler simples. Adotar apenas se simplificar operação e recuperação, não por ser mais uma ferramenta disponível.

## Alteração recomendada no planejamento

- **Agora:** manter o piloto; preparar interface opcional para decisões e registrar esta análise.
- **Depois do piloto:** benchmark textual JEV com limite de gasto definido; nenhuma geração visual experimental como dependência.
- **Ao escolher infraestrutura:** decidir Hermes versus executor simples, mantendo fila, painel e publicador desacoplados.
- **Não adotado nesta etapa:** instalação de plugins de aprovação automática, troca de modelos sem política, exposição de painel de servidor ou contratação de VPS.

Interface conceitual para futura implementação: `evaluateEditorialCandidate(input) → {pillar, relevance, uncertainty, modelVersion, rubricVersion, usage}`. Não devolver `allowedToPublish` com base só nesse resultado. Guardar a evidência e a versão para auditar mudanças. O adaptador deve poder ser desativado sem mudar o restante do pipeline.
