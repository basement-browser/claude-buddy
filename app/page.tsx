"use client";

import { useState, useCallback, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { generateBuddy } from "@/lib/generate-buddy";
import { Buddy } from "@/lib/types";
import BuddyCanvas, { BuddyCanvasHandle } from "@/components/BuddyCanvas";
import InfoPanel from "@/components/InfoPanel";
import StatusBar from "@/components/StatusBar";
import HatchInput from "@/components/HatchInput";
import SyncSection from "@/components/SyncSection";
import ToolPanel from "@/components/ToolPanel";
import DonateModal from "@/components/DonateModal";
import ShareButton from "@/components/ShareButton";

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

  useEffect(() => {
    if (initialName && !hasAutoHatched.current) {
      hasAutoHatched.current = true;
      const t = setTimeout(() => handleHatch(initialName), 300);
      return () => clearTimeout(t);
    }
  }, [initialName, handleHatch]);

  return (
    <div className="flex items-center justify-center min-h-screen p-3 md:p-6 lg:p-8">
      <div className="device-shell w-full max-w-[1200px]">
        {/* ── Device Header ── */}
        <div className="flex items-center justify-between px-4 lg:px-5 py-3 border-b border-[#3A3530]">
          <div className="flex items-center gap-3">
            <div className="te-led" />
            <h1 className="font-mono text-[10px] lg:text-[11px] font-bold tracking-[0.15em] uppercase text-[#F5F0EB]">
              Claude Buddy Hatchery
            </h1>
          </div>
          <div className="font-mono text-[9px] tracking-[0.1em] uppercase text-[#5A5550]">
            model CB-1.0
          </div>
        </div>

        {/* ── Main Body: Horizontal on desktop, vertical on mobile ── */}
        <div className="flex flex-col lg:flex-row">

          {/* ── Left: CRT Screen ── */}
          <div className="flex-1 min-w-0 p-3 md:p-4 lg:p-5">
            <div className="crt-bezel">
              <div className="crt-screen" style={{ aspectRatio: "1 / 1" }}>
                <div ref={containerRef} className="w-full h-full relative">
                  <BuddyCanvas
                    ref={canvasRef}
                    buddy={buddy}
                    showGrid={showGrid}
                    onDrawingStateChange={handleDrawingStateChange}
                    cellSize={cellSize}
                  />
                  {/* Status overlay at bottom of screen */}
                  <div className="absolute bottom-0 left-0 right-0 z-20">
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
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Control Panel (scrollable on desktop) ── */}
          <div className="lg:w-[320px] xl:w-[360px] lg:border-l border-t lg:border-t-0 border-[#3A3530] lg:overflow-y-auto lg:max-h-[calc(100vh-140px)]">
            <div className="flex flex-col gap-4 p-3 md:p-4 lg:p-5">

              {/* Input */}
              <HatchInput
                onHatch={handleHatch}
                initialName={initialName}
                isDrawing={drawingState.isDrawing}
              />

              {/* Control buttons */}
              <ToolPanel
                isDrawing={drawingState.isDrawing}
                showGrid={showGrid}
                onToggleGrid={() => setShowGrid((g) => !g)}
                onClear={handleClear}
                onExport={handleExport}
              />

              {/* Readout panel */}
              <InfoPanel
                currentColor={drawingState.currentColor}
                palette={buddy?.palette || ["#333", "#444", "#555", "#666"]}
                buddy={buddy}
                isComplete={drawingState.isComplete}
                onSave={handleExport}
              />

              {/* Sync section */}
              <SyncSection
                onHatch={handleHatch}
                isDrawing={drawingState.isDrawing}
              />

              {/* Share buttons */}
              {drawingState.isComplete && buddy && (
                <ShareButton buddy={buddy} onSave={handleExport} />
              )}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="te-groove" />
        <div className="flex items-center justify-between px-4 lg:px-5 py-3">
          <a
            href="https://basementbrowser.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[10px] font-mono text-[#5A5550] hover:text-[#8A8480] transition-colors"
          >
            <img
              src="/basement-logo.webp"
              alt="Basement"
              className="w-5 h-5 rounded-sm opacity-60"
            />
            <span>Built by the Basement Team</span>
          </a>
          <button
            onClick={() => setShowDonate(true)}
            className="te-button text-[9px]"
          >
            Buy us a coffee
          </button>
        </div>
      </div>

      <DonateModal isOpen={showDonate} onClose={() => setShowDonate(false)} />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen text-[#5A5550] font-mono text-sm">
          Loading Claude Buddy...
        </div>
      }
    >
      <ClaudeBuddyInner />
    </Suspense>
  );
}
