import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import { siteUrl } from "@/lib/site";
import { portfolioWorkanaStats as workanaStats } from "@/lib/constants";
import { portfolioOgImage } from "@/lib/portfolio-metadata";

const workanaProof = `${workanaStats.projectsCompleted} completed projects · ${workanaStats.rating}/5 across ${workanaStats.clientReviews} reviews`;

export const metadata: Metadata = {
  title: "EDevsHub | Eduardo Gouveia — Senior Full Stack · Workana HERO",
  description:
    `Custom systems, SaaS platforms and integrations with Eduardo Gouveia. ${workanaProof} · ${workanaStats.level} on Workana.`,
  keywords: [
    "Eduardo Gouveia",
    "EDevsHub",
    "Full Stack Developer",
    "Workana HERO",
    "SaaS developer",
    "dashboard developer",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "3D portfolio",
  ],
  alternates: {
    canonical: `${siteUrl}/en`,
    languages: {
      "pt-BR": "/",
      en: "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${siteUrl}/en`,
    siteName: "EDevsHub — Eduardo Gouveia",
    title: "EDevsHub | Eduardo Gouveia — Senior Full Stack · Workana HERO",
    description:
      `Custom systems, SaaS and integrations. ${workanaProof} · ${workanaStats.level} on Workana.`,
    images: [
      {
        url: portfolioOgImage.url,
        width: 1200,
        height: 630,
        alt: `Eduardo Gouveia — Senior Full Stack · Workana ${workanaStats.level}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EDevsHub | Eduardo Gouveia — Senior Full Stack",
    description:
      `${workanaProof} · Workana ${workanaStats.level}. Custom systems, SaaS and integrations.`,
    images: [portfolioOgImage.url],
  },
};

export default function Page() {
  return <HomePage locale="en" />;
}
