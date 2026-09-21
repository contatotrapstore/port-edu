import type { Metadata } from "next";
import Image from "next/image";
import { testimonials, portfolioWorkanaStats as workanaStats } from "@/lib/constants";
import TerminalHeader from "@/components/TerminalHeader";
import WorkanaLink from "@/components/workana/WorkanaLink";
import WorkanaScreenPreview from "@/components/workana/WorkanaScreenPreview";
import { portfolioOgImage } from "@/lib/portfolio-metadata";

/**
 * Credenciais para o percurso Workana. Links somente para o perfil na
 * plataforma ou para seções desta página. Imagens também são inspecionadas:
 * não exibir endereços, contatos ou atalhos para contratação externa.
 * scripts/check-workana-isolation.mjs mantém o isolamento no build.
 */
export const metadata: Metadata = {
  title: "Sistemas e integrações — Eduardo Gouveia | Workana",
  description: `Sistemas sob medida, SaaS e integrações. Eduardo Gouveia, HERO na Workana: ${workanaStats.projectsCompleted} projetos realizados e ${workanaStats.clientReviews} avaliações. Conheça os projetos e o processo de trabalho.`,
  robots: { index: false, follow: false },
  alternates: { canonical: "/workana", languages: {} },
  openGraph: { title: "Eduardo Gouveia — Sistemas e integrações", description: "Conheça os projetos e o processo de trabalho. Contratação pela Workana.", url: "/workana", images: [portfolioOgImage] },
  twitter: { card: "summary_large_image", title: "Eduardo Gouveia — Sistemas e integrações", description: "Projetos e processo de trabalho. Contratação pela Workana.", images: [portfolioOgImage.url] },
};

const cases = [
  {
    id: "mudapaisagens",
    name: "Muda Paisagens",
    category: "Automação e atendimento",
    title: "Qualificação de leads com registro no CRM.",
    description:
      "Fluxo de pré-atendimento com IA: responde novos leads, conduz perguntas de qualificação e registra as informações no Pipefy, usando o Make como integrador.",
    details: ["Perguntas estruturadas", "Registro no Pipefy", "Integração via Make"],
    screen: {
      src: "/images/projects/mudapaisagens.webp",
      alt: "Fluxo de qualificação de leads da Muda Paisagens no Make",
      caption: "Etapas do fluxo de qualificação configurado no Make.",
      crop: { x: 304, y: 96, width: 698, height: 468 },
    },
  },
  {
    id: "passagenseuropa",
    name: "Passagens Europa",
    category: "Sistema de gestão",
    title: "Atendimento e operação comercial no mesmo CRM.",
    description:
      "CRM sob medida que reúne leads, funil de atendimento, cotações, financeiro e comissões. Os módulos acompanham as etapas da operação comercial.",
    details: ["Funil de atendimento", "Cotações e vendas", "Financeiro e comissões"],
    screen: {
      src: "/images/projects/passagenseuropa.webp",
      alt: "Quadro do funil de atendimento do CRM Passagens Europa",
      caption: "Visão do funil de atendimento e dos módulos do CRM.",
      crop: { x: 230, y: 97, width: 829, height: 510 },
    },
  },
  {
    id: "clinafy",
    name: "Clinafy",
    category: "Plataforma SaaS",
    title: "Prontuário, agenda e teleconsulta para saúde mental.",
    description:
      "Plataforma para profissionais e clínicas de saúde mental, com prontuário eletrônico, agendamento, teleconsulta e gestão financeira. Inclui área do paciente e recursos de IA para documentação.",
    details: ["Prontuário eletrônico", "Agenda e teleconsulta", "Área do paciente"],
    screen: null,
  },
];

// Texto íntegro e projeto identificado: cada avaliação mantém seu contexto.
const featuredReviewAuthors = [
  "Arthur Versolato",
  "Fernando Esteves",
  "Useconvoo",
  "Leonardo Flores",
  "José Ricardo Silva de Sousa",
];

const processSteps = [
  {
    title: "Entender o projeto",
    description: "Você explica o objetivo, o que já existe e as ferramentas usadas. Confirmamos as informações que faltam para definir a entrega.",
  },
  {
    title: "Combinar o escopo",
    description: "Registramos entregáveis, prazo, valor e critérios de aceite no chat da Workana antes do desenvolvimento.",
  },
  {
    title: "Acompanhar as etapas",
    description: "Organizamos o desenvolvimento em entregas para você acompanhar e validar. Mudanças de escopo são combinadas antes de executar.",
  },
  {
    title: "Validar a entrega",
    description: "Conferimos o que foi entregue com os critérios acordados. Documentação, ajustes e suporte ficam definidos na proposta.",
  },
];

const profileCtaClassName = "wk-cta inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-[#fbbf24] px-5 py-3 text-center text-[15px] font-semibold leading-snug text-black transition-colors hover:bg-[#fcd34d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#fbbf24]";

export default function WorkanaLandingPage() {
  const reviews = featuredReviewAuthors.flatMap((author) => {
    const review = testimonials.find((item) => item.author === author);
    return review ? [review] : [];
  });
  const rating = workanaStats.rating.toLocaleString("pt-BR");

  return (
    <>
      <div
        aria-hidden="true"
        className="wk-backdrop pointer-events-none fixed inset-0 z-0 bg-cover bg-center opacity-10 mix-blend-screen"
        style={{ backgroundImage: "url(/textures/hero-grid.webp)" }}
      />
      <main className="wk-main fixed inset-0 z-10 overflow-y-auto overflow-x-hidden scrollbar-none">
        <div className="mx-auto min-h-full max-w-5xl px-5 pb-10 pt-7 sm:px-8 md:pt-12">
          <header className="flex items-center gap-3">
            <Image
              src="/images/profile.webp"
              alt=""
              width={48}
              height={48}
              priority
              className="h-12 w-12 rounded-full border border-[#fbbf24]/40 object-cover"
            />
            <div>
              <p className="font-display text-base font-semibold text-white">Eduardo Gouveia</p>
              <p className="text-sm text-white/65">Full Stack Sênior · <span className="text-[#fbbf24]">Workana HERO</span></p>
            </div>
          </header>

          <section className="border-b border-white/15 pb-8 pt-7 md:pb-10 md:pt-10" aria-labelledby="workana-title">
            <h1 id="workana-title" className="max-w-3xl font-display text-[clamp(2rem,5.2vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.035em] text-white">
              Sistemas sob medida e integrações para organizar sua operação.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
              Desenvolvo plataformas SaaS, painéis de gestão e automações conectadas às ferramentas que sua empresa já usa. O projeto começa com escopo e entregas definidos.
            </p>
            <p className="mt-5 text-[15px] leading-relaxed text-white/75">
              <strong className="font-semibold text-white">{workanaStats.projectsCompleted} projetos realizados</strong>
              {" · "}<span className="text-[#fbbf24]">★ {rating}/5</span>
              {" em "}{workanaStats.clientReviews} avaliações na Workana
            </p>
            <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
              <WorkanaLink location="workana_lp_top" className={profileCtaClassName}>
                Ver meu perfil na Workana <span aria-hidden="true">↗</span>
              </WorkanaLink>
              <a href="#projetos" className="wk-cta py-2 text-[15px] text-[#4ade80] underline decoration-[#4ade80]/40 underline-offset-4 hover:decoration-[#4ade80] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4ade80]">
                Conhecer os projetos
              </a>
            </div>
          </section>

          <section id="projetos" className="scroll-mt-6 pt-8 md:pt-10" aria-labelledby="projects-heading">
            <h2 id="projects-heading" className="font-display text-2xl font-semibold text-white md:text-3xl">Projetos para necessidades diferentes.</h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/70">
              Integração comercial, gestão da operação e produto SaaS. Veja o que cada solução reúne.
            </p>
            <div className="mt-6 space-y-6">
              {cases.map((project) => (
                <article key={project.id} className="terminal-window overflow-hidden">
                  <TerminalHeader title={project.name} />
                  <div className={`p-5 md:p-7 ${project.screen ? "grid gap-6 md:grid-cols-[1fr_1.08fr] md:items-center" : "max-w-3xl"}`}>
                    <div>
                      <p className="text-sm font-medium text-[#4ade80]">{project.category}</p>
                      <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-white md:text-2xl">{project.title}</h3>
                      <p className="mt-3 text-base leading-relaxed text-white/75">{project.description}</p>
                      <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-white/70">
                        {project.details.map((detail) => (
                          <li key={detail} className="flex gap-2">
                            <span className="text-[#4ade80]" aria-hidden="true">✓</span>{detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {project.screen && <WorkanaScreenPreview {...project.screen} />}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="pt-10 md:pt-14" aria-labelledby="process-heading">
            <h2 id="process-heading" className="font-display text-2xl font-semibold text-white md:text-3xl">Você sabe o que está contratando.</h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/70">Escopo por escrito e entregas que você consegue acompanhar, do primeiro alinhamento à validação.</p>
            <ol className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {processSteps.map((step, index) => (
                <li key={step.title} className="flex gap-4 border-t border-white/15 pt-5">
                  <span className="pt-0.5 font-mono text-sm text-[#4ade80]" aria-hidden="true">0{index + 1}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                    <p className="mt-2 text-base leading-relaxed text-white/70">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 border-l-2 border-[#4ade80]/60 pl-4 text-[15px] leading-relaxed text-white/75">
              Se a necessidade mudar, revisamos prazo e valor juntos. O combinado fica registrado na Workana.
            </p>
          </section>

          <section className="pt-10 md:pt-14" aria-labelledby="reviews-heading">
            <h2 id="reviews-heading" className="font-display text-2xl font-semibold text-white md:text-3xl">O que os clientes dizem.</h2>
            <p className="mt-3 text-base leading-relaxed text-white/70">Avaliações da Workana, identificadas pelo projeto a que se referem.</p>
            <div className="mt-6 space-y-4">
              {reviews.map((review) => (
                <figure key={review.author} className="terminal-window p-5 md:p-6">
                  <p className="text-sm tracking-wider text-[#fbbf24]" aria-label={`Nota ${review.rating} de 5`}>{"★".repeat(review.rating)}</p>
                  <blockquote className="mt-3 text-base leading-relaxed text-white/80">“{review.text}”</blockquote>
                  <figcaption className="mt-4 border-t border-white/10 pt-4 text-[15px] leading-relaxed">
                    <p className="font-semibold text-white">{review.author} <span className="font-normal text-white/60">· {review.date}</span></p>
                    <p className="mt-1 text-white/65">{review.project}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
            <WorkanaLink location="workana_lp_reviews" className="wk-cta mt-5 inline-block py-2 text-[15px] text-[#4ade80] underline decoration-[#4ade80]/40 underline-offset-4 hover:decoration-[#4ade80] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4ade80]">
              Conferir as avaliações no meu perfil ↗
            </WorkanaLink>
          </section>

          <section className="mt-10 border-y border-white/15 py-8 md:mt-14 md:py-10" aria-labelledby="contact-heading">
            <h2 id="contact-heading" className="max-w-2xl font-display text-2xl font-semibold leading-snug text-white md:text-3xl">O que você precisa construir ou melhorar?</h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/75">Me conte o objetivo, o que já existe e as ferramentas que utiliza. Com esse contexto, avalio o caminho técnico e as entregas possíveis.</p>
            <WorkanaLink location="workana_lp_bottom" className={`${profileCtaClassName} mt-6`}>
              Ver meu perfil na Workana <span aria-hidden="true">↗</span>
            </WorkanaLink>
            <p className="mt-3 text-sm leading-relaxed text-white/60">Se já estamos conversando pela plataforma, pode responder no mesmo chat.</p>
          </section>

          <footer className="pt-6 text-sm leading-relaxed text-white/55">
            <p>Eduardo Gouveia · Full Stack Sênior · Workana HERO</p>
            <p className="mt-1">Dados do perfil conferidos em {workanaStats.verifiedAtLabel}.</p>
            <p className="mt-1">Pico histórico em TI e Programação: Top {workanaStats.peakRankITBrazil} no Brasil e Top {workanaStats.peakRankITGlobal} global.</p>
          </footer>
        </div>
      </main>
    </>
  );
}
