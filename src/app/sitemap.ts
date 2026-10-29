import { MetadataRoute } from "next";
import { isNewSiteEnabled } from "@/components/redesign/preview";
import { projects } from "@/lib/constants";
import { siteUrl } from "@/lib/site";

/** Com o site novo, serviços, contratação e privacidade também têm versão em inglês. */
const BILINGUAL = ["/servicos", "/servicos/sistemas-sob-medida", "/servicos/integracoes-e-automacoes", "/servicos/desenvolvimento-saas", "/contratar", "/politica-de-privacidade"];

/** Endereço em português de uma URL do sitemap ("" para a home). */
const ptPathOf = (url: string) => {
  const path = url.slice(siteUrl.length);
  if (path === "/en") return "";
  return path.startsWith("/en/") ? path.slice(3) : path;
};

export default function sitemap(): MetadataRoute.Sitemap {
  // Omit lastModified until a trustworthy per-page content date is available.
  const cases = projects.filter((p) => p.overview);
  const entries: MetadataRoute.Sitemap = [
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
  if (!isNewSiteEnabled()) return entries;

  // Site novo: as páginas em inglês da jornada comercial entram, e cada
  // página de um par português/inglês lista as duas versões e a padrão.
  const english: MetadataRoute.Sitemap = BILINGUAL.map((path) => ({
    url: `${siteUrl}/en${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "/politica-de-privacidade" ? 0.2 : 0.6,
  }));
  return [...entries, ...english].map((entry) => {
    const pt = ptPathOf(entry.url);
    return {
      ...entry,
      alternates: {
        languages: {
          "pt-BR": `${siteUrl}${pt}`,
          en: `${siteUrl}${pt ? `/en${pt}` : "/en"}`,
          "x-default": `${siteUrl}${pt}`,
        },
      },
    };
  });
}
