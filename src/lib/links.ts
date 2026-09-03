import { workanaStats } from "@/lib/constants";

/** URL do perfil Workana. Todo link de saída passa por aqui. */
export function workanaHref(): string {
  return workanaStats.workanaProfileUrl;
}

/**
 * Link interno para a página comercial, carregando a origem do clique.
 * Usado só fora da zona Workana (a /workana não linka nada interno).
 */
export function contratarHref(source: string): string {
  return `/contratar?src=${encodeURIComponent(source)}`;
}
