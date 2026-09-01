export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  image: string;
  /** Stylized cinematic cover for the carousel card (real screenshot stays in the case). */
  cover?: string;
  /** Extra real screenshots shown as a gallery inside the case study. */
  gallery?: string[];
  url?: string;
  github?: string;
  category: "saas" | "ecommerce" | "mobile" | "sistema" | "web";
  output?: string[];
  // Case study (conteúdo real do portfólio Workana, quando disponível)
  overview?: string;
  problem?: string;
  approach?: string;
  features?: string[];
  role?: string;
  year?: string;
  /** Destaque na lista editorial da home; os demais entram na grade de arquivo. */
  featured?: boolean;
}

export interface Skill {
  name: string;
  category: "frontend" | "backend" | "devops" | "tools";
  level: number;
  years: number;
  hot?: boolean;
}

export interface SiteConfig {
  name: string;
  title: string;
  subtitle: string;
  bio: string;
  social: {
    github: string;
    linkedin: string;
    email: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "Eduardo Gouveia",
  title: "FULL STACK SENIOR | SAAS & SISTEMAS",
  subtitle: "Construindo o futuro, um commit por vez.",
  bio: "Desenvolvedor Full Stack Sênior. Transformo ideias em produtos reais — da arquitetura ao deploy — com foco em SaaS, dashboards e sistemas com IA. 176 projetos entregues e 37 clientes que voltam: comunicação clara, prazos cumpridos e código que escala. Já cheguei ao Top 1 do Brasil e ao Top 3 Global em TI na Workana — nível HERO.",
  social: {
    github: "https://github.com/GouveiaZx",
    linkedin: "",
    email: "",
  },
};

export const workanaStats = {
  projectsCompleted: 176,
  projectsRunning: 11,
  clientReviews: 179,
  recurringClients: 37,
  rating: 4.74,
  ratingMax: 5,
  certifications: 7,
  hourlyRate: 200,
  // Ranking de TI é volátil — exibir sempre como pico de carreira, nunca como posição atual
  peakRankITBrazil: 1,
  peakRankITGlobal: 3,
  overallRank: 6,
  totalProfessionals: "14.78M",
  level: "HERO",
  memberSince: "Fev/2023",
  workanaProfileUrl: "https://www.workana.com/freelancer/89c9896a5874018ef858f71acf0f5dc6",
};

// Metrics de resultado para clientes — todas verificáveis no perfil Workana
export const resultMetrics = [
  { value: "176", label: "projetos entregues", description: "em 3 anos e meio de Workana" },
  { value: "37", label: "clientes recontrataram", description: "e seguem voltando" },
  { value: "4.74/5", label: "nota média", description: "179 avaliações verificadas" },
];

// Avaliações reais verificadas (Workana) — texto verbatim do perfil
export const testimonials = [
  {
    text: "Tive o prazer de trabalhar com o Eduardo recentemente no desenvolvimento da Useconvoo e o impacto foi imediato. Ele demonstrou domínio total de infraestrutura e agilidade para resolver problemas complexos de sincronia de ambientes e performance. Um profissional extremamente assertivo, organizado e que cumpre prazos. Recomendo muito!",
    author: "Useconvoo",
    project: "Sênior Fullstack — SaaS de Saneamento (Next.js 14 + Evolution API)",
    projectType: "SaaS",
    date: "Abr/2026",
    verified: true,
    recurring: false,
    rating: 5,
  },
  {
    text: "Eduardo conduziu perfeitamente o projeto, concluindo antes do prazo e com muita eficiência. Tenho mais de 20 anos trabalhando com projetos web e poucas vezes encontrei profissionais como Eduardo.",
    author: "Fernando Esteves",
    project: "Plataforma de busca estilo chat com IA (Full-Stack)",
    projectType: "Plataforma IA",
    date: "Mai/2026",
    verified: true,
    recurring: false,
    rating: 5,
  },
  {
    text: "Muito objetivo e prático — entendeu rápido o que estávamos precisando e propôs boas melhorias ao projeto.",
    author: "Arthur Versolato",
    project: "Agente de IA para monitoramento de WhatsApp e Q&A de obras",
    projectType: "Agente IA",
    date: "Mai/2026",
    verified: true,
    recurring: false,
    rating: 5,
  },
  {
    text: "Excelente profissional. Demonstrou alto nível de comprometimento desde o início do projeto, sempre mantendo comunicação clara, objetiva e ágil. Entendeu perfeitamente as demandas técnicas, inclusive pontos mais complexos da plataforma, e apresentou soluções inteligentes e bem estruturadas.",
    author: "José Ricardo Silva de Sousa",
    project: "Aplicativo corporativo completo (Android, iOS e painel web)",
    projectType: "App Corporativo",
    date: "Mar/2026",
    verified: true,
    recurring: false,
    rating: 5,
  },
  {
    text: "Contratei o Eduardo para desenvolver um sistema SaaS, dividimos em 3 fases para melhor organização. A fase 1 foi concluída com êxito, muito rápido, fácil comunicação, tudo que solicitei foi prontamente atendido.",
    author: "Leonardo Flores",
    project: "Sistema SaaS Lokagenda — gestão de locações e eventos",
    projectType: "SaaS",
    date: "Abr/2026",
    verified: true,
    recurring: false,
    rating: 5,
  },
  {
    text: "I found his work very professional: the style, typography, colours, logo. All was very premium and I appreciate it.",
    author: "Alexandre Rodrigues",
    project: "Website multilíngue em Framer (empresa de painéis solares)",
    projectType: "Web Multilíngue",
    date: "Mai/2026",
    verified: true,
    recurring: false,
    rating: 5,
  },
  {
    text: "Obrigado Eduardo, o trabalho ficou incrível. Espero trabalharmos juntos em novos projetos no futuro.",
    author: "Júlio Abeilard da Silva",
    project: "Curso de vendas na Hotmart + página de vendas otimizada",
    projectType: "Página de Vendas",
    date: "Jun/2026",
    verified: true,
    recurring: false,
    rating: 5,
  },
  {
    text: "Excelente profissional, entende com facilidade a ideia, eficiente no desenvolvimento, recomendo com certeza. Com certeza um ótimo investimento.",
    author: "Milton Souza",
    project: "Site de notícias e revista digital com painel admin e IA",
    projectType: "Portal + IA",
    date: "Abr/2026",
    verified: true,
    recurring: false,
    rating: 5,
  },
  {
    text: "Me entregou o projeto antes do prazo. Me deu muitas ideias que melhoraram muito o projeto inicial. Muito experiente e muito fácil de lidar. Recomendo mil vezes.",
    author: "Tales Sales",
    project: "Plataforma usando o ChatGPT",
    projectType: "Plataforma GPT",
    date: "Set/2025",
    verified: true,
    recurring: false,
    rating: 5,
  },
  {
    text: "Excelente profissional, entregou muito mais que eu esperava. Inclusive entregou vídeos e arquivos adicionais explicando cada etapa de como resolver qualquer problema futuramente. Super recomendo.",
    author: "Arthur Marwin Morcerf",
    project: "Site institucional de empresa",
    projectType: "Site Institucional",
    date: "2025",
    verified: true,
    recurring: false,
    rating: 5,
  },
];

export const projects: Project[] = [
  {
    id: "pace",
    featured: true,
    title: "PACE",
    description:
      "Sistema clínico de neurofeedback para psicólogos: sessões guiadas com jogos 3D controlados por ondas cerebrais (EEG) e gestão completa do consultório.",
    overview:
      "Plataforma clínica para psicólogos e terapeutas realizarem tratamentos de neurofeedback. O paciente usa um headset EEG (Muse/NeuroSky) que captura ondas cerebrais em tempo real via Bluetooth; os sinais de atenção e meditação controlam jogos 3D terapêuticos, recompensando os estados mentais desejados e criando neuroplasticidade por condicionamento operante.",
    problem:
      "Clínicas de neurofeedback não tinham um sistema único para conduzir sessões, controlar protocolos e acompanhar a evolução dos pacientes.",
    approach:
      "SaaS multi-clínica com área do psicólogo (dashboard, agendamento, protocolos, relatórios) e área do paciente (sessões remotas, evolução), sessões guiadas automatizadas (protocolo de 12 semanas) e processamento de EEG em tempo real no navegador.",
    features: [
      "Integração Bluetooth com headsets Muse 2/S e NeuroSky",
      "28 jogos 3D terapêuticos (modos foco e relaxamento)",
      "Sessões guiadas automatizadas — protocolo de 12 semanas",
      "Dashboard clínico com evolução por paciente",
      "Relatórios clínicos em PDF para prontuário",
      "Multi-clínica com permissões por perfil",
    ],
    tech: ["React.js", "Next.js", "Node.js", "IA"],
    image: "/images/projects/pace.webp",
    cover: "/images/projects/covers/pace.webp",
    gallery: ["/images/projects/pace-1.webp", "/images/projects/pace-2.webp", "/images/projects/pace-3.webp", "/images/projects/pace-4.webp", "/images/projects/pace-5.webp", "/images/projects/pace-6.webp"],
    url: "https://neuroone.jogosadm.com.br/clinica",
    year: "2026",
    category: "saas",
    output: [
      "gestão clínica completa",
      "feedback EEG em tempo real",
      "relatórios automatizados para prontuário",
    ],
  },
  {
    id: "revix",
    featured: true,
    title: "Revix",
    description:
      "Rede social automotiva com mapa interativo de eventos, feed, comunidades e gestão de encontros — conectando entusiastas e clubes da região.",
    overview:
      "Plataforma social automotiva desenvolvida para conectar entusiastas, clubes e encontros em uma experiência digital moderna e intuitiva, reunindo mapa interativo com eventos próximos, feed social, criação e gerenciamento de encontros, comunidades, notificações e perfis personalizados.",
    problem:
      "A cultura automotiva se organizava em grupos dispersos, sem um lugar único para descobrir encontros próximos e reunir a comunidade.",
    approach:
      "Produto escalável pensado com foco em performance, experiência mobile e identidade visual forte, aproximando usuários da sua região por meio de mapa de eventos e comunidades.",
    features: [
      "Mapa interativo com eventos próximos",
      "Feed social",
      "Criação e gerenciamento de encontros",
      "Comunidades e perfis personalizados",
      "Notificações",
    ],
    tech: ["React.js", "Next.js", "PHP", "iOS", "Android"],
    image: "/images/projects/revix.webp",
    cover: "/images/projects/covers/revix.webp",
    url: "https://revix.app.br/",
    year: "2026",
    category: "mobile",
    output: [
      "comunidade automotiva reunida num app",
      "descoberta de eventos por proximidade",
      "produto escalável com foco em mobile",
    ],
  },
  {
    id: "neuroialab",
    featured: true,
    title: "NeuroIA Lab",
    description:
      "SaaS de saúde mental com 19 assistentes de IA especializados para psicólogos, fonoaudiólogos e terapeutas.",
    overview:
      "Plataforma SaaS que democratiza o acesso a assistentes de IA especializados em psicologia e áreas afins, voltada a psicólogos, psicopedagogos, fonoaudiólogos e terapeutas ocupacionais.",
    problem:
      "Profissionais de saúde mental gastavam horas em tarefas clínicas repetitivas (laudos, estruturação de sessões, revisão de casos) sem apoio especializado.",
    approach:
      "SaaS com 19 assistentes de IA especializados que apoiam a prática clínica — da formulação de rotas terapêuticas à elaboração de laudos psicológicos.",
    features: [
      "19 assistentes de IA especializados",
      "Formulação de rotas terapêuticas",
      "Revisão de casos clínicos",
      "Elaboração de laudos psicológicos",
      "Estruturação de sessões e reestruturação cognitiva",
      "Orientação ética profissional",
    ],
    tech: ["TypeScript", "Node.js", "IA", "SaaS"],
    image: "/images/projects/neuroialab.webp",
    cover: "/images/projects/covers/neuroialab.webp",
    gallery: ["/images/projects/neuroialab-1.webp", "/images/projects/neuroialab-2.webp", "/images/projects/neuroialab-3.webp"],
    url: "https://www.neuroialab.com.br/store",
    year: "2025",
    category: "saas",
    output: [
      "19 assistentes de IA clínicos",
      "apoio à decisão terapêutica",
      "ganho de produtividade clínica",
    ],
  },
  {
    id: "anamex",
    featured: true,
    title: "AnamNex",
    description:
      "SaaS médico para plantonistas com IA: leitura automatizada de ECG e análise de imagens clínicas, com laudos gerados automaticamente.",
    overview:
      "SaaS médico para apoiar plantonistas no atendimento diário com IA aplicada à prática clínica — foco em agilidade, precisão diagnóstica e centralização das informações num ambiente seguro e intuitivo.",
    problem:
      "No plantão, médicos precisam de decisões rápidas e precisas, mas interpretar exames (como ECG) e centralizar dados clínicos era lento e fragmentado.",
    approach:
      "Plataforma que processa arquivos técnicos de ECG (.mat/.hea) e imagens; a IA interpreta os sinais cardíacos e gera laudos clínicos automaticamente, além de analisar imagens médicas (feridas, lesões, dermatologia).",
    features: [
      "Leitura automatizada de ECG com IA (.mat/.hea e imagens)",
      "Geração automática de laudo clínico",
      "Identificação de arritmias e padrões cardíacos",
      "Análise de imagens médicas (feridas/lesões/derma)",
      "Centralização das informações clínicas",
      "Ambiente seguro e intuitivo",
    ],
    tech: ["React.js", "PHP", "JavaScript", "IA"],
    image: "/images/projects/anamex.webp",
    cover: "/images/projects/covers/anamex.webp",
    gallery: ["/images/projects/anamex-1.webp", "/images/projects/anamex-2.webp", "/images/projects/anamex-3.webp", "/images/projects/anamex-4.webp", "/images/projects/anamex-5.webp"],
    year: "2026",
    category: "saas",
    output: [
      "laudos de ECG automatizados",
      "apoio diagnóstico com IA",
      "decisão mais rápida no plantão",
    ],
  },
  {
    id: "connote",
    featured: true,
    title: "ConNote",
    description:
      "App nativo (Windows/macOS) de produtividade com IA: notas inteligentes, chat multi-modelo e copiloto flutuante com transcrição em tempo real.",
    overview:
      "Aplicativo nativo premium para Windows e macOS focado em produtividade com IA integrada profundamente ao fluxo de trabalho — não apenas um chat.",
    problem:
      "Ferramentas de notas e IA viviam separadas do fluxo real de trabalho, sem capturar contexto (áudio, reuniões) nem permitir comparar modelos.",
    approach:
      "App nativo que une notas inteligentes (a IA entende e gera conteúdo a partir das anotações), chat multi-modelo e um copiloto 'always on top' que captura o áudio do sistema, transcreve em tempo real e salva resumos direto nas notas.",
    features: [
      "Notas inteligentes com IA generativa",
      "Chat multi-modelo (comparar IAs no mesmo lugar)",
      "Copiloto flutuante always-on-top",
      "Transcrição do áudio do sistema em tempo real",
      "Resumos automáticos salvos nas notas",
      "App nativo de alta performance + modelo de assinatura",
    ],
    tech: ["JavaScript", "Electron", "IA", "Desktop"],
    image: "/images/projects/connote.webp",
    cover: "/images/projects/covers/connote.webp",
    gallery: ["/images/projects/connote-1.webp", "/images/projects/connote-2.webp", "/images/projects/connote-3.webp"],
    category: "sistema",
    output: [
      "produtividade com IA no fluxo de trabalho",
      "transcrição + resumos automáticos",
      "produto nativo pronto para comercialização",
    ],
  },
  {
    id: "clinafy",
    featured: true,
    title: "Clinafy",
    description:
      "Sistema para profissionais de saúde mental: prontuário eletrônico com IA, agenda inteligente, teleconsulta e gestão financeira — tudo em um só lugar.",
    overview:
      "Plataforma SaaS para profissionais e clínicas de saúde mental que reúne prontuário eletrônico com IA, agenda inteligente, teleconsulta integrada e gestão financeira completa. Mais de 500 profissionais e 50.000 consultas.",
    problem:
      "Profissionais de saúde mental usavam ferramentas fragmentadas para prontuário, agenda, teleconsulta e financeiro — sem um sistema único.",
    approach:
      "SaaS que centraliza prontuário eletrônico com IA (transcrição automática e insights), agendamento inteligente, teleconsulta e gestão financeira, com área do paciente e app instalável (PWA).",
    features: [
      "Prontuário eletrônico com IA (transcrição + insights)",
      "Agenda inteligente",
      "Teleconsulta integrada",
      "Avaliações clínicas padronizadas",
      "Gestão financeira completa",
      "Área do paciente + app instalável (PWA)",
    ],
    tech: ["React", "TypeScript", "Node.js", "IA"],
    image: "/images/projects/clinafy.webp",
    cover: "/images/projects/covers/clinafy.webp",
    gallery: ["/images/projects/clinafy-1.webp", "/images/projects/clinafy-2.webp"],
    url: "https://clinafy.com",
    category: "saas",
    output: [
      "+500 profissionais ativos",
      "+50.000 consultas realizadas",
      "4.9/5 de avaliação",
    ],
  },
  {
    id: "cacaostore",
    featured: true,
    title: "Cacao Store",
    description:
      "Loja virtual completa em Shopify, responsiva, desenvolvida sob medida para o cliente.",
    overview:
      "E-commerce responsivo construído na plataforma Shopify conforme o pedido do cliente — projeto contratado e entregue via Workana.",
    problem:
      "O cliente precisava de uma loja virtual profissional, responsiva e fácil de gerenciar no dia a dia.",
    approach:
      "Loja Shopify personalizada e responsiva, com catálogo e checkout prontos para vender e gestão simples para o cliente.",
    features: [
      "Loja Shopify personalizada",
      "Design responsivo (mobile-first)",
      "Catálogo e checkout integrados",
      "Gestão de produtos e estoque pelo cliente",
    ],
    tech: ["Shopify", "Liquid", "JavaScript", "Responsive"],
    image: "/images/projects/cacaostore.webp",
    cover: "/images/projects/covers/cacaostore.webp",
    gallery: ["/images/projects/cacaostore-1.webp", "/images/projects/cacaostore-2.webp", "/images/projects/cacaostore-3.webp"],
    url: "https://cacaostore.com.br/",
    category: "ecommerce",
    output: [
      "loja no ar e vendendo",
      "design responsivo premium",
      "gestão simples pelo cliente",
    ],
  },
  {
    // Projeto interno (não público) — sem case/página, fica por último.
    id: "click",
    featured: true,
    title: "Click",
    description:
      "Sistema Interno com Dashboard Mobile. Aplicativo de gestão interna com dashboard responsivo e notificações em tempo real.",
    problem:
      "A gestão interna exigia acesso mobile com notificações em tempo real e integração entre sistemas.",
    approach:
      "App de gestão mobile-first com notificações em tempo real e integração multi-sistema.",
    tech: ["JavaScript", "React.js", "Node.js", "MongoDB"],
    image: "/images/projects/click.webp",
    cover: "/images/projects/covers/click.webp",
    category: "mobile",
    output: [
      "notificações em tempo real",
      "dashboard mobile-first",
      "integração multi-sistema",
    ],
  },
  // ---- Portfólio completo (Workana) — mockups e descrições do perfil ----
  {
    id: "blackinbot",
    title: "BlackinBot",
    description:
      "SaaS completo para criar, automatizar e gerir bots de monetização no Telegram: venda de acesso a grupos VIP com pagamento integrado e controle de assinaturas.",
    overview:
      "Plataforma SaaS para criação, automação e gestão de bots de monetização no Telegram, permitindo que criadores de conteúdo vendam acesso a grupos e canais VIP com pagamentos integrados, controle de assinaturas e gestão centralizada.",
    problem:
      "Criadores de conteúdo controlavam manualmente a venda e a liberação de acesso a grupos VIP, um fluxo que não escalava e consumia operação todo dia.",
    approach:
      "Arquitetura desacoplada entre frontend e backend, com dashboard web para configurar bots e planos, bots do Telegram 100% automatizados, pagamentos via Pix/boleto/cartão e webhooks para confirmação instantânea.",
    features: [
      "Criação e configuração de bots pelo painel",
      "Planos de assinatura personalizáveis",
      "Controle automático de entrada e saída em grupos VIP",
      "Pagamentos via Pix, boleto e cartão com webhooks",
      "Notificações de vencimento e renovação",
      "Relatórios e analytics em tempo real",
      "Autenticação com Supabase Auth + JWT e Row Level Security",
    ],
    tech: ["Next.js", "TypeScript", "Python", "Supabase"],
    image: "/images/projects/blackinbot.webp",
    cover: "/images/projects/covers/blackinbot.webp",
    year: "2026",
    category: "saas",
    output: [
      "venda e liberação de acesso automatizadas",
      "operação manual praticamente eliminada",
      "estrutura escalável pronta para produção",
    ],
  },
  {
    id: "clubeazul",
    title: "Clube Azul",
    description:
      "SaaS de gestão para clube de benefícios: estipulantes, contratos, planos, comissões e cobranças automatizadas — substituindo sistemas legados.",
    overview:
      "Plataforma web completa para centralizar e modernizar a operação de um clube de benefícios, substituindo sistemas legados e reunindo diferentes processos administrativos em um único ambiente, em modelo SaaS com múltiplas entidades e níveis de acesso.",
    problem:
      "A operação rodava sobre sistemas antigos e processos fragmentados, sem um ambiente único para administrar estipulantes, contratos, comissões e cobranças.",
    approach:
      "SaaS multi-entidade com gestão de estipulantes, subestipulantes, empresas clientes, segurados e corretores, regras configuráveis de comissionamento, integração com a Iugu para boletos e atualização de pagamentos, e importação/exportação de dados.",
    features: [
      "Gestão de estipulantes, subestipulantes, clientes, segurados e corretores",
      "Contratos, condições, coberturas e planos",
      "Tabelas de preços configuráveis e regras de comissionamento",
      "Integração com a Iugu para cobranças e boletos",
      "Importação via Excel e exportação de relatórios",
      "Emissão de certificados e documentos",
      "Portal para consulta, simulação e contratação de planos",
    ],
    tech: ["PHP", "Laravel", "MySQL", "API"],
    image: "/images/projects/clubeazul.webp",
    cover: "/images/projects/covers/clubeazul.webp",
    year: "2026",
    category: "saas",
    output: [
      "sistemas legados substituídos",
      "processo financeiro automatizado",
      "operação centralizada e escalável",
    ],
  },
  {
    id: "corpxbank",
    title: "CorpxBank",
    description:
      "App bancário mobile (iOS e Android) que encapsula a plataforma de internet banking em experiência nativa, com leitura de QR Code e boletos pela câmera.",
    overview:
      "Aplicativo mobile multiplataforma desenvolvido para encapsular uma plataforma de internet banking em uma experiência nativa, garantindo mais performance, segurança e integração com recursos do dispositivo. Construído com React Native + Expo, com acesso completo ao sistema bancário via WebView segura.",
    problem:
      "O internet banking existia apenas na web: faltava presença nas lojas, acesso aos recursos do aparelho e a fluidez que o cliente espera no celular.",
    approach:
      "App React Native + Expo com WebView segura mantendo a identidade visual original, sessão persistente, permissões nativas de câmera/armazenamento/áudio e publicação completa para Android e iOS.",
    features: [
      "Integração completa do internet banking via WebView",
      "Login seguro com persistência de sessão",
      "Leitura de QR Code e boletos pela câmera",
      "Gerenciamento de permissões nativas",
      "Tratamento de cookies e autenticação",
      "Splash screen personalizada e alertas nativos",
      "Publicação para Android e iOS (TestFlight / App Store)",
    ],
    tech: ["React Native", "TypeScript", "Expo", "Kotlin"],
    image: "/images/projects/corpxbank.webp",
    cover: "/images/projects/covers/corpxbank.webp",
    year: "2026",
    category: "mobile",
    output: [
      "app publicado nas duas lojas",
      "builds estáveis após padronização de ambiente",
      "recursos nativos sem perder a identidade original",
    ],
  },
  {
    id: "rei",
    title: "Rei",
    description:
      "Sistema de gestão de obras civis de infraestrutura telecom: etapas, tarefas, responsáveis, SLAs e dependências num painel único.",
    overview:
      "Plataforma web para centralizar a gestão de obras civis de infraestrutura de telecomunicações, com controle de etapas, tarefas, responsáveis, SLAs, dependências, lembretes, notificações internas e painel administrativo.",
    problem:
      "O acompanhamento das obras dependia de controles manuais, sem visibilidade do andamento nem padronização dos processos internos.",
    approach:
      "Sistema web que substitui os controles manuais, permitindo acompanhar cada obra por etapas, organizar processos internos e configurar tarefas diretamente pelo admin.",
    features: [
      "Controle de etapas, tarefas e responsáveis",
      "SLAs e dependências entre atividades",
      "Lembretes e notificações internas",
      "Painel administrativo com configuração de tarefas",
      "Visibilidade do andamento de cada obra",
    ],
    tech: ["Next.js", "Node.js", "PostgreSQL", "React Native"],
    image: "/images/projects/rei.webp",
    cover: "/images/projects/covers/rei.webp",
    year: "2026",
    category: "sistema",
    output: [
      "controles manuais substituídos",
      "visibilidade da operação em tempo real",
      "processos internos padronizados",
    ],
  },
  {
    id: "passagenseuropa",
    title: "Passagens Europa",
    description:
      "CRM sob medida que centraliza a operação comercial: leads, funil, WhatsApp, cotações, financeiro, comissões e automações com apoio de IA.",
    overview:
      "CRM desenvolvido sob medida para centralizar toda a operação comercial da Passagens Europa, reunindo gestão de leads, funil de vendas, atendimento via WhatsApp, cotações, vendas, financeiro, relatórios, comissões e automações em uma única plataforma.",
    problem:
      "A operação comercial estava espalhada por ferramentas separadas, sem um funil único nem histórico consolidado por cliente.",
    approach:
      "Plataforma única integrando atendimento, funil e financeiro, com recursos de inteligência artificial para apoiar o atendimento, a análise de clientes e a tomada de decisão da equipe.",
    features: [
      "Gestão de leads e funil de vendas",
      "Atendimento integrado via WhatsApp",
      "Cotações, vendas e financeiro",
      "Relatórios e gestão de comissões",
      "Automações comerciais",
      "IA para análise de clientes e apoio à decisão",
    ],
    tech: ["React.js", "REST API", "SQL", "IA"],
    image: "/images/projects/passagenseuropa.webp",
    cover: "/images/projects/covers/passagenseuropa.webp",
    year: "2026",
    category: "saas",
    output: [
      "operação comercial centralizada",
      "atendimento e funil no mesmo lugar",
      "decisão apoiada por IA",
    ],
  },
  {
    id: "ciliosclick",
    title: "Cilios Click",
    description:
      "Plataforma com IA para profissionais de extensão de cílios: simulação visual, agenda, anamnese digital e gestão administrativa num só lugar.",
    overview:
      "Plataforma digital desenvolvida para profissionais da área de extensão de cílios, reunindo inteligência artificial, simulação visual, agenda, anamnese digital e gestão administrativa em uma única solução, com o objetivo de tornar o atendimento mais visual, moderno e profissional.",
    problem:
      "As profissionais dependiam de ferramentas soltas para agenda, ficha de anamnese e comunicação visual do resultado com a cliente.",
    approach:
      "Solução única que junta IA e simulação visual do resultado à gestão do atendimento — agenda, anamnese digital e administração do negócio.",
    features: [
      "Simulação visual do resultado com IA",
      "Agenda de atendimentos",
      "Anamnese digital",
      "Gestão administrativa do negócio",
    ],
    tech: ["Next.js", "React.js", "Node.js", "IA"],
    image: "/images/projects/ciliosclick.webp",
    cover: "/images/projects/covers/ciliosclick.webp",
    year: "2026",
    category: "saas",
    output: [
      "atendimento mais visual para a cliente",
      "agenda e anamnese digitalizadas",
      "gestão do negócio num só lugar",
    ],
  },
  {
    id: "neuroone",
    title: "NeuroOne",
    description:
      "Plataforma web de neurofeedback com jogos 3D (Three.js) controlados por EEG, com módulos para empresas, escolas e clínicas.",
    overview:
      "Plataforma web para treinamento cognitivo via neurofeedback, combinando leitura de ondas cerebrais (EEG) com jogos 3D interativos para atenção, foco e relaxamento. Quanto maior o foco/relaxamento do usuário, melhor a performance no jogo — um ciclo de feedback que treina o cérebro naturalmente.",
    problem:
      "Treinar foco e relaxamento de forma engajante exigia unir EEG, jogos e acompanhamento num só lugar, para públicos diferentes.",
    approach:
      "PWA multi-perfil (admin/profissional/paciente) com 28 jogos 3D em Three.js e três módulos: Empresas (bem-estar corporativo), Escolas (painel do professor) e Clínicas (prontuário e protocolos de 12 semanas).",
    features: [
      "28 jogos 3D em Three.js (modos foco e relaxamento)",
      "Módulos Empresas, Escolas e Clínicas",
      "Dashboard com métricas EEG em tempo real",
      "Multi-perfil: admin, profissional, paciente/aluno",
      "PWA responsivo (desktop/tablet/mobile)",
      "Relatórios em PDF e backups automáticos",
    ],
    tech: ["Three.js", "JavaScript", "PHP", "PWA"],
    image: "/images/projects/neuroone.webp",
    cover: "/images/projects/covers/neuroone.webp",
    gallery: ["/images/projects/neuroone-1.webp", "/images/projects/neuroone-2.webp", "/images/projects/neuroone-3.webp", "/images/projects/neuroone-4.webp", "/images/projects/neuroone-5.webp"],
    url: "https://neuroone.jogosadm.com.br",
    year: "2025",
    category: "web",
    output: [
      "treino cognitivo gamificado",
      "métricas EEG em tempo real",
      "PWA multi-perfil",
    ],
  },
  {
    id: "focus",
    title: "Focus",
    description:
      "Plataforma web de produtividade que transforma metas em rotina: organização por áreas, tipos de medição e agenda integrada.",
    overview:
      "Plataforma web de produtividade desenvolvida para organizar metas, acompanhar progresso e transformar objetivos em uma rotina prática de execução, reunindo criação de metas, organização por áreas, diferentes tipos de medição e uma agenda integrada.",
    problem:
      "Planejamento, tarefas e acompanhamento de progresso viviam em ferramentas separadas, o que fazia as metas se perderem no dia a dia.",
    approach:
      "Ambiente único que conecta planejamento, tarefas e evolução, com metas organizadas por área e diferentes formas de medir progresso.",
    features: [
      "Criação de metas e organização por áreas",
      "Diferentes tipos de medição de progresso",
      "Agenda integrada",
      "Acompanhamento da evolução",
    ],
    tech: ["React.js", "Node.js", "Responsive Web Design"],
    image: "/images/projects/focus.webp",
    cover: "/images/projects/covers/focus.webp",
    year: "2026",
    category: "saas",
    output: [
      "planejamento e execução no mesmo ambiente",
      "progresso mensurável por meta",
      "rotina diária organizada",
    ],
  },
  {
    id: "woodsuperfoods",
    title: "Wood Superfoods",
    description:
      "E-commerce de superalimentos e bem-estar: jornada de compra simples e responsiva conectando produto, propósito e conteúdo.",
    overview:
      "Loja virtual completa para a Wood Superfoods, marca focada em alimentação saudável e produtos naturais, construída com identidade visual alinhada ao posicionamento da marca e priorizando uma experiência de compra simples, moderna e responsiva.",
    problem:
      "A marca precisava de uma presença digital que transmitisse confiança e conectasse produto e propósito, não apenas uma vitrine de itens.",
    approach:
      "Estrutura que combina apresentação de produtos, benefícios e diferenciais da marca, conteúdo institucional, blog e chamadas para conversão, criando uma jornada que liga produto, propósito e estilo de vida.",
    features: [
      "Catálogo com apresentação de produtos e benefícios",
      "Conteúdo institucional e blog",
      "Chamadas para conversão ao longo da jornada",
      "Design responsivo alinhado à identidade da marca",
    ],
    tech: ["Web Design", "E-commerce", "Responsive Web Design"],
    image: "/images/projects/woodsuperfoods.webp",
    cover: "/images/projects/covers/woodsuperfoods.webp",
    url: "https://woodsuperfoods.com.br/",
    year: "2026",
    category: "ecommerce",
    output: [
      "loja no ar e vendendo",
      "presença digital fortalecida",
      "jornada que conecta produto e propósito",
    ],
  },
  {
    id: "mudapaisagens",
    title: "Muda Paisagens",
    description:
      "Automação de pré-atendimento comercial com IA no WhatsApp: responde leads, qualifica por perguntas estruturadas e registra tudo no Pipefy.",
    overview:
      "Automação de pré-atendimento comercial com IA via WhatsApp Business, com foco em responder novos leads, conduzir a qualificação inicial por meio de perguntas estruturadas e registrar automaticamente as informações no Pipefy, utilizando o Make como plataforma integradora.",
    problem:
      "Novos leads chegavam pelo WhatsApp e dependiam de resposta manual, atrasando a qualificação e deixando informação sem registro.",
    approach:
      "Fluxo automatizado com IA no WhatsApp Business que responde e qualifica o lead com perguntas estruturadas, integrando ao Pipefy via Make para registro automático.",
    features: [
      "Resposta automática a novos leads no WhatsApp Business",
      "Qualificação por perguntas estruturadas",
      "Registro automático das informações no Pipefy",
      "Integração via Make",
    ],
    tech: ["IA", "API", "JSON", "Next.js"],
    image: "/images/projects/mudapaisagens.webp",
    cover: "/images/projects/covers/mudapaisagens.webp",
    year: "2026",
    category: "sistema",
    output: [
      "pré-atendimento sem intervenção manual",
      "leads qualificados automaticamente",
      "informações registradas no CRM",
    ],
  },
  {
    id: "paylink",
    title: "PayLink",
    description:
      "Site institucional para fintech de pagamentos remotos e cobranças online, comunicando os diferenciais da solução ao mercado.",
    overview:
      "A PayLink é uma fintech especializada em pagamentos remotos e cobranças online. O site institucional foi desenvolvido para apresentar a empresa de forma mais moderna, clara e profissional, comunicando com transparência os principais diferenciais da solução ao mercado.",
    problem:
      "A fintech precisava de uma vitrine institucional à altura do produto, que explicasse a solução com clareza para o mercado.",
    approach:
      "Site institucional responsivo com apresentação moderna e direta da empresa e dos diferenciais da solução de pagamentos.",
    features: [
      "Apresentação institucional da fintech",
      "Comunicação clara dos diferenciais da solução",
      "Design responsivo",
    ],
    tech: ["React.js", "Next.js", "JavaScript", "CSS"],
    image: "/images/projects/paylink.webp",
    cover: "/images/projects/covers/paylink.webp",
    year: "2026",
    category: "web",
    output: [
      "posicionamento institucional mais claro",
      "site moderno e responsivo",
    ],
  },
  {
    id: "tap",
    title: "Tap Aviation",
    description:
      "Site institucional de táxi aéreo executivo: aeronaves, serviços, estrutura e canais de contato em navegação moderna e responsiva.",
    overview:
      "Desenvolvimento do site institucional da TAP Aviation, empresa do setor de aviação executiva, apresentando de forma clara e profissional suas aeronaves, serviços, estrutura e canais de contato, com navegação moderna, intuitiva e adaptada para computadores e dispositivos móveis.",
    problem:
      "A empresa precisava apresentar frota, serviços e estrutura de forma profissional e acessível também no celular.",
    approach:
      "Site institucional com navegação intuitiva e layout responsivo, organizando aeronaves, serviços, estrutura e contato.",
    features: [
      "Apresentação das aeronaves e serviços",
      "Estrutura da empresa e canais de contato",
      "Navegação responsiva para desktop e mobile",
    ],
    tech: ["React.js", "Next.js", "JavaScript", "Web Design"],
    image: "/images/projects/tap.webp",
    cover: "/images/projects/covers/tap.webp",
    year: "2026",
    category: "web",
    output: [
      "frota e serviços bem apresentados",
      "navegação adaptada a mobile",
    ],
  },
  {
    id: "direcao",
    title: "Direção Táxi Aéreo",
    description:
      "Redesign do site institucional de táxi aéreo: frota, segurança operacional e solicitação de voos numa experiência mais moderna.",
    overview:
      "Redesign e desenvolvimento de uma nova versão do site institucional da Direção Táxi Aéreo, apresentando a empresa, seus serviços, frota de aeronaves, estrutura, segurança operacional e canais de contato em uma experiência mais moderna, profissional e intuitiva.",
    problem:
      "A versão anterior do site não refletia a credibilidade da marca nem facilitava a solicitação de voos.",
    approach:
      "Redesign completo reforçando credibilidade e destacando frota, estrutura e segurança operacional, com caminho mais direto para solicitar voos.",
    features: [
      "Apresentação da empresa, serviços e frota",
      "Estrutura e segurança operacional",
      "Canais de contato e solicitação de voos",
      "Experiência responsiva",
    ],
    tech: ["React.js", "Next.js", "Responsive Web Design", "Web Design"],
    image: "/images/projects/direcao.webp",
    cover: "/images/projects/covers/direcao.webp",
    year: "2026",
    category: "web",
    output: [
      "credibilidade da marca reforçada",
      "solicitação de voos facilitada",
    ],
  },
  {
    id: "wesleymods",
    title: "Wesley Mods",
    description:
      "Loja virtual personalizada com dashboard e painel de membro para o cliente acessar as keys que comprou.",
    overview:
      "Site de venda de produtos digitais para jogos, com dashboards e painel de membro onde o cliente acessa as keys compradas.",
    problem:
      "A venda dependia de entrega manual das chaves, sem uma área onde o cliente pudesse consultar o que comprou.",
    approach:
      "Loja em WordPress/WooCommerce com painel de membro e dashboards, automatizando o acesso do cliente às chaves adquiridas.",
    features: [
      "Loja virtual personalizada",
      "Painel de membro com as keys compradas",
      "Dashboards de acompanhamento",
      "Layout responsivo",
    ],
    tech: ["WordPress", "PHP", "WooCommerce", "JavaScript"],
    image: "/images/projects/wesleymods.webp",
    cover: "/images/projects/covers/wesleymods.webp",
    url: "https://wesleymodstore.com/",
    year: "2025",
    category: "ecommerce",
    output: [
      "entrega das chaves automatizada",
      "área do cliente self-service",
    ],
  },
  {
    id: "kdelojab",
    title: "KDElojob",
    description:
      "Site de elojob para Valorant desenvolvido sob medida para um streamer do TikTok, conforme o pedido do cliente.",
    overview:
      "Site de elojob para o jogo Valorant, desenvolvido sob medida para um streamer do TikTok de acordo com o pedido do cliente.",
    problem:
      "O streamer precisava de um site próprio para oferecer o serviço à audiência, em vez de negociar cada pedido manualmente.",
    approach:
      "Site institucional e comercial construído conforme a especificação do cliente, com apresentação do serviço e canal de contratação.",
    features: [
      "Apresentação comercial do serviço",
      "Fluxo de contratação",
      "Layout responsivo",
    ],
    tech: ["PHP", "JavaScript", "React.js", "CSS"],
    image: "/images/projects/kdelojab.webp",
    cover: "/images/projects/covers/kdelojab.webp",
    url: "https://kdelojob.com",
    year: "2025",
    category: "web",
    output: [
      "canal próprio de vendas para a audiência",
    ],
  },
];

export const skills: Skill[] = [
  // Frontend
  { name: "React", category: "frontend", level: 0.95, years: 5, hot: true },
  { name: "Next.js", category: "frontend", level: 0.9, years: 4, hot: true },
  { name: "TypeScript", category: "frontend", level: 0.9, years: 4, hot: true },
  { name: "Three.js", category: "frontend", level: 0.75, years: 2 },
  { name: "Tailwind CSS", category: "frontend", level: 0.95, years: 4, hot: true },
  { name: "GSAP", category: "frontend", level: 0.8, years: 3 },
  { name: "React Native", category: "frontend", level: 0.75, years: 3 },
  { name: "Framer", category: "frontend", level: 0.7, years: 2 },
  // Backend
  { name: "Node.js", category: "backend", level: 0.9, years: 5, hot: true },
  { name: "PHP", category: "backend", level: 0.85, years: 5 },
  { name: "Laravel", category: "backend", level: 0.8, years: 4 },
  { name: "Python", category: "backend", level: 0.8, years: 4 },
  { name: "PostgreSQL", category: "backend", level: 0.85, years: 5 },
  { name: "MySQL", category: "backend", level: 0.85, years: 5 },
  { name: "MongoDB", category: "backend", level: 0.8, years: 4 },
  { name: "Supabase", category: "backend", level: 0.9, years: 3 },
  // DevOps
  { name: "Docker", category: "devops", level: 0.85, years: 4 },
  { name: "Kubernetes", category: "devops", level: 0.7, years: 2 },
  { name: "AWS", category: "devops", level: 0.75, years: 3 },
  { name: "Vercel", category: "devops", level: 0.9, years: 4 },
  { name: "Railway", category: "devops", level: 0.8, years: 3 },
  { name: "CI/CD", category: "devops", level: 0.8, years: 4 },
  // Plataformas & integrações
  { name: "WordPress", category: "tools", level: 0.9, years: 5 },
  { name: "Shopify", category: "tools", level: 0.8, years: 3 },
  { name: "Electron", category: "tools", level: 0.75, years: 2 },
  { name: "OpenAI API", category: "tools", level: 0.85, years: 3 },
  { name: "Evolution API", category: "tools", level: 0.8, years: 2 },
  { name: "Git", category: "tools", level: 0.95, years: 6 },
  { name: "Linux", category: "tools", level: 0.85, years: 5 },
  { name: "Figma", category: "tools", level: 0.7, years: 3 },
];

// Journey order: proof of work right after the hero; skills stays light before contact.
export const chapters = [
  { id: "hero", label: "Início", range: [0, 0.2] as [number, number] },
  { id: "projects", label: "Projetos", range: [0.2, 0.45] as [number, number] },
  { id: "about", label: "Sobre", range: [0.45, 0.7] as [number, number] },
  { id: "skills", label: "Skills", range: [0.7, 0.85] as [number, number] },
  { id: "contact", label: "Contato", range: [0.85, 1.0] as [number, number] },
];

// Scroll targets (0–1) one per chapter — single source for wheel/keyboard/dots nav.
// Order matches `chapters`; hero sits near the very top (0.05) intentionally.
export const chapterTargets = [0.05, 0.3, 0.55, 0.77, 0.92];

// Floating code snippets for hero decoration
export const codeSnippets = [
  { lang: "javascript", code: "const app = express();\napp.listen(3000);", color: "#fbbf24" },
  { lang: "python", code: "def neural_net(x):\n  return model.predict(x)", color: "#60a5fa" },
  { lang: "go", code: "func main() {\n  http.ListenAndServe(\n    \":8080\", nil)\n}", color: "#34d399" },
  { lang: "sql", code: "SELECT * FROM users\nWHERE active = true;", color: "#c084fc" },
  { lang: "typescript", code: "interface Dev {\n  name: string;\n  stack: string[];\n}", color: "#60a5fa" },
  { lang: "css", code: ".matrix {\n  display: grid;\n  animation: glow 2s;\n}", color: "#fb923c" },
  { lang: "bash", code: "$ docker compose up -d\n$ kubectl apply -f deploy", color: "#4ade80" },
  { lang: "rust", code: "fn main() {\n  println!(\"Hello!\");\n}", color: "#fb923c" },
];

// Skill category colors (silver-based theme)
export const catColors: Record<string, string> = {
  frontend: "#c0c0c0",
  backend: "#60a5fa",
  devops: "#4ade80",
  tools: "#c084fc",
};

// Project category colors (single source — consumed by the projects carousel)
export const projectColors: Record<string, string> = {
  saas: "#60a5fa",
  ecommerce: "#fbbf24",
  mobile: "#c084fc",
  sistema: "#4ade80",
  web: "#fb923c",
};
