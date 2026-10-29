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
  title: "Desenvolvimento de sites, apps e sistemas sob medida",
  description:
    `Contrate o desenvolvimento do seu site, app, plataforma ou sistema. Projetos a partir de R$ 3 mil, com escopo, prazo e valor definidos antes de começar. ${workanaStats.projectsCompleted} entregas, nota ${workanaStats.rating} em ${workanaStats.clientReviews} avaliações.`,
  alternates: { canonical: "/contratar" },
};

/** O comprador pode começar um projeto ou melhorar o que já existe. */
const necessidades = [
  {
    t: "Preciso de um site para meu negócio",
    d: "Site institucional, landing page ou loja virtual. Páginas que apresentam sua oferta e permitem ao visitante pedir um orçamento ou comprar.",
  },
  {
    t: "Quero desenvolver um app ou plataforma",
    d: "Um produto novo, uma área para clientes ou um sistema interno. Definimos as funções da primeira versão e o que pode ficar para uma próxima etapa.",
  },
  {
    t: "Quero melhorar o que já está funcionando",
    d: "Novas funções, correções ou integração entre ferramentas. Primeiro avalio o projeto existente e o que precisa mudar.",
  },
];

const faq = [
  {
    q: "Quanto custa?",
    a: "O investimento começa em R$ 3 mil para escopos iniciais delimitados. Pode ser um site, uma melhoria ou uma integração, conforme a complexidade. Uma plataforma com várias funções recebe um orçamento próprio. Definimos o que entra na primeira entrega e estimamos as próximas etapas separadamente. Atendimento com IA no WhatsApp começa em R$ 12 mil.",
  },
  {
    q: "O que entra na primeira entrega?",
    a: "As funções essenciais para você usar ou colocar a solução em operação, combinadas na proposta. Antes de começar, você recebe a lista do que será desenvolvido, as integrações previstas e os critérios de aceite. Funcionalidades futuras são avaliadas e orçadas à parte.",
  },
  {
    q: "Quanto tempo leva?",
    a: "O prazo de sites, apps, plataformas e sistemas depende do escopo e fica definido na proposta. Atendimento com IA: estimativa de 2 a 4 semanas. Integração entre sistemas: estimativa de 2 a 6 semanas. As estimativas são confirmadas após a análise. Projetos maiores são divididos em fases.",
  },
  {
    q: "Como funciona o pagamento?",
    a: "Contrato direto com nota fiscal e pagamento dividido em marcos combinados na proposta. Hospedagem, licenças e consumo de serviços externos são identificados separadamente, quando necessários ao projeto.",
  },
  {
    q: "E se o escopo mudar no meio?",
    a: "Escopo, prazo e critério de aceite ficam escritos antes de eu começar. Mudança vira extensão com prazo e valor combinados, nunca um ajuste silencioso que estoura a entrega.",
  },
  {
    q: "O que eu preciso ter pronto para começar?",
    a: "Conte o que quer criar ou melhorar, para quem é e qual investimento considera. Se tiver referências, um prazo desejado ou um projeto existente, envie também. Você não precisa ter equipe, telas prontas ou uma empresa já em operação para pedir um orçamento.",
  },
  {
    q: "Como funciona depois da entrega?",
    a: `Entrego com documentação e orientação gravada. As condições de suporte e correção ficam na proposta; novas funções e manutenção contínua são combinadas separadamente. ${workanaStats.recurringClients} clientes já me contrataram de novo.`,
  },
];

const naoServe = [
  // Piso real do Eduardo, confirmado em 20/09. Tem que bater com a menor
  // oferta publicada (integração, a partir de R$ 3 mil): se o corte for maior
  // que ela, existe faixa de orçamento que não cabe em lugar nenhum.
  "orçamento abaixo de R$ 3 mil",
  "pedido sem disponibilidade para alinhar o escopo e validar as entregas",
  "prazo que não comporta o desenvolvimento e a revisão do projeto",
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

  // No hero entra a tela que o comprador consegue LER de relance: tipografia
  // grande, status em português e a operação sob controle. Nada de zoom por
  // CSS aqui — ampliar 1280px de origem é o que deixava a arte borrada.
  const heroCase = projects.find((p) => p.id === "rei")!;
  // Mesmos projetos e capturas reais apresentados no carrossel C8. O resumo
  // permanece na landing para a prova não interromper o pedido de orçamento.
  const cases = [
    {
      id: "cacaostore",
      title: "Cacao Store",
      category: "Loja virtual em Shopify",
      image: "/images/projects/cacaostore-1.webp",
      width: 1280,
      height: 900,
      alt: "Página inicial da Cacao Store com navegação, busca e catálogo de produtos",
      description: "Loja personalizada para apresentar o catálogo e permitir compras online, com acesso pelo celular e computador.",
      features: ["Catálogo e checkout integrados", "Gestão de produtos e estoque pelo cliente"],
    },
    {
      id: "pace",
      title: "PACE",
      category: "Plataforma web para clínicas",
      image: "/images/projects/pace-5.webp",
      width: 1280,
      height: 671,
      alt: "Tela de protocolos do PACE, com busca, categorias e modelos de sessão",
      description: "Plataforma para organizar protocolos, conduzir sessões guiadas e acompanhar os pacientes.",
      features: ["Protocolos e sessões em um painel", "Acessos por perfil e relatórios clínicos"],
    },
    {
      id: "rei",
      title: "Rei Sol Infraestrutura",
      category: "Sistema de gestão de obras",
      image: "/images/lp/rei-painel.webp",
      width: 830,
      height: 517,
      alt: "Painel da Rei Sol com obras, andamento e detalhes de uma tarefa",
      description: "Sistema para acompanhar obras por etapas e organizar as responsabilidades da equipe.",
      features: ["Etapas, tarefas e responsáveis", "Prazos, dependências e notificações internas"],
    },
  ];

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

      <div id="topo" data-scroll-page className="lp">
        <LandingNav stayOnPage />

        {/* ───────── HERO: serviço, investimento e exemplo real ───────── */}
        <header className="lp-hero">
          <div className="lp-wrap lp-hero-grid">
            <div className="lp-hero-copy">
              <h1>
                Seu site, app ou sistema.
                <br />
                <span className="lp-hl">Desenvolvido sob medida.</span>
              </h1>
              <p className="lp-lede">
                Para começar um projeto ou melhorar o que você já tem. Definimos as
                funções essenciais da primeira entrega e as próximas etapas.
                Projetos a partir de <strong>R$ 3 mil</strong>, conforme o escopo,
                com prazo e valor combinados por escrito.
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
                    {workanaStats.projectsCompleted} projetos realizados · nota{" "}
                    {workanaStats.rating} em {workanaStats.clientReviews} avaliações
                    verificadas
                  </span>
                </p>
              </div>
            </div>

            <figure className="lp-hero-art">
              {/* Recorte da tela, feito uma vez no arquivo. Numa coluna de 400px
                  nenhuma captura de desktop é legível palavra por palavra: o que
                  precisa ler de longe é a estrutura (menu, linhas, status
                  coloridos), e para isso contraste vale mais que resolução. */}
              <span className="lp-hero-shot">
                <Image
                  src="/images/lp/rei-painel.webp"
                  alt={`${heroCase.title}: ${heroCase.headline}`}
                  width={830}
                  height={517}
                  priority
                  sizes="(max-width: 900px) 92vw, 480px"
                />
              </span>
              <figcaption>
                Sistema desenvolvido para a Rei Sol Infraestrutura: obras com etapas,
                responsáveis e prazos. Um exemplo do que posso construir para seu projeto.
              </figcaption>
            </figure>
          </div>
        </header>

        {/* ───────── NECESSIDADES: projetos novos e existentes ───────── */}
        <section className="lp-band">
          <div className="lp-wrap">
            <h2 className="lp-h2">O que você precisa criar ou melhorar?</h2>
            <div className="lp-sintomas">
              {necessidades.map((s, i) => (
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
            <h2 className="lp-h2">Desenvolvimento, integrações e automação</h2>
            <p className="lp-section-note">
              O ponto de partida é uma entrega que você possa usar. Escolhemos juntos
              as funções que resolvem a necessidade principal; as demais ficam em
              etapas com orçamento próprio.
            </p>
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
        <section id="cases" className="lp-band">
          <div className="lp-wrap">
            <h2 className="lp-h2">Sites, apps e plataformas que desenvolvi</h2>
            <div className="lp-cases">
              {cases.map((p) => (
                <article key={p.id} className="lp-case">
                  <span className="lp-case-img">
                    <Image
                      src={p.image}
                      alt={p.alt}
                      width={p.width}
                      height={p.height}
                      sizes="(max-width: 767px) 92vw, (max-width: 1119px) 30vw, 340px"
                      loading="lazy"
                    />
                  </span>
                  <div className="lp-case-body">
                    <h3>{p.title}</h3>
                    <p className="lp-case-out">{p.category}</p>
                    <p className="lp-case-head">{p.description}</p>
                    <ul className="lp-case-features">
                      {p.features.map((feature) => <li key={feature}>{feature}</li>)}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
            <p className="lp-more">
              Telas reais de projetos desenvolvidos por Eduardo Gouveia. Cada case
              teve seu próprio escopo; o investimento do seu projeto será definido
              pelas funções e integrações necessárias.
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
            <h2 className="lp-h2">Do pedido de orçamento à entrega do projeto</h2>
            <ol className="lp-steps">
              <li>
                <h3>Você conta o que quer desenvolver</h3>
                <p>Alinhamos a necessidade, o investimento e as funções essenciais da primeira entrega.</p>
              </li>
              <li>
                <h3>Recebe escopo, prazo e valor por escrito</h3>
                <p>Com o que entra nesta etapa, os critérios de aceite e o que pode vir depois.</p>
              </li>
              <li>
                <h3>Acompanha a construção</h3>
                <p>Você acompanha as etapas e valida as entregas combinadas na proposta.</p>
              </li>
              <li>
                <h3>Recebe e começa a usar</h3>
                <p>Documentação e orientação gravada. Suporte e evolução seguem as condições da proposta.</p>
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
        <section id="orcamento" className="lp-final">
          <div className="lp-wrap">
            <h2>Conte o que você quer criar ou melhorar</h2>
            <p>
              Conte o que precisa funcionar primeiro e qual investimento considera.
              Vamos definir uma entrega compatível com seu momento. Projetos a partir
              de R$ 3 mil, conforme o escopo; etapas seguintes são orçadas separadamente.
            </p>
            <DirectContact page="contratar_final" variant="final" />
          </div>
        </section>

        <footer className="lp-footer">
          <div className="lp-wrap">
            <span>© {new Date().getFullYear()} Eduardo Gouveia</span>
            <nav>
              <a href="#cases">Projetos desenvolvidos</a>
              <a href="#orcamento">Pedir orçamento</a>
              <Link href="/politica-de-privacidade">Privacidade</Link>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}
