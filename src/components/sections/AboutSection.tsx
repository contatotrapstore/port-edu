"use client";

import { chapters, portfolioWorkanaStats as workanaStats } from "@/lib/constants";
import Section from "@/components/home/Section";
import SectionNext from "@/components/home/SectionNext";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { getContent } from "@/lib/content.en";
import WorkanaLink from "@/components/workana/WorkanaLink";

export default function AboutSection({ progress, onChapterClick }: {
  progress: number;
  onChapterClick: (i: number) => void;
}) {
  const locale = useLocale();
  const { siteConfig, resultMetrics, testimonials } = getContent(locale);
  const selectedReviews = ["NATÁLIA D.", "P. M. C.", "Leonardo Flores"]
    .map(author => testimonials.find(review => review.author === author))
    .filter(review => review !== undefined);
  return (
    <Section id="about" progress={progress} range={chapters.find(c => c.id === "about")!.range}>
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white text-balance">{t(locale, "about.title")}</h2>
        <div className="mt-7 grid md:grid-cols-[1fr_auto] gap-8 items-start">
          <div>
            <p className="text-base leading-relaxed text-white/75">{siteConfig.bio}</p>
            <p className="mt-5 text-sm text-[#4ade80]">{t(locale, "about.methodBody")}</p>
          </div>
          <div className="flex items-center gap-3">
            <img src="/images/profile.webp" alt="Eduardo Gouveia" width={64} height={64} loading="lazy" className="size-16 rounded-full object-cover border border-white/20" />
            <div><p className="font-semibold text-white">Eduardo Gouveia</p><p className="mt-1 text-sm text-[#fbbf24]">Workana {workanaStats.level}</p></div>
          </div>
        </div>
        <dl className="mt-8 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/15 border-y border-white/15 py-3">
          {resultMetrics.map(metric => (
            <div key={metric.label} className="py-4 sm:px-5 first:pl-0">
              <dt className="text-sm text-white/65">{metric.label}</dt>
              <dd className="mt-1 text-3xl font-display font-semibold text-white">{metric.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-white/50">{t(locale, "proof.checked", { date: workanaStats.verifiedAtLabel })}</p>
        <p className="mt-3 text-sm text-white/60">
          {locale === "pt" ? "Picos históricos em TI e Programação: Top 1 Brasil e Top 3 global na Workana." : "Historical peaks in IT & Programming: #1 in Brazil and Top 3 worldwide on Workana."}
        </p>
        <h3 className="mt-10 mb-5 font-display text-2xl font-semibold text-white">{t(locale, "about.reviewsHeading")}</h3>
        <div className="grid gap-5 md:grid-cols-3">
          {selectedReviews.map(review => (
            <figure key={review.author} className="rounded-xl border border-white/15 bg-black/30 p-5">
              <p className="text-[#fbbf24] text-sm" aria-label={review.rating + " / 5"}>{"★".repeat(review.rating)}</p>
              <blockquote className="mt-3 text-sm leading-relaxed text-white/80">{review.text}</blockquote>
              <figcaption className="mt-5 border-t border-white/10 pt-4 text-sm">
                <span className="font-semibold text-white">{review.author}</span>
                <span className="block mt-1 text-white/60 leading-relaxed">{review.project}</span>
                <span className="block mt-2 text-xs text-white/45">{review.date}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <WorkanaLink location="about_reviews" className="mt-5 inline-flex min-h-11 items-center text-sm text-[#fbbf24] underline underline-offset-4">
          {t(locale, "about.allReviews", { count: workanaStats.clientReviews })}
        </WorkanaLink>
      </div>
      <SectionNext index={2} onChapterClick={onChapterClick} />
    </Section>
  );
}
