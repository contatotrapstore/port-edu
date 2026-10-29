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
export type HomeCaseId = "passagenseuropa" | "neuroialab" | "pace" | "mudapaisagens";

type CaseCopy = { title: string; role: string; note: string; alt: Record<string, string> };

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
    lead: "Desenvolvemos sistemas internos, plataformas SaaS, integrações e agentes de IA para empresas que precisam organizar a operação e colocar produtos em uso.",
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
    title: "Projetos que mostram como trabalhamos.",
    intro: "Sistemas em operação, cada um com o problema que resolveu, o que foi entregue e o papel da EDevsHub.",
    spec: { problem: "Problema", delivery: "Entrega", role: "Papel", stack: "Tecnologias", year: "Ano" },
    open: "Conhecer o projeto",
    all: "Ver todos os projetos",
    allNote: "Sistemas, SaaS, lojas e automações: o portfólio completo fica na página de projetos.",
    cases: {
      passagenseuropa: {
        title: "Atendimento, funil e financeiro no mesmo sistema.",
        role: "Desenvolvimento completo: CRM, atendimento por WhatsApp, funil de vendas, cotações, gestão financeira e comissões.",
        note: "Demonstração recriada com dados fictícios a partir do CRM entregue. A conversa e o bilhete também são ilustrativos.",
        alt: {
          crm: "Recriação da tela do CRM com dados fictícios: menu de módulos e funil SDR com leads em cada etapa.",
          chat: "Conversa ilustrativa no WhatsApp com o pedido de uma cotação, com dados fictícios.",
          ticket: "Bilhete ilustrativo de São Paulo para Lisboa, com dados fictícios.",
        },
      },
      neuroialab: {
        title: "Dezenove assistentes de IA para a rotina clínica.",
        role: "Desenvolvimento completo do produto.",
        note: "Telas reais do sistema entregue.",
        alt: {
          main: "Painel do NeuroIA Lab com assinaturas, assistentes ativos e conversas do mês.",
          detail: "Conversa com um dos assistentes de IA do NeuroIA Lab.",
        },
      },
      pace: {
        title: "Neurofeedback com EEG e jogos 3D, no navegador.",
        role: "Desenvolvimento completo do produto.",
        note: "Telas reais do sistema entregue, com dados de teste.",
        alt: {
          main: "Painel clínico do PACE com índices de atenção, foco e engajamento, alertas e ações rápidas.",
          detail: "Templates de protocolo do PACE para TDAH, ansiedade e atendimento infantil.",
        },
      },
      mudapaisagens: {
        title: "Pré-atendimento com IA no WhatsApp, registrado no Pipefy.",
        role: "Desenvolvimento completo da automação.",
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
        caseId: "passagenseuropa" as HomeCaseId,
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
        caseId: "neuroialab" as HomeCaseId,
        service: "/servicos/integracoes-e-automacoes",
      },
    ],
  },
  method: {
    title: "Clareza antes do código. Visibilidade durante a entrega.",
    intro: "O projeto começa pelo problema e avança em etapas que você acompanha e valida.",
    steps: [
      {
        n: "01",
        title: "Entender a necessidade",
        body: "O que precisa funcionar, quem vai usar e quais ferramentas já fazem parte da operação.",
      },
      { n: "02", title: "Definir a entrega", body: "Escopo, prazo e critérios de aceite combinados por escrito antes de começar." },
      { n: "03", title: "Desenvolver por etapas", body: "Você acompanha as entregas e valida o que foi combinado ao longo do projeto." },
      { n: "04", title: "Colocar em uso", body: "Documentação e orientação gravada. Suporte e evolução seguem as condições da proposta." },
    ],
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
    tagline: "Software sob medida e IA em produção para operações reais.",
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
    lead: "We build internal systems, SaaS platforms, integrations and AI agents for companies that need their operations organized and their products in use.",
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
    title: "Projects that show how we work.",
    intro: "Systems in production, each with the problem it solved, what was delivered and the role EDevsHub played.",
    spec: { problem: "Problem", delivery: "Delivered", role: "Role", stack: "Stack", year: "Year" },
    open: "See the project",
    all: "See all projects",
    allNote: "Systems, SaaS, stores and automations: the full portfolio lives on the projects page.",
    cases: {
      passagenseuropa: {
        title: "Support, pipeline and finance in one system.",
        role: "Full development: CRM, WhatsApp support, sales pipeline, quotes, finance and commissions.",
        note: "Demo recreated with fictional data from the delivered CRM. The conversation and the ticket are illustrative too.",
        alt: {
          crm: "Recreation of the CRM screen with fictional data: module menu and SDR pipeline with leads in each stage.",
          chat: "Illustrative WhatsApp conversation asking for a quote, with fictional data.",
          ticket: "Illustrative ticket from São Paulo to Lisbon, with fictional data.",
        },
      },
      neuroialab: {
        title: "Nineteen AI assistants for clinical work.",
        role: "Full development of the product.",
        note: "Real screens from the delivered system.",
        alt: {
          main: "NeuroIA Lab dashboard with subscriptions, active assistants and monthly conversations.",
          detail: "Conversation with one of the NeuroIA Lab AI assistants.",
        },
      },
      pace: {
        title: "Neurofeedback with EEG and 3D games, in the browser.",
        role: "Full development of the product.",
        note: "Real screens from the delivered system, with test data.",
        alt: {
          main: "PACE clinical dashboard with attention, focus and engagement indexes, alerts and quick actions.",
          detail: "PACE protocol templates for ADHD, anxiety and children.",
        },
      },
      mudapaisagens: {
        title: "AI pre-sales on WhatsApp, logged in Pipefy.",
        role: "Full development of the automation.",
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
        caseId: "passagenseuropa",
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
        caseId: "neuroialab",
        service: "/servicos/integracoes-e-automacoes",
      },
    ],
  },
  method: {
    title: "Clarity before code. Visibility during delivery.",
    intro: "Every project starts with the problem and moves in stages you can follow and approve.",
    steps: [
      { n: "01", title: "Understand the need", body: "What needs to work, who will use it and which tools your business already relies on." },
      { n: "02", title: "Define the delivery", body: "Scope, schedule and acceptance criteria agreed in writing before development." },
      { n: "03", title: "Build in stages", body: "Follow the deliveries and validate the agreed scope throughout the project." },
      { n: "04", title: "Put it to use", body: "Documentation and recorded guidance. Support and next stages follow the terms of the proposal." },
    ],
    note: "Each project's timeline, price and support are set in the proposal.",
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
    tagline: "Custom software and AI in production for real operations.",
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
