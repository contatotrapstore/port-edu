"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

/**
 * Link do menu que fecha o popover do mobile ao navegar. Âncoras da mesma
 * página não trocam de rota, então sem isso o menu ficaria aberto por cima do
 * capítulo de destino.
 */
export default function MenuLink({ onClick, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        const menu = event.currentTarget.closest("[popover]");
        if (menu instanceof HTMLElement && typeof menu.hidePopover === "function") {
          try {
            menu.hidePopover();
          } catch {
            // Já fechado (ou popover sem suporte): nada a fazer.
          }
        }
        onClick?.(event);
      }}
    />
  );
}
