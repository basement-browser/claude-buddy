"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Buddy, STAT_NAMES, RARITY_STARS } from "@/lib/types";
import { RARITY_COLORS } from "@/lib/species";
import StatBar from "./StatBar";

const STAT_COLORS: Record<string, string> = {
  DEBUGGING: "#4ade80",
  PATIENCE: "#60a5fa",
  CHAOS: "#f87171",
  WISDOM: "#c084fc",
  SNARK: "#fbbf24",
};

interface InfoPanelProps {
  currentColor: string | null;
  palette: string[];
  buddy: Buddy | null;
  isComplete: boolean;
  onSave: () => void;
}

export default function InfoPanel({ currentColor, palette, buddy, isComplete, onSave }: InfoPanelProps) {
  return (
    <div className="te-inset p-3">
      <div className="te-label mb-2">Readout</div>

      <div className="flex gap-3 mb-3">
        {/* Color display */}
        <div>
          <div
            className="w-10 h-10 border border-[#3A3530] rounded-sm mb-1"
            style={{ backgroundColor: currentColor || "#2A2520" }}
          />
          <div className="text-[8px] font-mono text-[#5A5550] text-center">
            {currentColor || "#------"}
          </div>
        </div>

        {/* Palette */}
        <div>
          <div className="grid grid-cols-4 gap-0.5 mb-1">
            {palette.map((color, i) => (
              <div
                key={i}
                className="w-5 h-5 border border-[#3A3530] rounded-sm"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="text-[8px] font-mono text-[#5A5550]">Palette</div>
        </div>
      </div>

      {/* Buddy info after hatching */}
      <AnimatePresence>
        {isComplete && buddy && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-2"
          >
            <div className="te-groove my-1" />

            <div className="flex items-center gap-2">
              <div className="text-[11px] font-pixel text-[#F5F0EB] capitalize">
                {buddy.species}
              </div>
              <span
                className="text-[8px] font-mono px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: RARITY_COLORS[buddy.rarity] + "20",
                  color: RARITY_COLORS[buddy.rarity],
                  border: `1px solid ${RARITY_COLORS[buddy.rarity]}40`,
                }}
              >
                {RARITY_STARS[buddy.rarity]} {buddy.rarity}
              </span>
              {buddy.isShiny && (
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#f59e0b20] text-[#f59e0b] border border-[#f59e0b40]">
                  SHINY
                </span>
              )}
            </div>

            {/* Eye & Hat */}
            <div className="flex items-center gap-3 text-[9px] font-mono text-[#8A8480]">
              <span>Eye: {buddy.eye}</span>
              {buddy.hat !== "none" && <span>Hat: {buddy.hat}</span>}
            </div>

            {/* Stats */}
            <div className="flex flex-col gap-1.5 mt-1">
              {STAT_NAMES.map((name, i) => (
                <StatBar
                  key={name}
                  label={name}
                  value={buddy.stats[name]}
                  color={STAT_COLORS[name]}
                  delay={i * 0.1}
                />
              ))}
            </div>

            {/* Soul */}
            <div className="te-groove my-1" />
            <p className="text-[10px] font-mono text-[#8A8480] leading-relaxed italic">
              &ldquo;{buddy.soulDescription}&rdquo;
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
