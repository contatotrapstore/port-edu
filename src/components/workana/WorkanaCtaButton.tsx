"use client";

import WorkanaLink from "@/components/workana/WorkanaLink";

/** Botão gold de contratação da landing /workana — único JS de cliente da página. */
export default function WorkanaCtaButton({
  location,
  label,
  sub,
}: {
  location: string;
  label: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <WorkanaLink
        location={location}
        className="group h-12 text-[13px] font-[family-name:var(--font-jetbrains-mono)] font-bold text-black px-8 rounded-lg bg-[#fbbf24] hover:bg-[#fcd34d] transition-all cursor-pointer shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] inline-flex items-center justify-center gap-2"
      >
        <span className="text-[11px]">★</span>
        {label}
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </WorkanaLink>
      {sub && (
        <span className="text-[10px] font-[family-name:var(--font-jetbrains-mono)] text-white/40">
          {sub}
        </span>
      )}
    </div>
  );
}
