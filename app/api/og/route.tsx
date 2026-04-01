import { ImageResponse } from "next/og";
import { generateBuddy } from "@/lib/generate-buddy";
import { RARITY_COLORS } from "@/lib/species";
import { STAT_NAMES, RARITY_STARS } from "@/lib/types";

export const runtime = "edge";

const SIZE = { width: 1200, height: 630 };
const GRID = 16;
const PIXEL = 24;
const SPRITE_SIZE = GRID * PIXEL; // 384px

const STAT_COLORS: Record<string, string> = {
  DEBUGGING: "#4ade80",
  PATIENCE: "#60a5fa",
  CHAOS: "#f87171",
  WISDOM: "#c084fc",
  SNARK: "#fbbf24",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name) {
    return new Response("Missing name parameter", { status: 400 });
  }

  const buddy = generateBuddy(name);
  const rarityColor = RARITY_COLORS[buddy.rarity];

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

  const stats = STAT_NAMES.map((name) => ({
    label: name,
    value: buddy.stats[name],
  }));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#2A2520",
          fontFamily: "monospace",
          position: "relative",
          overflow: "hidden",
          border: "3px solid #3A3530",
        }}
      >
        {/* Top bar */}
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
                boxShadow: "0 0 6px rgba(232, 115, 74, 0.5)",
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
          <span
            style={{
              fontSize: 11,
              letterSpacing: "0.1em",
              color: "#5A5550",
            }}
          >
            MODEL CB-1.0
          </span>
        </div>

        {/* Single CRT screen encompassing sprite + stats */}
        <div
          style={{
            flex: 1,
            display: "flex",
            margin: 20,
            background: "#0D0E0C",
            borderRadius: 12,
            border: "1px solid #1A1714",
            overflow: "hidden",
            boxShadow:
              "inset 0 0 80px rgba(0,0,0,0.6), inset 0 0 30px rgba(0,0,0,0.4)",
            position: "relative",
          }}
        >
          {/* Scanlines */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.35,
              background:
                "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.25) 2px, rgba(0,0,0,0.25) 4px)",
              display: "flex",
            }}
          />

          {/* Sprite — left side inside the screen */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px 32px",
            }}
          >
            <div
              style={{
                position: "relative",
                width: SPRITE_SIZE,
                height: SPRITE_SIZE,
                display: "flex",
              }}
            >
              {/* Grid lines */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: SPRITE_SIZE,
                  height: SPRITE_SIZE,
                  background: `repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent ${PIXEL}px), repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent ${PIXEL}px)`,
                  display: "flex",
                }}
              />
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
              {buddy.isShiny && (
                <div
                  style={{
                    position: "absolute",
                    top: -4,
                    left: -4,
                    right: -4,
                    bottom: -4,
                    border: "2px solid #f59e0b",
                    borderRadius: 0,
                    boxShadow: "inset 0 0 30px rgba(245,158,11,0.15)",
                    display: "flex",
                  }}
                />
              )}
            </div>
          </div>

          {/* Info — right side inside the same screen */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "24px 32px 24px 16px",
              gap: 16,
            }}
          >
            {/* Species + rarity */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: "#F5F0EB",
                    letterSpacing: "-0.5px",
                    textTransform: "capitalize",
                  }}
                >
                  {buddy.isShiny ? `✨ ${buddy.species}` : buddy.species}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: rarityColor,
                    letterSpacing: "0.1em",
                    padding: "3px 10px",
                    border: `1px solid ${rarityColor}`,
                    borderRadius: 2,
                    textTransform: "uppercase",
                  }}
                >
                  {RARITY_STARS[buddy.rarity]} {buddy.rarity}
                </span>
                {buddy.isShiny && (
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#f59e0b",
                      letterSpacing: "0.1em",
                      padding: "3px 10px",
                      border: "1px solid #f59e0b",
                      borderRadius: 2,
                    }}
                  >
                    SHINY
                  </span>
                )}
              </div>
            </div>

            {/* Stats with per-stat colors */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      color: "#8A8480",
                      width: 90,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {stat.label}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 18,
                      background: "#1A1714",
                      borderRadius: 2,
                      border: "1px solid #2A2520",
                      display: "flex",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${stat.value}%`,
                        height: "100%",
                        background: STAT_COLORS[stat.label],
                        borderRadius: 2,
                        display: "flex",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 14,
                      color: "#F5F0EB",
                      width: 36,
                      textAlign: "right",
                    }}
                  >
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Soul description */}
            <div
              style={{
                fontSize: 15,
                color: "#8A8480",
                lineHeight: 1.5,
                fontStyle: "italic",
                display: "flex",
              }}
            >
              &ldquo;{buddy.soulDescription}&rdquo;
            </div>

            {/* Palette swatches */}
            <div style={{ display: "flex", gap: 6 }}>
              {buddy.palette.map((color, i) => (
                <div
                  key={i}
                  style={{
                    width: 24,
                    height: 24,
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
          <span
            style={{
              fontSize: 17,
              color: "#E8734A",
              letterSpacing: "0.05em",
              textAlign: "right",
              textTransform: "uppercase",
            }}
          >
            BUDDY HATCHED — {buddy.species}
          </span>
        </div>
      </div>
    ),
    { ...SIZE }
  );
}
