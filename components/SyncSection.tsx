"use client";

import { useState } from "react";

interface SyncSectionProps {
  onHatch: (userId: string) => void;
  isDrawing: boolean;
}

const COMMAND = `node -e "console.log(JSON.parse(require('fs').readFileSync(require('os').homedir()+'/.claude.json','utf8')).userID)"`;

export default function SyncSection({ onHatch, isDrawing }: SyncSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const [userId, setUserId] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(COMMAND);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = COMMAND;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = () => {
    const trimmed = userId.trim();
    if (trimmed && !isDrawing) {
      onHatch(trimmed);
    }
  };

  if (!expanded) {
    return (
      <div className="flex items-center justify-center px-4 py-1.5 border-b border-[#282828] bg-[#151515]">
        <button
          onClick={() => setExpanded(true)}
          className="text-[9px] font-mono text-[#444] tracking-wider hover:text-[#888] transition-colors"
        >
          [ SYNC WITH CLAUDE CODE ]
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 px-4 py-3 border-b border-[#333] bg-[#1a1a1a]">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-mono text-[#666] uppercase tracking-wider">
          Sync with Claude Code
        </span>
        <button
          onClick={() => setExpanded(false)}
          className="text-[9px] font-mono text-[#444] hover:text-[#888] transition-colors"
        >
          [close]
        </button>
      </div>

      <div>
        <div className="text-[9px] font-mono text-[#888] mb-1">
          Run this in your terminal:
        </div>
        <div className="flex items-center gap-1">
          <code className="flex-1 text-[10px] font-mono text-[#aaa] bg-[#111] border border-[#333] px-2 py-1.5 overflow-x-auto whitespace-nowrap">
            {COMMAND}
          </code>
          <button
            onClick={handleCopy}
            className="shrink-0 px-2 py-1.5 text-[9px] font-mono text-[#666] border border-[#333] hover:bg-[#333] hover:text-[#ccc] transition-colors"
          >
            {copied ? "OK!" : "COPY"}
          </button>
        </div>
      </div>

      <div>
        <div className="text-[9px] font-mono text-[#888] mb-1">
          Paste your userId:
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="e.g. user_abc123..."
            disabled={isDrawing}
            className="flex-1 bg-[#111] text-[#ddd] text-[10px] font-mono outline-none placeholder-[#444] caret-[#888] border border-[#333] px-2 py-1.5 disabled:opacity-50"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!userId.trim() || isDrawing}
            className="shrink-0 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider border border-[#555] text-[#aaa] hover:bg-[#444] hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          >
            HATCH MY BUDDY
          </button>
        </div>
      </div>
    </div>
  );
}
