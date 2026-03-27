"use client";

import { useState, useEffect } from "react";

interface LoadingScreenProps {
  isLoaded: boolean;
}

export function LoadingScreen({ isLoaded }: LoadingScreenProps) {
  const [loadProgress, setLoadProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!isLoaded) {
      // Simulate loading progress
      const interval = setInterval(() => {
        setLoadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 200);
      return () => clearInterval(interval);
    } else {
      setLoadProgress(100);
      const timeout = setTimeout(() => setVisible(false), 800);
      return () => clearTimeout(timeout);
    }
  }, [isLoaded]);

  if (!visible) return null;

  return (
    <div className={`loading-screen ${isLoaded ? "loaded" : ""}`}>
      <div
        style={{
          fontSize: "24px",
          fontWeight: 700,
          letterSpacing: "-0.5px",
          color: "#fff",
          fontFamily: "var(--font-jakarta), sans-serif",
        }}
      >
        Eduardo<span style={{ color: "var(--gold)" }}>.</span>
      </div>
      <div className="loading-bar">
        <div
          className="loading-bar-fill"
          style={{ width: `${Math.min(loadProgress, 100)}%` }}
        />
      </div>
      <div
        style={{
          marginTop: "12px",
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "3px",
          color: "var(--text-muted)",
        }}
      >
        Carregando experiência
      </div>
    </div>
  );
}
