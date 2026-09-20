# Veredito — primeira campanha EDevsHub

Análise inicial em 17/09/2026, horário de Brasília. **Segunda rodada concluída após aprovação de Eduardo: seis estáticos renderizados por código, sem créditos.** As seções de análise da primeira rodada estão preservadas como histórico; a seção 8 contém a copy vigente e a seção “Segunda rodada” registra a entrega atual. As estimativas de Higgsfield ao final da primeira rodada foram substituídas pela produção local gratuita.

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

**Decisão aprovada e executada:** dois estáticos, dor contra prova. Mesma oferta nos dois, sem áudio, sem interface, sem pessoas. Versões 4:5, 1:1 e 9:16 produzidas por código. Duração: não se aplica. A linha de oferta vigente é “Integração entre os sistemas que você já usa”.

### C1 — operação cresceu (primeira peça; aposta inicial)

- Formato principal: 4:5. Nome: c1-operacao-cresceu-4x5.png.
- Ordem de leitura: “Sua operação cresceu.” em branco; “Seus sistemas, não.” em verde; “Integração entre os sistemas que você já usa”; “A partir de R$ 6 mil”; assinatura discreta “Eduardo Gouveia · EDevsHub”. Sem botões fictícios, números adicionais ou marcas de clientes.
- Texto principal: **Sua operação cresceu. Seus sistemas, não.**

  Integração entre os sistemas que você já usa. A partir de R$ 6 mil.

  Eu conecto seus sistemas e desenvolvo um painel para acompanhar a operação. Escopo, prazo e valor por escrito antes de começar.
- Título: **Integre os sistemas que você já usa**
- Descrição: **Escopo, prazo e valor por escrito**
- Botão da plataforma: **Saiba mais**
- Destino: https://www.edevshub.com/contratar
- Por que aposto nela: reconhece a dor, filtra pelo investimento e repete exatamente a promessa do hero. Não é uma previsão de desempenho.

### C2 — prova

- Formato principal: 4:5. Nome: c2-prova-4x5.png.
- Ordem de leitura: “176 sistemas entregues.”; “37 clientes voltaram a me contratar.”; mesma oferta e preço de C1; mesma assinatura. Hierarquia enxuta, sem empilhar também a nota na arte.
- Texto principal: **176 sistemas entregues. 37 clientes voltaram a me contratar.**

  Integração entre os sistemas que você já usa. A partir de R$ 6 mil.

  Eu conecto seus sistemas e desenvolvo um painel para acompanhar a operação. Escopo, prazo e valor por escrito antes de começar.
- Título: **Integre os sistemas que você já usa**
- Descrição: **Escopo, prazo e valor por escrito**
- Botão e destino: iguais a C1.

Os números de reputação foram conferidos em workanaStats; preços e prazos em offers. Não foram auditados diretamente na Workana. Não usar os demais números existentes no repositório nas peças.

## Histórico da primeira rodada — produção e custo antes de gerar

Higgsfield: saldo consultado **827,56 créditos**, plano Plus. Modelo gpt_image_2_5. Estimativas somente de leitura retornaram **1 crédito por imagem** em 4:5, 1:1 e 9:16. Dois conceitos × três proporções = **6 créditos**, sem refações; saldo projetado 821,56. Fase 2: **1 crédito**, uma imagem 4:5; saldo projetado 826,56. Créditos não são reais; não foi obtida conversão monetária verificável. Não contratar plano ou recarga.

As gerações gratuitas listadas são de Genjutsu/Viral e não cobrem esta imagem. Não usá-las para desviar o formato escolhido. Novas versões, cortes e refações aguardam aprovação.

## Histórico da primeira rodada — entrega e limitações

**Estado ao encerrar a primeira rodada:** fase 2 concluída, aguardava aprovação. Esse estado foi superado pela aprovação e entrega da segunda rodada abaixo.

| Arquivo entregue | Formato | Dimensões | Duração |
|---|---|---|---|
| c1-operacao-cresceu-4x5.png | PNG, 4:5 | 896 × 1120 | Não se aplica |
| c1-producao.md | Registro do modelo, job e prompt exato | — | — |

Uma única geração concluída: job 62c1d19d-f022-4c0c-918c-1866d2e5dfc7. Saldo após a geração: **826,56 créditos**; diferença confirmada de **1 crédito**. Restam cinco arquivos planejados, estimados em cinco créditos, sem refações. Nenhum deles foi gerado.

Conferência visual do PNG: texto integral correto, incluindo acentos, preço inicial e assinatura; sem pessoas, interface ou números extras. A imagem tem a hierarquia e a continuidade propostas. A copy que acompanha a peça está na seção C1 acima. Conferência técnica: arquivo abre corretamente, 933.899 bytes, proporção exata 4:5.

**Limitações honestas:** o modelo entregou 896 × 1120, abaixo do alvo usual de trabalho de 1080 × 1350; não foi ampliado artificialmente. A paleta é visualmente próxima, mas não respeita os hexadecimais de forma exata: um pixel de fundo medido foi #070808, em vez de #0a0c0b, e há variação sutil na superfície das letras. Portanto, é uma primeira peça para aprovação de direção, não um arquivo certificado de identidade cromática. Não houve uma segunda geração para corrigir isso. A assinatura é secundária e menor; a legibilidade em aparelho físico e a prévia no Gerenciador ainda precisam ser conferidas. A peça 4:5 não está aprovada para recorte automático em Stories/Reels.

RTK.md e CODEX.md não foram encontrados na raiz, em Downloads, .codex ou .agents; não presumir instruções que não puderam ser lidas. Não foram alterados campanha.md, criativos.md, o prompt ou a landing. Nenhum anúncio foi publicado.

## Segunda rodada — entrega aprovada, produzida por código

Aprovação recebida com duas mudanças: oferta explícita e renderização local. As seis peças abaixo substituem o plano de produção pelo Higgsfield. **Zero crédito utilizado nesta rodada.** Nenhuma ferramenta Higgsfield foi chamada. Nenhum anúncio foi publicado.

### Texto e composição

A seção 8 acima contém a copy atual para copiar no Gerenciador. Depois da primeira frase de gancho, todo o texto principal é igual nos dois anúncios. O título comum é “Integre os sistemas que você já usa”; a descrição é “Escopo, prazo e valor por escrito”. Não acrescentei nota, avaliações ou outros resultados. O preço de R$ 6 mil foi mantido conforme os textos explicitamente pedidos nesta rodada.

C1 tem quatro linhas fixas: “Sua operação” / “cresceu.” / “Seus sistemas,” / “não.”. C2 também tem quatro linhas: “176 sistemas” / “entregues.” / “37 clientes voltaram” / “a me contratar.”. Assim, as duas frases de prova usam duas linhas cada, sem quebra de palavras. A frase verde de C2 usa corpo menor para preservar a leitura e a largura; só o bloco de gancho varia.

O template usa Space Grotesk real para título/oferta e Inter real para preço/assinatura, copiadas do build local da landing e carregadas sem rede. O navegador confirmou via CDP que as fontes desenhadas são essas fontes web, sem fallback. As três cores sólidas são #0a0c0b, #e8efec e #3fcf7f; tons intermediários de antialiasing nas bordas das letras são normais. Retirei os cinzas extras do template fornecido no preço e na assinatura.

### Conferências de cada arquivo

Medições por sharp e pelo navegador. Fundo amostrado em (10,10); limites também verificados por varredura de todos os pixels não pertencentes ao fundo. “4 (2+2)” significa duas linhas brancas e duas verdes do C2. Todos os textos foram comparados com a sequência exata solicitada. As seis prévias reais reduzidas a 360 px foram abertas e examinadas visualmente.

| Arquivo | Dimensões exatas | Fundo | Sem transbordamento / área ocupada | Linhas do título | Legibilidade a 360 px |
|---|---|---|---|---|---|
| c1-operacao-cresceu-4x5.png | 1080 × 1350 | #0a0c0b — passou | Passou; x=92–987, y=235–1138 | 4 — passou | Passou; oferta 19,3 px, preço 15,3 px |
| c2-prova-4x5.png | 1080 × 1350 | #0a0c0b — passou | Passou; x=92–987, y=235–1138 | 4 (2+2) — passou | Passou; oferta 19,3 px, preço 15,3 px |
| c1-operacao-cresceu-1x1.png | 1080 × 1080 | #0a0c0b — passou | Passou; x=92–987, y=104–896 | 4 — passou | Passou; oferta 18 px, preço 15,3 px |
| c2-prova-1x1.png | 1080 × 1080 | #0a0c0b — passou | Passou; x=92–987, y=104–896 | 4 (2+2) — passou | Passou; oferta 18 px, preço 15,3 px |
| c1-operacao-cresceu-9x16.png | 1080 × 1920 | #0a0c0b — passou | Passou; x=92–987, y=304–1118, inteiramente na área segura | 4 — passou | Passou; oferta 18,7 px, preço 15,3 px |
| c2-prova-9x16.png | 1080 × 1920 | #0a0c0b — passou | Passou; x=92–987, y=304–1118, inteiramente na área segura | 4 (2+2) — passou | Passou; oferta 18,7 px, preço 15,3 px |

As medidas de tamanho a 360 px são equivalentes ao corpo tipográfico na escala 1/3. A avaliação visual complementa essas medidas; não é um teste com participantes ou em todos os aparelhos. A assinatura é secundária, com corpo equivalente a 10 px; a oferta e o preço são maiores e legíveis.

Nos verticais, os primeiros 269 px e a região a partir de y=1248 têm apenas o fundo; as laterais excedem os 65 px mínimos. O espaço vazio maior na base é intencional para os controles de Stories/Reels. Não aproximar a assinatura do rodapé ao subir o arquivo.

### Bloco comum: posições e tamanhos idênticos entre C1 e C2

Todos usam x=92 e largura de bloco 896 px. Além da igualdade de coordenadas e fonte no DOM, o SHA-256 da região de pixels desde a oferta até o fim do canvas é idêntico no par de cada proporção.

| Proporção | Oferta: y / corpo / entrelinha | Preço: y / corpo | Filete: y / altura | Assinatura: y / corpo |
|---|---|---|---|---|
| 4:5 | 788 / 58 / 63 px | 935 / 46 px | 1070 / 4 px | 1108 / 30 px |
| 1:1 | 550 / 54 / 59 px | 692 / 46 px | 828 / 4 px | 866 / 30 px |
| 9:16 | 770 / 56 / 61 px | 918 / 46 px | 1050 / 4 px | 1088 / 30 px |

O quadrado recebeu título menor e espaçamento mais compacto, mantendo as margens laterais e as quatro linhas. Preço e assinatura conservaram tamanho para não perder leitura. O vertical recebeu composição própria dentro da faixa segura, em vez de apenas ganhar altura de canvas.

### Comparação com o Higgsfield

O original foi preservado como **c1-operacao-cresceu-4x5-higgsfield.png**, sem alteração do conteúdo. O novo c1-operacao-cresceu-4x5.png tem resolução nativa de 1080 × 1350, fundo exato, tipografia real, linha de oferta correta e layout reproduzível. Melhoraram controle, fidelidade à landing e consistência entre peças; custo adicional de créditos: zero.

Tradeoff: a oferta nova é mais longa e ocupa duas linhas; exige um pouco mais de leitura que “Integração sob medida”. O desenho ficou mais sóbrio, e o gancho ocupa menos largura que na versão gerada. Isso é consistente com o template aprovado, mas não há evidência de que aumente o CTR. No 9:16, preservar área segura reduz a ocupação visual da tela. A nova produção resolve as limitações técnicas registradas na primeira rodada; não resolve por si a incerteza de desempenho.

### Reproduzir e conferir

- template-estatico.html: fonte única parametrizada por concept=c1|c2 e ratio=4x5|1x1|9x16; abre como C1 4:5 por padrão.
- render-estaticos.cjs: gera os seis arquivos, aguarda document.fonts.ready, verifica fontes reais, texto, linhas, geometria, paleta e pixels; captura somente #art.
- fonts/: cópias das fontes latinas já presentes no build local da landing.
- qa/verificacao.json: medições completas, fontes efetivas, hashes do bloco comum e resultado da revisão visual.
- qa/*-360.png: prévias para a conferência de leitura. São arquivos de QA, não anúncios adicionais.
- LEIA-ME.txt: comando de reprodução e instalação isolada do Playwright.

Playwright foi instalado em diretório temporário sem espaços. package.json e o lockfile do site não foram alterados. O gerador marca a revisão visual como pendente a cada nova execução; novas renderizações precisam ser abertas e revistas. Nesta entrega, os seis resultados foram aprovados nessa revisão.

Antes de subir: usar o arquivo correspondente ao posicionamento, sem corte automático que desloque textos, e conferir a prévia do Gerenciador. Essa conferência na conta não foi executada, pois a tarefa termina nos arquivos. A análise da primeira rodada permanece acima para consulta; seus estados de aprovação e custos são históricos.

## Revisão visual (18/09) — o que as asserções não pegavam

O script de renderização mede dimensão, cor, fonte, quebra, overflow, área segura e bloco comum idêntico, e todas passaram. Duas falhas eram de desenho, e só aparecem olhando a peça:

1. **C2, vão entre as linhas verdes.** "37 clientes voltaram" e "a me contratar." usavam corpo de 80 px (`--proof`) mas herdavam a altura de linha do título grande (`--step`, 116 px). Resultado: um vão maior que o próprio texto entre as duas linhas, que liam como itens separados. Corrigido com altura de linha proporcional ao próprio corpo e 18 px de respiro antes do bloco verde.
2. **9:16 com título encolhido sem motivo.** A largura útil é a mesma do 4:5, mas o título tinha caído de 116 para 100 px. No posicionamento que costuma ter o inventário mais barato, é impacto perdido de graça. Agora usa a mesma escala do 4:5, deslocada para ficar centralizada na área que o Stories e o Reels não cobrem (y 269 a 1248).

Script rodado de novo depois das correções: as seis peças passaram em todas as asserções, inclusive a de bloco comum idêntico pixel a pixel entre C1 e C2. Revisão visual das seis feita: **aprovadas para subir**.

O vazio abaixo do conteúdo no 9:16 é intencional: é a faixa que a interface do Stories cobre com o campo de resposta e o botão.

## Terceira rodada — revisão de C3/C4 e conceito C5 (20/09/2026)

Esta seção é a análise vigente para a oferta de **sistema ou app sob medida**. O histórico acima foi preservado, inclusive preços, recomendações e aprovações que pertencem às rodadas antigas. Produção autorizada neste pedido: três estáticos C5 por código, sem envio à Meta.

### Base da análise e limites do diagnóstico

Li o template, o renderizador, `campanha.md`, `/contratar` e `offers` em `src/lib/constants.ts`. Li também `prompt-extensao-9-trocar-oferta.md`, que contém os textos completos e o modelo de conversa planejado para C3/C4. Abri os seis PNGs originais de C3 e C4: 4:5, quadrado e vertical de cada conceito.

Os resultados de mídia são **relato do Eduardo neste pedido**, não uma consulta nova à conta: Tráfego gastou R$ 56 sem conversa; Mensagens trouxe quatro conversas por R$ 25 em 21 horas, todas consideradas irrelevantes. Isso dá R$ 6,25 por conversa bruta e nenhuma conversa qualificada observada. Com zero qualificada, não há custo por qualificada finito a reportar. Não recebi as conversas, a distribuição por anúncio nem o detalhamento atual dos posicionamentos.

**Não atribuo esse resultado ao C3/C4.** Eles são peças novas com oferta corrigida; os dados fornecidos não mostram desempenho individual deles. Também corrijo uma certeza excessiva do histórico: CTR de 6,7% e concentração em Reels são compatíveis com cliques sem intenção, mas não demonstram toque acidental. Android, idade ou clique barato não identificam intenção de compra. A mensagem pronta é uma hipótese plausível para reduzir o esforço de iniciar contato, não uma causa isolada demonstrada por quatro conversas.

### 1. C3 e C4 resistem ao diagnóstico?

**Resistem como peças legíveis; não resolvem a falta de qualificação na primeira leitura.** Não encontrei corte, palavra quebrada ou preço ilegível nas seis artes abertas. O problema principal é o significado da abertura e a ordem da informação.

| Trecho observado | Quem pode se interessar sem ser o comprador pretendido | O que falta |
|---|---|---|
| C3: “Sua operação cresceu.” | Autônomo, pessoa organizando trabalho próprio ou alguém que apenas deseja crescer. “Operação” não especifica equipe, empresa em funcionamento ou poder de contratar. | Nomear dono/gestor e uma rotina de equipe. |
| C3: “Seus sistemas, não.” | Quem busca dica de ferramenta, planilha melhor ou software pronto. A frase descreve insatisfação ampla. | Uma situação que peça avaliação de desenvolvimento sob medida, sem afirmar que toda planilha exige um sistema. |
| C4: “176 sistemas entregues.” | Curioso por tecnologia, portfólio ou desenvolvimento de aplicativos. O número prova experiência do fornecedor, mas não que ele resolve o caso daquela empresa. | Dar contexto de aplicação à prova. |
| C4: “37 clientes voltaram a me contratar.” | Quem quer saber mais sobre o profissional, sem ter projeto ou orçamento. É confiança, não seleção de comprador. | Explicar para quem o trabalho serve antes de apresentar a reputação. |
| Ambos: “Sistema ou app sob medida” | Quem tem apenas uma ideia de app também pode se reconhecer. “App” amplia as interpretações possíveis. | Ancorar a oferta em uma operação que já existe. |
| Ambos: “para o jeito que você trabalha” e “2 a 4 semanas” | Promessa ampla de adaptação e rapidez, inclusive para trabalho individual; pode soar como qualquer app entregue nesse prazo. | Empresa/equipe na abertura; escopo combinado na copy. |

A copy completa de C3/C4 já diz **“sua empresa”** no segundo parágrafo e **“sua equipe faz hoje na mão ou na planilha”** no último. Portanto, não é ausência total de contexto empresarial: ele chega tarde, depois do gancho genérico. “Me chama no WhatsApp” facilita o contato, mas não exige que a pessoa explique uma necessidade. C3 é a referência mais próxima para comparar com C5; C4 continua disponível como hipótese de prova, sem declaração de vencedor ou perdedor.

### 2. Dizer para quem é: criativo e conversa, além do público

É corrigível no criativo. **“Dono ou gestor de PME”** nomeia a responsabilidade de decisão; **“sua equipe”** exclui parte das interpretações individuais; **“controla pedidos na planilha”** torna a situação reconhecível. Esse é o gancho do C5. Não escolhi só “empresário”: a palavra seria ampla e não mostraria o trabalho a resolver.

Escolhi pedidos como um recorte concreto, não como diagnóstico de todas as PMEs. O custo dessa escolha é deixar de chamar empresas cuja dor principal são obras, agenda ou atendimento. É uma hipótese deliberadamente mais estreita; não uma promessa de que toda empresa com pedidos precisa de software próprio. “PME” também pode não ser a palavra que todo dono usa para se descrever: é uma limitação da abertura compacta, a observar nas respostas.

Alterar interesses ou cargos não garante empresa ativa, autoridade de compra nem orçamento. A recomendação é primeiro comparar a mensagem mantendo público, oferta e destino comparáveis; segmentação é outra hipótese. Não fiz alteração na conta.

Há uma fragilidade no Prompt 9: **trocar texto pronto por perguntas de escolha não garante intenção**. “Quero um app para a minha empresa” ainda pode ser enviada com pouco esforço, sem explicar processo ou investimento. Na futura conversa, pedir o ramo/empresa, o controle atual e compatibilidade com o preço; considerar qualificada somente depois de uma resposta com conteúdo. A avaliação humana do Eduardo vale mais que o contador de conversas iniciadas. Isso é recomendação para o fluxo, não uma configuração executada aqui.

### 3. O preço filtra o suficiente?

**Não sozinho; e não há dados para afirmar que o preço corrigido de C3/C4 já falhou.** Na arte, R$ 5 mil é legível, mas está depois de quatro linhas de gancho e duas de oferta. A 360 px, seu corpo equivale a 15,3 px, contra até 38,7 px na abertura de C3/C4. É informação disponível, não garantia de que foi lida antes do toque. Na copy anterior, o preço também vinha após o primeiro parágrafo.

“A partir de” é o piso do projeto, não seu orçamento final. Ler esse piso não comprova disponibilidade para pagar; uma mensagem enviada não confirma que a pessoa o aceitou. O C5 mantém o preço visível na arte, coloca-o já na abertura do texto principal e pede explicitamente que a pessoa diga se esse investimento cabe no planejamento. Não aumentei preço artificialmente para repelir contatos.

Fonte de preço/pré-prazo: `offers` registra sistema/app a partir de **R$ 5 mil, 2 a 4 semanas**; IA no WhatsApp, R$ 12 mil, 2 a 4 semanas; integração, R$ 3 mil, 2 a 6 semanas. O piso geral de R$ 3 mil não vira preço deste anúncio, que vende sistema/app. A faixa de R$ 5 a 12 mil está no FAQ de `/contratar` e no relato do Eduardo, não no campo `range` de `offers`; por isso a peça usa só o piso e prazo de `offers`.

O comentário e a flag `pricingConfirmed = false` permanecem em `constants.ts`, mas a página lida renderiza `o.range` e `o.term` diretamente, sem essa condição. Não usei o comentário antigo para negar o preço confirmado pelo usuário. Registrei a divergência sem alterar o site.

### 4. Vídeo agora vale?

**A prioridade não muda: produzir C5 estático primeiro, especialmente o 4:5.** O problema relatado passou a ser qualidade da conversa, e não falta de clique. Animar um texto que não nomeia o comprador pode atrair mais atenção sem melhorar essa qualidade. Se a entrega está migrando para o Feed do Facebook, como informado, há ainda menos motivo para produzir vídeo apenas para ocupar Reels; não recebi uma quebra atual para quantificar essa migração.

A mudança de objetivo não torna vídeo obrigatório. A documentação oficial de [anúncios que abrem o WhatsApp](https://whatsappbusiness.com/products/ads-that-click-to-whatsapp/) apresenta imagem e vídeo e recomenda medir resultados além da conversa. Ela não demonstra superioridade de vídeo para esta conta.

Vídeo passa a valer como próximo teste se houver uma demonstração que uma imagem não explica: uma sequência curta de recortes reais mostrando pedido, responsável e andamento, desde que o repositório de fato contenha esse fluxo e os prints obedeçam à paleta e aos números permitidos. Outra opção é animar o mesmo C5 por código, preservando comprador e preço desde a abertura, para testar formato. Nenhuma exige pessoa, avatar ou interface gerada. Não produziria simultaneamente nova promessa, novo público e vídeo: faltaria saber qual mudança ajudou. Os problemas anteriores de print ilegível e excesso de texto continuam relevantes; trocar objetivo não os resolveu.

### 5. Veredito de produção e de teste

**Produzir somente C5 em três proporções**, mantendo C3/C4 como arquivos de referência. É a lacuna mais direta: comprador + equipe + rotina concreta antes da oferta. Não refiz C3/C4, não acrescentei números de reputação ao C5 e não criei vídeo nesta rodada. O novo conceito continua tipográfico, com as fontes e três cores aprovadas.

Ter três conceitos disponíveis não obriga rodar três ao mesmo tempo. Com a verba pequena de `campanha.md`, minha recomendação para uma futura comparação é C5 e C3 como referência, com a mesma qualificação no WhatsApp e sem mudança simultânea de público. A copy completa também muda, portanto a comparação avalia a **mensagem do anúncio como um conjunto**, não só uma palavra do título. Verba desigual entre anúncios impede declarar perdedor quem quase não recebeu entrega.

Registrar por anúncio: gasto, conversas recebidas, respostas que descrevem a operação, compatibilidade com investimento e oportunidades que avançaram para escopo. Se ninguém responder com contexto, revisar a passagem anúncio → WhatsApp; se houver contexto mas o orçamento não couber, revisar expectativa/preço. Não usar CTR isolado ou custo por conversa bruta como sinal de sucesso. Uma conversa qualificada é um indício comercial, não prova estatística nem venda.

`campanha.md` ainda descreve Tráfego, integração a R$ 6 mil e regras antigas de decisão. Usei sua verba e a preocupação em não espalhar o teste como histórico, não como configuração atual. Também não repito a regra antiga “clicam mas não falam = problema da página”: no destino WhatsApp, a pessoa não passa pela landing. O arquivo de campanha não foi modificado.

### C5 — arte e copy pronta para o Gerenciador

Nome sugerido: **C5 · PME · pedidos na planilha**.

Texto da arte, com quatro linhas de gancho:

```text
Dono ou gestor
de PME?
Sua equipe controla
pedidos na planilha?

Sistema ou app sob medida
para o jeito que você trabalha
A partir de R$ 5 mil · 2 a 4 semanas

Eduardo Gouveia · EDevsHub
```

As duas primeiras linhas são claras; as duas da situação são verdes. Mantive “para o jeito que você trabalha” no bloco comum para preservar oferta e geometria de C3/C4; agora o gancho define quem é esse “você”.

**Texto principal — copiar integralmente:**

```text
Dono ou gestor de PME com equipe e pedidos na planilha? Sistema sob medida a partir de R$ 5 mil.

Desenvolvo um sistema ou app para a operação que sua empresa já tem, com telas, acessos e regras definidos pelo processo. Prazo de 2 a 4 semanas, conforme o escopo.

Me conte no WhatsApp o que sua empresa faz e como a equipe controla os pedidos hoje. Diga também se o investimento a partir de R$ 5 mil cabe no planejamento.

Respondo com faixa de preço e prazo, por escrito, antes de começar.
```

**Título:** `Sistema sob medida, a partir de R$ 5 mil`

**Descrição opcional:** `Escopo, prazo e valor por escrito`

**CTA da plataforma:** `Enviar mensagem pelo WhatsApp` (ou o equivalente disponível). O botão não está desenhado na imagem. A copy chama a pessoa a escrever o contexto; não propõe voltar à mensagem genérica pré-preenchida.

### Produção, medições e revisão visual

Execução: `node kit-meta-ads/criativos/render-estaticos.cjs c5`. Renderização local com Chrome headless, fontes locais Space Grotesk e Inter, PNGs nativos de 1080 px de largura. Nenhuma ferramenta Higgsfield foi chamada: **zero crédito**. Os arquivos de C3/C4 e o relatório anterior não foram sobrescritos nesta execução.

| Arquivo | Dimensões | Bytes | Pixels de conteúdo: x / y, inclusivos | Corpo a 360 px: comprador / situação / oferta / preço | Revisão visual |
|---|---|---:|---|---|---|
| `c5-sistema-pme-4x5.png` | 1080 × 1350 | 98.518 | 92–987 / 239–1138 | 36 / 26,7 / 19,3 / 15,3 px | Aprovada |
| `c5-sistema-pme-1x1.png` | 1080 × 1080 | 88.429 | 92–987 / 106–896 | 31,3 / 22,7 / 18 / 15,3 px | Aprovada |
| `c5-sistema-pme-9x16.png` | 1080 × 1920 | 101.683 | 92–987 / 311–1210 | 36 / 26,7 / 19,3 / 15,3 px | Aprovada |

Abri os três PNGs finais e suas três prévias de 360 px. Comprador e situação são lidos como dois blocos ligados; as linhas verdes não têm o vão herdado do título grande. A interrogação final, os acentos, “R$ 5 mil” e o prazo estão inteiros. No quadrado, as linhas longas continuam dentro da margem; no vertical, o espaço inferior é intencional. A assinatura é secundária, equivalente a 10 px a 360; não carrega o argumento de venda. Não há pessoas, telas, logotipos de terceiros nem números adicionais.

Conferências automáticas passaram nas três proporções: texto exato, quatro linhas de título, ausência de quebra e transbordamento, separação entre os blocos, dimensões, fundo exato, as três cores computadas, presença das cores nos pixels e famílias de fonte efetivamente desenhadas via CDP, sem fallback. Os tons de borda das letras são antialiasing das cores aprovadas, não novas cores de design.

No 9:16, o conteúdo fica dentro da faixa interna de projeto x ≥ 65, x < 1015, y ≥ 269, y < 1248; os pixels efetivos vão de y=311 a 1210. Essa é a área conservadora herdada do template, **não certificação da interface atual de todos os posicionamentos**. Os três recortes devem continuar sendo usados individualmente.

Oferta, preço, filete e assinatura mantêm x=92 e largura de bloco 896 px. Posições por proporção, respectivamente: 4:5, y=788/935/1070/1108; 1:1, y=550/692/828/866; 9:16, y=860/1007/1142/1180. O hash da região a partir da oferta é idêntico ao C3 da mesma proporção em todos os arquivos; medições e hashes completos estão em `qa/verificacao-c5.json`.

Correção preventiva solicitada: `[data-concept="c5"]` entrou **nas duas listas CSS** das linhas verdes, tanto corpo/entrelinha quanto margem antes do bloco. Corpo verde de 80 px e entrelinha de 89,6 px no 4:5/9:16; 68 px e 76,16 px no quadrado. O script agora verifica explicitamente essas medidas, além do transbordamento. O título branco usa 108 px no 4:5/9:16 e 94 px no quadrado, para acomodar “Dono ou gestor” sem aperto.

O renderizador aceita `c3`, `c4` e `c5` como argumentos; sem argumento, produz os nove arquivos. Executar só `c5` preserva os outros conceitos e escreve `qa/verificacao-c5.json`. Toda nova execução volta a revisão visual para `pending`; o status só foi aprovado depois de abrir as imagens desta rodada. Consulte o `LEIA-ME.txt` atualizado para reproduzir.

### O que não foi feito ou não pôde ser confirmado

- Nenhum upload, edição de anúncio, publicação ou alteração de orçamento/público/modelo de WhatsApp. Nenhum acesso novo à conta Meta nesta rodada.
- Não auditei as quatro conversas nem confirmei quais criativos estavam ativos, sua exposição ao preço ou a participação atual do Feed. Não demonstrei melhora de qualificação ou conversão do C5.
- Não houve teste com donos de PME, aparelho físico ou prévia do Gerenciador. A revisão local aprova os arquivos tecnicamente e visualmente; não garante aprovação da Meta nem cobertura da interface em cada posicionamento.
- As páginas oficiais do Ads Guide de Feed e de anúncios de mensagem redirecionaram para login/bloqueio na consulta pública. Não declaro verificação integral das especificações atuais. Mantive as dimensões explicitamente pedidas; a página oficial de WhatsApp citada acima estava acessível.
- `RTK.md` e `CODEX.md` continuam não localizados nos caminhos de instrução procurados. Nenhuma instrução foi presumida. O site, os preços e os anúncios anteriores não foram alterados.
