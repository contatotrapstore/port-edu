# Kit de captação orgânica

Preparado em 21/09/2026. O trabalho de orgânico usa o portfólio e as páginas de serviços; as campanhas de `/contratar` continuam com escopo separado.

## Entregas

- Serviços: `/servicos`, `/servicos/sistemas-sob-medida`, `/servicos/integracoes-e-automacoes` e `/servicos/desenvolvimento-saas`.
- Três cases aprofundados com fluxos, planejamento de um projeto semelhante, imagens explicadas e links relacionados, em português e inglês. Eduardo confirmou em 21/09/2026 que fez todo o desenvolvimento dos projetos do portfólio; essa autoria já pode ser descrita nos textos.
- Sitemap sem datas artificiais; títulos EN descritivos; carregamento do vídeo restrito à home elegível.
- Atribuição de origem com `utm_source`, `utm_medium`, `utm_campaign` e `utm_content`. Usar identificadores curtos e sem dados pessoais.
- Contexto de prospecção ampliado em `../kit-workana/contexto-claude-workana.md`.
- [Três textos de publicação](publicacoes.md), com links de campanha.
- [Piloto visual](midia/piloto-muda-paisagens.png), usando fundo Higgsfield e captura original do projeto.
- [Prompts para as extensões](prompts-extensoes.md), para continuar as etapas que dependem de conta, dados ou informações do autor.

## Medição sem duplicar conversões

`workana_cta` mantém o evento de clique já existente. `workana_attribution` adiciona contexto ao mesmo clique, com `location` e uma string JSON chamada `attribution`. Não somar esses dois eventos como dois leads. `ver_case` e `scroll_depth` também usam atribuição compacta para caber no limite de propriedades do plano Vercel Pro.

A captura de entrada aceita até 64 caracteres por campo UTM. No evento compacto, os tetos são: origem 32, campanha 40, peça 32, página inicial 48, mídia 16 e domínio de referência 32, respeitando 255 caracteres no JSON inteiro. Valores muito longos podem ser reduzidos; preferir nomes como os exemplos em `publicacoes.md`.

Search Console mede descoberta no Google. Eventos do site medem navegação e saída. Conversas qualificadas e contratos precisam de registro no funil. Esses três conjuntos não são equivalentes.

## Situação do Search Console

Em **21/09/2026**, a propriedade de domínio **`sc-domain:edevshub.com`** foi cadastrada e verificada pelo método **Provedor do nome de domínio**, com TXT no DNS da HostGator. O bloqueio anterior de acesso à propriedade foi resolvido. A visão geral exibe **dados em processamento**, com orientação para voltar em aproximadamente um dia. Cliques, impressões, CTR e posição continuam indisponíveis nesta execução; não foram tratados como zero nem houve comparativos ou exportações.

A inspeção da home `https://www.edevshub.com/` confirmou **“O URL está no Google” / “A página está indexada”**, com último rastreamento informado em **08/09/2026 às 11:16:10**. Portanto, a home já era conhecida pelo Google antes deste cadastro; sua indexação não é resultado de uma ação feita hoje. As demais URLs ainda não foram inspecionadas nesta etapa.

O envio de `https://www.edevshub.com/sitemap.xml` foi confirmado pelo painel. Na conferência final, o relatório ainda exibiu **“Não foi possível buscar o sitemap”**, tipo desconhecido e 0 URLs; esse zero pertence ao registro do sitemap, não a tráfego nem ao total de páginas do site. O teste ao vivo de **21/09/2026 às 15:23:28**, no horário exibido pelo painel, confirmou URL disponível para o Google, rastreamento permitido e busca com êxito. **Isso confirma acesso ao XML, não seu processamento como sitemap nem a indexação das URLs contidas nele.** A leitura do sitemap pelo relatório ainda não está confirmada. Não duplicar nem repetir o envio imediatamente; se a falha persistir e o diagnóstico/correção justificar, o mesmo sitemap pode ser reenviado conforme a [orientação do Google](https://support.google.com/webmasters/answer/7451001?hl=pt-BR). Não presumir erro no XML ou necessidade de alterar código.

Na verificação pública, o sitemap retornou HTTP 200, `application/xml` e XML válido com **54 URLs**; o robots permite o rastreamento e aponta para esse endereço. As nove URLs públicas examinadas anteriormente também responderam HTTP 200, com canonical próprio e `index,follow`. Esses sinais não substituem a inspeção do índice.

## Piloto e reprodução

Foi gerado apenas um fundo. A composição preserva o screenshot original e adiciona texto por código. Custo confirmado pela diferença de saldo Higgsfield: **1,25 crédito**. Execute `node kit-organico/gerar-piloto.mjs` para reproduzir o PNG a partir dos arquivos locais, sem nova geração.

Os outros dois textos podem ser publicados como texto com link. Novas peças visuais devem manter a mesma regra: sem pessoas, sem interface gerada e sem resultados numéricos inventados. A captura disponível serve para mostrar a estrutura do fluxo; seus rótulos pequenos não foram redesenhados para parecer mais legíveis.

## Próximos passos

1. Retomar a propriedade já verificada `sc-domain:edevshub.com` após o processamento indicado pelo Google, aproximadamente um dia na visão geral; conferir o sitemap existente e, na etapa de análise, inspecionar as demais URLs. Executar comparativos apenas com histórico suficiente, conforme o primeiro prompt. Nenhum acompanhamento foi agendado.
2. Preencher o funil Workana com histórico e datas de envio verificáveis, sem tratar a lista parcial como total do período.
3. Usar a autoria do desenvolvimento já confirmada para apresentar os três cases. Detalhar escopos e resultados quando útil, sem inventar métricas, design, branding, cronologia ou participação de terceiros; não pedir novamente comprovação genérica de autoria.
4. Definir o perfil social e o calendário; usar o prompt de publicação com os textos e o piloto aprovados. Nenhum post foi enviado ou agendado pela criação deste kit.

As páginas podem ajudar a explicar a oferta e ser descobertas por pesquisa. Não houve estimativa de volume de busca nem promessa de posição no Google.
