# Meta Ads — o que está pronto e o que falta

Situação em 17/09/2026. Só Meta Ads por enquanto; Google fica para depois.

## Pronto no site (verificado em produção)

| Item | Estado |
|---|---|
| Landing de conversão em `/contratar` | no ar, rola, hero acima da dobra no celular |
| Canal direto | WhatsApp com mensagem pré-preenchida, resposta no mesmo dia útil |
| Origem do clique na mensagem | `fbclid` vira `meta-ads` dentro do texto que chega no seu WhatsApp |
| Código do Pixel | instalado, dirigido por variável de ambiente |
| Evento de conversão | `Contact` dispara no clique do WhatsApp |
| PageView em navegação interna | redisparado (o App Router não recarrega a página) |
| `/workana` fora do pixel | garantido pelo guard do build, testado por sabotagem |
| Tag de verificação de domínio | pronta, dirigida por variável de ambiente |
| Política de privacidade | descreve o pixel, o remarketing e como recusar |

Nada disso dispara requisição para a Meta enquanto as variáveis não existirem.
O site roda hoje exatamente como antes.

## Falta — só você pode fazer (precisa das suas contas)

1. **Rodar o prompt da extensão** (`prompt-extensao.md`) e me mandar a resposta.
   Dela saem os dois valores que ligam tudo.
2. **Conta de anúncios com forma de pagamento**, se ainda não existir.
3. **Verificar o domínio `edevshub.com`** na Meta. Sem isso não dá para
   configurar os eventos priorizados, e a campanha roda cega no iPhone.
4. **Decidir o número de WhatsApp da campanha.** Hoje é o `41 99611-1900`. Se
   for o seu pessoal, vale abrir um WhatsApp Business dedicado ANTES de ligar
   verba: trocar depois significa perder as conversas de quem já te chamou.

## Falta — eu faço, quando você me passar os dados

1. Colocar `NEXT_PUBLIC_META_PIXEL_ID` e `NEXT_PUBLIC_FB_DOMAIN_VERIFICATION`
   na Vercel e publicar.
2. Verificar no ar que o evento `Contact` chega no Gerenciador de Eventos.
3. Ordem sugerida dos eventos priorizados: `Contact` em primeiro (é a conversa,
   que é o que interessa), `ViewContent` depois. Configuro junto com você.

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
