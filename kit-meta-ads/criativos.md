# Criativos — especificação e prompt para o Codex

Três peças, e só três. Com cerca de R$ 17 por dia a Meta precisa concentrar
entrega: mais criativo com a mesma verba é menos aprendizado em cada um.

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

## Cole a partir daqui

Preciso produzir 3 criativos de anúncio para Meta Ads usando o MCP do
Higgsfield. O projeto está em `C:\Users\GouveiaRx\Downloads\Port Edu` e a
especificação completa em `kit-meta-ads/criativos.md`. Leia esse arquivo antes
de começar.

**Contexto:** anúncio de software sob medida para donos de PME brasileiros.
Marca EDevsHub. Tom seco e direto, sem entusiasmo de vendedor, sem promessa de
enriquecimento.

**Restrições que não se negociam:**

1. **Nenhuma pessoa nas peças.** Sem apresentador, sem avatar, sem rosto
   gerado por IA. O produto é a prova.
2. **Não gere interface de software.** As telas são prints reais de sistemas
   entregues e estão no repositório. Gerar uma tela falsa seria fabricar prova.
   Use os arquivos:
   - `public/images/lp/rei-painel.webp` (painel de gestão de obras)
   - `public/images/projects/covers/mudapaisagens.webp` (fluxo de qualificação)
3. **Não invente número nenhum.** Os únicos números permitidos são os que estão
   na especificação.
4. **Paleta:** fundo `#0a0c0b`, texto `#e8efec`, destaque único `#3fcf7f`.
   Nenhuma outra cor de destaque.

**O que gerar:**

- **Vídeos 1 e 2:** 15 segundos, 9:16, a partir dos prints reais. O movimento
  deve ser contido: aproximação lenta, entrada suave, destaque em região da
  tela. Nada de transição chamativa, partícula, brilho pulsante ou zoom
  agressivo. Texto queimado na tela seguindo o roteiro tempo a tempo da
  especificação, fonte pesada e alto contraste, legível em tela de celular.
- **Locução:** voz feminina ou masculina em PT-BR, tom informativo, ritmo
  calmo. O texto está na especificação. O vídeo tem que funcionar mudo mesmo
  assim.
- **Estático 3:** uma arte, exportada em 4:5 e 1:1.
- Exporte também os vídeos em 4:5, porque nem todo posicionamento aceita 9:16.

**Entrega:** salve tudo em `kit-meta-ads/criativos/` com nomes claros
(`c1-lead-22h-9x16.mp4`, `c1-lead-22h-4x5.mp4`, `c3-prova-4x5.png` e assim por
diante). Me diga o que foi gerado e o que não deu certo.

**Antes de gerar em lote:** faça só o criativo 1 em 9:16, me mostre, e espere
eu aprovar. Errar o tom em três peças custa três vezes mais caro que errar em
uma.

## Cole até aqui

---

## Depois de prontos

1. Assista cada vídeo **com o som desligado** e no celular. Se não der para
   entender a oferta assim, volta.
2. Confira que os 2 primeiros segundos têm a frase de abertura, sem logo nem
   vinheta na frente.
3. Suba os 3 num único conjunto de anúncios, com o mesmo público. Deixe a Meta
   distribuir: ela acha o vencedor mais rápido que você.
4. Não julgue antes de **50 cliques por criativo**. Abaixo disso é ruído.
