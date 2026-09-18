# Prompt 4 — por que o dataset diz "nenhum evento"

## O que já está provado

Capturei a requisição em produção, em 17/09:

```
GET https://www.facebook.com/tr/?id=2514954938991781&ev=PageView&dl=...  → 200
GET https://www.facebook.com/tr/?id=2514954938991781&ev=Contact
    &cd[content_name]=contratar_topo&cd[channel]=whatsapp&...            → 200
POST https://www.facebook.com/tr/  ev=SubscribedButtonClick               → 200
```

O ID é o novo, os eventos têm os nomes certos, os parâmetros vão junto e a
Meta responde 200. Também aparece `fbc=fb.1...` com o `fbclid`, ou seja, a
atribuição de clique de anúncio está sendo capturada.

Isso descarta três das hipóteses: não é ID antigo, não é variável de ambiente
que não subiu (não existe variável — o ID está literal no código) e não é falta
de `fbq('init')`.

## A hipótese que falta, e é a mais provável

**Meus testes saem de um navegador automatizado (Playwright).** A Meta
responde 200 para qualquer requisição bem formada, mas descarta no servidor o
que identifica como tráfego automatizado. Ou seja: eu provei que *o site envia
certo*, mas não provo que *a Meta aceita e registra*.

Só um navegador real resolve isso. É o teste abaixo, e ele é manual de
propósito — a extensão também roda dentro de automação.

A segunda hipótese é simples atraso: o dataset foi criado hoje, e o gráfico de
"Visão geral" agrega com alguns minutos de defasagem. A aba **Testar eventos**
não tem esse atraso, mostra em tempo real, e é por isso que o teste usa ela.

---

# TESTE MANUAL — 3 minutos, você faz

Não dá para delegar: o ponto é justamente ser um navegador de gente.

1. Abra o **Gerenciador de Eventos** > dataset `edevshub.com` > aba
   **Testar eventos**.
2. Deixe essa aba aberta.
3. **No mesmo navegador**, abra outra aba em:
   `https://www.edevshub.com/contratar?fbclid=TESTE_MANUAL`
4. Role a página até o fim e volte.
5. Clique em **Falar no WhatsApp agora**. Pode fechar o WhatsApp que abrir.
6. Volte para a aba do Testar eventos.

**O que deve aparecer, em segundos:** `PageView`, `Contact` e
`SubscribedButtonClick`, com o navegador identificado.

- **Apareceu** → o pixel está perfeito. Era só atraso do painel mais o meu
  tráfego automatizado sendo descartado. Pode seguir para o AEM.
- **Não apareceu nada** → aí sim existe bloqueio real. Verifique se você tem
  bloqueador de anúncio, uBlock, Privacy Badger ou DNS de bloqueio ativo: eles
  impedem o pixel de sair do SEU navegador. Teste de novo numa janela anônima
  com as extensões desligadas, ou pelo celular na rede móvel.

Me diga qual dos dois aconteceu.

---

# A tela do AEM em branco

A descrição da extensão (redireciona para `eventsmanager.facebook.com`, título
nunca é definido, nada é pintado, 40 segundos) é o sintoma clássico de
**extensão do navegador bloqueando o domínio**, não de conta sem permissão.
No print da sessão dá para ver bastante extensão instalada.

Ordem de tentativa, da mais barata para a mais cara:

1. **Janela anônima com extensões desligadas**, logado na Meta. Resolve na
   maioria das vezes.
2. **Outro navegador** (Edge, Firefox).
3. **URL direta:**
   `https://www.facebook.com/events_manager2/aggregated_event_measurement`
4. Se nenhuma funcionar, é problema do lado da Meta e vale abrir suporte pelo
   próprio Business Suite.

**Isso não bloqueia nada agora.** O AEM só lista evento que o pixel já enviou:
com zero evento registrado, mesmo a tela abrindo viria vazia. A ordem certa é
confirmar o evento chegando primeiro, e só depois priorizar — que é
exatamente o que a extensão concluiu, e está certa.

---

# PROMPT PARA A EXTENSÃO — só depois do teste manual dar certo

## Cole a partir daqui

Você está logado no Meta Business Suite. Trabalhe apenas no portfólio "Eduardo
Gouveia" (287611329178059) e no dataset `edevshub.com` (2514954938991781).

Continuam proibidos: publicar, ativar ou pausar campanha, tocar no rascunho não
publicado da conta Dudu, mexer em forma de pagamento ou limite de gastos,
excluir conta ou dataset, e aceitar qualquer recomendação automática ou oferta
de parceiro.

**Etapa 1.** Gerenciador de Eventos > dataset `edevshub.com` > Visão geral.
Me diga quais eventos aparecem nas últimas 24h e quantos de cada. Se ainda
estiver zerado, pare e me avise — não adianta seguir.

**Etapa 2.** Configuração de eventos da Web (AEM) > domínio `edevshub.com` >
Gerenciar eventos. Configure nesta ordem exata:

1. `Contact`
2. `PageView`

Se `SubscribedButtonClick` aparecer na lista, deixe abaixo dos dois: ele é
automático da Meta e duplica o sinal do `Contact`.

Não marque nenhum evento como "valor" e não aceite otimização por valor: não
há valor monetário atribuído a esses eventos e isso distorceria a entrega.

Salve e me confirme a ordem gravada.

**Etapa 3.** Relatório:

```
1. Eventos em 24h: PageView <n> · Contact <n> · SubscribedButtonClick <n>
2. Ordem gravada: 1. ... 2. ... 3. ...
3. Avisos de qualidade: nenhum / <texto>
4. NÃO ENCONTREI: <itens>
```

## Cole até aqui
