"use client";

import type { ReactNode } from "react";
import { track } from "@vercel/analytics";
import { workanaHref } from "@/lib/links";
import { getAttribution } from "@/lib/attribution";

/**
 * Único caminho de saída para a Workana em todo o site.
 *
 * Centralizar aqui garante que nenhum link fique sem evento (cinco estavam) e
 * que toda saída carregue a atribuição da sessão. Se aparecer um `<a>` para
 * workana.com fora deste componente, é regressão.
 */
export default function WorkanaLink({
  location,
  className,
  children,
  onClick,
}: {
  location: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <a
      href={workanaHref()}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => {
        const { src, ref } = getAttribution();
        // O Vercel Analytics grava poucas propriedades por evento — mandamos
        // só as duas que decidem canal.
        track("workana_cta", { location, ...(src ? { src } : ref ? { ref } : {}) });
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}
