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
  bio: "Senior Full Stack Developer. I turn ideas into real products — from architecture to deployment — focused on SaaS, dashboards and AI-powered systems. 176 projects delivered and 37 returning clients: clear communication, deadlines met and code that scales. I've reached #1 in Brazil and Top 3 worldwide in IT on Workana — HERO level.",
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
  blackinbot: {
    description:
      "Full SaaS to build, automate and manage Telegram monetization bots: sell access to VIP groups with integrated payments and subscription control.",
    overview:
      "SaaS platform for creating, automating and managing Telegram monetization bots, letting content creators sell access to VIP groups and channels with integrated payments, subscription control and centralized management.",
    problem:
      "Creators manually handled selling and granting access to VIP groups — a flow that did not scale and ate up daily operations.",
    approach:
      "Decoupled frontend/backend architecture with a web dashboard to configure bots and plans, fully automated Telegram bots, payments via Pix/bank slip/card and webhooks for instant confirmation.",
    features: [
      "Bot creation and configuration from the dashboard",
      "Customizable subscription plans",
      "Automatic entry and removal from VIP groups",
      "Payments via Pix, bank slip and card with webhooks",
      "Expiry and renewal notifications",
      "Real-time reports and analytics",
      "Supabase Auth + JWT with Row Level Security",
    ],
    output: [
      "selling and access delivery fully automated",
      "manual operations all but eliminated",
      "scalable, production-ready architecture",
    ],
  },
  clubeazul: {
    description:
      "Benefits-club management SaaS: policyholders, contracts, plans, commissions and automated billing — replacing legacy systems.",
    overview:
      "Complete web platform to centralize and modernize a benefits club's operation, replacing legacy systems and bringing separate administrative processes into a single environment, built as SaaS with multiple entities and access levels.",
    problem:
      "The operation ran on old systems and fragmented processes, with no single environment to manage policyholders, contracts, commissions and billing.",
    approach:
      "Multi-entity SaaS covering policyholders, sub-policyholders, client companies, insured members and brokers, configurable commission rules, Iugu integration for bank slips and payment updates, plus data import/export.",
    features: [
      "Management of policyholders, sub-policyholders, clients, insured members and brokers",
      "Contracts, terms, coverage and plans",
      "Configurable price tables and commission rules",
      "Iugu integration for billing and bank slips",
      "Excel import and report export",
      "Certificate and document generation",
      "Portal to browse, simulate and sign up for plans",
    ],
    output: [
      "legacy systems replaced",
      "financial process automated",
      "centralized, scalable operation",
    ],
  },
  corpxbank: {
    description:
      "Mobile banking app (iOS and Android) wrapping an internet banking platform in a native experience, with QR code and bank slip scanning.",
    overview:
      "Cross-platform mobile app built to wrap an internet banking platform in a native experience, delivering more performance, security and device integration. Built with React Native + Expo, with full access to the banking system through a secure WebView.",
    problem:
      "Internet banking existed only on the web: no store presence, no access to device features and none of the fluidity customers expect on mobile.",
    approach:
      "React Native + Expo app with a secure WebView preserving the original visual identity, persistent sessions, native camera/storage/audio permissions and full publication to Android and iOS.",
    features: [
      "Full internet banking integration via WebView",
      "Secure login with persistent session",
      "QR code and bank slip scanning via camera",
      "Native permission management",
      "Cookie and authentication handling",
      "Custom splash screen and native alerts",
      "Published to Android and iOS (TestFlight / App Store)",
    ],
    output: [
      "app published on both stores",
      "stable builds after environment standardization",
      "native features without losing the original identity",
    ],
  },
  rei: {
    description:
      "Management system for telecom infrastructure civil works: stages, tasks, owners, SLAs and dependencies in a single panel.",
    overview:
      "Web platform to centralize the management of telecom infrastructure civil works, with control of stages, tasks, owners, SLAs, dependencies, reminders, internal notifications and an admin panel.",
    problem:
      "Tracking works relied on manual controls, with no visibility into progress and no standardization of internal processes.",
    approach:
      "Web system replacing manual controls, allowing each project to be tracked by stage, internal processes to be organized and tasks configured straight from the admin.",
    features: [
      "Control of stages, tasks and owners",
      "SLAs and dependencies between activities",
      "Reminders and internal notifications",
      "Admin panel with task configuration",
      "Visibility into each project's progress",
    ],
    output: [
      "manual controls replaced",
      "real-time visibility into operations",
      "standardized internal processes",
    ],
  },
  passagenseuropa: {
    description:
      "Custom CRM centralizing the whole commercial operation: leads, pipeline, WhatsApp, quotes, finance, commissions and automations with AI support.",
    overview:
      "CRM built to centralize Passagens Europa's entire commercial operation, bringing lead management, sales pipeline, WhatsApp support, quotes, sales, finance, reports, commissions and automations into a single platform.",
    problem:
      "The commercial operation was spread across separate tools, with no single pipeline and no consolidated history per client.",
    approach:
      "One platform integrating support, pipeline and finance, with AI features to assist customer service, client analysis and the team's decision-making.",
    features: [
      "Lead management and sales pipeline",
      "Integrated WhatsApp support",
      "Quotes, sales and finance",
      "Reports and commission management",
      "Commercial automations",
      "AI for client analysis and decision support",
    ],
    output: [
      "centralized commercial operation",
      "support and pipeline in one place",
      "AI-assisted decision-making",
    ],
  },
  ciliosclick: {
    description:
      "AI platform for lash extension professionals: visual simulation, scheduling, digital intake forms and admin management in one place.",
    overview:
      "Digital platform built for lash extension professionals, combining artificial intelligence, visual simulation, scheduling, digital intake forms and administrative management into a single solution to make service more visual, modern and professional.",
    problem:
      "Professionals relied on scattered tools for scheduling, intake forms and showing clients what the result would look like.",
    approach:
      "A single solution pairing AI-driven visual simulation of the result with service management — scheduling, digital intake and running the business.",
    features: [
      "AI-powered visual simulation of the result",
      "Appointment scheduling",
      "Digital intake forms",
      "Administrative management",
    ],
    output: [
      "a more visual experience for the client",
      "scheduling and intake forms digitized",
      "business management in one place",
    ],
  },
  revix: {
    description:
      "Automotive social network with an interactive event map, feed, communities and meetup management — connecting enthusiasts and clubs nearby.",
    overview:
      "Automotive social platform built to connect enthusiasts, clubs and meetups in a modern, intuitive digital experience, combining an interactive map of nearby events, a social feed, meetup creation and management, communities, notifications and custom profiles.",
    problem:
      "Car culture was organized across scattered groups, with no single place to discover nearby meetups and bring the community together.",
    approach:
      "Scalable product designed around performance, mobile experience and a strong visual identity, bringing users closer to their local scene through an event map and communities.",
    features: [
      "Interactive map with nearby events",
      "Social feed",
      "Meetup creation and management",
      "Communities and custom profiles",
      "Notifications",
    ],
    output: [
      "the car community gathered in one app",
      "event discovery by proximity",
      "scalable, mobile-focused product",
    ],
  },
  focus: {
    description:
      "Web productivity platform that turns goals into routine: organization by area, multiple progress metrics and an integrated calendar.",
    overview:
      "Web productivity platform built to organize goals, track progress and turn objectives into a practical execution routine, combining goal creation, organization by area, different measurement types and an integrated calendar.",
    problem:
      "Planning, tasks and progress tracking lived in separate tools, so goals got lost in day-to-day work.",
    approach:
      "A single environment connecting planning, tasks and progress, with goals organized by area and different ways to measure how they advance.",
    features: [
      "Goal creation and organization by area",
      "Different progress measurement types",
      "Integrated calendar",
      "Progress tracking",
    ],
    output: [
      "planning and execution in one environment",
      "measurable progress per goal",
      "an organized daily routine",
    ],
  },
  woodsuperfoods: {
    description:
      "Superfoods and wellness e-commerce: a simple, responsive buying journey connecting product, purpose and content.",
    overview:
      "Complete online store for Wood Superfoods, a brand focused on healthy eating and natural products, built with a visual identity aligned to the brand's positioning and prioritizing a simple, modern and responsive shopping experience.",
    problem:
      "The brand needed a digital presence that conveyed trust and connected product to purpose — not just a shelf of items.",
    approach:
      "A structure combining product presentation, brand benefits and differentiators, institutional content, a blog and conversion calls to action, creating a journey that links product, purpose and lifestyle.",
    features: [
      "Catalog presenting products and benefits",
      "Institutional content and blog",
      "Conversion calls to action throughout the journey",
      "Responsive design aligned to the brand identity",
    ],
    output: [
      "store live and selling",
      "stronger digital presence",
      "a journey connecting product and purpose",
    ],
  },
  mudapaisagens: {
    description:
      "AI-powered commercial pre-sales automation on WhatsApp: answers leads, qualifies them with structured questions and logs everything to Pipefy.",
    overview:
      "AI-powered commercial pre-sales automation over WhatsApp Business, focused on answering new leads, running initial qualification through structured questions and automatically recording the information in Pipefy, using Make as the integration platform.",
    problem:
      "New leads arrived over WhatsApp and depended on manual replies, delaying qualification and leaving information unrecorded.",
    approach:
      "Automated AI flow on WhatsApp Business that answers and qualifies the lead with structured questions, integrating with Pipefy via Make for automatic recording.",
    features: [
      "Automatic replies to new WhatsApp Business leads",
      "Qualification through structured questions",
      "Automatic recording of information in Pipefy",
      "Integration via Make",
    ],
    output: [
      "pre-sales with no manual intervention",
      "leads qualified automatically",
      "information recorded in the CRM",
    ],
  },
  paylink: {
    description:
      "Institutional site for a remote payments and online billing fintech, communicating the solution's differentiators to the market.",
    overview:
      "PayLink is a fintech specialized in remote payments and online billing. The institutional site was built to present the company in a more modern, clear and professional way, transparently communicating the solution's main differentiators to the market.",
    problem:
      "The fintech needed an institutional showcase worthy of the product, explaining the solution clearly to the market.",
    approach:
      "Responsive institutional site with a modern, direct presentation of the company and the payment solution's differentiators.",
    features: [
      "Institutional presentation of the fintech",
      "Clear communication of the solution's differentiators",
      "Responsive design",
    ],
    output: [
      "clearer institutional positioning",
      "modern, responsive site",
    ],
  },
  tap: {
    description:
      "Institutional site for executive air taxi: aircraft, services, facilities and contact channels in modern, responsive navigation.",
    overview:
      "Development of TAP Aviation's institutional site, a company in the executive aviation sector, presenting its aircraft, services, facilities and contact channels clearly and professionally, with modern, intuitive navigation adapted for desktop and mobile.",
    problem:
      "The company needed to present its fleet, services and facilities professionally and accessibly on mobile too.",
    approach:
      "Institutional site with intuitive navigation and responsive layout, organizing aircraft, services, facilities and contact.",
    features: [
      "Presentation of aircraft and services",
      "Company facilities and contact channels",
      "Responsive navigation for desktop and mobile",
    ],
    output: [
      "fleet and services well presented",
      "navigation adapted to mobile",
    ],
  },
  direcao: {
    description:
      "Redesign of an air taxi institutional site: fleet, operational safety and flight requests in a more modern experience.",
    overview:
      "Redesign and development of a new version of Direção Táxi Aéreo's institutional site, presenting the company, its services, aircraft fleet, facilities, operational safety and contact channels in a more modern, professional and intuitive experience.",
    problem:
      "The previous site did not reflect the brand's credibility nor make it easy to request flights.",
    approach:
      "Full redesign reinforcing credibility and highlighting fleet, facilities and operational safety, with a more direct path to requesting a flight.",
    features: [
      "Presentation of the company, services and fleet",
      "Facilities and operational safety",
      "Contact channels and flight requests",
      "Responsive experience",
    ],
    output: [
      "brand credibility reinforced",
      "flight requests made easier",
    ],
  },
  wesleymods: {
    description:
      "Custom online store with dashboards and a member area where customers access the keys they purchased.",
    overview:
      "Store selling digital gaming products, with dashboards and a member area where the customer accesses purchased keys.",
    problem:
      "Sales depended on delivering keys by hand, with no area where customers could check what they had bought.",
    approach:
      "WordPress/WooCommerce store with a member panel and dashboards, automating customer access to purchased keys.",
    features: [
      "Custom online store",
      "Member area with purchased keys",
      "Tracking dashboards",
      "Responsive layout",
    ],
    output: [
      "key delivery automated",
      "self-service customer area",
    ],
  },
  kdelojab: {
    description:
      "Valorant elojob site built to order for a TikTok streamer, following the client's specification.",
    overview:
      "Elojob site for the game Valorant, built to order for a TikTok streamer according to the client's specification.",
    problem:
      "The streamer needed their own site to offer the service to their audience instead of negotiating each order by hand.",
    approach:
      "Institutional and commercial site built to the client's specification, presenting the service and a channel to hire it.",
    features: [
      "Commercial presentation of the service",
      "Hiring flow",
      "Responsive layout",
    ],
    output: [
      "a sales channel of their own for the audience",
    ],
  },
};

export const projectsEN: Project[] = projects.map((p) => ({
  ...p,
  ...(projectOverridesEN[p.id] ?? {}),
}));

export const resultMetricsEN: typeof resultMetrics = [
  { value: "176", label: "projects delivered", description: "in 3.5 years on Workana" },
  { value: "37", label: "clients rehired", description: "and they keep coming back" },
  { value: "4.74/5", label: "average rating", description: "179 verified reviews" },
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
