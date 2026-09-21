"use client";

import dynamic from "next/dynamic";
import { useState, useCallback, useEffect, useRef } from "react";
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
import Navbar from "@/components/home/Navbar";
import ChapterDots from "@/components/home/ChapterDots";
import ChapterHUD from "@/components/home/ChapterHUD";
import HeroSection from "@/components/sections/HeroSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ContactSection from "@/components/sections/ContactSection";
import { LocaleProvider, type Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { getAttribution } from "@/lib/attribution";

const Experience = dynamic(
  () => import("@/components/experience/Experience"),
  { ssr: false }
);

// ===========================================
// HOME PAGE (shared by / [pt] and /en)
// ===========================================
export default function HomePage({ locale }: { locale: Locale }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [caseStudy, setCaseStudy] = useState<Project | null>(null);

  const canvasFailedRef = useRef(false);
  const controllerReadyRef = useRef(false);
  const pendingChapterRef = useRef<number | null>(null);
  const hasNavigationRequestRef = useRef(false);

  const navigateToChapter = useCallback((index: number) => {
    if (canvasFailedRef.current) {
      document
        .getElementById(chapters[index].id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.dispatchEvent(
      new CustomEvent("gotoChapter", { detail: { index } })
    );
  }, []);

  const flushPendingChapter = useCallback(() => {
    const index = pendingChapterRef.current;
    if (index === null) return;
    pendingChapterRef.current = null;
    navigateToChapter(index);
  }, [navigateToChapter]);

  const handleLoaded = useCallback(() => {
    // Só o callback do Experience confirma que seus listeners já foram montados.
    controllerReadyRef.current = true;
    setIsLoaded(true);
    flushPendingChapter();
  }, [flushPendingChapter]);

  // O prazo de boot permite processar o hash, mas não confirma que o controlador
  // já recebeu seu chunk. A navegação continua pendente até handleLoaded.
  useEffect(() => {
    const cap = setTimeout(() => setIsLoaded(true), 1500);
    return () => clearTimeout(cap);
  }, []);

  // Modo degradado: se o WebGL não estiver disponível, o site não pode depender
  // do Experience (scroll-jack + capítulos). A classe `webgl-failed` restaura o
  // scroll de documento via CSS e os cliques de menu passam a usar scrollIntoView.
  const activateCanvasFallback = useCallback(() => {
    canvasFailedRef.current = true;
    document.documentElement.classList.add("webgl-failed");
    flushPendingChapter();
  }, [flushPendingChapter]);

  const handleCanvasError = useCallback(() => {
    activateCanvasFallback();
    setIsLoaded(true);
  }, [activateCanvasFallback]);

  // Probe síncrono de capacidade: o erro do renderer do three.js estoura como
  // uncaught (fora do caminho do error boundary), então detectamos direto e nem
  // montamos o Experience — nada de listeners de scroll-jack num site sem 3D.
  const [webglOk] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      const probe = document.createElement("canvas");
      const gl = probe.getContext("webgl2") || probe.getContext("webgl");
      if (!gl) return false;
      (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context")?.loseContext();
      return true;
    } catch {
      return false;
    }
  });
  useEffect(() => {
    if (webglOk) return;
    activateCanvasFallback();
    return () => document.documentElement.classList.remove("webgl-failed");
  }, [webglOk, activateCanvasFallback]);

  const maxChapterSeen = useRef(0);
  const handleProgress = useCallback((p: number) => {
    setProgress(p);
    const idx = chapters.findIndex(
      (ch) => p >= ch.range[0] && p < ch.range[1]
    );
    const chapter = idx >= 0 ? idx : chapters.length - 1;
    setCurrentChapter(chapter);
    // Scroll-depth: fire once per deepest chapter reached this session
    if (chapter > maxChapterSeen.current) {
      maxChapterSeen.current = chapter;
      track("scroll_depth", { chapter: chapters[chapter].id, ...getAttribution() });
    }
  }, []);

  const openCase = useCallback((p: Project) => {
    track("ver_case", { id: p.id, ...getAttribution() });
    setCaseStudy(p);
  }, []);

  const handleChapterClick = useCallback((i: number) => {
    if (!Number.isInteger(i) || i < 0 || i >= chapters.length) return;
    hasNavigationRequestRef.current = true;
    if (!controllerReadyRef.current && !canvasFailedRef.current) {
      // Um clique mais recente substitui o anterior enquanto o chunk carrega.
      pendingChapterRef.current = i;
      return;
    }
    navigateToChapter(i);
  }, [navigateToChapter]);

  // O hash inicial usa a mesma fila do menu. Uma escolha explícita do visitante
  // durante o boot tem prioridade e nunca é sobrescrita pelo hash da entrada.
  useEffect(() => {
    if (!isLoaded || hasNavigationRequestRef.current) return;
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const idx = chapters.findIndex((c) => c.id === hash);
    if (idx <= 0) return;
    const timer = setTimeout(() => {
      if (!hasNavigationRequestRef.current) handleChapterClick(idx);
    }, 120);
    return () => clearTimeout(timer);
  }, [isLoaded, handleChapterClick]);

  const page = (
    <LazyMotion features={domMax} strict>
    <MotionConfig reducedMotion="user">
      <a href="#hero" className="skip-link">{t(locale, "skip.content")}</a>

      {/* 3D Background (decorative — hidden from assistive tech) */}
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <CanvasErrorBoundary onError={handleCanvasError}>
          {webglOk ? (
            <Experience onLoaded={handleLoaded} onProgress={handleProgress} />
          ) : null}
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

      {/* Scroll indicator — decorativo: pointer-events-none evita que ele intercepte
          cliques/wheel na região bottom-center depois de sumir (opacity 0 ainda faz hit-test) */}
      <m.div
        className="scroll-indicator pointer-events-none fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        animate={{ opacity: progress < 0.08 ? 1 : 0 }}
      >
        <div className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-[#4ade80]">
          <span className="cursor-blink">&gt;</span> scroll_down <span className="text-white/35">· {t(locale, "scroll.hint")}</span>
        </div>
        <ChevronDown className="w-4 h-4 text-white/20 animate-bounce" />
      </m.div>

      <main>
      {/* ============ HERO ============ */}
      <HeroSection
        progress={progress}
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

  return (
    <LocaleProvider locale={locale}>
      {locale === "en" ? (
        <div lang="en" className="contents">
          {page}
        </div>
      ) : (
        page
      )}
    </LocaleProvider>
  );
}
