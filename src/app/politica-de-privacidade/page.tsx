import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/constants";
import CaseHeader from "@/components/CaseHeader";

/**
 * Exigência da LGPD a partir do momento em que o site coleta contato — e
 * requisito prático do Google Ads, se um dia a /contratar virar destino de
 * campanha.
 */

export const metadata: Metadata = {
  title: "Política de privacidade",
  description:
    "Como os dados enviados por WhatsApp, e-mail ou navegação em edevshub.com são tratados, por quanto tempo e quais são os seus direitos.",
  alternates: { canonical: "/politica-de-privacidade" },
};

export default function PoliticaPage() {
  const contato = siteConfig.social.email || "pelo canal indicado na página de contratação";

  return (
    <div className="min-h-screen">
      <CaseHeader source="politica" />
      <main className="mx-auto max-w-3xl px-5 md:px-8 py-10 md:py-14">
        <h1 className="font-display text-3xl font-bold text-white tracking-tight">
          Política de privacidade
        </h1>
        <p className="mt-2 text-[12px] font-[family-name:var(--font-jetbrains-mono)] text-white/40">
          Última atualização: setembro de 2026
        </p>

        <div className="mt-8 space-y-7 text-[14.5px] leading-relaxed text-white/65 max-w-[68ch]">
          <section>
            <h2 className="font-display text-lg font-bold text-white mb-2">Quem trata os dados</h2>
            <p>
              Eduardo Gouveia, desenvolvedor full stack autônomo, responsável pelo site
              edevshub.com. O contato para assuntos de privacidade é {contato}.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-white mb-2">
              Que dados são coletados
            </h2>
            <p>
              <b className="text-white/85">Os que você envia.</b> Ao iniciar uma conversa por
              WhatsApp ou e-mail, você compartilha o que escrever na mensagem — normalmente
              nome, contato e a descrição do projeto. Nada além disso é solicitado.
            </p>
            <p className="mt-3">
              <b className="text-white/85">Dados de navegação.</b> O site usa o Vercel Analytics,
              que mede páginas vistas e cliques sem cookies e sem identificar visitantes
              individualmente. Não há remarketing nem perfilamento.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-white mb-2">Para que são usados</h2>
            <p>
              Exclusivamente para responder ao seu contato, elaborar proposta e, se houver
              contratação, executar o projeto. A base legal é a execução de contrato ou os
              procedimentos preliminares a ele, conforme o art. 7º da LGPD.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-white mb-2">Com quem compartilho</h2>
            <p>
              Com ninguém para fins comerciais. Os dados ficam nas ferramentas usadas para
              atender você — WhatsApp, provedor de e-mail e, quando a contratação acontece pela
              plataforma, a própria Workana, cada um sob a política do respectivo serviço. Não
              vendo nem cedo dados a terceiros.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-white mb-2">Por quanto tempo</h2>
            <p>
              Conversas que não viram projeto são descartadas em até 12 meses. Dados de projetos
              contratados são mantidos pelo prazo legal de guarda fiscal e contratual.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-white mb-2">Seus direitos</h2>
            <p>
              Você pode pedir a qualquer momento confirmação do tratamento, acesso, correção,
              anonimização, portabilidade ou exclusão dos seus dados, além de revogar o
              consentimento. Basta pedir pelo mesmo canal em que falamos — respondo em até 15
              dias.
            </p>
          </section>
        </div>

        <div className="mt-12 pb-4">
          <Link
            href="/contratar"
            className="text-[12px] font-[family-name:var(--font-jetbrains-mono)] text-white/50 hover:text-[#4ade80] transition-colors"
          >
            ← voltar para contratação
          </Link>
        </div>
      </main>
    </div>
  );
}
