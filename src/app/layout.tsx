import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const siteUrl = "https://edevshub.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "EDevsHub | Eduardo Gouveia — Top 2 Brasil Full Stack Workana",
  description:
    "Eduardo Gouveia — Full Stack Senior, Top 2 Brasil em TI na Workana. 144+ projetos entregues, 4.71/5 ⭐, nível HERO. Especialista em SaaS, Dashboards e Sistemas.",
  keywords: [
    "Eduardo Gouveia",
    "EDevsHub",
    "Full Stack Developer",
    "Top 2 Brasil Workana",
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
    title: "EDevsHub | Top 2 Brasil Full Stack Developer na Workana",
    description:
      "144+ projetos entregues · 4.71/5 ⭐ · Nível HERO · Top 2 Brasil em TI. Especialista em SaaS, Dashboards e Sistemas.",
    images: [
      {
        url: "/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Eduardo Gouveia — Full Stack Senior · Top 2 Brasil · Workana HERO",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EDevsHub | Top 2 Brasil Full Stack Developer",
    description:
      "144+ projetos · 4.71/5 ⭐ · HERO Workana. Especialista SaaS & Sistemas.",
    images: ["/og-cover.jpg"],
  },
  alternates: {
    canonical: siteUrl,
  },
};

const workanaUrl =
  "https://www.workana.com/freelancer/89c9896a5874018ef858f71acf0f5dc6";

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
        "Desenvolvedor Full Stack Senior, Top 2 Brasil em TI na Workana. Especializado em SaaS, Dashboards e Sistemas.",
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
      award: [
        "Nível HERO na Workana (mais alto nível)",
        "Top 2 Brasil em TI e Programação (Workana)",
        "Top 3 Global em TI e Programação (Workana)",
      ],
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
      priceRange: "$$",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.71",
        reviewCount: "163",
        bestRating: "5",
        worstRating: "1",
      },
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
      className={`${inter.variable} ${jakarta.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
