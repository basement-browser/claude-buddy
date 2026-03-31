"use client";

import { useState } from "react";
import { Buddy } from "@/lib/types";

interface ShareButtonProps {
  buddy: Buddy;
}

export default function ShareButton({ buddy }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shinyLabel = buddy.isShiny ? "SHINY " : "";
    const url = typeof window !== "undefined"
      ? `${window.location.origin}?name=${encodeURIComponent(buddy.name)}`
      : "";

    const text = `I just hatched a ${shinyLabel}${buddy.species} in Claude Buddy!

${buddy.rarity} — Vibe: ${buddy.stats.vibe} / Chaos: ${buddy.stats.chaos} / Focus: ${buddy.stats.focus} / Luck: ${buddy.stats.luck}

"${buddy.soulDescription}"

Hatch yours: ${url}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="w-full px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider border border-[#555] text-[#ccc] hover:bg-[#444] hover:text-white transition-colors"
    >
      {copied ? "COPIED!" : "SHARE"}
    </button>
  );
}
