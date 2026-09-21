"use client";

import Link from "next/link";
import { chapters, portfolioWorkanaStats as workanaStats } from "@/lib/constants";
import Section from "@/components/home/Section";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { getContent } from "@/lib/content.en";
import WorkanaLink from "@/components/workana/WorkanaLink";

export default function HeroSection({ progress, onChapterClick }: {
  progress: number;
  onChapterClick: (i: number) => void;
}) {
  const locale = useLocale();
  const { siteConfig } = getContent(locale);
  const rating = workanaStats.rating.toLocaleString(locale === "pt" ? "pt-BR" : "en-US");
  return (
    <Section id="hero" progress={progress} range={chapters[0].range}>
      <div className="relative mx-auto max-w-4xl text-center">
        <p className="mb-6 text-sm sm:text-base text-[#4ade80]">
          Eduardo Gouveia <span className="mx-2 text-white/30">/</span> Full Stack {locale === "pt" ? "Sênior" : "Senior"}
        </p>
        <h1 className="font-display text-[2.25rem] leading-[1.12] sm:text-5xl lg:text-[4rem] font-bold tracking-tight text-white text-balance">
          {siteConfig.title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-white/75 text-pretty">
          {siteConfig.subtitle}
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/80" aria-label={t(locale, "hero.proofLabel")}>
          <span className="font-semibold text-[#fbbf24]">Workana {workanaStats.level}</span>
          <span><strong className="text-white">{workanaStats.projectsCompleted}</strong> {t(locale, "hero.projectsPill")}</span>
          <span><strong className="text-white">★ {rating}/5</strong> · {t(locale, "about.reviewsCount", { count: workanaStats.clientReviews })}</span>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <WorkanaLink location="hero" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#fbbf24] px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#fcd34d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#fbbf24]">
            {t(locale, "hero.hireCta")} <span aria-hidden="true">↗</span>
          </WorkanaLink>
          <button onClick={() => onChapterClick(1)} className="min-h-12 rounded-lg border border-white/25 bg-black/20 px-5 py-3 text-sm text-white transition-colors hover:border-[#4ade80] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4ade80]">
            {t(locale, "hero.viewProjects")}
          </button>
        </div>
        <p className="mt-4 text-xs text-white/50">{t(locale, "proof.checked", { date: workanaStats.verifiedAtLabel })}</p>
        <Link href="/servicos" className="mt-2 inline-flex min-h-11 items-center text-sm text-white/70 underline underline-offset-4 transition-colors hover:text-[#4ade80]">
          {locale === "pt" ? "Conheça os serviços e como definir seu projeto" : "Explore services and project scope (in Portuguese)"} <span aria-hidden className="ml-2">↗</span>
        </Link>
      </div>
    </Section>
  );
}
