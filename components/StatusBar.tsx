"use client";

interface StatusBarProps {
  x: number | null;
  y: number | null;
  currentColor: string | null;
  pixelCount: number;
  totalPixels: number;
  isComplete: boolean;
  speciesName: string | null;
  isDrawing: boolean;
}

export default function StatusBar({
  x,
  y,
  currentColor,
  pixelCount,
  totalPixels,
  isComplete,
  speciesName,
  isDrawing,
}: StatusBarProps) {
  const xLabel = x !== null ? String(x).padStart(2, "0") : "--";
  const yLabel = y !== null ? String(y).padStart(2, "0") : "--";
  const colorHex = currentColor || "#------";

  return (
    <div className="flex items-center gap-4 px-4 py-1.5 border-t border-[#333] bg-[#1a1a1a] text-[10px] font-mono text-[#666]">
      <span>
        X:{xLabel} Y:{yLabel}
      </span>
      <span className="flex items-center gap-1">
        {isDrawing ? "PEN" : "PEN"}
        <span
          className="inline-block w-3 h-3 border border-[#555]"
          style={{ backgroundColor: currentColor || "#333" }}
        />
        <span className="text-[#888]">{colorHex}</span>
      </span>
      <span>
        {pixelCount}/{totalPixels} PX
      </span>
      {isComplete && speciesName && (
        <span className="text-[#aaa] ml-auto">
          BUDDY HATCHED — {speciesName.toUpperCase()}
        </span>
      )}
      {isDrawing && (
        <span className="text-[#aaa] ml-auto animate-pulse">
          HATCHING...
        </span>
      )}
    </div>
  );
}
