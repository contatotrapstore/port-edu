"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  siteConfig,
  projects,
  skills,
  chapters,
  codeSnippets,
  loadingMessages,
  catColors,
  workanaStats,
  testimonials,
  resultMetrics,
} from "@/lib/constants";
import { Mail, ChevronDown, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// Project category colors
const projectCategoryColors: Record<string, string> = {
  saas: "#60a5fa",
  ecommerce: "#fbbf24",
  mobile: "#c084fc",
  sistema: "#4ade80",
  web: "#fb923c",
};

const Experience = dynamic(
  () => import("@/components/experience/Experience"),
  { ssr: false }
);

// --- SVG Icons ---
function BrazilFlag({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 14" width="18" height="12" className={className} aria-label="Brasil">
      <rect width="20" height="14" rx="2" fill="#009c3b" />
      <polygon points="10,1.5 18.5,7 10,12.5 1.5,7" fill="#ffdf00" />
      <circle cx="10" cy="7" r="2.2" fill="#002776" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

// --- Typewriter Effect ---
function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayed(text.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [text, started]);

  return (
    <span>
      {displayed}
      <span className="cursor-blink text-[#4ade80]">_</span>
    </span>
  );
}

// --- Animated Counter ---
function AnimatedCounter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <div ref={ref}>{count}</div>;
}

// --- Loading Screen ---
function LoadingScreen({ isLoaded }: { isLoaded: boolean }) {
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!isLoaded) {
      const interval = setInterval(() => {
        setProgress((p) => (p >= 90 ? 90 : p + Math.random() * 12));
        setMsgIndex((m) => (m < loadingMessages.length - 1 ? m + 1 : m));
      }, 300);
      return () => clearInterval(interval);
    }
    setProgress(100);
    setMsgIndex(loadingMessages.length - 1);
    setTimeout(() => setVisible(false), 900);
  }, [isLoaded]);

  if (!visible) return null;

  const barLength = 20;
  const filled = Math.round((progress / 100) * barLength);
  const bar = "\u2588".repeat(filled) + "\u2591".repeat(barLength - filled);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a]"
      animate={{ opacity: isLoaded ? 0 : 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      {/* Logo with glitch reveal */}
      <motion.div
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1 }}
      >
        <Image src="/EdevsHub.png" alt="EDevsHub" width={180} height={48} priority className="invert mix-blend-screen" />
      </motion.div>

      {/* Terminal boot messages */}
      <div className="mt-8 font-[family-name:var(--font-jetbrains-mono)] text-xs space-y-1 w-72">
        {loadingMessages.slice(0, msgIndex + 1).map((msg, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[#4ade80]">&gt;</span>
            <span className="text-white/50">{msg}</span>
            {i < msgIndex && <span className="text-[#4ade80] ml-auto">[OK]</span>}
            {i === msgIndex && !isLoaded && (
              <span className="cursor-blink text-[#4ade80] ml-auto">...</span>
            )}
            {i === msgIndex && isLoaded && (
              <span className="text-[#4ade80] ml-auto">[OK]</span>
            )}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-4 font-[family-name:var(--font-jetbrains-mono)] text-xs text-white/30">
        [{bar}] {Math.round(progress)}%
      </div>
    </motion.div>
  );
}

// --- Section wrapper ---
function Section({
  id,
  children,
  className = "",
  progress,
  range,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  progress: number;
  range: [number, number];
}) {
  const [start, end] = range;
  const isFirst = start === 0;
  const isLast = end >= 1;
  const isActive = progress >= start && progress < end;
  const localP = (progress - start) / (end - start);

  let opacity = 0;
  if (isActive || (isFirst && progress < start) || (isLast && progress >= end)) {
    opacity = 1;
    if (!isLast && localP > 0.9) opacity = Math.max(0, (1 - localP) * 10);
    if (!isFirst && localP < 0.1) opacity = Math.min(1, localP * 10);
  }

  return (
    <section
      id={id}
      className={`fixed inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 overflow-y-auto overflow-x-hidden scrollbar-none ${className}`}
      style={{ opacity, zIndex: opacity > 0 ? 10 : 0, visibility: opacity > 0 ? "visible" : "hidden" }}
    >
      <div className="pointer-events-auto max-w-6xl w-full my-auto py-16 md:py-8 px-6 md:px-8 lg:px-12">
        {children}
      </div>
    </section>
  );
}

// --- Navbar ---
function Navbar({
  currentChapter,
  onChapterClick,
}: {
  currentChapter: number;
  onChapterClick: (i: number) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-30 px-6 md:px-10 py-4 md:py-5 flex justify-between items-center backdrop-blur-xl bg-[#0a0a0a]/80 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <Image
            src="/EdevsHub.png"
            alt="EDevsHub"
            width={140}
            height={36}
            style={{ width: "auto", height: "24px" }}
            className="invert mix-blend-screen md:[height:28px]"
          />
          <span className="hidden md:flex items-center gap-1.5 text-[10px] font-[family-name:var(--font-jetbrains-mono)] text-[#4ade80]/60 ml-4 border-l border-white/[0.06] pl-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
            online
          </span>
        </div>

        {/* Desktop nav */}
        <ul className="hidden md:flex gap-6">
          {chapters.map((ch, i) => (
            <li key={ch.id}>
              <button
                onClick={() => onChapterClick(i)}
                className={`relative text-[11px] uppercase tracking-[2px] font-[family-name:var(--font-jetbrains-mono)] py-2 transition-all duration-300 ${
                  currentChapter === i
                    ? "text-white"
                    : "text-white/25 hover:text-white/50"
                }`}
              >
                {ch.label}
                {currentChapter === i && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Hamburger button (mobile) */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={`block w-5 h-px bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[4px]" : ""}`} />
          <span className={`block w-5 h-px bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-px bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[4px]" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <motion.div
          className="fixed inset-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {chapters.map((ch, i) => (
            <button
              key={ch.id}
              onClick={() => { onChapterClick(i); setMenuOpen(false); }}
              className={`text-lg font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-[4px] transition-colors ${
                currentChapter === i ? "text-white" : "text-white/30"
              }`}
            >
              <span className="text-[#4ade80] mr-2">0{i + 1}</span>
              {ch.label}
            </button>
          ))}
          <button
            onClick={() => setMenuOpen(false)}
            className="mt-8 text-xs font-[family-name:var(--font-jetbrains-mono)] text-white/20 uppercase tracking-[3px]"
          >
            [ fechar ]
          </button>
        </motion.div>
      )}
    </>
  );
}

// --- Chapter Dots ---
function ChapterDots({
  currentChapter,
  onChapterClick,
}: {
  currentChapter: number;
  onChapterClick: (i: number) => void;
}) {
  return (
    <div className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-20 flex-col gap-4">
      {chapters.map((ch, i) => (
        <button
          key={ch.id}
          onClick={() => onChapterClick(i)}
          className={`group relative w-2.5 h-2.5 rounded-full border transition-all duration-400 ${
            currentChapter === i
              ? "border-white bg-white shadow-[0_0_12px_rgba(200,200,200,0.3)]"
              : "border-white/20 hover:border-white/50 hover:scale-125"
          }`}
        >
          <span className="absolute right-6 top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-[family-name:var(--font-jetbrains-mono)] text-white/40 opacity-0 group-hover:opacity-100 transition-opacity">
            {ch.label}
          </span>
        </button>
      ))}
    </div>
  );
}

// ===========================================
// MAIN PAGE
// ===========================================
export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [skillFilter, setSkillFilter] = useState<"all" | "frontend" | "backend" | "devops" | "tools">("all");

  const handleLoaded = useCallback(() => setIsLoaded(true), []);
  const handleProgress = useCallback((p: number) => {
    setProgress(p);
    const idx = chapters.findIndex(
      (ch) => p >= ch.range[0] && p < ch.range[1]
    );
    setCurrentChapter(idx >= 0 ? idx : chapters.length - 1);
  }, []);

  const handleChapterClick = useCallback((i: number) => {
    window.dispatchEvent(
      new CustomEvent("gotoChapter", { detail: { index: i } })
    );
  }, []);

  return (
    <>
      <LoadingScreen isLoaded={isLoaded} />

      {/* 3D Background */}
      <div className="fixed inset-0 z-0">
        <Experience onLoaded={handleLoaded} onProgress={handleProgress} />
      </div>

      {/* Navigation */}
      <Navbar currentChapter={currentChapter} onChapterClick={handleChapterClick} />
      <ChapterDots currentChapter={currentChapter} onChapterClick={handleChapterClick} />

      {/* Scroll indicator */}
      <motion.div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        animate={{ opacity: progress < 0.08 ? 1 : 0 }}
      >
        <div className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-[#4ade80]">
          <span className="cursor-blink">&gt;</span> scroll_down
        </div>
        <ChevronDown className="w-4 h-4 text-white/20 animate-bounce" />
      </motion.div>

      {/* ============ HERO ============ */}
      <Section id="hero" progress={progress} range={[0, 0.2]}>
        <div className="text-center relative grid-overlay scan-line">
          {/* HUD brackets */}
          <div className="hud-bracket -top-8 -left-4 hidden md:block">[</div>
          <div className="hud-bracket -top-8 -right-4 hidden md:block">]</div>
          <div className="hud-bracket -bottom-8 -left-4 hidden md:block">[</div>
          <div className="hud-bracket -bottom-8 -right-4 hidden md:block">]</div>

          {/* Floating code snippets in corners */}
          {codeSnippets.slice(0, 4).map((snippet, i) => (
            <motion.div
              key={snippet.lang}
              className="hidden md:block absolute code-block opacity-[0.12] text-[10px]"
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
            </motion.div>
          ))}

          {/* Main heading with glitch */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 40 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <h1
              className="glitch-text text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-[10rem] font-extrabold tracking-tighter leading-[0.85]"
              data-text="EDUARDO GOUVEIA"
            >
              <span className="block">EDUARDO</span>
              <span className="block text-gradient-silver">GOUVEIA</span>
            </h1>
          </motion.div>

          {/* Decorative line */}
          <motion.div
            className="h-px w-32 mx-auto mt-6 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isLoaded ? 1 : 0 }}
            transition={{ duration: 1, delay: 1 }}
          />

          {/* Subtitle with typewriter */}
          <motion.div
            className="mt-4 font-[family-name:var(--font-jetbrains-mono)] text-[11px] sm:text-sm md:text-base text-[#4ade80]"
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <TypewriterText text={siteConfig.title} delay={1500} />
          </motion.div>

          {/* Tagline */}
          <motion.div
            className="mt-4 flex items-center justify-center gap-3 md:gap-4 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 1, delay: 2 }}
          >
            <div className="hidden md:block h-px w-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <p className="text-[11px] md:text-xs text-white/30 font-[family-name:var(--font-jetbrains-mono)] text-center">
              {siteConfig.subtitle}
            </p>
            <div className="hidden md:block h-px w-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </motion.div>

          {/* Premium Pill Badges — centralizados, destacados */}
          <motion.div
            className="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-2 md:gap-2.5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 10 }}
            transition={{ duration: 0.6, delay: 2.3 }}
          >
            {/* TOP BR — destaque máximo com bandeira SVG real */}
            <span className="text-[10px] md:text-[11px] font-[family-name:var(--font-jetbrains-mono)] font-bold text-[#4ade80] px-3.5 py-1.5 rounded-full border border-[#4ade80]/40 bg-[#4ade80]/[0.1] backdrop-blur-sm flex items-center gap-2 shadow-[0_0_20px_rgba(74,222,128,0.2)]">
              <BrazilFlag className="shrink-0" />
              <span>TOP <span className="text-white">#{workanaStats.rankITBrazil}</span> BRASIL</span>
            </span>
            {/* Global — destaque #7 */}
            <span className="text-[10px] md:text-[11px] font-[family-name:var(--font-jetbrains-mono)] font-bold text-[#60a5fa] px-3.5 py-1.5 rounded-full border border-[#60a5fa]/40 bg-[#60a5fa]/[0.1] backdrop-blur-sm flex items-center gap-2 shadow-[0_0_20px_rgba(96,165,250,0.2)]">
              <svg viewBox="0 0 14 14" width="14" height="14" className="shrink-0" aria-label="Global">
                <circle cx="7" cy="7" r="6.5" fill="none" stroke="#60a5fa" strokeWidth="1.2" />
                <ellipse cx="7" cy="7" rx="3" ry="6.5" fill="none" stroke="#60a5fa" strokeWidth="1.2" />
                <line x1="0.5" y1="7" x2="13.5" y2="7" stroke="#60a5fa" strokeWidth="1.2" />
              </svg>
              <span>TOP <span className="text-white">#{workanaStats.rankITGlobal}</span> GLOBAL</span>
            </span>
            {/* Projetos — destaque número */}
            <span className="text-[10px] md:text-[11px] font-[family-name:var(--font-jetbrains-mono)] text-white/60 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/[0.05] backdrop-blur-sm">
              <span className="text-white font-bold">{workanaStats.projectsCompleted}+</span> Projetos
            </span>
            {/* Rating — destaque nota */}
            <span className="text-[10px] md:text-[11px] font-[family-name:var(--font-jetbrains-mono)] text-[#fbbf24] px-3.5 py-1.5 rounded-full border border-[#fbbf24]/30 bg-[#fbbf24]/[0.08] backdrop-blur-sm flex items-center gap-1">
              <span>★</span>
              <span className="text-white font-bold">{workanaStats.rating}</span>
              <span className="text-[#fbbf24]/70">/5</span>
              <span className="text-[#fbbf24]/50 ml-0.5">({workanaStats.clientReviews})</span>
            </span>
            {/* HERO */}
            <span className="text-[10px] md:text-[11px] font-[family-name:var(--font-jetbrains-mono)] font-bold text-[#fbbf24] px-3.5 py-1.5 rounded-full border border-[#fbbf24]/40 bg-[#fbbf24]/[0.10] backdrop-blur-sm flex items-center gap-1.5 shadow-[0_0_20px_rgba(251,191,36,0.25)]">
              <span>🏆</span>
              HERO
            </span>
          </motion.div>

          {/* CTA Primary — Workana Hire */}
          <motion.div
            className="mt-7 md:mt-9 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-md sm:max-w-none mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 10 }}
            transition={{ duration: 0.6, delay: 2.8 }}
          >
            <a
              href={workanaStats.workanaProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative h-11 text-[12px] font-[family-name:var(--font-jetbrains-mono)] font-bold text-black px-6 rounded-lg bg-[#fbbf24] hover:bg-[#fcd34d] transition-all cursor-pointer shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] flex items-center justify-center gap-2"
            >
              <span className="text-[10px]">★</span>
              CONTRATAR VIA WORKANA
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <button
              onClick={() => handleChapterClick(2)}
              className="h-11 text-[11px] font-[family-name:var(--font-jetbrains-mono)] text-[#4ade80] px-5 rounded-lg border border-[#4ade80]/20 bg-[#4ade80]/[0.05] hover:bg-[#4ade80]/10 hover:border-[#4ade80]/40 transition-all cursor-pointer flex items-center justify-center"
            >
              [ ver_projetos ]
            </button>
          </motion.div>
        </div>
      </Section>

      {/* ============ ABOUT ============ */}
      <Section id="about" progress={progress} range={[0.2, 0.4]}>
        <div>
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
            Sobre<span className="text-white/20">.</span>
          </h2>
          <div className="h-0.5 w-16 bg-gradient-to-r from-white/30 to-transparent mb-6" />
        </div>
        <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-start md:items-center">
          {/* Terminal with bio */}
          <div className="terminal-window">
            <div className="flex items-center h-8 px-3 bg-white/[0.03] border-b border-white/[0.06]">
              <div className="terminal-dots">
                <span /><span /><span />
              </div>
              <span className="ml-3 text-[10px] font-[family-name:var(--font-jetbrains-mono)] text-white/30">
                about.md — bash
              </span>
            </div>
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
            <div className="flex items-center h-8 px-3 bg-white/[0.03] border-b border-white/[0.06]">
              <div className="terminal-dots">
                <span /><span /><span />
              </div>
              <span className="ml-3 text-[10px] font-[family-name:var(--font-jetbrains-mono)] text-white/30">
                workana-profile.json
              </span>
            </div>
            <div className="p-5 md:p-6">
              {/* Profile photo + name + rating */}
              <div className="flex items-center gap-3 mb-5">
                <div className="relative shrink-0">
                  <img
                    src="/images/profile.jpeg"
                    alt="Eduardo Gouveia"
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#fbbf24]/50"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-[#111] bg-[#fbbf24]/20 flex items-center justify-center">
                    <span className="text-[#fbbf24] font-bold text-[6px] font-[family-name:var(--font-jetbrains-mono)]">H</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold text-sm">Eduardo Gouveia</div>
                  <div className="text-white/35 text-xs">Full Stack Senior · HERO</div>
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
              <div className="grid grid-cols-2 gap-2.5 text-xs font-[family-name:var(--font-jetbrains-mono)]">
                <div className="bg-white/[0.03] rounded-lg p-3.5 border-l-2 border-white/10">
                  <div className="text-gradient-silver text-xl font-bold">{workanaStats.projectsCompleted}+</div>
                  <div className="text-white/30 mt-0.5">projetos entregues</div>
                </div>
                <div className="bg-white/[0.03] rounded-lg p-3.5 border-l-2 border-white/10">
                  <div className="text-gradient-silver text-xl font-bold">{workanaStats.recurringClients}</div>
                  <div className="text-white/30 mt-0.5">clientes recorrentes</div>
                </div>
                <div className="bg-white/[0.03] rounded-lg p-3.5 border-l-2 border-[#4ade80]/30">
                  <div className="text-[#4ade80] text-xl font-bold">#{workanaStats.rankITBrazil}</div>
                  <div className="text-white/30 mt-0.5">ranking Brasil</div>
                </div>
                <div className="bg-white/[0.03] rounded-lg p-3.5 border-l-2 border-[#60a5fa]/30">
                  <div className="text-[#60a5fa] text-xl font-bold">#{workanaStats.rankITGlobal}</div>
                  <div className="text-white/30 mt-0.5">ranking Global</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Result Metrics — value-for-client */}
        <div className="mt-10 md:mt-12">
          <p className="text-[10px] font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-[3px] text-white/20 mb-4">
            // métricas que importam
          </p>
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {resultMetrics.map((m, i) => (
              <motion.div
                key={m.label}
                className="terminal-window p-4 md:p-5 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <div className="text-2xl md:text-3xl font-bold text-gradient-silver">
                  {m.value}
                </div>
                <div className="text-[8px] md:text-xs font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-[1.5px] md:tracking-[2px] text-[#4ade80] mt-1.5">
                  {m.label}
                </div>
                <div className="text-[9px] md:text-[10px] text-white/30 mt-1 hidden md:block">
                  {m.description}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-10 mb-2">
          <p className="text-[10px] font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-[3px] text-white/20 mb-4">
            // avaliações verificadas
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {testimonials.map((t, i) => (
            <div key={i} className="terminal-window p-5 md:p-6 flex flex-col">
              {/* Header: stars + verified badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="text-[#fbbf24] text-[11px]">{"★".repeat(t.rating)}</div>
                {t.verified && (
                  <div className="flex items-center gap-1 text-[8px] font-[family-name:var(--font-jetbrains-mono)] text-[#4ade80] bg-[#4ade80]/10 px-2 py-0.5 rounded border border-[#4ade80]/20 shrink-0">
                    <span className="w-1 h-1 rounded-full bg-[#4ade80]" />
                    VERIFICADO
                  </div>
                )}
              </div>
              <p className="text-white/50 text-[11px] md:text-xs leading-relaxed italic mb-4 flex-1">
                <span className="text-white/20 text-lg leading-none">&ldquo;</span>
                {t.text}
                <span className="text-white/20 text-lg leading-none">&rdquo;</span>
              </p>
              <div className="flex flex-col gap-1.5 pt-3 border-t border-white/[0.06]">
                <div className="text-[10px] font-[family-name:var(--font-jetbrains-mono)] text-white/40">
                  — {t.author}
                </div>
                <div className="flex items-center gap-1.5 text-[8px] md:text-[9px] font-[family-name:var(--font-jetbrains-mono)] flex-wrap">
                  <span className="text-white/25">{t.date}</span>
                  <span className="text-white/15">·</span>
                  <span className="text-[#60a5fa]/70">{t.projectType}</span>
                  {t.recurring && (
                    <>
                      <span className="text-white/15">·</span>
                      <span className="text-[#4ade80]/70">recorrente</span>
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
            className="text-[11px] font-[family-name:var(--font-jetbrains-mono)] text-white/30 hover:text-[#fbbf24] transition-colors inline-flex items-center gap-2"
          >
            ver todas as {workanaStats.clientReviews} avaliações
            <span>→</span>
          </a>
        </div>
      </Section>

      {/* ============ PROJECTS ============ */}
      <Section id="projects" progress={progress} range={[0.4, 0.65]}>
        <div>
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
            Projetos<span className="text-white/20">.</span>
          </h2>
          <div className="h-0.5 w-16 bg-gradient-to-r from-white/30 to-transparent mb-6" />

          {/* Carousel — 1 card visible, infinite loop */}
          <div className="relative">
            {/* Main card display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Current project — main card */}
              <div className="group terminal-window glow-silver md:col-span-1">
                <div className="flex items-center h-8 px-3 bg-white/[0.03] border-b border-white/[0.06]">
                  <div className="terminal-dots">
                    <span /><span /><span />
                  </div>
                  <span className="ml-3 text-[10px] font-[family-name:var(--font-jetbrains-mono)] text-white/30">
                    {projects[carouselIdx].id}.tsx
                  </span>
                  <span className="ml-auto text-[10px] font-[family-name:var(--font-jetbrains-mono)] text-white/15">
                    {carouselIdx + 1}/{projects.length}
                  </span>
                </div>
                {projects[carouselIdx].image && (
                  <div className="relative h-48 md:h-56 overflow-hidden bg-white/[0.02]">
                    <motion.img
                      key={projects[carouselIdx].id}
                      src={projects[carouselIdx].image}
                      alt={projects[carouselIdx].title}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
                  </div>
                )}
                <div className="p-5">
                  {/* Category tag */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white font-[family-name:var(--font-jetbrains-mono)]">
                      {projects[carouselIdx].title}
                    </h3>
                    <span
                      className="text-[8px] font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-[2px] px-2 py-1 rounded border font-bold"
                      style={{
                        color: projectCategoryColors[projects[carouselIdx].category],
                        borderColor: `${projectCategoryColors[projects[carouselIdx].category]}30`,
                        backgroundColor: `${projectCategoryColors[projects[carouselIdx].category]}10`,
                      }}
                    >
                      {projects[carouselIdx].category}
                    </span>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed mb-3">
                    {projects[carouselIdx].description}
                  </p>

                  {/* Output metrics */}
                  {projects[carouselIdx].output && (
                    <div className="mb-4 pb-3 border-b border-white/[0.04]">
                      <div className="text-[9px] font-[family-name:var(--font-jetbrains-mono)] text-[#4ade80] mb-1.5">
                        &gt; output:
                      </div>
                      <ul className="space-y-0.5">
                        {projects[carouselIdx].output!.map((o) => (
                          <li
                            key={o}
                            className="text-[10px] font-[family-name:var(--font-jetbrains-mono)] text-white/50 flex items-start gap-1.5"
                          >
                            <span className="text-[#4ade80]/60 shrink-0">•</span>
                            <span>{o}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5">
                    {projects[carouselIdx].tech.map((t) => (
                      <span
                        key={t}
                        className="text-[9px] font-[family-name:var(--font-jetbrains-mono)] px-2 py-0.5 rounded bg-white/[0.04] text-white/40 border border-white/[0.06]"
                      >
                        &lt;{t} /&gt;
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Next project preview — hidden on mobile */}
              <div
                className="hidden md:block terminal-window opacity-50 hover:opacity-70 transition-opacity cursor-pointer"
                onClick={() => setCarouselIdx((carouselIdx + 1) % projects.length)}
              >
                <div className="flex items-center h-8 px-3 bg-white/[0.03] border-b border-white/[0.06]">
                  <div className="terminal-dots">
                    <span /><span /><span />
                  </div>
                  <span className="ml-3 text-[10px] font-[family-name:var(--font-jetbrains-mono)] text-white/30">
                    {projects[(carouselIdx + 1) % projects.length].id}.tsx
                  </span>
                </div>
                {projects[(carouselIdx + 1) % projects.length].image && (
                  <div className="relative h-56 overflow-hidden bg-white/[0.02]">
                    <img
                      src={projects[(carouselIdx + 1) % projects.length].image}
                      alt={projects[(carouselIdx + 1) % projects.length].title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-base font-semibold text-white/60 mb-2 font-[family-name:var(--font-jetbrains-mono)]">
                    {projects[(carouselIdx + 1) % projects.length].title}
                  </h3>
                  <p className="text-[11px] text-white/25 leading-relaxed line-clamp-2">
                    {projects[(carouselIdx + 1) % projects.length].description}
                  </p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-5">
              <div className="flex gap-1.5">
                {projects.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCarouselIdx(i)}
                    className={`h-2 md:h-1.5 rounded-full transition-all duration-300 ${
                      carouselIdx === i ? "bg-white w-6" : "bg-white/15 w-2 md:w-1.5 hover:bg-white/30"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCarouselIdx((carouselIdx - 1 + projects.length) % projects.length)}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCarouselIdx((carouselIdx + 1) % projects.length)}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ============ SKILLS ============ */}
      <Section id="skills" progress={progress} range={[0.65, 0.85]}>
        <div>
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
            Skills<span className="text-white/20">.</span>
          </h2>
          <div className="h-0.5 w-16 bg-gradient-to-r from-white/30 to-transparent mb-6" />

          {/* Filter buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(["all", "frontend", "backend", "devops", "tools"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setSkillFilter(f)}
                className={`text-[10px] font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-[2px] px-3 py-1.5 rounded border transition-all cursor-pointer ${
                  skillFilter === f
                    ? "text-white border-white/30 bg-white/[0.05]"
                    : "text-white/30 border-white/[0.06] hover:border-white/15 hover:text-white/60"
                }`}
                style={
                  skillFilter === f && f !== "all"
                    ? {
                        color: catColors[f],
                        borderColor: `${catColors[f]}40`,
                        backgroundColor: `${catColors[f]}10`,
                      }
                    : undefined
                }
              >
                [ {f === "all" ? "todas" : f} ]
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {(["frontend", "backend", "devops", "tools"] as const)
              .filter((category) => skillFilter === "all" || skillFilter === category)
              .map((category) => (
                <motion.div
                  key={category}
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center gap-2 mb-5">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: catColors[category] }}
                    />
                    <h3
                      className="text-[10px] uppercase tracking-[3px] font-[family-name:var(--font-jetbrains-mono)] font-bold"
                      style={{ color: catColors[category] }}
                    >
                      {"{"} {category} {"}"}
                    </h3>
                  </div>

                  {/* Circuit line */}
                  <div
                    className="absolute left-1 top-10 bottom-0 w-px"
                    style={{
                      backgroundColor: `${catColors[category]}15`,
                    }}
                  />

                  <div className="space-y-4 pl-4">
                    {skills
                      .filter((s) => s.category === category)
                      .map((skill) => (
                        <div key={skill.name}>
                          <div className="flex justify-between text-[11px] mb-1.5 items-center gap-2">
                            <span className="text-white/60 font-[family-name:var(--font-jetbrains-mono)] flex items-center gap-1.5 min-w-0">
                              <span className="truncate">{skill.name}</span>
                              {skill.hot && (
                                <span className="text-[8px] font-bold text-[#fb923c] bg-[#fb923c]/10 px-1 py-0.5 rounded border border-[#fb923c]/20 shrink-0">
                                  HOT
                                </span>
                              )}
                            </span>
                            <span className="font-[family-name:var(--font-jetbrains-mono)] text-white/40 shrink-0 text-[10px]">
                              {skill.years}+ anos
                            </span>
                          </div>
                          <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level * 100}%` }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 1.2,
                                ease: "easeOut",
                              }}
                              style={{
                                background: `linear-gradient(90deg, ${catColors[category]}40, ${catColors[category]})`,
                                boxShadow: `0 0 8px ${catColors[category]}30`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </Section>

      {/* ============ CONTACT ============ */}
      <Section id="contact" progress={progress} range={[0.85, 1.0]}>
        <div className="max-w-2xl mx-auto w-full">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
            Contato<span className="text-white/20">.</span>
          </h2>
          <div className="h-0.5 w-16 bg-gradient-to-r from-white/30 to-transparent mb-6" />

          {/* Hero headline */}
          <div className="mb-6">
            <h3 className="text-lg md:text-2xl font-bold text-white leading-tight">
              Vamos construir o próximo{" "}
              <span className="text-gradient-silver">SaaS de sucesso</span>?
            </h3>
            <p className="text-[11px] md:text-xs text-white/40 font-[family-name:var(--font-jetbrains-mono)] mt-2">
              resposta em até 2h úteis · trabalho com clientes no mundo todo
            </p>
          </div>

          {/* CTA Principal Workana */}
          <a
            href={workanaStats.workanaProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block mb-5 terminal-window border-[#fbbf24]/30 hover:border-[#fbbf24]/60 transition-all cursor-pointer"
            style={{
              borderWidth: "1px",
              boxShadow: "0 0 20px rgba(251, 191, 36, 0.08)",
            }}
          >
            <div className="flex items-center h-8 px-3 bg-[#fbbf24]/[0.05] border-b border-[#fbbf24]/10">
              <div className="terminal-dots">
                <span /><span /><span />
              </div>
              <span className="ml-3 text-[10px] font-[family-name:var(--font-jetbrains-mono)] text-[#fbbf24]/60">
                hire.sh — executable
              </span>
            </div>
            <div className="p-5 md:p-6 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-[9px] font-[family-name:var(--font-jetbrains-mono)] text-[#fbbf24]/50 uppercase tracking-[2px] mb-1">
                  ★ hero · top {workanaStats.rankITBrazil} brasil · {workanaStats.rating}/5
                </div>
                <div className="text-base md:text-xl font-bold text-white font-[family-name:var(--font-jetbrains-mono)]">
                  CONTRATAR VIA WORKANA
                </div>
                <div className="text-[10px] md:text-xs text-white/40 mt-1">
                  {workanaStats.clientReviews} avaliações · {workanaStats.recurringClients} clientes recorrentes
                </div>
              </div>
              <div className="text-[#fbbf24] text-2xl md:text-3xl font-bold group-hover:translate-x-1 transition-transform shrink-0">
                →
              </div>
            </div>
          </a>

          {/* Terminal secondary links */}
          <div className="terminal-window">
            <div className="flex items-center h-8 px-3 bg-white/[0.03] border-b border-white/[0.06]">
              <div className="terminal-dots">
                <span /><span /><span />
              </div>
              <span className="ml-3 text-[10px] font-[family-name:var(--font-jetbrains-mono)] text-white/30">
                contact — bash
              </span>
            </div>

            <div className="p-5 md:p-6 font-[family-name:var(--font-jetbrains-mono)] text-sm space-y-3">
              <p className="text-[#4ade80]">
                $ echo &quot;Vamos Conversar&quot;
              </p>
              <p className="text-white/40 text-xs leading-relaxed">
                Tem um projeto em mente? Vamos transformar sua ideia em realidade.
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

              <div className="pt-4 border-t border-white/[0.06]">
                <p className="text-[#4ade80]">
                  $ git clone my-next-project{" "}
                  <span className="cursor-blink">_</span>
                </p>
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
    </>
  );
}
