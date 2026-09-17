# Prompt para a extensão do Claude no navegador

Abra o Meta Business Suite logado, na aba do navegador onde a extensão do
Claude está ativa, e cole o texto abaixo. Ele só coleta informação: não cria
campanha, não gasta e não altera configuração.

Quando terminar, me mande a resposta inteira que ele devolver.

---

## Cole a partir daqui

Você está logado no Meta Business Suite da minha conta. Preciso que você
**apenas leia e me reporte** o estado atual — não crie campanha, não publique
anúncio, não altere configuração, não adicione forma de pagamento e não
aceite termos. Se qualquer passo exigir uma ação que mude alguma coisa, pare
e me diga exatamente o que seria alterado, sem executar.

A Meta muda o nome e o lugar dos menus com frequência. Se um caminho abaixo
não existir com esse nome, procure o equivalente, me diga onde encontrou e
siga. Se não achar de jeito nenhum, diga "NÃO ENCONTREI" para aquele item em
vez de inventar.

Levante os 7 itens:

**1. Portfólio empresarial (Business Portfolio)**
Em business.facebook.com/settings. Me diga o nome, o ID do portfólio, e se
está verificado ou não.

**2. Conta de anúncios**
Configurações do negócio > Contas > Contas de anúncios. Para cada conta:
nome, ID (começa com `act_`), moeda, fuso horário e status (ativa,
desabilitada, restrita). Se não existir nenhuma, diga isso claramente.

**3. Forma de pagamento**
Na conta de anúncios > Cobrança/Pagamentos. Só me diga SE existe um método
cadastrado e se há algum aviso ou pendência. **Não me mande número de cartão,
nem os últimos dígitos, nem dados bancários.**

**4. Dataset (o que antes se chamava Pixel)**
Gerenciador de Eventos (business.facebook.com/events_manager2) > Fontes de
dados. Para cada dataset: **nome e ID completo** (15 a 16 dígitos), a qual
conta de anúncios está atribuído, e se já recebeu algum evento (quando foi a
última atividade). Se não existir nenhum dataset, me diga qual é o botão
exato para criar um e pare aí.

**5. Verificação de domínio**
Configurações do negócio > Central de proteção da marca (ou "Brand safety") >
Domínios. Me diga se `edevshub.com` aparece na lista e qual o status
(verificado ou pendente).
 - Se JÁ estiver verificado: me diga por qual método.
 - Se NÃO estiver: abra o fluxo de adicionar domínio, escolha a opção de
   **meta-tag** e me copie **só o valor de dentro do `content="..."`** — é uma
   sequência de letras e números. Não conclua a verificação ainda, só me
   traga o valor.

**6. Eventos priorizados (Aggregated Event Measurement)**
Gerenciador de Eventos > Fontes de dados > selecione o dataset >
Configurações, ou o item "Configuração de eventos da Web". Me diga se há
eventos configurados hoje e, se houver, a lista em ordem de prioridade.
Só dá para configurar depois que o domínio está verificado — se estiver
bloqueado por isso, me diga.

**7. Restrições e avisos**
Qualidade da conta (business.facebook.com/accountquality). Me diga se há
alguma restrição, anúncio reprovado, aviso de política ou limite de gastos
ativo.

**Formato da resposta**
Uma linha por item, assim:

```
1. Portfólio: <nome> · ID <id> · verificado: sim/não
2. Conta de anúncios: <nome> · act_<id> · BRL · America/Sao_Paulo · ativa
3. Pagamento: existe / não existe · pendências: <quais>
4. Dataset: <nome> · ID <id> · atribuído a act_<id> · última atividade <quando>
5. Domínio edevshub.com: verificado / pendente / ausente
   Token da meta-tag: <valor> (só se não estiver verificado)
6. Eventos priorizados: <lista em ordem> / nenhum / bloqueado por domínio
7. Restrições: nenhuma / <descrição>
```

No fim, liste em uma frase cada item que ficou como NÃO ENCONTREI ou que
exigiria uma ação que eu preciso autorizar.

## Cole até aqui

---

## O que eu faço com a resposta

Dois valores vão direto para a Vercel e o site passa a rastrear conversão:

| Da resposta | Vai para |
|---|---|
| ID do dataset (item 4) | `NEXT_PUBLIC_META_PIXEL_ID` |
| Token da meta-tag (item 5) | `NEXT_PUBLIC_FB_DOMAIN_VERIFICATION` |

O resto serve para eu te dizer o que ainda falta antes de ligar verba.

## Por que não peço o token da Conversions API

A CAPI melhora a medição quando o navegador bloqueia o pixel, mas o token é
uma credencial de servidor: quem tem ele dispara evento em nome da sua conta.
Não vale pedir para uma extensão copiar isso de dentro do navegador, e ela não
é necessária para começar. Se depois a diferença de eventos justificar, a
gente monta a CAPI direito, com o token só na Vercel.
