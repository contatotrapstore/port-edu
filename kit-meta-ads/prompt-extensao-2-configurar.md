# Configurar o Meta do zero — prompts para a extensão

Dois prompts, em ordem. O segundo só funciona depois que eu instalar o pixel,
porque a Meta só lista eventos que já viu acontecer.

Antes de começar, três coisas que **você** faz, não a extensão:

1. **Forma de pagamento.** A extensão não mexe com cartão. Depois que a conta
   nova existir, você entra em Configurações de pagamento e vincula o mesmo
   cartão que já está no portfólio.
2. **Verificação do negócio (CNPJ).** Exige upload de documento. O portfólio
   está sem razão social, endereço e telefone desde 2020. Não impede anunciar,
   mas limita o gasto e trava recursos justamente quando a campanha começa a
   funcionar.
3. **O rascunho não publicado.** Existe 1 na conta antiga. Não clique em
   "Conferir e publicar" sem antes abrir e ver o que é.

---

# PROMPT 1 — criar a estrutura

Cole no Business Suite logado.

## Cole a partir daqui

Você está logado no Meta Business Suite da minha conta. Vamos configurar a
estrutura para anunciar. Trabalhe **apenas dentro do portfólio "Eduardo
Gouveia" (ID 287611329178059)** — os outros três portfólios são de clientes e
não devem ser tocados.

**Proibido, em qualquer etapa:**
- publicar, ativar ou duplicar campanha, conjunto ou anúncio
- tocar no rascunho não publicado que existe na conta "Dudu"
- excluir ou desativar a conta "Dudu" (act_1515926913536871) ou o dataset
  "Clinafy One miliiasss" — eles ficam parados, não saem
- cadastrar, alterar ou remover forma de pagamento
- alterar limite de gastos
- enviar documento para verificação do negócio

Se alguma etapa exigir uma dessas coisas, **pare e me avise** em vez de
executar. A Meta muda nome e lugar de menu com frequência: se um caminho não
existir como descrito, procure o equivalente, me diga onde achou e siga. Não
invente — se não achar, escreva "NÃO ENCONTREI" naquele item.

### Etapa 1 — verificar o domínio

Configurações do negócio > Central de proteção da marca > Domínios >
`edevshub.com` (ID 1709954177642876).

A meta-tag já está publicada em www.edevshub.com. Clique em **Verificar
domínio** e me diga o resultado. Se falhar, copie a mensagem de erro exata.

Se der certo, confirme que o status virou "Verificado".

### Etapa 2 — criar a conta de anúncios em BRL e Brasília

Configurações do negócio > Contas > Contas de anúncios > Adicionar > **Criar
uma nova conta de anúncios**.

- Nome da conta: `EDevsHub - BR`
- Fuso horário: `(GMT-03:00) America/Sao_Paulo` (Brasília)
- Moeda: `BRL - Real brasileiro`

**Confira os três campos duas vezes antes de confirmar.** Moeda e fuso não
podem ser alterados depois que a conta é criada; só criando outra.

Quando perguntar para quem você está anunciando, escolha a própria empresa
(o portfólio Eduardo Gouveia), não um cliente.

Depois de criada, me dê o ID (`act_...`) e confirme moeda e fuso na tela.

### Etapa 3 — criar o dataset limpo

Gerenciador de Eventos > Conectar fontes de dados > **Web**.

- Nome: `edevshub.com`
- Site: `https://www.edevshub.com`
- Quando oferecer método de configuração, escolha a opção de **instalar o
  código manualmente** (eu já instalei no site). Não use integração de
  parceiro e não instale nada por ferramenta externa.

Se ele insistir em validar a instalação agora, pode pular: o pixel só começa a
disparar quando eu colocar o ID no site, o que é o passo seguinte.

Me dê o **ID do dataset** (15 a 16 dígitos).

### Etapa 4 — ligar o dataset à conta nova

No dataset recém-criado > Configurações (ou "Ativos atribuídos") > atribua a
conta `EDevsHub - BR` criada na etapa 2, com permissão total.

Confirme que ficou atribuído.

### Etapa 5 — relatório

```
1. Domínio edevshub.com: verificado / falhou (erro: ...)
2. Conta nova: EDevsHub - BR · act_<id> · moeda <x> · fuso <y>
3. Dataset novo: edevshub.com · ID <id>
4. Dataset atribuído à conta nova: sim / não
5. O que eu NÃO consegui fazer, e por quê:
6. O que eu parei de fazer porque exigia autorização:
```

## Cole até aqui

---

## O que eu faço quando você me mandar isso

Coloco o Dataset ID no site e publico. A partir daí o pixel começa a registrar
`PageView` e o evento `Contact` (clique no WhatsApp). Aí vale o prompt 2.

---

# PROMPT 2 — priorizar os eventos

**Só depois** que eu confirmar que o pixel está no ar, e depois de você abrir
www.edevshub.com/contratar no celular e clicar no botão do WhatsApp uma vez.
Esse clique é o que faz a Meta enxergar o evento e passar a listá-lo.

## Cole a partir daqui

Você está logado no Meta Business Suite. Trabalhe apenas no portfólio "Eduardo
Gouveia" e no dataset `edevshub.com`.

Continuam proibidos: publicar ou ativar qualquer campanha, tocar no rascunho
não publicado, mexer em pagamento ou em limite de gastos.

### Etapa 1 — confirmar que os eventos chegaram

Gerenciador de Eventos > dataset `edevshub.com` > Visão geral.

Me diga quais eventos apareceram nas últimas 24h e quantos de cada. Espero ver
`PageView` e pelo menos um `Contact`. Se não houver nenhum, **pare aqui** e me
avise: significa que o pixel não está disparando e não adianta configurar o
resto.

Se aparecer aviso de qualidade do evento ou de correspondência, copie o texto.

### Etapa 2 — configurar os eventos priorizados

Gerenciador de Eventos > Configuração de eventos da Web (Aggregated Event
Measurement) > domínio `edevshub.com` > Gerenciar eventos.

Configure nesta ordem exata, da maior para a menor prioridade:

1. `Contact`
2. `PageView`

`Contact` fica em primeiro porque é a conversa no WhatsApp, que é o que o
anúncio precisa otimizar. Se a Meta oferecer marcar um evento como "valor" ou
pedir otimização por valor, **não marque**: não há valor monetário atribuído a
esses eventos e isso distorceria a entrega.

Salve e me confirme a ordem final que ficou gravada.

### Etapa 3 — relatório

```
1. Eventos nas últimas 24h: PageView <n> · Contact <n> · outros <quais>
2. Avisos de qualidade: nenhum / <texto>
3. Eventos priorizados gravados, em ordem: 1. ... 2. ...
4. O que não consegui fazer, e por quê:
```

## Cole até aqui

---

# Depois disso, o que ainda falta

Nada mais de configuração. O que falta é conteúdo e decisão, e não é a
extensão que resolve:

- **Criativos.** Nenhum existe. Meta precisa de imagem ou vídeo mais texto.
- **Público.** Meta não tem intenção de busca como o Google: você escolhe
  interesse e comportamento, e isso precisa ser desenhado antes de subir
  campanha.
- **Verba.** R$ 500 por mês é pouco para o algoritmo sair da fase de
  aprendizado, que precisa de volume de conversão para calibrar.
- **A primeira conversa.** O portão do plano pedia pelo menos 3 conversas
  qualificadas vindas de fora da Workana antes de gastar. Mandar o link de
  /contratar para quem já te procura responde isso em dias, de graça, e diz se
  a página converte antes de você pagar para descobrir.
