import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { projects, projectColors, siteConfig } from "@/lib/constants";
import CaseStudyContent from "@/components/CaseStudyContent";
import AmbientBackdrop from "@/components/AmbientBackdrop";

const siteUrl = "https://edevshub.com";

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
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
  const url = `${siteUrl}/projetos/${p.id}`;
  return {
    title: `${p.title} — Case | Eduardo Gouveia`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
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
  if (!project) notFound();

  const color = projectColors[project.category];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.overview || project.description,
    image: `${siteUrl}${project.image}`,
    url: `${siteUrl}/projetos/${project.id}`,
    keywords: project.tech.join(", "),
    ...(project.url ? { sameAs: project.url } : {}),
    creator: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteUrl,
    },
  };

  return (
    <>
      {/* Static textured backdrop only — no moving video behind reading content. */}
      <AmbientBackdrop heroActive={false} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="fixed inset-0 z-10 overflow-y-auto scrollbar-none">
        <div className="mx-auto max-w-3xl min-h-full px-5 md:px-8 py-10 md:py-16">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-[11px] font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-[2px] text-white/55 hover:text-white transition-colors"
          >
            <span aria-hidden>←</span> voltar aos projetos
          </Link>

          <div className="mt-7 flex items-start justify-between gap-3">
            <h1 className="text-3xl md:text-5xl font-bold text-white font-[family-name:var(--font-jetbrains-mono)] leading-tight">
              {project.title}
            </h1>
            <div className="flex flex-col items-end gap-1.5 shrink-0 pt-1">
              <span
                className="text-[8px] font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-[2px] px-2 py-1 rounded border font-bold"
                style={{ color, borderColor: `${color}30`, backgroundColor: `${color}10` }}
              >
                {project.category}
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
            </div>
          )}

          <div className="mt-8 rounded-xl border border-white/[0.06] bg-[#0a0a0a]/60 backdrop-blur-sm p-5 md:p-7">
            <CaseStudyContent project={project} />
          </div>
        </div>
      </main>
    </>
  );
}
