"use client";

// --- Section wrapper ---
export default function Section({
  id,
  children,
  className = "",
  progress,
  range,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  progress: number;
  range: [number, number];
}) {
  const [start, end] = range;
  const isFirst = start === 0;
  const isLast = end >= 1;
  const isActive = progress >= start && progress < end;
  const localP = (progress - start) / (end - start);

  // Wider crossfade zones (18% of the range) + eased drift = silky hand-off between
  // chapters. Opacity/transform are driven directly by scroll progress (no CSS
  // transition fighting the scroll), so the values track the finger/wheel 1:1.
  const ZONE = 0.18;
  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
  let opacity = 0;
  let drift = 0;
  if (isActive || (isFirst && progress < start) || (isLast && progress >= end)) {
    opacity = 1;
    if (!isLast && localP > 1 - ZONE) {
      const t = (localP - (1 - ZONE)) / ZONE; // 0→1 while exiting
      opacity = 1 - easeOut(t);
      drift = -easeOut(t) * 30; // exiting: slides up
    }
    if (!isFirst && localP < ZONE) {
      const t = localP / ZONE; // 0→1 while entering
      opacity = easeOut(t);
      drift = (1 - easeOut(t)) * 30; // entering: rises from below
    }
  }

  return (
    <section
      id={id}
      className={`fixed inset-0 overflow-y-auto overflow-x-hidden scrollbar-none ${className}`}
      style={{
        opacity,
        zIndex: opacity > 0 ? 10 : 0,
        visibility: opacity > 0 ? "visible" : "hidden",
        touchAction: "pan-y",
        WebkitOverflowScrolling: "touch",
        overscrollBehavior: "contain",
        pointerEvents: opacity > 0.35 ? "auto" : "none",
        willChange: "opacity",
      }}
    >
      <div className="min-h-full flex flex-col items-center justify-center max-w-6xl w-full mx-auto py-20 md:pt-24 md:pb-16 px-6 md:px-8 lg:px-12">
        <div
          className="w-full motion-reduce:!transform-none"
          style={{ transform: `translateY(${drift}px)`, willChange: "transform" }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
