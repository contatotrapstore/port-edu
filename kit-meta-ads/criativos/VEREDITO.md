# Veredito — primeira campanha EDevsHub

Análise em 17/09/2026, horário de Brasília. Fase 1 concluída; fase 2 autorizada somente para uma peça, em seu formato principal. A fase 3 depende da aprovação de Eduardo.

## 1. Quantos criativos a verba sustenta

R$ 35 × 14 dias = **R$ 490 de mídia**, não R$ 500 exatos. Ao CPC hipotético de R$ 2, são 245 cliques. O critério de 50 cliques consome R$ 100 por conceito: cabem **quatro conceitos no limite teórico**, sobrando R$ 90. Isso não significa que quatro sejam uma boa decisão.

| Conceitos | Verba por conceito, se igual | Cliques por conceito a R$ 2 | Dias até 50, se igual |
|---|---:|---:|---:|
| 2 | R$ 245 | 122,5 | 5,7 |
| 3 | R$ 163,33 | 81,7 | 8,6 |
| 4 | R$ 122,50 | 61,3 | 11,4 |

**Recomendo dois conceitos.** Três são defensáveis a R$ 2, mas deixam pouca margem. A R$ 3, três recebem apenas 54,4 cliques cada; a R$ 4, apenas 40,8. Dois ainda receberiam 61,3 a R$ 4. São cenários, não previsões da conta. A Meta distribui a entrega de forma desigual: nem mesmo dois garantem 50 cliques em ambos. Não declarar perdedor um anúncio subentregue.

Usar um conjunto e dois anúncios, mantendo oferta, destino e formato principal comparáveis. Cortes para posicionamentos são adaptações dos mesmos conceitos, não seis hipóteses independentes. Este é um teste exploratório; 50 cliques são uma regra operacional, não significância estatística nem amostra suficiente para provar vendas de alto ticket. Separar CPC de link, visualizações de página, Contact e conversas efetivamente recebidas. IOF, spread e custo de produção ficam fora dos R$ 490.

## 2. Vídeo ou imagem

**Dois estáticos tipográficos neste primeiro ciclo.** A comparação será dor operacional versus prova, ambos oferecendo integração sob medida. Misturar atendimento de R$ 12 mil em vídeo com prova genérica em imagem confundiria oferta, linguagem e formato ao mesmo tempo.

Principal 4:5 para Feed; depois da aprovação, 1:1 e 9:16 próprios, sem confiar no recorte automático. Imagens verticais não substituem um teste de vídeo em Reels; conferir a elegibilidade e a prévia de cada posicionamento na conta. Não pressupor cobertura idêntica à de vídeo.

O motivo para adiar vídeo não é impossibilidade financeira: os roteiros atuais exigem leitura demais no final, usam prints pouco legíveis e um relógio sem contexto na abertura. Um vídeo posterior deve animar texto e recortes reais de forma determinística; não passar uma interface por um gerador que possa redesenhá-la. Som é dispensável. Não usar geração de interface para melhorar a prova.

## 3. Avaliação dos ganchos

| Original | Problema | Proposta |
|---|---|---|
| C1: “22h47” sozinho por dois segundos | Não diz o que está à venda; horário arbitrário fora da lista de números permitidos. Notificação inventada também viola a proibição de interface gerada. | “O atendimento para. As mensagens continuam.” É uma situação operacional compreensível sem jargão ou relógio. Guardar para um futuro teste específico de atendimento. |
| C2: “A pessoa que sabe tirou férias.” | Reconhecível, mas o assunto pode parecer RH; a dor operacional só chega depois. Não há comprovação de que isso ocorreu na Rei Sol. | “Sua operação cresceu. Seus sistemas, não.” Dor e continuidade com a landing já na primeira leitura. |
| C3: “176 sistemas entregues” | Prova concreta, mas não explica por que interessa ao gestor; sem oferta pode atrair curiosidade por portfólio. | Manter a abertura e acrescentar “Integração sob medida” e o preço inicial. Comparar com a abertura de dor, usando a mesma oferta. |

Nenhum gancho tem desempenho comprovado antes da veiculação. A preferência por C1 revisado abaixo é uma hipótese baseada em clareza e continuidade.

## 4. Os quatro textos de campanha.md

- **A:** “e responde ninguém” tem ordem pouco natural; “ninguém responde” é mais claro. “Lead” é jargão e “já falou com outro” afirma uma consequência não demonstrada. O título “responde sozinho” pode sugerir autonomia absoluta; o escopo inclui passagem para humano. Trocar por “Atendimento com IA no WhatsApp”. Preço e prazo estão corretos no repositório. Se usado depois: “O atendimento para. As mensagens continuam. Eu integro o pré-atendimento com IA ao seu WhatsApp e CRM.” Complementar com preço, escopo e prazo combinado.
- **B:** é o mais próximo da oferta escolhida. A primeira frase é concreta, mas “todo dia, sem nunca terminar” dramatiza; “sistemas param de brigar” personifica sem dizer o serviço. “Operação inteira” também pode prometer abrangência além do escopo. Preferir “Integração sob medida” e “um painel para acompanhar a operação”.
- **C:** dor boa, mas férias e saída não devem parecer fatos do case. constants.ts comprova substituição de controles manuais; não comprova “planilha que ninguém atualizava”. Trocar por “Na Rei Sol, desenvolvi um painel de obras com etapas, responsáveis e prazos, substituindo controles manuais.” Usar “prazos” na copy leiga em vez de SLA. Falta preço para filtrar demanda.
- **D:** melhor abertura de prova. A sequência de três cases dispersa a atenção; “sozinho” simplifica demais o papel da IA. Manter os números de reputação e focar integração. Os números do Clinafy pertencem ao cliente, não à reputação pessoal do Eduardo.

Tratar 125 caracteres como guia de primeira leitura, não limite universal da Meta. As aberturas finais abaixo funcionam antes de “ver mais”. Não existe proibição geral da palavra “você” ou de mencionar uma dor empresarial; risco de atributos pessoais depende do atributo e do contexto. Evitar promessas absolutas, ganhos não medidos e urgência fictícia. Não garantir aprovação automática dos textos ou da landing.

## 5. Continuidade com a landing

Li src/app/contratar/page.tsx, landing.css e as constantes. O hero real no código diz **“Sua operação cresceu. Seus sistemas, não.”** e oferece atendimento, integração e SaaS, com escopo fechado. Vou repetir esse título na primeira peça e especificar integração logo abaixo. O clique vai para /contratar, sem promessa de comprar software pronto ou testar grátis.

O fundo #0a0c0b e o verde #3fcf7f coincidem com o CSS. O texto pedido no prompt é #e8efec; a landing usa #f2f5f4 e, no destaque, #6ee7a8. A continuidade é visual, não igualdade literal de todos os tokens. Preservar a paleta solicitada nas peças.

Onde a especificação quebra: relógio e narrativa de perda dominam antes de explicar a solução; fluxo Make comunica ferramenta técnica; Clinafy inteiro comunica produto clínico com teste grátis; estático original comunica só currículo. Inclinação e brilho atrás do painel sacrificam leitura. Remover esses efeitos.

Inconsistências da campanha: o parágrafo de ticket de R$ 5–15 mil não corresponde às ofertas atuais de R$ 6/12/28 mil; a landing exclui abaixo de R$ 5 mil, embora a menor oferta comece em R$ 6 mil. Registrar para revisão, sem alterar o site nesta tarefa. A análise de continuidade é do código local; não atesta que a versão publicada seja idêntica.

## 6. Prints examinados visualmente

| Arquivo | O que realmente aparece | Decisão |
|---|---|---|
| public/images/lp/rei-painel.webp | Painel frontal, 830×517, modal de tarefa, status à direita; campos já ocultos | Melhor fonte para peça futura. Usar um recorte do modal, sem inventar dados, sem inclinar e sem aumentar com IA. Em largura de celular, o quadro inteiro ainda não permite ler os campos pequenos. |
| public/images/projects/covers/rei.webp | Notebook em cenário de estúdio com fumaça e tela pequena | Rejeitar como prova principal. O recorte lp é superior. |
| public/images/projects/covers/mudapaisagens.webp e projects/mudapaisagens.webp | Fluxo Make dentro de notebook; pequenos nós e rótulos | Ambos têm apresentação de mockup. Não ilustram benefício para dono de PME em uma passada de olho. Não criar conversa de WhatsApp fictícia para substituir. |
| public/images/projects/clinafy.webp | Captura da página comercial, não um dashboard clínico em tela cheia; +500 e +50.000 visíveis, mas também teste grátis, 4.9/5 e suporte <2h | Um recorte só dos dois números permitidos pode servir a um futuro case identificado. Não usar inteira: oferta, números e cores estranhos à campanha; trecho clínico pequeno também deve ficar fora. A captura confirma o que o cliente publica, não uma auditoria independente. |
| public/images/projects/covers/clinafy.webp | Notebook inclinado, marca d'água EDevsHub grande | Rejeitar: leitura pior e prova obstruída. |
| public/images/projects/covers/clubeazul.webp | Formulário financeiro com muitos meses, números e alertas | Rejeitar neste teste: densidade alta, acentos extras e dados operacionais fora da lista permitida. |

Examinei essas candidatas relevantes, não todas as capas do portfólio. A primeira peça será somente tipográfica: dispensa prints ilegíveis e garante que não haverá prova visual inventada. Isso não impede que os cases reais sustentem a proposta na landing.

## 7. O que pode dar errado

- Cliques baratos sem intenção de contratar. Julgar conversas qualificadas, além de CPC. Contact não é contrato fechado e pode não equivaler a conversa recebida.
- A Meta concentrar verba em uma peça: não confundir distribuição com experimento controlado. A regra “dia 7, CTR <0,5%, parar” não substitui contexto de amostra e diagnóstico. Cliques sem conversa também podem vir de intenção ruim, tracking ou falha de carregamento, não apenas da copy da página.
- “50 conversões por semana” e “trocar quando houver 25 Contacts” no plano não demonstram por si que Tráfego seja sempre melhor. Manter o objetivo solicitado como teste inicial, sem transformar esses números em garantia do algoritmo. Não há dados reais de CPC/CPA da conta nos arquivos lidos.
- Texto cortado no Feed ou coberto por controles em Stories/Reels. Produzir layout próprio 9:16 depois da aprovação; usar como margem interna conservadora 14% no topo, 35% embaixo e 6% nas laterais, e validar na prévia atual da conta. Isso é margem de projeto, não certificação de especificação atual.
- Tipografia pode não interromper o scroll tanto quanto uma imagem de prova. É a principal limitação da escolha: legibilidade e fidelidade ganham, demonstração visual perde. Testar, não afirmar vitória antecipada.
- IA pode errar acentos, números e cores. Conferir a imagem entregue antes de aprovar. Não gerar novas tentativas automaticamente.
- Revisão de anúncio também considera destino. Sem ganho financeiro prometido, sem atributos sensíveis, sem escassez falsa; aprovação continua incerta.

Consulta externa: tentei conferir as páginas oficiais de [atributos pessoais](https://transparency.meta.com/policies/ad-standards/objectionable-content/personal-attributes/) e [práticas comerciais](https://transparency.meta.com/policies/ad-standards/prohibited-content/unacceptable-business-practices/), mas o acesso retornou bloqueio/erro. O [guia de Stories](https://www.facebook.com/business/ads-guide/update/image/instagram-story) exigiu login. A [página oficial de Reels](https://www.facebook.com/business/ads/facebook-instagram-reels-ads) reforça área segura e vídeo vertical. Não declarar verificação integral das políticas atuais; conferir a prévia antes de publicar.

## 8. Lista final e copy

**Mudança:** de três conceitos (dois vídeos e um estático) para dois estáticos. Mesma oferta nos dois, sem áudio, sem interface, sem pessoas. As versões 1:1 e 9:16 serão adaptações após aprovação. Duração: não se aplica.

### C1 — operação cresceu (primeira peça; aposta inicial)

- Formato principal: 4:5. Nome: c1-operacao-cresceu-4x5.png.
- Ordem de leitura: “Sua operação cresceu.” em branco; “Seus sistemas, não.” em verde; “Integração sob medida”; “A partir de R$ 6 mil”; assinatura discreta “Eduardo Gouveia · EDevsHub”. Sem botões fictícios, números adicionais ou marcas de clientes.
- Texto principal: **Sua operação cresceu. Seus sistemas, não. Integração sob medida a partir de R$ 6 mil.**

  Eu conecto os sistemas que você já usa e desenvolvo um painel para acompanhar a operação. Escopo, prazo e valor por escrito antes de começar. Prazo de referência: 2 a 6 semanas, conforme o escopo combinado.
- Título: **Integração sob medida**
- Descrição: **Escopo, prazo e valor por escrito**
- Botão da plataforma: **Saiba mais**
- Destino: https://www.edevshub.com/contratar
- Por que aposto nela: reconhece a dor, filtra pelo investimento e repete exatamente a promessa do hero. Não é uma previsão de desempenho.

### C2 — prova (somente depois da aprovação)

- Formato principal: 4:5. Nome planejado: c2-prova-integracao-4x5.png.
- Ordem de leitura: “176 sistemas entregues”; “37 clientes voltaram a me contratar”; mesma oferta e preço de C1; mesma assinatura. Hierarquia enxuta, sem empilhar também a nota na arte.
- Texto principal: **176 sistemas entregues. 37 clientes voltaram a me contratar. Integração sob medida a partir de R$ 6 mil.**

  Eu conecto os sistemas que você já usa e desenvolvo um painel para acompanhar a operação. Escopo, prazo e valor por escrito antes de começar. Prazo de referência: 2 a 6 semanas, conforme o escopo combinado.
- Título: **Integração sob medida**
- Descrição: **Escopo, prazo e valor por escrito**
- Botão e destino: iguais a C1.

Os números de reputação foram conferidos em workanaStats; preços e prazos em offers. Não foram auditados diretamente na Workana. Não usar os demais números existentes no repositório nas peças.

## Produção e custo — antes de gerar

Higgsfield: saldo consultado **827,56 créditos**, plano Plus. Modelo gpt_image_2_5. Estimativas somente de leitura retornaram **1 crédito por imagem** em 4:5, 1:1 e 9:16. Dois conceitos × três proporções = **6 créditos**, sem refações; saldo projetado 821,56. Fase 2: **1 crédito**, uma imagem 4:5; saldo projetado 826,56. Créditos não são reais; não foi obtida conversão monetária verificável. Não contratar plano ou recarga.

As gerações gratuitas listadas são de Genjutsu/Viral e não cobrem esta imagem. Não usá-las para desviar o formato escolhido. Novas versões, cortes e refações aguardam aprovação.

## Entrega e limitações

**Fase 2 concluída. Aguardando aprovação; fase 3 não iniciada.**

| Arquivo entregue | Formato | Dimensões | Duração |
|---|---|---|---|
| c1-operacao-cresceu-4x5.png | PNG, 4:5 | 896 × 1120 | Não se aplica |
| c1-producao.md | Registro do modelo, job e prompt exato | — | — |

Uma única geração concluída: job 62c1d19d-f022-4c0c-918c-1866d2e5dfc7. Saldo após a geração: **826,56 créditos**; diferença confirmada de **1 crédito**. Restam cinco arquivos planejados, estimados em cinco créditos, sem refações. Nenhum deles foi gerado.

Conferência visual do PNG: texto integral correto, incluindo acentos, preço inicial e assinatura; sem pessoas, interface ou números extras. A imagem tem a hierarquia e a continuidade propostas. A copy que acompanha a peça está na seção C1 acima. Conferência técnica: arquivo abre corretamente, 933.899 bytes, proporção exata 4:5.

**Limitações honestas:** o modelo entregou 896 × 1120, abaixo do alvo usual de trabalho de 1080 × 1350; não foi ampliado artificialmente. A paleta é visualmente próxima, mas não respeita os hexadecimais de forma exata: um pixel de fundo medido foi #070808, em vez de #0a0c0b, e há variação sutil na superfície das letras. Portanto, é uma primeira peça para aprovação de direção, não um arquivo certificado de identidade cromática. Não houve uma segunda geração para corrigir isso. A assinatura é secundária e menor; a legibilidade em aparelho físico e a prévia no Gerenciador ainda precisam ser conferidas. A peça 4:5 não está aprovada para recorte automático em Stories/Reels.

RTK.md e CODEX.md não foram encontrados na raiz, em Downloads, .codex ou .agents; não presumir instruções que não puderam ser lidas. Não foram alterados campanha.md, criativos.md, o prompt ou a landing. Nenhum anúncio foi publicado.
