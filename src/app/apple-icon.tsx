import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

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
          border: "2px solid rgba(74, 222, 128, 0.3)",
          borderRadius: 36,
        }}
      >
        <div
          style={{
            fontSize: 90,
            fontWeight: 700,
            color: "#4ade80",
            fontFamily: "monospace",
            letterSpacing: "-4px",
          }}
        >
          &gt;_
        </div>
      </div>
    ),
    { ...size }
  );
}
