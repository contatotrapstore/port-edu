import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
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
  title: "EDevsHub | Eduardo Gouveia — Top 3 Brasil Full Stack Workana",
  description:
    "Eduardo Gouveia — Full Stack Senior, Top 3 Brasil em TI na Workana. 145+ projetos entregues, 4.68/5 ⭐, nível HERO. Especialista em SaaS, Dashboards e Sistemas.",
  keywords: [
    "Eduardo Gouveia",
    "EDevsHub",
    "Full Stack Developer",
    "Top 3 Brasil Workana",
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
  icons: {
    icon: "/EdevsHub.png",
    apple: "/EdevsHub.png",
  },
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
    title: "EDevsHub | Top 3 Brasil Full Stack Developer na Workana",
    description:
      "145+ projetos entregues · 4.68/5 ⭐ · Nível HERO · Top 3 Brasil em TI. Especialista em SaaS, Dashboards e Sistemas.",
    images: [
      {
        url: "/EdevsHub.png",
        width: 1200,
        height: 630,
        alt: "EDevsHub — Eduardo Gouveia Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EDevsHub | Top 3 Brasil Full Stack Developer",
    description:
      "145+ projetos · 4.68/5 ⭐ · HERO Workana. Especialista SaaS & Sistemas.",
    images: ["/EdevsHub.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Eduardo Gouveia",
  url: siteUrl,
  jobTitle: "Full Stack Senior Developer",
  description:
    "Desenvolvedor Full Stack Senior, Top 3 Brasil em TI na Workana. Especializado em SaaS, Dashboards e Sistemas.",
  image: `${siteUrl}/EdevsHub.png`,
  sameAs: [
    "https://github.com/GouveiaZx",
    "https://www.workana.com/freelancer/89c9896a5874018ef858f71acf0f5dc6",
  ],
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
    "Top 3 Brasil em TI e Programação (Workana)",
    "Top 7 Global em TI e Programação (Workana)",
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
      <body>{children}</body>
    </html>
  );
}
