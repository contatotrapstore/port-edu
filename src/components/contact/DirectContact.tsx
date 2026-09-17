"use client";

import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";
import { siteConfig } from "@/lib/constants";
import { getAttribution } from "@/lib/attribution";
import { metaTrack } from "@/components/analytics/MetaPixel";
import WorkanaLink from "@/components/workana/WorkanaLink";

/**
 * ÚNICO componente do site com canal de contato direto.
 *
 * Só pode ser importado em src/app/contratar e src/app/solucoes —
 * `scripts/check-workana-isolation.mjs` quebra o build se sair daí. A zona
 * Workana (/workana, cases, home) nunca expõe WhatsApp, e-mail ou telefone,
 * porque essas páginas circulam dentro de propostas da plataforma.
 *
 * Um pedido por tela: o WhatsApp é o botão, o resto é texto de apoio. Dois
 * CTAs com o mesmo peso viram zero CTA.
 */

const PREFILL = (page: string, src?: string) =>
  `Olá Eduardo, vim pelo site (${page}${src ? ` · ${src}` : ""}).\n\n` +
  `O que está travando hoje: \n` +
  `Sistemas que já uso: \n` +
  `Prazo e orçamento previsto: `;

export default function DirectContact({
  page,
  variant = "final",
}: {
  page: string;
  /** hero = CTA compacto no topo; final = bloco centralizado de fechamento. */
  variant?: "hero" | "final";
}) {
  const { whatsapp, email } = siteConfig.social;
  const hasWhats = Boolean(whatsapp);
  const hasEmail = Boolean(email);

  const onChannel = (channel: string) => {
    const { src, ref } = getAttribution();
    track("contato_direto", {
      channel,
      ...(src ? { src } : ref ? { ref } : { page }),
    });
    // "Contact" é o evento padrão da Meta para "alguém iniciou conversa com o
    // negócio". Padrão, e não custom, porque só os padrão entram na lista de
    // eventos priorizados que o iOS exige e servem de objetivo de campanha.
    metaTrack("Contact", { content_name: page, channel });
  };

  // Lido depois da hidratação, de propósito. Se fosse durante o render, o
  // servidor renderizaria sem atribuição, o cliente teria que bater com esse
  // HTML e a origem nunca chegaria ao link: a conversa do WhatsApp é onde o
  // lead é lido de verdade, e ela não carrega UTM nenhuma.
  const [attr, setAttr] = useState<string | undefined>(undefined);
  useEffect(() => setAttr(getAttribution().src), []);

  return (
    <div className={variant === "hero" ? "lp-cta lp-cta-hero" : "lp-cta lp-cta-final"}>
      <div className="lp-cta-row">
        {hasWhats && (
          <a
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(PREFILL(page, attr))}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onChannel("whatsapp")}
            className="lp-btn"
          >
            Falar no WhatsApp agora
          </a>
        )}

        {!hasWhats && (
          <WorkanaLink location={`${page}_workana`} className="lp-btn">
            Ver perfil e contratar
          </WorkanaLink>
        )}

        {hasEmail && (
          <a
            href={`mailto:${email}?subject=${encodeURIComponent(`Projeto via edevshub.com (${page})`)}`}
            onClick={() => onChannel("email")}
            className="lp-btn-ghost"
          >
            Prefiro por e-mail
          </a>
        )}
      </div>

      {/* A mesma frase em cima e embaixo da página vira ruído: no topo a nota
          tira o risco de clicar, no fim ela diz o que escrever. */}
      <p className="lp-cta-note">
        {variant === "hero" ? (
          <>
            Resposta no mesmo dia útil.{" "}
            {hasWhats ? (
              <>
                Prefere pagamento retido até aceitar cada etapa?{" "}
                <WorkanaLink location={`${page}_workana`} className="lp-cta-alt">
                  contrate pela Workana
                </WorkanaLink>
                .
              </>
            ) : (
              workanaNote
            )}
          </>
        ) : (
          <>
            Escreva o volume por mês e quais sistemas já existem: com essas duas
            respostas eu já devolvo faixa de preço e prazo.
          </>
        )}
      </p>
    </div>
  );
}

const workanaNote =
  "O pagamento fica retido na plataforma e só é liberado conforme você aceita cada entrega.";
