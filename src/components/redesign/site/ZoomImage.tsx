"use client";

import "./image-viewer.css";
import Image from "next/image";
import { useId, useRef, useState } from "react";

/** Native modal retains Esc, focus containment and focus restoration. */
export default function ZoomImage({ src, alt, width, height, sizes, priority = false, en = false }: {
  src: string; alt: string; width: number; height: number; sizes: string; priority?: boolean; en?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();
  const [actual, setActual] = useState(false);
  return <>
    <a className="edh-image-open" href={src} target="_blank" rel="noopener noreferrer" onClick={(event) => {
      if (!dialog.current?.showModal || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault(); setActual(false); dialog.current.showModal();
    }} aria-label={`${en ? "Enlarge" : "Ampliar"}: ${alt}`}>
      <Image src={src} alt={alt} width={width} height={height} sizes={sizes} priority={priority} />
      <span className="edh-image-open-label" aria-hidden="true">↗ {en ? "Explore image" : "Explorar imagem"}</span>
    </a>
    <dialog ref={dialog} className="edh-image-dialog" aria-labelledby={id}>
      <header>
        <h2 id={id}>{alt}</h2>
        <button type="button" aria-pressed={actual} onClick={() => setActual(!actual)}>{actual ? (en ? "Fit" : "Ajustar") : "100%"}</button>
        <form method="dialog"><button autoFocus>{en ? "Close" : "Fechar"} ×</button></form>
      </header>
      <div className={`edh-image-scroll${actual ? " is-actual" : ""}`} tabIndex={0} aria-label={en ? "Image; scroll to explore" : "Imagem; role para explorar"}>
        {/* Original pixels: avoids the low-resolution responsive thumbnail in the viewer. */}
        <Image src={src} alt={alt} width={width} height={height} unoptimized style={actual ? { width, maxWidth: "none" } : undefined} />
      </div>
      <p>{width} × {height} px · {en ? "Original capture. Pinch to zoom on your phone." : "Captura original. Use o gesto de pinça no celular."}</p>
    </dialog>
  </>;
}
