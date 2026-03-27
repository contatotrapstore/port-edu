"use client";

interface ChapterNavProps {
  chapters: { id: string; label: string }[];
  currentChapter: number;
  onChapterClick: (index: number) => void;
}

export function ChapterNav({ chapters, currentChapter, onChapterClick }: ChapterNavProps) {
  return (
    <div className="chapter-nav">
      {chapters.map((chapter, i) => (
        <button
          key={chapter.id}
          className={`chapter-dot ${currentChapter === i ? "active" : ""}`}
          onClick={() => onChapterClick(i)}
          aria-label={`Ir para ${chapter.label}`}
        >
          <span className="tooltip">{chapter.label}</span>
        </button>
      ))}
    </div>
  );
}
