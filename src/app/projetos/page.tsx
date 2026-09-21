import type { Metadata } from "next";
import { portfolioWorkanaStats as workanaStats } from "@/lib/constants";
import ProjectCatalog from "@/components/ProjectCatalog";
import { portfolioOgImage } from "@/lib/portfolio-metadata";

export const metadata: Metadata = {
  title: "Cases de software sob medida — automação com IA, integrações e SaaS",
  description: `${workanaStats.projectsCompleted} projetos realizados na Workana. Cases de automação com IA, sistemas, integrações, SaaS e apps: problemas, soluções e capacidades dos produtos.`,
  alternates: {
    canonical: "/projetos",
    languages: { "pt-BR": "/projetos", en: "/en/projetos" },
  },
  openGraph: { title: "Cases de software sob medida", description: "Automação com IA, sistemas, integrações, SaaS e apps: problemas, soluções e capacidades dos produtos.", url: "/projetos", images: [portfolioOgImage] },
  twitter: { card: "summary_large_image", title: "Cases de software sob medida", description: "Projetos documentados de Eduardo Gouveia", images: [portfolioOgImage.url] },
};

export default function ProjetosIndexPage() {
  return <ProjectCatalog locale="pt" />;
}
