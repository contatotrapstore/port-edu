import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  offers,
  pricingConfirmed,
  projects,
  testimonials,
  workanaStats,
} from "@/lib/constants";
import { siteUrl } from "@/lib/site";
import TerminalHeader from "@/components/TerminalHeader";
import CaseHeader from "@/components/CaseHeader";
import DirectContact from "@/components/contact/DirectContact";

/**
 * Página comercial — a ÚNICA com canal de contato direto (junto de /solucoes/*).
 *
 * Nunca é enviada dentro de uma proposta da Workana: é o destino de quem chega
 * por busca, LinkedIn, indicação ou (no futuro) anúncio. O fluxo permitido é de
 * fora para dentro — daqui o cliente pode ser convidado a fechar na Workana.
 */

const title = "Contratar desenvolvedor full stack sênior — SaaS, sistemas e automação com IA";

export const metadata: Metadata = {
  title,
  description:
    `Desenvolvedor full stack sênior com ${workanaStats.projectsCompleted} projetos entregues e ${workanaStats.rating}/5 em ${workanaStats.clientReviews} avaliações. Automação com IA, integrações e painéis sob medida, SaaS e MVPs.`,
  alternates: { canonical: "/contratar" },
};

const faq: Array<{ q: string; a: string }> = [
  {
    q: "Quanto custa?",
    a: "Depende do escopo, mas trabalho com faixas conhecidas antes de começar: integração e painel a partir de R$ 6 mil, automação com IA integrada a partir de R$ 12 mil, MVP de SaaS a partir de R$ 28 mil. Na primeira conversa eu já digo em qual faixa o seu caso cai — e se não couber, eu falo na hora.",
  },
  {
    q: "Quanto tempo leva?",
    a: "Automação de atendimento: 2 a 4 semanas. Integração e painel: 2 a 6 semanas. MVP de SaaS: 6 semanas para a primeira fase utilizável. Projetos maiores são divididos em fases com entrega a cada uma.",
  },
  {
    q: "Como funciona o pagamento?",
    a: "Dois caminhos. Contrato direto com nota fiscal, dividido em marcos (entrada, meio, entrega). Ou pela Workana, onde o valor fica em garantia e é liberado conforme cada etapa é entregue — nesse caso a plataforma cobra a própria taxa, já embutida no preço que eu passo.",
  },
  {
    q: "O que eu preciso ter pronto para começar?",
    a: "O problema descrito em uma frase e a resposta para duas perguntas: qual volume (usuários, conversas, pedidos por mês) e quais sistemas já existem. Escopo, telas e regras a gente fecha juntos no briefing — é parte do trabalho, não pré-requisito.",
  },
  {
    q: "Você dá manutenção depois?",
    a: `Sim. Entrego com documentação e handover, e sigo disponível para evolução e suporte — ${workanaStats.recurringClients} clientes já me contrataram mais de uma vez, quase sempre para a fase seguinte do mesmo sistema.`,
  },
];

const notFor = [
  "site institucional simples, landing page ou loja de prateleira",
  "orçamento abaixo de R$ 5 mil",
  "quem quer no-code, template pronto ou \"um app igual ao iFood\"",
  "prazo menor que duas semanas para sistema do zero",
];

const featuredReviewAuthors = ["Fernando Esteves", "Useconvoo", "Arthur Versolato"];

export default function ContratarPage() {
  const reviews = featuredReviewAuthors
    .map((a) => testimonials.find((tm) => tm.author === a))
    .filter(Boolean) as typeof testimonials;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        name: "Eduardo Gouveia — Desenvolvimento full stack sob medida",
        url: `${siteUrl}/contratar`,
        areaServed: "BR",
        priceRange: "$$",
        provider: { "@id": `${siteUrl}/#person` },
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen">
        <CaseHeader source="contratar_header" />
        <main className="mx-auto max-w-3xl px-5 md:px-8 py-10 md:py-14">
          <p className="text-[11px] font-[family-name:var(--font-jetbrains-mono)] text-[#4ade80]">
            $ contratar --dev fullstack-senior
          </p>

          <h1 className="mt-4 font-display text-3xl md:text-[42px] font-bold text-white leading-[1.1] tracking-tight text-balance">
            Contratar desenvolvedor full stack sênior
          </h1>
          <p className="mt-4 text-white/65 text-lg leading-relaxed max-w-[62ch]">
            Automação com IA, integrações e painéis sob medida, SaaS e MVPs — para
            empresas que já passaram da fase de ideia e precisam de software que
            aguente uso real.
          </p>

          {/* Prova, acima da dobra */}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-[family-name:var(--font-jetbrains-mono)] text-white/55">
            <span>
              <b className="text-white">{workanaStats.projectsCompleted}</b> projetos entregues
            </span>
            <span>
              <b className="text-[#fbbf24]">★ {workanaStats.rating}/5</b> em{" "}
              {workanaStats.clientReviews} avaliações
            </span>
            <span>
              <b className="text-white">{workanaStats.recurringClients}</b> clientes recontrataram
            </span>
            <span>
              nível <b className="text-[#fbbf24]">{workanaStats.level}</b> na Workana
            </span>
          </div>

          <div className="mt-7">
            <DirectContact page="contratar_topo" compact />
          </div>

          {/* Ofertas */}
          <h2 className="mt-14 font-display text-2xl font-bold text-white">
            O que eu construo
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-3">
            {offers.map((o) => (
              <article key={o.id} className="terminal-window p-5 md:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-display text-lg font-bold text-white">{o.name}</h3>
                  <span className="text-[11px] font-[family-name:var(--font-jetbrains-mono)] text-white/45">
                    {pricingConfirmed ? `${o.range} · ${o.term}` : o.term}
                  </span>
                </div>
                <p className="mt-2 text-[14px] leading-relaxed text-white/60">{o.promise}</p>
                <ul className="mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
                  {o.scope.map((item) => (
                    <li
                      key={item}
                      className="text-[12.5px] leading-relaxed text-white/55 flex items-start gap-2"
                    >
                      <span className="text-[#4ade80] shrink-0">▹</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  {o.cases
                    .map((id) => projects.find((p) => p.id === id))
                    .filter(Boolean)
                    .map((p) => (
                      <Link
                        key={p!.id}
                        href={`/projetos/${p!.id}`}
                        className="text-[11px] font-[family-name:var(--font-jetbrains-mono)] px-2.5 py-1 rounded border border-white/10 text-white/55 hover:text-white hover:border-white/25 transition-colors"
                      >
                        {p!.title} ↗
                      </Link>
                    ))}
                </div>
              </article>
            ))}
          </div>

          {/* Desqualificação — filtro mais barato que existe */}
          <div className="mt-10 rounded-lg border border-white/[0.08] bg-white/[0.02] p-5">
            <h2 className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[2px] text-white/40">
              // não é pra você se
            </h2>
            <ul className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
              {notFor.map((n) => (
                <li key={n} className="text-[13px] text-white/50 flex items-start gap-2">
                  <span className="text-white/25 shrink-0">×</span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cases */}
          <h2 className="mt-14 font-display text-2xl font-bold text-white">
            Cases com resultado
          </h2>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {["clinafy", "mudapaisagens", "blackinbot"]
              .map((id) => projects.find((p) => p.id === id))
              .filter(Boolean)
              .map((p) => (
                <Link
                  key={p!.id}
                  href={`/projetos/${p!.id}`}
                  className="group block terminal-window overflow-hidden hover:border-white/20 transition-colors"
                >
                  <span className="relative block aspect-[16/10] overflow-hidden bg-[#0d0d0d]">
                    <Image
                      src={p!.cover ?? p!.image}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 92vw, 220px"
                      className="object-cover object-center opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  </span>
                  <span className="block p-3.5">
                    <span className="block font-display text-sm font-bold text-white/85 group-hover:text-white transition-colors">
                      {p!.title}
                    </span>
                    <span className="block mt-1 text-[11px] text-white/45 leading-relaxed">
                      {p!.headline}
                    </span>
                    {p!.output?.[0] && (
                      <span className="block mt-2 text-[10px] font-[family-name:var(--font-jetbrains-mono)] text-[#4ade80]">
                        → {p!.output[0]}
                      </span>
                    )}
                  </span>
                </Link>
              ))}
          </div>
          <div className="mt-4">
            <Link
              href="/projetos"
              className="text-[12px] font-[family-name:var(--font-jetbrains-mono)] text-white/50 hover:text-[#4ade80] transition-colors"
            >
              ver todos os cases →
            </Link>
          </div>

          {/* Avaliações */}
          <h2 className="mt-14 font-display text-2xl font-bold text-white">
            O que os clientes dizem
          </h2>
          <div className="mt-5 space-y-3">
            {reviews.map((tm) => (
              <blockquote key={tm.author} className="terminal-window p-5">
                <div className="text-[#fbbf24] text-[11px]">{"★".repeat(tm.rating)}</div>
                <p className="mt-2 text-white/60 text-[13px] leading-relaxed italic">
                  &ldquo;{tm.text}&rdquo;
                </p>
                <footer className="mt-3 pt-3 border-t border-white/[0.06] text-[11px] font-[family-name:var(--font-jetbrains-mono)]">
                  <span className="text-white/55">— {tm.author}</span>
                  <span className="text-white/15"> · </span>
                  <span className="text-white/40">{tm.date}</span>
                  <span className="block text-[#60a5fa]/70 mt-1">{tm.project}</span>
                </footer>
              </blockquote>
            ))}
          </div>

          {/* Processo */}
          <div className="mt-14 terminal-window">
            <TerminalHeader title="process.sh — como funciona" />
            <div className="p-5 md:p-6 space-y-4">
              {[
                { n: "01", t: "Briefing", d: "respondo no mesmo dia útil com as perguntas certas sobre o seu projeto" },
                { n: "02", t: "Proposta fechada", d: "escopo, prazo e marcos por escrito — contrato direto com nota fiscal ou via Workana com pagamento protegido" },
                { n: "03", t: "Desenvolvimento", d: "updates constantes; você acompanha cada entrega, não só o resultado final" },
                { n: "04", t: "Entrega e suporte", d: "documentação, handover e evolução depois que entra no ar" },
              ].map((s) => (
                <div key={s.n} className="flex gap-4 items-start">
                  <span className="text-[#4ade80] font-[family-name:var(--font-jetbrains-mono)] text-xs font-bold pt-0.5 shrink-0">
                    {s.n}
                  </span>
                  <div>
                    <div className="text-white text-sm font-bold">{s.t}</div>
                    <div className="text-white/50 text-[12px] mt-0.5 leading-relaxed">{s.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <h2 className="mt-14 font-display text-2xl font-bold text-white">
            Perguntas frequentes
          </h2>
          <dl className="mt-5 space-y-4">
            {faq.map((f) => (
              <div key={f.q} className="border-b border-white/[0.06] pb-4">
                <dt className="text-white font-semibold text-[15px]">{f.q}</dt>
                <dd className="mt-1.5 text-white/55 text-[13.5px] leading-relaxed max-w-[68ch]">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>

          {/* CTA final */}
          <div className="mt-12">
            <DirectContact page="contratar_rodape" />
          </div>

          <footer className="mt-12 pb-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] font-[family-name:var(--font-jetbrains-mono)] text-white/30">
            <Link href="/" className="hover:text-white/60 transition-colors">
              portfólio
            </Link>
            <Link href="/projetos" className="hover:text-white/60 transition-colors">
              cases
            </Link>
            <Link href="/politica-de-privacidade" className="hover:text-white/60 transition-colors">
              política de privacidade
            </Link>
          </footer>
        </main>
      </div>
    </>
  );
}
