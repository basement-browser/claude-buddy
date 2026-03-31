"use client";

interface ToolPanelProps {
  isDrawing: boolean;
  showGrid: boolean;
  onToggleGrid: () => void;
  onClear: () => void;
  onExport: () => void;
}

export default function ToolPanel({ isDrawing, showGrid, onToggleGrid, onClear, onExport }: ToolPanelProps) {
  return (
    <div>
      <div className="te-label mb-2">Controls</div>
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onToggleGrid}
          className={`te-button text-[9px] ${showGrid ? "active" : ""}`}
        >
          Grid
        </button>
        <button
          onClick={onClear}
          className="te-button text-[9px]"
        >
          Clear
        </button>
        <button
          onClick={onExport}
          disabled={isDrawing}
          className="te-button text-[9px]"
        >
          Export PNG
        </button>
      </div>
    </div>
  );
}
