export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  image: string;
  url?: string;
  github?: string;
}

export interface Skill {
  name: string;
  category: "frontend" | "backend" | "devops" | "tools";
  level: number;
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
  bio: "145+ projetos entregues | 28 clientes recorrentes | Top 13 Brasil e Top 46 Global em TI na Workana entre 13,8M de profissionais. Desenvolvedor Full Stack Sênior — da arquitetura ao deploy. Especializado em SaaS, dashboards e aplicativos modernos.",
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
  rankGlobal: 25,
  rankTotalProfessionals: "13.98M",
  rankITGlobal: 14,
  rankITBrazil: 4,
  level: "HERO",
  yearsOnPlatform: 3,
};

export const testimonials = [
  {
    text: "Eduardo entregou um sistema completo de gestão em tempo recorde. Comunicação excelente e código de alta qualidade.",
    author: "Cliente Workana",
    project: "Sistema de Gestão SaaS",
    rating: 5,
  },
  {
    text: "Profissional excepcional. Já é nosso terceiro projeto juntos. Sempre supera as expectativas com soluções inovadoras.",
    author: "Cliente Recorrente",
    project: "Dashboard Analytics",
    rating: 5,
  },
  {
    text: "Melhor desenvolvedor que já contratei na plataforma. Transformou nossa ideia em um produto real e funcional.",
    author: "Startup Founder",
    project: "Aplicativo Mobile",
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
  },
  {
    id: "neuroone",
    title: "NeuroOne",
    description:
      "Sistema Web para Neurofeedback. Interface moderna para sessões de neurofeedback com visualização de dados cerebrais e relatórios clínicos.",
    tech: ["HTML", "CSS", "JavaScript", "Web Design"],
    image: "/images/projects/neuroone.png",
  },
  {
    id: "neuroialab",
    title: "NeuroIA Lab",
    description:
      "SaaS com Dashboard e Gestão integrada com Inteligência Artificial. Plataforma completa para análise de dados neurológicos.",
    tech: ["TypeScript", "React", "Node.js", "AI/ML"],
    image: "/images/projects/neuroialab.png",
  },
  {
    id: "anamex",
    title: "AnamNex",
    description:
      "Plataforma SaaS para Processos Internos. Sistema de gestão empresarial com automação de workflows e controle de processos.",
    tech: ["PHP", "JavaScript", "MySQL", "Laravel"],
    image: "/images/projects/anamex.png",
  },
  {
    id: "connote",
    title: "ConNote",
    description:
      "Aplicativo Desktop de Gestão. Software desktop robusto para gerenciamento de notas, contratos e documentos empresariais.",
    tech: ["JavaScript", "CSS", "Electron", "Node.js"],
    image: "/images/projects/connote.png",
  },
  {
    id: "click",
    title: "Click",
    description:
      "Sistema Interno com Dashboard Mobile. Aplicativo de gestão interna com dashboard responsivo e notificações em tempo real.",
    tech: ["JavaScript", "React.js", "Node.js", "MongoDB"],
    image: "/images/projects/click.png",
  },
  {
    id: "clinafy",
    title: "Clinafy",
    description:
      "SaaS para Clínicas com IA. Plataforma de gestão clínica com inteligência artificial para agendamento e prontuários eletrônicos.",
    tech: ["JavaScript", "TypeScript", "React", "AI/ML"],
    image: "/images/projects/clinafy.png",
  },
  {
    id: "cacaostore",
    title: "Cacao Store",
    description:
      "E-commerce Responsivo completo. Loja virtual com design premium, integração de pagamentos e gestão de estoque.",
    tech: ["Shopify", "Liquid", "JavaScript", "CSS"],
    image: "/images/projects/cacaostore.png",
  },
];

export const skills: Skill[] = [
  // Frontend
  { name: "React", category: "frontend", level: 0.95 },
  { name: "Next.js", category: "frontend", level: 0.9 },
  { name: "TypeScript", category: "frontend", level: 0.9 },
  { name: "Three.js", category: "frontend", level: 0.75 },
  { name: "Tailwind CSS", category: "frontend", level: 0.95 },
  { name: "GSAP", category: "frontend", level: 0.8 },
  // Backend
  { name: "Node.js", category: "backend", level: 0.9 },
  { name: "Python", category: "backend", level: 0.8 },
  { name: "Go", category: "backend", level: 0.7 },
  { name: "PostgreSQL", category: "backend", level: 0.85 },
  { name: "MongoDB", category: "backend", level: 0.8 },
  { name: "Supabase", category: "backend", level: 0.9 },
  // DevOps
  { name: "Docker", category: "devops", level: 0.85 },
  { name: "Kubernetes", category: "devops", level: 0.7 },
  { name: "AWS", category: "devops", level: 0.75 },
  { name: "CI/CD", category: "devops", level: 0.8 },
  // Tools
  { name: "Git", category: "tools", level: 0.95 },
  { name: "Linux", category: "tools", level: 0.85 },
  { name: "Figma", category: "tools", level: 0.7 },
  { name: "VS Code", category: "tools", level: 0.95 },
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
