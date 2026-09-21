import type { Metadata } from "next";
import { portfolioWorkanaStats as workanaStats } from "@/lib/constants";
import ProjectCatalog from "@/components/ProjectCatalog";
import { portfolioOgImage } from "@/lib/portfolio-metadata";

export const metadata: Metadata = {
  title: "Custom software case studies — AI automation, integrations and SaaS",
  description: `${workanaStats.projectsCompleted} completed projects on Workana. Case studies covering AI automation, systems, integrations, SaaS and apps: problems, solutions and product capabilities.`,
  alternates: {
    canonical: "/en/projetos",
    languages: { "pt-BR": "/projetos", en: "/en/projetos" },
  },
  openGraph: { locale: "en_US", title: "Custom software case studies", description: "AI automation, systems, integrations, SaaS and apps: problems, solutions and product capabilities.", url: "/en/projetos", images: [portfolioOgImage] },
  twitter: { card: "summary_large_image", title: "Custom software case studies", description: "Documented projects by Eduardo Gouveia", images: [portfolioOgImage.url] },
};

export default function ProjectsIndexPage() {
  return <ProjectCatalog locale="en" />;
}
