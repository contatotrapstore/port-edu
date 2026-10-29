import type { Locale } from "@/lib/locale";

/**
 * Textos de navegação e rótulos comuns às páginas internas do site novo
 * (projetos, cases, serviços, contratação e privacidade). O conteúdo de cada
 * página vem da mesma fonte da versão atual; aqui ficam só os rótulos.
 */
const pt = {
  nav: [
    { key: "projetos", label: "Projetos", path: "/projetos" },
    { key: "servicos", label: "Serviços", path: "/servicos" },
    { key: "metodo", label: "Como trabalhamos", path: "/#metodo" },
    { key: "sobre", label: "Sobre", path: "/#sobre" },
  ],
  crumbs: { label: "Caminho da página", home: "Início", projects: "Projetos", services: "Serviços" },
  cta: "Conversar sobre um projeto",
  workana: "Prefere contratar pela Workana?",
  workanaLink: "Ver o perfil",
  proof: {
    projects: "projetos realizados na Workana",
    rating: "nota média",
    reviews: "avaliações",
    checked: "Dados do perfil na Workana, conferidos em",
  },
  projectsIndex: {
    title: "Projetos",
    lead: "Sistemas, plataformas SaaS, automações e sites desenvolvidos para empresas reais.",
    intro: (count: number) =>
      `${count} projetos documentados: o problema, a solução e as capacidades de cada produto. Encontre o tipo de trabalho que se aproxima do seu projeto.`,
    services: "Conheça os serviços e o que entra em cada escopo",
    open: "Conhecer o projeto",
    verticals: [
      { id: "automacao-ia", label: "Automação e IA", blurb: "Atendimento, qualificação e registro de informações, integrados às ferramentas que a empresa já usa." },
      { id: "sistemas", label: "Sistemas e integrações", blurb: "Painéis, ERPs e CRMs sob medida para organizar processos e conectar ferramentas." },
      { id: "saude", label: "Saúde e clínicas", blurb: "Prontuário, agenda, teleconsulta e neurofeedback em produtos para profissionais de saúde." },
      { id: "apps", label: "Aplicativos", blurb: "Produtos mobile para diferentes rotinas e públicos." },
      { id: "web", label: "E-commerce e sites", blurb: "Lojas virtuais e sites institucionais sob medida." },
    ],
  },
  case: {
    spec: { problem: "Problema", delivery: "Entrega", role: "Papel", stack: "Tecnologias", year: "Ano", type: "Tipo" },
    overview: "Visão geral",
    features: "Funcionalidades",
    output: "Capacidades do produto",
    gallery: "Telas do projeto",
    imageAlt: (title: string, headline: string) => `${title}: ${headline}`,
    live: "Ver o projeto publicado",
    ctaTitle: "Tem um projeto parecido?",
    ctaBody: "Conte o que sua empresa precisa. A conversa começa pelo contexto e termina com escopo, prazo e valor por escrito.",
    authorTitle: "Quem desenvolveu",
    authorBody: "Eduardo Gouveia, desenvolvedor full stack e responsável técnico da EDevsHub.",
    prev: "Projeto anterior",
    next: "Próximo projeto",
    all: "Ver todos os projetos",
  },
  footerTagline: "Sistemas, produtos, lojas e integrações sob medida.",
};

type SiteCopy = typeof pt;

const en: SiteCopy = {
  nav: [
    { key: "projetos", label: "Projects", path: "/projetos" },
    { key: "servicos", label: "Services", path: "/servicos" },
    { key: "metodo", label: "How we work", path: "/#metodo" },
    { key: "sobre", label: "About", path: "/#sobre" },
  ],
  crumbs: { label: "Breadcrumb", home: "Home", projects: "Projects", services: "Services" },
  cta: "Talk about a project",
  workana: "Prefer to hire through Workana?",
  workanaLink: "See the profile",
  proof: {
    projects: "projects completed on Workana",
    rating: "average rating",
    reviews: "reviews",
    checked: "Workana profile data, checked on",
  },
  projectsIndex: {
    title: "Projects",
    lead: "Systems, SaaS platforms, automations and websites built for real companies.",
    intro: (count: number) =>
      `${count} documented projects: the problem, the solution and each product’s capabilities. Find work relevant to your project.`,
    services: "Explore the services and what each scope includes",
    open: "See the project",
    verticals: [
      { id: "automacao-ia", label: "Automation and AI", blurb: "Customer service, lead qualification and information capture connected to the tools the business already uses." },
      { id: "sistemas", label: "Systems and integrations", blurb: "Custom dashboards, ERPs and CRMs to organize processes and connect tools." },
      { id: "saude", label: "Healthcare and clinics", blurb: "Patient records, scheduling, telehealth and neurofeedback products for healthcare professionals." },
      { id: "apps", label: "Mobile apps", blurb: "Mobile products for different workflows and audiences." },
      { id: "web", label: "E-commerce and websites", blurb: "Custom online stores and corporate websites." },
    ],
  },
  case: {
    spec: { problem: "Problem", delivery: "Delivered", role: "Role", stack: "Stack", year: "Year", type: "Type" },
    overview: "Overview",
    features: "Features",
    output: "Product capabilities",
    gallery: "Project screens",
    imageAlt: (title: string, headline: string) => `${title}: ${headline}`,
    live: "See the live project",
    ctaTitle: "Working on something similar?",
    ctaBody: "Tell us what your company needs. The conversation starts with the context and ends with scope, timeline and price in writing.",
    authorTitle: "Who built it",
    authorBody: "Eduardo Gouveia, full stack developer and technical lead at EDevsHub.",
    prev: "Previous project",
    next: "Next project",
    all: "See all projects",
  },
  footerTagline: "Custom systems, products, stores and integrations.",
};

export function getSiteCopy(locale: Locale): SiteCopy {
  return locale === "en" ? en : pt;
}

export type { SiteCopy };
