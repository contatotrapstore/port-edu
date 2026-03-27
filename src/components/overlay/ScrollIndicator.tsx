"use client";

interface ScrollIndicatorProps {
  visible: boolean;
}

export function ScrollIndicator({ visible }: ScrollIndicatorProps) {
  return (
    <div
      className="scroll-indicator"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <svg
        width="20"
        height="30"
        viewBox="0 0 20 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="1"
          y="1"
          width="18"
          height="28"
          rx="9"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.5"
        />
        <circle cx="10" cy="10" r="2.5" fill="var(--gold)" />
      </svg>
      <span>Scroll</span>
    </div>
  );
}
