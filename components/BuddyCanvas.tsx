"use client";

import { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Buddy } from "@/lib/types";

const GRID_SIZE = 16;
const EYE_PALETTE_INDEX = 3;

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

// Synthesize a subtle pop sound using Web Audio API
function createPopSound(audioCtx: AudioContext, index: number, total: number) {
  const t = audioCtx.currentTime;

  // Oscillator: short sine burst with pitch variation
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  // Pitch rises slightly through the sequence for a satisfying build
  const baseFreq = 600 + (index / total) * 400;
  const variation = (Math.random() - 0.5) * 120;
  osc.frequency.setValueAtTime(baseFreq + variation, t);
  osc.frequency.exponentialRampToValueAtTime(200 + variation, t + 0.08);
  osc.type = "sine";

  // Quick attack, fast decay — percussive pop envelope
  gainNode.gain.setValueAtTime(0, t);
  gainNode.gain.linearRampToValueAtTime(0.08, t + 0.005);
  gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  osc.start(t);
  osc.stop(t + 0.07);
}

function findEyePixels(buddy: Buddy): { x: number; y: number }[] {
  const eyes: { x: number; y: number }[] = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (buddy.sprite[y]?.[x] === EYE_PALETTE_INDEX) {
        eyes.push({ x, y });
      }
    }
  }
  return eyes;
}

const BuddyCanvas = forwardRef<BuddyCanvasHandle, BuddyCanvasProps>(
  function BuddyCanvas({ buddy, showGrid, onDrawingStateChange, cellSize }, ref) {
    const [pixels, setPixels] = useState<(PixelState | null)[][]>(
      () => Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null))
    );
    const [isComplete, setIsComplete] = useState(false);
    const [showFlash, setShowFlash] = useState(false);
    const [isBlinking, setIsBlinking] = useState(false);
    const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
    const animationRef = useRef<number | null>(null);
    const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
    const blinkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);

    const cleanup = useCallback(() => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      timeoutRefs.current.forEach(clearTimeout);
      timeoutRefs.current = [];
      if (blinkIntervalRef.current) {
        clearInterval(blinkIntervalRef.current);
        blinkIntervalRef.current = null;
      }
    }, []);

    useImperativeHandle(ref, () => ({
      exportPNG: () => {
        if (!buddy) return;
        const canvas = document.createElement("canvas");
        const scale = 8;
        canvas.width = GRID_SIZE * scale;
        canvas.height = GRID_SIZE * scale;
        const ctx = canvas.getContext("2d")!;
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
      if (!isComplete || !buddy) return;

      const eyePixels = findEyePixels(buddy);
      if (eyePixels.length === 0) return;

      const startBlink = () => {
        setIsBlinking(true);
        const openTimeout = setTimeout(() => setIsBlinking(false), 150);
        timeoutRefs.current.push(openTimeout);
      };

      const scheduleBlink = () => {
        const delay = 2500 + Math.random() * 2000;
        blinkIntervalRef.current = setTimeout(() => {
          startBlink();
          scheduleBlink();
        }, delay) as unknown as ReturnType<typeof setInterval>;
      };

      const initialDelay = setTimeout(() => {
        startBlink();
        scheduleBlink();
      }, 1000 + Math.random() * 1000);
      timeoutRefs.current.push(initialDelay);

      return () => {
        if (blinkIntervalRef.current) {
          clearTimeout(blinkIntervalRef.current as unknown as ReturnType<typeof setTimeout>);
          blinkIntervalRef.current = null;
        }
      };
    }, [isComplete, buddy]);

    useEffect(() => {
      cleanup();

      if (!buddy) {
        setPixels(Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null)));
        setIsComplete(false);
        setShowFlash(false);
        setIsBlinking(false);
        setSparkles([]);
        onDrawingStateChange({
          x: null, y: null, currentColor: null,
          pixelCount: 0, totalPixels: 0,
          isDrawing: false, isComplete: false,
        });
        return;
      }

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
      setPixels(Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null)));
      setIsComplete(false);
      setShowFlash(false);
      setIsBlinking(false);
      setSparkles([]);

      onDrawingStateChange({
        x: null, y: null, currentColor: null,
        pixelCount: 0, totalPixels,
        isDrawing: true, isComplete: false,
      });

      // Initialize audio context for pop sounds
      try {
        if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
          audioCtxRef.current = new AudioContext();
        }
        if (audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume();
        }
      } catch {
        // Audio not available — proceed silently
      }

      queue.forEach((pixel, index) => {
        const timeout = setTimeout(() => {
          // Play pop sound
          if (audioCtxRef.current && audioCtxRef.current.state === "running") {
            createPopSound(audioCtxRef.current, index, totalPixels);
          }

          setPixels((prev) => {
            const next = prev.map((row) => [...row]);
            next[pixel.y][pixel.x] = { color: pixel.color, visible: true };
            return next;
          });

          onDrawingStateChange({
            x: pixel.x, y: pixel.y, currentColor: pixel.color,
            pixelCount: index + 1, totalPixels,
            isDrawing: index < totalPixels - 1,
            isComplete: index === totalPixels - 1,
          });

          if (index === totalPixels - 1) {
            const flashTimeout = setTimeout(() => {
              setShowFlash(true);
              setIsComplete(true);
              setTimeout(() => setShowFlash(false), 300);

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
        }, 40 * index + 200);
        timeoutRefs.current.push(timeout);
      });

      return cleanup;
    }, [buddy, cleanup, onDrawingStateChange]);

    const getPixelColor = useCallback(
      (x: number, y: number, baseColor: string): string => {
        if (!isBlinking || !buddy) return baseColor;
        if (buddy.sprite[y]?.[x] === EYE_PALETTE_INDEX) {
          return buddy.palette[0];
        }
        return baseColor;
      },
      [isBlinking, buddy]
    );

    return (
      <div
        className="absolute inset-0 cursor-crosshair select-none overflow-hidden"
        style={
          showGrid
            ? {
                backgroundSize: `${cellSize}px ${cellSize}px`,
                backgroundImage:
                  "linear-gradient(to right, rgba(245,240,235,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(245,240,235,0.04) 1px, transparent 1px)",
              }
            : undefined
        }
      >
        <motion.div
          className="absolute"
          style={{
            width: GRID_SIZE * cellSize,
            height: GRID_SIZE * cellSize,
            left: "50%",
            top: "50%",
            x: "-50%",
            y: "-50%",
          }}
          animate={
            isComplete
              ? { y: ["-50%", "-51.5%", "-50%"] }
              : { y: "-50%" }
          }
          transition={
            isComplete
              ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
              : undefined
          }
        >
          <div
            className={`relative w-full h-full ${
              isComplete && buddy?.isShiny
                ? "ring-2 ring-[#f59e0b] shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                : ""
            }`}
          >
            <AnimatePresence>
              {pixels.map((row, y) =>
                row.map((pixel, x) => {
                  if (!pixel || !pixel.visible) return null;
                  const color = getPixelColor(x, y, pixel.color);
                  return (
                    <motion.div
                      key={`${x}-${y}`}
                      className="absolute"
                      style={{
                        left: x * cellSize + (showGrid ? 1 : 0),
                        top: y * cellSize + (showGrid ? 1 : 0),
                        width: cellSize - (showGrid ? 1 : 0),
                        height: cellSize - (showGrid ? 1 : 0),
                        backgroundColor: color,
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

            {showFlash && (
              <motion.div
                className="absolute inset-0 bg-white pointer-events-none"
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}

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
        </motion.div>
      </div>
    );
  }
);

export default BuddyCanvas;
