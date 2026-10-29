import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HirePage from "@/components/contact/HirePage";
import { getHireContent } from "@/components/contact/hire-content";
import { isNewSiteEnabled } from "@/components/redesign/preview";
import { portfolioOgImage } from "@/lib/portfolio-metadata";

const hire = getHireContent("en");

// Versão em inglês de /contratar: existe só com EDH_NEW_SITE=1 (ver preview.ts).
export const metadata: Metadata = {
  title: hire.title,
  description: hire.description,
  alternates: { canonical: "/en/contratar", languages: { "pt-BR": "/contratar", en: "/en/contratar", "x-default": "/contratar" } },
  openGraph: { type: "website", locale: "en_US", url: "/en/contratar", title: hire.title, description: hire.description, images: [portfolioOgImage] },
  twitter: { card: "summary_large_image", title: hire.title, description: hire.description, images: [portfolioOgImage.url] },
};

export default function HirePageEN() {
  if (!isNewSiteEnabled()) notFound();
  return <HirePage locale="en" />;
}
