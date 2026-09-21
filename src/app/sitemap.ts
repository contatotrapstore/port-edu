import { MetadataRoute } from "next";
import { projects } from "@/lib/constants";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Omit lastModified until a trustworthy per-page content date is available.
  const cases = projects.filter((p) => p.overview);
  return [
    {
      url: siteUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
    // Página comercial: é onde o tráfego orgânico deve aterrissar.
    {
      url: `${siteUrl}/contratar`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    // Índice que tira os 22 cases da orfandade.
    {
      url: `${siteUrl}/projetos`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/en`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/en/projetos`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...[
      "/servicos",
      "/servicos/sistemas-sob-medida",
      "/servicos/integracoes-e-automacoes",
      "/servicos/desenvolvimento-saas",
    ].map((path) => ({
      url: `${siteUrl}${path}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...cases.map((p) => ({
      url: `${siteUrl}/projetos/${p.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...cases.map((p) => ({
      url: `${siteUrl}/en/projetos/${p.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    {
      url: `${siteUrl}/politica-de-privacidade`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
