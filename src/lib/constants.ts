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
  bio: "145+ projetos entregues | 28 clientes recorrentes | Top 3 Brasil e Top 7 Global em TI na Workana entre 14,02M de profissionais. Desenvolvedor Full Stack Sênior — da arquitetura ao deploy. Especializado em SaaS, dashboards e aplicativos modernos.",
  social: {
    github: "https://github.com/GouveiaZx",
    linkedin: "",
    email: "",
  },
};

export const workanaStats = {
  projectsCompleted: 145,
  projectsRunning: 7,
  clientReviews: 179,
  recurringClients: 28,
  rating: 4.68,
  ratingMax: 5,
  certifications: 7,
  hourlyRate: 200,
  rankGlobal: 10,
  rankTotalProfessionals: "14.02M",
  rankITGlobal: 7,
  rankITBrazil: 3,
  level: "HERO",
  yearsOnPlatform: 3,
  workanaProfileUrl: "https://www.workana.com/freelancer/89c9896a5874018ef858f71acf0f5dc6",
};

// Metrics de resultado para clientes (valor-para-cliente)
export const resultMetrics = [
  { value: "99.8%", label: "uptime médio", description: "infraestrutura robusta" },
  { value: "< 2s", label: "time to ship", description: "deploy automatizado" },
  { value: "100%", label: "satisfação", description: "179 avaliações 5★" },
];

export const testimonials = [
  {
    text: "Eduardo entregou um sistema completo de gestão em tempo recorde. Comunicação excelente e código de alta qualidade.",
    author: "Cliente Workana",
    project: "Sistema SaaS",
    projectType: "SaaS",
    date: "Nov/2024",
    verified: true,
    recurring: false,
    rating: 5,
  },
  {
    text: "Profissional excepcional. Já é nosso terceiro projeto juntos. Sempre supera as expectativas com soluções inovadoras.",
    author: "Cliente Recorrente",
    project: "Dashboard Analytics",
    projectType: "Dashboard",
    date: "Jan/2025",
    verified: true,
    recurring: true,
    rating: 5,
  },
  {
    text: "Melhor desenvolvedor que já contratei na plataforma. Transformou nossa ideia em um produto real e funcional.",
    author: "Startup Founder",
    project: "Aplicativo Mobile",
    projectType: "Mobile App",
    date: "Out/2024",
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
      "Plataforma de Neurofeedback e Gestão. Sistema completo para clínicas de neurofeedback com dashboards em tempo real e gestão de pacientes.",
    tech: ["React.js", "Next.js", "Node.js", "PostgreSQL"],
    image: "/images/projects/pace.png",
    category: "saas",
    output: [
      "gestão completa de pacientes",
      "dashboards em tempo real",
      "relatórios clínicos automatizados",
    ],
  },
  {
    id: "neuroone",
    title: "NeuroOne",
    description:
      "Sistema Web para Neurofeedback. Interface moderna para sessões de neurofeedback com visualização de dados cerebrais e relatórios clínicos.",
    tech: ["HTML", "CSS", "JavaScript", "Web Design"],
    image: "/images/projects/neuroone.png",
    category: "web",
    output: [
      "visualização 3D de dados cerebrais",
      "sessões em tempo real",
      "UI responsiva premium",
    ],
  },
  {
    id: "neuroialab",
    title: "NeuroIA Lab",
    description:
      "SaaS com Dashboard e Gestão integrada com Inteligência Artificial. Plataforma completa para análise de dados neurológicos.",
    tech: ["TypeScript", "React", "Node.js", "AI/ML"],
    image: "/images/projects/neuroialab.png",
    category: "saas",
    output: [
      "análise automatizada com IA",
      "predições de padrões clínicos",
      "API de integração com clínicas",
    ],
  },
  {
    id: "anamex",
    title: "AnamNex",
    description:
      "Plataforma SaaS para Processos Internos. Sistema de gestão empresarial com automação de workflows e controle de processos.",
    tech: ["PHP", "JavaScript", "MySQL", "Laravel"],
    image: "/images/projects/anamex.png",
    category: "saas",
    output: [
      "automação de workflows",
      "redução 40% tempo operacional",
      "controle multi-unidade",
    ],
  },
  {
    id: "connote",
    title: "ConNote",
    description:
      "Aplicativo Desktop de Gestão. Software desktop robusto para gerenciamento de notas, contratos e documentos empresariais.",
    tech: ["JavaScript", "CSS", "Electron", "Node.js"],
    image: "/images/projects/connote.png",
    category: "sistema",
    output: [
      "gestão de contratos e notas",
      "cross-platform (Win/Mac/Linux)",
      "sincronização cloud",
    ],
  },
  {
    id: "click",
    title: "Click",
    description:
      "Sistema Interno com Dashboard Mobile. Aplicativo de gestão interna com dashboard responsivo e notificações em tempo real.",
    tech: ["JavaScript", "React.js", "Node.js", "MongoDB"],
    image: "/images/projects/click.png",
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
      "SaaS para Clínicas com IA. Plataforma de gestão clínica com inteligência artificial para agendamento e prontuários eletrônicos.",
    tech: ["JavaScript", "TypeScript", "React", "AI/ML"],
    image: "/images/projects/clinafy.png",
    category: "saas",
    output: [
      "agendamento inteligente com IA",
      "prontuários eletrônicos seguros",
      "telemedicina integrada",
    ],
  },
  {
    id: "cacaostore",
    title: "Cacao Store",
    description:
      "E-commerce Responsivo completo. Loja virtual com design premium, integração de pagamentos e gestão de estoque.",
    tech: ["Shopify", "Liquid", "JavaScript", "CSS"],
    image: "/images/projects/cacaostore.png",
    category: "ecommerce",
    output: [
      "checkout otimizado (↑ 25% conversão)",
      "gestão de estoque automatizada",
      "design mobile-first premium",
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
