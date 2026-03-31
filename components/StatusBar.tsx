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
    <div className="flex items-center gap-4 px-3 py-1.5 bg-[#0D0E0C]/80 backdrop-blur-sm text-[10px] font-mono text-[#5A5550]">
      <span>
        X:{xLabel} Y:{yLabel}
      </span>
      <span className="flex items-center gap-1">
        PEN
        <span
          className="inline-block w-3 h-3 border border-[#3A3530] rounded-sm"
          style={{ backgroundColor: currentColor || "#2A2520" }}
        />
        <span className="text-[#8A8480]">{colorHex}</span>
      </span>
      <span>
        {pixelCount}/{totalPixels} PX
      </span>
      {isComplete && speciesName && (
        <span className="text-[#E8734A] ml-auto font-bold">
          BUDDY HATCHED — {speciesName.toUpperCase()}
        </span>
      )}
      {isDrawing && (
        <span className="text-[#E8734A] ml-auto animate-pulse">
          HATCHING...
        </span>
      )}
    </div>
  );
}
