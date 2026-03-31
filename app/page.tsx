"use client";

import { useState, useCallback, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { generateBuddy } from "@/lib/generate-buddy";
import { Buddy } from "@/lib/types";
import TopBar from "@/components/TopBar";
import ToolPanel from "@/components/ToolPanel";
import BuddyCanvas, { BuddyCanvasHandle } from "@/components/BuddyCanvas";
import InfoPanel from "@/components/InfoPanel";
import StatusBar from "@/components/StatusBar";
import HatchInput from "@/components/HatchInput";
import SyncSection from "@/components/SyncSection";
import DonateModal from "@/components/DonateModal";

interface DrawingState {
  x: number | null;
  y: number | null;
  currentColor: string | null;
  pixelCount: number;
  totalPixels: number;
  isDrawing: boolean;
  isComplete: boolean;
}

function ClaudeBuddyInner() {
  const searchParams = useSearchParams();
  const [buddy, setBuddy] = useState<Buddy | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [showDonate, setShowDonate] = useState(false);
  const [drawingState, setDrawingState] = useState<DrawingState>({
    x: null,
    y: null,
    currentColor: null,
    pixelCount: 0,
    totalPixels: 0,
    isDrawing: false,
    isComplete: false,
  });
  const canvasRef = useRef<BuddyCanvasHandle>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(28);
  const initialName = searchParams.get("name") || "";
  const hasAutoHatched = useRef(false);

  // Measure the canvas container so grid goes edge-to-edge
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      const newSize = Math.floor(Math.min(width, height) / 16);
      setCellSize((prev) => (prev !== newSize && newSize > 0 ? newSize : prev));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleDrawingStateChange = useCallback((state: DrawingState) => {
    setDrawingState(state);
  }, []);

  const handleHatch = useCallback(
    (name: string) => {
      const newBuddy = generateBuddy(name);
      setBuddy(newBuddy);
      const url = new URL(window.location.href);
      url.searchParams.set("name", name);
      window.history.replaceState({}, "", url.toString());
    },
    []
  );

  const handleClear = useCallback(() => {
    setBuddy(null);
    setDrawingState({
      x: null,
      y: null,
      currentColor: null,
      pixelCount: 0,
      totalPixels: 0,
      isDrawing: false,
      isComplete: false,
    });
  }, []);

  const handleExport = useCallback(() => {
    canvasRef.current?.exportPNG();
  }, []);

  // Auto-hatch from URL param
  useEffect(() => {
    if (initialName && !hasAutoHatched.current) {
      hasAutoHatched.current = true;
      const t = setTimeout(() => handleHatch(initialName), 300);
      return () => clearTimeout(t);
    }
  }, [initialName, handleHatch]);

  return (
    <div className="flex flex-col h-screen">
      {/* Input */}
      <HatchInput
        onHatch={handleHatch}
        initialName={initialName}
        isDrawing={drawingState.isDrawing}
      />

      {/* Sync with Claude Code */}
      <SyncSection
        onHatch={handleHatch}
        isDrawing={drawingState.isDrawing}
      />

      {/* Main editor area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left - Tools */}
        <ToolPanel isDrawing={drawingState.isDrawing} />

        {/* Center - Canvas */}
        <div ref={containerRef} className="flex-1 flex items-center justify-center bg-[#111] relative overflow-hidden">
          <BuddyCanvas
            ref={canvasRef}
            buddy={buddy}
            showGrid={showGrid}
            onDrawingStateChange={handleDrawingStateChange}
            cellSize={cellSize}
          />
        </div>

        {/* Right - Info */}
        <InfoPanel
          currentColor={drawingState.currentColor}
          palette={buddy?.palette || ["#333", "#444", "#555", "#666"]}
          buddy={buddy}
          isComplete={drawingState.isComplete}
          onSave={handleExport}
        />
      </div>

      {/* Status bar */}
      <StatusBar
        x={drawingState.x}
        y={drawingState.y}
        currentColor={drawingState.currentColor}
        pixelCount={drawingState.pixelCount}
        totalPixels={drawingState.totalPixels}
        isComplete={drawingState.isComplete}
        speciesName={buddy?.species || null}
        isDrawing={drawingState.isDrawing}
      />

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-[#282828] bg-[#151515]">
        <a
          href="https://basementbrowser.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[10px] font-mono text-[#666] hover:text-[#aaa] transition-colors"
        >
          <img
            src="/basement-logo.webp"
            alt="Basement"
            className="w-5 h-5 rounded-sm"
          />
          <span>Built by the Basement Team</span>
        </a>
        <button
          onClick={() => setShowDonate(true)}
          className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider border border-[#444] text-[#888] hover:bg-[#444] hover:text-white transition-colors"
        >
          Buy us a coffee
        </button>
      </div>

      <DonateModal isOpen={showDonate} onClose={() => setShowDonate(false)} />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-[#1a1a1a] text-[#444] font-mono text-sm">
          Loading Claude Buddy...
        </div>
      }
    >
      <ClaudeBuddyInner />
    </Suspense>
  );
}
