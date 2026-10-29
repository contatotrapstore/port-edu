import Image from "next/image";
import type { ServiceCase } from "@/lib/services";
import { projectImageSize } from "./project-images";

/**
 * O `sizes` recebido é a largura da moldura; a imagem dentro dela é maior
 * (width / crop.width). Sem escalar, o navegador baixa uma versão menor que a
 * exibida e o recorte fica borrado.
 */
function scaleSizes(sizes: string, factor: number) {
  return sizes
    .split(",")
    .map((entry) => {
      const match = entry.trim().match(/^(\(.+?\))\s+(.+)$/);
      const [media, length] = match ? [`${match[1]} `, match[2]] : ["", entry.trim()];
      return `${media}calc(${length.replace(/^calc/, "")} * ${factor.toFixed(3)})`;
    })
    .join(", ");
}

/**
 * Recorte de uma captura existente (mesmas coordenadas da página atual): só
 * a parte que descreve o produto, sem números promocionais nem contatos.
 */
export default function ServiceCrop({ project, sizes }: { project: ServiceCase; sizes: string }) {
  const { crop } = project;
  const { width, height } = projectImageSize(project.image);
  return (
    <div
      className="edh-crop"
      // Recorte pequeno não é ampliado além do tamanho original.
      style={{ aspectRatio: `${crop.width} / ${crop.height}`, maxWidth: crop.width < 600 ? `${crop.width}px` : undefined }}
    >
      <Image
        src={project.image}
        alt={project.imageAlt}
        width={width}
        height={height}
        sizes={scaleSizes(sizes, width / crop.width)}
        style={{
          width: `${(width / crop.width) * 100}%`,
          left: `${(-crop.x / crop.width) * 100}%`,
          top: `${(-crop.y / crop.height) * 100}%`,
        }}
      />
    </div>
  );
}
