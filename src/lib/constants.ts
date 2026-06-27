export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  image: string;
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
  bio: "144+ projetos entregues | 28 clientes recorrentes | Top 2 Brasil e Top 3 Global em TI na Workana entre 14,15M de profissionais. Desenvolvedor Full Stack Sênior — da arquitetura ao deploy. Especializado em SaaS, dashboards e aplicativos modernos.",
  social: {
    github: "https://github.com/GouveiaZx",
    linkedin: "",
    email: "",
  },
};

export const workanaStats = {
  projectsCompleted: 144,
  projectsRunning: 7,
  clientReviews: 163,
  recurringClients: 28,
  rating: 4.71,
  ratingMax: 5,
  certifications: 7,
  hourlyRate: 200,
  rankGlobal: 3,
  rankTotalProfessionals: "14.15M",
  rankITGlobal: 3,
  rankITBrazil: 2,
  level: "HERO",
  yearsOnPlatform: 3,
  workanaProfileUrl: "https://www.workana.com/freelancer/89c9896a5874018ef858f71acf0f5dc6",
};

// Metrics de resultado para clientes (valor-para-cliente)
export const resultMetrics = [
  { value: "99.8%", label: "uptime médio", description: "infraestrutura robusta" },
  { value: "< 2s", label: "tempo de entrega", description: "deploy automatizado" },
  { value: "4.71/5", label: "nota média", description: "163 avaliações verificadas" },
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
];

export const projects: Project[] = [
  {
    id: "pace",
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
    id: "neuroialab",
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
    category: "sistema",
    output: [
      "produtividade com IA no fluxo de trabalho",
      "transcrição + resumos automáticos",
      "produto nativo pronto para comercialização",
    ],
  },
  {
    id: "click",
    title: "Click",
    description:
      "Sistema Interno com Dashboard Mobile. Aplicativo de gestão interna com dashboard responsivo e notificações em tempo real.",
    problem:
      "A gestão interna exigia acesso mobile com notificações em tempo real e integração entre sistemas.",
    approach:
      "App de gestão mobile-first com notificações em tempo real e integração multi-sistema.",
    tech: ["JavaScript", "React.js", "Node.js", "MongoDB"],
    image: "/images/projects/click.webp",
    category: "mobile",
    output: [
      "notificações em tempo real",
      "dashboard mobile-first",
      "integração multi-sistema",
    ],
  },
  {
    id: "clinafy",
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
    url: "https://cacaostore.com.br/",
    category: "ecommerce",
    output: [
      "loja no ar e vendendo",
      "design responsivo premium",
      "gestão simples pelo cliente",
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
  // Backend
  { name: "Node.js", category: "backend", level: 0.9, years: 5, hot: true },
  { name: "Python", category: "backend", level: 0.8, years: 4 },
  { name: "Go", category: "backend", level: 0.7, years: 2 },
  { name: "PostgreSQL", category: "backend", level: 0.85, years: 5 },
  { name: "MongoDB", category: "backend", level: 0.8, years: 4 },
  { name: "Supabase", category: "backend", level: 0.9, years: 3 },
  // DevOps
  { name: "Docker", category: "devops", level: 0.85, years: 4 },
  { name: "Kubernetes", category: "devops", level: 0.7, years: 2 },
  { name: "AWS", category: "devops", level: 0.75, years: 3 },
  { name: "CI/CD", category: "devops", level: 0.8, years: 4 },
  // Tools
  { name: "Git", category: "tools", level: 0.95, years: 6 },
  { name: "Linux", category: "tools", level: 0.85, years: 5 },
  { name: "Figma", category: "tools", level: 0.7, years: 3 },
  { name: "VS Code", category: "tools", level: 0.95, years: 6 },
];

export const chapters = [
  { id: "hero", label: "Início", range: [0, 0.2] as [number, number] },
  { id: "about", label: "Sobre", range: [0.2, 0.4] as [number, number] },
  { id: "projects", label: "Projetos", range: [0.4, 0.65] as [number, number] },
  { id: "skills", label: "Skills", range: [0.65, 0.85] as [number, number] },
  { id: "contact", label: "Contato", range: [0.85, 1.0] as [number, number] },
];

// Scroll targets (0–1) one per chapter — single source for wheel/keyboard/dots nav.
// Order matches `chapters`; hero sits near the very top (0.05) intentionally.
export const chapterTargets = [0.05, 0.3, 0.52, 0.75, 0.92];

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

// Terminal loading messages
export const loadingMessages = [
  "Initializing runtime environment",
  "Loading neural networks",
  "Compiling shaders",
  "Connecting to matrix",
  "Mounting file systems",
  "Establishing secure connection",
  "Rendering 3D scene",
  "System ready",
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
