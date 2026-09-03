import Link from "next/link";
import { workanaStats } from "@/lib/constants";
import { contratarHref } from "@/lib/links";

/**
 * Cartão de autor para as páginas de case.
 *
 * Um case ótimo assinado por um autor anônimo não converte: quem chega pelo
 * Google não sabe quem escreveu nem o que fazer a seguir. Fica no page.tsx do
 * case — nunca em CaseStudyContent, que é compartilhado com o modal e era
 * alcançável a partir da zona Workana.
 */
export default function AuthorCard({ source }: { source: string }) {
  return (
    <aside className="terminal-window p-5 md:p-6 flex flex-col sm:flex-row items-center gap-5">
      <img
        src="/images/profile.webp"
        alt=""
        className="w-16 h-16 rounded-full object-cover border-2 border-[#fbbf24]/50 shrink-0"
      />
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <p className="font-display font-bold text-white">Eduardo Gouveia</p>
        <p className="text-white/55 text-[13px] mt-0.5">
          Full Stack Sênior · {workanaStats.projectsCompleted} projetos entregues ·{" "}
          <span className="text-[#fbbf24]">★ {workanaStats.rating}/5</span> em{" "}
          {workanaStats.clientReviews} avaliações
        </p>
      </div>
      <Link
        href={contratarHref(source)}
        className="shrink-0 inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-[#fbbf24] text-black text-[12px] font-[family-name:var(--font-jetbrains-mono)] font-bold hover:bg-[#fcd34d] transition-colors"
      >
        Quero um projeto assim
        <span aria-hidden>→</span>
      </Link>
    </aside>
  );
}
