import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Same vector glyph as icon.svg, scaled — keeps the favicon family consistent.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          border: "5px solid rgba(74, 222, 128, 0.35)",
          borderRadius: 40,
        }}
      >
        <svg width="120" height="120" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="edh-apple" x1="0" y1="0" x2="0" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#5ef08f" />
              <stop offset="1" stopColor="#22c55e" />
            </linearGradient>
          </defs>
          <path
            d="M9 10 L15 16 L9 22"
            fill="none"
            stroke="url(#edh-apple)"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="16.5" y="19.9" width="7" height="2.6" rx="1.3" fill="url(#edh-apple)" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
