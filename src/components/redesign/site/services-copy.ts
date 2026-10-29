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
    kicker: "Eduardo Gouveia, Full Stack Sênior",
    lead: "Construo sistemas sob medida, conecto ferramentas e desenvolvo plataformas SaaS. Também atuo na evolução de produtos existentes. O formato do trabalho depende do que precisa funcionar na sua operação.",
    startTitle: "Por onde faz sentido começar?",
    open: "Conhecer o serviço",
    decisionTitle: "Ainda não sabe se precisa construir ou integrar?",
    decision: [
      "Comece pela tarefa que está difícil hoje. Se as ferramentas atendem a operação, mas não trocam informações, uma integração pode ser o ponto de partida. Se o processo precisa de regras e controles próprios, faz sentido avaliar um sistema sob medida.",
      "Quando outras pessoas vão usar o software como um produto, o escopo também precisa considerar a jornada de uso, os acessos e o que entra na primeira versão. Posso avaliar esse caminho com base no contexto do projeto.",
    ],
    casesKicker: "Do portfólio",
    casesTitle: "Três exemplos para explorar.",
    casesAll: "Ver o portfólio completo",
    closingTitle: "Me conte o que precisa funcionar.",
    closingBody: "Descreva o objetivo, o que já existe e quais ferramentas sua empresa usa. Com esse contexto, avalio a abordagem técnica e o que precisa ser definido para uma proposta.",
  },
  detail: {
    scopeLink: "Explorar exemplos de escopo",
    proofRole: "Eduardo Gouveia, Full Stack Sênior",
    scopeNote: "Estes são exemplos de entregas e critérios de aceite. A proposta define quais entram no seu projeto e como serão conferidos.",
    accept: "Exemplo de aceite:",
    caseKicker: "Do portfólio",
    caseTitle: "Uma solução relacionada.",
    caseLink: (name: string) => `Conhecer o case de ${name}`,
    allProjects: "Ver todos os projetos",
    processTitle: "Como organizo o trabalho.",
    questionsTitle: "Antes de definir o projeto.",
    briefIntro: "Para começar a conversa, vale reunir:",
    workanaChat: "Se já estamos conversando pela Workana, envie o contexto no mesmo chat.",
    otherTitle: "Seu projeto tem outra necessidade?",
  },
  checked: "Perfil conferido em",
  projects: "projetos realizados",
};

type ServicesCopy = typeof pt;

const en: ServicesCopy = {
  index: {
    title: "Custom systems, integrations and SaaS platforms.",
    kicker: "Eduardo Gouveia, Senior Full Stack Developer",
    lead: "I build custom systems, connect tools and develop SaaS platforms. I also work on evolving existing products. The shape of the work depends on what needs to work in your operation.",
    startTitle: "Where does it make sense to start?",
    open: "See the service",
    decisionTitle: "Not sure whether you need to build or integrate?",
    decision: [
      "Start with the task that is hard today. If your tools serve the operation but don’t exchange information, an integration can be the starting point. If the process needs its own rules and controls, it makes sense to consider a custom system.",
      "When other people will use the software as a product, the scope also has to consider the user journey, access and what goes into the first version. I can assess that path based on the project’s context.",
    ],
    casesKicker: "From the portfolio",
    casesTitle: "Three examples to explore.",
    casesAll: "See the full portfolio",
    closingTitle: "Tell me what needs to work.",
    closingBody: "Describe the goal, what already exists and which tools your company uses. With that context, I assess the technical approach and what needs to be defined for a proposal.",
  },
  detail: {
    scopeLink: "Explore scope examples",
    proofRole: "Eduardo Gouveia, Senior Full Stack Developer",
    scopeNote: "These are examples of deliverables and acceptance criteria. The proposal defines which ones go into your project and how they will be checked.",
    accept: "Acceptance example:",
    caseKicker: "From the portfolio",
    caseTitle: "A related solution.",
    caseLink: (name: string) => `See the ${name} case`,
    allProjects: "See all projects",
    processTitle: "How I organize the work.",
    questionsTitle: "Before defining the project.",
    briefIntro: "To start the conversation, it helps to gather:",
    workanaChat: "If we are already talking on Workana, send the context in the same chat.",
    otherTitle: "Does your project need something else?",
  },
  checked: "Profile checked on",
  projects: "completed projects",
};

export function getServicesCopy(locale: Locale): ServicesCopy {
  return locale === "en" ? en : pt;
}
