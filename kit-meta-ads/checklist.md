# Meta Ads — o que está pronto e o que falta

Situação em 17/09/2026. Só Meta Ads por enquanto; Google fica para depois.

## Pronto no site (verificado em produção)

| Item | Estado |
|---|---|
| Landing de conversão em `/contratar` | no ar, rola, hero acima da dobra no celular |
| Canal direto | WhatsApp com mensagem pré-preenchida, resposta no mesmo dia útil |
| Origem do clique na mensagem | `fbclid` vira `meta-ads` dentro do texto que chega no seu WhatsApp |
| Código do Pixel | **no ar**, dataset `2514954938991781` |
| Evento de conversão | `Contact` dispara no clique do WhatsApp |
| PageView em navegação interna | redisparado (o App Router não recarrega a página) |
| `/workana` fora do pixel | garantido pelo guard do build, testado por sabotagem |
| Tag de verificação de domínio | **publicada no ar**, token `d6m9smjz...` |
| Política de privacidade | descreve o pixel, o remarketing e como recusar |

O pixel dispara **só em www.edevshub.com**: localhost e preview da Vercel não
poluem o dataset. Verificado em produção: `Contact` chega com a origem do
anúncio, e a /workana continua com zero requisição para a Meta.

## Levantamento feito em 17/09 — o que a extensão achou

- Portfólio **Eduardo Gouveia** (287611329178059), criado em 2020, **não
  verificado**, sem razão social, endereço nem telefone.
- Conta **Dudu** (act_1515926913536871) em **USD e fuso de Nova York**, com
  cartão cadastrado, US$ 0,14 de saldo e 3 campanhas desativadas. Moeda e fuso
  a Meta não deixa alterar depois da criação.
- Dataset **"Clinafy One miliiasss"**, de maio, **0 eventos em 120 dias**, sem
  site vinculado.
- Domínio `edevshub.com` **criado e pendente** de verificação.
- **1 rascunho não publicado** na conta Dudu.
- Nenhuma restrição no portfólio nem na conta.

## Falta — só você pode fazer (precisa das suas contas)

1. **Rodar `prompt-extensao-2-configurar.md`** (prompt 1): verifica o domínio,
   cria a conta em BRL/Brasília e o dataset limpo. Me devolve o Dataset ID.
2. **Vincular a forma de pagamento** à conta nova. A extensão não mexe em
   cartão, de propósito.
3. **Verificar o negócio com o CNPJ.** Não impede anunciar, mas limita gasto e
   trava recursos justamente quando a campanha começa a funcionar.
4. ~~Decidir o número de WhatsApp da campanha.~~ Resolvido em 19/09: **41 98897-0309**, WhatsApp Business dedicado da EDevsHub. Antes era o `41 99611-1900`, pessoal. Se
   for o seu pessoal, vale abrir um WhatsApp Business dedicado ANTES de ligar
   verba: trocar depois significa perder as conversas de quem já te chamou.

### Por que conta nova em vez de usar a que existe

A conta atual está em dólar e no fuso de Nova York. Na prática o "dia" do
orçamento vira à meia-noite de lá, ou seja 1h ou 2h da manhã aqui, e todo
relatório sai em dólar com conversão por cima. Com US$ 0,14 de saldo e nenhuma
campanha ativa, não há histórico a perder: trocar agora é de graça, daqui a
três meses não é. O dataset antigo nunca recebeu evento e não tem site
vinculado, então também não há nada para reaproveitar.

## Estrutura da Meta (estado final, 18/09, antes de publicar)

| O quê | Valor |
|---|---|
| Portfólio | Eduardo Gouveia · 287611329178059 · não verificado |
| Conta de anúncios | **Dudu** · `act_1515926913536871` · USD · fuso de Nova York · cartão · limite **US$ 95, reinício manual** |
| Conta reserva | EDevsHub - BR · `act_2196483267931657` · BRL · sem cartão · parada |
| Dataset | edevshub.com · `2514954938991781` · ligado só à Dudu |
| Domínio | edevshub.com · verificado por meta-tag |
| Página | **EDevsHub** · 1296763533524155 · Empresa de software · foto e capa ok · usuário `edevshub` (pendente de senha) |
| Campanha | `EDH · Tráfego · Integração · Teste 1` · Tráfego · sem categoria especial |
| Conjunto | `BR · 25-60 · aberto` · visualização da página de destino · US$ 6,50/dia · 14 dias a partir da publicação |
| Público | Brasil · 25-60 (sugestão, Advantage+) · todos os gêneros · sem segmentação detalhada |
| Posicionamentos | Feeds, Stories, Reels e busca de Facebook, Instagram, Messenger e Threads |
| Excluídos | Status do WhatsApp, in-stream de Reels, Audience Network. "Gasto limitado em excluídos" desmarcado |
| C1 | `c1-operacao-cresceu` · 4:5 Feeds, 9:16 Stories/Reels, 1:1 busca · `utm_source=meta-c1` |
| C2 | `c2-prova` · mesma distribuição · `utm_source=meta-c2` |
| IA da Meta | as 5 melhorias desligadas nos dois, versões automáticas de proporção removidas, 0 imagens geradas |

Rascunho antigo ("Novo anúncio de Tráfego", com erro) segue intocado e deve ficar
**desmarcado** na hora de publicar.

**Atenção depois de publicar:** a Meta religou sozinha, mais de uma vez, a música
e o "gasto limitado em excluídos", e sugere reativar posicionamentos Advantage+
para subir a pontuação. Nenhuma sugestão deve ser aceita durante o teste.

## Pixel confirmado em 17/09, 21:09

Teste manual no navegador real, aba Eventos de teste do dataset:

| Evento | Estado | Hora |
|---|---|---|
| `PageView` | Processado | 21:09:17 |
| `Contact` | Processado | 21:09:18 |
| `SubscribedButtonClick` | Processado | 21:09:18 |

Painel marcando "Recebendo atividade" de www.edevshub.com, e a mensagem chegou
no WhatsApp com `contratar_topo · meta-ads`. Cadeia inteira fechada: clique de
anúncio, página, evento na Meta, conversa identificada.

O "nenhum evento" anterior era atraso do painel somado ao meu tráfego de
navegador automatizado sendo descartado pela Meta.

## Próximo passo

`campanha.md` tem criativo, público e estrutura prontos para copiar.

Antes de publicar, três coisas suas: priorizar os eventos no AEM (`Contact` em
primeiro), verificar o negócio com CNPJ e recarregar a conta.

## Ainda não existe, e é decisão sua

- **Criativos.** Meta Ads precisa de imagem ou vídeo e texto do anúncio. Não
  temos nenhum. Posso escrever os textos e montar as peças a partir dos
  próprios prints dos sistemas, mas é trabalho à parte.
- **Público.** Meta não tem intenção de busca como o Google: você não escolhe
  "quem procurou sistema sob medida", escolhe interesse e comportamento. O
  público inicial provável é dono de PME e cargo de gestão no Brasil, e ele
  precisa ser desenhado antes de subir campanha.
- **Verba.** O combinado eram R$ 500/mês. Em Meta isso é pouco para aprender
  rápido: o algoritmo precisa de volume de conversão para sair da fase de
  aprendizado. Vale conversar sobre juntar em um teste só.

## Uma ressalva honesta sobre a ordem

O plano de 90 dias colocava mídia paga atrás de um portão no D60: landing no
ar, conversão instrumentada e pelo menos 3 conversas qualificadas vindas de
fora da Workana. Os dois primeiros estão sendo cumpridos agora — instrumentar
antes de gastar é exatamente o que ele pedia.

O terceiro ainda não. Ligar verba antes de saber se a página converte alguém
significa pagar para descobrir uma coisa que o tráfego que você já tem
responderia de graça. Não é motivo para parar: é motivo para deixar a
instrumentação pronta (feito), mandar o link para quem já te procura e ver a
primeira conversa acontecer antes do primeiro real gasto.

## Armadilha do in-stream (20/09)

Desde que a Meta tirou a exclusão de posicionamentos no conjunto, **todo
posicionamento ativo precisa de uma mídia em cada anúncio**. Como a peça 9:16 é
a única vertical, ela fica obrigada a cobrir in-stream de Reels, e aí a
publicação falha:

> "Esta imagem não pode ser usada para o posicionamento in-stream. Carregue um
> vídeo que tenha entre 5 e 15 segundos para veicular um anúncio in-stream."

Tentar desmarcar o in-stream dentro do anúncio também falha:

> "Essa mídia é a última mídia para veicular um posicionamento no grupo."

A regra é **por anúncio**: outro anúncio do conjunto já cobrir aquele
posicionamento não resolve. Foi assim que o C4 ficou travado em rascunho
enquanto o C6, publicado antes, passou.

**Saídas, quando isso voltar:** produzir um vídeo de 5 a 15 segundos para o
9:16, ou aceitar rodar um anúncio só. Com verba pequena, rodar um só costuma
ser melhor: dois anúncios dividem a verba e nenhum junta conversa suficiente
para comparar.

O rascunho do C4 fica parado na conta. Ele aparece na fila "Conferir e
publicar" junto com o rascunho antigo de Tráfego: **nunca usar o botão que
publica tudo de uma vez**.
