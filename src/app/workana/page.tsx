import type { Metadata } from "next";
import Image from "next/image";
import { projects, testimonials, workanaStats } from "@/lib/constants";
import TerminalHeader from "@/components/TerminalHeader";
import WorkanaCtaButton from "@/components/workana/WorkanaCtaButton";
import WorkanaLink from "@/components/workana/WorkanaLink";

/**
 * ZONA WORKANA — página de credenciais anexada/enviada dentro da plataforma.
 *
 * REGRA INEGOCIÁVEL: esta página é um beco sem saída. Zero canal de contato
 * (WhatsApp, e-mail, telefone, formulário, redes) e zero link interno — nem
 * para a home, nem para os cases. A política da Workana lista "página na
 * internet" como dado de contato proibido em proposta, e a escala é de dois
 * degraus: alerta + suspensão de propostas, depois encerramento incontestável.
 *
 * O canal direto vive SÓ em /contratar e /solucoes/*. `scripts/check-workana-
 * isolation.mjs` roda no build e quebra o deploy se algo vazar para cá.
 */

export const metadata: Metadata = {
  title: "Eduardo Gouveia — Full Stack Sênior | Workana",
  description:
    "176 projetos entregues · 4.74/5 em 179 avaliações · nível HERO na Workana. Cases, avaliações e como funciona trabalhar comigo.",
  robots: { index: false, follow: false },
  // Canonical própria e sem hreflang: o layout raiz injetaria links absolutos
  // para o domínio, e esta página não aponta para lugar nenhum.
  alternates: { canonical: "/workana", languages: {} },
};

// Cases com resultado afirmável — dados de constants.ts, curados aqui.
const featuredCases: Array<{ id: string; tagline: string; result: string }> = [
  {
    id: "clinafy",
    tagline:
      "Prontuário eletrônico com IA, agenda inteligente, teleconsulta e financeiro para saúde mental — tudo em um só sistema.",
    result: "+500 profissionais ativos · +50.000 consultas · 4.9/5",
  },
  {
    id: "mudapaisagens",
    tagline:
      "Atendimento comercial com IA no WhatsApp: qualificação por perguntas estruturadas e registro automático no Pipefy via Make.",
    result: "pré-atendimento sem intervenção manual · leads registrados no CRM",
  },
  {
    id: "passagenseuropa",
    tagline:
      "CRM sob medida: leads, funil, atendimento, cotações, financeiro e comissões numa plataforma só, com IA de apoio.",
    result: "operação comercial centralizada",
  },
  {
    id: "neuroialab",
    tagline:
      "SaaS de saúde mental com assistentes de IA especializados para psicólogos, fonoaudiólogos e terapeutas.",
    result: "19 assistentes de IA clínicos em produção",
  },
  {
    id: "pace",
    tagline:
      "Sistema clínico de neurofeedback: sessões guiadas por ondas cerebrais (EEG) + gestão completa do consultório.",
    result: "EEG em tempo real no navegador · 28 jogos 3D · protocolo de 12 semanas",
  },
];

// Avaliações mais fortes/específicas das 10 verbatim — aqui o campo `project` aparece.
const featuredReviewAuthors = [
  "Fernando Esteves",
  "Useconvoo",
  "Arthur Versolato",
  "José Ricardo Silva de Sousa",
  "Leonardo Flores",
];

const processSteps: Array<{ n: string; title: string; desc: string }> = [
  { n: "01", title: "Briefing", desc: "respondo no mesmo dia útil com as perguntas certas sobre o seu projeto" },
  { n: "02", title: "Proposta fechada", desc: "escopo, prazo e marcos definidos direto na Workana" },
  { n: "03", title: "Desenvolvimento", desc: "updates constantes — você acompanha cada entrega" },
  { n: "04", title: "Entrega + suporte", desc: "documentação, ajustes e código que escala" },
];

// Como o escopo é fechado — o que protege os dois lados numa disputa.
const scopeRules: string[] = [
  "escopo, entregáveis, prazo e critério de aceite escritos aqui no chat antes do depósito em garantia",
  "marcos com liberação parcial: você libera conforme recebe, não tudo no fim",
  "resumo de toda conversa postado no chat no mesmo dia — nada fica só no verbal",
  "mudança de escopo vira extensão formal com prazo e valor, nunca ajuste silencioso",
];

export default function WorkanaLandingPage() {
  const cases = featuredCases
    .map((c) => ({ ...c, project: projects.find((p) => p.id === c.id) }))
    .filter((c) => c.project);
  const reviews = featuredReviewAuthors
    .map((a) => testimonials.find((tm) => tm.author === a))
    .filter(Boolean) as typeof testimonials;

  return (
    <>
      {/* Backdrop estático (zero JS, zero vídeo) — só a textura de grid */}
      <div
        aria-hidden
        className="wk-backdrop fixed inset-0 z-0 pointer-events-none bg-cover bg-center mix-blend-screen opacity-20"
        style={{ backgroundImage: "url(/textures/hero-grid.webp)" }}
      />

      {/* html/body são overflow:hidden no desktop — mesmo shell das páginas de case */}
      <main className="wk-main fixed inset-0 z-10 overflow-y-auto scrollbar-none">
        <div className="mx-auto max-w-3xl min-h-full px-5 md:px-8 py-10 md:py-14">
          {/* Eyebrow terminal */}
          <p className="text-[11px] font-[family-name:var(--font-jetbrains-mono)] text-[#4ade80]">
            $ workana --hire eduardo-gouveia
          </p>

          {/* 1. Perfil + CTA acima da dobra */}
          <div className="mt-5 terminal-window">
            <TerminalHeader tone="gold" title="perfil — verificado na Workana" />
            <div className="p-5 md:p-7">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <img
                  src="/images/profile.webp"
                  alt="Eduardo Gouveia"
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#fbbf24]/50 shrink-0"
                />
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-white leading-tight">
                    Eduardo Gouveia
                  </h1>
                  <p className="text-white/55 text-sm mt-0.5">
                    Full Stack Sênior · Workana <span className="text-[#fbbf24] font-bold">HERO</span>
                  </p>
                  <p className="text-[12px] font-[family-name:var(--font-jetbrains-mono)] mt-1.5">
                    <span className="text-[#fbbf24] font-bold">★ {workanaStats.rating}/{workanaStats.ratingMax}</span>
                    <span className="text-white/40"> · {workanaStats.clientReviews} avaliações verificadas</span>
                  </p>
                </div>
                <div className="wk-cta shrink-0">
                  <WorkanaCtaButton location="workana_lp_top" label="CONTRATAR VIA WORKANA" />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Números */}
          <div className="mt-6 terminal-window">
            <TerminalHeader title="numeros.json" />
            <div className="p-5 md:p-6 grid grid-cols-2 md:grid-cols-3 gap-2.5 text-xs font-[family-name:var(--font-jetbrains-mono)]">
              {[
                { v: String(workanaStats.projectsCompleted), l: "projetos entregues" },
                { v: String(workanaStats.recurringClients), l: "clientes recontrataram" },
                { v: `${workanaStats.rating}/5`, l: `${workanaStats.clientReviews} avaliações` },
                { v: `Top ${workanaStats.overallRank}`, l: `geral entre ${workanaStats.totalProfessionals}` },
                { v: `Top ${workanaStats.peakRankITBrazil} BR · ${workanaStats.peakRankITGlobal} Global`, l: "pico em TI e Programação" },
                { v: workanaStats.level, l: `desde ${workanaStats.memberSince}` },
              ].map((s) => (
                <div key={s.l} className="bg-white/[0.03] rounded-lg p-3.5 border-l-2 border-white/10">
                  <div className="text-gradient-silver text-lg font-bold whitespace-nowrap">{s.v}</div>
                  <div className="text-white/55 mt-0.5 text-[10px]">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Cases com resultado — cards SEM link (beco sem saída) */}
          <p className="mt-10 mb-4 text-[10px] font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-[3px] text-white/40">
            // cases com resultado
          </p>
          <div className="space-y-3">
            {cases.map(({ id, tagline, result, project }) => (
              <div
                key={id}
                className="flex flex-col sm:flex-row gap-4 terminal-window p-4 md:p-5"
              >
                <span className="relative h-28 sm:h-20 sm:w-32 shrink-0 overflow-hidden rounded border border-white/[0.08]">
                  <Image
                    src={project!.cover ?? project!.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 92vw, 128px"
                    className="object-cover object-center opacity-85"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display font-bold text-white text-sm">
                    {project!.title}
                  </span>
                  <span className="block text-[11px] text-white/50 mt-1 leading-relaxed">{tagline}</span>
                  <span className="block text-[10px] font-[family-name:var(--font-jetbrains-mono)] text-[#4ade80] mt-2">
                    → {result}
                  </span>
                </span>
              </div>
            ))}
          </div>

          {/* 4. Avaliações (verbatim, com o projeto avaliado) */}
          <p className="mt-10 mb-4 text-[10px] font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-[3px] text-white/40">
            // avaliações verificadas
          </p>
          <div className="space-y-3">
            {reviews.map((tm) => (
              <div key={tm.author} className="terminal-window p-5">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="text-[#fbbf24] text-[11px]">{"★".repeat(tm.rating)}</div>
                  <div className="flex items-center gap-1 text-[8px] font-[family-name:var(--font-jetbrains-mono)] text-[#4ade80] bg-[#4ade80]/10 px-2 py-0.5 rounded border border-[#4ade80]/20">
                    <span className="w-1 h-1 rounded-full bg-[#4ade80]" />
                    VERIFICADO
                  </div>
                </div>
                <p className="text-white/55 text-[12px] leading-relaxed italic">
                  <span className="text-white/20">&ldquo;</span>
                  {tm.text}
                  <span className="text-white/20">&rdquo;</span>
                </p>
                <div className="mt-3 pt-3 border-t border-white/[0.06] text-[10px] font-[family-name:var(--font-jetbrains-mono)]">
                  <span className="text-white/55">— {tm.author}</span>
                  <span className="text-white/15"> · </span>
                  <span className="text-white/40">{tm.date}</span>
                  <span className="block text-[#60a5fa]/70 mt-1">{tm.project}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="wk-cta mt-4 text-center">
            <WorkanaLink
              location="workana_lp_reviews"
              className="text-[11px] font-[family-name:var(--font-jetbrains-mono)] text-white/50 hover:text-[#fbbf24] transition-colors"
            >
              ver todas as {workanaStats.clientReviews} avaliações →
            </WorkanaLink>
          </div>

          {/* 5. Como funciona */}
          <div className="mt-10 terminal-window">
            <TerminalHeader title="process.sh — como funciona" />
            <div className="p-5 md:p-6 space-y-4">
              {processSteps.map((s) => (
                <div key={s.n} className="flex gap-4 items-start">
                  <span className="text-[#4ade80] font-[family-name:var(--font-jetbrains-mono)] text-xs font-bold pt-0.5 shrink-0">
                    {s.n}
                  </span>
                  <div>
                    <div className="text-white text-sm font-bold">{s.title}</div>
                    <div className="text-white/50 text-[11px] mt-0.5">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Como fechamos — o que protege os dois lados */}
          <div className="mt-4 terminal-window">
            <TerminalHeader title="escopo.md — como fechamos" />
            <div className="p-5 md:p-6">
              <ul className="space-y-2.5">
                {scopeRules.map((r) => (
                  <li key={r} className="flex items-start gap-2 text-[12px] leading-relaxed text-white/60">
                    <span className="text-[#4ade80] shrink-0">▹</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 7. CTA final */}
          <div className="wk-cta mt-10 text-center">
            <WorkanaCtaButton
              location="workana_lp_bottom"
              label="CONTRATAR VIA WORKANA"
              sub="resposta no mesmo dia útil · pagamento protegido pela Workana"
            />
          </div>

          <div className="mt-12 pb-4 text-center text-[10px] font-[family-name:var(--font-jetbrains-mono)] text-white/25">
            Eduardo Gouveia · {workanaStats.projectsCompleted} projetos entregues na Workana ·{" "}
            {workanaStats.rating}/5 em {workanaStats.clientReviews} avaliações · nível {workanaStats.level}
          </div>
        </div>
      </main>
    </>
  );
}
