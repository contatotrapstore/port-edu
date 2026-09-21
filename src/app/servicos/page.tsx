import type { Metadata } from "next";
import Link from "next/link";
import ServiceShell from "@/components/services/ServiceShell";
import ServiceCaseCard from "@/components/services/ServiceCaseCard";
import WorkanaLink from "@/components/workana/WorkanaLink";
import { portfolioOgImage } from "@/lib/portfolio-metadata";
import { serviceCases, services } from "@/lib/services";
import { siteUrl } from "@/lib/site";

const title = "Sistemas sob medida, integrações e SaaS | Eduardo Gouveia";
const description = "Conheça os serviços de desenvolvimento de Eduardo Gouveia: sistemas de gestão, integrações e automações, plataformas SaaS e evolução de produtos existentes.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/servicos", languages: {} },
  openGraph: { type: "website", locale: "pt_BR", url: "/servicos", title, description, images: [portfolioOgImage] },
  twitter: { card: "summary_large_image", title, description, images: [portfolioOgImage.url] },
};

export default function ServicesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${siteUrl}/servicos`, url: `${siteUrl}/servicos`, name: title, description, inLanguage: "pt-BR" },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Início", item: siteUrl }, { "@type": "ListItem", position: 2, name: "Serviços", item: `${siteUrl}/servicos` }] },
    ],
  };
  return (
    <ServiceShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav aria-label="Caminho da página" className="flex items-center gap-2 text-sm text-white/55"><Link href="/" className="py-1 hover:text-white">Início</Link><span aria-hidden="true">/</span><span aria-current="page" className="text-white/85">Serviços</span></nav>
      <header className="max-w-4xl pb-12 pt-9 md:pb-16 md:pt-12">
        <p className="text-[15px] text-[#4ade80]">Eduardo Gouveia · Full Stack Sênior</p>
        <h1 className="mt-4 font-display text-[clamp(2.25rem,5.4vw,4.25rem)] font-semibold leading-[1.09] tracking-[-0.035em]">Sistemas sob medida, integrações e plataformas SaaS.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/75">Construo sistemas sob medida, conecto ferramentas e desenvolvo plataformas SaaS. Também atuo na evolução de produtos existentes. O formato do trabalho depende do que precisa funcionar na sua operação.</p>
      </header>

      <section aria-labelledby="servicos-heading" className="border-t border-white/15 pt-10">
        <h2 id="servicos-heading" className="font-display text-2xl font-semibold md:text-3xl">Por onde faz sentido começar?</h2>
        <div className="mt-7 space-y-4">
          {services.map((service) => <Link key={service.slug} href={`/servicos/${service.slug}`} className="group grid gap-4 rounded-xl border border-white/15 bg-white/[0.025] p-6 transition-colors hover:border-[#4ade80]/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4ade80] sm:grid-cols-[0.75fr_1fr_auto] sm:items-center md:p-8"><h3 className="font-display text-xl font-semibold text-white group-hover:text-[#4ade80] md:text-2xl">{service.name}</h3><p className="max-w-2xl text-base leading-relaxed text-white/70">{service.indexDescription}</p><span aria-hidden="true" className="text-2xl text-[#4ade80]">→</span></Link>)}
        </div>
      </section>

      <section className="grid gap-6 border-b border-white/15 py-12 md:grid-cols-[0.75fr_1fr] md:gap-14 md:py-16" aria-labelledby="decisao-heading">
        <h2 id="decisao-heading" className="font-display text-2xl font-semibold leading-snug md:text-3xl">Ainda não sabe se precisa construir ou integrar?</h2>
        <div className="space-y-4 text-base leading-relaxed text-white/75"><p>Comece pela tarefa que está difícil hoje. Se as ferramentas atendem a operação, mas não trocam informações, uma integração pode ser o ponto de partida. Se o processo precisa de regras e controles próprios, faz sentido avaliar um sistema sob medida.</p><p>Quando outras pessoas vão usar o software como um produto, o escopo também precisa considerar a jornada de uso, os acessos e o que entra na primeira versão. Posso avaliar esse caminho com base no contexto do projeto.</p></div>
      </section>

      <section className="py-12 md:py-16" aria-labelledby="cases-heading">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-sm text-[#4ade80]">Do portfólio</p><h2 id="cases-heading" className="font-display text-2xl font-semibold md:text-3xl">Três exemplos para explorar.</h2></div><Link href="/projetos" className="py-2 text-[15px] text-white/75 underline underline-offset-4 hover:text-white">Ver o portfólio completo</Link></div>
        <div className="grid gap-5 md:grid-cols-3">{["passagenseuropa", "mudapaisagens", "clinafy"].map((id) => <ServiceCaseCard key={id} project={serviceCases[id]} />)}</div>
      </section>

      <section className="rounded-xl border border-[#4ade80]/25 bg-[#4ade80]/[0.035] p-6 md:p-9" aria-labelledby="conversa-heading">
        <h2 id="conversa-heading" className="font-display text-2xl font-semibold leading-snug md:text-3xl">Me conte o que precisa funcionar.</h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/75">Descreva o objetivo, o que já existe e quais ferramentas sua empresa usa. Com esse contexto, avalio a abordagem técnica e o que precisa ser definido para uma proposta.</p>
        <WorkanaLink location="services_index_contact" className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#fbbf24] px-5 py-3 text-center text-[15px] font-semibold text-black hover:bg-[#fcd34d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#fbbf24]">Ver meu perfil na Workana <span aria-hidden="true">↗</span></WorkanaLink>
        <p className="mt-3 text-sm leading-relaxed text-white/60">O perfil reúne meu histórico na plataforma. Se já estamos em contato por lá, envie o contexto no mesmo chat.</p>
      </section>
    </ServiceShell>
  );
}
