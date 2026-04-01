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
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <div className="flex-1 flex items-center gap-2 te-inset px-3 py-2.5">
        <span className="text-[11px] font-mono text-[#E8734A] font-bold">&gt;</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="enter your name to hatch a buddy..."
          disabled={isDrawing}
          className="flex-1 bg-transparent text-[#F5F0EB] text-base font-mono outline-none placeholder-[#5A5550] caret-[#E8734A] disabled:opacity-50"
          autoFocus
        />
      </div>
      <button
        type="submit"
        disabled={!name.trim() || isDrawing}
        className="te-button accent"
      >
        Hatch
      </button>
    </form>
  );
}
