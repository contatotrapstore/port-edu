import type { Locale } from "@/lib/locale";

/**
 * UI string dictionary. PT is the source of truth (matches the original
 * hardcoded strings verbatim so `/` renders pixel-identical); EN is a
 * professional business translation — not literal.
 */
export const ui: Record<Locale, Record<string, string>> = {
  pt: {
    // Global / shell
    "skip.content": "Pular para o conteúdo",
    "scroll.hint": "role ou use ↓",

    // Navbar
    "nav.available": "disponível p/ projetos",
    "nav.hire": "Contratar",
    "nav.close": "fechar",
    "nav.goTo": "Ir para {label}",

    // Hero
    "hero.brazil": "BRASIL",
    "hero.projectsPill": "Projetos",
    "hero.hireCta": "CONTRATAR VIA WORKANA",
    "hero.viewProjects": "ver_projetos",

    // Projects section
    "projects.title": "Projetos em destaque",
    "projects.allLink": "{count} de {total}+ entregues — ver todos ↗",
    "projects.viewCase": "ver case",
    "projects.prev": "Projeto anterior",
    "projects.next": "Próximo projeto",
    "projects.nth": "Projeto {n}",

    // About section
    "about.title": "Sobre",
    "about.delivered": "projetos entregues",
    "about.recurringClients": "clientes recorrentes",
    "about.rankBrazil": "ranking Brasil",
    "about.rankGlobal": "ranking Global",
    "about.metricsHeading": "// métricas que importam",
    "about.reviewsHeading": "// avaliações verificadas",
    "about.verified": "VERIFICADO",
    "about.recurringTag": "recorrente",
    "about.allReviews": "ver todas as {count} avaliações",

    // Skills section
    "skills.title": "Skills",
    "skills.constellationAria": "Constelação de tecnologias",
    "skills.platforms": "plataformas",
    "skills.usedIn": "usado em:",
    "skills.years": "anos",
    "skills.yearsAbbrev": "a",
    "skills.supportStack": "stack de suporte no dia a dia",

    // Contact section
    "contact.title": "Contato",
    "contact.accepting": "aceitando novos projetos",
    "contact.headlinePre": "Vamos construir o próximo",
    "contact.headlineAccent": "SaaS de sucesso",
    "contact.headlinePost": "?",
    "contact.response": "resposta em até 2h úteis · trabalho com clientes no mundo todo",
    "contact.card1Title": "★ Sênior de verdade",
    "contact.card1Sub": "Top {rank} Brasil · nível {level}",
    "contact.card2Title": "⚡ Resposta rápida",
    "contact.card2Sub": "retorno em ~2h úteis",
    "contact.card3Title": "↻ Clientes que voltam",
    "contact.card3Sub": "{count} recorrentes",
    "contact.hireEyebrow": "★ hero · top {rank} brasil · {rating}/5",
    "contact.hireCta": "CONTRATAR VIA WORKANA",
    "contact.hireSub": "{reviews} avaliações · {recurring} clientes recorrentes",
    "contact.echo": "Vamos Conversar",
    "contact.pitch": "Tem um projeto em mente? Vamos transformar sua ideia em realidade.",

    // Case study (labels)
    "case.challenge": "desafio",
    "case.solution": "solução",
    "case.features": "funcionalidades",
    "case.results": "resultado",
    "case.stack": "stack",
    "case.viewLive": "ver ao vivo",
    "case.discuss": "discutir um projeto assim",
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
    // Global / shell
    "skip.content": "Skip to content",
    "scroll.hint": "scroll or press ↓",

    // Navbar
    "nav.available": "available for projects",
    "nav.hire": "Hire me",
    "nav.close": "close",
    "nav.goTo": "Go to {label}",

    // Hero
    "hero.brazil": "BRAZIL",
    "hero.projectsPill": "Projects",
    "hero.hireCta": "HIRE ME ON WORKANA",
    "hero.viewProjects": "view_projects",

    // Projects section
    "projects.title": "Featured projects",
    "projects.allLink": "{count} of {total}+ delivered — view all ↗",
    "projects.viewCase": "view case",
    "projects.prev": "Previous project",
    "projects.next": "Next project",
    "projects.nth": "Project {n}",

    // About section
    "about.title": "About",
    "about.delivered": "projects delivered",
    "about.recurringClients": "returning clients",
    "about.rankBrazil": "rank in Brazil",
    "about.rankGlobal": "global rank",
    "about.metricsHeading": "// metrics that matter",
    "about.reviewsHeading": "// verified reviews",
    "about.verified": "VERIFIED",
    "about.recurringTag": "repeat client",
    "about.allReviews": "view all {count} reviews",

    // Skills section
    "skills.title": "Skills",
    "skills.constellationAria": "Technology constellation",
    "skills.platforms": "platforms",
    "skills.usedIn": "used in:",
    "skills.years": "yrs",
    "skills.yearsAbbrev": "y",
    "skills.supportStack": "day-to-day support stack",

    // Contact section
    "contact.title": "Contact",
    "contact.accepting": "accepting new projects",
    "contact.headlinePre": "Let's build the next",
    "contact.headlineAccent": "breakout SaaS",
    "contact.headlinePost": "?",
    "contact.response": "replies within 2 business hours · working with clients worldwide",
    "contact.card1Title": "★ Genuinely senior",
    "contact.card1Sub": "Top {rank} in Brazil · {level} level",
    "contact.card2Title": "⚡ Fast response",
    "contact.card2Sub": "replies in ~2 business hours",
    "contact.card3Title": "↻ Clients who come back",
    "contact.card3Sub": "{count} returning clients",
    "contact.hireEyebrow": "★ hero · top {rank} brazil · {rating}/5",
    "contact.hireCta": "HIRE ME ON WORKANA",
    "contact.hireSub": "{reviews} reviews · {recurring} returning clients",
    "contact.echo": "Let's Talk",
    "contact.pitch": "Have a project in mind? Let's turn your idea into reality.",

    // Case study (labels)
    "case.challenge": "challenge",
    "case.solution": "solution",
    "case.features": "features",
    "case.results": "results",
    "case.stack": "stack",
    "case.viewLive": "view live",
    "case.discuss": "discuss a project like this",
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

/** Display label for a project category badge (ids stay universal). */
export function categoryLabel(locale: Locale, category: string): string {
  if (locale === "en" && category === "sistema") return t(locale, "category.sistema");
  return category;
}
