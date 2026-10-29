import type { Locale } from "@/lib/locale";

/**
 * Textos da prévia do redesign (abertura, primeiro case e fechamento).
 *
 * Fatos do projeto (título, problema, descrição, stack, ano, papel) NÃO moram
 * aqui: vêm de getContent() e getPortfolioRole(), a mesma fonte do portfólio
 * e da /workana. Aqui ficam a redação editorial e as anotações; cada anotação
 * do case aponta para algo visível na captura ou descrito no case publicado.
 */

export type CaseNote = {
  n: number;
  title: string;
  body: string;
};

/**
 * Posições na captura (% da imagem 817 × 501). Balões por fora, regiões por
 * dentro. Regiões pequenas na borda direita levam o rótulo para fora delas.
 */
export const SHOT_MARKS = [
  { n: 1, x: "16%", y: "26.5%", region: { left: "0.5%", top: "9%", width: "15.4%", height: "62%" }, labelOutside: false },
  { n: 2, x: "81%", y: "14.6%", region: { left: "83.2%", top: "11%", width: "16.2%", height: "7%" }, labelOutside: true },
  { n: 3, x: "38.6%", y: "30.9%", region: { left: "19%", top: "27.5%", width: "80.5%", height: "70%" }, labelOutside: false },
  { n: 4, x: "87.4%", y: "88%", region: { left: "89.6%", top: "91.6%", width: "9.8%", height: "7.6%" }, labelOutside: true },
] as const;

const pt = {
  lang: "pt-BR",
  home: "/redesign",
  skip: "Pular para o conteúdo",
  nav: {
    label: "Principal",
    descriptor: "Software, sistemas e IA",
    links: [
      { label: "Projetos", href: "/projetos" },
      { label: "Serviços", href: "/servicos" },
    ],
    language: { label: "EN", href: "/en/redesign", hrefLang: "en", name: "English" },
    cta: "Conversar sobre um projeto",
    menu: "Menu",
  },
  hero: {
    // Espaço inseparável: "a sua" não se separa na quebra de linha.
    title: "Sistemas que conectam a sua operação.",
    lead: "WhatsApp, planilhas, CRM e financeiro funcionando como uma operação só. Escopo por escrito, entrega por etapas.",
    cta: "Conversar sobre um projeto",
    secondary: "Ver um sistema entregue",
  },
  lens: {
    legend: "Vista da página",
    fora: "Por fora",
    dentro: "Por dentro",
  },
  object: {
    svgTitle: "Ilustração: as hastes da marca EDevsHub sustentando as camadas de um sistema, com a tela real do CRM Passagens Europa no topo.",
    caption: "Ilustração montada sobre a tela real do CRM Passagens Europa. Abra as camadas em Por dentro.",
    inLabel: "Entrada",
    inBody: "O pedido chega pelo WhatsApp.",
    outLabel: "Destino",
    outBody: "O lead entra no funil, com a conversa.",
    layers: [
      { label: "Interface", body: "Funil, conversas e cotações na mesma tela." },
      { label: "Regras e IA", body: "O pedido é validado antes de qualquer ação." },
      { label: "Integrações e dados", body: "WhatsApp, CRM e o histórico de cada cliente." },
    ],
  },
  case: {
    title: "Atendimento, funil e financeiro no mesmo sistema.",
    intro: "CRM sob medida para a operação comercial da Passagens Europa.",
    alt: "Tela do CRM da Passagens Europa com o menu de módulos e o funil SDR de qualificação em colunas, ainda sem leads.",
    caption: "Tela real do sistema. Nenhum dado de cliente aparece na captura.",
    notesLabel: { fora: "O que a equipe vê", dentro: "Como o sistema se organiza" },
    notes: {
      fora: [
        { n: 1, title: "Uma navegação para a operação inteira", body: "Leads, cotações, vendas, passagens, financeiro, tarefas e relatórios ficam no mesmo menu." },
        { n: 2, title: "Funil e conversas na mesma tela", body: "A equipe alterna entre o funil de vendas e as conversas do WhatsApp sem trocar de ferramenta." },
        { n: 3, title: "Qualificação em etapas", body: "O funil SDR acompanha cada lead da entrada até o vendedor." },
        { n: 4, title: "Assistente à mão", body: "O assistente fica na própria tela do funil." },
      ],
      dentro: [
        { n: 1, title: "Módulos de um mesmo sistema", body: "Funil, cotações, vendas, financeiro e comissões usam a mesma base, não ferramentas separadas." },
        { n: 2, title: "WhatsApp integrado", body: "As conversas entram no sistema e ficam ao lado do funil de vendas." },
        { n: 3, title: "Qualificação antes do vendedor", body: "O funil SDR organiza cada lead antes de ele chegar a quem vende." },
        { n: 4, title: "IA de apoio", body: "A IA apoia o atendimento, a análise de clientes e as decisões da equipe." },
      ],
    } satisfies Record<"fora" | "dentro", CaseNote[]>,
    xray: ["módulos", "conversas", "funil sdr", "ia"],
    ficha: { client: "Cliente", problem: "Problema", delivery: "Entrega", stack: "Stack" },
    decision: {
      label: "A decisão de projeto",
      title: "Um sistema só, do primeiro contato ao financeiro.",
      body: "O problema não era falta de ferramenta. Era o histórico de cada cliente dividido entre várias delas. Por isso tudo passou a viver na mesma plataforma.",
      before: "Antes: cada parte em uma ferramenta.",
      after: "Depois: um sistema, um histórico por cliente.",
      modules: ["Atendimento", "Funil", "Cotações", "Vendas", "Financeiro", "Comissões"],
    },
    note: {
      label: "Nota do responsável técnico",
      name: "Eduardo Gouveia",
      role: "Responsável técnico, EDevsHub",
    },
    link: "Conhecer o projeto completo",
    stamp: {
      label: "Ficha do projeto",
      sheet: "Prancha 01",
      fields: { project: "Projeto", scope: "Escopo", stack: "Stack", year: "Ano", lead: "Responsável" },
      lead: "Eduardo Gouveia, desenvolvimento completo",
    },
  },
  closing: {
    title: "O que você quer construir ou destravar?",
    body: "Conte o que sua empresa faz e onde está o problema. A conversa começa por entender o contexto.",
    cta: "Conversar sobre um projeto",
    workana: "Prefere contratar pela Workana?",
    workanaLink: "Ver o perfil",
  },
  footer: "Prévia local do redesign: abertura, primeiro case e fechamento. Não publicada.",
  studio: {
    title: ["Software sob medida.", "Engenharia que", "entra em uso."],
    lead: "Criamos sistemas, produtos e integrações para empresas que precisam fazer acontecer.",
    cta: "Conversar sobre um projeto",
    secondary: "Ver projetos entregues",
    note: "Cena ilustrativa com telas reais de projetos entregues.",
  },
  reel: {
    title: "Projetos entregues",
    all: "Ver todos os projetos",
    open: "Abrir o case",
  },
  studioFooter: "Prévia local: abertura e transição para projetos. Não publicada.",
  station: {
    explore: "Explorar a estação",
    back: "Voltar ao estúdio",
    problem: "O problema",
    onScreen: "Na tela",
    hint: "Escolha um ponto da tela para ver o que ele resolve.",
    pointLabel: "Ponto",
    of: "de",
    next: "Próximo ponto",
    note: "Estação ilustrativa. Tela recriada a partir do CRM entregue à Passagens Europa, com dados fictícios.",
    shotAlt:
      "Recriação da tela do CRM da Passagens Europa com dados fictícios: menu de módulos, funil SDR com leads nas etapas e o botão do assistente.",
    footer: "Prévia local: uma estação do estúdio. Não publicada.",
    // Cada ponto repete um fato já publicado no case (ver case.notes).
    points: [
      { n: 1, title: "Uma navegação para a operação inteira", body: "Leads, cotações, vendas, passagens, financeiro, tarefas e relatórios ficam no mesmo menu." },
      { n: 2, title: "Funil e conversas na mesma tela", body: "A equipe alterna entre o funil de vendas e as conversas do WhatsApp sem trocar de ferramenta." },
      { n: 3, title: "Qualificação em etapas", body: "O funil SDR acompanha cada lead da entrada até o vendedor." },
      {
        n: 4,
        title: "Assistente com IA",
        body: "Fica na própria tela do funil e apoia o atendimento, a análise de clientes e as decisões da equipe.",
      },
    ],
  },
};

type RedesignCopy = typeof pt;

const en: RedesignCopy = {
  lang: "en",
  home: "/en/redesign",
  skip: "Skip to content",
  nav: {
    label: "Main",
    descriptor: "Software, systems and AI",
    links: [
      { label: "Projects", href: "/en/projetos" },
      { label: "Services", href: "/servicos" },
    ],
    language: { label: "PT", href: "/redesign", hrefLang: "pt-BR", name: "português" },
    cta: "Talk about a project",
    menu: "Menu",
  },
  hero: {
    title: "Systems that connect your operation.",
    lead: "WhatsApp, spreadsheets, CRM and finance working as one operation. Written scope, delivery in stages.",
    cta: "Talk about a project",
    secondary: "See a delivered system",
  },
  lens: {
    legend: "Page view",
    fora: "Outside",
    dentro: "Inside",
  },
  object: {
    svgTitle: "Illustration: the EDevsHub brand stems holding the layers of a system, with the real Passagens Europa CRM screen on top.",
    caption: "Illustration built on the real Passagens Europa CRM screen. Open the layers with Inside.",
    inLabel: "Input",
    inBody: "The request arrives on WhatsApp.",
    outLabel: "Destination",
    outBody: "The lead enters the pipeline, with the conversation.",
    layers: [
      { label: "Interface", body: "Pipeline, conversations and quotes on one screen." },
      { label: "Rules and AI", body: "The request is validated before any action." },
      { label: "Integrations and data", body: "WhatsApp, CRM and each client's history." },
    ],
  },
  case: {
    title: "Support, pipeline and finance in one system.",
    intro: "A custom CRM for Passagens Europa's sales operation.",
    alt: "Passagens Europa CRM screen showing the module menu and the SDR qualification pipeline in columns, with no leads yet.",
    caption: "A real screen from the system. No client data appears in the capture.",
    notesLabel: { fora: "What the team sees", dentro: "How the system is organized" },
    notes: {
      fora: [
        { n: 1, title: "One navigation for the whole operation", body: "Leads, quotes, sales, tickets, finance, tasks and reports share the same menu." },
        { n: 2, title: "Pipeline and conversations on one screen", body: "The team switches between the sales pipeline and WhatsApp conversations without changing tools." },
        { n: 3, title: "Qualification in stages", body: "The SDR pipeline follows each lead from first contact to the salesperson." },
        { n: 4, title: "An assistant at hand", body: "The assistant sits on the pipeline screen itself." },
      ],
      dentro: [
        { n: 1, title: "Modules of one system", body: "Pipeline, quotes, sales, finance and commissions share one base instead of separate tools." },
        { n: 2, title: "WhatsApp built in", body: "Conversations enter the system and sit next to the sales pipeline." },
        { n: 3, title: "Qualified before sales", body: "The SDR pipeline organizes each lead before it reaches a salesperson." },
        { n: 4, title: "Assistive AI", body: "AI supports customer service, client analysis and team decisions." },
      ],
    },
    xray: ["modules", "conversations", "sdr pipeline", "ai"],
    ficha: { client: "Client", problem: "Problem", delivery: "Delivery", stack: "Stack" },
    decision: {
      label: "The design decision",
      title: "One system, from first contact to finance.",
      body: "The problem was not a lack of tools. It was each client's history split across several of them. So everything moved into one platform.",
      before: "Before: each part in a separate tool.",
      after: "After: one system, one history per client.",
      modules: ["Support", "Pipeline", "Quotes", "Sales", "Finance", "Commissions"],
    },
    note: {
      label: "A note from the technical lead",
      name: "Eduardo Gouveia",
      role: "Technical lead, EDevsHub",
    },
    link: "See the full project",
    stamp: {
      label: "Project sheet",
      sheet: "Sheet 01",
      fields: { project: "Project", scope: "Scope", stack: "Stack", year: "Year", lead: "Lead" },
      lead: "Eduardo Gouveia, full development",
    },
  },
  closing: {
    title: "What do you want to build or unblock?",
    body: "Tell us what your company does and where the problem is. The conversation starts with the context.",
    cta: "Talk about a project",
    workana: "Prefer to hire through Workana?",
    workanaLink: "See the profile",
  },
  footer: "Local redesign preview: opening, first case and closing. Not published.",
  studio: {
    title: ["Custom software.", "Engineering", "that goes live."],
    lead: "We build systems, products and integrations for companies that need things to happen.",
    cta: "Talk about a project",
    secondary: "See delivered projects",
    note: "Illustrative scene with real screens from delivered projects.",
  },
  reel: {
    title: "Delivered projects",
    all: "See all projects",
    open: "Open the case",
  },
  studioFooter: "Local preview: opening and transition to projects. Not published.",
  station: {
    explore: "Explore the station",
    back: "Back to the studio",
    problem: "The problem",
    onScreen: "On screen",
    hint: "Pick a point on the screen to see what it solves.",
    pointLabel: "Point",
    of: "of",
    next: "Next point",
    note: "Illustrative station. Screen recreated from the CRM delivered to Passagens Europa, with fictional data.",
    shotAlt:
      "Recreation of the Passagens Europa CRM screen with fictional data: module menu, SDR pipeline with leads in each stage and the assistant button.",
    footer: "Local preview: one studio station. Not published.",
    points: [
      { n: 1, title: "One navigation for the whole operation", body: "Leads, quotes, sales, tickets, finance, tasks and reports share the same menu." },
      { n: 2, title: "Pipeline and conversations on one screen", body: "The team switches between the sales pipeline and WhatsApp conversations without changing tools." },
      { n: 3, title: "Qualification in stages", body: "The SDR pipeline follows each lead from first contact to the salesperson." },
      {
        n: 4,
        title: "AI assistant",
        body: "It sits on the pipeline screen itself and supports customer service, client analysis and team decisions.",
      },
    ],
  },
};

export function getRedesignCopy(locale: Locale): RedesignCopy {
  return locale === "en" ? en : pt;
}

export type { RedesignCopy };
