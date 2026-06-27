import { MetadataRoute } from "next";
import { projects } from "@/lib/constants";

const siteUrl = "https://edevshub.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projects
      .filter((p) => p.overview)
      .map((p) => ({
        url: `${siteUrl}/projetos/${p.id}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
  ];
}
