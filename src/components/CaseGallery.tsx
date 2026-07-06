"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";

/**
 * Real-screenshot gallery for case studies: main image + thumbnail strip +
 * fullscreen lightbox (Esc / arrows / click-outside; focus returned on close).
 * Shared by the case modal and the /projetos/[id] page.
 */
export default function CaseGallery({ images, title }: { images: string[]; title: string }) {
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement>(null);

  const next = useCallback(() => setIdx((i) => (i + 1) % images.length), [images.length]);
  const prev = useCallback(
    () => setIdx((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      openerRef.current?.focus();
    };
  }, [open, next, prev]);

  if (!images.length) return null;

  return (
    <LazyMotion features={domAnimation} strict>
    <div>
      <div className="text-[10px] font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-[2px] mb-2 text-[#c0c0c0]">
        &gt; telas do projeto:
      </div>

      {/* Main image */}
      <button
        ref={openerRef}
        onClick={() => setOpen(true)}
        aria-label="Ampliar imagem"
        className="group relative block w-full aspect-[16/10] overflow-hidden rounded-lg border border-white/[0.08] bg-[#0d0d0d] cursor-zoom-in"
      >
        <Image
          key={images[idx]}
          src={images[idx]}
          alt={`${title} — tela ${idx + 1}`}
          fill
          sizes="(max-width: 768px) 92vw, 640px"
          className="object-cover object-top"
        />
        <span className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 rounded bg-black/60 px-2 py-1 text-[10px] font-[family-name:var(--font-jetbrains-mono)] text-white/75 opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 className="h-3 w-3" /> ampliar
        </span>
        <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-[10px] font-[family-name:var(--font-jetbrains-mono)] text-white/75">
          {idx + 1}/{images.length}
        </span>
      </button>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setIdx(i)}
              aria-label={`Tela ${i + 1}`}
              aria-current={i === idx}
              className={`relative h-14 w-24 shrink-0 overflow-hidden rounded border transition-all ${
                i === idx
                  ? "border-[#4ade80]/60 opacity-100"
                  : "border-white/[0.08] opacity-50 hover:opacity-80"
              }`}
            >
              <Image src={src} alt="" fill sizes="96px" className="object-cover object-top" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {open && (
          <m.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label={`Galeria de ${title}`}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Fechar galeria"
              className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  aria-label="Anterior"
                  className="absolute left-3 md:left-6 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  aria-label="Próxima"
                  className="absolute right-3 md:right-6 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
            <m.div
              key={images[idx]}
              className="relative h-full w-full max-w-6xl"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[idx]}
                alt={`${title} — tela ${idx + 1} ampliada`}
                className="h-full w-full object-contain"
              />
            </m.div>
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded bg-black/70 px-3 py-1 text-[11px] font-[family-name:var(--font-jetbrains-mono)] text-white/80">
              {idx + 1} / {images.length}
            </span>
          </m.div>
        )}
      </AnimatePresence>
    </div>
    </LazyMotion>
  );
}
