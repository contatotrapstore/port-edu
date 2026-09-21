import Link from "next/link";
import Image from "next/image";
import { projectColors, portfolioWorkanaStats as workanaStats, type Project } from "@/lib/constants";
import { getContent } from "@/lib/content.en";
import { categoryLabel } from "@/lib/i18n";
import { LocaleProvider, type Locale } from "@/lib/locale";
import { siteUrl } from "@/lib/site";
import CaseHeader from "@/components/CaseHeader";
import AuthorCard from "@/components/AuthorCard";

type Vertical = { id: Project["vertical"]; label: string; blurb: string };

const copy: Record<Locale, { title: string; intro: (count: number) => string; verticals: Vertical[] }> = {
  pt: {
    title: "Cases de software sob medida",
    intro: (count) => `${count} projetos documentados: o problema, a solução e as capacidades de cada produto. Encontre o tipo de trabalho que se aproxima do seu projeto.`,
    verticals: [
      { id: "automacao-ia", label: "Automação e IA", blurb: "Atendimento, qualificação e registro de informações, integrados às ferramentas que a empresa já usa." },
      { id: "sistemas", label: "Sistemas e integrações", blurb: "Painéis, ERPs e CRMs sob medida para organizar processos e conectar ferramentas." },
      { id: "saude", label: "Saúde e clínicas", blurb: "Prontuário, agenda, teleconsulta e neurofeedback em produtos para profissionais de saúde." },
      { id: "apps", label: "Aplicativos", blurb: "Produtos mobile para diferentes rotinas e públicos." },
      { id: "web", label: "E-commerce e sites", blurb: "Lojas virtuais e sites institucionais sob medida." },
    ],
  },
  en: {
    title: "Custom software case studies",
    intro: (count) => `${count} documented projects: the problem, the solution and each product’s capabilities. Find work relevant to your project.`,
    verticals: [
      { id: "automacao-ia", label: "Automation and AI", blurb: "Customer service, lead qualification and information capture connected to the tools the business already uses." },
      { id: "sistemas", label: "Systems and integrations", blurb: "Custom dashboards, ERPs and CRMs to organize processes and connect tools." },
      { id: "saude", label: "Healthcare and clinics", blurb: "Patient records, scheduling, telehealth and neurofeedback products for healthcare professionals." },
      { id: "apps", label: "Mobile apps", blurb: "Mobile products for different workflows and audiences." },
      { id: "web", label: "E-commerce and websites", blurb: "Custom online stores and corporate websites." },
    ],
  },
};

export default function ProjectCatalog({ locale }: { locale: Locale }) {
  const content = copy[locale];
  const cases = getContent(locale).projects.filter((p) => p.overview);
  const basePath = locale === "en" ? "/en/projetos" : "/projetos";
  const source = locale === "en" ? "projetos_index_en" : "projetos_index";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: content.title,
    url: `${siteUrl}${basePath}`,
    inLanguage: locale === "en" ? "en" : "pt-BR",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: cases.length,
      itemListElement: cases.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${siteUrl}${basePath}/${p.id}`,
        name: p.title,
      })),
    },
  };

  return (
    <LocaleProvider locale={locale}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* The homepage uses fixed chapters; catalog pages need native document scrolling. */}
      <div data-scroll-page lang={locale === "en" ? "en" : "pt-BR"} className="min-h-screen">
        <CaseHeader source={source} />
        <main className="mx-auto max-w-3xl px-5 md:px-8 py-10 md:py-14">
          <p className="text-xs font-[family-name:var(--font-jetbrains-mono)] text-[#4ade80]">
            {locale === "en" ? "PROJECT PORTFOLIO" : "PORTFÓLIO DE PROJETOS"}
          </p>
          <h1 className="mt-4 font-display text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight">
            {content.title}
          </h1>
          <p className="mt-3 text-white/70 leading-relaxed max-w-[62ch]">{content.intro(cases.length)}</p>
          <p className="mt-3 text-sm text-white/55">
            {workanaStats.projectsCompleted} {locale === "en" ? "completed projects on Workana" : "projetos realizados na Workana"} · {workanaStats.level}
          </p>
          <Link href="/servicos" className="mt-4 inline-flex min-h-11 items-center text-sm text-[#4ade80] underline underline-offset-4 hover:text-white">
            {locale === "en" ? "Explore development services (in Portuguese)" : "Conheça os serviços e o que entra em cada escopo"} <span aria-hidden className="ml-2">↗</span>
          </Link>

          {content.verticals.map((v) => {
            const items = cases.filter((p) => p.vertical === v.id);
            if (!items.length) return null;
            return (
              <section key={v.id} className="mt-12">
                <h2 className="font-display text-xl font-bold text-white">{v.label}</h2>
                <p className="mt-1 text-[15px] text-white/65 leading-relaxed max-w-[62ch]">{v.blurb}</p>
                <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {items.map((p) => (
                    <li key={p.id}>
                      <Link href={`${basePath}/${p.id}`} className="group block terminal-window overflow-hidden hover:border-white/20 transition-colors h-full">
                        <span className="relative block aspect-[16/10] overflow-hidden bg-[#0d0d0d]">
                          <Image src={p.cover ?? p.image} alt="" fill sizes="(max-width: 640px) 92vw, 340px" className="object-cover object-center opacity-80 group-hover:opacity-100 transition-opacity" />
                          <span className="absolute top-2 right-2 text-[10px] font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-[1px] px-2 py-1 rounded border font-bold bg-black/80 backdrop-blur-sm" style={{ color: projectColors[p.category], borderColor: `${projectColors[p.category]}55` }}>
                            {categoryLabel(locale, p.category)}
                          </span>
                        </span>
                        <span className="block p-3.5">
                          <span className="block font-display text-base font-bold text-white/90 group-hover:text-white transition-colors">{p.title}</span>
                          <span className="block mt-1 text-[15px] text-white/65 leading-relaxed">
                            {locale === "en" ? p.description : p.headline ?? p.description}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}

          <div className="mt-14"><AuthorCard source={source} locale={locale} /></div>
        </main>
      </div>
    </LocaleProvider>
  );
}
