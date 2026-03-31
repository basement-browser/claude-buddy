"use client";

import { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Buddy } from "@/lib/types";

const GRID_SIZE = 16;

interface PixelState {
  color: string;
  visible: boolean;
}

interface DrawingState {
  x: number | null;
  y: number | null;
  currentColor: string | null;
  pixelCount: number;
  totalPixels: number;
  isDrawing: boolean;
  isComplete: boolean;
}

export interface BuddyCanvasHandle {
  exportPNG: () => void;
}

interface BuddyCanvasProps {
  buddy: Buddy | null;
  showGrid: boolean;
  onDrawingStateChange: (state: DrawingState) => void;
  cellSize: number;
}

const BuddyCanvas = forwardRef<BuddyCanvasHandle, BuddyCanvasProps>(
  function BuddyCanvas({ buddy, showGrid, onDrawingStateChange, cellSize }, ref) {
    const [pixels, setPixels] = useState<(PixelState | null)[][]>(
      () => Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null))
    );
    const [revealedPixels, setRevealedPixels] = useState<Set<string>>(new Set());
    const [isComplete, setIsComplete] = useState(false);
    const [showFlash, setShowFlash] = useState(false);
    const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
    const animationRef = useRef<number | null>(null);
    const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Clean up on unmount or buddy change
    const cleanup = useCallback(() => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      timeoutRefs.current.forEach(clearTimeout);
      timeoutRefs.current = [];
    }, []);

    useImperativeHandle(ref, () => ({
      exportPNG: () => {
        if (!buddy) return;
        const canvas = document.createElement("canvas");
        const scale = 8;
        canvas.width = GRID_SIZE * scale;
        canvas.height = GRID_SIZE * scale;
        const ctx = canvas.getContext("2d")!;

        // Draw transparent background
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let y = 0; y < GRID_SIZE; y++) {
          for (let x = 0; x < GRID_SIZE; x++) {
            const paletteIdx = buddy.sprite[y]?.[x];
            if (paletteIdx !== null && paletteIdx !== undefined) {
              ctx.fillStyle = buddy.palette[paletteIdx];
              ctx.fillRect(x * scale, y * scale, scale, scale);
            }
          }
        }

        const link = document.createElement("a");
        link.download = `${buddy.species.toLowerCase()}-buddy.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      },
    }));

    useEffect(() => {
      cleanup();

      if (!buddy) {
        setPixels(Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null)));
        setRevealedPixels(new Set());
        setIsComplete(false);
        setShowFlash(false);
        setSparkles([]);
        onDrawingStateChange({
          x: null, y: null, currentColor: null,
          pixelCount: 0, totalPixels: 0,
          isDrawing: false, isComplete: false,
        });
        return;
      }

      // Build pixel queue (scanline order, skip transparent)
      const queue: { x: number; y: number; color: string }[] = [];
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          const paletteIdx = buddy.sprite[y]?.[x];
          if (paletteIdx !== null && paletteIdx !== undefined) {
            queue.push({ x, y, color: buddy.palette[paletteIdx] });
          }
        }
      }

      const totalPixels = queue.length;

      // Reset state
      setPixels(Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null)));
      setRevealedPixels(new Set());
      setIsComplete(false);
      setShowFlash(false);
      setSparkles([]);

      onDrawingStateChange({
        x: null, y: null, currentColor: null,
        pixelCount: 0, totalPixels,
        isDrawing: true, isComplete: false,
      });

      // Animate pixels one by one
      queue.forEach((pixel, index) => {
        const timeout = setTimeout(() => {
          setPixels((prev) => {
            const next = prev.map((row) => [...row]);
            next[pixel.y][pixel.x] = { color: pixel.color, visible: true };
            return next;
          });
          setRevealedPixels((prev) => new Set(prev).add(`${pixel.x},${pixel.y}`));

          onDrawingStateChange({
            x: pixel.x,
            y: pixel.y,
            currentColor: pixel.color,
            pixelCount: index + 1,
            totalPixels,
            isDrawing: index < totalPixels - 1,
            isComplete: index === totalPixels - 1,
          });

          // On last pixel
          if (index === totalPixels - 1) {
            const flashTimeout = setTimeout(() => {
              setShowFlash(true);
              setIsComplete(true);
              setTimeout(() => setShowFlash(false), 300);

              // Shiny sparkles
              if (buddy.isShiny) {
                const sparkleInterval = setInterval(() => {
                  setSparkles((prev) => {
                    const newSparkle = {
                      id: Date.now() + Math.random(),
                      x: Math.random() * (GRID_SIZE * cellSize),
                      y: Math.random() * (GRID_SIZE * cellSize),
                    };
                    const filtered = prev.length > 8 ? prev.slice(1) : prev;
                    return [...filtered, newSparkle];
                  });
                }, 200);
                timeoutRefs.current.push(setTimeout(() => clearInterval(sparkleInterval), 10000) as unknown as ReturnType<typeof setTimeout>);
              }
            }, 100);
            timeoutRefs.current.push(flashTimeout);
          }
        }, 40 * index + 200); // 40ms stagger, 200ms initial delay

        timeoutRefs.current.push(timeout);
      });

      return cleanup;
    }, [buddy, cleanup, onDrawingStateChange]);

    return (
      <div
        className="absolute inset-0 cursor-crosshair select-none overflow-hidden"
        style={
          showGrid
            ? {
                backgroundSize: `${cellSize}px ${cellSize}px`,
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
              }
            : undefined
        }
      >
        {/* Centered sprite area */}
        <div
          className="absolute"
          style={{
            width: GRID_SIZE * cellSize,
            height: GRID_SIZE * cellSize,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Shiny golden border */}
          <div
            className={`relative w-full h-full ${
              isComplete && buddy?.isShiny
                ? "ring-2 ring-[#f59e0b] shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                : ""
            }`}
          >

            {/* Pixels */}
            <AnimatePresence>
              {pixels.map((row, y) =>
                row.map((pixel, x) => {
                  if (!pixel || !pixel.visible) return null;
                  return (
                    <motion.div
                      key={`${x}-${y}`}
                      className="absolute"
                      style={{
                        left: x * cellSize + (showGrid ? 1 : 0),
                        top: y * cellSize + (showGrid ? 1 : 0),
                        width: cellSize - (showGrid ? 1 : 0),
                        height: cellSize - (showGrid ? 1 : 0),
                        backgroundColor: pixel.color,
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 25,
                        mass: 0.5,
                      }}
                    />
                  );
                })
              )}
            </AnimatePresence>

            {/* Flash effect on completion */}
            {showFlash && (
              <motion.div
                className="absolute inset-0 bg-white pointer-events-none"
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}

            {/* Shiny sparkles */}
            <AnimatePresence>
              {sparkles.map((sparkle) => (
                <motion.div
                  key={sparkle.id}
                  className="absolute pointer-events-none text-[#f59e0b]"
                  style={{ left: sparkle.x, top: sparkle.y }}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  ✦
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }
);

export default BuddyCanvas;
