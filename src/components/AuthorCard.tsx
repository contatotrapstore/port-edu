import Image from "next/image";
import { portfolioWorkanaStats as workanaStats } from "@/lib/constants";
import WorkanaLink from "@/components/workana/WorkanaLink";
import type { Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";

/**
 * Cartão de autor para as páginas de case.
 *
 * Identifica o profissional e mantém o retorno à Workana, com evento próprio.
 */
export default function AuthorCard({ source, locale = "pt" }: { source: string; locale?: Locale }) {
  return (
    <aside className="terminal-window p-5 md:p-6 flex flex-col sm:flex-row items-center gap-5">
      <Image
        src="/images/profile.webp"
        alt=""
        width={64}
        height={64}
        className="w-16 h-16 rounded-full object-cover border-2 border-[#fbbf24]/50 shrink-0"
      />
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <p className="font-display font-bold text-white">Eduardo Gouveia</p>
        <p className="text-white/70 text-sm mt-1 leading-relaxed">
          {t(locale, "case.authorProof", {
            projects: workanaStats.projectsCompleted,
            reviews: workanaStats.clientReviews,
          })}
          <span className="block text-[#fbbf24]">★ {workanaStats.rating.toLocaleString(locale === "pt" ? "pt-BR" : "en-US")}/5 · {workanaStats.level}</span>
        </p>
        <p className="mt-1 text-xs text-white/45">
          {t(locale, "case.verifiedAt", { date: workanaStats.verifiedAtLabel })}
        </p>
      </div>
      <WorkanaLink
        location={`${source}_author`}
        className="shrink-0 inline-flex items-center gap-2 min-h-11 px-4 py-3 rounded-lg bg-[#fbbf24] text-black text-sm font-bold hover:bg-[#fcd34d] transition-colors"
      >
        {t(locale, "case.profile")}
        <span aria-hidden>↗</span>
      </WorkanaLink>
    </aside>
  );
}
