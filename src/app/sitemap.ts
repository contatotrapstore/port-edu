import { MetadataRoute } from "next";
import { projects } from "@/lib/constants";

const siteUrl = "https://edevshub.com";

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
    {
      url: `${siteUrl}/en`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
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
      priority: 0.7,
    })),
  ];
}
