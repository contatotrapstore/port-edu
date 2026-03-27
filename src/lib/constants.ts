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
  level: number; // 0-1
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
  title: "ENGENHEIRO DE SISTEMAS",
  subtitle: "Full Stack Developer & Systems Engineer",
  bio: "Engenheiro de Sistemas apaixonado por criar experiências digitais inovadoras. Especializado em desenvolvimento full stack, arquitetura de sistemas e soluções cloud-native. Transformando ideias complexas em produtos elegantes e performáticos.",
  social: {
    github: "https://github.com/contatotrapstore",
    linkedin: "https://linkedin.com/in/eduardogouveia",
    email: "contato@edevshub.com",
  },
};

export const projects: Project[] = [
  {
    id: "biosync",
    title: "BioSync Game",
    description:
      "Plataforma gamificada de saúde e bem-estar com mecânicas de RPG. Sistema de missões diárias, tracking de hábitos e competição social.",
    tech: ["Next.js", "Supabase", "TypeScript", "Tailwind CSS", "GSAP"],
    image: "/images/projects/biosync.jpg",
    github: "https://github.com/contatotrapstore/biosync",
  },
  {
    id: "neurogame",
    title: "NeuroGame",
    description:
      "Jogo educacional de neurociência com visualizações 3D interativas do cérebro humano. Experiência imersiva de aprendizado.",
    tech: ["React", "Three.js", "WebGL", "Node.js", "MongoDB"],
    image: "/images/projects/neurogame.jpg",
  },
  {
    id: "orcazap",
    title: "OrçaZap",
    description:
      "Sistema automatizado de orçamentos via WhatsApp. Integração com APIs de mensageria, geração de PDFs e dashboard analytics.",
    tech: ["Node.js", "Express", "PostgreSQL", "WhatsApp API", "React"],
    image: "/images/projects/orcazap.jpg",
  },
  {
    id: "psicolsys",
    title: "PsicolSys",
    description:
      "Sistema de gestão para clínicas de psicologia. Agendamento, prontuário eletrônico, teleconsulta e relatórios clínicos.",
    tech: ["Next.js", "Supabase", "TypeScript", "Tailwind CSS"],
    image: "/images/projects/psicolsys.jpg",
  },
  {
    id: "plataforma-micro",
    title: "Plataforma Micro",
    description:
      "Plataforma de microserviços com arquitetura distribuída. API Gateway, service mesh e observabilidade integrada.",
    tech: ["Docker", "Kubernetes", "Go", "gRPC", "Redis"],
    image: "/images/projects/plataforma-micro.jpg",
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
  { name: "Claude Code", category: "tools", level: 0.95 },
];

export const chapters = [
  { id: "hero", label: "Início", range: [0, 0.2] as [number, number] },
  { id: "about", label: "Sobre", range: [0.2, 0.4] as [number, number] },
  { id: "projects", label: "Projetos", range: [0.4, 0.65] as [number, number] },
  { id: "skills", label: "Skills", range: [0.65, 0.85] as [number, number] },
  { id: "contact", label: "Contato", range: [0.85, 1.0] as [number, number] },
];
