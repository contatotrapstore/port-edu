/**
 * Rotas que nunca podem carregar pixel de anúncio, por prefixo.
 *
 * Mora num módulo próprio porque o guard do build lê ESTE arquivo. O pixel é
 * injetado pelo `next/script` no cliente, então ele não existe no HTML
 * pré-renderizado e nenhuma checagem por regex no HTML conseguiria vê-lo: a
 * única verificação possível em tempo de build é sobre a fonte.
 *
 * Se alguém tirar "/workana" daqui, `scripts/check-workana-isolation.mjs`
 * quebra o deploy.
 */
export const PIXEL_BLOCKED_PREFIXES = ["/workana"];

export function isPixelBlocked(pathname: string) {
  return PIXEL_BLOCKED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}
