import type { Metadata } from "next";
import { portfolioWorkanaStats as workanaStats } from "@/lib/constants";
import ProjectCatalog from "@/components/ProjectCatalog";
import { isNewSiteEnabled } from "@/components/redesign/preview";
import ProjectsIndex from "@site/projects";
import { portfolioOgImage } from "@/lib/portfolio-metadata";

export const metadata: Metadata = {
  title: "Cases de software sob medida — automação com IA, integrações e SaaS",
  description: `${workanaStats.projectsCompleted} projetos realizados na Workana. Cases de automação com IA, sistemas, integrações, SaaS e apps: problemas, soluções e capacidades dos produtos.`,
  alternates: {
    canonical: "/projetos",
    // x-default só com o site novo, igual ao sitemap e às outras páginas bilíngues.
    languages: { "pt-BR": "/projetos", en: "/en/projetos", ...(isNewSiteEnabled() ? { "x-default": "/projetos" } : {}) },
  },
  openGraph: { title: "Cases de software sob medida", description: "Automação com IA, sistemas, integrações, SaaS e apps: problemas, soluções e capacidades dos produtos.", url: "/projetos", images: [portfolioOgImage] },
  twitter: { card: "summary_large_image", title: "Cases de software sob medida", description: "Projetos documentados de Eduardo Gouveia", images: [portfolioOgImage.url] },
};

export default function ProjetosIndexPage() {
  // EDH_NEW_SITE=1 no build: o índice no design novo (ver preview.ts).
  if (isNewSiteEnabled() && ProjectsIndex) return <ProjectsIndex locale="pt" />;
  return <ProjectCatalog locale="pt" />;
}
