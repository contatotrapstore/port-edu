"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { m } from "framer-motion";
import { useLocale } from "@/lib/locale";
import { t, loadingMessagesByLocale } from "@/lib/i18n";

// --- Loading Screen ---
export default function LoadingScreen({
  isLoaded,
  onSkip,
}: {
  isLoaded: boolean;
  onSkip?: () => void;
}) {
  const locale = useLocale();
  const loadingMessages = loadingMessagesByLocale[locale];
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  // Revisita na mesma aba: corta o boot na hora (pós-mount, evita mismatch de hidratação).
  useEffect(() => {
    try {
      if (sessionStorage.getItem("edh-booted")) setVisible(false);
    } catch {}
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      const interval = setInterval(() => {
        setProgress((p) => (p >= 90 ? 90 : p + Math.random() * 12));
        setMsgIndex((m) => (m < loadingMessages.length - 1 ? m + 1 : m));
      }, 300);
      return () => clearInterval(interval);
    }
    try {
      sessionStorage.setItem("edh-booted", "1");
    } catch {}
    setProgress(100);
    setMsgIndex(loadingMessages.length - 1);
    setTimeout(() => setVisible(false), 550);
  }, [isLoaded, loadingMessages.length]);

  if (!visible) return null;

  const barLength = 20;
  const filled = Math.round((progress / 100) * barLength);
  const bar = "█".repeat(filled) + "░".repeat(barLength - filled);

  return (
    <m.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a] cursor-pointer"
      role="button"
      tabIndex={-1}
      aria-label={t(locale, "loading.skip")}
      onClick={onSkip}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === "Escape") onSkip?.();
      }}
      animate={{
        opacity: isLoaded ? 0 : 1,
        clipPath: isLoaded ? "inset(0 0 100% 0)" : "inset(0 0 0% 0)",
      }}
      transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
    >
      {/* Logo with glitch reveal */}
      <m.div
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1 }}
      >
        <Image src="/EdevsHub.webp" alt="EDevsHub" width={180} height={48} priority className="invert mix-blend-screen" />
      </m.div>

      {/* Terminal boot messages */}
      <div className="mt-8 font-[family-name:var(--font-jetbrains-mono)] text-xs space-y-1 w-72">
        {loadingMessages.slice(0, msgIndex + 1).map((msg, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[#4ade80]">&gt;</span>
            <span className="text-white/50">{msg}</span>
            {i < msgIndex && <span className="text-[#4ade80] ml-auto">[OK]</span>}
            {i === msgIndex && !isLoaded && (
              <span className="cursor-blink text-[#4ade80] ml-auto">...</span>
            )}
            {i === msgIndex && isLoaded && (
              <span className="text-[#4ade80] ml-auto">[OK]</span>
            )}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-4 font-[family-name:var(--font-jetbrains-mono)] text-xs text-white/30">
        [{bar}] {Math.round(progress)}%
      </div>

      {/* Skip hint */}
      <div className="mt-6 font-[family-name:var(--font-jetbrains-mono)] text-[10px] text-white/25">
        {t(locale, "loading.skip")}
      </div>
    </m.div>
  );
}
