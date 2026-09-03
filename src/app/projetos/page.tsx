import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { projects, projectColors, workanaStats } from "@/lib/constants";
import { siteUrl } from "@/lib/site";
import CaseHeader from "@/components/CaseHeader";
import AuthorCard from "@/components/AuthorCard";

/**
 * Índice do acervo de cases.
 *
 * Antes desta página, os 22 cases eram órfãos: a home não tinha um único
 * `<a href="/projetos/...">` (os cards abrem modal via onClick) e /projetos
 * dava 404 — o Google só chegava neles pelo sitemap, sem receber autoridade
 * de lugar nenhum. Aqui eles ganham links reais, agrupados por vertical.
 */

export const metadata: Metadata = {
  title: "Cases de software sob medida — automação com IA, integrações e SaaS",
  description:
    `${workanaStats.projectsCompleted} projetos entregues. Cases de automação com IA, sistemas e integrações sob medida, SaaS, apps e e-commerce — com o problema, a solução e o resultado de cada um.`,
  alternates: { canonical: "/projetos" },
};

const VERTICALS: Array<{ id: string; label: string; blurb: string }> = [
  {
    id: "automacao-ia",
    label: "Automação e IA",
    blurb: "Atendimento, qualificação e processos que rodam sem intervenção manual, integrados ao que a empresa já usa.",
  },
  {
    id: "sistemas",
    label: "Sistemas e integrações",
    blurb: "Painéis, ERPs e CRMs sob medida que substituem planilhas e conectam sistemas que não se conversam.",
  },
  {
    id: "saude",
    label: "Saúde e clínicas",
    blurb: "Prontuário, agenda, teleconsulta e neurofeedback — a vertical com mais entregas do portfólio.",
  },
  { id: "apps", label: "Apps", blurb: "Aplicativos nativos e multiplataforma publicados nas lojas." },
  { id: "web", label: "E-commerce e sites", blurb: "Lojas virtuais e sites institucionais sob medida." },
];

export default function ProjetosIndexPage() {
  const cases = projects.filter((p) => p.overview);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Cases de software sob medida",
    url: `${siteUrl}/projetos`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: cases.length,
      itemListElement: cases.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${siteUrl}/projetos/${p.id}`,
        name: p.title,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen">
        <CaseHeader source="projetos_index" />
        <main className="mx-auto max-w-3xl px-5 md:px-8 py-10 md:py-14">
          <p className="text-[11px] font-[family-name:var(--font-jetbrains-mono)] text-[#4ade80]">
            $ ls -la ./cases
          </p>
          <h1 className="mt-4 font-display text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight">
            Cases de software sob medida
          </h1>
          <p className="mt-3 text-white/60 leading-relaxed max-w-[62ch]">
            {cases.length} projetos documentados dos {workanaStats.projectsCompleted} entregues —
            com o problema que existia antes, a solução construída e o que mudou depois.
          </p>

          {VERTICALS.map((v) => {
            const items = cases.filter((p) => p.vertical === v.id);
            if (!items.length) return null;
            return (
              <section key={v.id} className="mt-12">
                <h2 className="font-display text-xl font-bold text-white">{v.label}</h2>
                <p className="mt-1 text-[13px] text-white/50 leading-relaxed max-w-[62ch]">
                  {v.blurb}
                </p>
                <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {items.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/projetos/${p.id}`}
                        className="group block terminal-window overflow-hidden hover:border-white/20 transition-colors h-full"
                      >
                        <span className="relative block aspect-[16/10] overflow-hidden bg-[#0d0d0d]">
                          <Image
                            src={p.cover ?? p.image}
                            alt=""
                            fill
                            sizes="(max-width: 640px) 92vw, 340px"
                            className="object-cover object-center opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                          <span
                            className="absolute top-2 right-2 text-[7px] font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-[2px] px-1.5 py-0.5 rounded border font-bold bg-black/70 backdrop-blur-sm"
                            style={{
                              color: projectColors[p.category],
                              borderColor: `${projectColors[p.category]}55`,
                            }}
                          >
                            {p.category}
                          </span>
                        </span>
                        <span className="block p-3.5">
                          <span className="block font-display text-sm font-bold text-white/85 group-hover:text-white transition-colors">
                            {p.title}
                          </span>
                          <span className="block mt-1 text-[11px] text-white/45 leading-relaxed">
                            {p.headline ?? p.description}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}

          <div className="mt-14">
            <AuthorCard source="projetos_index" />
          </div>
        </main>
      </div>
    </>
  );
}
