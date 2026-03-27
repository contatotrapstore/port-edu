"use client";

import { useState, useEffect } from "react";

interface NavbarProps {
  chapters: { id: string; label: string }[];
  currentChapter: number;
  onChapterClick: (index: number) => void;
}

export function Navbar({ chapters, currentChapter, onChapterClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // We use a custom event from scroll progress
    };
    // Simple timer-based check for scrolled state
    const interval = setInterval(() => {
      setScrolled(document.documentElement.scrollTop > 50);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-logo">
        Eduardo<span>.</span>
      </div>

      <ul className={`navbar-links ${menuOpen ? "!flex !flex-col !fixed !inset-0 !bg-[#0a0a0a]/95 !items-center !justify-center !gap-8 !z-40" : ""}`}>
        {chapters.map((chapter, i) => (
          <li key={chapter.id}>
            <a
              className={currentChapter === i ? "active" : ""}
              onClick={() => {
                onChapterClick(i);
                setMenuOpen(false);
              }}
            >
              {chapter.label}
            </a>
          </li>
        ))}
      </ul>

      <div
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span style={menuOpen ? { transform: "rotate(45deg) translate(5px, 5px)" } : {}} />
        <span style={menuOpen ? { opacity: 0 } : {}} />
        <span style={menuOpen ? { transform: "rotate(-45deg) translate(5px, -5px)" } : {}} />
      </div>
    </nav>
  );
}
