"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Signature cursor: a terminal block-caret that trails the pointer with a soft lag
 * and grows over interactive elements. Desktop fine-pointer only; disabled under
 * prefers-reduced-motion. The native cursor stays visible (accessibility first).
 */
export default function TerminalCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && motionOk);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    let x = -100;
    let y = -100;
    let cx = -100;
    let cy = -100;
    let hover = false;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = e.target as HTMLElement | null;
      hover = !!t?.closest?.('a,button,[role="button"],input,textarea');
    };

    const tick = () => {
      cx += (x - cx) * 0.16;
      cy += (y - cy) * 0.16;
      el.style.transform = `translate3d(${cx + 14}px, ${cy + 6}px, 0) scale(${hover ? 1.5 : 1})`;
      el.style.opacity = hover ? "0.9" : "0.45";
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[90]"
      style={{ willChange: "transform", opacity: 0 }}
    >
      <div className="w-[9px] h-[16px] bg-[#4ade80] cursor-blink" />
    </div>
  );
}
