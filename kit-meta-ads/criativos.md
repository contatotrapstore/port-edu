# Criativos — especificação inicial

Três peças, e só três. Com R$ 35 por dia a Meta precisa concentrar entrega:
mais criativo com a mesma verba é menos aprendizado em cada um.

| # | Tipo | Formato | Duração | Ângulo |
|---|---|---|---|---|
| 1 | Vídeo | 9:16 e 4:5 | 15s | Atendimento perdido |
| 2 | Vídeo | 9:16 e 4:5 | 15s | Planilha que ninguém atualiza |
| 3 | Estático | 4:5 e 1:1 | — | Prova |

## Regras que valem para as três

- **Sem som por padrão.** A maioria assiste mudo. O texto na tela é o roteiro;
  a locução é bônus. Se o vídeo só funciona com áudio, ele não funciona.
- **2 primeiros segundos decidem.** A frase de abertura precisa aparecer antes
  de qualquer logo, transição ou vinheta. Vinheta de abertura mata anúncio.
- **Ninguém aparece.** Sem rosto, sem apresentador, sem avatar de IA se
  passando por funcionário. A tela do sistema é a prova.
- **Nada de banco de imagem.** Os prints reais estão em
  `public/images/projects/` e o recorte do painel da Rei Sol em
  `public/images/lp/rei-painel.webp`.
- **Paleta da marca:** fundo `#0a0c0b`, texto `#e8efec`, destaque único
  `#3fcf7f`. Quem clica precisa reconhecer que chegou no lugar certo.
- **Legenda queimada** no vídeo, fonte pesada, alto contraste.
- **Zero número inventado.** Só 176 sistemas entregues, 4,74 em 179 avaliações,
  37 clientes recorrentes, e os resultados reais dos cases.

---

## Criativo 1 — "O lead das 22h"

Fonte visual: `public/images/projects/covers/mudapaisagens.webp` (fluxo de
qualificação rodando).

| Tempo | Tela | Texto queimado |
|---|---|---|
| 0,0 a 2,0s | Fundo escuro, relógio grande | **22h47** |
| 2,0 a 4,5s | Notificação de mensagem entrando, sem resposta | Um lead te chamou. |
| 4,5 a 6,5s | A notificação esmaece | Ninguém respondeu. |
| 6,5 a 11,0s | Print do fluxo de qualificação, câmera aproximando devagar | No dia seguinte ele já falou com outro. |
| 11,0 a 13,5s | Mesmo print, destaque no fim do fluxo | Atendimento que responde, qualifica e registra no seu CRM. |
| 13,5 a 15,0s | Fundo liso, logo pequeno | A partir de R$ 12 mil · 2 a 4 semanas |

**Locução (opcional, PT-BR, tom seco e direto, sem entusiasmo de vendedor):**
"Vinte e duas e quarenta e sete. Um lead te chamou, e ninguém respondeu. No dia
seguinte ele já falou com outro. Eu construo o atendimento que responde,
qualifica e registra no CRM que você já usa."

---

## Criativo 2 — "A planilha"

Fonte visual: `public/images/lp/rei-painel.webp`.

| Tempo | Tela | Texto queimado |
|---|---|---|
| 0,0 a 2,0s | Fundo escuro | **A pessoa que sabe tirou férias.** |
| 2,0 a 4,0s | Mesmo fundo | A operação travou. |
| 4,0 a 9,0s | Painel da Rei Sol entrando, aproximação lenta nos status | Obra, responsável, SLA, o que está atrasado. |
| 9,0 a 12,5s | Destaque nas etiquetas "1 atrasada" e "No prazo" | Tudo num painel. No lugar da planilha. |
| 12,5 a 15,0s | Fundo liso | 176 sistemas entregues · 4,74 em 179 avaliações |

**Locução:** "Quando a pessoa que sabe tira férias, a operação trava. Quando ela
sai, a regra do negócio some junto. Coloquei a Rei Sol num painel onde cada obra
tem etapa, responsável e prazo."

---

## Criativo 3 — estático de prova

Uma arte, dois cortes (4:5 e 1:1).

- Fundo `#0a0c0b`.
- O painel da Rei Sol ocupando a metade de baixo, levemente inclinado, com
  brilho verde discreto atrás.
- Em cima, em fonte pesada: **176 sistemas entregues**
- Abaixo, menor, em `#3fcf7f`: `4,74 em 179 avaliações · 37 clientes voltaram`
- Rodapé: logo EDevsHub pequeno.
- Nada mais. Sem selo, sem "clique aqui", sem seta.

---

## Prompt para o Codex

Está em **`prompt-codex-criativos.md`**. Ele trata esta especificação como ponto
de partida, não como ordem: o Codex analisa, pode discordar da quantidade, do
formato, dos ganchos e da copy, e escreve o veredito antes de gerar.

---

## Depois de prontos

1. Assista cada vídeo **com o som desligado** e no celular. Se não der para
   entender a oferta assim, volta.
2. Confira que os 2 primeiros segundos têm a frase de abertura, sem logo nem
   vinheta na frente.
3. Suba os 3 num único conjunto de anúncios, com o mesmo público. Deixe a Meta
   distribuir: ela acha o vencedor mais rápido que você.
4. Não julgue antes de **50 cliques por criativo**. Abaixo disso é ruído.
