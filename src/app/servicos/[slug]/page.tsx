import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceDetail from "@/components/services/ServiceDetail";
import { portfolioOgImage } from "@/lib/portfolio-metadata";
import { findService, services } from "@/lib/services";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = findService(slug);
  if (!service) return {};
  const path = `/servicos/${service.slug}`;
  return {
    title: service.metadataTitle,
    description: service.metadataDescription,
    alternates: { canonical: path, languages: {} },
    openGraph: { type: "website", locale: "pt_BR", url: path, title: service.metadataTitle, description: service.metadataDescription, images: [portfolioOgImage] },
    twitter: { card: "summary_large_image", title: service.metadataTitle, description: service.metadataDescription, images: [portfolioOgImage.url] },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = findService(slug);
  if (!service) notFound();
  return <ServiceDetail service={service} />;
}
