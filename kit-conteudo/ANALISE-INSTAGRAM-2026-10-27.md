# Instagram EDevsHub — diagnóstico e experimento proposto

Consulta: 27/10/2026, 17h30 de Brasília. Leitura direta da Graph API v26.0 com a conexão existente; nenhum post, configuração ou agendamento alterado. Dados brutos sem credenciais em `output/instagram-audit-result.json` (arquivo local, não público).

## Evidência

- Conta BUSINESS, nome EDevsHub | Sistemas e IA, 1 seguidor, 1 seguindo, 1 publicação.
- Bio: “Sistemas, SaaS e integrações com IA para empresas que cresceram / Escopo por escrito · entrega por etapas / 182 projetos entregues ↓”.
- Post https://www.instagram.com/p/DfAWsevjIuQ/ publicado em 27/10/2026 às 14h06 de Brasília. Tipo CAROUSEL_ALBUM, produto FEED: os vídeos do carrossel não são Reels.
- Post, acumulado até a consulta: 12 visualizações, alcance de 4 contas, 1 curtida, 0 comentários, 0 compartilhamentos, 0 salvamentos, 1 visita ao perfil atribuída, 0 seguidores atribuídos.
- Conta, janela solicitada 20–27/10: alcance 4, visualizações 12, visitas ao perfil 2, contas engajadas 1.
- A API retornou total_interactions=2, mas os componentes consultados somam 1. Registrar a divergência; não fabricar uma segunda interação ou calcular taxa a partir dela. Pode haver defasagem entre métricas, sem causa confirmada.
- O campo website não veio na resposta. A página pública abriu e confirmou nome/bio/post, mas depois exibiu convite de login. Link externo, destaques e elegibilidade para recomendações não foram plenamente verificados. Ausência na resposta não comprova ausência na conta.
- Só há aproximadamente 3h24 de observação do primeiro post. A amostra não sustenta conclusões sobre horários ideais, frequência, qualidade do formato ou restrição de alcance.

## Diagnóstico editorial

A apresentação atual explica a contratação de sistemas, mas oferece pouco motivo explícito para acompanhar o perfil diariamente. A legenda do primeiro post é coerente com o serviço, porém abstrata: “contato, necessidade e contexto” pode ganhar demonstração visual específica e consequência concreta. Isso é avaliação editorial, não causa comprovada do alcance.

Proposta de promessa: IA aplicada a software e operações reais. Notícias entram quando existe mudança material para quem constrói ou compra sistemas. Priorizar teste, demonstração, limitação e aplicação; evitar competir só por velocidade de manchete.

Bio candidata, sujeita à escolha do usuário:

> IA aplicada, agentes e software na prática.
> Testes, novidades úteis e projetos reais.
> Sistemas e automações para sua empresa ↓

Manter nome e símbolo. Conferir um link comercial claro para o site. Revisar a prova “182 projetos”: kit do site identificou números diferentes; padronizar a partir da fonte antes de repetir. Preparar três fixados (comece aqui, case, demonstração útil) e destaques de projetos, avaliações, bastidores e contato, usando material real.

## Experimento de 14 dias — proposta, não agendamento

Preservar o lote aprovado. Testar três Reels adicionais por semana, em dias alternados. Com o carrossel ao meio-dia, usar 19h como horário inicial de teste, sem alegar que é o melhor. Isso cria alguns dias com dois posts, não obrigação de dois todos os dias. Depois do lote atual, avaliar uma base de quatro Reels e três carrosséis por semana.

Comparar resultados em 24h, 72h e 7 dias de idade de cada publicação. Ainda não há audiência suficiente para inferir horário ideal. Quantidade não é o objetivo isolado: observar alcance, compartilhamentos/alcance, salvamentos/alcance, seguidores atribuídos, visitas ao perfil, leads e retenção dos Reels quando disponível. Mostrar numeradores e denominadores e evitar conclusões com alcance minúsculo. Usar medianas por formato quando houver amostra, sem atribuir causalidade a um experimento tão pequeno.

Stories de apoio podem mostrar bastidor verdadeiro, detalhe do teste e uma pergunta específica; não há necessidade de preencher uma cota com conteúdo vazio. Comentários e conversas relevantes devem ser humanos, sem spam automático.

## Reels propostos

Formato inicial: vertical 1080x1920, aproximadamente 25–45 segundos como hipótese criativa. Narração PT-BR natural, legendas legíveis, demonstração real, motion que explica a sequência e efeitos sincronizados. Som de teclado apenas quando houver digitação; cliques em ações visíveis, mudança sonora em erro/resolução. Música e efeitos abaixo da voz, sem vinheta longa. Usar áudio próprio ou licenciado.

Séries:

1. Testado em projeto: recurso novo, comparação controlada, resultado e limitação.
2. Do prompt à produção: erros e decisões que fazem diferença em sistemas reais.
3. Por dentro da entrega: um problema comercial e a engenharia que o resolve.

Primeiro piloto recomendado: “Seu agente respondeu. Mas executou a tarefa?” Mostrar uma conversa, a chamada real ao sistema, o retorno e uma falha tratada. Finalizar com uma pergunta concreta sobre onde a automação do público trava. Se usar dados demonstrativos, identificá-los como simulação; não atribuir ganhos financeiros fictícios.

O sistema inspecionado hoje publica vídeos como itens de CAROUSEL. Não há caminho REELS no módulo de publicação examinado, nem pipeline de narração encontrado na pesquisa dos scripts. Para automatizar esse formato, implementar tipo de conteúdo Reel, áudio/narração, composição vertical contínua, prévia/aprovação, publicação e leitura das métricas correspondentes. A arquitetura desejada continua: produção local só quando solicitada, upload dos arquivos prontos, publicação agendada em nuvem com o PC desligado. Nenhuma dessas extensões foi implementada nesta análise.

## Fontes oficiais consultadas

- Meta, orientação personalizada sobre frequência, criação e alcance: https://about.fb.com/news/2024/10/best-practices-education-hub-creators-instagram/
- Meta, métricas de tempo assistido e avaliação dos ganchos: https://about.fb.com/news/2023/04/instagram-reels-trending-audio-and-gifts-updates/
- Meta, distribuição e conteúdo original: https://about.fb.com/ltam/news/2024/05/ayudando-a-los-creadores-a-encontrar-nuevas-audiencias/

O experimento é uma recomendação adaptada ao perfil, não uma frequência exigida pelo algoritmo nem garantia de viralização.
