"use client";

import { motion } from "framer-motion";

interface StatBarProps {
  label: string;
  value: number;
  color: string;
  delay?: number;
}

export default function StatBar({ label, value, color, delay = 0 }: StatBarProps) {
  return (
    <div className="flex items-center gap-2 text-[10px] font-mono">
      <span className="text-[#8A8480] w-12 uppercase">{label}</span>
      <div className="flex-1 h-2 bg-[#0D0E0C] border border-[#2A2520] rounded-sm relative overflow-hidden">
        <motion.div
          className="h-full rounded-sm"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, delay, ease: "easeOut" }}
        />
      </div>
      <span className="text-[#F5F0EB] w-6 text-right">{value}</span>
    </div>
  );
}
