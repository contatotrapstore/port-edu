"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Ambient AI-generated backdrop layered over the opaque 3D canvas with
 * `mix-blend-screen` (dark areas vanish, only the glowing grid/particles add depth).
 *  - Static texture: always on (cheap, global depth), softened under reduced-motion.
 *  - Animated loop: desktop + motion-ok only, and only while the hero is active,
 *    so it never pulls focus from content in the inner sections.
 */
export default function AmbientBackdrop({ heroActive }: { heroActive: boolean }) {
  const [capable, setCapable] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setCapable(
      window.matchMedia("(min-width: 768px)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (heroActive) v.play().catch(() => {});
    else v.pause();
  }, [heroActive, capable]);

  return (
    <div aria-hidden className="fixed inset-0 z-0 pointer-events-none">
      <div
        className="absolute inset-0 bg-cover bg-center mix-blend-screen opacity-25 motion-reduce:opacity-15"
        style={{ backgroundImage: "url(/textures/hero-grid.webp)" }}
      />
      {capable && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover mix-blend-screen transition-opacity duration-1000"
          style={{ opacity: heroActive ? 0.45 : 0 }}
          src="/video/hero-loop.mp4"
          muted
          loop
          playsInline
          preload="metadata"
        />
      )}
    </div>
  );
}
