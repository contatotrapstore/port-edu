# Prompt para o Codex — analisar, decidir e criar os criativos

Cole o bloco abaixo no Codex, com o MCP do Higgsfield conectado.

O Codex tem liberdade para discordar da especificação em quase tudo: quantos
criativos, vídeo ou imagem, duração, gancho, roteiro, copy. Três coisas ficam
fora da discussão, e o prompt explica o motivo de cada uma para ele não tentar
"melhorar" por ali.

---

## Cole a partir daqui

Você vai produzir os criativos da primeira campanha de Meta Ads da EDevsHub,
usando o MCP do Higgsfield. Antes de gerar qualquer coisa, quero a sua análise
e o seu veredito. Trate a especificação que já existe como um ponto de partida
escrito por outra pessoa, não como ordem: se ela estiver errada, diga onde e
por quê.

O projeto está em `C:\Users\GouveiaRx\Downloads\Port Edu`.

### Leia antes de começar

| Arquivo | Para quê |
|---|---|
| `kit-meta-ads/campanha.md` | Objetivo, público, verba, os 4 textos de anúncio, pontos de decisão |
| `kit-meta-ads/criativos.md` | A especificação atual dos criativos, com roteiro tempo a tempo |
| `src/app/contratar/page.tsx` | A página para onde o anúncio manda. É com ela que o criativo precisa bater |
| `src/lib/constants.ts` | Os números reais (`workanaStats`), os cases (`projects`) e as ofertas (`offers`) |
| `public/images/lp/rei-painel.webp` | Painel de gestão de obras, recortado e legível |
| `public/images/projects/covers/` | Prints dos sistemas entregues |
| `public/images/projects/clinafy.webp` | Captura direta do Clinafy, onde os números do cliente aparecem na tela |

Abra as imagens e olhe de verdade. Algumas capas são mockup de estúdio com
marca d'água por cima e ficam ilegíveis em tela de celular.

### O cenário

- **Quem vende:** Eduardo Gouveia, desenvolvedor full stack sênior, **sozinho**.
  Não existe equipe, atendente nem gerente de conta.
- **O que vende:** software sob medida para donos de PME brasileiros. Três
  ofertas: atendimento com IA no WhatsApp (a partir de R$ 12 mil), integração
  entre sistemas (a partir de R$ 6 mil), MVP de SaaS (a partir de R$ 28 mil).
- **Para quem:** dono ou gestor de PME com dor operacional. Não é desenvolvedor.
  Desconfia de promessa fácil. Vai gastar de R$ 6 a 28 mil.
- **Verba:** R$ 35 por dia durante 14 dias, uns R$ 500 no total. Objetivo
  Tráfego, otimizado para visualização da página de destino.
- **Regra de leitura:** não se julga criativo antes de uns 50 cliques. Com
  clique estimado em R$ 2, isso é uns R$ 100 por criativo.
- **Onde o anúncio aparece:** Feed, Reels e Stories do Instagram e Facebook,
  posicionamento automático, quase tudo no celular, a maior parte assistida
  sem som.

### Três limites que não entram na sua análise

Pode questionar todo o resto. Estes três, não:

1. **Nenhuma pessoa nas peças.** Sem apresentador, sem avatar, sem porta-voz,
   sem rosto gerado por IA, sem mão digitando. O Eduardo trabalha sozinho: uma
   porta-voz cria a impressão de uma equipe que não existe, e a promessa quebra
   exatamente quando o lead chega no WhatsApp e é ele quem responde. Além
   disso, para um comprador de R$ 6 a 28 mil, cabeça falante sintética lê como
   golpe.

2. **Não gere interface de software.** Toda tela que aparecer tem que ser um
   print real que está no repositório. Uma tela gerada por IA parece trabalho
   do Eduardo e não é: isso é prova fabricada. Você pode enquadrar, recortar,
   aproximar e destacar região de um print real. Não pode inventar um.

3. **Não invente número.** Os únicos números permitidos:
   - 176 sistemas entregues
   - nota 4,74 em 179 avaliações
   - 37 clientes que voltaram a contratar
   - Clinafy: mais de 500 profissionais e 50 mil consultas
   - preços "a partir de" e prazos que estão em `offers`

   Nada de "aumente suas vendas em X%", "economize X horas", "responda em X
   segundos". Nenhum desses foi medido.

Voz de IA para locução está liberada: é ferramenta de narração, não uma pessoa
se passando por alguém.

### Fase 1 — análise e veredito

Escreva `kit-meta-ads/criativos/VEREDITO.md` respondendo, com argumento e não
com gosto pessoal:

1. **Quantos criativos esta verba sustenta?** Faça a conta com os números do
   cenário. A especificação diz três. Se for pouco ou demais, diga.
2. **Vídeo, imagem, ou qual mistura?** Considerando posicionamento, custo de
   produção e a necessidade de comparar os criativos entre si dentro de 14
   dias.
3. **Os ganchos.** Os 2 primeiros segundos decidem. Avalie cada abertura da
   especificação: ela para o dedo de um dono de empresa rolando o feed? Se não,
   proponha outra, e diga por que a sua é melhor.
4. **A copy.** Leia os 4 textos de `campanha.md`. Algum está fraco, genérico,
   longo demais para o corte de ~125 caracteres do celular, ou em risco de
   reprovação pela Meta (promessa financeira, afirmação pessoal sobre quem vê,
   urgência falsa)?
5. **Continuidade com a página.** Abra `src/app/contratar/page.tsx`. O
   título da página é "Sua operação cresceu. Seus sistemas, não." Quem clica
   no anúncio precisa reconhecer em um segundo que chegou no lugar certo: mesma
   promessa, mesma linguagem, mesma cor. Onde a especificação quebra isso?
6. **Quais prints usar.** Olhe os arquivos. Quais ficam legíveis num quadro de
   celular e quais viram borrão?
7. **O que pode dar errado.** Reprovação na revisão da Meta, criativo que só
   funciona com som, texto que some em Stories por cair na área coberta pela
   interface.
8. **Veredito.** A lista final do que você vai produzir: quantidade, formato,
   duração, gancho, roteiro, copy de cada um. Marque claramente o que mudou em
   relação à especificação e por quê.

Seja direto. Se a especificação estiver certa em algum ponto, diga em uma
linha e siga. Se estiver errada, gaste o espaço ali.

### Fase 2 — criar a primeira peça e parar

Antes de gerar, consulte o saldo de créditos do Higgsfield e diga quanto a
produção inteira deve custar.

Depois gere **só a peça que você considerar mais forte**, no formato principal
dela, e **pare**. Me mostre o resultado junto com o veredito e espere a
aprovação do Eduardo antes de seguir. Errar o tom em uma peça custa uma peça;
errar em todas custa todos os créditos.

### Fase 3 — produzir o resto, depois da aprovação

Só quando o Eduardo aprovar a primeira.

Para cada peça:

- **Vídeo:** movimento contido. Aproximação lenta, entrada suave, destaque em
  região da tela. Nada de partícula, brilho pulsante, glitch, zoom agressivo ou
  transição chamativa: isso grita "anúncio" e derruba confiança de quem vai
  gastar milhares de reais.
- **Texto na tela** em fonte pesada e alto contraste, legível no celular, fora
  das áreas que a interface do Stories e do Reels cobre (faixa de cima e de
  baixo). O vídeo tem que funcionar inteiro sem som.
- **Nenhuma abertura com logo ou vinheta.** A frase de gancho vem primeiro.
- **Paleta:** fundo `#0a0c0b`, texto `#e8efec`, destaque único `#3fcf7f`.
  Nenhuma outra cor de destaque.
- **Formatos:** 9:16 para Stories e Reels, 4:5 para o Feed. Estático em 4:5 e
  1:1.

Salve em `kit-meta-ads/criativos/` com nomes que digam o que é, por exemplo
`c1-lead-22h-9x16.mp4` e `c3-prova-4x5.png`.

### Entrega final

Atualize o `VEREDITO.md` com:

- a lista de arquivos gerados, formato e duração de cada um
- a copy final que acompanha cada criativo no Gerenciador de Anúncios (texto
  principal, título, descrição)
- qual criativo você aposta que vai ganhar, e por quê
- o que não deu certo, com honestidade: peça que ficou abaixo do esperado,
  limitação da ferramenta, qualquer coisa que o Eduardo precise saber antes de
  subir

## Cole até aqui

---

## Por que o prompt está montado assim

**Análise antes de criar.** O Codex é bom em apontar o que está errado num
plano alheio. Pedir o veredito antes de gerar faz ele usar isso, em vez de só
executar a minha especificação com outra ferramenta.

**Os três limites vêm com o motivo.** Um modelo que recebe "não faça X" sem
explicação tende a achar que X melhoraria o resultado e a contornar a regra.
Com o motivo escrito, ele entende que não é estilo, é o que impede o anúncio
de mentir.

**Parar na primeira peça.** Crédito do Higgsfield é dinheiro. Uma peça errada
custa uma peça; o lote inteiro errado custa todos os créditos.
