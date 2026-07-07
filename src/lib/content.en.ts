import {
  projects,
  resultMetrics,
  siteConfig,
  testimonials,
  type Project,
  type SiteConfig,
} from "@/lib/constants";
import type { Locale } from "@/lib/locale";

/**
 * English content overlay. Only prose fields are translated — ids, tech,
 * images, covers, galleries, urls, years and categories are identical to
 * the PT source of truth (spread + overrides).
 */

export const siteConfigEN: SiteConfig = {
  ...siteConfig,
  title: "SENIOR FULL STACK | SAAS & SYSTEMS",
  subtitle: "Building the future, one commit at a time.",
  bio: "Senior Full Stack Developer. I turn ideas into real products — from architecture to deployment — focused on SaaS, dashboards and AI-powered systems. 165+ projects delivered and 28 returning clients: clear communication, deadlines met and code that scales. #1 in IT in Brazil on Workana, HERO level.",
};

const projectOverridesEN: Record<string, Partial<Project>> = {
  pace: {
    description:
      "Clinical neurofeedback system for psychologists: guided sessions with 3D games driven by brainwaves (EEG), plus complete practice management.",
    overview:
      "Clinical platform for psychologists and therapists to deliver neurofeedback treatments. The patient wears an EEG headset (Muse/NeuroSky) that captures brainwaves in real time over Bluetooth; attention and meditation signals drive therapeutic 3D games, rewarding the desired mental states and building neuroplasticity through operant conditioning.",
    problem:
      "Neurofeedback clinics lacked a single system to run sessions, manage protocols and track patient progress.",
    approach:
      "Multi-clinic SaaS with a psychologist area (dashboard, scheduling, protocols, reports) and a patient area (remote sessions, progress tracking), automated guided sessions (12-week protocol) and real-time EEG processing in the browser.",
    features: [
      "Bluetooth integration with Muse 2/S and NeuroSky headsets",
      "28 therapeutic 3D games (focus and relaxation modes)",
      "Automated guided sessions — 12-week protocol",
      "Clinical dashboard with per-patient progress",
      "PDF clinical reports for patient records",
      "Multi-clinic with role-based permissions",
    ],
    output: [
      "complete clinical practice management",
      "real-time EEG feedback",
      "automated reports for patient records",
    ],
  },
  neuroone: {
    description:
      "Web neurofeedback platform with 3D games (Three.js) driven by EEG, with modules for companies, schools and clinics.",
    overview:
      "Web platform for cognitive training through neurofeedback, combining brainwave (EEG) reading with interactive 3D games for attention, focus and relaxation. The more focused or relaxed the user, the better the in-game performance — a feedback loop that trains the brain naturally.",
    problem:
      "Training focus and relaxation in an engaging way meant bringing EEG, games and progress tracking together in one place — for very different audiences.",
    approach:
      "Multi-role PWA (admin/professional/patient) with 28 3D games built in Three.js and three modules: Companies (corporate wellness), Schools (teacher panel) and Clinics (patient records and 12-week protocols).",
    features: [
      "28 3D games built in Three.js (focus and relaxation modes)",
      "Companies, Schools and Clinics modules",
      "Dashboard with real-time EEG metrics",
      "Multi-role: admin, professional, patient/student",
      "Responsive PWA (desktop/tablet/mobile)",
      "PDF reports and automatic backups",
    ],
    output: [
      "gamified cognitive training",
      "real-time EEG metrics",
      "multi-role PWA",
    ],
  },
  neuroialab: {
    description:
      "Mental health SaaS with 19 specialized AI assistants for psychologists, speech therapists and other clinicians.",
    overview:
      "SaaS platform that democratizes access to AI assistants specialized in psychology and related fields, built for psychologists, educational psychologists, speech therapists and occupational therapists.",
    problem:
      "Mental health professionals were spending hours on repetitive clinical tasks (reports, session structuring, case reviews) without specialized support.",
    approach:
      "SaaS with 19 specialized AI assistants that support clinical practice — from designing therapeutic pathways to drafting psychological reports.",
    features: [
      "19 specialized AI assistants",
      "Therapeutic pathway design",
      "Clinical case review",
      "Psychological report drafting",
      "Session structuring and cognitive restructuring",
      "Professional ethics guidance",
    ],
    output: [
      "19 clinical AI assistants",
      "therapeutic decision support",
      "clinical productivity gains",
    ],
  },
  anamex: {
    description:
      "Medical SaaS for on-call physicians with AI: automated ECG reading and clinical image analysis, with auto-generated reports.",
    overview:
      "Medical SaaS that supports on-call physicians in daily care with AI applied to clinical practice — focused on speed, diagnostic accuracy and centralizing information in a secure, intuitive environment.",
    problem:
      "On call, physicians need fast, accurate decisions — but interpreting exams (such as ECGs) and centralizing clinical data was slow and fragmented.",
    approach:
      "Platform that processes technical ECG files (.mat/.hea) and images; the AI interprets cardiac signals and automatically generates clinical reports, and also analyzes medical images (wounds, lesions, dermatology).",
    features: [
      "AI-powered automated ECG reading (.mat/.hea and images)",
      "Automatic clinical report generation",
      "Arrhythmia and cardiac pattern detection",
      "Medical image analysis (wounds/lesions/derma)",
      "Centralized clinical information",
      "Secure, intuitive environment",
    ],
    output: [
      "automated ECG reports",
      "AI-assisted diagnosis",
      "faster decisions on call",
    ],
  },
  connote: {
    description:
      "Native productivity app (Windows/macOS) with AI: smart notes, multi-model chat and a floating copilot with real-time transcription.",
    overview:
      "Premium native application for Windows and macOS focused on productivity, with AI deeply integrated into the workflow — not just another chat.",
    problem:
      "Note-taking and AI tools lived apart from the actual workflow — capturing no context (audio, meetings) and offering no way to compare models.",
    approach:
      "Native app that combines smart notes (the AI understands and generates content from your notes), multi-model chat and an always-on-top copilot that captures system audio, transcribes it in real time and saves summaries straight into your notes.",
    features: [
      "Smart notes with generative AI",
      "Multi-model chat (compare AIs in one place)",
      "Always-on-top floating copilot",
      "Real-time system audio transcription",
      "Automatic summaries saved to notes",
      "High-performance native app + subscription model",
    ],
    output: [
      "AI-powered productivity inside the workflow",
      "transcription + automatic summaries",
      "market-ready native product",
    ],
  },
  clinafy: {
    description:
      "System for mental health professionals: AI-powered electronic records, smart scheduling, telehealth and financial management — all in one place.",
    overview:
      "SaaS platform for mental health professionals and clinics that brings together AI-powered electronic health records, smart scheduling, integrated telehealth and complete financial management. Over 500 professionals and 50,000 appointments.",
    problem:
      "Mental health professionals relied on fragmented tools for records, scheduling, telehealth and finances — with no single system.",
    approach:
      "SaaS that centralizes AI-powered electronic records (automatic transcription and insights), smart scheduling, telehealth and financial management, with a patient area and an installable app (PWA).",
    features: [
      "AI-powered electronic health records (transcription + insights)",
      "Smart scheduling",
      "Integrated telehealth",
      "Standardized clinical assessments",
      "Complete financial management",
      "Patient area + installable app (PWA)",
    ],
    output: [
      "500+ active professionals",
      "50,000+ appointments completed",
      "4.9/5 rating",
    ],
  },
  cacaostore: {
    description:
      "Complete Shopify online store, fully responsive, custom-built for the client.",
    overview:
      "Responsive e-commerce store built on Shopify to the client's specification — contracted and delivered through Workana.",
    problem:
      "The client needed a professional, responsive online store that was easy to manage day to day.",
    approach:
      "Custom, responsive Shopify store with catalog and checkout ready to sell, plus simple day-to-day management for the client.",
    features: [
      "Custom Shopify store",
      "Responsive design (mobile-first)",
      "Integrated catalog and checkout",
      "Client-managed products and inventory",
    ],
    output: [
      "store live and selling",
      "premium responsive design",
      "simple client-side management",
    ],
  },
  click: {
    description:
      "Internal system with a mobile dashboard. Internal management app with a responsive dashboard and real-time notifications.",
    problem:
      "Internal management required mobile access with real-time notifications and cross-system integration.",
    approach:
      "Mobile-first management app with real-time notifications and multi-system integration.",
    output: [
      "real-time notifications",
      "mobile-first dashboard",
      "multi-system integration",
    ],
  },
};

export const projectsEN: Project[] = projects.map((p) => ({
  ...p,
  ...(projectOverridesEN[p.id] ?? {}),
}));

export const resultMetricsEN: typeof resultMetrics = [
  { value: "99.8%", label: "average uptime", description: "resilient infrastructure" },
  { value: "< 2s", label: "delivery speed", description: "automated deployments" },
  { value: "4.72/5", label: "average rating", description: "201 verified reviews" },
];

// Testimonials: quote text/author stay verbatim (real reviews) — only the
// display metadata (project type badge, month abbreviation) is localized.
const testimonialMetaEN: Array<{ projectType: string; date: string }> = [
  { projectType: "SaaS", date: "Apr/2026" },
  { projectType: "AI Platform", date: "May/2026" },
  { projectType: "AI Agent", date: "May/2026" },
  { projectType: "Enterprise App", date: "Mar/2026" },
  { projectType: "SaaS", date: "Apr/2026" },
  { projectType: "Multilingual Website", date: "May/2026" },
  { projectType: "Sales Page", date: "Jun/2026" },
  { projectType: "News Portal + AI", date: "Apr/2026" },
  { projectType: "GPT Platform", date: "Sep/2025" },
  { projectType: "Corporate Website", date: "2025" },
];

export const testimonialsEN: typeof testimonials = testimonials.map((tm, i) => ({
  ...tm,
  ...(testimonialMetaEN[i] ?? {}),
}));

/** Locale-aware content bundle (PT is the untouched source of truth). */
export function getContent(locale: Locale) {
  if (locale === "en") {
    return {
      siteConfig: siteConfigEN,
      projects: projectsEN,
      resultMetrics: resultMetricsEN,
      testimonials: testimonialsEN,
    };
  }
  return { siteConfig, projects, resultMetrics, testimonials };
}
