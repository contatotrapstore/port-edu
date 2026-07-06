"use client";

import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

/**
 * Optional ambient soundtrack with a floating mute toggle.
 * Starts silent — audio only ever plays after an explicit user click (no autoplay).
 */
export default function AmbientAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [on, setOn] = useState(false);
  const locale = useLocale();

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (on) {
      a.pause();
      setOn(false);
    } else {
      a.volume = 0.32;
      a.play()
        .then(() => setOn(true))
        .catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/audio/ambient.m4a" loop preload="none" />
      <button
        onClick={toggle}
        aria-pressed={on}
        aria-label={on ? t(locale, "audio.ariaOn") : t(locale, "audio.ariaOff")}
        className={`fixed bottom-6 left-6 z-30 flex items-center gap-2 rounded-full border px-3 py-2 backdrop-blur-xl transition-all duration-300 font-[family-name:var(--font-jetbrains-mono)] text-[10px] uppercase tracking-[2px] ${
          on
            ? "border-[#4ade80]/40 bg-[#4ade80]/10 text-[#4ade80]"
            : "border-white/[0.08] bg-[#0a0a0a]/70 text-white/40 hover:text-white/70 hover:border-white/20"
        }`}
      >
        {on ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
        <span className="hidden sm:inline">{on ? t(locale, "audio.on") : t(locale, "audio.off")}</span>
        {on && (
          <span className="flex items-end gap-[2px] h-3" aria-hidden>
            <span className="w-[2px] bg-[#4ade80] animate-pulse" style={{ height: "60%" }} />
            <span className="w-[2px] bg-[#4ade80] animate-pulse" style={{ height: "100%", animationDelay: "0.15s" }} />
            <span className="w-[2px] bg-[#4ade80] animate-pulse" style={{ height: "40%", animationDelay: "0.3s" }} />
          </span>
        )}
      </button>
    </>
  );
}
