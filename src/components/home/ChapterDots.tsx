"use client";

import { chapters } from "@/lib/constants";
import { useLocale } from "@/lib/locale";
import { t, chaptersLabels } from "@/lib/i18n";

// --- Chapter Dots ---
export default function ChapterDots({
  currentChapter,
  onChapterClick,
}: {
  currentChapter: number;
  onChapterClick: (i: number) => void;
}) {
  const locale = useLocale();
  const labels = chaptersLabels[locale];
  return (
    <div className="hidden md:flex fixed right-5 top-1/2 -translate-y-1/2 z-20 flex-col gap-1">
      {chapters.map((ch, i) => (
        <button
          key={ch.id}
          onClick={() => onChapterClick(i)}
          aria-label={t(locale, "nav.goTo", { label: labels[i] ?? ch.label })}
          aria-current={currentChapter === i ? "page" : undefined}
          className="group relative flex items-center justify-center w-8 h-8"
        >
          <span
            className={`block w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
              currentChapter === i
                ? "border-white bg-white shadow-[0_0_12px_rgba(200,200,200,0.3)]"
                : "border-white/40 group-hover:border-white/70 group-hover:scale-125"
            }`}
          />
          <span className="absolute right-8 top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-[family-name:var(--font-jetbrains-mono)] text-white/60 opacity-0 group-hover:opacity-100 transition-opacity">
            {labels[i] ?? ch.label}
          </span>
        </button>
      ))}
    </div>
  );
}
