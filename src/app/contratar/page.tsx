import type { Metadata } from "next";
import "./landing.css";
import Link from "next/link";
import Image from "next/image";
import { offers, projects, testimonials, workanaStats } from "@/lib/constants";
import { siteUrl } from "@/lib/site";
import LandingNav from "@/components/contratar/LandingNav";
import DirectContact from "@/components/contact/DirectContact";

/**
 * Landing de conversão para tráfego pago (Google Ads e Meta Ads).
 *
 * É a ÚNICA superfície do site com canal de contato direto, junto de
 * /solucoes/*. Nunca circula dentro de propostas da Workana — aquela zona é a
 * /workana, e o script de build impede que as duas se misturem.
 *
 * Decisões de design: um acento só (verde = canal direto; o dourado continua
 * sendo a cor da Workana no resto do site), motion contido porque Core Web
 * Vitals viram Quality Score, e prova visual com os mockups reais dos cases.
 */

export const metadata: Metadata = {
  title: "Desenvolvedor full stack sênior: sistemas sob medida e automação com IA",
  description:
    `Automação de atendimento com IA, integração entre os sistemas que você já usa e SaaS sob medida. Escopo fechado por escrito antes de começar. ${workanaStats.projectsCompleted} entregas, nota ${workanaStats.rating} em ${workanaStats.clientReviews} avaliações.`,
  alternates: { canonical: "/contratar" },
};

/** Sintomas que o comprador reconhece antes de saber o nome da solução. */
const sintomas = [
  {
    t: "O lead chega às 22h e responde ninguém",
    d: "No dia seguinte ele já falou com outro. Você só descobre quando olha o relatório do mês.",
  },
  {
    t: "Dois sistemas guardam a mesma informação",
    d: "E alguém passa a manhã reconciliando os dois na mão, todo dia, sem nunca terminar.",
  },
  {
    t: "A regra do negócio mora na cabeça de uma pessoa",
    d: "Quando ela tira férias, a operação trava. Quando ela sai, some junto.",
  },
];

const faq = [
  {
    q: "Quanto custa?",
    a: "Integração e painel começam em R$ 6 mil. Automação de atendimento com IA, em R$ 12 mil. SaaS do zero, em R$ 28 mil. Na primeira conversa eu digo em qual faixa o seu caso cai, e falo na hora se ele não couber.",
  },
  {
    q: "Quanto tempo leva?",
    a: "Automação de atendimento: 2 a 4 semanas. Integração e painel: 2 a 6 semanas. SaaS: 6 semanas até a primeira versão que você já usa de verdade. Projetos maiores viram fases, com entrega ao fim de cada uma.",
  },
  {
    q: "Como funciona o pagamento?",
    a: "Contrato direto com nota fiscal, dividido em marcos: entrada, meio e entrega. Ou pela Workana, onde o valor fica retido e é liberado conforme cada etapa é aceita. A taxa da plataforma já entra no preço que eu passo.",
  },
  {
    q: "E se o escopo mudar no meio?",
    a: "Escopo, prazo e critério de aceite ficam escritos antes de eu começar. Mudança vira extensão com prazo e valor combinados, nunca um ajuste silencioso que estoura a entrega.",
  },
  {
    q: "O que eu preciso ter pronto para começar?",
    a: "O problema em uma frase e duas respostas: qual o volume (conversas, pedidos ou usuários por mês) e quais sistemas já existem. Telas e regras a gente fecha junto, isso é parte do trabalho.",
  },
  {
    q: "Você some depois de entregar?",
    a: `Entrego com documentação e handover gravado. ${workanaStats.recurringClients} clientes já me contrataram de novo, quase sempre para a fase seguinte do mesmo sistema.`,
  },
];

const naoServe = [
  "site institucional, landing page ou loja de prateleira",
  "orçamento abaixo de R$ 5 mil",
  "template pronto ou no-code montado às pressas",
  "sistema do zero para entregar em menos de duas semanas",
];

export default function ContratarPage() {
  // Trecho, nao resumo: cada recorte sai palavra por palavra da avaliacao
  // original, que segue integral na /workana e no perfil da plataforma.
  const recortes: Record<string, string> = {
    "Fernando Esteves":
      "Tenho mais de 20 anos trabalhando com projetos web e poucas vezes encontrei profissionais como Eduardo.",
    Useconvoo:
      "Demonstrou domínio total de infraestrutura e agilidade para resolver problemas complexos de sincronia de ambientes e performance.",
    "Arthur Versolato":
      "Entendeu rápido o que estávamos precisando e propôs boas melhorias ao projeto.",
  };
  const reviews = Object.keys(recortes)
    .map((a) => testimonials.find((tm) => tm.author === a))
    .filter(Boolean) as typeof testimonials;

  // No hero entra a tela que o comprador consegue LER (o fluxo de qualificação
  // rodando), não a capa mais bonita. Clinafy carrega o número maior e por isso
  // abre a fileira de cases logo abaixo.
  const heroCase = projects.find((p) => p.id === "mudapaisagens")!;
  const cases = ["clinafy", "blackinbot", "rei"]
    .map((id) => projects.find((p) => p.id === id)!)
    .filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        name: "Eduardo Gouveia — desenvolvimento de software sob medida",
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

      <div data-scroll-page className="lp">
        <LandingNav />

        {/* ───────── HERO: split assimétrico, dor + promessa ───────── */}
        <header className="lp-hero">
          <div className="lp-wrap lp-hero-grid">
            <div className="lp-hero-copy">
              <h1>
                Sua operação cresceu.
                <br />
                <span className="lp-hl">Seus sistemas, não.</span>
              </h1>
              <p className="lp-lede">
                Atendimento com IA que responde sozinho, integração entre o que você já
                usa, ou o SaaS que falta lançar. Escopo e prazo fechados por escrito
                antes de começar.
              </p>

              <div className="lp-hero-cta">
                <DirectContact page="contratar_topo" variant="hero" />
              </div>

              <div className="lp-hero-proof">
                <Image
                  src="/images/profile.webp"
                  alt=""
                  width={44}
                  height={44}
                  className="lp-avatar"
                  priority
                />
                <p>
                  <strong>Eduardo Gouveia</strong>
                  <span>
                    {workanaStats.projectsCompleted} sistemas entregues · nota{" "}
                    {workanaStats.rating} em {workanaStats.clientReviews} avaliações
                    verificadas
                  </span>
                </p>
              </div>
            </div>

            <figure className="lp-hero-art">
              {/* O mockup vem com muita moldura preta: fora do enquadramento a
                  tela some e sobra estúdio. O corte é no CSS, não no arquivo. */}
              <span className="lp-hero-shot">
                <Image
                  src={heroCase.cover ?? heroCase.image}
                  alt={`${heroCase.title}: ${heroCase.headline}`}
                  width={1280}
                  height={800}
                  priority
                  sizes="(max-width: 900px) 92vw, 460px"
                />
              </span>
              <figcaption>
                Muda Paisagens: o lead chega no WhatsApp, a IA qualifica pelas perguntas
                que a equipe fazia na mão e o Pipefy recebe tudo registrado.
              </figcaption>
            </figure>
          </div>
        </header>

        {/* ───────── SINTOMAS: três colunas de texto puro, sem card ───────── */}
        <section className="lp-band">
          <div className="lp-wrap">
            <h2 className="lp-h2">Se algum destes acontece toda semana, é software faltando</h2>
            <div className="lp-sintomas">
              {sintomas.map((s, i) => (
                <article key={s.t}>
                  <span className="lp-num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── OFERTAS: linhas largas, não cards iguais ───────── */}
        <section id="solucoes" className="lp-band lp-band-alt">
          <div className="lp-wrap">
            <h2 className="lp-h2">Três formas de resolver, com prazo e faixa desde a primeira conversa</h2>
            <div className="lp-offers">
              {offers.map((o) => (
                <article key={o.id} className="lp-offer">
                  <div className="lp-offer-head">
                    <h3>{o.name}</h3>
                    <p className="lp-offer-meta">
                      <span className="lp-price">{o.range}</span>
                      <span className="lp-sep" aria-hidden="true" />
                      <span>{o.term}</span>
                    </p>
                  </div>
                  <p className="lp-offer-promise">{o.promise}</p>
                  <ul className="lp-offer-scope">
                    {o.scope.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="lp-offer-not">Não serve para {o.notFor}.</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── CASES: grid com imagem grande + resultado ───────── */}
        <section className="lp-band">
          <div className="lp-wrap">
            <h2 className="lp-h2">Sistemas que já estão rodando</h2>
            <div className="lp-cases">
              {cases.map((p) => (
                <Link key={p.id} href={`/projetos/${p.id}`} className="lp-case">
                  <span className="lp-case-img">
                    <Image
                      src={p.cover ?? p.image}
                      alt=""
                      width={640}
                      height={400}
                      sizes="(max-width: 900px) 92vw, 380px"
                      loading="lazy"
                    />
                  </span>
                  <span className="lp-case-body">
                    <strong>{p.title}</strong>
                    <span className="lp-case-head">{p.headline}</span>
                    {p.output?.[0] && <span className="lp-case-out">{p.output[0]}</span>}
                  </span>
                </Link>
              ))}
            </div>
            <p className="lp-more">
              <Link href="/projetos">
                Ver os {projects.filter((p) => p.overview).length} cases documentados
              </Link>
            </p>
          </div>
        </section>

        {/* ───────── DEPOIMENTOS: citação larga, ritmo diferente ───────── */}
        <section className="lp-band lp-band-alt">
          <div className="lp-wrap">
            <h2 className="lp-h2">O que dizem os clientes que já pagaram por isso</h2>
            <div className="lp-quotes">
              {reviews.map((tm) => (
                <blockquote key={tm.author}>
                  <p>{recortes[tm.author] ?? tm.text}</p>
                  <footer>
                    <strong>{tm.author}</strong>
                    <span>
                      {tm.project} · {tm.date}
                    </span>
                  </footer>
                </blockquote>
              ))}
            </div>
            <p className="lp-more">
              Avaliações verificadas na Workana, onde o cliente só avalia depois de pagar.
            </p>
          </div>
        </section>

        {/* ───────── PROCESSO: timeline horizontal ───────── */}
        <section className="lp-band">
          <div className="lp-wrap">
            <h2 className="lp-h2">Do primeiro contato até o sistema no ar</h2>
            <ol className="lp-steps">
              <li>
                <h3>Você descreve o problema</h3>
                <p>Respondo no mesmo dia útil com as perguntas que definem o escopo.</p>
              </li>
              <li>
                <h3>Recebe escopo, prazo e valor por escrito</h3>
                <p>Com os marcos de pagamento e o critério de aceite de cada entrega.</p>
              </li>
              <li>
                <h3>Acompanha a construção</h3>
                <p>Updates constantes: você vê cada etapa, não só o resultado final.</p>
              </li>
              <li>
                <h3>Recebe com documentação e suporte</h3>
                <p>Handover gravado, e eu continuo por perto para a fase seguinte.</p>
              </li>
            </ol>
          </div>
        </section>

        {/* ───────── DESQUALIFICAÇÃO + FAQ: duas colunas ───────── */}
        <section className="lp-band lp-band-alt">
          <div className="lp-wrap lp-faq-grid">
            <div className="lp-nao">
              <h2 className="lp-h2">Quando eu digo não</h2>
              <ul>
                {naoServe.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
              <p>
                Prefiro dizer isso na primeira mensagem a descobrir no meio do projeto.
              </p>
            </div>

            <div className="lp-faq">
              {faq.map((f) => (
                <details key={f.q} name="faq">
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── CTA FINAL ───────── */}
        <section className="lp-final">
          <div className="lp-wrap">
            <h2>Me conte o que está travando a sua operação</h2>
            <p>
              Você recebe uma resposta no mesmo dia útil, com as perguntas certas e a
              faixa de preço do seu caso. Sem proposta genérica e sem reunião para
              descobrir o óbvio.
            </p>
            <DirectContact page="contratar_final" variant="final" />
          </div>
        </section>

        <footer className="lp-footer">
          <div className="lp-wrap">
            <span>© {new Date().getFullYear()} Eduardo Gouveia</span>
            <nav>
              <Link href="/">Portfólio</Link>
              <Link href="/projetos">Cases</Link>
              <Link href="/politica-de-privacidade">Privacidade</Link>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}
