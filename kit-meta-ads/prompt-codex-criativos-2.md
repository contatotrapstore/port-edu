# Prompt para o Codex — revisar C3/C4 e criar um terceiro conceito

O C3 e o C4 já existem e já passaram nas conferências. Este prompt pede duas
coisas: uma revisão crítica deles, e um conceito novo que ataque o problema que
o primeiro teste revelou.

---

## Cole a partir daqui

Você já trabalhou nestes criativos antes. O contexto mudou, e preciso da sua
análise antes de produzir.

Projeto em `C:\Users\GouveiaRx\Downloads\Port Edu`.

### O que aconteceu desde a sua última rodada

1. A campanha de **Tráfego** gastou R$ 56 e trouxe **zero** conversas. 91% do
   tráfego veio do Reels do Instagram, com CTR de 6,7%: toque por impulso.
2. Trocamos para **Mensagens** (clique para WhatsApp). Em 21 horas: 4 conversas
   por R$ 25. Mas o Eduardo avaliou **as quatro como irrelevantes**, gente
   aleatória. Uma causa provável: a mensagem pronta fazia um segundo toque
   virar "conversa".
3. **Os preços do site estavam errados** e foram corrigidos. Os reais, agora em
   `src/lib/constants.ts` (`offers`):
   - Sistema ou app sob medida: **a partir de R$ 5 mil**, 2 a 4 semanas (a
     maioria fica entre 5 e 12 mil). É o que os anúncios vendem.
   - Atendimento com IA no WhatsApp: a partir de R$ 12 mil, 2 a 4 semanas.
   - Integração entre sistemas: a partir de R$ 3 mil, 2 a 6 semanas.
   - Piso geral: abaixo de R$ 3 mil, o Eduardo diz não.
4. Já existem, prontos e verificados, em `kit-meta-ads/criativos/`:
   - `c3-sistema-dor-{4x5,1x1,9x16}.png` — gancho "Sua operação cresceu. Seus
     sistemas, não."
   - `c4-sistema-prova-{4x5,1x1,9x16}.png` — gancho "176 sistemas entregues. 37
     clientes voltaram a me contratar."
   Os dois fecham com "Sistema ou app sob medida para o jeito que você
   trabalha · A partir de R$ 5 mil · 2 a 4 semanas".

### Leia antes de responder

- `kit-meta-ads/criativos/VEREDITO.md` — sua análise anterior
- `kit-meta-ads/criativos/template-estatico.html` e `render-estaticos.cjs` — a
  produção por código, com as conferências
- `kit-meta-ads/campanha.md` — verba, público e pontos de decisão
- `src/app/contratar/page.tsx` e `src/lib/constants.ts` — a página e os preços
- Abra os PNGs do C3 e do C4 e olhe de verdade

### Fase 1 — análise

Escreva em `kit-meta-ads/criativos/VEREDITO.md`, acrescentando uma seção nova
sem apagar o histórico:

1. **O C3 e o C4 resistem ao diagnóstico?** Os leads vieram aleatórios. Olhando
   as duas peças e a copy delas, o que atrai quem não é comprador? Seja
   específico: qual palavra, qual promessa.
2. **Falta dizer para quem é.** Nenhum dos dois nomeia o comprador. Um dono de
   PME com equipe e operação real não se reconhece mais do que um curioso.
   Isso é corrigível no criativo ou só no público?
3. **O preço filtra o suficiente?** R$ 5 mil aparece na arte e na copy. Se não
   está filtrando, por quê.
4. **Vídeo agora vale?** Você adiou na rodada anterior com motivos concretos.
   Com Mensagens como objetivo e a entrega migrando para o Feed do Facebook,
   sua conclusão muda?
5. **Veredito:** o que produzir, e por quê.

### Fase 2 — produzir o conceito 5

Um conceito novo, **C5**, com um ângulo que falta: **nomear o comprador e a
situação concreta**, em vez de descrever a dor no abstrato.

Sugestão de direção, que você pode contestar com argumento: uma peça que diga
para quem é antes de dizer o que é. O Eduardo vende para dono ou gestor de PME
com equipe, operação rodando e processo na mão ou em planilha.

Regras que continuam valendo, e não entram na análise:

1. **Nenhuma pessoa** nas peças: sem rosto, apresentador ou avatar.
2. **Nenhuma interface gerada.** Se usar tela, é print real do repositório.
3. **Nenhum número inventado.** Só 176 sistemas entregues, 4,74 em 179
   avaliações, 37 clientes recorrentes, e os preços e prazos de `offers`.
4. Paleta `#0a0c0b`, `#e8efec`, `#3fcf7f`, e nada mais.

**Produza por código**, pelo `template-estatico.html` e pelo
`render-estaticos.cjs`, como na rodada anterior: 1080 de largura, três
proporções, zero crédito do Higgsfield. Rode o script e só entregue o que
passar em todas as conferências, inclusive a revisão visual, que as asserções
não fazem.

Atenção a uma armadilha que já mordeu: a regra CSS das linhas verdes lista os
conceitos um a um (`[data-concept="c2"]`, `[data-concept="c4"]`). Um conceito
novo com título de duas partes precisa entrar nessa lista, senão herda o corpo
do título grande e transborda.

### Entrega

- os três arquivos do C5, nomeados no padrão dos outros
- a copy completa do C5 para o Gerenciador: texto principal e título
- no `VEREDITO.md`: as medições, o que mudou em relação ao C3 e ao C4, e o que
  você não conseguiu fazer

Não suba nada para a Meta e não publique.

## Cole até aqui
