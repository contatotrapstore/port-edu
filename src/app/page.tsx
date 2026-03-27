"use client";

import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import { Navbar } from "@/components/overlay/Navbar";
import { ChapterNav } from "@/components/overlay/ChapterNav";
import { LoadingScreen } from "@/components/overlay/LoadingScreen";
import { ScrollIndicator } from "@/components/overlay/ScrollIndicator";

const Experience = dynamic(() => import("@/components/experience/Experience"), {
  ssr: false,
});

const CHAPTERS = [
  { id: "hero", label: "Início" },
  { id: "about", label: "Sobre" },
  { id: "projects", label: "Projetos" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contato" },
];

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentChapter, setCurrentChapter] = useState(0);

  const handleLoaded = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleProgress = useCallback((p: number) => {
    setProgress(p);
    const chapterIndex = Math.min(
      Math.floor(p * CHAPTERS.length),
      CHAPTERS.length - 1
    );
    setCurrentChapter(chapterIndex);
  }, []);

  const handleChapterClick = useCallback((index: number) => {
    setCurrentChapter(index);
    // ScrollController will pick this up
    window.dispatchEvent(
      new CustomEvent("gotoChapter", { detail: { index } })
    );
  }, []);

  return (
    <>
      <LoadingScreen isLoaded={isLoaded} />
      <div className="canvas-container">
        <Experience onLoaded={handleLoaded} onProgress={handleProgress} />
      </div>
      <div className="overlay">
        <Navbar
          chapters={CHAPTERS}
          currentChapter={currentChapter}
          onChapterClick={handleChapterClick}
        />
        <ChapterNav
          chapters={CHAPTERS}
          currentChapter={currentChapter}
          onChapterClick={handleChapterClick}
        />
        <ScrollIndicator visible={isLoaded && progress < 0.05} />
      </div>
    </>
  );
}
