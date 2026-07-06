"use client";

import Image from "next/image";
import { useState } from "react";
import { m } from "framer-motion";
import { chapters, workanaStats } from "@/lib/constants";
import { track } from "@vercel/analytics";

// --- Navbar ---
export default function Navbar({
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
            src="/EdevsHub.webp"
            alt="EDevsHub"
            width={140}
            height={36}
            style={{ width: "auto", height: "24px" }}
            className="invert mix-blend-screen md:[height:28px]"
          />
          <span className="hidden md:flex items-center gap-1.5 text-[10px] font-[family-name:var(--font-jetbrains-mono)] text-[#4ade80]/80 ml-4 border-l border-white/[0.06] pl-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
            disponível p/ projetos
          </span>
        </div>

        {/* Desktop nav */}
        <ul className="hidden md:flex gap-6">
          {chapters.map((ch, i) => (
            <li key={ch.id}>
              <button
                onClick={() => onChapterClick(i)}
                aria-current={currentChapter === i ? "page" : undefined}
                className={`relative text-[11px] uppercase tracking-[2px] font-[family-name:var(--font-jetbrains-mono)] py-2 transition-all duration-300 ${
                  currentChapter === i
                    ? "text-white"
                    : "text-white/50 hover:text-white/80"
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

        {/* Persistent hire CTA */}
        <a
          href={workanaStats.workanaProfileUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("workana_cta", { location: "navbar" })}
          className="hidden md:inline-flex items-center gap-1.5 h-8 px-4 rounded-md bg-[#fbbf24] text-black text-[10px] font-[family-name:var(--font-jetbrains-mono)] font-bold uppercase tracking-[1.5px] hover:bg-[#fcd34d] transition-colors shrink-0 ml-4"
        >
          ★ Contratar
        </a>

        {/* Mobile: compact CTA + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <a
            href={workanaStats.workanaProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("workana_cta", { location: "navbar" })}
            className="inline-flex items-center h-8 px-3 rounded-md bg-[#fbbf24] text-black text-[10px] font-[family-name:var(--font-jetbrains-mono)] font-bold uppercase tracking-[1px]"
          >
            Contratar
          </a>
        <button
          className="flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={`block w-5 h-px bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[4px]" : ""}`} />
          <span className={`block w-5 h-px bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-px bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[4px]" : ""}`} />
        </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <m.div
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
              aria-current={currentChapter === i ? "page" : undefined}
              className={`text-lg font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-[4px] transition-colors ${
                currentChapter === i ? "text-white" : "text-white/55"
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
        </m.div>
      )}
    </>
  );
}
