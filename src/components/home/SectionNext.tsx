"use client";

import { chapters } from "@/lib/constants";

// --- Terminal-style transition teaser ("$ cd ../sobre →") ---
export default function SectionNext({
  index,
  onChapterClick,
}: {
  index: number;
  onChapterClick: (i: number) => void;
}) {
  const next = chapters[index + 1];
  if (!next) return null;
  return (
    <div className="mt-10 flex justify-center">
      <button
        onClick={() => onChapterClick(index + 1)}
        className="group inline-flex items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-white/50 hover:text-[#4ade80] transition-colors py-2 px-3"
      >
        <span className="text-[#4ade80]">$</span> cd ../{next.id}
        <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
      </button>
    </div>
  );
}
