import type { Locale } from "@/lib/locale";

/**
 * UI string dictionary. PT is the source of truth (matches the original
 * hardcoded strings verbatim so `/` renders pixel-identical); EN is a
 * professional business translation — not literal.
 */
export const ui: Record<Locale, Record<string, string>> = {
  pt: {
    "hero.proofLabel": "Experiência na Workana",
    "proof.checked": "Dados da Workana conferidos em {date}",
    "about.methodTitle": "Como o trabalho acontece",
    "about.methodBody": "Escopo por escrito, entregas por etapas e validação ao longo do projeto.",
    "skills.intro": "A escolha técnica depende do sistema, das integrações e da manutenção. Explore os projetos em que cada tecnologia aparece.",
    "contact.headline": "Me conte o que precisa construir ou melhorar.",
    "contact.step1Title": "Entender a necessidade",
    "contact.step1Body": "O que precisa funcionar, quem vai usar e quais ferramentas já fazem parte da operação.",
    "contact.step2Title": "Definir a entrega",
    "contact.step2Body": "Escopo, prazo e critérios de aceite combinados por escrito antes de começar.",
    "contact.step3Title": "Desenvolver por etapas",
    "contact.step3Body": "Você acompanha as entregas e valida o que foi combinado ao longo do projeto.",
    "contact.proof": "{projects} projetos realizados · {reviews} avaliações na Workana",
    "case.role": "Minha participação",
    "case.productOutput": "Capacidades do produto",
    "case.profile": "Ver perfil na Workana",
    "case.authorProof": "{projects} projetos realizados · {reviews} avaliações",
    "case.verifiedAt": "Dados conferidos em {date}",
    // Global / shell
    "skip.content": "Pular para o conteúdo",
    "scroll.hint": "role ou use ↓",
    "loading.skip": "[ clique para pular ]",

    // Navbar
    "nav.available": "vamos conversar sobre seu projeto",
    "nav.hire": "Ver perfil",
    "nav.close": "fechar",
    "nav.goTo": "Ir para {label}",

    // Hero
    "hero.brazil": "BRASIL",
    "hero.peakPrefix": "PICO:",
    "hero.projectsPill": "projetos realizados",
    "hero.hireCta": "Ver meu perfil e conversar na Workana",
    "hero.viewProjects": "Ver projetos semelhantes ao seu",

    // Projects section
    "projects.title": "Projetos para necessidades reais",
    "projects.allLink": "Explorar os {count} cases por necessidade",
    "projects.viewCase": "Conhecer o projeto",
    "projects.archiveHeading": "Outros projetos do portfólio",
    "projects.prev": "Projeto anterior",
    "projects.next": "Próximo projeto",
    "projects.nth": "Projeto {n}",

    // About section
    "about.title": "Experiência que você pode conferir",
    "about.delivered": "projetos realizados",
    "about.recurringClients": "clientes recorrentes",
    "about.peakBrazil": "Brasil em TI · pico",
    "about.peakGlobal": "Global em TI · pico",
    "about.reviewsCount": "{count} avaliações",
    "about.metricsHeading": "// métricas que importam",
    "about.reviewsHeading": "O que os clientes relatam",
    "about.verified": "VERIFICADO",
    "about.recurringTag": "recorrente",
    "about.allReviews": "Ver as {count} avaliações na Workana",

    // Skills section
    "skills.title": "Tecnologias aplicadas aos projetos",
    "skills.constellationAria": "Constelação de tecnologias",
    "skills.platforms": "plataformas",
    "skills.usedIn": "usado em:",
    "skills.years": "anos",
    "skills.yearsAbbrev": "a",
    "skills.supportStack": "stack de suporte no dia a dia",

    // Contact section
    "contact.title": "Seu próximo projeto",
    "contact.response": "Envie o contexto do projeto pela Workana. Com essas informações, avalio o caminho técnico e as entregas possíveis.",

    // Case study (labels)
    "case.challenge": "desafio",
    "case.solution": "solução",
    "case.features": "funcionalidades",
    "case.results": "resultado",
    "case.stack": "stack",
    "case.viewLive": "ver ao vivo",
    "case.discuss": "Ver perfil e conversar na Workana",
    "case.viewFull": "ver case completo",
    "case.close": "Fechar case study",

    // Case gallery
    "gallery.screens": "telas do projeto",
    "gallery.enlarge": "ampliar",
    "gallery.enlargeAria": "Ampliar imagem",
    "gallery.screen": "tela",
    "gallery.screenNth": "Tela {n}",
    "gallery.of": "Galeria de {title}",
    "gallery.closeAria": "Fechar galeria",
    "gallery.prevAria": "Anterior",
    "gallery.nextAria": "Próxima",
    "gallery.enlargedSuffix": "ampliada",

    // Case page (breadcrumb / prev-next)
    "casePage.home": "início",
    "casePage.projects": "projetos",
    "casePage.prev": "← case anterior",
    "casePage.next": "próximo case →",

    // Project category display labels (ids stay untranslated in data)
    "category.sistema": "sistema",

    // Ambient audio
    "audio.on": "som on",
    "audio.off": "som off",
    "audio.ariaOn": "Desligar som ambiente",
    "audio.ariaOff": "Ligar som ambiente",

    // Interactive terminal
    "terminal.placeholder": 'digite "help"',
    "terminal.aria": "Terminal interativo — digite help",
  },
  en: {
    "hero.proofLabel": "Workana experience",
    "proof.checked": "Workana data checked on {date}",
    "about.methodTitle": "How we work together",
    "about.methodBody": "Written scope, staged delivery and validation throughout the project.",
    "skills.intro": "The technology depends on the system, its integrations and maintenance needs. Explore the projects that use each tool.",
    "contact.headline": "Tell me what you need to build or improve.",
    "contact.step1Title": "Understand the need",
    "contact.step1Body": "What needs to work, who will use it and which tools your business already relies on.",
    "contact.step2Title": "Define the delivery",
    "contact.step2Body": "Scope, schedule and acceptance criteria agreed in writing before development.",
    "contact.step3Title": "Build in stages",
    "contact.step3Body": "Follow the deliveries and validate the agreed scope throughout the project.",
    "contact.proof": "{projects} completed projects · {reviews} Workana reviews",
    "case.role": "My contribution",
    "case.productOutput": "Product capabilities",
    "case.profile": "View my Workana profile",
    "case.authorProof": "{projects} completed projects · {reviews} reviews",
    "case.verifiedAt": "Data checked on {date}",
    // Global / shell
    "skip.content": "Skip to content",
    "scroll.hint": "scroll or press ↓",
    "loading.skip": "[ click to skip ]",

    // Navbar
    "nav.available": "let’s discuss your project",
    "nav.hire": "View profile",
    "nav.close": "close",
    "nav.goTo": "Go to {label}",

    // Hero
    "hero.brazil": "BRAZIL",
    "hero.peakPrefix": "PEAK:",
    "hero.projectsPill": "completed projects",
    "hero.hireCta": "View my profile and discuss on Workana",
    "hero.viewProjects": "Explore projects like yours",

    // Projects section
    "projects.title": "Projects built around real needs",
    "projects.allLink": "Explore {count} case studies by need",
    "projects.viewCase": "Explore the project",
    "projects.archiveHeading": "More projects from the portfolio",
    "projects.prev": "Previous project",
    "projects.next": "Next project",
    "projects.nth": "Project {n}",

    // About section
    "about.title": "Experience you can check",
    "about.delivered": "completed projects",
    "about.recurringClients": "returning clients",
    "about.peakBrazil": "Brazil IT · peak",
    "about.peakGlobal": "Global IT · peak",
    "about.reviewsCount": "{count} reviews",
    "about.metricsHeading": "// metrics that matter",
    "about.reviewsHeading": "What clients say",
    "about.verified": "VERIFIED",
    "about.recurringTag": "repeat client",
    "about.allReviews": "View all {count} reviews on Workana",

    // Skills section
    "skills.title": "Technology applied to projects",
    "skills.constellationAria": "Technology constellation",
    "skills.platforms": "platforms",
    "skills.usedIn": "used in:",
    "skills.years": "yrs",
    "skills.yearsAbbrev": "y",
    "skills.supportStack": "day-to-day support stack",

    // Contact section
    "contact.title": "Your next project",
    "contact.response": "Share your project context on Workana. I’ll assess the technical approach and possible deliverables.",

    // Case study (labels)
    "case.challenge": "challenge",
    "case.solution": "solution",
    "case.features": "features",
    "case.results": "results",
    "case.stack": "stack",
    "case.viewLive": "view live",
    "case.discuss": "View profile and discuss on Workana",
    "case.viewFull": "view full case",
    "case.close": "Close case study",

    // Case gallery
    "gallery.screens": "project screens",
    "gallery.enlarge": "enlarge",
    "gallery.enlargeAria": "Enlarge image",
    "gallery.screen": "screen",
    "gallery.screenNth": "Screen {n}",
    "gallery.of": "{title} gallery",
    "gallery.closeAria": "Close gallery",
    "gallery.prevAria": "Previous",
    "gallery.nextAria": "Next",
    "gallery.enlargedSuffix": "enlarged",

    // Case page (breadcrumb / prev-next)
    "casePage.home": "home",
    "casePage.projects": "projects",
    "casePage.prev": "← previous case",
    "casePage.next": "next case →",

    // Project category display labels
    "category.sistema": "system",

    // Ambient audio
    "audio.on": "sound on",
    "audio.off": "sound off",
    "audio.ariaOn": "Turn ambient sound off",
    "audio.ariaOff": "Turn ambient sound on",

    // Interactive terminal
    "terminal.placeholder": 'type "help"',
    "terminal.aria": "Interactive terminal — type help",
  },
};

/** Translate a UI key; falls back to PT, then to the key itself. */
export function t(
  locale: Locale,
  key: string,
  params?: Record<string, string | number>
): string {
  let s = ui[locale][key] ?? ui.pt[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      s = s.split(`{${k}}`).join(String(v));
    }
  }
  return s;
}

/**
 * Chapter display labels per locale — indices match `chapters` from
 * constants (ids/ranges keep coming from there).
 */
export const chaptersLabels: Record<Locale, string[]> = {
  pt: ["Início", "Projetos", "Sobre", "Skills", "Contato"],
  en: ["Home", "Projects", "About", "Skills", "Contact"],
};

/** Terminal boot messages per locale (LoadingScreen). */
export const loadingMessagesByLocale: Record<Locale, string[]> = {
  pt: [
    "Inicializando ambiente de execução",
    "Carregando redes neurais",
    "Compilando shaders",
    "Conectando à matrix",
    "Montando sistemas de arquivos",
    "Estabelecendo conexão segura",
    "Renderizando cena 3D",
    "Sistema pronto",
  ],
  en: [
    "Initializing runtime environment",
    "Loading neural networks",
    "Compiling shaders",
    "Connecting to matrix",
    "Mounting file systems",
    "Establishing secure connection",
    "Rendering 3D scene",
    "System ready",
  ],
};

/** Display label for a project category badge (ids stay universal). */
export function categoryLabel(locale: Locale, category: string): string {
  if (locale === "en" && category === "sistema") return t(locale, "category.sistema");
  return category;
}
