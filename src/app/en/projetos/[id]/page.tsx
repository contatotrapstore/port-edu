import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { projectColors, siteConfig } from "@/lib/constants";
import { getContent } from "@/lib/content.en";
import { categoryLabel } from "@/lib/i18n";
import { LocaleProvider } from "@/lib/locale";
import CaseStudyContent from "@/components/CaseStudyContent";
import AmbientBackdrop from "@/components/AmbientBackdrop";

const siteUrl = "https://edevshub.com";
const { projects } = getContent("en");

// Only projects with real case-study content get a page; others (e.g. Click) 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.filter((p) => p.overview).map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const p = projects.find((x) => x.id === id);
  if (!p) return {};
  const description = p.overview || p.description;
  const url = `${siteUrl}/en/projetos/${p.id}`;
  return {
    title: `${p.title} — Case | Eduardo Gouveia`,
    description,
    alternates: {
      canonical: url,
      languages: {
        "pt-BR": `/projetos/${p.id}`,
        en: `/en/projetos/${p.id}`,
      },
    },
    openGraph: {
      type: "article",
      locale: "en_US",
      url,
      title: `${p.title} — Case · Eduardo Gouveia`,
      description,
      images: [{ url: p.image, width: 1280, height: 800, alt: p.title }],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project || !project.overview) notFound();

  const color = projectColors[project.category];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        name: project.title,
        description: project.overview || project.description,
        image: `${siteUrl}${project.image}`,
        url: `${siteUrl}/en/projetos/${project.id}`,
        inLanguage: "en",
        keywords: project.tech.join(", "),
        ...(project.url ? { sameAs: project.url } : {}),
        creator: { "@type": "Person", name: siteConfig.name, url: `${siteUrl}/#person` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/en` },
          { "@type": "ListItem", position: 2, name: "Projects", item: `${siteUrl}/en#projects` },
          {
            "@type": "ListItem",
            position: 3,
            name: project.title,
            item: `${siteUrl}/en/projetos/${project.id}`,
          },
        ],
      },
    ],
  };

  return (
    <LocaleProvider locale="en">
      {/* Static textured backdrop only — no moving video behind reading content. */}
      <AmbientBackdrop heroActive={false} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main lang="en" className="fixed inset-0 z-10 overflow-y-auto scrollbar-none">
        <div className="mx-auto max-w-3xl min-h-full px-5 md:px-8 py-10 md:py-16">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[11px] font-[family-name:var(--font-jetbrains-mono)] text-white/50"
          >
            <Link href="/en" className="hover:text-white transition-colors">
              home
            </Link>
            <span aria-hidden className="text-white/25">/</span>
            <Link href="/en#projects" className="hover:text-white transition-colors">
              projects
            </Link>
            <span aria-hidden className="text-white/25">/</span>
            <span className="text-[#4ade80]">{project.id}</span>
          </nav>

          <div className="mt-7 flex items-start justify-between gap-3">
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight">
              {project.title}
            </h1>
            <div className="flex flex-col items-end gap-1.5 shrink-0 pt-1">
              <span
                className="text-[8px] font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-[2px] px-2 py-1 rounded border font-bold"
                style={{ color, borderColor: `${color}30`, backgroundColor: `${color}10` }}
              >
                {categoryLabel("en", project.category)}
              </span>
              {project.year && (
                <span className="text-[10px] font-[family-name:var(--font-jetbrains-mono)] text-white/40">
                  {project.year}
                </span>
              )}
            </div>
          </div>

          {project.image && (
            <div className="mt-6 relative aspect-[16/10] overflow-hidden rounded-lg border border-white/[0.08] bg-[#0d0d0d]">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 92vw, 768px"
                priority
                className="object-cover object-top"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
            </div>
          )}

          <div className="mt-8 rounded-xl border border-white/[0.06] bg-[#0a0a0a]/60 backdrop-blur-sm p-5 md:p-7">
            <CaseStudyContent project={project} />
          </div>

          {/* Prev / next case — no dead ends */}
          {(() => {
            const cases = projects.filter((p) => p.overview);
            const idx = cases.findIndex((p) => p.id === project.id);
            const prev = cases[(idx - 1 + cases.length) % cases.length];
            const next = cases[(idx + 1) % cases.length];
            const CardNav = ({
              p,
              dir,
            }: {
              p: (typeof cases)[number];
              dir: "prev" | "next";
            }) => (
              <Link
                href={`/en/projetos/${p.id}`}
                className={`group flex items-center gap-4 rounded-xl border border-white/[0.08] bg-[#0a0a0a]/60 backdrop-blur-sm p-4 hover:border-white/20 transition-colors ${
                  dir === "next" ? "flex-row-reverse text-right" : ""
                }`}
              >
                <span className="relative h-14 w-24 shrink-0 overflow-hidden rounded border border-white/[0.08]">
                  <Image
                    src={p.cover ?? p.image}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover object-center opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </span>
                <span className="min-w-0">
                  <span className="block text-[9px] font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-[2px] text-white/45 mb-0.5">
                    {dir === "prev" ? "← previous case" : "next case →"}
                  </span>
                  <span className="block font-display font-bold text-white text-sm truncate group-hover:text-[#4ade80] transition-colors">
                    {p.title}
                  </span>
                </span>
              </Link>
            );
            return (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <CardNav p={prev} dir="prev" />
                <CardNav p={next} dir="next" />
              </div>
            );
          })()}
        </div>
      </main>
    </LocaleProvider>
  );
}
