import type { Locale } from "@/lib/locale";

/**
 * Copy da nova home de marca, em PT e EN.
 *
 * Fatos de projeto (problema, entrega, stack, ano) e números de prova NÃO
 * moram aqui: vêm de getContent() e de portfolioWorkanaStats, a mesma fonte
 * do portfólio. Aqui ficam a redação editorial e os rótulos. Método e contato
 * repetem o que o site já publica (home atual e /contratar); os papéis dos
 * cases resumem getPortfolioRole() (desenvolvimento completo confirmado por
 * Eduardo em 21/09/2026). Avaliações são citadas literalmente, pelo autor.
 */

/** Cases da home, na ordem e com o título editorial de cada um. */
export type HomeCaseId = "passagenseuropa" | "rei" | "pace" | "cacaostore" | "mudapaisagens";

type CaseCopy = { kind: string; title: string; summary: string; look: string[]; role: string; note: string; alt: Record<string, string> };

const pt = {
  nav: {
    links: [
      { label: "Projetos", href: "#projetos" },
      { label: "Soluções", href: "#solucoes" },
      { label: "Como trabalhamos", href: "#metodo" },
      { label: "Sobre", href: "#sobre" },
    ],
  },
  hero: {
    lead: "Desenvolvemos sistemas, produtos digitais, lojas e integrações. Aplicamos IA onde ela ajuda a resolver o problema.",
    secondary: "Ver projetos",
  },
  proof: {
    projects: "projetos realizados",
    rating: "nota média",
    reviews: "avaliações",
    level: "nível na Workana",
    source: "Dados do perfil na Workana, conferidos em",
    sourceLink: "Ver perfil",
  },
  projects: {
    title: "Cinco projetos, cinco tipos de software.",
    intro: "Do CRM comercial à loja virtual: trabalhos entregues, cada um mostrado pela tela que melhor explica o que ele faz.",
    look: "No sistema",
    open: "Conhecer o projeto",
    all: "Ver todos os projetos",
    allNote: "Mais SaaS, aplicativos, sites e lojas estão na página de projetos.",
    cases: {
      passagenseuropa: {
        kind: "CRM e operação comercial",
        title: "Atendimento, funil e financeiro no mesmo sistema.",
        summary: "A operação comercial estava espalhada por ferramentas separadas. O CRM reúne leads, atendimento por WhatsApp, cotações, financeiro e comissões, com recursos de IA para apoiar o atendimento.",
        look: ["Funil de leads por etapa", "Conversas do WhatsApp dentro do CRM", "Cotações, financeiro e comissões no mesmo lugar"],
        role: "Desenvolvimento completo",
        note: "Demonstração recriada com dados fictícios a partir do CRM entregue. A conversa e o bilhete também são ilustrativos.",
        alt: {
          crm: "Recriação da tela do CRM com dados fictícios: menu de módulos e funil SDR com leads em cada etapa.",
          chat: "Conversa ilustrativa no WhatsApp com o pedido de uma cotação, com dados fictícios.",
          ticket: "Bilhete ilustrativo de São Paulo para Lisboa, com dados fictícios.",
        },
      },
      rei: {
        kind: "Sistema de gestão de obras",
        title: "Cada obra em etapas, com responsável e prazo.",
        summary: "A Rei Sol Infraestrutura acompanhava obras de telecom em controles manuais. O sistema organiza etapas, tarefas, SLAs e dependências num painel que o próprio admin configura.",
        look: ["Lista de obras com o andamento de cada uma", "Tarefa com setor, responsável, SLA e tempo restante", "Etapas e tarefas configuradas no painel administrativo"],
        role: "Desenvolvimento completo",
        note: "Tela do sistema entregue, com dados de teste.",
        alt: {
          main: "Tela de obras do sistema da Rei Sol, com o andamento de três obras e o detalhe de uma tarefa com setor, responsável e SLA.",
        },
      },
      pace: {
        kind: "Produto SaaS para clínicas",
        title: "Neurofeedback com EEG e jogos 3D, no navegador.",
        summary: "Com um headset EEG, o paciente controla jogos 3D pela atenção e pelo relaxamento. A plataforma reúne agenda, protocolos, evolução e relatórios de várias clínicas.",
        look: ["Painel clínico com índices de atenção e foco", "Protocolos prontos por condição", "Sessões guiadas e relatórios em PDF"],
        role: "Desenvolvimento completo",
        note: "Telas reais do sistema entregue, com dados de teste.",
        alt: {
          main: "Painel clínico do PACE com índices de atenção, foco e engajamento, alertas e ações rápidas.",
          detail: "Templates de protocolo do PACE para TDAH, ansiedade e atendimento infantil.",
        },
      },
      cacaostore: {
        kind: "Loja virtual em Shopify",
        title: "Uma loja Shopify sob medida para uma marca de chocolates.",
        summary: "Layout próprio sobre a Shopify, pensado primeiro para o celular, com catálogo, checkout da plataforma e produtos e estoque geridos pelo próprio cliente.",
        look: ["Página inicial e navegação", "Destaques e produtos", "Página da marca"],
        role: "Desenvolvimento completo",
        note: "Capturas da loja entregue.",
        alt: {
          group: "Três páginas da loja Cacao Store",
          home: "Página inicial da Cacao Store, com menu de categorias, busca e banner de produtos.",
          products: "Seção de destaques da Cacao Store, com fotos de trufas e brownies.",
          brand: "Página da Cacao Store com a chamada Gente que ama chocolate e fotos de produtos.",
        },
      },
      mudapaisagens: {
        kind: "Integração com IA",
        title: "Pré-atendimento com IA no WhatsApp, registrado no Pipefy.",
        summary: "Novos leads chegavam pelo WhatsApp e esperavam alguém responder. O fluxo no Make conversa, faz as perguntas de qualificação e registra cada lead no Pipefy.",
        look: ["Mensagem no WhatsApp", "IA responde e qualifica", "Lead registrado no Pipefy"],
        role: "Desenvolvimento completo da automação",
        note: "Tela real do fluxo de automação.",
        alt: {
          main: "Fluxo de automação do qualificador de leads com IA, com as etapas entre WhatsApp e Pipefy.",
        },
      },
    } satisfies Record<HomeCaseId, CaseCopy>,
  },
  solutions: {
    title: "O que precisa funcionar melhor no seu negócio?",
    intro: "Quatro tipos de trabalho, cada um com um projeto entregue como referência.",
    example: "Exemplo entregue",
    service: "Ver o serviço",
    servicePtOnly: "Ver o serviço",
    items: [
      {
        id: "organizar",
        title: "Organizar a operação",
        need: "Planilhas, conversas e controles soltos viram um sistema com regras, permissões e histórico.",
        deliverables: ["Sistemas internos", "Painéis de gestão", "Regras e perfis de acesso"],
        caseId: "rei" as HomeCaseId,
        service: "/servicos/sistemas-sob-medida",
      },
      {
        id: "conectar",
        title: "Conectar ferramentas",
        need: "WhatsApp, CRM, ERP e pagamentos trocando dados entre si, sem cópia manual.",
        deliverables: ["Integrações entre sistemas e APIs", "Automações de fluxo", "Registro automático"],
        caseId: "mudapaisagens" as HomeCaseId,
        service: "/servicos/integracoes-e-automacoes",
      },
      {
        id: "construir",
        title: "Construir um produto",
        need: "Um SaaS ou uma plataforma nova, da primeira versão ao uso por clientes reais.",
        deliverables: ["Plataformas SaaS", "Áreas de cliente e de equipe", "Aplicativos e sites"],
        caseId: "pace" as HomeCaseId,
        service: "/servicos/desenvolvimento-saas",
      },
      {
        id: "ia",
        title: "Aplicar IA com controle",
        need: "Atendimento, qualificação e tarefas especializadas com IA, dentro de limites definidos e com revisão.",
        deliverables: ["Agentes de atendimento", "Assistentes especializados", "Qualificação de leads"],
        caseId: "passagenseuropa" as HomeCaseId,
        service: "/servicos/integracoes-e-automacoes",
      },
    ],
  },
  method: {
    title: "Como um projeto anda, e o que você decide em cada etapa.",
    intro: "Cada etapa termina com algo que você recebe e uma decisão sua. Os exemplos ao lado são ilustrativos, não documentos de clientes.",
    receive: "Você recebe",
    decide: "Você decide",
    illustrative: "Exemplo ilustrativo",
    steps: [
      {
        id: "escopo",
        title: "Escopo por escrito",
        receive: "O que entra nesta etapa, o que fica para depois, os critérios de aceite, o prazo e o valor.",
        decide: "Se o escopo resolve o problema principal e se o investimento cabe agora.",
      },
      {
        id: "previa",
        title: "Entrega navegável",
        receive: "Um ambiente de teste para abrir e usar o que já foi construído, conforme as etapas da proposta.",
        decide: "O que está certo e o que precisa de ajuste antes de seguir.",
      },
      {
        id: "validacao",
        title: "Validação",
        receive: "Os critérios de aceite conferidos um a um, com os cenários combinados.",
        decide: "Aprovar a etapa ou pedir o ajuste previsto no escopo.",
      },
      {
        id: "operacao",
        title: "Entrada em operação",
        receive: "A publicação no ambiente combinado, com documentação e orientação gravada.",
        decide: "O suporte e as próximas etapas, nas condições da proposta.",
      },
    ],
    artifacts: {
      scope: {
        heading: "Escopo, etapa 1",
        project: "Painel de pedidos",
        rows: [
          ["Entra nesta etapa", "Cadastro de pedidos com etapas e responsáveis. Perfis de acesso para equipe e gestão."],
          ["Fica para depois", "Integração com o ERP, orçada como outra etapa."],
          ["Critério de aceite", "Um usuário autorizado avança um pedido entre as etapas combinadas; o sistema registra quem alterou e quando."],
          ["Prazo e valor", "Definidos na proposta."],
        ],
      },
      preview: {
        bar: "Ambiente de teste",
        note: "Recriação com dados fictícios a partir do CRM entregue à Passagens Europa.",
        alt: "Recriação da tela de um CRM com funil de leads por etapa, com dados fictícios.",
      },
      validation: {
        heading: "Critérios de aceite, etapa 1",
        items: [
          ["done", "O pedido avança entre as etapas combinadas e o histórico registra a alteração."],
          ["done", "Ações não autorizadas são bloqueadas também no servidor."],
          ["open", "Filtros e totais conferidos com um conjunto de registros conhecido."],
        ],
        actions: ["Aprovar a etapa", "Pedir ajuste"],
      },
      operation: {
        heading: "Etapa entregue",
        items: ["Publicada no ambiente combinado", "Documentação de uso", "Orientação gravada"],
        next: "Próxima etapa: orçada à parte, quando você decidir.",
      },
    },
    note: "Prazo, valor e suporte de cada projeto ficam definidos na proposta.",
  },
  about: {
    title: "Técnica próxima de quem decide.",
    bio: "A EDevsHub é conduzida por Eduardo Gouveia, desenvolvedor full stack. A conversa sobre o problema e as decisões de implementação fazem parte do mesmo trabalho.",
    photoCaption: "Eduardo Gouveia, responsável técnico",
    reviewsTitle: "Avaliações de clientes",
    reviewFrom: "Avaliação na Workana",
    reviewNote: "",
    reviewAuthors: ["José Ricardo Silva de Sousa", "Leonardo Flores"],
  },
  contact: {
    title: "O que você quer construir ou destravar?",
    body: "Conte o que sua empresa faz, onde está o problema e o que precisa mudar. A conversa começa por entender o contexto.",
    steps: ["Você conta o que quer desenvolver.", "Recebe escopo, prazo e valor por escrito.", "Acompanha a construção por etapas."],
    channel: "Na página de contato, a conversa segue pelo WhatsApp.",
    channelPtOnly: "Na página de contato, a conversa segue pelo WhatsApp.",
    cta: "Conversar sobre um projeto",
    workana: "Prefere contratar pela Workana?",
    workanaLink: "Ver o perfil",
  },
  footer: {
    tagline: "Sistemas, produtos, lojas e integrações sob medida.",
    columns: { work: "Trabalho", company: "EDevsHub", legal: "Informações" },
    projects: "Projetos",
    services: "Serviços",
    contact: "Conversar sobre um projeto",
    workana: "Perfil na Workana",
    instagram: "Instagram",
    github: "GitHub",
    privacy: "Política de privacidade",
    language: "English",
    rights: "Todos os direitos reservados.",
    descriptor: "Software, sistemas e IA",
    ptOnly: "",
  },
};

type HomeCopy = typeof pt;

const en: HomeCopy = {
  nav: {
    links: [
      { label: "Projects", href: "#projetos" },
      { label: "Solutions", href: "#solucoes" },
      { label: "How we work", href: "#metodo" },
      { label: "About", href: "#sobre" },
    ],
  },
  hero: {
    lead: "We build systems, digital products, online stores and integrations. We apply AI where it helps solve the problem.",
    secondary: "See projects",
  },
  proof: {
    projects: "projects completed",
    rating: "average rating",
    reviews: "reviews",
    level: "level on Workana",
    source: "Workana profile data, checked on",
    sourceLink: "See profile",
  },
  projects: {
    title: "Five projects, five kinds of software.",
    intro: "From a sales CRM to an online store: delivered work, each shown through the screen that best explains what it does.",
    look: "In the system",
    open: "See the project",
    all: "See all projects",
    allNote: "More SaaS, apps, websites and stores are on the projects page.",
    cases: {
      passagenseuropa: {
        kind: "CRM and sales operations",
        title: "Support, pipeline and finance in one system.",
        summary: "The sales operation was spread across separate tools. The CRM brings together leads, WhatsApp support, quotes, finance and commissions, with AI features to support customer service.",
        look: ["Lead pipeline by stage", "WhatsApp conversations inside the CRM", "Quotes, finance and commissions in one place"],
        role: "Full development",
        note: "Demo recreated with fictional data from the delivered CRM. The conversation and the ticket are illustrative too.",
        alt: {
          crm: "Recreation of the CRM screen with fictional data: module menu and SDR pipeline with leads in each stage.",
          chat: "Illustrative WhatsApp conversation asking for a quote, with fictional data.",
          ticket: "Illustrative ticket from São Paulo to Lisbon, with fictional data.",
        },
      },
      rei: {
        kind: "Construction management system",
        title: "Every project in stages, with an owner and a deadline.",
        summary: "Rei Sol Infraestrutura tracked telecom construction projects with manual controls. The system organizes stages, tasks, SLAs and dependencies in a dashboard the admin configures.",
        look: ["List of projects with each one’s progress", "Task with department, owner, SLA and time left", "Stages and tasks configured in the admin panel"],
        role: "Full development",
        note: "Screen from the delivered system, with test data.",
        alt: {
          main: "Projects screen of the Rei Sol system, with the progress of three projects and the detail of a task with department, owner and SLA.",
        },
      },
      pace: {
        kind: "SaaS product for clinics",
        title: "Neurofeedback with EEG and 3D games, in the browser.",
        summary: "Wearing an EEG headset, the patient controls 3D games through attention and relaxation. The platform brings together scheduling, protocols, progress and reports for several clinics.",
        look: ["Clinical dashboard with attention and focus indexes", "Ready-made protocols by condition", "Guided sessions and PDF reports"],
        role: "Full development",
        note: "Real screens from the delivered system, with test data.",
        alt: {
          main: "PACE clinical dashboard with attention, focus and engagement indexes, alerts and quick actions.",
          detail: "PACE protocol templates for ADHD, anxiety and children.",
        },
      },
      cacaostore: {
        kind: "Shopify online store",
        title: "A custom Shopify store for a chocolate brand.",
        summary: "A custom layout on Shopify, designed for phones first, with the catalog, the platform’s checkout, and products and stock managed by the client.",
        look: ["Home page and navigation", "Highlights and products", "Brand page"],
        role: "Full development",
        note: "Screenshots of the delivered store.",
        alt: {
          group: "Three pages of the Cacao Store",
          home: "Cacao Store home page with the category menu, search and a product banner.",
          products: "Cacao Store highlights section with photos of truffles and brownies.",
          brand: "Cacao Store page with the line Gente que ama chocolate and product photos.",
        },
      },
      mudapaisagens: {
        kind: "AI integration",
        title: "AI pre-sales on WhatsApp, logged in Pipefy.",
        summary: "New leads arrived on WhatsApp and waited for someone to reply. The Make workflow talks to them, asks the qualification questions and logs each lead in Pipefy.",
        look: ["Message on WhatsApp", "AI replies and qualifies", "Lead logged in Pipefy"],
        role: "Full development of the automation",
        note: "Real screen from the automation flow.",
        alt: {
          main: "Automation flow of the AI lead qualifier, with the steps between WhatsApp and Pipefy.",
        },
      },
    },
  },
  solutions: {
    title: "What needs to work better in your business?",
    intro: "Four kinds of work, each backed by a delivered project.",
    example: "Delivered example",
    service: "See the service",
    servicePtOnly: "See the service (in Portuguese)",
    items: [
      {
        id: "organizar",
        title: "Organize the operation",
        need: "Loose spreadsheets, chats and manual controls become one system with rules, permissions and history.",
        deliverables: ["Internal systems", "Management dashboards", "Rules and access roles"],
        caseId: "rei",
        service: "/servicos/sistemas-sob-medida",
      },
      {
        id: "conectar",
        title: "Connect your tools",
        need: "WhatsApp, CRM, ERP and payments exchanging data, with no manual copying.",
        deliverables: ["System and API integrations", "Workflow automations", "Automatic records"],
        caseId: "mudapaisagens",
        service: "/servicos/integracoes-e-automacoes",
      },
      {
        id: "construir",
        title: "Build a product",
        need: "A new SaaS or platform, from the first version to real customers using it.",
        deliverables: ["SaaS platforms", "Customer and team areas", "Apps and websites"],
        caseId: "pace",
        service: "/servicos/desenvolvimento-saas",
      },
      {
        id: "ia",
        title: "Apply AI with control",
        need: "Customer service, lead qualification and specialist tasks with AI, within defined limits and with review.",
        deliverables: ["Customer service agents", "Specialist assistants", "Lead qualification"],
        caseId: "passagenseuropa",
        service: "/servicos/integracoes-e-automacoes",
      },
    ],
  },
  method: {
    title: "How a project moves, and what you decide at each stage.",
    intro: "Every stage ends with something you receive and a decision of yours. The examples alongside are illustrative, not client documents.",
    receive: "You receive",
    decide: "You decide",
    illustrative: "Illustrative example",
    steps: [
      {
        id: "escopo",
        title: "Scope in writing",
        receive: "What goes into this stage, what waits for later, the acceptance criteria, the timeline and the price.",
        decide: "Whether the scope solves the main problem and whether the budget fits now.",
      },
      {
        id: "previa",
        title: "A delivery you can use",
        receive: "A test environment to open and use what has been built so far, following the stages in the proposal.",
        decide: "What is right and what needs adjusting before moving on.",
      },
      {
        id: "validacao",
        title: "Validation",
        receive: "The acceptance criteria checked one by one, with the agreed scenarios.",
        decide: "Approve the stage or ask for the adjustment the scope allows.",
      },
      {
        id: "operacao",
        title: "Going live",
        receive: "Release to the agreed environment, with documentation and recorded guidance.",
        decide: "Support and the next stages, on the terms of the proposal.",
      },
    ],
    artifacts: {
      scope: {
        heading: "Scope, stage 1",
        project: "Order dashboard",
        rows: [
          ["In this stage", "Order records with stages and owners. Access roles for the team and managers."],
          ["Later", "ERP integration, quoted as another stage."],
          ["Acceptance criterion", "An authorized user moves an order between the agreed stages; the system records who changed it and when."],
          ["Timeline and price", "Set in the proposal."],
        ],
      },
      preview: {
        bar: "Test environment",
        note: "Recreation with fictional data, based on the CRM delivered to Passagens Europa.",
        alt: "Recreation of a CRM screen with a lead pipeline by stage, with fictional data.",
      },
      validation: {
        heading: "Acceptance criteria, stage 1",
        items: [
          ["done", "The order moves between the agreed stages and the history records the change."],
          ["done", "Unauthorized actions are also blocked on the server."],
          ["open", "Filters and totals checked against a known set of records."],
        ],
        actions: ["Approve the stage", "Ask for an adjustment"],
      },
      operation: {
        heading: "Stage delivered",
        items: ["Released to the agreed environment", "User documentation", "Recorded guidance"],
        next: "Next stage: quoted separately, when you decide.",
      },
    },
    note: "Timeline, price and support for each project are set in the proposal.",
  },
  about: {
    title: "Engineering close to the people who decide.",
    bio: "EDevsHub is led by Eduardo Gouveia, a full stack developer. Talking through the problem and making the implementation decisions are part of the same job.",
    photoCaption: "Eduardo Gouveia, technical lead",
    reviewsTitle: "Client reviews",
    reviewFrom: "Review on Workana",
    reviewNote: "Original reviews in Portuguese.",
    reviewAuthors: ["José Ricardo Silva de Sousa", "Leonardo Flores"],
  },
  contact: {
    title: "What do you want to build or unblock?",
    body: "Tell us what your company does, where the problem is and what needs to change. The conversation starts with the context.",
    steps: ["You tell us what you want to build.", "You get scope, timeline and price in writing.", "You follow the build in stages."],
    channel: "On the contact page, the conversation continues on WhatsApp.",
    channelPtOnly: "The contact page is in Portuguese; the conversation continues on WhatsApp.",
    cta: "Talk about a project",
    workana: "Prefer to hire through Workana?",
    workanaLink: "See the profile",
  },
  footer: {
    tagline: "Custom systems, products, stores and integrations.",
    columns: { work: "Work", company: "EDevsHub", legal: "Information" },
    projects: "Projects",
    services: "Services",
    contact: "Talk about a project",
    workana: "Workana profile",
    instagram: "Instagram",
    github: "GitHub",
    privacy: "Privacy policy",
    language: "Português",
    rights: "All rights reserved.",
    descriptor: "Software, systems and AI",
    ptOnly: " (in Portuguese)",
  },
};

export function getHomeCopy(locale: Locale): HomeCopy {
  return locale === "en" ? en : pt;
}

export type { HomeCopy };
