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
      <button
        onClick={() => setExpanded(true)}
        className="te-button text-[9px] w-full"
      >
        Sync with Claude Code
      </button>
    );
  }

  return (
    <div className="te-inset p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="te-label">Sync with Claude Code</span>
        <button
          onClick={() => setExpanded(false)}
          className="text-[9px] font-mono text-[#5A5550] hover:text-[#8A8480] transition-colors"
        >
          [close]
        </button>
      </div>

      <div className="mb-2">
        <div className="text-[9px] font-mono text-[#8A8480] mb-1">
          Run this in your terminal:
        </div>
        <div className="flex items-center gap-1">
          <code className="flex-1 text-[9px] font-mono text-[#8A8480] bg-[#0D0E0C] border border-[#2A2520] rounded px-2 py-1.5 overflow-x-auto whitespace-nowrap">
            {COMMAND}
          </code>
          <button
            onClick={handleCopy}
            className="te-button text-[8px]"
          >
            {copied ? "OK!" : "COPY"}
          </button>
        </div>
      </div>

      <div>
        <div className="text-[9px] font-mono text-[#8A8480] mb-1">
          Paste your userId:
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center te-inset px-2 py-1.5">
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="e.g. user_abc123..."
              disabled={isDrawing}
              className="flex-1 bg-transparent text-[#F5F0EB] text-[10px] font-mono outline-none placeholder-[#5A5550] caret-[#E8734A] disabled:opacity-50"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!userId.trim() || isDrawing}
            className="te-button accent text-[9px]"
          >
            Hatch
          </button>
        </div>
      </div>
    </div>
  );
}
