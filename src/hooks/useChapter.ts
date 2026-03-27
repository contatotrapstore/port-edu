"use client";

import { useMemo } from "react";
import { chapters } from "@/lib/constants";

export function useChapter(progress: number) {
  return useMemo(() => {
    let currentIndex = 0;
    let localProgress = 0;

    for (let i = 0; i < chapters.length; i++) {
      const [start, end] = chapters[i].range;
      if (progress >= start && progress < end) {
        currentIndex = i;
        localProgress = (progress - start) / (end - start);
        break;
      }
      if (i === chapters.length - 1 && progress >= end) {
        currentIndex = i;
        localProgress = 1;
      }
    }

    return {
      currentIndex,
      currentChapter: chapters[currentIndex],
      localProgress: Math.max(0, Math.min(1, localProgress)),
      isTransitioning: false,
    };
  }, [progress]);
}
