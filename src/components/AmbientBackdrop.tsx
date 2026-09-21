"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const desktopQuery = "(min-width: 768px)";
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeCapability(onChange: () => void) {
  const queries = [desktopQuery, reducedMotionQuery].map((query) => window.matchMedia(query));
  queries.forEach((query) => query.addEventListener("change", onChange));
  return () => queries.forEach((query) => query.removeEventListener("change", onChange));
}

function isVideoCapable() {
  return window.matchMedia(desktopQuery).matches && !window.matchMedia(reducedMotionQuery).matches;
}

const serverCapability = () => false;

/**
 * Ambient AI-generated backdrop layered over the opaque 3D canvas with
 * `mix-blend-screen` (dark areas vanish, only the glowing grid/particles add depth).
 *  - Static texture: always on (cheap, global depth), softened under reduced-motion.
 *  - Animated loop: desktop + motion-ok only, and only while the hero is active,
 *    so it never pulls focus from content in the inner sections.
 */
export default function AmbientBackdrop({ heroActive }: { heroActive: boolean }) {
  const capable = useSyncExternalStore(subscribeCapability, isVideoCapable, serverCapability);
  const [ready, setReady] = useState(false); // gate the ~1-2MB download off the critical path
  const videoRef = useRef<HTMLVideoElement>(null);

  // Static cases never schedule/download a video. On the home, keep the mounted
  // loop after its first use so leaving/revisiting the hero can fade and resume.
  useEffect(() => {
    if (!capable || !heroActive || ready) return;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (h: number) => void;
    };
    const mountVideo = () => {
      if (isVideoCapable()) setReady(true);
    };
    const hasIdle = typeof w.requestIdleCallback === "function";
    const handle = hasIdle
      ? w.requestIdleCallback!(mountVideo)
      : window.setTimeout(mountVideo, 2500);
    return () => {
      if (hasIdle) w.cancelIdleCallback?.(handle);
      else clearTimeout(handle);
    };
  }, [capable, heroActive, ready]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (capable && heroActive) v.play().catch(() => {});
    else v.pause();
    return () => v.pause();
  }, [capable, heroActive, ready]);

  return (
    <div aria-hidden className="fixed inset-0 z-0 pointer-events-none">
      <div
        className="absolute inset-0 bg-cover bg-center mix-blend-screen opacity-25 motion-reduce:opacity-15"
        style={{ backgroundImage: "url(/textures/hero-grid.webp)" }}
      />
      {ready && capable && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover mix-blend-screen transition-opacity duration-1000"
          style={{ opacity: heroActive ? 0.45 : 0 }}
          muted
          loop
          playsInline
          preload="auto"
          autoPlay={heroActive}
        >
          <source src="/video/hero-loop.webm" type="video/webm" />
          <source src="/video/hero-loop.mp4" type="video/mp4" />
        </video>
      )}
    </div>
  );
}
