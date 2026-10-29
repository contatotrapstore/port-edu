"use client";

import { useEffect } from "react";

// Mesma tela de erro de app/(pt)/error.tsx, em inglês, para as rotas /en/*.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-5 bg-[#0a0a0a] px-6 text-center">
      <div className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-[#4ade80]">
        <span>&gt;</span> unexpected error
      </div>
      <h1 className="text-xl font-bold text-white font-[family-name:var(--font-jetbrains-mono)]">
        Something went wrong
      </h1>
      <p className="max-w-sm text-sm text-white/50">
        Try reloading. If it keeps happening, come back later.
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 h-10 px-5 rounded-lg border border-white/15 bg-white/[0.05] text-[12px] font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-[2px] text-white hover:bg-white/[0.1] transition-colors"
      >
        try again
      </button>
    </div>
  );
}
