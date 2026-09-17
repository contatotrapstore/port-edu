# Meta Ads — o que está pronto e o que falta

Situação em 17/09/2026. Só Meta Ads por enquanto; Google fica para depois.

## Pronto no site (verificado em produção)

| Item | Estado |
|---|---|
| Landing de conversão em `/contratar` | no ar, rola, hero acima da dobra no celular |
| Canal direto | WhatsApp com mensagem pré-preenchida, resposta no mesmo dia útil |
| Origem do clique na mensagem | `fbclid` vira `meta-ads` dentro do texto que chega no seu WhatsApp |
| Código do Pixel | instalado, inerte até o Dataset ID existir |
| Evento de conversão | `Contact` dispara no clique do WhatsApp |
| PageView em navegação interna | redisparado (o App Router não recarrega a página) |
| `/workana` fora do pixel | garantido pelo guard do build, testado por sabotagem |
| Tag de verificação de domínio | **publicada no ar**, token `d6m9smjz...` |
| Política de privacidade | descreve o pixel, o remarketing e como recusar |

O pixel não dispara requisição nenhuma para a Meta enquanto o Dataset ID não
existir: o site roda hoje exatamente como antes. A meta-tag de verificação já
está publicada, porque ela é inofensiva e destrava a verificação do domínio
sem depender de mais nada.

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
4. **Decidir o número de WhatsApp da campanha.** Hoje é o `41 99611-1900`. Se
   for o seu pessoal, vale abrir um WhatsApp Business dedicado ANTES de ligar
   verba: trocar depois significa perder as conversas de quem já te chamou.

### Por que conta nova em vez de usar a que existe

A conta atual está em dólar e no fuso de Nova York. Na prática o "dia" do
orçamento vira à meia-noite de lá, ou seja 1h ou 2h da manhã aqui, e todo
relatório sai em dólar com conversão por cima. Com US$ 0,14 de saldo e nenhuma
campanha ativa, não há histórico a perder: trocar agora é de graça, daqui a
três meses não é. O dataset antigo nunca recebeu evento e não tem site
vinculado, então também não há nada para reaproveitar.

## Falta — eu faço, quando você me passar os dados

1. Colocar o Dataset ID no site e publicar.
2. Verificar no ar que o evento `Contact` chega no Gerenciador de Eventos.
3. Aí roda o prompt 2, que prioriza `Contact` na frente do `PageView`.

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
