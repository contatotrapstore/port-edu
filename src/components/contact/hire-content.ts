import { offers, workanaProfile as stats } from "@/lib/constants";
import type { Locale } from "@/lib/locale";

/**
 * Conteúdo da página de contratação no design novo. Em português, o mesmo
 * texto publicado hoje em src/app/contratar/page.tsx (necessidades, ofertas,
 * cases, trechos de avaliação, etapas, recusas e perguntas); em inglês, a
 * tradução. Valores e prazos vêm de `offers`, aprovados pelo Eduardo.
 *
 * Enquanto a variável EDH_NEW_SITE existir, a versão antiga da página continua
 * com o próprio texto: ao mudar uma das duas, mudar a outra. Depois da
 * ativação definitiva, a versão antiga pode ser removida.
 */

type Offer = { id: string; name: string; promise: string; scope: readonly string[]; notFor: string; range: string; term: string };

const offersEN: Record<string, Omit<Offer, "id">> = {
  "sistema-sob-medida": {
    name: "Custom website, app, platform or system",
    promise: "Development of a new project or improvement of what you already have. The proposal defines what will be delivered, how much it costs and the timeline.",
    scope: [
      "Corporate websites, landing pages and online stores",
      "Apps, platforms and systems with the features defined in the scope",
      "Customer areas, dashboards, payments and integrations when planned",
      "Improvements, new features and fixes in existing projects",
      "Release, documentation and guidance on how to use what was delivered",
    ],
    notFor: "anyone looking for an off-the-shelf subscription product instead of hiring development",
    range: "from R$ 3,000 (BRL)",
    term: "timeline defined after the scope",
  },
  "automacao-ia": {
    name: "AI customer service and lead qualification",
    promise: "Your WhatsApp answers, qualifies and records the lead in the CRM you already use, without depending on someone being online.",
    scope: [
      "Integration with WhatsApp and the tools defined in the scope",
      "AI agent with your business knowledge base",
      "Qualification through structured questions and handoff to a person",
      "Automatic records in the CRM (Pipefy, RD, HubSpot or a spreadsheet)",
      "Dashboard to follow the conversations",
    ],
    notFor: "anyone who fits a ready-made platform at R$ 300 to 900 per month and doesn’t need to integrate with their own system",
    range: "from R$ 12,000 (BRL)",
    term: "estimated 2 to 4 weeks, depending on scope",
  },
  integracoes: {
    name: "Integration between the systems you already use",
    promise: "ERP, CRM, scheduling and payments stop living in separate tabs, and a single dashboard starts showing the whole operation.",
    scope: [
      "Integration between ERP, CRM, marketplace, scheduling, payments and invoicing",
      "Dashboard with the metrics and controls the operation needs",
      "Business rules, permissions and access roles",
      "Data import and export, reports and documents",
    ],
    notFor: "connecting tools without authorized access or without evaluating the integration options",
    range: "from R$ 3,000 (BRL)",
    term: "estimated 2 to 6 weeks, depending on scope",
  },
};

const pt = {
  title: "Desenvolvimento de sites, apps e sistemas sob medida",
  description: `Contrate o desenvolvimento do seu site, app, plataforma ou sistema. Projetos a partir de R$ 3 mil, com escopo, prazo e valor definidos antes de começar. ${stats.projectsCompleted} projetos realizados na Workana, nota ${stats.rating.toLocaleString("pt-BR")} em ${stats.clientReviews} avaliações.`,
  navAnchor: "O que eu construo",
  heroTitle: ["Seu site, app ou sistema.", "Desenvolvido sob medida."],
  heroLede: {
    before: "Para começar um projeto ou melhorar o que você já tem. Definimos as funções essenciais da primeira entrega e as próximas etapas. Projetos a partir de ",
    price: "R$ 3 mil",
    after: ", conforme o escopo, com prazo e valor combinados por escrito.",
  },
  proof: `${stats.projectsCompleted} projetos realizados na Workana, nota ${stats.rating.toLocaleString("pt-BR")} em ${stats.clientReviews} avaliações`,
  proofDate: `Dados do perfil conferidos em ${stats.verifiedAtLabel}`,
  heroAlt: "Rei: gestão de obras telecom com etapas e SLAs",
  heroCaption: "Sistema desenvolvido para a Rei Sol Infraestrutura: obras com etapas, responsáveis e prazos. Um exemplo do que posso construir para seu projeto.",
  needsTitle: "O que você precisa criar ou melhorar?",
  needs: [
    { t: "Preciso de um site para meu negócio", d: "Site institucional, landing page ou loja virtual. Páginas que apresentam sua oferta e permitem ao visitante pedir um orçamento ou comprar." },
    { t: "Quero desenvolver um app ou plataforma", d: "Um produto novo, uma área para clientes ou um sistema interno. Definimos as funções da primeira versão e o que pode ficar para uma próxima etapa." },
    { t: "Quero melhorar o que já está funcionando", d: "Novas funções, correções ou integração entre ferramentas. Primeiro avalio o projeto existente e o que precisa mudar." },
  ],
  offersTitle: "Desenvolvimento, integrações e automação",
  offersNote: "O ponto de partida é uma entrega que você possa usar. Escolhemos juntos as funções que resolvem a necessidade principal; as demais ficam em etapas com orçamento próprio.",
  notFor: "Não serve para",
  casesTitle: "Sites, apps e plataformas que desenvolvi",
  cases: [
    { id: "cacaostore", title: "Cacao Store", category: "Loja virtual em Shopify", image: "/images/projects/cacaostore-1.webp", width: 1280, height: 900, alt: "Página inicial da Cacao Store com navegação, busca e catálogo de produtos", description: "Loja personalizada para apresentar o catálogo e permitir compras online, com acesso pelo celular e computador.", features: ["Catálogo e checkout integrados", "Gestão de produtos e estoque pelo cliente"] },
    { id: "pace", title: "PACE", category: "Plataforma web para clínicas", image: "/images/projects/pace-5.webp", width: 1280, height: 671, alt: "Tela de protocolos do PACE, com busca, categorias e modelos de sessão", description: "Plataforma para organizar protocolos, conduzir sessões guiadas e acompanhar os pacientes.", features: ["Protocolos e sessões em um painel", "Acessos por perfil e relatórios clínicos"] },
    { id: "rei", title: "Rei Sol Infraestrutura", category: "Sistema de gestão de obras", image: "/images/lp/rei-painel.webp", width: 830, height: 517, alt: "Painel da Rei Sol com obras, andamento e detalhes de uma tarefa", description: "Sistema para acompanhar obras por etapas e organizar as responsabilidades da equipe.", features: ["Etapas, tarefas e responsáveis", "Prazos, dependências e notificações internas"] },
  ],
  casesNote: "Telas reais de projetos desenvolvidos por Eduardo Gouveia. Cada case teve seu próprio escopo; o investimento do seu projeto será definido pelas funções e integrações necessárias.",
  quotesTitle: "O que dizem os clientes que já pagaram por isso",
  // Trecho, não resumo: cada recorte sai palavra por palavra da avaliação original.
  quotes: [
    { author: "Fernando Esteves", text: "Tenho mais de 20 anos trabalhando com projetos web e poucas vezes encontrei profissionais como Eduardo." },
    { author: "Useconvoo", text: "Demonstrou domínio total de infraestrutura e agilidade para resolver problemas complexos de sincronia de ambientes e performance." },
    { author: "Arthur Versolato", text: "Entendeu rápido o que estávamos precisando e propôs boas melhorias ao projeto." },
  ],
  quotesNote: "Avaliações verificadas na Workana, onde o cliente só avalia depois de pagar.",
  quotesLang: "",
  stepsTitle: "Do pedido de orçamento à entrega do projeto",
  steps: [
    { t: "Você conta o que quer desenvolver", d: "Alinhamos a necessidade, o investimento e as funções essenciais da primeira entrega." },
    { t: "Recebe escopo, prazo e valor por escrito", d: "Com o que entra nesta etapa, os critérios de aceite e o que pode vir depois." },
    { t: "Acompanha a construção", d: "Você acompanha as etapas e valida as entregas combinadas na proposta." },
    { t: "Recebe e começa a usar", d: "Documentação e orientação gravada. Suporte e evolução seguem as condições da proposta." },
  ],
  noTitle: "Quando eu digo não",
  no: [
    "orçamento abaixo de R$ 3 mil",
    "pedido sem disponibilidade para alinhar o escopo e validar as entregas",
    "prazo que não comporta o desenvolvimento e a revisão do projeto",
  ],
  noNote: "Prefiro dizer isso na primeira mensagem a descobrir no meio do projeto.",
  faqLabel: "Perguntas frequentes",
  faq: [
    { q: "Quanto custa?", a: "O investimento começa em R$ 3 mil para escopos iniciais delimitados. Pode ser um site, uma melhoria ou uma integração, conforme a complexidade. Uma plataforma com várias funções recebe um orçamento próprio. Definimos o que entra na primeira entrega e estimamos as próximas etapas separadamente. Atendimento com IA no WhatsApp começa em R$ 12 mil." },
    { q: "O que entra na primeira entrega?", a: "As funções essenciais para você usar ou colocar a solução em operação, combinadas na proposta. Antes de começar, você recebe a lista do que será desenvolvido, as integrações previstas e os critérios de aceite. Funcionalidades futuras são avaliadas e orçadas à parte." },
    { q: "Quanto tempo leva?", a: "O prazo de sites, apps, plataformas e sistemas depende do escopo e fica definido na proposta. Atendimento com IA: estimativa de 2 a 4 semanas. Integração entre sistemas: estimativa de 2 a 6 semanas. As estimativas são confirmadas após a análise. Projetos maiores são divididos em fases." },
    { q: "Como funciona o pagamento?", a: "Contrato direto com nota fiscal e pagamento dividido em marcos combinados na proposta. Hospedagem, licenças e consumo de serviços externos são identificados separadamente, quando necessários ao projeto." },
    { q: "E se o escopo mudar no meio?", a: "Escopo, prazo e critério de aceite ficam escritos antes de eu começar. Mudança vira extensão com prazo e valor combinados, nunca um ajuste silencioso que estoura a entrega." },
    { q: "O que eu preciso ter pronto para começar?", a: "Conte o que quer criar ou melhorar, para quem é e qual investimento considera. Se tiver referências, um prazo desejado ou um projeto existente, envie também. Você não precisa ter equipe, telas prontas ou uma empresa já em operação para pedir um orçamento." },
    { q: "Como funciona depois da entrega?", a: `Entrego com documentação e orientação gravada. As condições de suporte e correção ficam na proposta; novas funções e manutenção contínua são combinadas separadamente. ${stats.recurringClients} clientes já me contrataram de novo.` },
  ],
  finalTitle: "Conte o que você quer criar ou melhorar",
  finalBody: "Conte o que precisa funcionar primeiro e qual investimento considera. Vamos definir uma entrega compatível com seu momento. Projetos a partir de R$ 3 mil, conforme o escopo; etapas seguintes são orçadas separadamente.",
  footerCases: "Projetos desenvolvidos",
  footerQuote: "Pedir orçamento",
  footerPrivacy: "Privacidade",
  topLabel: "EDevsHub, voltar ao início da página",
  offers: offers.map((offer) => ({ ...offer })) as Offer[],
};

type HireContent = typeof pt;

const en: HireContent = {
  title: "Custom website, app and system development",
  description: `Hire the development of your website, app, platform or system. Projects from R$ 3,000 (BRL), with scope, timeline and price defined before work starts. ${stats.projectsCompleted} projects completed on Workana, rated ${stats.rating} across ${stats.clientReviews} reviews.`,
  navAnchor: "What I build",
  heroTitle: ["Your website, app or system.", "Built to fit your business."],
  heroLede: {
    before: "To start a project or improve what you already have. We define the essential features of the first delivery and the next stages. Projects from ",
    price: "R$ 3,000 (BRL)",
    after: ", depending on scope, with timeline and price agreed in writing.",
  },
  proof: `${stats.projectsCompleted} projects completed on Workana, rated ${stats.rating} across ${stats.clientReviews} reviews`,
  proofDate: `Profile data checked on ${new Date(`${stats.verifiedAt}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}`,
  heroAlt: "Rei: telecom construction management with stages and SLAs",
  heroCaption: "System built for Rei Sol Infraestrutura: construction projects with stages, owners and deadlines. An example of what I can build for your project.",
  needsTitle: "What do you need to create or improve?",
  needs: [
    { t: "I need a website for my business", d: "A corporate website, landing page or online store. Pages that present your offer and let visitors request a quote or buy." },
    { t: "I want to build an app or platform", d: "A new product, a customer area or an internal system. We define the features of the first version and what can wait for a later stage." },
    { t: "I want to improve what is already running", d: "New features, fixes or integration between tools. First I assess the existing project and what needs to change." },
  ],
  offersTitle: "Development, integrations and automation",
  offersNote: "The starting point is a delivery you can use. Together we choose the features that solve the main need; the rest go into stages with their own budget.",
  notFor: "Not for",
  casesTitle: "Websites, apps and platforms I built",
  cases: [
    { ...pt.cases[0], category: "Shopify online store", alt: "Cacao Store home page with navigation, search and product catalog", description: "A custom store to present the catalog and sell online, on phones and computers.", features: ["Integrated catalog and checkout", "Products and stock managed by the client"] },
    { ...pt.cases[1], category: "Web platform for clinics", alt: "PACE protocols screen with search, categories and session templates", description: "A platform to organize protocols, run guided sessions and follow patients.", features: ["Protocols and sessions in one dashboard", "Role-based access and clinical reports"] },
    { ...pt.cases[2], category: "Construction management system", alt: "Rei Sol dashboard with projects, progress and task details", description: "A system to follow construction projects by stage and organize the team’s responsibilities.", features: ["Stages, tasks and owners", "Deadlines, dependencies and internal notifications"] },
  ],
  casesNote: "Real screens from projects developed by Eduardo Gouveia. Each case had its own scope; your project’s budget will be defined by the features and integrations it needs.",
  quotesTitle: "What clients who already paid for it say",
  quotes: pt.quotes,
  quotesNote: "Verified reviews on Workana, where clients can only review after paying.",
  quotesLang: "Excerpts kept in the original Portuguese.",
  stepsTitle: "From the quote request to the delivered project",
  steps: [
    { t: "You tell us what you want to build", d: "We align the need, the budget and the essential features of the first delivery." },
    { t: "You get scope, timeline and price in writing", d: "With what goes into this stage, the acceptance criteria and what can come later." },
    { t: "You follow the build", d: "You follow the stages and validate the deliveries agreed in the proposal." },
    { t: "You receive it and start using it", d: "Documentation and recorded guidance. Support and next stages follow the terms of the proposal." },
  ],
  noTitle: "When I say no",
  no: [
    "budgets below R$ 3,000 (BRL)",
    "requests without time to align the scope and validate the deliveries",
    "deadlines that don’t allow for the development and review of the project",
  ],
  noNote: "I’d rather say so in the first message than find out in the middle of the project.",
  faqLabel: "Frequently asked questions",
  faq: [
    { q: "How much does it cost?", a: "Projects start at R$ 3,000 (BRL) for well-defined initial scopes. That can be a website, an improvement or an integration, depending on complexity. A platform with several features gets its own quote. We define what goes into the first delivery and estimate the next stages separately. AI customer service on WhatsApp starts at R$ 12,000 (BRL)." },
    { q: "What goes into the first delivery?", a: "The essential features for you to use or put the solution into operation, agreed in the proposal. Before work starts, you receive the list of what will be developed, the planned integrations and the acceptance criteria. Future features are assessed and quoted separately." },
    { q: "How long does it take?", a: "The timeline for websites, apps, platforms and systems depends on the scope and is set in the proposal. AI customer service: estimated 2 to 4 weeks. Integration between systems: estimated 2 to 6 weeks. Estimates are confirmed after the assessment. Larger projects are split into phases." },
    { q: "How does payment work?", a: "A direct contract with an invoice, and payment split into milestones agreed in the proposal. Hosting, licenses and usage of external services are identified separately when the project needs them." },
    { q: "What if the scope changes along the way?", a: "Scope, timeline and acceptance criteria are written down before I start. A change becomes an extension with its own agreed timeline and price, never a silent adjustment that breaks the delivery." },
    { q: "What do I need to have ready to start?", a: "Tell us what you want to create or improve, who it is for and what budget you have in mind. If you have references, a target date or an existing project, send those too. You don’t need a team, finished screens or a company already in operation to ask for a quote." },
    { q: "What happens after delivery?", a: `I deliver with documentation and recorded guidance. Support and fix terms are set in the proposal; new features and ongoing maintenance are agreed separately. ${stats.recurringClients} clients have hired me more than once.` },
  ],
  finalTitle: "Tell us what you want to create or improve",
  finalBody: "Tell us what needs to work first and what budget you have in mind. We will define a delivery that fits where you are. Projects from R$ 3,000 (BRL), depending on scope; later stages are quoted separately.",
  footerCases: "Projects built",
  footerQuote: "Request a quote",
  footerPrivacy: "Privacy",
  topLabel: "EDevsHub, back to the top of the page",
  offers: offers.map((offer) => ({ id: offer.id, ...offersEN[offer.id] })),
};

export function getHireContent(locale: Locale): HireContent {
  return locale === "en" ? en : pt;
}
