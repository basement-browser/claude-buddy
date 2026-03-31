"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Buddy } from "@/lib/types";
import { RARITY_COLORS } from "@/lib/species";
import StatBar from "./StatBar";
import ShareButton from "./ShareButton";

interface InfoPanelProps {
  currentColor: string | null;
  palette: string[];
  buddy: Buddy | null;
  isComplete: boolean;
}

export default function InfoPanel({ currentColor, palette, buddy, isComplete }: InfoPanelProps) {
  return (
    <div className="flex flex-col gap-3 p-3 border-l border-[#333] bg-[#1a1a1a] w-[140px]">
      {/* Color section */}
      <div>
        <div className="text-[9px] font-mono text-[#666] uppercase tracking-wider mb-1">
          Color
        </div>
        <div
          className="w-full aspect-square border border-[#444] mb-1"
          style={{ backgroundColor: currentColor || "#333" }}
        />
        <div className="text-[9px] font-mono text-[#888] text-center">
          {currentColor || "#------"}
        </div>
      </div>

      {/* Palette section */}
      <div>
        <div className="text-[9px] font-mono text-[#666] uppercase tracking-wider mb-1">
          Palette
        </div>
        <div className="grid grid-cols-4 gap-0.5">
          {palette.map((color, i) => (
            <div
              key={i}
              className="aspect-square border border-[#444]"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Buddy info after hatching */}
      <AnimatePresence>
        {isComplete && buddy && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-2"
          >
            <div className="border-t border-[#333] pt-2">
              <div className="text-[11px] font-pixel text-[#ddd]">
                {buddy.species}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded-sm"
                  style={{
                    backgroundColor: RARITY_COLORS[buddy.rarity] + "20",
                    color: RARITY_COLORS[buddy.rarity],
                    border: `1px solid ${RARITY_COLORS[buddy.rarity]}40`,
                  }}
                >
                  {buddy.rarity}
                </span>
                {buddy.isShiny && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-sm bg-[#f59e0b20] text-[#f59e0b] border border-[#f59e0b40]">
                    SHINY
                  </span>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-col gap-1.5 border-t border-[#333] pt-2">
              <StatBar label="Vibe" value={buddy.stats.vibe} color="#4ade80" delay={0} />
              <StatBar label="Chaos" value={buddy.stats.chaos} color="#f87171" delay={0.1} />
              <StatBar label="Focus" value={buddy.stats.focus} color="#60a5fa" delay={0.2} />
              <StatBar label="Luck" value={buddy.stats.luck} color="#fbbf24" delay={0.3} />
            </div>

            {/* Soul */}
            <div className="border-t border-[#333] pt-2">
              <div className="text-[9px] font-mono text-[#666] uppercase tracking-wider mb-1">
                Soul
              </div>
              <p className="text-[10px] font-mono text-[#aaa] leading-relaxed italic">
                &ldquo;{buddy.soulDescription}&rdquo;
              </p>
            </div>

            {/* Share */}
            <div className="border-t border-[#333] pt-2">
              <ShareButton buddy={buddy} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
