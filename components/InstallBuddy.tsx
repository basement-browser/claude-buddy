"use client";

import { useState, useMemo } from "react";
import { Buddy } from "@/lib/types";

interface InstallBuddyProps {
  buddy: Buddy;
  expanded: boolean;
  onToggle: (open: boolean) => void;
}

function getInstallCommand(buddy: Buddy): string {
  const name = encodeURIComponent(buddy.name);
  return `curl -fsSL https://claudebuddy.me/install/${name} | node`;
}

const UNINSTALL_CMD = "curl -fsSL https://claudebuddy.me/uninstall | node";

export default function InstallBuddy({ buddy, expanded, onToggle }: InstallBuddyProps) {
  const [copied, setCopied] = useState<"install" | "uninstall" | false>(false);

  const installCmd = useMemo(() => getInstallCommand(buddy), [buddy]);

  const handleCopy = async (text: string, which: "install" | "uninstall") => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(which);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!expanded) {
    return (
      <button
        onClick={() => onToggle(true)}
        className="te-button accent text-[9px] w-full"
      >
        Set as Claude Code Buddy
      </button>
    );
  }

  return (
    <div className="te-inset p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="te-label">Install as Claude Code Buddy</span>
        <button
          onClick={() => onToggle(false)}
          className="text-[9px] font-mono text-[#5A5550] hover:text-[#8A8480] transition-colors"
        >
          [close]
        </button>
      </div>

      <div className="text-[9px] font-mono text-[#8A8480] mb-2 leading-relaxed">
        Paste this in your terminal to install{" "}
        <span className="text-[#F5F0EB]">{buddy.species}</span> into Claude
        Code:
      </div>

      <div className="flex items-start gap-1 mb-2">
        <code className="flex-1 text-[8px] font-mono text-[#8A8480] bg-[#0D0E0C] border border-[#2A2520] rounded px-2 py-1.5 overflow-x-auto whitespace-nowrap max-h-[60px] block">
          {installCmd}
        </code>
        <button
          onClick={() => handleCopy(installCmd, "install")}
          className="te-button text-[8px] shrink-0"
        >
          {copied === "install" ? "OK!" : "COPY"}
        </button>
      </div>

      <div className="text-[8px] font-mono text-[#5A5550] leading-relaxed space-y-0.5">
        <div>
          <span className="text-[#8A8480]">{">"}</span> Saves buddy to{" "}
          <span className="text-[#8A8480]">~/.claude/buddy.json</span>
        </div>
        <div>
          <span className="text-[#8A8480]">{">"}</span> Adds pixel art renderer
          at{" "}
          <span className="text-[#8A8480]">~/.claude/buddy/render.cjs</span>
        </div>
        <div>
          <span className="text-[#8A8480]">{">"}</span> Configures Claude Code
          statusline
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-[#2A2520]">
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-mono text-[#5A5550]">
            To uninstall:
          </span>
          <button
            onClick={() => handleCopy(UNINSTALL_CMD, "uninstall")}
            className="text-[8px] font-mono text-[#5A5550] hover:text-[#8A8480] transition-colors"
          >
            {copied === "uninstall" ? "[copied!]" : "[copy]"}
          </button>
        </div>
        <code className="text-[7px] font-mono text-[#5A5550] block mt-0.5">
          {UNINSTALL_CMD}
        </code>
      </div>
    </div>
  );
}
