"use client";

import Link from "next/link";
import Image from "next/image";
import WorkanaLink from "@/components/workana/WorkanaLink";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

/**
 * Header fixo das páginas de case.
 *
 * Mantém o próximo passo no mesmo canal dos CTAs do conteúdo e do autor.
 */
export default function CaseHeader({ source }: { source: string }) {
  const locale = useLocale();

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="mx-auto max-w-3xl px-5 md:px-8 h-14 flex items-center justify-between gap-4">
        <Link href={locale === "en" ? "/en" : "/"} className="shrink-0 opacity-80 hover:opacity-100 transition-opacity">
          <Image
            src="/EdevsHub.webp"
            alt={`EDevsHub — ${t(locale, "casePage.home")}`}
            width={104}
            height={28}
            className="invert mix-blend-screen w-[104px] h-auto"
          />
        </Link>
        <WorkanaLink
          location={`${source}_header`}
          className="inline-flex items-center justify-center gap-1.5 min-h-10 px-3 py-2 rounded-md bg-[#fbbf24] text-black text-[12px] font-bold text-center hover:bg-[#fcd34d] transition-colors"
        >
          {t(locale, "case.profile")} <span aria-hidden>↗</span>
        </WorkanaLink>
      </div>
    </header>
  );
}
