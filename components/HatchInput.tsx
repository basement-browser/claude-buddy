"use client";

import { useState, useEffect } from "react";

interface HatchInputProps {
  onHatch: (name: string) => void;
  initialName?: string;
  isDrawing: boolean;
}

export default function HatchInput({ onHatch, initialName, isDrawing }: HatchInputProps) {
  const [name, setName] = useState(initialName || "");

  useEffect(() => {
    if (initialName) setName(initialName);
  }, [initialName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed && !isDrawing) {
      onHatch(trimmed);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-b border-[#333] bg-[#1a1a1a]">
      <span className="text-[10px] font-mono text-[#555]">&gt;</span>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="enter your name to hatch a buddy..."
        disabled={isDrawing}
        className="flex-1 bg-transparent text-[#ddd] text-sm font-mono outline-none placeholder-[#444] caret-[#888] disabled:opacity-50"
        autoFocus
      />
      <button
        type="submit"
        disabled={!name.trim() || isDrawing}
        className="px-4 py-1 text-[10px] font-mono uppercase tracking-wider border border-[#555] text-[#aaa] hover:bg-[#444] hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
      >
        Hatch
      </button>
    </form>
  );
}
