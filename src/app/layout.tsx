import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import PublicTracking from "@/components/analytics/PublicTracking";
import SiteStructuredData from "@/components/analytics/SiteStructuredData";
import "./globals.css";
import { workanaProfile as stats } from "@/lib/constants";
import { siteUrl } from "@/lib/site";

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

// Variable fonts (one woff2 per family). Inter = body voice, Space Grotesk = display
// voice (headlines), JetBrains Mono = terminal voice only.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "EDevsHub | Eduardo Gouveia — Full Stack Sênior · Workana HERO",
  description:
    `Eduardo Gouveia, Full Stack Sênior, nível ${stats.level} na Workana: ${stats.projectsCompleted} projetos realizados e nota ${stats.rating.toLocaleString("pt-BR")}/5 em ${stats.clientReviews} avaliações. Sistemas sob medida, SaaS e integrações.`,
  keywords: [
    "Eduardo Gouveia",
    "EDevsHub",
    "Full Stack Developer",
    "Workana HERO",
    "desenvolvedor SaaS",
    "dashboard desenvolvedor",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "portfolio 3D",
  ],
  authors: [{ name: "Eduardo Gouveia" }],
  creator: "Eduardo Gouveia",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "EDevsHub — Eduardo Gouveia",
    title: "EDevsHub | Eduardo Gouveia — Full Stack Sênior · Workana HERO",
    description:
      `${stats.projectsCompleted} projetos realizados e nota ${stats.rating.toLocaleString("pt-BR")}/5 em ${stats.clientReviews} avaliações na Workana. Nível ${stats.level}.`,
    images: [
      {
        url: "/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: `Eduardo Gouveia, Full Stack Sênior, nível ${stats.level} na Workana`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EDevsHub | Eduardo Gouveia — Full Stack Sênior",
    description:
      `${stats.projectsCompleted} projetos realizados na Workana, nota ${stats.rating.toLocaleString("pt-BR")}/5. Sistemas sob medida, SaaS e integrações.`,
    images: ["/og-cover.jpg"],
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "pt-BR": "/",
      en: "/en",
      "x-default": "/",
    },
  },
  // A Meta só libera a configuração de eventos priorizados (AEM) depois que o
  // domínio está verificado, e sem isso o anúncio roda cego no iOS.
  //
  // O token fica literal aqui de propósito: ele existe para ser publicado no
  // HTML e qualquer visitante o lê no "ver código-fonte". Guardá-lo numa
  // variável de ambiente não esconderia nada e adicionaria um passo manual
  // entre o deploy e o clique em "Verificar domínio".
  verification: {
    other: {
      "facebook-domain-verification": "d6m9smjz7t6b3iwy0s844t2rl1xhw9",
    },
  },
};

const workanaUrl = stats.workanaProfileUrl;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Eduardo Gouveia",
      url: siteUrl,
      jobTitle: "Full Stack Senior Developer",
      description:
        `Desenvolvedor Full Stack Sênior, nível ${stats.level} na Workana. ${stats.projectsCompleted} projetos realizados e ${stats.rating.toLocaleString("pt-BR")}/5 em ${stats.clientReviews} avaliações. Sistemas sob medida, plataformas SaaS e integrações.`,
      image: `${siteUrl}/images/profile.jpeg`,
      sameAs: ["https://github.com/GouveiaZx", workanaUrl],
      knowsAbout: [
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "PostgreSQL",
        "AWS",
        "Docker",
        "SaaS Development",
      ],
      award: [`Nível ${stats.level} na Workana`],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Contratação",
        url: workanaUrl,
      },
    },
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#service`,
      name: "EDevsHub — Desenvolvimento Full Stack (SaaS, Dashboards e Sistemas)",
      url: siteUrl,
      image: `${siteUrl}/og-cover.jpg`,
      provider: { "@id": `${siteUrl}/#person` },
      areaServed: "Global",
      priceRange: "$",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <SiteStructuredData legacy={structuredData} />
      </head>
      <body>
        {children}
        <PublicTracking />
      </body>
    </html>
  );
}
