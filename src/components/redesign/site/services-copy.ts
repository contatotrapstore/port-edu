import type { Locale } from "@/lib/locale";

/**
 * Rótulos e textos de apoio das páginas de serviço. Em português, os mesmos
 * textos publicados hoje em /servicos e /servicos/[slug]; a única mudança é
 * o próximo passo, que passa a ser a página de contratação, com a Workana
 * como alternativa (antes o CTA levava só à Workana).
 */
const pt = {
  index: {
    title: "Sistemas sob medida, integrações e plataformas SaaS.",
    kicker: "EDevsHub, software sob medida",
    lead: "A EDevsHub constrói sistemas sob medida, conecta ferramentas e desenvolve plataformas SaaS. Também atua na evolução de produtos existentes. O formato do trabalho depende do que precisa funcionar na sua operação.",
    startTitle: "Por onde faz sentido começar?",
    open: "Conhecer o serviço",
    decisionTitle: "Ainda não sabe se precisa construir ou integrar?",
    decision: [
      "Comece pela tarefa que está difícil hoje. Se as ferramentas atendem a operação, mas não trocam informações, uma integração pode ser o ponto de partida. Se o processo precisa de regras e controles próprios, faz sentido avaliar um sistema sob medida.",
      "Quando outras pessoas vão usar o software como um produto, o escopo também precisa considerar a jornada de uso, os acessos e o que entra na primeira versão. A EDevsHub avalia esse caminho com base no contexto do projeto.",
    ],
    casesKicker: "Do portfólio",
    casesTitle: "Três exemplos para explorar.",
    casesAll: "Ver o portfólio completo",
    closingTitle: "Conte o que precisa funcionar.",
    closingBody: "Descreva o objetivo, o que já existe e quais ferramentas sua empresa usa. Com esse contexto, a EDevsHub avalia a abordagem técnica e o que precisa ser definido para uma proposta.",
  },
  detail: {
    scopeLink: "Explorar exemplos de escopo",
    proofRole: "Responsável técnico: Eduardo Gouveia, Full Stack Sênior",
    scopeNote: "Estes são exemplos de entregas e critérios de aceite. A proposta define quais entram no seu projeto e como serão conferidos.",
    accept: "Exemplo de aceite:",
    caseKicker: "Do portfólio",
    caseTitle: "Uma solução relacionada.",
    caseLink: (name: string) => `Conhecer o case de ${name}`,
    allProjects: "Ver todos os projetos",
    processTitle: "Como o trabalho é organizado.",
    questionsTitle: "Antes de definir o projeto.",
    briefIntro: "Para começar a conversa, vale reunir:",
    workanaChat: "Se a conversa já começou pela Workana, envie o contexto no mesmo chat.",
    otherTitle: "Seu projeto tem outra necessidade?",
  },
  checked: "Perfil conferido em",
  projects: "projetos realizados",
};

type ServicesCopy = typeof pt;

const en: ServicesCopy = {
  index: {
    title: "Custom systems, integrations and SaaS platforms.",
    kicker: "EDevsHub, custom software",
    lead: "EDevsHub builds custom systems, connects tools and develops SaaS platforms. It also works on evolving existing products. The shape of the work depends on what needs to work in your operation.",
    startTitle: "Where does it make sense to start?",
    open: "See the service",
    decisionTitle: "Not sure whether you need to build or integrate?",
    decision: [
      "Start with the task that is hard today. If your tools serve the operation but don’t exchange information, an integration can be the starting point. If the process needs its own rules and controls, it makes sense to consider a custom system.",
      "When other people will use the software as a product, the scope also has to consider the user journey, access and what goes into the first version. EDevsHub assesses that path based on the project’s context.",
    ],
    casesKicker: "From the portfolio",
    casesTitle: "Three examples to explore.",
    casesAll: "See the full portfolio",
    closingTitle: "Tell us what needs to work.",
    closingBody: "Describe the goal, what already exists and which tools your company uses. With that context, EDevsHub assesses the technical approach and what needs to be defined for a proposal.",
  },
  detail: {
    scopeLink: "Explore scope examples",
    proofRole: "Technical lead: Eduardo Gouveia, Senior Full Stack Developer",
    scopeNote: "These are examples of deliverables and acceptance criteria. The proposal defines which ones go into your project and how they will be checked.",
    accept: "Acceptance example:",
    caseKicker: "From the portfolio",
    caseTitle: "A related solution.",
    caseLink: (name: string) => `See the ${name} case`,
    allProjects: "See all projects",
    processTitle: "How the work is organized.",
    questionsTitle: "Before defining the project.",
    briefIntro: "To start the conversation, it helps to gather:",
    workanaChat: "If the conversation already started on Workana, send the context in the same chat.",
    otherTitle: "Does your project need something else?",
  },
  checked: "Profile checked on",
  projects: "completed projects",
};

export function getServicesCopy(locale: Locale): ServicesCopy {
  return locale === "en" ? en : pt;
}
