# Prompt 7 — ler as métricas da campanha (somente leitura)

Serve até o MCP oficial da Meta estar autenticado. Depois disso eu leio direto.

## Cole a partir daqui

Você está logado no Gerenciador de Anúncios, conta **Dudu
(`act_1515926913536871`)**. Preciso de uma leitura das métricas da campanha
**`EDH · Tráfego · Integração · Teste 1`**.

**Isto é só leitura.** Não edite, não pause, não ative, não duplique, não
aceite recomendação, não aplique "Aplicar agora", não toque no rascunho antigo.
Qualquer edição num anúncio no ar reinicia o aprendizado. Se algo parecer
errado, me descreva e pare, não conserte.

### 1. Período e visão

- Período: **"Máximo"** (ou desde 18/09/2026 até hoje). O padrão "Últimos 30
  dias" termina ontem e mostra zero.
- Nível: **Anúncios**, filtrado pela campanha EDH.
- Me diga a data e a hora da leitura e o fuso que a tela está usando.

### 2. Por anúncio (C1 e C2 separados) e o total do conjunto

Use **Colunas → Personalizar colunas** se precisar, sem salvar como padrão.

| Métrica | C1 | C2 | Conjunto |
|---|---|---|---|
| Status de veiculação (e se está em "Aprendizado") | | | |
| Valor usado (US$) | | | |
| Impressões | | | |
| Alcance | | | |
| Frequência | | | |
| CPM | | | |
| Cliques no link | | | |
| CTR (taxa de cliques no link) | | | |
| CPC (custo por clique no link) | | | |
| Visualizações da página de destino | | | |
| Custo por visualização da página de destino | | | |
| Contatos no site (evento `Contact`) | | | |
| Custo por contato | | | |

Se alguma coluna não existir com esse nome, use a equivalente e me diga qual.

### 3. Detalhamentos (Detalhamento → por entrega)

Para o **conjunto**, um de cada vez:

1. **Posicionamento:** valor usado, impressões, cliques no link e CTR de cada
   posicionamento. Confirme que **não aparece** Status do WhatsApp, in-stream
   de Reels nem Audience Network.
2. **Idade e gênero:** valor usado e cliques no link por faixa.
3. **Plataforma:** Facebook, Instagram, Messenger, Threads.

### 4. Diagnóstico

- **Classificações de relevância** (qualidade, taxa de engajamento, taxa de
  conversão) de cada anúncio, se já aparecerem. A Meta só mostra depois de
  cerca de 500 impressões.
- Texto exato das **recomendações** que aparecem em cada anúncio e no conjunto.
  **Não abra "Aplicar"**, só leia.
- Qualquer aviso, erro, reprovação ou "veiculação limitada".

### 5. Conferir se a Meta mudou algo sozinha

Abra o conjunto e os dois anúncios **só para ver**, sem salvar, e confirme:

- Posicionamentos continuam sem Status do WhatsApp, in-stream e Audience
  Network, e "Permitir gasto limitado em posicionamentos excluídos" desmarcado.
- As 5 melhorias do criativo continuam desligadas, música inclusive.
- Orçamento US$ 6,50/dia e término 02/10/2026 00:14 EDT.

Se algo tiver mudado, **não corrija**: me diga o quê.

Feche cada tela com Cancelar ou X, nunca com Salvar.

### 6. Eventos do site

Gerenciador de Eventos → dataset `edevshub.com` (`2514954938991781`) →
Visão geral, desde 18/09: quantos `PageView`, `Contact` e
`SubscribedButtonClick`.

### Relatório

As tabelas das seções 2 e 3, e depois:

```
Diagnóstico: <classificações, recomendações (texto), avisos>
Mudanças automáticas da Meta: <nenhuma / quais>
Eventos no dataset desde 18/09: PageView <n> · Contact <n> · SubscribedButtonClick <n>
NÃO ENCONTREI: <itens>
```

## Cole até aqui

---

## Como eu leio isso

- **Antes do dia 3, nada se decide.** A leitura serve para confirmar que está
  entregando de forma saudável, não para julgar qual anúncio é melhor.
- **Visualizações da página muito abaixo dos cliques no link** (menos de 70%)
  indica que as pessoas clicam e desistem antes da página carregar. Problema de
  página, não de anúncio.
- **CTR do link abaixo de 0,5% nos dois no dia 7** é a parada combinada.
- **Frequência acima de 2 na primeira semana**, com esse público enorme, indica
  que a Meta está insistindo nas mesmas pessoas.
- **O número que decide** não está no painel: são as conversas que chegam no
  WhatsApp com `meta-c1` ou `meta-c2`.
