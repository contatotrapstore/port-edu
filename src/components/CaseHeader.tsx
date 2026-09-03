"use client";

import Link from "next/link";
import Image from "next/image";
import { track } from "@vercel/analytics";
import { contratarHref } from "@/lib/links";
import { getAttribution } from "@/lib/attribution";

/**
 * Header fixo das páginas de case.
 *
 * As 22 páginas de case são a maior porta de entrada orgânica do site e não
 * tinham navegação nenhuma: quem chegava por busca lia o case e não tinha como
 * voltar nem como falar com alguém.
 */
export default function CaseHeader({ source }: { source: string }) {
  const onContratar = () => {
    const { src, ref } = getAttribution();
    track("contratar_click", {
      location: source,
      ...(src ? { src } : ref ? { ref } : {}),
    });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="mx-auto max-w-3xl px-5 md:px-8 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="shrink-0 opacity-80 hover:opacity-100 transition-opacity">
          <Image
            src="/EdevsHub.webp"
            alt="EDevsHub — início"
            width={104}
            height={28}
            className="invert mix-blend-screen w-[104px] h-auto"
          />
        </Link>
        <Link
          href={contratarHref(source)}
          onClick={onContratar}
          className="inline-flex items-center gap-1.5 h-8 px-4 rounded-md bg-[#fbbf24] text-black text-[10px] font-[family-name:var(--font-jetbrains-mono)] font-bold uppercase tracking-[1.5px] hover:bg-[#fcd34d] transition-colors"
        >
          ★ Contratar
        </Link>
      </div>
    </header>
  );
}
