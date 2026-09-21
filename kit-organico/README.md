# Kit de captação orgânica

Preparado em 21/09/2026. O trabalho de orgânico usa o portfólio e as páginas de serviços; as campanhas de `/contratar` continuam com escopo separado.

## Entregas

- Serviços: `/servicos`, `/servicos/sistemas-sob-medida`, `/servicos/integracoes-e-automacoes` e `/servicos/desenvolvimento-saas`.
- Três cases aprofundados com fluxos, planejamento de um projeto semelhante, imagens explicadas e links relacionados, em português e inglês. A participação individual só aparece quando confirmada nos dados do projeto.
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

## Piloto e reprodução

Foi gerado apenas um fundo. A composição preserva o screenshot original e adiciona texto por código. Custo confirmado pela diferença de saldo Higgsfield: **1,25 crédito**. Execute `node kit-organico/gerar-piloto.mjs` para reproduzir o PNG a partir dos arquivos locais, sem nova geração.

Os outros dois textos podem ser publicados como texto com link. Novas peças visuais devem manter a mesma regra: sem pessoas, sem interface gerada e sem resultados numéricos inventados. A captura disponível serve para mostrar a estrutura do fluxo; seus rótulos pequenos não foram redesenhados para parecer mais legíveis.

## Etapas que dependem de contexto externo

1. Abrir a propriedade correta do EDevsHub no Search Console e executar o primeiro prompt para obter dados reais, conferir o sitemap e inspecionar URLs.
2. Preencher o funil Workana com histórico e datas de envio verificáveis, sem tratar a lista parcial como total do período.
3. Confirmar a participação nos três cases antes de publicar afirmações específicas de autoria.
4. Definir o perfil social e o calendário; usar o prompt de publicação com os textos e o piloto aprovados. Nenhum post foi enviado ou agendado pela criação deste kit.

As páginas podem ajudar a explicar a oferta e ser descobertas por pesquisa. Não houve estimativa de volume de busca nem promessa de posição no Google.
