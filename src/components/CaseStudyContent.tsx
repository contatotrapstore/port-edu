"use client";

import type { ReactNode } from "react";
import { projectColors, type Project } from "@/lib/constants";
import WorkanaLink from "@/components/workana/WorkanaLink";
import CaseGallery from "@/components/CaseGallery";
import CaseInsights from "@/components/CaseInsights";
import { getCaseInsights } from "@/lib/case-insights";
import { getPortfolioRole } from "@/lib/portfolio-case-copy";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

function Label({ children, color }: { children: ReactNode; color: string }) {
  return (
    <h2
      className="mb-3 font-display text-lg font-semibold leading-snug"
      style={{ color }}
    >
      {children}
    </h2>
  );
}

/** Shared case-study body — used by both the modal preview and the /projetos/[id] page. */
export default function CaseStudyContent({ project }: { project: Project }) {
  const locale = useLocale();
  const color = projectColors[project.category];
  const capabilities = project.portfolioOutput ?? project.output;
  const insights = getCaseInsights(project.id, locale);
  const role = project.role ?? getPortfolioRole(project.id, locale);
  const galleryImages = project.gallery?.length
    ? project.gallery
    : insights?.useProjectImage && project.image
      ? [project.image]
      : [];

  return (
    <div className="space-y-6">
      <p className="text-[15px] md:text-base leading-relaxed text-white/75">
        {project.overview || project.description}
      </p>

      {role && (
        <div className="border-l-2 border-[#4ade80]/50 pl-4">
          <Label color="#4ade80">{t(locale, "case.role")}</Label>
          <p className="text-[15px] leading-relaxed text-white/80">{role}</p>
        </div>
      )}

      {galleryImages.length > 0 && (
        <CaseGallery key={project.id} images={galleryImages} title={project.title} caption={insights?.galleryCaptions} />
      )}

      {project.problem && (
        <div>
          <Label color={color}>{t(locale, "case.challenge")}</Label>
          <p className="text-[15px] leading-relaxed text-white/75">{project.problem}</p>
        </div>
      )}

      {project.approach && (
        <div>
          <Label color={color}>{t(locale, "case.solution")}</Label>
          <p className="text-[15px] leading-relaxed text-white/75">{project.approach}</p>
        </div>
      )}

      {project.features && project.features.length > 0 && (
        <div>
          <Label color={color}>{t(locale, "case.features")}</Label>
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
            {project.features.map((f) => (
              <li key={f} className="text-[15px] leading-relaxed text-white/75 flex items-start gap-2">
                <span style={{ color }} className="shrink-0">▹</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {capabilities && capabilities.length > 0 && (
        <div>
          <Label color="#4ade80">{t(locale, "case.productOutput")}</Label>
          <ul className="space-y-1.5">
            {capabilities.map((o) => (
              <li key={o} className="text-[15px] leading-relaxed text-white/75 flex items-start gap-2">
                <span className="text-[#4ade80] shrink-0">▹</span>
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <Label color="#c0c0c0">{t(locale, "case.stack")}</Label>
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="text-[11px] font-[family-name:var(--font-jetbrains-mono)] px-2.5 py-1 rounded bg-white/[0.05] text-white/70 border border-white/[0.08]"
            >
              &lt;{tech} /&gt;
            </span>
          ))}
        </div>
      </div>

      {insights && <CaseInsights content={insights} locale={locale} />}

      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 pt-1">
        <WorkanaLink location={`case_${project.id}`} className="inline-flex items-center justify-center gap-2 text-[14px] font-bold text-black px-5 min-h-12 py-3 rounded-lg bg-[#fbbf24] hover:bg-[#fcd34d] transition-colors text-center">
          {t(locale, "case.discuss")} <span aria-hidden>↗</span>
        </WorkanaLink>
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-[13px] font-bold px-4 min-h-12 py-3 rounded-lg border border-white/15 text-white hover:bg-white/[0.06] transition-colors"
          >
            {t(locale, "case.viewLive")} <span aria-hidden>↗</span>
          </a>
        )}
      </div>
    </div>
  );
}
