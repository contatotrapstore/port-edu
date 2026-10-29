/**
 * Dimensões das imagens de projeto em public/images/projects, para o
 * next/image reservar a proporção certa (variam de 1280×418 a 1280×1095).
 * Gerado a partir dos arquivos; ao trocar ou incluir uma imagem, atualizar.
 */
const sizes: Record<string, [number, number]> = {
  "/images/projects/anamex-1.webp": [1280, 579],
  "/images/projects/anamex-2.webp": [1280, 574],
  "/images/projects/anamex-3.webp": [1280, 574],
  "/images/projects/anamex-4.webp": [1280, 560],
  "/images/projects/anamex-5.webp": [1280, 418],
  "/images/projects/anamex.webp": [1280, 579],
  "/images/projects/blackinbot.webp": [1280, 800],
  "/images/projects/cacaostore-1.webp": [1280, 900],
  "/images/projects/cacaostore-2.webp": [1280, 900],
  "/images/projects/cacaostore-3.webp": [1280, 900],
  "/images/projects/cacaostore.webp": [1280, 1000],
  "/images/projects/ciliosclick.webp": [1280, 800],
  "/images/projects/click.webp": [1280, 853],
  "/images/projects/clinafy-1.webp": [1280, 800],
  "/images/projects/clinafy-2.webp": [1280, 800],
  "/images/projects/clinafy.webp": [1280, 800],
  "/images/projects/clubeazul.webp": [1280, 800],
  "/images/projects/connote-1.webp": [1280, 676],
  "/images/projects/connote-2.webp": [1280, 669],
  "/images/projects/connote-3.webp": [1280, 643],
  "/images/projects/connote.webp": [1280, 676],
  "/images/projects/corpxbank.webp": [1280, 800],
  "/images/projects/direcao.webp": [1280, 800],
  "/images/projects/focus.webp": [1280, 800],
  "/images/projects/kdelojab.webp": [1280, 800],
  "/images/projects/mudapaisagens.webp": [1280, 800],
  "/images/projects/neuroialab-1.webp": [1280, 677],
  "/images/projects/neuroialab-2.webp": [1280, 637],
  "/images/projects/neuroialab-3.webp": [1280, 638],
  "/images/projects/neuroialab.webp": [1280, 677],
  "/images/projects/neuroone-1.webp": [1280, 802],
  "/images/projects/neuroone-2.webp": [1280, 638],
  "/images/projects/neuroone-3.webp": [1280, 1007],
  "/images/projects/neuroone-4.webp": [1280, 731],
  "/images/projects/neuroone-5.webp": [1280, 638],
  "/images/projects/neuroone.webp": [1280, 802],
  "/images/projects/pace-1.webp": [1280, 638],
  "/images/projects/pace-2.webp": [1280, 1095],
  "/images/projects/pace-3.webp": [1280, 691],
  "/images/projects/pace-4.webp": [1280, 638],
  "/images/projects/pace-5.webp": [1280, 671],
  "/images/projects/pace-6.webp": [1280, 1095],
  "/images/projects/pace.webp": [1280, 691],
  "/images/projects/passagenseuropa.webp": [1280, 800],
  "/images/projects/paylink.webp": [1280, 800],
  "/images/projects/rei.webp": [1280, 800],
  "/images/projects/revix.webp": [1280, 800],
  "/images/projects/tap.webp": [1280, 800],
  "/images/projects/wesleymods.webp": [1280, 800],
  "/images/projects/woodsuperfoods.webp": [1280, 800],
};

export function projectImageSize(src: string): { width: number; height: number } {
  const [width, height] = sizes[src] ?? [1280, 800];
  return { width, height };
}
