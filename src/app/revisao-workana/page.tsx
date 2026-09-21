import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, FilePenLine } from "lucide-react";
import CopyBlock from "@/components/workana-review/CopyBlock";
import CaseReview from "@/components/workana-review/CaseReview";
import { portfolioWorkanaStats } from "@/lib/constants";
import { checklist, profileCopy, proposalCopy, reviewCases, reviewDate } from "@/lib/workana-review";

export const metadata: Metadata = {
  title: "Revisão Workana | EDevsHub local",
  description: "Textos e conferências para a revisão local do perfil Workana.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  alternates: { canonical: "/revisao-workana", languages: {} },
};

const navigation = [
  ["perfil", "Textos do perfil"],
  ["vitrine", "Três cases em destaque"],
  ["propostas", "Próximas propostas"],
  ["conferencia", "Antes de atualizar"],
  ["funil", "Medir a conversão"],
] as const;

export default function WorkanaReviewPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main data-scroll-page className="min-h-screen bg-[#0d1522] text-slate-100 selection:bg-[#b8d3f3] selection:text-[#0d1522]">
      <header className="border-b border-slate-700/70">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3"><FilePenLine size={20} className="text-[#b8d3f3]" /><span className="font-medium">EDevsHub / Revisão Workana</span></div>
          <nav aria-label="Prévia do portfólio" className="flex flex-wrap gap-5 text-sm text-slate-300">
            <Link href="/" className="underline-offset-4 hover:text-white hover:underline">Ver home local</Link>
            <Link href="/workana" className="underline-offset-4 hover:text-white hover:underline">Ver página Workana</Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12 lg:py-14">
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <p className="text-sm font-semibold text-[#c3d9f4]">Área de revisão local</p>
          <nav aria-label="Conteúdo da revisão" className="mt-5 flex flex-wrap gap-2 lg:flex-col lg:gap-1">
            {navigation.map(([id, label], index) => <a key={id} href={`#${id}`} className="rounded-lg px-3 py-3 text-sm text-slate-300 transition-colors hover:bg-slate-700/40 hover:text-white focus-visible:outline-2 focus-visible:outline-[#b8d3f3]"><span className="mr-3 text-slate-500">{index + 1}.</span>{label}</a>)}
          </nav>
          <p className="mt-6 max-w-xs text-sm leading-6 text-slate-400">Textos preparados a partir da auditoria de {reviewDate}. O perfil real não foi alterado.</p>
        </aside>
        <div className="min-w-0 space-y-16">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">Seu próximo perfil,<br />pronto para revisar.</h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">Revise os textos do perfil e dos cases, já com sua autoria confirmada, e copie o que aprovar para a Workana.</p>
            <div className="mt-6 rounded-xl border border-[#90b8ea]/25 bg-[#90b8ea]/7 px-5 py-4 text-sm leading-6 text-slate-200"><strong className="font-semibold text-white">Revisão local.</strong> Esta tela não publica alterações. Seus rascunhos são salvos neste navegador; se o armazenamento estiver indisponível, o campo avisa. A página não fica disponível no site em produção.</div>
          </div>

          <section id="perfil" className="scroll-mt-8 space-y-8">
            <div><h2 className="font-display text-3xl font-semibold text-white">Textos do perfil</h2><p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">Abertura focada no que você entrega, experiência resumida e próximo passo pelo chat da plataforma.</p></div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 border-y border-slate-700/70 py-4 text-sm text-slate-300"><span><strong className="text-white">{portfolioWorkanaStats.projectsCompleted}</strong> projetos</span><span><strong className="text-white">{portfolioWorkanaStats.rating.toLocaleString("pt-BR")}/5</strong> em {portfolioWorkanaStats.clientReviews} avaliações</span><span>{portfolioWorkanaStats.level}</span><span>Conferido em {portfolioWorkanaStats.verifiedAtLabel}</span></div>
            <CopyBlock draftKey="profile-title" title="Título" initialText={profileCopy.title} rows={2} />
            <CopyBlock draftKey="profile-about" title="Sobre mim" initialText={profileCopy.about} rows={20} hint="Começa pela oferta. O histórico vem depois; não repetimos ranking, stack e números em todos os parágrafos." />
            <CopyBlock draftKey="profile-experience" title="Experiência profissional" initialText={profileCopy.experience} rows={9} hint="Use os cases abaixo para detalhar o desenvolvimento que você realizou e as funcionalidades entregues." />
          </section>

          <section id="vitrine" className="scroll-mt-8 space-y-6">
            <div><h2 className="font-display text-3xl font-semibold text-white">Três cases em destaque</h2><p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">Seleção sugerida para disputar sistemas, integrações e SaaS. Em propostas de saúde, PACE ou NeuroIA podem ser mais pertinentes. A Workana pode decidir a apresentação final da vitrine.</p></div>
            {reviewCases.map((item, index) => <CaseReview key={item.id} item={item} position={index + 1} />)}
          </section>

          <section id="propostas" className="scroll-mt-8 space-y-6">
            <div><h2 className="font-display text-3xl font-semibold text-white">Próximas propostas</h2><p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">Uma estrutura para adaptar a um briefing real. Substitua os campos entre colchetes e apague o que não se aplicar antes de enviar.</p></div>
            <CopyBlock draftKey="proposal-structure" title="Estrutura de proposta" initialText={proposalCopy} rows={15} />
            <div className="border-l-2 border-[#b8d3f3]/60 pl-5 text-base leading-7 text-slate-300">Responda às perguntas do cliente, use um case relacionado e proponha a primeira entrega. Pergunte somente o que falta para definir escopo, preço ou prazo. Disponibilidade e resultados precisam ser reais.</div>
          </section>

          <section id="conferencia" className="scroll-mt-8 space-y-6">
            <div><h2 className="font-display text-3xl font-semibold text-white">Antes de atualizar</h2><p className="mt-3 text-base leading-7 text-slate-300">Estes pontos dependem do seu painel ou da sua confirmação.</p></div>
            <div className="divide-y divide-slate-700/70 rounded-xl border border-slate-700/70 px-5">
              {checklist.map((item, index) => <label key={item.title} htmlFor={`check-${index}`} className="flex cursor-pointer items-start gap-4 py-5"><input id={`check-${index}`} type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-[#b8d3f3]" /><span><strong className="block text-base font-medium text-white">{item.title}</strong><span className="mt-2 block text-sm leading-6 text-slate-300">{item.detail}</span></span></label>)}
            </div>
          </section>

          <section id="funil" className="scroll-mt-8 space-y-6">
            <div><h2 className="font-display text-3xl font-semibold text-white">Medir a conversão</h2><p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">O histórico ainda está sem dados. Preencha os últimos 60–90 dias no kit e acompanhe as próximas propostas. A revisão inicial em 14 dias depende do volume e do tempo de decisão dos clientes.</p></div>
            <div className="overflow-x-auto rounded-xl border border-slate-700/70">
              <table className="w-full min-w-[490px] text-left text-sm"><caption className="sr-only">Histórico real ainda não informado</caption><thead className="bg-[#162133] text-slate-200"><tr><th className="px-5 py-4 font-medium">Etapa</th><th className="px-5 py-4 font-medium">Últimos 60–90 dias</th><th className="px-5 py-4 font-medium">Conferir</th></tr></thead><tbody className="divide-y divide-slate-700/70 text-slate-300">{[["Propostas enviadas", "Adequação ao projeto"], ["Propostas lidas", "Somente se o painel informar"], ["Respostas de clientes", "Contar por projeto"], ["Conversas qualificadas", "Necessidade, orçamento e prazo"], ["Contratos fechados", "Separar novos e recorrentes"], ["Receita contratada", "Registrar moeda e período"]].map(([stage, detail]) => <tr key={stage}><th scope="row" className="px-5 py-4 font-normal text-slate-100">{stage}</th><td className="px-5 py-4 text-slate-400">Não informado</td><td className="px-5 py-4">{detail}</td></tr>)}</tbody></table>
            </div>
            <p className="text-sm leading-6 text-slate-400">Arquivos: <code className="text-slate-200">kit-workana/baseline.csv</code> e <code className="text-slate-200">kit-workana/funil.csv</code>. Campo sem dado fica em branco ou “indisponível”; não vira zero. Templates e instruções ficam em <code className="text-slate-200">kit-workana/propostas.md</code>.</p>
          </section>
          <footer className="border-t border-slate-700/70 pt-6 text-sm leading-6 text-slate-400">Depois de revisar, copie os textos e atualize os campos correspondentes no seu perfil. <a href="https://www.workana.com/freelancer/89c9896a5874018ef858f71acf0f5dc6" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#c3d9f4] underline underline-offset-4">Abrir perfil público <ArrowUpRight size={14} aria-hidden="true" /></a></footer>
        </div>
      </div>
    </main>
  );
}
