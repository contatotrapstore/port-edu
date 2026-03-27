"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

interface ScrollControllerProps {
  onProgress: (progress: number) => void;
}

// Global scroll state accessible by all scenes
export const scrollState = {
  progress: 0,
  target: 0,
  velocity: 0,
};

export function ScrollController({ onProgress }: ScrollControllerProps) {
  const prevProgress = useRef(0);

  useEffect(() => {
    const sensitivity = 0.0006;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      scrollState.target += e.deltaY * sensitivity;
      scrollState.target = Math.max(0, Math.min(1, scrollState.target));
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const delta = (touchStartY - e.touches[0].clientY) * sensitivity * 3;
      scrollState.target += delta;
      scrollState.target = Math.max(0, Math.min(1, scrollState.target));
      touchStartY = e.touches[0].clientY;
    };

    const handleGotoChapter = (e: Event) => {
      const { index } = (e as CustomEvent).detail;
      const targets = [0, 0.2, 0.4, 0.65, 0.85];
      if (index >= 0 && index < targets.length) {
        scrollState.target = targets[index];
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("gotoChapter", handleGotoChapter);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("gotoChapter", handleGotoChapter);
    };
  }, []);

  useFrame(() => {
    // Smooth interpolation
    const smoothing = 0.04;
    scrollState.velocity = scrollState.target - scrollState.progress;
    scrollState.progress += scrollState.velocity * smoothing;

    // Snap
    if (Math.abs(scrollState.velocity) < 0.00001) {
      scrollState.progress = scrollState.target;
    }

    // Notify parent only when changed significantly
    if (Math.abs(scrollState.progress - prevProgress.current) > 0.0001) {
      prevProgress.current = scrollState.progress;
      onProgress(scrollState.progress);
    }
  });

  return null;
}
