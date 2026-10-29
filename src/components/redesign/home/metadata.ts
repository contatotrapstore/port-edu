import type { Metadata } from "next";
import { workanaProfile as stats } from "@/lib/constants";
import type { Locale } from "@/lib/locale";
import { portfolioOgImage } from "@/lib/portfolio-metadata";
import { siteUrl } from "@/lib/site";

/**
 * Metadados da nova home de marca. Só valem quando ela ocupa `/` e `/en`
 * (EDH_NEW_SITE=1); a prévia em /redesign tem os próprios, sem indexação.
 * Os números vêm de portfolioWorkanaStats, a mesma fonte da home atual.
 */
export function brandHomeMetadata(locale: Locale): Metadata {
  const en = locale === "en";
  const title = en ? "EDevsHub | Custom software for real operations." : "EDevsHub | Software sob medida para operações reais.";
  const proof = en
    ? `${stats.projectsCompleted} projects completed on Workana, rated ${stats.rating}/5 across ${stats.clientReviews} reviews.`
    : `${stats.projectsCompleted} projetos realizados na Workana, nota ${stats.rating.toLocaleString("pt-BR")}/5 em ${stats.clientReviews} avaliações.`;
  const description = en
    ? `Custom software company: systems, digital products, online stores and integrations, with AI where it helps solve the problem. ${proof}`
    : `Empresa de software sob medida: sistemas, produtos digitais, lojas e integrações, com IA onde ela ajuda a resolver o problema. ${proof}`;
  const url = en ? `${siteUrl}/en` : siteUrl;

  return {
    title,
    description,
    alternates: { canonical: url, languages: { "pt-BR": "/", en: "/en", "x-default": "/" } },
    openGraph: {
      type: "website",
      locale: en ? "en_US" : "pt_BR",
      url,
      siteName: "EDevsHub",
      title,
      description,
      images: [portfolioOgImage],
    },
    twitter: { card: "summary_large_image", title, description, images: [portfolioOgImage.url] },
  };
}
