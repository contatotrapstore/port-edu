# Prompt 5 — montar a campanha no Gerenciador de Anúncios

A extensão monta tudo e **para antes de publicar**. Publicar é o Eduardo quem
autoriza, na conversa, depois de ver o resumo.

---

## Cole a partir daqui

Você está logado no Meta Business Suite do Eduardo. Vamos montar a primeira
campanha na conta **Dudu (`act_1515926913536871`)**, portfólio **Eduardo
Gouveia (287611329178059)**. Não toque nos outros portfólios.

A Meta muda nomes e caminhos de menu com frequência: se algo não estiver onde
eu descrevo, procure o equivalente e me diga onde achou. Se não achar, escreva
NÃO ENCONTREI em vez de inventar.

### Proibido em qualquer etapa

- **Publicar.** Você monta tudo e para na tela de revisão. A publicação só
  acontece se eu disser, nesta conversa, a palavra **PUBLICAR**.
- Publicar, editar, duplicar ou excluir o **rascunho antigo** que já existe na
  conta Dudu (ver etapa 0).
- Cadastrar, trocar ou remover forma de pagamento.
- Aceitar sugestão automática, "aplicação automática de recomendações", oferta
  de parceiro ou qualquer "melhoria com IA" do criativo.
- Mudar o texto dos anúncios. Ele vai exatamente como está abaixo, letra por
  letra.

### Etapa 0 — conferências antes de criar qualquer coisa

1. **O rascunho antigo.** Abra a conta Dudu e veja o rascunho não publicado
   que já existe. Me diga o nome, o objetivo e o orçamento dele. **Não
   publique e não exclua.** O motivo: o botão "Revisar e publicar" da Meta
   publica todos os rascunhos pendentes da conta juntos, a menos que você
   desmarque. Precisamos saber exatamente o que está lá.
2. **A identidade do anúncio.** Liste as Páginas do Facebook e as contas de
   Instagram disponíveis para anunciar nesta conta. **Não escolha sozinho.** O
   anúncio vai aparecer com o nome e a foto dessa Página, e usar a página de um
   cliente ou uma página pessoal seria um erro difícil de perceber depois. Me
   mostre a lista e espere eu indicar qual.
3. **Limite de gastos da conta.** Configurações de pagamento da conta Dudu >
   Limite de gastos da conta. Defina **US$ 95**. É uma trava: se qualquer
   configuração sair errada, a Meta para de gastar ali. Não mexa em mais nada
   na tela de pagamento. Se já existir um limite, me diga qual antes de alterar.

Me reporte os três itens e **espere minha resposta** sobre a Página antes de
seguir.

### Etapa 1 — campanha

Gerenciador de Anúncios > conta Dudu > Criar.

| Campo | Valor |
|---|---|
| Configuração | Manual (não use campanha Advantage+ nem modelo pronto) |
| Objetivo | **Tráfego** |
| Nome | `EDH · Tráfego · Integração · Teste 1` |
| Categoria especial de anúncio | **Nenhuma** |
| Orçamento da campanha Advantage+ | **Desligado** (o orçamento fica no conjunto) |
| Teste A/B | Desligado |

### Etapa 2 — conjunto de anúncios

| Campo | Valor |
|---|---|
| Nome | `BR · 25-60 · aberto` |
| Local da conversão | **Site** |
| Meta de desempenho | **Maximizar o número de visualizações da página de destino** |
| Conjunto de dados | **edevshub.com** (`2514954938991781`). Confira o ID. O antigo "Clinafy One miliiasss" não pode ser o selecionado |
| Orçamento | **Diário, US$ 6,50** |
| Início | hoje, horário atual |
| **Término** | **exatamente 14 dias depois do início**. Obrigatório: é a segunda trava, a campanha para sozinha |
| Público Advantage+ | ligado |
| Local | **Brasil** |
| Idade | 25 a 60 |
| Gênero | todos |
| Segmentação detalhada | **vazia** |
| Idioma | não definir |
| Posicionamentos | **Advantage+ (automáticos)** |

Se a Meta mostrar a estimativa de público ou de resultados diários, copie os
números para o relatório.

### Etapa 3 — anúncio C1 (dor)

| Campo | Valor |
|---|---|
| Nome | `C1 · dor · operação cresceu` |
| Identidade | a Página que eu indicar na etapa 0 |
| Formato | **Imagem ou vídeo único** |
| Mídia | as três proporções, cada uma no seu posicionamento (ver abaixo) |

**Mídia.** Os arquivos estão no computador do Eduardo, em:

```
C:\Users\GouveiaRx\Downloads\Port Edu\kit-meta-ads\criativos\
  c1-operacao-cresceu-4x5.png   → Feeds
  c1-operacao-cresceu-1x1.png   → posicionamentos que pedem quadrado
  c1-operacao-cresceu-9x16.png  → Stories e Reels
```

Se você não conseguir selecionar arquivo do disco pela janela de upload, **pare
nessa etapa e me peça** para escolher os arquivos. Não use imagem de outro
anúncio, da biblioteca ou gerada pela Meta no lugar.

Suba o 4:5 como mídia principal e use a personalização por posicionamento para
colocar o 9:16 em Stories e Reels e o 1:1 onde for quadrado. **Não aceite o
recorte automático.**

**Melhorias do criativo Advantage+: desligue todas.** Isso inclui variações de
texto geradas por IA, ajustes de imagem, expansão de imagem, sobreposições,
música, animação, "retoques" e modelos. As peças foram feitas pixel a pixel e
qualquer alteração automática desfaz isso. Se alguma opção não puder ser
desligada, me diga qual.

**Texto principal** (três parágrafos, exatamente assim):

```
Sua operação cresceu. Seus sistemas, não.

Integração entre os sistemas que você já usa. A partir de R$ 6 mil.

Eu conecto seus sistemas e desenvolvo um painel para acompanhar a operação. Escopo, prazo e valor por escrito antes de começar.
```

| Campo | Valor |
|---|---|
| Título | `Integre os sistemas que você já usa` |
| Descrição | `Escopo, prazo e valor por escrito` |
| Chamada para ação | **Saiba mais** |
| URL do site | `https://www.edevshub.com/contratar` |
| Parâmetros de URL | `utm_source=meta-c1&utm_medium=paid&utm_campaign=integracao-t1` |
| Rastreamento, eventos do site | conjunto de dados **edevshub.com** marcado |

O `utm_source=meta-c1` não é enfeite: ele aparece escrito dentro da mensagem
que chega no WhatsApp do Eduardo. É assim que ele vai saber qual dos dois
anúncios gerou cada conversa.

### Etapa 4 — anúncio C2 (prova)

Duplique o C1 **dentro do mesmo conjunto** e troque só isto:

| Campo | Valor |
|---|---|
| Nome | `C2 · prova · 176 sistemas` |
| Mídia | `c2-prova-4x5.png`, `c2-prova-1x1.png`, `c2-prova-9x16.png`, mesma distribuição por posicionamento |
| Parâmetros de URL | `utm_source=meta-c2&utm_medium=paid&utm_campaign=integracao-t1` |

**Texto principal:**

```
176 sistemas entregues. 37 clientes voltaram a me contratar.

Integração entre os sistemas que você já usa. A partir de R$ 6 mil.

Eu conecto seus sistemas e desenvolvo um painel para acompanhar a operação. Escopo, prazo e valor por escrito antes de começar.
```

Título, descrição, chamada para ação, URL e rastreamento: **iguais ao C1**.
Confira que as melhorias Advantage+ continuam desligadas na cópia; duplicar às
vezes as religa.

### Etapa 5 — conferir a prévia

Para cada anúncio, abra a prévia em **Feed do Instagram, Stories do Instagram
e Reels do Instagram** e me diga:

- se a proporção certa apareceu em cada um (4:5 no Feed, 9:16 em Stories e
  Reels)
- se algum texto da imagem ficou coberto pela interface
- se o texto principal aparece com os acentos corretos

Clique em "Visualizar URL" ou equivalente e confirme que a URL final leva a
`https://www.edevshub.com/contratar?utm_source=meta-c1...` (e `meta-c2` no
segundo).

### Etapa 6 — relatório e parada

Pare na tela de revisão, **sem publicar**, e me mande:

```
0. Rascunho antigo: <nome> · <objetivo> · <orçamento> · intocado
   Página escolhida: <nome>
   Limite de gastos da conta: US$ <valor>
1. Campanha: <nome> · Tráfego · sem categoria especial
2. Conjunto: US$ 6,50/dia · início <data hora> · término <data hora>
   Dataset: <nome> <ID> · Brasil 25-60 · segmentação vazia
   Estimativa da Meta: <o que ela mostrar>
3. C1: 3 proporções ok? · melhorias IA desligadas? · UTM meta-c1 ok?
4. C2: idem, com meta-c2
5. Prévias: <problemas encontrados ou "nenhum">
6. Avisos ou alertas da Meta na revisão: <texto exato>
7. NÃO ENCONTREI / parei por exigir autorização: <itens>
```

Quando eu responder **PUBLICAR**, abra a revisão e confirme que **só a
campanha `EDH · Tráfego · Integração · Teste 1` está selecionada**. Se o
rascunho antigo aparecer marcado, desmarque. Publique e me diga o status que
cada anúncio recebeu (em análise, ativo, reprovado).

## Cole até aqui

---

## Depois de publicar

- A Meta leva de minutos a um dia para aprovar. "Em análise" é normal.
- **Não mexa nada nos primeiros 3 dias.** Toda edição de orçamento, público ou
  criativo reinicia a fase de aprendizado.
- Cada conversa no WhatsApp vai chegar com `· meta-c1` ou `· meta-c2` escrito.
  Anote: com verba pequena, esse número vale mais que qualquer métrica do
  painel.
- Dia 7: primeira leitura de verdade (ver `campanha.md`, pontos de decisão).
