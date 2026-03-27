"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface ScrollConfig {
  sensitivity?: number;
  smoothing?: number;
  maxSpeed?: number;
}

export function useScrollProgress(config: ScrollConfig = {}) {
  const { sensitivity = 0.0008, smoothing = 0.08, maxSpeed = 0.02 } = config;
  const [progress, setProgress] = useState(0);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const goToProgress = useCallback((target: number) => {
    targetRef.current = Math.max(0, Math.min(1, target));
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * sensitivity;
      targetRef.current = Math.max(
        0,
        Math.min(1, targetRef.current + delta)
      );
    };

    // Touch support
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const delta = (touchStartY - e.touches[0].clientY) * sensitivity * 2;
      targetRef.current = Math.max(
        0,
        Math.min(1, targetRef.current + delta)
      );
      touchStartY = e.touches[0].clientY;
    };

    // Custom chapter navigation event
    const handleGotoChapter = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const chapterRanges = [0, 0.2, 0.4, 0.65, 0.85];
      if (detail.index >= 0 && detail.index < chapterRanges.length) {
        targetRef.current = chapterRanges[detail.index];
      }
    };

    // Animation loop
    const animate = () => {
      const diff = targetRef.current - currentRef.current;
      const clampedDiff = Math.sign(diff) * Math.min(Math.abs(diff), maxSpeed);
      currentRef.current += clampedDiff * (smoothing * 10);

      // Snap when close enough
      if (Math.abs(diff) < 0.0001) {
        currentRef.current = targetRef.current;
      }

      setProgress(currentRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("gotoChapter", handleGotoChapter);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("gotoChapter", handleGotoChapter);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [sensitivity, smoothing, maxSpeed]);

  return { progress, goToProgress };
}
