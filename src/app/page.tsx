"use client";

import dynamic from "next/dynamic";
import { useState, useCallback, useEffect } from "react";
import { m, LazyMotion, domMax, MotionConfig, AnimatePresence } from "framer-motion";
import { chapters } from "@/lib/constants";
import { ChevronDown } from "lucide-react";
import AmbientBackdrop from "@/components/AmbientBackdrop";
import AmbientAudio from "@/components/AmbientAudio";
import ProjectCaseStudy from "@/components/ProjectCaseStudy";
import TerminalCursor from "@/components/TerminalCursor";
import type { Project } from "@/lib/constants";
import { track } from "@vercel/analytics";
import CanvasErrorBoundary from "@/components/CanvasErrorBoundary";
import LoadingScreen from "@/components/home/LoadingScreen";
import Navbar from "@/components/home/Navbar";
import ChapterDots from "@/components/home/ChapterDots";
import ChapterHUD from "@/components/home/ChapterHUD";
import HeroSection from "@/components/sections/HeroSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ContactSection from "@/components/sections/ContactSection";

const Experience = dynamic(
  () => import("@/components/experience/Experience"),
  { ssr: false }
);

// ===========================================
// MAIN PAGE
// ===========================================
export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [caseStudy, setCaseStudy] = useState<Project | null>(null);

  const handleLoaded = useCallback(() => setIsLoaded(true), []);
  const handleProgress = useCallback((p: number) => {
    setProgress(p);
    const idx = chapters.findIndex(
      (ch) => p >= ch.range[0] && p < ch.range[1]
    );
    setCurrentChapter(idx >= 0 ? idx : chapters.length - 1);
  }, []);

  const openCase = useCallback((p: Project) => {
    track("ver_case", { id: p.id });
    setCaseStudy(p);
  }, []);

  const handleChapterClick = useCallback((i: number) => {
    window.dispatchEvent(
      new CustomEvent("gotoChapter", { detail: { index: i } })
    );
  }, []);

  // Deep-link: /#projects (e.g. back from a case page) jumps to that chapter once the 3D
  // scene is mounted (isLoaded) — guarantees the gotoChapter listener already exists.
  useEffect(() => {
    if (!isLoaded) return;
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const idx = chapters.findIndex((c) => c.id === hash);
    if (idx <= 0) return;
    const t = setTimeout(
      () => window.dispatchEvent(new CustomEvent("gotoChapter", { detail: { index: idx } })),
      120
    );
    return () => clearTimeout(t);
  }, [isLoaded]);

  return (
    <LazyMotion features={domMax} strict>
    <MotionConfig reducedMotion="user">
      <a href="#hero" className="skip-link">Pular para o conteúdo</a>

      <LoadingScreen isLoaded={isLoaded} />

      {/* 3D Background (decorative — hidden from assistive tech) */}
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <CanvasErrorBoundary onError={handleLoaded}>
          <Experience onLoaded={handleLoaded} onProgress={handleProgress} />
        </CanvasErrorBoundary>
      </div>

      {/* Ambient AI backdrop — static texture (global depth) + hero-only animated loop */}
      <AmbientBackdrop heroActive={progress < 0.18} />

      {/* Navigation */}
      <Navbar currentChapter={currentChapter} onChapterClick={handleChapterClick} />
      <ChapterDots currentChapter={currentChapter} onChapterClick={handleChapterClick} />
      <ChapterHUD currentChapter={currentChapter} />

      {/* Reading progress — hairline at the very top (mobile + desktop orientation cue) */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-40 pointer-events-none" aria-hidden>
        <div
          className="h-full bg-gradient-to-r from-[#4ade80]/70 to-[#4ade80]"
          style={{ width: `${Math.min(100, Math.max(2, progress * 100))}%` }}
        />
      </div>


      {/* Optional ambient soundtrack (off by default) */}
      <AmbientAudio />

      {/* Signature trailing caret cursor (desktop, motion-ok) */}
      <TerminalCursor />

      {/* Project case-study modal */}
      <AnimatePresence>
        {caseStudy && (
          <ProjectCaseStudy project={caseStudy} onClose={() => setCaseStudy(null)} />
        )}
      </AnimatePresence>

      {/* Scroll indicator */}
      <m.div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        animate={{ opacity: progress < 0.08 ? 1 : 0 }}
      >
        <div className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-[#4ade80]">
          <span className="cursor-blink">&gt;</span> scroll_down <span className="text-white/35">· role ou use ↓</span>
        </div>
        <ChevronDown className="w-4 h-4 text-white/20 animate-bounce" />
      </m.div>

      <main>
      {/* ============ HERO ============ */}
      <HeroSection
        progress={progress}
        isLoaded={isLoaded}
        onChapterClick={handleChapterClick}
      />

      {/* ============ PROJECTS ============ */}
      <ProjectsSection
        progress={progress}
        carouselIdx={carouselIdx}
        setCarouselIdx={setCarouselIdx}
        openCase={openCase}
        onChapterClick={handleChapterClick}
      />

      {/* ============ ABOUT ============ */}
      <AboutSection progress={progress} onChapterClick={handleChapterClick} />

      {/* ============ SKILLS ============ */}
      <SkillsSection
        progress={progress}
        openCase={openCase}
        onChapterClick={handleChapterClick}
      />

      {/* ============ CONTACT ============ */}
      <ContactSection progress={progress} />
      </main>
    </MotionConfig>
    </LazyMotion>
  );
}
