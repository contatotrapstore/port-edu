"use client";

import { siteConfig, chapters, workanaStats } from "@/lib/constants";
import { track } from "@vercel/analytics";
import TerminalHeader from "@/components/TerminalHeader";
import TerminalPrompt from "@/components/TerminalPrompt";
import Section from "@/components/home/Section";
import { GithubIcon } from "@/components/home/icons";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

const rangeOf = (id: string) => chapters.find((c) => c.id === id)!.range;

export default function ContactSection({ progress }: { progress: number }) {
  const locale = useLocale();
  return (
    <Section id="contact" progress={progress} range={rangeOf("contact")}>
      <div className="max-w-2xl mx-auto w-full">
        <h2 className="font-display text-2xl md:text-4xl font-bold text-white mb-2">
          {t(locale, "contact.title")}<span className="text-white/20">.</span>
        </h2>
        <div className="h-0.5 w-16 bg-gradient-to-r from-white/30 to-transparent mb-6" />

        {/* Hero headline */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 mb-3 text-[10px] font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-[2px] text-[#4ade80] px-3 py-1 rounded-full border border-[#4ade80]/30 bg-[#4ade80]/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
            {t(locale, "contact.accepting")}
          </span>
          <h3 className="font-display text-lg md:text-2xl font-bold text-white leading-tight">
            {t(locale, "contact.headlinePre")}{" "}
            <span className="text-gradient-silver">{t(locale, "contact.headlineAccent")}</span>
            {t(locale, "contact.headlinePost")}
          </h3>
          <p className="text-[11px] md:text-xs text-white/55 font-[family-name:var(--font-jetbrains-mono)] mt-2">
            {t(locale, "contact.response")}
          </p>
        </div>

        {/* Why hire me */}
        <div className="mb-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-[family-name:var(--font-jetbrains-mono)]">
          <div className="terminal-window p-3.5">
            <div className="text-[#fbbf24] text-xs font-bold mb-0.5">{t(locale, "contact.card1Title")}</div>
            <div className="text-[10px] text-white/55">
              {t(locale, "contact.card1Sub", {
                rank: workanaStats.rankITBrazil,
                level: workanaStats.level,
              })}
            </div>
          </div>
          <div className="terminal-window p-3.5">
            <div className="text-[#4ade80] text-xs font-bold mb-0.5">{t(locale, "contact.card2Title")}</div>
            <div className="text-[10px] text-white/55">{t(locale, "contact.card2Sub")}</div>
          </div>
          <div className="terminal-window p-3.5">
            <div className="text-gradient-silver text-xs font-bold mb-0.5">{t(locale, "contact.card3Title")}</div>
            <div className="text-[10px] text-white/55">
              {t(locale, "contact.card3Sub", { count: workanaStats.recurringClients })}
            </div>
          </div>
        </div>

        {/* CTA Principal Workana */}
        <a
          href={workanaStats.workanaProfileUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("workana_cta", { location: "contact" })}
          className="group block mb-5 terminal-window border-[#fbbf24]/30 hover:border-[#fbbf24]/60 transition-all cursor-pointer"
          style={{
            borderWidth: "1px",
            boxShadow: "0 0 20px rgba(251, 191, 36, 0.08)",
          }}
        >
          <TerminalHeader tone="gold" title="hire.sh — executable" />
          <div className="p-5 md:p-6 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="text-[9px] font-[family-name:var(--font-jetbrains-mono)] text-[#fbbf24]/50 uppercase tracking-[2px] mb-1">
                {t(locale, "contact.hireEyebrow", {
                  rank: workanaStats.rankITBrazil,
                  rating: workanaStats.rating,
                })}
              </div>
              <div className="text-base md:text-xl font-bold text-white font-[family-name:var(--font-jetbrains-mono)]">
                {t(locale, "contact.hireCta")}
              </div>
              <div className="text-[10px] md:text-xs text-white/40 mt-1">
                {t(locale, "contact.hireSub", {
                  reviews: workanaStats.clientReviews,
                  recurring: workanaStats.recurringClients,
                })}
              </div>
            </div>
            <div className="text-[#fbbf24] text-2xl md:text-3xl font-bold group-hover:translate-x-1 transition-transform shrink-0">
              →
            </div>
          </div>
        </a>

        {/* Terminal secondary links */}
        <div className="terminal-window">
          <TerminalHeader title="contact — bash" />

          <div className="p-5 md:p-6 font-[family-name:var(--font-jetbrains-mono)] text-sm space-y-3">
            <p className="text-[#4ade80]">
              $ echo &quot;{t(locale, "contact.echo")}&quot;
            </p>
            <p className="text-white/40 text-xs leading-relaxed">
              {t(locale, "contact.pitch")}
            </p>

            <div className="space-y-2 pt-4">
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/40 hover:text-white transition-colors py-1 cursor-pointer"
              >
                <span className="text-[#4ade80]">$</span>
                <span>open</span>
                <GithubIcon className="w-3.5 h-3.5" />
                <span>github</span>
                <span className="text-white/15">--profile</span>
              </a>
              <a
                href={workanaStats.workanaProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/40 hover:text-white transition-colors py-1 cursor-pointer"
              >
                <span className="text-[#4ade80]">$</span>
                <span>open</span>
                <span>workana</span>
                <span className="text-white/15">--hire</span>
              </a>
            </div>

            <div className="pt-2 border-t border-white/[0.06]">
              <TerminalPrompt />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-[10px] text-white/15 uppercase tracking-[2px] font-[family-name:var(--font-jetbrains-mono)]">
          &copy; {new Date().getFullYear()} Eduardo Gouveia — Built with
          Next.js & Three.js
        </div>
      </div>
    </Section>
  );
}
