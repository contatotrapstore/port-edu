"use client";

import { usePathname } from "next/navigation";
import { portfolioWorkanaStats as stats } from "@/lib/constants";
import { siteUrl } from "@/lib/site";

type StructuredData = { "@context": string; "@graph": Record<string, unknown>[] };

/** A revisão do portfólio não altera o snapshot aprovado nas páginas de anúncios. */
export default function SiteStructuredData({ legacy }: { legacy: StructuredData }) {
  const pathname = usePathname();
  const isAdsPage = /^\/(contratar|solucoes)(\/|$)/.test(pathname ?? "");
  const data = isAdsPage ? legacy : {
    ...legacy,
    "@graph": legacy["@graph"].map((entity) => entity["@type"] === "Person" ? {
      ...entity,
      description: `Desenvolvedor Full Stack Sênior, nível ${stats.level} na Workana. ${stats.projectsCompleted} projetos realizados e ${stats.rating.toLocaleString("pt-BR")}/5 em ${stats.clientReviews} avaliações. Sistemas sob medida, plataformas SaaS e integrações.`,
      award: [`Nível ${stats.level} na Workana`, `Pico histórico: Top ${stats.peakRankITBrazil} Brasil e Top ${stats.peakRankITGlobal} Global em TI e Programação na Workana`],
    } : entity["@type"] === "ProfessionalService" ? {
      ...entity,
      image: `${siteUrl}/portfolio-og`,
    } : entity),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
