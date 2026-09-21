import type { Metadata } from "next";
import { portfolioWorkanaStats as stats } from "@/lib/constants";
import { siteUrl } from "@/lib/site";

export const portfolioOgImage = {
  url: "/portfolio-og",
  width: 1200,
  height: 630,
  alt: `Eduardo Gouveia — sistemas, SaaS e integrações · Workana ${stats.level}`,
};

const description = `Sistemas sob medida, plataformas SaaS e integrações com Eduardo Gouveia. ${stats.projectsCompleted} projetos realizados · ${stats.rating.toLocaleString("pt-BR")}/5 em ${stats.clientReviews} avaliações · ${stats.level} na Workana.`;

export const portfolioMetadata: Metadata = {
  title: "EDevsHub | Eduardo Gouveia — Sistemas, SaaS e integrações",
  description,
  alternates: { canonical: siteUrl, languages: { "pt-BR": "/", en: "/en", "x-default": "/" } },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "EDevsHub — Eduardo Gouveia",
    title: "Eduardo Gouveia — Sistemas, SaaS e integrações",
    description,
    images: [portfolioOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eduardo Gouveia — Sistemas, SaaS e integrações",
    description,
    images: [portfolioOgImage.url],
  },
};
