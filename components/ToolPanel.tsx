"use client";

import { motion } from "framer-motion";

const TOOLS = [
  { name: "PEN", icon: "✏️" },
  { name: "ERASE", icon: "◻️" },
  { name: "FILL", icon: "🪣" },
  { name: "LINE", icon: "📏" },
  { name: "RECT", icon: "⬜" },
  { name: "CIRC", icon: "⭕" },
];

interface ToolPanelProps {
  isDrawing: boolean;
}

export default function ToolPanel({ isDrawing }: ToolPanelProps) {
  return (
    <div className="flex flex-col gap-1 p-2 border-r border-[#333] bg-[#1a1a1a] w-[80px]">
      <div className="text-[9px] font-mono text-[#666] uppercase tracking-wider mb-1 px-1">
        Tools
      </div>
      {TOOLS.map((tool) => {
        const isActive = tool.name === "PEN";
        return (
          <motion.button
            key={tool.name}
            className={`flex items-center gap-1.5 px-2 py-1.5 text-[10px] font-mono border rounded-sm transition-colors ${
              isActive
                ? "bg-[#333] border-[#555] text-white"
                : "bg-transparent border-[#2a2a2a] text-[#666]"
            }`}
            animate={
              isActive && isDrawing
                ? { opacity: [1, 0.6, 1] }
                : {}
            }
            transition={
              isActive && isDrawing
                ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
                : {}
            }
          >
            <span className="text-[12px] leading-none">{tool.icon}</span>
            <span>{tool.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
