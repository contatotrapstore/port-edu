"use client";

import { m } from "framer-motion";
import { siteConfig, chapters, codeSnippets, workanaStats } from "@/lib/constants";
import { track } from "@vercel/analytics";
import Section from "@/components/home/Section";
import TypewriterText from "@/components/home/TypewriterText";
import { BrazilFlag } from "@/components/home/icons";

const rangeOf = (id: string) => chapters.find((c) => c.id === id)!.range;

export default function HeroSection({
  progress,
  isLoaded,
  onChapterClick,
}: {
  progress: number;
  isLoaded: boolean;
  onChapterClick: (i: number) => void;
}) {
  return (
    <Section id="hero" progress={progress} range={rangeOf("hero")}>
      <div className="text-center relative grid-overlay scan-line">
        {/* HUD brackets */}
        <div className="hud-bracket -top-8 -left-4 hidden md:block">[</div>
        <div className="hud-bracket -top-8 -right-4 hidden md:block">]</div>
        <div className="hud-bracket -bottom-8 -left-4 hidden md:block">[</div>
        <div className="hud-bracket -bottom-8 -right-4 hidden md:block">]</div>

        {/* Floating code snippets in corners */}
        {codeSnippets.slice(0, 4).map((snippet, i) => (
          <m.div
            key={snippet.lang}
            className="hidden md:block absolute code-block opacity-[0.08] text-[10px]"
            style={{
              top: i < 2 ? "10%" : "auto",
              bottom: i >= 2 ? "10%" : "auto",
              left: i % 2 === 0 ? "-12%" : "auto",
              right: i % 2 === 1 ? "-12%" : "auto",
              color: snippet.color,
            }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="text-white/20 mb-1">// {snippet.lang}</div>
            {snippet.code}
          </m.div>
        ))}

        {/* Main heading with glitch */}
        <m.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1
            className="glitch-text font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-[10rem] font-bold tracking-tight leading-[0.9]"
            data-text="EDUARDO GOUVEIA"
          >
            <span className="block">EDUARDO</span>
            <span className="block text-gradient-silver">GOUVEIA</span>
          </h1>
        </m.div>

        {/* Decorative line */}
        <m.div
          className="h-px w-32 mx-auto mt-6 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />

        {/* Subtitle with typewriter */}
        <m.div
          className="mt-4 font-[family-name:var(--font-jetbrains-mono)] text-[11px] sm:text-sm md:text-base text-[#4ade80]"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <TypewriterText text={siteConfig.title} delay={500} />
        </m.div>

        {/* Tagline */}
        <m.div
          className="mt-4 flex items-center justify-center gap-3 md:gap-4 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          <div className="hidden md:block h-px w-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <p className="text-[11px] md:text-xs text-white/55 font-[family-name:var(--font-jetbrains-mono)] text-center">
            {siteConfig.subtitle}
          </p>
          <div className="hidden md:block h-px w-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </m.div>

        {/* Premium Pill Badges — centralizados, destacados */}
        <m.div
          className="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-2 md:gap-2.5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 10 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {/* TOP BR — único badge com o acento herói (verde) */}
          <span className="text-[10px] md:text-[11px] font-[family-name:var(--font-jetbrains-mono)] font-bold text-[#4ade80] px-3.5 py-1.5 rounded-full border border-[#4ade80]/40 bg-[#4ade80]/[0.1] backdrop-blur-sm flex items-center gap-2 shadow-[0_0_20px_rgba(74,222,128,0.2)]">
            <BrazilFlag className="shrink-0" />
            <span>TOP <span className="text-white">#{workanaStats.rankITBrazil}</span> BRASIL</span>
          </span>
          {/* Rating — sempre visível, pill neutro */}
          <span className="text-[10px] md:text-[11px] font-[family-name:var(--font-jetbrains-mono)] text-white/70 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.05] backdrop-blur-sm flex items-center gap-1">
            <span className="text-[#fbbf24]">★</span>
            <span className="text-white font-bold">{workanaStats.rating}</span>
            <span>/5</span>
            <span className="text-white/45 ml-0.5">({workanaStats.clientReviews})</span>
          </span>
          {/* Desktop-only: prova adicional em pills neutros */}
          <span className="hidden sm:flex text-[10px] md:text-[11px] font-[family-name:var(--font-jetbrains-mono)] text-white/70 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.05] backdrop-blur-sm items-center gap-2">
            <svg viewBox="0 0 14 14" width="13" height="13" className="shrink-0 opacity-70" aria-label="Global">
              <circle cx="7" cy="7" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <ellipse cx="7" cy="7" rx="3" ry="6.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <line x1="0.5" y1="7" x2="13.5" y2="7" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <span>TOP <span className="text-white font-bold">#{workanaStats.rankITGlobal}</span> GLOBAL</span>
          </span>
          <span className="hidden sm:flex text-[10px] md:text-[11px] font-[family-name:var(--font-jetbrains-mono)] text-white/70 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.05] backdrop-blur-sm">
            <span className="text-white font-bold">{workanaStats.projectsCompleted}+</span>&nbsp;Projetos
          </span>
          <span className="hidden sm:flex text-[10px] md:text-[11px] font-[family-name:var(--font-jetbrains-mono)] font-bold text-white/80 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.05] backdrop-blur-sm items-center gap-1.5">
            <span>🏆</span>
            HERO
          </span>
        </m.div>

        {/* CTA Primary — Workana Hire */}
        <m.div
          className="mt-7 md:mt-9 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-md sm:max-w-none mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 10 }}
          transition={{ duration: 0.6, delay: 0.85 }}
        >
          <a
            href={workanaStats.workanaProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("workana_cta", { location: "hero" })}
            className="group relative h-11 text-[12px] font-[family-name:var(--font-jetbrains-mono)] font-bold text-black px-6 rounded-lg bg-[#fbbf24] hover:bg-[#fcd34d] transition-all cursor-pointer shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] flex items-center justify-center gap-2"
          >
            <span className="text-[10px]">★</span>
            CONTRATAR VIA WORKANA
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
          <button
            onClick={() => onChapterClick(1)}
            className="h-11 text-[11px] font-[family-name:var(--font-jetbrains-mono)] text-[#4ade80] px-5 rounded-lg border border-[#4ade80]/20 bg-[#4ade80]/[0.05] hover:bg-[#4ade80]/10 hover:border-[#4ade80]/40 transition-all cursor-pointer flex items-center justify-center"
          >
            [ ver_projetos ]
          </button>
        </m.div>
      </div>
    </Section>
  );
}
