import { ImageResponse } from "next/og";
import { generateBuddy } from "@/lib/generate-buddy";
import { RARITY_COLORS } from "@/lib/species";

export const runtime = "edge";

const SIZE = { width: 1200, height: 630 };
const GRID = 16;
const PIXEL = 20;
const SPRITE_SIZE = GRID * PIXEL; // 320px

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name) {
    return new Response("Missing name parameter", { status: 400 });
  }

  const buddy = generateBuddy(name);
  const rarityColor = RARITY_COLORS[buddy.rarity];

  // Build pixel array for the sprite
  const pixels: { x: number; y: number; color: string }[] = [];
  for (let row = 0; row < GRID; row++) {
    for (let col = 0; col < GRID; col++) {
      const cell = buddy.sprite[row][col];
      if (cell !== null) {
        pixels.push({
          x: col * PIXEL,
          y: row * PIXEL,
          color: buddy.palette[cell],
        });
      }
    }
  }

  // Stat bars data
  const stats = [
    { label: "VIB", value: buddy.stats.vibe },
    { label: "CHS", value: buddy.stats.chaos },
    { label: "FCS", value: buddy.stats.focus },
    { label: "LCK", value: buddy.stats.luck },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#1C1917",
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
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
            display: "flex",
          }}
        />

        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 32px",
            borderBottom: "1px solid #3A3530",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#f97316",
                display: "flex",
              }}
            />
            <span
              style={{
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "0.15em",
                color: "#F5F0EB",
              }}
            >
              CLAUDE BUDDY HATCHERY
            </span>
          </div>
          <span
            style={{
              fontSize: 14,
              letterSpacing: "0.1em",
              color: "#5A5550",
            }}
          >
            MODEL CB-1.0
          </span>
        </div>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            padding: "0 48px",
            gap: 48,
          }}
        >
          {/* Sprite area with CRT bezel */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* CRT screen */}
            <div
              style={{
                position: "relative",
                width: SPRITE_SIZE + 40,
                height: SPRITE_SIZE + 40,
                background: "#0a0a0a",
                border: "3px solid #2A2520",
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "inset 0 0 60px rgba(0,0,0,0.5)",
              }}
            >
              {/* Grid lines */}
              <div
                style={{
                  position: "absolute",
                  top: 20,
                  left: 20,
                  width: SPRITE_SIZE,
                  height: SPRITE_SIZE,
                  background:
                    `repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent ${PIXEL}px), repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent ${PIXEL}px)`,
                  display: "flex",
                }}
              />

              {/* Sprite pixels */}
              <div
                style={{
                  position: "relative",
                  width: SPRITE_SIZE,
                  height: SPRITE_SIZE,
                  display: "flex",
                }}
              >
                {pixels.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: p.x,
                      top: p.y,
                      width: PIXEL,
                      height: PIXEL,
                      background: p.color,
                      display: "flex",
                    }}
                  />
                ))}
              </div>

              {/* Shiny glow */}
              {buddy.isShiny && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    border: "2px solid #f59e0b",
                    borderRadius: 4,
                    boxShadow: "inset 0 0 30px rgba(245,158,11,0.15)",
                    display: "flex",
                  }}
                />
              )}
            </div>
          </div>

          {/* Info panel */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {/* Species name + rarity */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    fontSize: 36,
                    fontWeight: 700,
                    color: "#F5F0EB",
                    letterSpacing: "-0.5px",
                  }}
                >
                  {buddy.isShiny ? `SHINY ${buddy.species}` : buddy.species}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: rarityColor,
                    letterSpacing: "0.1em",
                    padding: "4px 12px",
                    border: `1px solid ${rarityColor}`,
                    borderRadius: 2,
                  }}
                >
                  {buddy.rarity.toUpperCase()}
                </span>
                {buddy.isShiny && (
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#f59e0b",
                      letterSpacing: "0.1em",
                      padding: "4px 12px",
                      border: "1px solid #f59e0b",
                      borderRadius: 2,
                    }}
                  >
                    SHINY
                  </span>
                )}
              </div>
            </div>

            {/* Soul description */}
            <div
              style={{
                fontSize: 18,
                color: "#9ca3af",
                lineHeight: 1.5,
                fontStyle: "italic",
                display: "flex",
              }}
            >
              &ldquo;{buddy.soulDescription}&rdquo;
            </div>

            {/* Stats */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      color: "#5A5550",
                      width: 40,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {stat.label}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 16,
                      background: "#2A2520",
                      borderRadius: 2,
                      display: "flex",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${stat.value}%`,
                        height: "100%",
                        background: rarityColor,
                        borderRadius: 2,
                        display: "flex",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 14,
                      color: "#9ca3af",
                      width: 30,
                      textAlign: "right",
                    }}
                  >
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Palette */}
            <div style={{ display: "flex", gap: 8 }}>
              {buddy.palette.map((color, i) => (
                <div
                  key={i}
                  style={{
                    width: 28,
                    height: 28,
                    background: color,
                    borderRadius: 2,
                    border: "1px solid #3A3530",
                    display: "flex",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 32px",
            borderTop: "1px solid #3A3530",
          }}
        >
          <span style={{ fontSize: 13, color: "#5A5550" }}>
            claudebuddy.me
          </span>
          <span
            style={{
              fontSize: 13,
              color: rarityColor,
              letterSpacing: "0.05em",
            }}
          >
            BUDDY HATCHED — {buddy.species.toUpperCase()}
          </span>
        </div>
      </div>
    ),
    { ...SIZE }
  );
}
