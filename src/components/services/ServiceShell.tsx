import Link from "next/link";
import type { ReactNode } from "react";
import WorkanaLink from "@/components/workana/WorkanaLink";

export default function ServiceShell({ children }: { children: ReactNode }) {
  return (
    <div data-scroll-page className="min-h-screen bg-[#0a0c0b] text-white">
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
      <header className="border-b border-white/10 bg-[#0a0c0b]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-5 py-5 sm:px-8">
          <Link href="/" className="inline-flex min-h-11 items-center gap-2 font-display text-lg font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4ade80]" aria-label="EDevsHub, início">
            <span aria-hidden="true" className="font-mono text-[#4ade80]">&gt;_</span> EDevsHub
          </Link>
          <nav aria-label="Navegação principal" className="flex flex-wrap items-center gap-x-5 text-sm text-white/75 sm:gap-x-7">
            <Link href="/" className="py-3 hover:text-white focus-visible:outline-2 focus-visible:outline-[#4ade80]">Início</Link>
            <Link href="/projetos" className="py-3 hover:text-white focus-visible:outline-2 focus-visible:outline-[#4ade80]">Projetos</Link>
            <Link href="/servicos" className="py-3 text-[#4ade80] underline decoration-[#4ade80]/35 underline-offset-4 focus-visible:outline-2 focus-visible:outline-[#4ade80]">Serviços</Link>
            <WorkanaLink location="services_navigation" className="hidden min-h-11 items-center rounded-lg border border-[#fbbf24]/35 px-4 py-2 text-[#fbbf24] transition-colors hover:bg-[#fbbf24]/10 focus-visible:outline-2 focus-visible:outline-[#fbbf24] sm:inline-flex">
              Perfil na Workana ↗
            </WorkanaLink>
          </nav>
        </div>
      </header>
      <main id="conteudo" tabIndex={-1} className="mx-auto max-w-6xl px-5 pb-14 pt-6 focus:outline-none sm:px-8 md:pt-8">{children}</main>
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-5 px-5 py-8 text-sm leading-relaxed text-white/60 sm:flex-row sm:px-8">
          <div><p className="font-semibold text-white/85">Eduardo Gouveia</p><p className="mt-1">Desenvolvimento de sistemas, SaaS e integrações.</p></div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/projetos" className="py-2 underline underline-offset-4 hover:text-white">Conhecer os projetos</Link>
            <Link href="/politica-de-privacidade" className="py-2 underline underline-offset-4 hover:text-white">Privacidade</Link>
            <WorkanaLink location="services_footer" className="py-2 text-[#fbbf24] underline underline-offset-4">Ver perfil na Workana ↗</WorkanaLink>
          </div>
        </div>
      </footer>
    </div>
  );
}
