"use client";

import { chapters } from "@/lib/constants";

// --- Chapter HUD ("02 / 05 — SOBRE") ---
export default function ChapterHUD({ currentChapter }: { currentChapter: number }) {
  const ch = chapters[currentChapter];
  if (!ch) return null;
  return (
    <div className="hidden md:flex fixed left-6 bottom-24 z-20 items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-[2px] select-none pointer-events-none">
      <span className="text-[#4ade80]">{String(currentChapter + 1).padStart(2, "0")}</span>
      <span className="text-white/40">/ {String(chapters.length).padStart(2, "0")}</span>
      <span className="w-6 h-px bg-white/20" />
      <span className="uppercase text-white/60">{ch.label}</span>
    </div>
  );
}
