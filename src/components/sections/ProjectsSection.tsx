"use client";

import Link from "next/link";
import { m, AnimatePresence } from "framer-motion";
import { chapters, projectColors } from "@/lib/constants";
import type { Project } from "@/lib/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TerminalHeader from "@/components/TerminalHeader";
import Section from "@/components/home/Section";
import SectionNext from "@/components/home/SectionNext";
import { useLocale } from "@/lib/locale";
import { t, categoryLabel } from "@/lib/i18n";
import { getContent } from "@/lib/content.en";

const rangeOf = (id: string) => chapters.find((c) => c.id === id)!.range;

export default function ProjectsSection({
  progress,
  carouselIdx,
  setCarouselIdx,
  openCase,
  onChapterClick,
}: {
  progress: number;
  carouselIdx: number;
  setCarouselIdx: (i: number) => void;
  openCase: (p: Project) => void;
  onChapterClick: (i: number) => void;
}) {
  const locale = useLocale();
  const { projects: allProjects } = getContent(locale);
  // Lista editorial mostra os destaques; o restante do portfólio vai para a
  // grade de arquivo logo abaixo (carouselIdx indexa apenas os destaques).
  const featuredIds = ["mudapaisagens", "passagenseuropa", "clinafy", "pace", "neuroialab", "revix"];
  const projects = featuredIds.flatMap(id => allProjects.filter(p => p.id === id));
  // O arquivo só aponta para cases que possuem uma página publicada.
  const archive = allProjects.filter(p => p.overview && !featuredIds.includes(p.id));
  const caseBasePath = locale === "en" ? "/en/projetos" : "/projetos";
  return (
    <Section id="projects" progress={progress} range={rangeOf("projects")}>
      <div>
        <div className="flex flex-wrap items-end justify-between gap-2 mb-2">
          <h2 className="font-display text-2xl md:text-4xl font-bold text-white">
            {t(locale, "projects.title")}<span className="text-white/20">.</span>
          </h2>
          <Link href={locale === "en" ? "/en/projetos" : "/projetos"} className="text-sm text-white/70 hover:text-[#4ade80] transition-colors py-3 underline underline-offset-4">
            {t(locale, "projects.allLink", {
              count: allProjects.filter(p => p.overview).length,
            })}
          </Link>
        </div>
        <div className="h-0.5 w-16 bg-gradient-to-r from-white/30 to-transparent mb-6" />

        {/* Desktop: editorial index list + live preview panel */}
        <div className="hidden md:grid md:grid-cols-[1fr_1.05fr] md:gap-10 lg:gap-14 items-start">
          {/* Index list — all 8 at once */}
          <ul className="flex flex-col">
            {projects.map((p, i) => (
              <li key={p.id}>
                <Link
                  href={p.overview ? `${caseBasePath}/${p.id}` : "#projects"}
                  onMouseEnter={() => setCarouselIdx(i)}
                  onFocus={() => setCarouselIdx(i)}
                  onClick={(e) => {
                    // O href existe para o crawler e para abrir em nova aba;
                    // o clique normal continua abrindo o modal, como antes.
                    e.preventDefault();
                    if (p.overview) openCase(p); else setCarouselIdx(i);
                  }}
                  aria-current={carouselIdx === i}
                  className={`group w-full flex items-baseline gap-4 py-3 border-b text-left transition-colors ${
                    carouselIdx === i ? "border-white/25" : "border-white/[0.06] hover:border-white/15"
                  }`}
                >
                  <span
                    className={`font-[family-name:var(--font-jetbrains-mono)] text-[11px] transition-colors ${
                      carouselIdx === i ? "text-[#4ade80]" : "text-white/65"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`font-display text-2xl lg:text-3xl font-bold tracking-tight transition-colors ${
                      carouselIdx === i ? "text-white" : "text-white/65 group-hover:text-white/85"
                    }`}
                  >
                    {p.title}
                    <span className="mt-1 block text-sm font-normal tracking-normal text-white/60 leading-relaxed">{p.headline}</span>
                  </span>
                  <span
                    className="ml-auto text-[10px] font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-[2px] px-2 py-0.5 rounded border shrink-0"
                    style={{
                      color: projectColors[p.category],
                      borderColor: `${projectColors[p.category]}30`,
                      backgroundColor: `${projectColors[p.category]}10`,
                    }}
                  >
                    {categoryLabel(locale, p.category)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Preview panel — cover swaps with the hovered/active row */}
          <div className="sticky top-24">
            <div className="terminal-window glow-silver overflow-hidden">
              <TerminalHeader
                title={`${projects[carouselIdx].id}.tsx`}
                right={`${carouselIdx + 1}/${projects.length}`}
              />
              <div className="relative aspect-[16/10] overflow-hidden bg-[#0d0d0d]">
                <AnimatePresence initial={false}>
                  <m.img
                    key={projects[carouselIdx].id}
                    src={projects[carouselIdx].cover ?? projects[carouselIdx].image}
                    alt={projects[carouselIdx].title}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  />
                </AnimatePresence>
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#111] via-transparent to-transparent" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.06] pointer-events-none" />
              </div>
              <div className="p-5">
                <p className="text-base text-white/75 leading-relaxed mb-3">
                  {projects[carouselIdx].description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {projects[carouselIdx].tech.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-[family-name:var(--font-jetbrains-mono)] px-2 py-0.5 rounded bg-white/[0.04] text-white/65 border border-white/[0.06]"
                    >
                      &lt;{t} /&gt;
                    </span>
                  ))}
                </div>
                {projects[carouselIdx].overview && (
                  <button
                    onClick={() => openCase(projects[carouselIdx])}
                    className="group/cta inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-[#4ade80]/30 bg-[#4ade80]/[0.06] text-[11px] font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-[2px] text-[#4ade80] hover:bg-[#4ade80]/[0.12] hover:border-[#4ade80]/50 transition-all"
                  >
                    {t(locale, "projects.viewCase")}
                    <span aria-hidden className="transition-transform group-hover/cta:translate-x-0.5">→</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: swipeable card + dots/arrows */}
        <div className="md:hidden">
          <m.div
            className="terminal-window glow-silver touch-pan-y"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) setCarouselIdx((carouselIdx + 1) % projects.length);
              else if (info.offset.x > 60)
                setCarouselIdx((carouselIdx - 1 + projects.length) % projects.length);
            }}
          >
            <TerminalHeader
              title={`${projects[carouselIdx].id}.tsx`}
              right={`${carouselIdx + 1}/${projects.length}`}
            />
            {projects[carouselIdx].image && (
              <div className="relative aspect-[16/10] overflow-hidden bg-[#0d0d0d]">
                <m.img
                  key={projects[carouselIdx].id}
                  src={projects[carouselIdx].cover ?? projects[carouselIdx].image}
                  alt={projects[carouselIdx].title}
                  className="w-full h-full object-cover object-center pointer-events-none"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                />
                <span
                  aria-hidden
                  className="absolute top-2 left-4 font-display text-6xl font-bold text-white/[0.14] select-none pointer-events-none leading-none"
                >
                  {String(carouselIdx + 1).padStart(2, "0")}
                </span>
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#111] via-transparent to-transparent" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.06] pointer-events-none" />
              </div>
            )}
            <div className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h3 className="text-lg font-semibold text-white font-[family-name:var(--font-jetbrains-mono)]">
                  {projects[carouselIdx].title}
                </h3>
                <span
                  className="text-[10px] font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-[2px] px-2 py-1 rounded border font-bold"
                  style={{
                    color: projectColors[projects[carouselIdx].category],
                    borderColor: `${projectColors[projects[carouselIdx].category]}30`,
                    backgroundColor: `${projectColors[projects[carouselIdx].category]}10`,
                  }}
                >
                  {categoryLabel(locale, projects[carouselIdx].category)}
                </span>
              </div>
              <p className="text-base text-white/75 leading-relaxed mb-3">
                {projects[carouselIdx].description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {projects[carouselIdx].tech.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] font-[family-name:var(--font-jetbrains-mono)] px-2 py-0.5 rounded bg-white/[0.04] text-white/65 border border-white/[0.06]"
                  >
                    &lt;{t} /&gt;
                  </span>
                ))}
              </div>
              {projects[carouselIdx].overview && (
                <button
                  onClick={() => openCase(projects[carouselIdx])}
                  className="group/cta mt-5 inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-[#4ade80]/30 bg-[#4ade80]/[0.06] text-[11px] font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-[2px] text-[#4ade80] hover:bg-[#4ade80]/[0.12] hover:border-[#4ade80]/50 transition-all"
                >
                  {t(locale, "projects.viewCase")}
                  <span aria-hidden className="transition-transform group-hover/cta:translate-x-0.5">→</span>
                </button>
              )}
            </div>
          </m.div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 mt-5">
            <div className="flex">
              {projects.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCarouselIdx(i)}
                  aria-label={t(locale, "projects.nth", { n: i + 1 })}
                  aria-pressed={carouselIdx === i}
                  className="w-8 h-11 shrink-0 flex items-center justify-center rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4ade80]"
                >
                  <span
                    aria-hidden="true"
                    className={`block h-2 rounded-full transition-all duration-300 ${
                      carouselIdx === i ? "bg-white w-6" : "bg-white/55 w-2"
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="ml-auto flex gap-2">
              <button
                onClick={() => setCarouselIdx((carouselIdx - 1 + projects.length) % projects.length)}
                aria-label={t(locale, "projects.prev")}
                className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white/55 hover:text-white hover:border-white/30 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCarouselIdx((carouselIdx + 1) % projects.length)}
                aria-label={t(locale, "projects.next")}
                className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white/55 hover:text-white hover:border-white/30 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Arquivo — restante do portfólio Workana, em grade compacta */}
        {archive.length > 0 && (
          <div className="mt-10 md:mt-14">
            <div className="flex items-baseline justify-between gap-3 mb-4">
              <p className="text-[11px] font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-[3px] text-white/65">
                {t(locale, "projects.archiveHeading", { count: archive.length })}
              </p>
              <span className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            <ul className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {archive.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`${caseBasePath}/${p.id}`}
                    onClick={(e) => { e.preventDefault(); openCase(p); }}
                    className="group block w-full text-left terminal-window overflow-hidden hover:border-white/20 transition-colors"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#0d0d0d]">
                      <img
                        src={p.cover ?? p.image}
                        alt={p.title}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover object-center opacity-80 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500"
                      />
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#111] via-transparent to-transparent" />
                      {/* base escura: os mockups variam entre fundo claro e escuro */}
                      <span
                        className="absolute top-2 right-2 text-[10px] font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-[1px] px-1.5 py-0.5 rounded border font-bold bg-black/80 backdrop-blur-sm"
                        style={{
                          color: projectColors[p.category],
                          borderColor: `${projectColors[p.category]}55`,
                        }}
                      >
                        {categoryLabel(locale, p.category)}
                      </span>
                    </div>
                    <div className="p-3">
                      <div className="font-display text-sm font-bold text-white/85 group-hover:text-white transition-colors truncate">
                        {p.title}
                      </div>
                      <p className="mt-1 text-xs text-white/65 leading-relaxed line-clamp-2">
                        {p.description}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {p.tech.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="text-[11px] font-[family-name:var(--font-jetbrains-mono)] break-all px-1.5 py-0.5 rounded bg-white/[0.04] text-white/65 border border-white/[0.06]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    <SectionNext index={1} onChapterClick={onChapterClick} />
    </Section>
  );
}
