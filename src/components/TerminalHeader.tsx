import type { ReactNode } from "react";

/** Terminal window header (mac dots + filename + optional right slot). */
export default function TerminalHeader({
  title,
  right,
  tone = "default",
}: {
  title: ReactNode;
  right?: ReactNode;
  tone?: "default" | "gold";
}) {
  const gold = tone === "gold";
  return (
    <div
      className={`flex items-center h-8 px-3 border-b ${
        gold ? "bg-[#fbbf24]/[0.05] border-[#fbbf24]/10" : "bg-white/[0.03] border-white/[0.06]"
      }`}
    >
      <div className="terminal-dots">
        <span /><span /><span />
      </div>
      <span
        className={`ml-3 text-[11px] font-[family-name:var(--font-jetbrains-mono)] ${
          gold ? "text-[#fbbf24]/80" : "text-white/65"
        }`}
      >
        {title}
      </span>
      {right && (
        <span className="ml-auto pl-2 text-[11px] font-[family-name:var(--font-jetbrains-mono)] text-white/65">
          {right}
        </span>
      )}
    </div>
  );
}
