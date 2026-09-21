"use client";

import Image from "next/image";
import { useId, useRef } from "react";

type ScreenCrop = { x: number; y: number; width: number; height: number };

type Props = {
  src: string;
  alt: string;
  caption: string;
  crop: ScreenCrop;
};

/**
 * Recorte visual de telas reais já existentes, sem recriar sua interface.
 * A ampliação permanece na página e usa o MESMO recorte inspecionado.
 */
export default function WorkanaScreenPreview({ src, alt, caption, crop }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  const screen = (expanded: boolean) => (
    <div
      className="relative overflow-hidden bg-[#f5f5f5]"
      style={{ aspectRatio: `${crop.width} / ${crop.height}`, ...(expanded ? { minWidth: 820 } : {}) }}
    >
      <Image
        src={src}
        alt={alt}
        width={1280}
        height={800}
        sizes={expanded ? "1280px" : "(max-width: 767px) 720px, 900px"}
        className="absolute h-auto"
        style={{
          maxWidth: "none",
          width: `${(1280 / crop.width) * 100}%`,
          left: `${(-crop.x / crop.width) * 100}%`,
          top: `${(-crop.y / crop.height) * 100}%`,
        }}
      />
    </div>
  );

  return (
    <figure className="min-w-0">
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-haspopup="dialog"
        aria-label={`Ampliar: ${alt}`}
        className="block w-full cursor-zoom-in overflow-hidden rounded-lg border border-white/15 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4ade80]"
      >
        {screen(false)}
        <span className="flex items-center justify-between gap-3 bg-[#111713] px-4 py-3 text-[15px] text-[#4ade80]">
          Ampliar tela <span aria-hidden="true">⤢</span>
        </span>
      </button>
      <figcaption className="mt-3 text-[15px] leading-relaxed text-white/65">{caption}</figcaption>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
        className="fixed left-1/2 top-1/2 m-0 max-h-[90dvh] w-[calc(100vw-2rem)] max-w-5xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-white/20 bg-[#0a0c0b] p-0 text-white shadow-2xl backdrop:bg-black/90"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/15 p-4 sm:p-5">
          <div>
            <h3 id={titleId} className="text-base font-semibold">{alt}</h3>
            <p className="mt-1 text-sm leading-relaxed text-white/65">Role para os lados para ver os detalhes da tela.</p>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="min-h-11 shrink-0 rounded-md border border-white/25 px-3 text-sm hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4ade80]"
          >
            Fechar
          </button>
        </div>
        <div className="overflow-auto" tabIndex={0} role="region" aria-label="Tela ampliada, com rolagem horizontal">
          {screen(true)}
        </div>
        <p className="p-4 text-[15px] leading-relaxed text-white/70 sm:p-5">{caption}</p>
      </dialog>
    </figure>
  );
}
