"use client";

import { chapters } from "@/lib/constants";
import { useLocale } from "@/lib/locale";
import { chaptersLabels } from "@/lib/i18n";

// --- Chapter HUD ("02 / 05 — SOBRE") ---
export default function ChapterHUD({ currentChapter }: { currentChapter: number }) {
  const locale = useLocale();
  const ch = chapters[currentChapter];
  if (!ch) return null;
  const label = chaptersLabels[locale][currentChapter] ?? ch.label;
  return (
    <div className="hidden md:flex fixed left-6 bottom-24 z-20 items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-[2px] select-none pointer-events-none">
      <span className="text-[#4ade80]">{String(currentChapter + 1).padStart(2, "0")}</span>
      <span className="text-white/40">/ {String(chapters.length).padStart(2, "0")}</span>
      <span className="w-6 h-px bg-white/20" />
      <span className="uppercase text-white/60">{label}</span>
    </div>
  );
}
