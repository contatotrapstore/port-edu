import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isNewSiteEnabled } from "@/components/redesign/preview";
import ServicesIndex from "@/components/redesign/site/ServicesIndex";
import { portfolioOgImage } from "@/lib/portfolio-metadata";

const title = "Custom systems, integrations and SaaS | EDevsHub";
const description =
  "Development services by EDevsHub: management systems, integrations and automations, SaaS platforms and the evolution of existing products.";

// Versão em inglês de /servicos: existe só com EDH_NEW_SITE=1 (ver preview.ts).
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/en/servicos", languages: { "pt-BR": "/servicos", en: "/en/servicos", "x-default": "/servicos" } },
  openGraph: { type: "website", locale: "en_US", url: "/en/servicos", title, description, images: [portfolioOgImage] },
  twitter: { card: "summary_large_image", title, description, images: [portfolioOgImage.url] },
};

export default function ServicesPageEN() {
  if (!isNewSiteEnabled()) notFound();
  return <ServicesIndex locale="en" title={title} description={description} />;
}
