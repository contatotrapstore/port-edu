import { MetadataRoute } from "next";
import { projects } from "@/lib/constants";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const cases = projects.filter((p) => p.overview);
  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    // Página comercial: é onde o tráfego orgânico deve aterrissar.
    {
      url: `${siteUrl}/contratar`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    // Índice que tira os 22 cases da orfandade.
    {
      url: `${siteUrl}/projetos`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/en`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...cases.map((p) => ({
      url: `${siteUrl}/projetos/${p.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...cases.map((p) => ({
      url: `${siteUrl}/en/projetos/${p.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    {
      url: `${siteUrl}/politica-de-privacidade`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
