import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";
export const alt =
  "Claude Buddy — Hatch your unique pixel companion from Claude Code";

const PIXEL_COLORS = [
  "#7ec8a0",
  "#5ba87e",
  "#c084fc",
  "#f59e0b",
  "#60a5fa",
  "#4ade80",
  "#e879a0",
  "#ff6b6b",
];

export default function Image() {
  // Deterministic "pixel grid" pattern for the background
  const pixels: { x: number; y: number; color: string }[] = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      // Simple hash to pick color
      const idx = (row * 7 + col * 13 + row * col) % PIXEL_COLORS.length;
      if ((row + col) % 3 !== 0) {
        pixels.push({
          x: col * 36 + 60,
          y: row * 36 + 190,
          color: PIXEL_COLORS[idx],
        });
      }
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a1a1a",
          fontFamily: "monospace",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Scanline effect */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
            display: "flex",
          }}
        />

        {/* Pixel grid decoration - left */}
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 160,
            display: "flex",
            flexWrap: "wrap",
            width: 300,
            gap: 4,
            opacity: 0.6,
          }}
        >
          {pixels.map((p, i) => (
            <div
              key={i}
              style={{
                width: 30,
                height: 30,
                background: p.color,
                borderRadius: 2,
                display: "flex",
              }}
            />
          ))}
        </div>

        {/* Pixel grid decoration - right */}
        <div
          style={{
            position: "absolute",
            right: 40,
            top: 160,
            display: "flex",
            flexWrap: "wrap",
            width: 300,
            gap: 4,
            opacity: 0.6,
          }}
        >
          {pixels.map((p, i) => (
            <div
              key={i}
              style={{
                width: 30,
                height: 30,
                background: PIXEL_COLORS[(i * 3) % PIXEL_COLORS.length],
                borderRadius: 2,
                display: "flex",
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            padding: "40px 60px",
            background: "rgba(26, 26, 26, 0.9)",
            border: "2px solid #333",
          }}
        >
          {/* Emoji egg */}
          <div
            style={{
              fontSize: 72,
              marginBottom: 16,
              display: "flex",
            }}
          >
            🥚
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: "#c084fc",
              letterSpacing: "-1px",
              textAlign: "center",
              marginBottom: 12,
              display: "flex",
            }}
          >
            Claude Buddy
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 22,
              color: "#9ca3af",
              textAlign: "center",
              maxWidth: 700,
              lineHeight: 1.4,
              display: "flex",
            }}
          >
            Hatch your unique pixel companion from Claude Code
          </div>

          {/* Tags */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 24,
            }}
          >
            {["12 Species", "5 Rarities", "Shiny Variants", "Free"].map(
              (tag) => (
                <div
                  key={tag}
                  style={{
                    padding: "6px 16px",
                    border: "1px solid #444",
                    color: "#4ade80",
                    fontSize: 14,
                    display: "flex",
                  }}
                >
                  {tag}
                </div>
              )
            )}
          </div>
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            color: "#555",
            fontSize: 16,
            display: "flex",
          }}
        >
          claudebuddy.me
        </div>
      </div>
    ),
    { ...size }
  );
}
