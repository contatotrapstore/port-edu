"use client";

import { m } from "framer-motion";
import { chapters, workanaStats } from "@/lib/constants";
import TerminalHeader from "@/components/TerminalHeader";
import Section from "@/components/home/Section";
import SectionNext from "@/components/home/SectionNext";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { getContent } from "@/lib/content.en";

const rangeOf = (id: string) => chapters.find((c) => c.id === id)!.range;

export default function AboutSection({
  progress,
  onChapterClick,
}: {
  progress: number;
  onChapterClick: (i: number) => void;
}) {
  const locale = useLocale();
  const { siteConfig, resultMetrics, testimonials } = getContent(locale);
  return (
    <Section id="about" progress={progress} range={rangeOf("about")}>
      <div>
        <h2 className="font-display text-2xl md:text-4xl font-bold text-white mb-2">
          {t(locale, "about.title")}<span className="text-white/20">.</span>
        </h2>
        <div className="h-0.5 w-16 bg-gradient-to-r from-white/30 to-transparent mb-6" />
      </div>
      <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-start md:items-center">
        {/* Terminal with bio */}
        <div className="terminal-window">
          <TerminalHeader title="about.md — bash" />
          <div className="p-5 font-[family-name:var(--font-jetbrains-mono)] text-sm">
            <p className="text-[#4ade80]">$ cat about.md</p>
            <p className="text-white/50 mt-3 leading-relaxed text-xs">
              {siteConfig.bio}
            </p>
            <p className="text-[#4ade80] mt-4">
              <span className="cursor-blink">&gt;</span> _
            </p>
          </div>
        </div>

        {/* Workana Profile Card */}
        <div className="terminal-window relative overflow-hidden">
          {/* Subtle glow accent top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#fbbf24]/30 to-transparent" />
          <TerminalHeader title="workana-profile.json" />
          <div className="p-5 md:p-6">
            {/* Profile photo + name + rating */}
            <div className="flex items-center gap-3 mb-5">
              <div className="relative shrink-0">
                <img
                  src="/images/profile.webp"
                  alt="Eduardo Gouveia"
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#fbbf24]/50"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-[#111] bg-[#fbbf24]/20 flex items-center justify-center">
                  <span className="text-[#fbbf24] font-bold text-[6px] font-[family-name:var(--font-jetbrains-mono)]">H</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-white font-semibold text-sm">Eduardo Gouveia</div>
                <div className="text-white/55 text-xs">Full Stack Senior · HERO</div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <span className="text-[#fbbf24] text-sm">★★★★★</span>
                </div>
                <div className="text-[9px] text-white/30 font-[family-name:var(--font-jetbrains-mono)]">
                  {workanaStats.rating} · {workanaStats.clientReviews}
                </div>
              </div>
            </div>
            {/* Stats grid with accent borders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-[family-name:var(--font-jetbrains-mono)]">
              <div className="bg-white/[0.03] rounded-lg p-3.5 border-l-2 border-white/10">
                <div className="text-gradient-silver text-xl font-bold">{workanaStats.projectsCompleted}+</div>
                <div className="text-white/55 mt-0.5">{t(locale, "about.delivered")}</div>
              </div>
              <div className="bg-white/[0.03] rounded-lg p-3.5 border-l-2 border-white/10">
                <div className="text-gradient-silver text-xl font-bold">{workanaStats.recurringClients}</div>
                <div className="text-white/55 mt-0.5">{t(locale, "about.recurringClients")}</div>
              </div>
              <div className="bg-white/[0.03] rounded-lg p-3.5 border-l-2 border-[#4ade80]/30">
                <div className="text-[#4ade80] text-xl font-bold">#{workanaStats.rankITBrazil}</div>
                <div className="text-white/55 mt-0.5">{t(locale, "about.rankBrazil")}</div>
              </div>
              <div className="bg-white/[0.03] rounded-lg p-3.5 border-l-2 border-[#60a5fa]/30">
                <div className="text-[#60a5fa] text-xl font-bold">#{workanaStats.rankITGlobal}</div>
                <div className="text-white/55 mt-0.5">{t(locale, "about.rankGlobal")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Result Metrics — value-for-client */}
      <div className="mt-10 md:mt-12">
        <p className="text-[10px] font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-[3px] text-white/40 mb-4">
          {t(locale, "about.metricsHeading")}
        </p>
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {resultMetrics.map((metric, i) => (
            <m.div
              key={metric.label}
              className="terminal-window p-4 md:p-5 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div className="text-2xl md:text-3xl font-bold text-gradient-silver">
                {metric.value}
              </div>
              <div className="text-[10px] md:text-xs font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-[1px] md:tracking-[2px] text-[#4ade80] mt-1.5">
                {metric.label}
              </div>
              <div className="text-[10px] md:text-[11px] text-white/50 mt-1 hidden md:block">
                {metric.description}
              </div>
            </m.div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="mt-10 mb-2">
        <p className="text-[10px] font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-[3px] text-white/40 mb-4">
          {t(locale, "about.reviewsHeading")}
        </p>
      </div>
      <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-3 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible">
        {testimonials.map((tm, i) => (
          <div key={i} className="terminal-window p-5 md:p-6 flex flex-col min-w-[85%] snap-center sm:min-w-[70%] md:min-w-0">
            {/* Header: stars + verified badge */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="text-[#fbbf24] text-[11px]">{"★".repeat(tm.rating)}</div>
              {tm.verified && (
                <div className="flex items-center gap-1 text-[8px] font-[family-name:var(--font-jetbrains-mono)] text-[#4ade80] bg-[#4ade80]/10 px-2 py-0.5 rounded border border-[#4ade80]/20 shrink-0">
                  <span className="w-1 h-1 rounded-full bg-[#4ade80]" />
                  {t(locale, "about.verified")}
                </div>
              )}
            </div>
            <p className="text-white/50 text-[11px] md:text-xs leading-relaxed italic mb-4 flex-1">
              <span className="text-white/20 text-lg leading-none">&ldquo;</span>
              {tm.text}
              <span className="text-white/20 text-lg leading-none">&rdquo;</span>
            </p>
            <div className="flex flex-col gap-1.5 pt-3 border-t border-white/[0.06]">
              <div className="text-[10px] font-[family-name:var(--font-jetbrains-mono)] text-white/55">
                — {tm.author}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-[family-name:var(--font-jetbrains-mono)] flex-wrap">
                <span className="text-white/45">{tm.date}</span>
                <span className="text-white/15">·</span>
                <span className="text-[#60a5fa]/70">{tm.projectType}</span>
                {tm.recurring && (
                  <>
                    <span className="text-white/15">·</span>
                    <span className="text-[#4ade80]/70">{t(locale, "about.recurringTag")}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Link to all reviews */}
      <div className="mt-5 text-center">
        <a
          href={workanaStats.workanaProfileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-[family-name:var(--font-jetbrains-mono)] text-white/50 hover:text-[#fbbf24] transition-colors inline-flex items-center gap-2"
        >
          {t(locale, "about.allReviews", { count: workanaStats.clientReviews })}
          <span>→</span>
        </a>
      </div>
    <SectionNext index={2} onChapterClick={onChapterClick} />
    </Section>
  );
}
