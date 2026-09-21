"use client";

import { chapters, portfolioWorkanaStats as workanaStats } from "@/lib/constants";
import Section from "@/components/home/Section";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import WorkanaLink from "@/components/workana/WorkanaLink";

export default function ContactSection({ progress }: { progress: number }) {
  const locale = useLocale();
  return (
    <Section id="contact" progress={progress} range={chapters.find(c => c.id === "contact")!.range}>
      <div className="max-w-2xl mx-auto w-full">
        <p className="text-[#4ade80] mb-5 text-sm">{t(locale, "contact.title")}</p>
        <h2 className="font-display text-3xl sm:text-5xl font-bold text-white leading-tight text-balance">{t(locale, "contact.headline")}</h2>
        <p className="mt-5 text-base sm:text-lg leading-relaxed text-white/70">{t(locale, "contact.response")}</p>
        <ol className="my-8 divide-y divide-white/10 border-y border-white/10">
          {[1, 2, 3].map(step => (
            <li key={step} className="flex gap-4 py-4">
              <span aria-hidden="true" className="font-mono text-sm text-[#4ade80] pt-0.5">0{step}</span>
              <div><h3 className="font-semibold text-white">{t(locale, "contact.step" + step + "Title")}</h3><p className="mt-1 text-sm leading-relaxed text-white/65">{t(locale, "contact.step" + step + "Body")}</p></div>
            </li>
          ))}
        </ol>
        <WorkanaLink location="contact" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-[#fbbf24] px-5 py-3 text-sm sm:text-base font-semibold text-black hover:bg-[#fcd34d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#fbbf24]">
          {t(locale, "hero.hireCta")} <span aria-hidden="true">↗</span>
        </WorkanaLink>
        <p className="mt-4 text-sm text-white/60">{t(locale, "contact.proof", { projects: workanaStats.projectsCompleted, reviews: workanaStats.clientReviews })}</p>
        <p className="mt-2 text-xs text-white/45">{t(locale, "proof.checked", { date: workanaStats.verifiedAtLabel })}</p>
        <footer className="mt-12 text-sm text-white/45">© {new Date().getFullYear()} Eduardo Gouveia · EDevsHub</footer>
      </div>
    </Section>
  );
}
