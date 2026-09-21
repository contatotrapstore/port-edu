import Link from "next/link";
import { portfolioWorkanaStats as stats } from "@/lib/constants";
import { serviceCases, services, type ServicePage } from "@/lib/services";
import { siteUrl } from "@/lib/site";
import WorkanaLink from "@/components/workana/WorkanaLink";
import ServiceShell from "./ServiceShell";
import ServiceCaseCard from "./ServiceCaseCard";

export default function ServiceDetail({ service }: { service: ServicePage }) {
  const url = `${siteUrl}/servicos/${service.slug}`;
  const related = services.filter((item) => item.slug !== service.slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": url, url, name: service.metadataTitle, description: service.metadataDescription, inLanguage: "pt-BR" },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Serviços", item: `${siteUrl}/servicos` },
          { "@type": "ListItem", position: 3, name: service.name, item: url },
        ],
      },
    ],
  };
  const ctaClass = "inline-flex min-h-12 items-center justify-center rounded-lg bg-[#fbbf24] px-5 py-3 text-center text-[15px] font-semibold text-black transition-colors hover:bg-[#fcd34d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#fbbf24]";

  return (
    <ServiceShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav aria-label="Caminho da página" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm leading-relaxed text-white/55">
        <Link href="/" className="py-1 hover:text-white">Início</Link><span aria-hidden="true">/</span>
        <Link href="/servicos" className="py-1 hover:text-white">Serviços</Link><span aria-hidden="true">/</span>
        <span aria-current="page" className="text-white/85">{service.name}</span>
      </nav>

      <header className="max-w-4xl pb-10 pt-8 md:pb-14 md:pt-12">
        <h1 className="font-display text-[clamp(2.15rem,5.4vw,4.25rem)] font-semibold leading-[1.09] tracking-[-0.035em] text-white">{service.title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/75">{service.intro}</p>
        <div className="mt-7 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
          <WorkanaLink location={`service_${service.slug}_hero`} className={ctaClass}>Ver meu perfil na Workana <span className="ml-2" aria-hidden="true">↗</span></WorkanaLink>
          <a href="#escopo" className="min-h-11 py-3 text-[15px] text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-[#4ade80]">Explorar exemplos de escopo</a>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-white/15 py-5 text-sm leading-relaxed text-white/70">
        <p><strong className="font-semibold text-white">Eduardo Gouveia</strong> · Full Stack Sênior</p>
        <p className="text-[#fbbf24]">Workana {stats.level}</p>
        <p>{stats.projectsCompleted} projetos realizados</p>
        <p className="text-white/50">Perfil conferido em {stats.verifiedAtLabel}</p>
      </div>

      <section className="grid gap-8 py-12 md:grid-cols-[1.1fr_1fr] md:gap-14 md:py-16" aria-labelledby="necessidade-heading">
        <div>
          <h2 id="necessidade-heading" className="font-display text-2xl font-semibold leading-snug md:text-3xl">{service.fitTitle}</h2>
          <ul className="mt-6 space-y-4 text-base leading-relaxed text-white/75">
            {service.fit.map((item) => <li key={item} className="flex gap-3"><span aria-hidden="true" className="text-[#4ade80]">—</span><span>{item}</span></li>)}
          </ul>
        </div>
        <div className="border-l-2 border-[#4ade80]/45 pl-5 md:pl-7">
          <h3 className="text-lg font-semibold leading-snug text-white">{service.decisionTitle}</h3>
          <p className="mt-4 text-base leading-relaxed text-white/75">{service.decision}</p>
        </div>
      </section>

      <section id="escopo" className="scroll-mt-6 border-t border-white/15 py-12 md:py-16" aria-labelledby="escopo-heading">
        <h2 id="escopo-heading" className="max-w-3xl font-display text-2xl font-semibold leading-snug md:text-3xl">{service.scopeTitle}</h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/65">Estes são exemplos de entregas e critérios de aceite. A proposta define quais entram no seu projeto e como serão conferidos.</p>
        <div className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {service.scopeExamples.map((example) => (
            <article key={example.title} className="border-t border-white/10 pt-5">
              <h3 className="text-lg font-semibold text-white">{example.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-white/75">{example.description}</p>
              <p className="mt-4 text-[15px] leading-relaxed text-white/65"><span className="font-medium text-[#4ade80]">Exemplo de aceite: </span>{example.acceptance}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-white/15 py-12 md:py-16" aria-labelledby="case-heading">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div><p className="mb-2 text-sm text-[#4ade80]">Do portfólio</p><h2 id="case-heading" className="font-display text-2xl font-semibold md:text-3xl">Uma solução relacionada.</h2></div>
          <Link href="/projetos" className="py-2 text-[15px] text-white/75 underline underline-offset-4 hover:text-white">Ver todos os projetos</Link>
        </div>
        <ServiceCaseCard project={serviceCases[service.caseId]} featured />
      </section>

      <section className="border-t border-white/15 py-12 md:py-16" aria-labelledby="etapas-heading">
        <h2 id="etapas-heading" className="font-display text-2xl font-semibold md:text-3xl">Como organizo o trabalho.</h2>
        <ol className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {service.process.map((step, index) => (
            <li key={step.title}>
              <span className="font-mono text-sm text-[#4ade80]" aria-hidden="true">0{index + 1}</span>
              <h3 className="mt-3 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/70">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-white/15 py-12 md:py-16" aria-labelledby="duvidas-heading">
        <h2 id="duvidas-heading" className="font-display text-2xl font-semibold md:text-3xl">Antes de definir o projeto.</h2>
        <div className="mt-6 max-w-4xl divide-y divide-white/15 border-y border-white/15">
          {service.questions.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="cursor-pointer pr-3 text-base font-medium leading-relaxed text-white/90 marker:text-[#4ade80] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4ade80]">{item.question}</summary>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/70">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-[#4ade80]/25 bg-[#4ade80]/[0.035] p-6 md:p-9" aria-labelledby="brief-heading">
        <h2 id="brief-heading" className="max-w-3xl font-display text-2xl font-semibold leading-snug md:text-3xl">{service.briefTitle}</h2>
        <p className="mt-4 text-base leading-relaxed text-white/70">Para começar a conversa pela Workana, vale reunir:</p>
        <ul className="mt-4 space-y-2 text-base leading-relaxed text-white/75">{service.brief.map((item) => <li key={item} className="flex gap-3"><span aria-hidden="true" className="text-[#4ade80]">✓</span><span>{item}</span></li>)}</ul>
        <WorkanaLink location={`service_${service.slug}_bottom`} className={`${ctaClass} mt-7`}>Ver meu perfil na Workana <span className="ml-2" aria-hidden="true">↗</span></WorkanaLink>
        <p className="mt-3 text-sm leading-relaxed text-white/60">Se já estamos conversando pela plataforma, envie o contexto no mesmo chat.</p>
      </section>

      <section className="pt-12 md:pt-16" aria-labelledby="outros-heading">
        <h2 id="outros-heading" className="font-display text-xl font-semibold">Seu projeto tem outra necessidade?</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {related.map((item) => <Link key={item.slug} href={`/servicos/${item.slug}`} className="group rounded-lg border border-white/15 p-5 transition-colors hover:border-[#4ade80]/50 focus-visible:outline-2 focus-visible:outline-[#4ade80]"><h3 className="text-lg font-semibold text-white group-hover:text-[#4ade80]">{item.name} <span aria-hidden="true">→</span></h3><p className="mt-2 text-[15px] leading-relaxed text-white/65">{item.indexDescription}</p></Link>)}
        </div>
      </section>
    </ServiceShell>
  );
}
