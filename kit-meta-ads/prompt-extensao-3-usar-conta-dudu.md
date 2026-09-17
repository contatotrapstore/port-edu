# Prompt 3 — apontar o dataset para a conta Dudu

Decisão de 17/09: usar a conta **Dudu** (`act_1515926913536871`, USD, fuso de
Nova York), que já tem forma de pagamento, em vez da **EDevsHub - BR** criada
hoje.

**O site não muda.** O que está instalado no código é o dataset
`2514954938991781`, não a conta de anúncios. A conta é só quem *lê* esse
dataset. Trocar de conta é religar do lado da Meta, sem deploy.

Este prompt faz duas coisas de uma vez: religa o dataset e termina a
priorização de eventos que tinha ficado bloqueada pela verificação de domínio
(já resolvida).

---

## Cole a partir daqui

Você está logado no Meta Business Suite. Trabalhe **apenas dentro do portfólio
"Eduardo Gouveia" (ID 287611329178059)**. Os outros três portfólios são de
clientes e não devem ser tocados.

**Proibido, em qualquer etapa:**
- publicar, ativar, pausar ou duplicar campanha, conjunto ou anúncio
- tocar no rascunho não publicado que existe na conta Dudu
- cadastrar, alterar ou remover forma de pagamento
- alterar limite de gastos
- excluir contas de anúncios ou datasets
- aceitar recomendação automática, "aplicação automática", Advantage+ ou
  qualquer oferta de parceiro (Conversions API Gateway, Birch e similares)

Se alguma etapa exigir uma dessas coisas, **pare e me pergunte** em vez de
executar. A Meta muda nome e lugar de menu com frequência: se um caminho não
existir como descrito, procure o equivalente, me diga onde achou e siga. Se não
achar, escreva "NÃO ENCONTREI" naquele item em vez de inventar.

### Etapa 1 — conectar o dataset à conta Dudu

Gerenciador de Eventos > Fontes de dados > dataset **`edevshub.com`**
(ID 2514954938991781) > Configurações > Ativos conectados (ou "Ativos
atribuídos").

Conecte a conta de anúncios **Dudu (`act_1515926913536871`)**.

Me confirme, lendo a tela, quais contas ficaram conectadas ao dataset depois
disso.

### Etapa 2 — desconectar a conta EDevsHub - BR

No mesmo lugar, remova a conexão com **EDevsHub - BR
(`act_2196483267931657`)**.

Só a conexão: **não exclua nem desative a conta**, ela fica parada como
reserva. Se a Meta avisar que a remoção afeta campanhas em veiculação, pare e
me diga o aviso exato — não deveria afetar nada, porque essa conta nunca
rodou.

Ao final desta etapa o dataset `edevshub.com` deve estar conectado **só** à
conta Dudu.

### Etapa 3 — conferir que não há dataset duplicado na Dudu

Ainda no Gerenciador de Eventos, veja a quais datasets a conta Dudu está
conectada.

Se o dataset antigo **"Clinafy One miliiasss"** (ID 1426741065924696) também
aparecer ligado à Dudu, **desconecte só ele** — ele nunca recebeu evento, não
tem site vinculado, e deixá-lo ali faz a gente correr o risco de escolher o
dataset errado na hora de criar a campanha. Não exclua o dataset, só
desconecte.

Me diga o que encontrou e o que ficou.

### Etapa 4 — eventos priorizados (AEM)

Agora deve funcionar: essa tela estava bloqueada porque o domínio não estava
verificado, e ele foi verificado hoje.

Gerenciador de Eventos > Configuração de eventos da Web (Aggregated Event
Measurement) > domínio **`edevshub.com`** > Gerenciar eventos.

Antes de configurar, me diga quais eventos a Meta já viu no dataset nas
últimas 24h. Devem aparecer `PageView` e pelo menos um `Contact` — foram
gerados em teste hoje, não são leads reais.

Configure a prioridade nesta ordem exata:

1. `Contact`
2. `PageView`

`Contact` em primeiro porque é a conversa no WhatsApp, que é o que o anúncio
precisa otimizar; visita não paga conta. Se a Meta oferecer marcar algum
evento como "valor" ou otimizar por valor, **não marque**: não há valor
monetário atribuído a esses eventos e isso distorceria a entrega.

Salve e me confirme a ordem que ficou gravada.

Se a tela continuar sem renderizar, me diga exatamente o que acontece (tela
branca, erro, carregamento infinito) e em qual navegador.

### Etapa 5 — relatório

```
1. Dataset edevshub.com conectado a: <contas>
2. EDevsHub - BR desconectada: sim / não (motivo)
3. Datasets ligados à conta Dudu: <lista> · desconectei o antigo: sim/não/não estava
4. Eventos vistos em 24h: PageView <n> · Contact <n> · outros <quais>
5. Eventos priorizados gravados, em ordem: 1. ... 2. ...
6. Avisos de qualidade do evento: nenhum / <texto>
7. NÃO ENCONTREI: <itens>
8. Parei por exigir autorização: <itens>
```

## Cole até aqui

---

## Depois deste prompt

Configuração encerrada. Falta:

1. **Recarregar a conta Dudu** (você faz, quando quiser começar).
2. **Verificação do negócio com CNPJ.** O alerta "Ajude a manter seus anúncios
   em veiculação sem interrupções" que aparece na conta é exatamente isso. Não
   impede anunciar hoje, mas a Meta avisa que pode se tornar obrigatório.
3. **Criativo, público e verba** — não é configuração, é decisão e conteúdo.

## O que ficou diferente por usar a conta em dólar

Nada quebra, mas duas coisas mudam no dia a dia:

- **A cobrança é internacional.** Entra IOF e o spread do cartão, e a cotação é
  a do dia da cobrança. Vale olhar na fatura quanto custou de fato a última
  cobrança da Meta, para saber a margem real.
- **O dia do orçamento fecha à meia-noite de Nova York**, 1h ou 2h da manhã
  aqui. O "ontem" do relatório não é o seu ontem, e o orçamento diário reinicia
  de madrugada.

A conta **EDevsHub - BR** fica parada e sem custo. Se um dia o volume
justificar, migrar para ela é criar campanha nova lá e reconectar o dataset —
o histórico de otimização não vai junto, que é o motivo de valer a pena decidir
isso cedo.
