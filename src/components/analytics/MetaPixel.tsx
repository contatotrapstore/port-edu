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
 * Sem NEXT_PUBLIC_META_PIXEL_ID o componente não renderiza nada: a página
 * funciona igual, e nenhuma requisição sai para a Meta. É assim que ele fica
 * no repositório antes de existir conta de anúncio.
 */

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

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
      {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');`}
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
