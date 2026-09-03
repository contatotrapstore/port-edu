"use client";

import { track } from "@vercel/analytics";
import { siteConfig } from "@/lib/constants";
import { getAttribution } from "@/lib/attribution";
import WorkanaLink from "@/components/workana/WorkanaLink";

/**
 * ÚNICO componente do site com canal de contato direto.
 *
 * Só pode ser importado em src/app/contratar e src/app/solucoes —
 * `scripts/check-workana-isolation.mjs` quebra o build se sair daí. A zona
 * Workana (/workana, cases, home) nunca expõe WhatsApp, e-mail ou telefone,
 * porque essas páginas circulam dentro de propostas da plataforma.
 *
 * O fluxo permitido é de fora para dentro: quem chega pelo site pode ser
 * convidado a fechar na Workana. O inverso, nunca.
 */

const PREFILL = (page: string, src?: string) =>
  `Olá Eduardo, vim pelo site (${page}${src ? ` · ${src}` : ""}).\n\n` +
  `Projeto: \n` +
  `Orçamento previsto: \n` +
  `Prazo desejado: `;

export default function DirectContact({
  page,
  compact = false,
}: {
  page: string;
  compact?: boolean;
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
  };

  const attr = typeof window === "undefined" ? undefined : getAttribution().src;

  return (
    <div className={compact ? "" : "terminal-window p-5 md:p-7"}>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {hasWhats && (
          <a
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(PREFILL(page, attr))}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onChannel("whatsapp")}
            className="group inline-flex items-center justify-center gap-2 h-12 px-7 rounded-lg bg-[#4ade80] text-black text-[13px] font-[family-name:var(--font-jetbrains-mono)] font-bold hover:bg-[#86efac] transition-colors shadow-[0_0_20px_rgba(74,222,128,0.25)]"
          >
            FALAR NO WHATSAPP
            <span aria-hidden className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        )}
        {hasEmail && (
          <a
            href={`mailto:${email}?subject=${encodeURIComponent(`Projeto via edevshub.com — ${page}`)}`}
            onClick={() => onChannel("email")}
            className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-lg border border-white/15 text-white/80 text-[12px] font-[family-name:var(--font-jetbrains-mono)] hover:bg-white/[0.06] hover:text-white transition-colors"
          >
            {email}
          </a>
        )}
      </div>

      {/* Caminho Workana — descrito com honestidade: o cliente publica o
          projeto (funciona em qualquer plano) e recebe a proposta. */}
      <p className="mt-4 text-center text-[11px] leading-relaxed text-white/45">
        Prefere pagamento protegido?{" "}
        <WorkanaLink
          location={`${page}_workana`}
          className="text-[#fbbf24] hover:underline"
        >
          Publique o projeto na Workana
        </WorkanaLink>{" "}
        e eu envio a proposta no mesmo dia útil — lá o valor fica em garantia e é
        liberado conforme cada etapa é entregue.
      </p>

      {!hasWhats && !hasEmail && (
        <p className="mt-3 text-center text-[11px] text-white/35">
          Canal direto sendo configurado — por ora, o caminho acima é o mais rápido.
        </p>
      )}
    </div>
  );
}
