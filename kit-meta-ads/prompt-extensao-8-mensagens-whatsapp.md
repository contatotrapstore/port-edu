# Prompt 8 — trocar para campanha de Mensagens (clique para WhatsApp)

Decisão de 19/09/2026, depois da primeira leitura: a campanha de Tráfego gastou
US$ 10,49, gerou 159 visitas e **nenhuma conversa**. 91% das visitas vieram do
Reels do Instagram, com CTR de 6,7%, que é toque por impulso. O objetivo
Tráfego manda a Meta achar quem abre a página mais barato, e foi isso que ela
achou. A campanha nova otimiza por **conversa iniciada no WhatsApp**.

A campanha de Tráfego **não é apagada**: ela é pausada no momento em que a nova
for publicada, e fica como referência.

---

## Cole a partir daqui

Você está logado no Meta Business Suite do Eduardo. Vamos criar uma campanha
nova na conta **Dudu (`act_1515926913536871`)**, portfólio **Eduardo Gouveia
(287611329178059)**, com a Página **EDevsHub** (1296763533524155). Não toque nos
outros portfólios.

A Meta muda nomes e caminhos de menu com frequência: se algo não estiver onde
descrevo, procure o equivalente e me diga onde achou. Se não achar, escreva NÃO
ENCONTREI.

### Proibido em qualquer etapa

- **Publicar** sem eu escrever **PUBLICAR** nesta conversa.
- Editar, publicar ou excluir o rascunho antigo "Novo anúncio de Tráfego".
- Editar a campanha de Tráfego `EDH · Tráfego · Integração · Teste 1`. Ela só
  vai ser **pausada**, e só depois que eu disser PUBLICAR (etapa 6).
- Mexer em forma de pagamento ou no limite de gastos da conta.
- Aceitar recomendação automática, "Aplicar agora", oferta de parceiro ou
  qualquer "melhoria com IA" do criativo.
- Alterar texto fora do que está escrito abaixo.

### Etapa 0 — ligar o WhatsApp à Página EDevsHub

Anúncio de clique para WhatsApp exige o número vinculado à Página.

1. Página EDevsHub → Configurações → **WhatsApp** (ou "Contas vinculadas" →
   WhatsApp).
2. Número: **+55 41 99611-1900**.
3. A Meta vai mandar um **código de verificação para esse WhatsApp**. Você não
   tem acesso ao celular: **pare e me peça o código**. Não tente outro método de
   verificação sem me perguntar.
4. Se a Meta disser que o número precisa ser **WhatsApp Business** ou que já
   está ligado a outra Página, pare e me diga a mensagem exata.
5. Se oferecer "mostrar botão do WhatsApp na Página", pode aceitar.

Me confirme quando o número aparecer como vinculado.

### Etapa 1 — campanha

Gerenciador de Anúncios → conta Dudu → Criar.

| Campo | Valor |
|---|---|
| Configuração | Manual (não use campanha Advantage+ nem modelo pronto) |
| Objetivo | **Engajamento** |
| Nome | `EDH · Mensagens · Integração · Teste 2` |
| Categoria especial de anúncio | Nenhuma |
| Orçamento da campanha Advantage+ | Desligado |
| Teste A/B | Desligado |

### Etapa 2 — conjunto de anúncios

| Campo | Valor |
|---|---|
| Nome | `BR · 25-60 · WhatsApp` |
| Local da conversão | **Apps de mensagens** |
| App de mensagens | **Somente WhatsApp**. Desmarque Messenger e Instagram Direct se vierem marcados |
| Número | +55 41 99611-1900 (o vinculado na etapa 0) |
| Meta de desempenho | **Maximizar o número de conversas** |
| Orçamento | **Diário, US$ 6,50** |
| Início | hoje, horário atual |
| **Término** | **02/10/2026 00:14 (fuso da conta, EDT)** — o mesmo fim do teste original |
| Público Advantage+ | ligado |
| Local | **somente Brasil** (se vier Estados Unidos, remova) |
| Idade | 25 a 60 |
| Gênero | todos |
| Segmentação detalhada | vazia |
| Posicionamentos | Advantage+, **excluindo**: Status do WhatsApp, anúncios in-stream para Reels e Audience Network. "Permitir gasto limitado em posicionamentos excluídos" **desmarcado** |

A Meta costuma remarcar sozinha o "gasto limitado em excluídos" depois que você
exclui posicionamentos. Confira de novo antes de sair do conjunto.

### Etapa 3 — anúncio C1

| Campo | Valor |
|---|---|
| Nome | `C1 · dor · WhatsApp` |
| Identidade | Página **EDevsHub**. No Instagram: "Usar a Página do Facebook" |
| Formato | Imagem única |
| "Anúncios com vários anunciantes" | **desmarcado** |

**Mídia** — da biblioteca "Imagens da conta", pesquisando pelo nome completo e
conferindo o tamanho:

| Arquivo | Tamanho | Posicionamentos |
|---|---|---|
| `c1-operacao-cresceu-4x5` | 1080 × 1350 | só Feeds |
| `c1-operacao-cresceu-9x16` | 1080 × 1920 | só Stories e Reels |
| `c1-operacao-cresceu-1x1` | 1080 × 1080 | só Resultados de pesquisa |

Não use `c1-operacao-cresceu-4x5-higgsfield` (896 × 1120) nem
`c1-referencia-codigo-4x5` (1080 × 1350, mesmo tamanho do certo). Remova as
versões automáticas de proporção e deixe cada imagem em "Mídia original".
Lembre do que aprendemos: personalize uma imagem por vez e **salve entre uma e
outra**, senão a Meta reagrupa.

**Melhorias do criativo Advantage+: todas desligadas** (retoques visuais,
música, animação, sobreposições, melhorias no texto e qualquer outra que
aparecer). Zero imagens geradas por IA.

**Texto principal:**

```
Sua operação cresceu. Seus sistemas, não.

Integração entre os sistemas que você já usa. A partir de R$ 6 mil.

Me chama no WhatsApp contando o que está travando e quais sistemas você usa. Respondo com faixa de preço e prazo, por escrito.
```

| Campo | Valor |
|---|---|
| Título | `Integre os sistemas que você já usa` |
| Chamada para ação | **Enviar mensagem** (ou "Enviar mensagem pelo WhatsApp") |

**Modelo de mensagem do WhatsApp** (a tela que define o que a pessoa vê ao
abrir a conversa). Crie um modelo novo:

| Campo | Valor |
|---|---|
| Nome do modelo | `EDH · C1` |
| Tipo | Perguntas frequentes / mensagem pré-preenchida (o que a Meta oferecer) |
| Saudação | `Oi! Aqui é o Eduardo, da EDevsHub. Pra eu te responder com faixa de preço e prazo, me conta o que está travando e quais sistemas você usa hoje. Projetos começam em R$ 6 mil.` |
| Mensagem pré-preenchida | `Olá! Vim pelo anúncio C1 e quero integrar os sistemas da minha empresa.` |
| Perguntas rápidas (se houver) | `Quero integrar os sistemas que já uso` · `Quero atendimento com IA no WhatsApp` · `Quero orçar um sistema sob medida` |

O `anúncio C1` na mensagem pré-preenchida não é enfeite: é assim que o Eduardo
sabe de qual anúncio veio cada conversa. **Não tire.**

### Etapa 4 — anúncio C2

Duplique o C1 dentro do mesmo conjunto e troque só:

| Campo | Valor |
|---|---|
| Nome | `C2 · prova · WhatsApp` |
| Mídia | `c2-prova-4x5` (Feeds), `c2-prova-9x16` (Stories e Reels), `c2-prova-1x1` (Resultados de pesquisa) |
| Modelo de mensagem | modelo novo `EDH · C2`, igual ao do C1, com a mensagem pré-preenchida `Olá! Vim pelo anúncio C2 e quero integrar os sistemas da minha empresa.` |

**Texto principal do C2:**

```
176 sistemas entregues. 37 clientes voltaram a me contratar.

Integração entre os sistemas que você já usa. A partir de R$ 6 mil.

Me chama no WhatsApp contando o que está travando e quais sistemas você usa. Respondo com faixa de preço e prazo, por escrito.
```

Depois de duplicar, confira no C2: melhorias de IA todas desligadas, música
desligada, "vários anunciantes" desmarcado e o modelo `EDH · C2` selecionado
(e não o do C1).

### Etapa 5 — prévia e parada

Para C1 e C2:

1. Abra a prévia em Feed do Facebook, Feed do Instagram, Stories e Reels, e
   confira a imagem certa em cada um e o botão "Enviar mensagem".
2. Abra a **prévia do WhatsApp** (se a Meta oferecer) e confira a saudação e a
   mensagem pré-preenchida com `anúncio C1` / `anúncio C2`.

Pare na tela de revisão, **sem publicar**, e me mande:

```
0. WhatsApp vinculado à Página: sim/não · tipo de conta que a Meta mostrou
1. Campanha: <nome> · Engajamento · sem categoria especial
2. Conjunto: US$ 6,50/dia · início <data hora> · término <data hora>
   Destino: só WhatsApp · meta: conversas · Brasil 25-60
   Excluídos: <lista> · gasto limitado em excluídos: <marcado/desmarcado>
3. C1: mídia por posicionamento ok? · melhorias IA desligadas? · modelo EDH · C1 ok?
4. C2: idem, com modelo EDH · C2
5. Prévias: <problemas ou "nenhum">
6. Avisos e erros na revisão: <texto exato>
7. O que aparece marcado para publicar: <lista>
8. NÃO ENCONTREI / parei por exigir autorização: <itens>
```

### Etapa 6 — só quando eu escrever PUBLICAR

1. Na tela de publicação, deixe marcados **só** a campanha
   `EDH · Mensagens · Integração · Teste 2`, o conjunto e os dois anúncios
   dela. O rascunho antigo "Novo anúncio de Tráfego" fica **desmarcado**.
2. Publique.
3. **Depois** que a nova estiver publicada, **pause** (não exclua, não edite) a
   campanha `EDH · Tráfego · Integração · Teste 1`, no interruptor do nível de
   campanha.
4. Me diga: status de cada anúncio novo (em análise, ativo ou reprovado, com o
   motivo exato), o término gravado e a confirmação de que a de Tráfego ficou
   pausada.

## Cole até aqui

---

## Depois de publicar

- **Responda rápido.** Conversa de anúncio esfria em minutos, não em horas. Se
  não puder responder na hora, deixe uma mensagem de ausência no WhatsApp
  Business dizendo quando responde.
- Cada conversa chega com `anúncio C1` ou `anúncio C2` escrito. Anote data,
  anúncio e se a pessoa tinha orçamento de verdade.
- Não mexa em nada por 3 dias.
- Leitura: conversas iniciadas e custo por conversa, por anúncio.
