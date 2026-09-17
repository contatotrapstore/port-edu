"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { isPixelBlocked } from "@/lib/pixel-blocklist";

/**
 * Meta Pixel (Dataset), carregado só onde faz sentido.
 *
 * Fora da /workana de propósito. Aquela página circula DENTRO de propostas da
 * plataforma: além de sujar o público do anúncio com tráfego que nunca vai
 * virar lead pago, é tracking de terceiro numa superfície que a Workana
 * enxerga. O guard do build reprova se um script da Meta aparecer lá.
 *
 * O ID fica literal aqui porque é público: sai no HTML e qualquer visitante o
 * lê no "ver código-fonte". Escondê-lo numa variável de ambiente não esconderia
 * nada e criaria um passo manual entre o deploy e o pixel funcionando.
 *
 * O que NÃO pode acontecer é o dataset receber evento de desenvolvimento ou de
 * preview: isso vira público de remarketing sujo e otimização em cima de tráfego
 * que nunca foi lead. Por isso o disparo é travado no domínio de produção, e a
 * checagem vive dentro do próprio script — assim o HTML renderizado é idêntico
 * em todo lugar e não existe divergência de hidratação.
 */

const PIXEL_ID = "2514954938991781";

/** Domínios onde o pixel realmente dispara. */
const HOSTS = ["www.edevshub.com", "edevshub.com"];

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[] };
  }
}

export default function MetaPixel() {
  const pathname = usePathname();
  const bloqueada = isPixelBlocked(pathname);

  // O App Router navega sem recarregar a página, então o PageView automático
  // do snippet só dispara uma vez. Sem isto, todo o funil depois do primeiro
  // clique fica invisível para a Meta.
  const primeira = useRef(true);
  useEffect(() => {
    if (!PIXEL_ID || bloqueada) return;
    if (primeira.current) {
      primeira.current = false;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname, bloqueada]);

  if (!PIXEL_ID || bloqueada) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`if(${JSON.stringify(HOSTS)}.indexOf(location.hostname)>-1){
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');
}`}
    </Script>
  );
}

/**
 * Dispara um evento padrão da Meta, se o pixel existir.
 *
 * Silencioso quando não existe: o site inteiro continua funcionando sem conta
 * de anúncio, e nenhum clique quebra por causa de um bloqueador.
 */
export function metaTrack(evento: string, dados?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", evento, dados);
}
