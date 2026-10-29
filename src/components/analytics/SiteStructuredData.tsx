"use client";

import { usePathname } from "next/navigation";
import { workanaProfile as stats } from "@/lib/constants";
import { siteUrl } from "@/lib/site";

type StructuredData = { "@context": string; "@graph": Record<string, unknown>[] };

/**
 * Mesmos números em todas as páginas, vindos do snapshot central do perfil.
 * O pico histórico de ranking não entra: a plataforma não o confirma. Este
 * bloco também sai na /workana: nenhum canal fora da Workana entra aqui.
 */
export default function SiteStructuredData({ legacy }: { legacy: StructuredData }) {
  const pathname = usePathname();
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return null;
  const data = {
    ...legacy,
    "@graph": legacy["@graph"].map((entity) => entity["@type"] === "Person" ? {
      ...entity,
      description: `Desenvolvedor Full Stack Sênior, nível ${stats.level} na Workana. ${stats.projectsCompleted} projetos realizados e ${stats.rating.toLocaleString("pt-BR")}/5 em ${stats.clientReviews} avaliações. Sistemas sob medida, plataformas SaaS e integrações.`,
      award: [`Nível ${stats.level} na Workana`],
    } : entity["@type"] === "ProfessionalService" ? {
      ...entity,
      image: `${siteUrl}/portfolio-og`,
    } : entity),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
