# Prompt para o Codex — ajustes e produção dos estáticos

Segunda rodada. O veredito da primeira foi aprovado com duas mudanças: a linha
da oferta e a forma de produzir. Cole o bloco abaixo no Codex.

---

## Cole a partir daqui

Seu veredito em `kit-meta-ads/criativos/VEREDITO.md` foi aprovado: dois
estáticos, dor contra prova, mesma oferta nos dois, sem pessoa, sem interface.
A metodologia de fixar a oferta e variar só a abordagem foi o ponto mais forte
da análise, mantenha.

Duas mudanças antes de produzir.

### Mudança 1 — a linha da oferta

Troque **"Integração sob medida"** por **"Integração entre os sistemas que
você já usa"** em tudo: arte e copy.

Motivo: "sob medida" não diz o que acontece, e essa oferta já tinha sido
renomeada no site por esse motivo. A versão nova é exatamente o nome que a
pessoa lê na landing depois do clique (`offers` em `src/lib/constants.ts`),
então ela também atende o critério de continuidade que você mesmo usou.

No **título** do anúncio, que tem uns 40 caracteres úteis, a linha inteira não
cabe. Use **"Integre os sistemas que você já usa"**.

### Mudança 2 — produzir por código, não pelo Higgsfield

Estático que é só texto sobre fundo liso não precisa de gerador de imagem. As
limitações que você reportou com honestidade vêm justamente daí: 896×1120 em
vez de 1080×1350, fundo `#060909` em vez de `#0a0c0b`, fonte "parecida com"
Space Grotesk. Renderizando HTML num navegador headless, cor e resolução saem
exatas, a fonte é a Space Grotesk real da landing, acento nunca erra, e cada
variação custa zero crédito.

**Não gaste crédito do Higgsfield nesta rodada.**

O template está em `kit-meta-ads/criativos/template-estatico.html` e já
renderiza o C1 corretamente em 4:5. A referência do resultado esperado está em
`kit-meta-ads/criativos/c1-referencia-codigo-4x5.png`.

**Como renderizar:** Playwright ou Puppeteer, viewport exatamente do tamanho
da peça, esperar `document.fonts.ready` antes do screenshot, capturar o
elemento `#art`. Não existe navegador headless nas dependências do projeto.
Atenção a um problema conhecido desta máquina: `npx` falha quando executado a
partir de caminho com espaço (`Port Edu`). Instale e rode a ferramenta de
renderização num diretório temporário sem espaço no caminho, apontando para os
arquivos do projeto por caminho absoluto. **Não adicione dependência ao
`package.json` do site.**

Se preferir, transforme o template num script parametrizado (texto e
proporção como parâmetros) salvo em `kit-meta-ads/criativos/`, para as próximas
rodadas serem um comando só.

### O que produzir — 6 arquivos

| Arquivo | Tamanho |
|---|---|
| `c1-operacao-cresceu-4x5.png` | 1080 × 1350 |
| `c1-operacao-cresceu-1x1.png` | 1080 × 1080 |
| `c1-operacao-cresceu-9x16.png` | 1080 × 1920 |
| `c2-prova-4x5.png` | 1080 × 1350 |
| `c2-prova-1x1.png` | 1080 × 1080 |
| `c2-prova-9x16.png` | 1080 × 1920 |

O `c1-operacao-cresceu-4x5.png` gerado pelo Higgsfield na rodada anterior será
substituído. Renomeie o antigo para `c1-operacao-cresceu-4x5-higgsfield.png`
em vez de apagar, para ficar o registro da comparação.

**C1 — texto:**

- Título, 4 linhas: "Sua operação" / "cresceu." em `#e8efec`; "Seus
  sistemas," / "não." em `#3fcf7f`
- Oferta: "Integração entre os sistemas" / "que você já usa"
- Preço: "A partir de R$ 6 mil"
- Filete verde, depois a assinatura "Eduardo Gouveia · EDevsHub"

**C2 — texto:**

- Título: "176 sistemas entregues." em `#e8efec`
- Segunda linha de destaque: "37 clientes voltaram a me contratar." em
  `#3fcf7f`
- Oferta, preço, filete e assinatura **idênticos ao C1**, no mesmo lugar.

A oferta, o preço e a assinatura precisam estar na mesma posição e no mesmo
tamanho nos dois criativos. Se só o bloco de cima muda, a diferença de
desempenho vai ser do gancho, que é o que o teste quer medir.

### Cuidado com cada proporção

Não é só trocar a altura do canvas.

- **1:1:** o conteúdo do 4:5 não cabe em 1080 de altura com a mesma escala.
  Reduza o corpo proporcionalmente até caber com a mesma margem lateral, sem
  quebrar o título em mais linhas.
- **9:16:** a interface do Stories e do Reels cobre o topo e a base. Use a
  margem que você mesmo propôs: nada de texto nos primeiros 14% (269 px) nem
  nos últimos 35% (672 px), e 6% (65 px) nas laterais. O conteúdo inteiro vive
  entre y = 269 e y = 1248. A área fora disso fica só com o fundo.
- Em todas: **título sem quebra de palavra.** Se uma linha não couber, reduza
  a fonte, não deixe o navegador quebrar "sistemas," no meio da frase.

### Conferência obrigatória antes de entregar

Para cada um dos 6 arquivos, meça e registre:

1. Dimensões exatas em pixels
2. Cor de um pixel do fundo: tem que ser `#0a0c0b`
3. Nenhum texto transbordando o canvas nem, no 9:16, fora da área segura
4. Número de linhas do título igual ao previsto
5. Legibilidade reduzindo a peça para 360 px de largura, que é o tamanho real
   num celular: oferta e preço precisam ser lidos sem esforço

`sharp` já existe em `node_modules` e serve para medir dimensão e cor.

Se algum item falhar, corrija e meça de novo. Não entregue arquivo que não
passou.

### Atualize o VEREDITO.md

- Substitua a copy de C1 e C2 com a oferta nova. Texto principal, título
  ("Integre os sistemas que você já usa") e descrição ("Escopo, prazo e valor
  por escrito").
- Lista dos 6 arquivos com o resultado das 5 conferências de cada um.
- Uma seção curta comparando a peça do Higgsfield com a renderizada: o que
  melhorou, e se alguma coisa piorou.
- Mantenha as seções de análise da primeira rodada; acrescente, não apague.

### Limites que continuam valendo

Nenhuma pessoa, nenhuma interface de software, nenhum número além de 176
sistemas entregues e 37 clientes recorrentes. Paleta `#0a0c0b`, `#e8efec`,
`#3fcf7f` e nenhuma outra cor de destaque. Não suba nada para o Meta e não
publique anúncio: esta tarefa termina nos arquivos.

### Entrega

Me diga os 6 arquivos gerados, o resultado das conferências, o que precisou
de ajuste e qualquer coisa que o Eduardo precise saber antes de subir as
peças.

## Cole até aqui
