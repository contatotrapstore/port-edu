import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isNewSiteEnabled } from "@/components/redesign/preview";
import ServiceView from "@/components/redesign/site/ServiceView";
import { portfolioOgImage } from "@/lib/portfolio-metadata";
import { findServiceFor, getServices } from "@/lib/services.en";

export const dynamicParams = false;

export function generateStaticParams() {
  return getServices("en").map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = findServiceFor(slug, "en");
  if (!service) return {};
  const path = `/servicos/${service.slug}`;
  return {
    title: service.metadataTitle,
    description: service.metadataDescription,
    alternates: { canonical: `/en${path}`, languages: { "pt-BR": path, en: `/en${path}`, "x-default": path } },
    openGraph: { type: "website", locale: "en_US", url: `/en${path}`, title: service.metadataTitle, description: service.metadataDescription, images: [portfolioOgImage] },
    twitter: { card: "summary_large_image", title: service.metadataTitle, description: service.metadataDescription, images: [portfolioOgImage.url] },
  };
}

// Versão em inglês de /servicos/[slug]: existe só com EDH_NEW_SITE=1.
export default async function ServicePageEN({ params }: { params: Promise<{ slug: string }> }) {
  if (!isNewSiteEnabled()) notFound();
  const { slug } = await params;
  const service = findServiceFor(slug, "en");
  if (!service) notFound();
  return <ServiceView service={service} locale="en" />;
}
