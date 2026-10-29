"use client";

import type { SyntheticEvent } from "react";
import { track } from "@vercel/analytics";
import { siteConfig } from "@/lib/constants";
import { compactAttribution, getAttribution } from "@/lib/attribution";
import { safeContactAttribution, whatsappHref } from "@/lib/contact-attribution";
import { metaTrackCustom } from "@/components/analytics/MetaPixel";
import WorkanaLink from "@/components/workana/WorkanaLink";

/**
 * ÚNICO componente do site com canal de contato direto.
 *
 * Só pode ser importado nas rotas /contratar, /en/contratar e /solucoes —
 * `scripts/check-workana-isolation.mjs` quebra o build se sair daí. A zona
 * Workana (/workana, cases, home) nunca expõe WhatsApp, e-mail ou telefone,
 * porque essas páginas circulam dentro de propostas da plataforma.
 *
 * Um pedido por tela: o WhatsApp é o botão, o resto é texto de apoio. Dois
 * CTAs com o mesmo peso viram zero CTA.
 */

const labels = {
  pt: {
    whatsapp: "Pedir orçamento pelo WhatsApp",
    workana: "Ver perfil e contratar",
    email: "Prefiro por e-mail",
    heroNote: "Conte seu projeto para receber uma avaliação inicial.",
    finalNote:
      "Conte o que deseja desenvolver, para quem é e qual investimento considera. Eu retorno com os próximos passos para preparar seu orçamento.",
  },
  en: {
    whatsapp: "Request a quote on WhatsApp",
    workana: "See the profile and hire",
    email: "I prefer email",
    heroNote: "Tell us about your project to receive an initial assessment.",
    finalNote:
      "Tell us what you want to build, who it is for and what budget you have in mind. I will reply with the next steps to prepare your quote.",
  },
};

export default function DirectContact({
  page,
  variant = "final",
  locale = "pt",
}: {
  page: string;
  /** hero = CTA compacto no topo; final = bloco centralizado de fechamento. */
  variant?: "hero" | "final";
  /** Textos e mensagem do WhatsApp; a /contratar em português é o padrão. */
  locale?: "pt" | "en";
}) {
  const text = labels[locale];
  const { whatsapp, email } = siteConfig.social;
  const hasWhats = Boolean(whatsapp);
  const hasEmail = Boolean(email);
  const isHiringPage = page.startsWith("contratar");

  const onChannel = (channel: "whatsapp" | "email") => {
    const attribution = safeContactAttribution(getAttribution());
    // These events measure opening a channel. A conversation and its sales
    // stage are recorded separately after the person actually contacts us.
    try {
      track(`${channel}_click`, {
        location: page,
        attribution: compactAttribution(attribution),
      });
    } catch {
      // Analytics must never prevent someone from opening their contact app.
    }
    try {
      metaTrackCustom(channel === "whatsapp" ? "WhatsAppClick" : "EmailClick", {
        content_name: page,
        ...attribution,
      });
    } catch {
      // Browser extensions may block the pixel independently of Vercel.
    }
  };

  // The SSR link already works without JavaScript. Resolve first-touch data
  // on interaction so hydration stays deterministic; keep native navigation,
  // keyboard, middle-click and copy-link behavior (no popup/window.open).
  const prepareWhatsApp = (event: SyntheticEvent<HTMLAnchorElement>) => {
    event.currentTarget.href = whatsappHref(whatsapp, page, getAttribution(), locale);
  };

  return (
    <div className={variant === "hero" ? "lp-cta lp-cta-hero" : "lp-cta lp-cta-final"}>
      <div className="lp-cta-row">
        {hasWhats && (
          <a
            href={whatsappHref(whatsapp, page, {}, locale)}
            target="_blank"
            rel="noopener noreferrer"
            onFocus={prepareWhatsApp}
            onPointerDown={prepareWhatsApp}
            onContextMenu={prepareWhatsApp}
            onClick={(event) => {
              prepareWhatsApp(event);
              onChannel("whatsapp");
            }}
            onAuxClick={(event) => {
              if (event.button !== 1) return;
              prepareWhatsApp(event);
              onChannel("whatsapp");
            }}
            className="lp-btn"
          >
            {text.whatsapp}
          </a>
        )}

        {!hasWhats && !isHiringPage && (
          <WorkanaLink location={`${page}_workana`} className="lp-btn">
            {text.workana}
          </WorkanaLink>
        )}

        {hasEmail && (
          <a
            href={`mailto:${email}?subject=${encodeURIComponent(`Projeto via edevshub.com (${page})`)}`}
            onClick={() => onChannel("email")}
            className="lp-btn-ghost"
          >
            {text.email}
          </a>
        )}
      </div>

      {/* A mesma frase em cima e embaixo da página vira ruído: no topo a nota
          tira o risco de clicar, no fim ela diz o que escrever. */}
      <p className="lp-cta-note">
        {variant === "hero" ? (
          <>
            {text.heroNote}{" "}
            {!isHiringPage && (hasWhats ? (
              <>
                Prefere pagamento retido até aceitar cada etapa?{" "}
                <WorkanaLink location={`${page}_workana`} className="lp-cta-alt">
                  contrate pela Workana
                </WorkanaLink>
                .
              </>
            ) : (
              workanaNote
            ))}
          </>
        ) : (
          <>{text.finalNote}</>
        )}
      </p>
    </div>
  );
}

const workanaNote =
  "O pagamento fica retido na plataforma e só é liberado conforme você aceita cada entrega.";
