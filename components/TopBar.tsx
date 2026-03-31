"use client";

import { useCallback } from "react";

interface TopBarProps {
  showGrid: boolean;
  onToggleGrid: () => void;
  onClear: () => void;
  onExport: () => void;
}

export default function TopBar({ showGrid, onToggleGrid, onClear, onExport }: TopBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-[#333] bg-[#1e1e1e]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleGrid}
            className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider border ${
              showGrid
                ? "bg-[#444] text-white border-[#666]"
                : "bg-transparent text-[#888] border-[#444]"
            } hover:bg-[#555] transition-colors`}
          >
            Grid
          </button>
          <button
            onClick={onClear}
            className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider border border-[#444] text-[#888] hover:bg-[#555] hover:text-white transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <h1 className="absolute left-1/2 -translate-x-1/2 text-[#888] font-pixel text-[10px] tracking-[4px] uppercase select-none">
        Claude Buddy
      </h1>

      <button
        onClick={onExport}
        className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider border border-[#444] text-[#888] hover:bg-[#555] hover:text-white transition-colors"
      >
        Export PNG
      </button>
    </div>
  );
}
