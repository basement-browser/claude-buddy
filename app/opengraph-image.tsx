import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Claude Buddy — Hatch your unique pixel companion from Claude Code";

const PIXEL_COLORS = [
  "#7ec8a0", "#5ba87e", "#c084fc", "#f59e0b",
  "#60a5fa", "#4ade80", "#e879a0", "#ff6b6b",
];

const TAGS = ["12 Species", "5 Rarities", "Shiny Variants", "Free"];

export default function Image() {
  // Deterministic pixel grid columns flanking the center
  const pixels: { color: string }[] = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 6; col++) {
      const idx = (row * 7 + col * 13 + row * col) % PIXEL_COLORS.length;
      pixels.push({ color: PIXEL_COLORS[idx] });
    }
  }
  const pixelsRight: { color: string }[] = [];
  for (let i = 0; i < pixels.length; i++) {
    pixelsRight.push({ color: PIXEL_COLORS[(i * 3) % PIXEL_COLORS.length] });
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1A1714",
          fontFamily: "monospace",
        }}
      >
        {/* Device shell */}
        <div
          style={{
            width: 1160,
            height: 590,
            display: "flex",
            flexDirection: "column",
            background: "#2A2520",
            border: "3px solid #3A3530",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 28px",
              borderBottom: "1px solid #3A3530",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#E8734A",
                  boxShadow: "0 0 6px rgba(232,115,74,0.5)",
                  display: "flex",
                }}
              />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  color: "#F5F0EB",
                }}
              >
                CLAUDE BUDDY HATCHERY
              </span>
            </div>
            <span style={{ fontSize: 11, letterSpacing: "0.1em", color: "#5A5550" }}>
              MODEL CB-1.0
            </span>
          </div>

          {/* CRT screen */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: 20,
              background: "#0D0E0C",
              borderRadius: 12,
              border: "1px solid #1A1714",
              overflow: "hidden",
              boxShadow: "inset 0 0 80px rgba(0,0,0,0.6)",
              position: "relative",
            }}
          >
            {/* Scanlines */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.35,
                background:
                  "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.25) 2px, rgba(0,0,0,0.25) 4px)",
                display: "flex",
              }}
            />

            {/* Left pixel grid */}
            <div
              style={{
                position: "absolute",
                left: 40,
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                flexWrap: "wrap",
                width: 154,
                gap: 4,
                opacity: 0.55,
              }}
            >
              {pixels.map((p, i) => (
                <div
                  key={i}
                  style={{
                    width: 22,
                    height: 22,
                    background: p.color,
                    display: "flex",
                  }}
                />
              ))}
            </div>

            {/* Right pixel grid */}
            <div
              style={{
                position: "absolute",
                right: 40,
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                flexWrap: "wrap",
                width: 154,
                gap: 4,
                opacity: 0.55,
              }}
            >
              {pixelsRight.map((p, i) => (
                <div
                  key={i}
                  style={{
                    width: 22,
                    height: 22,
                    background: p.color,
                    display: "flex",
                  }}
                />
              ))}
            </div>

            {/* Centered content */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
                padding: "40px 60px",
                background: "rgba(13,14,12,0.8)",
                borderRadius: 8,
                zIndex: 1,
              }}
            >
              {/* Egg */}
              <span style={{ fontSize: 64, display: "flex", lineHeight: 1 }}>
                🥚
              </span>

              {/* Title */}
              <span
                style={{
                  fontSize: 52,
                  fontWeight: 700,
                  color: "#F5F0EB",
                  letterSpacing: "-0.5px",
                  display: "flex",
                }}
              >
                Claude Buddy
              </span>

              {/* Subtitle */}
              <span
                style={{
                  fontSize: 22,
                  color: "#8A8480",
                  display: "flex",
                  letterSpacing: "0.01em",
                }}
              >
                Hatch your unique pixel companion from Claude Code
              </span>

              {/* Tags */}
              <div style={{ display: "flex", gap: 10 }}>
                {TAGS.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 15,
                      color: "#4ade80",
                      padding: "5px 16px",
                      border: "1px solid #4ade8044",
                      background: "#4ade8012",
                      letterSpacing: "0.04em",
                      display: "flex",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 28px",
              borderTop: "1px solid #3A3530",
            }}
          >
            <span style={{ fontSize: 17, color: "#5A5550" }}>
              claudebuddy.me
            </span>
            <span
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: 16,
                color: "#5A5550",
                letterSpacing: "0.04em",
                whiteSpace: "nowrap",
              }}
            >
              by basementbrowser.com
            </span>
            <span style={{ fontSize: 17, color: "#E8734A", letterSpacing: "0.05em" }}>
              HATCH YOUR BUDDY
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
