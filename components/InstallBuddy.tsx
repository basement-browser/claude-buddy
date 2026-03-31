"use client";

import { useState, useMemo } from "react";
import { Buddy } from "@/lib/types";

interface InstallBuddyProps {
  buddy: Buddy;
}

/**
 * Encode a 16x16 sprite grid into a compact string.
 * Each pixel becomes one char: '0'-'3' for palette indices, '.' for transparent.
 * 256 chars total for the full grid.
 */
function encodeSprite(sprite: (number | null)[][]): string {
  let out = "";
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const v = sprite[y]?.[x];
      out += v === null || v === undefined ? "." : String(v);
    }
  }
  return out;
}

function generateInstallCommand(buddy: Buddy): string {
  const encoded = encodeSprite(buddy.sprite);
  const palette = JSON.stringify(buddy.palette);
  const data = {
    species: buddy.species,
    rarity: buddy.rarity,
    isShiny: buddy.isShiny,
    palette: "__PALETTE__",
    sprite: "__SPRITE__",
    stats: buddy.stats,
    soul: buddy.soulDescription,
    name: buddy.name,
    installedAt: "__DATE__",
  };

  // Build a node one-liner that decodes the sprite and writes the file
  const jsonStr = JSON.stringify(data);
  const script = [
    `const fs=require('fs'),os=require('os'),p=require('path');`,
    `const s='${encoded}';`,
    `const grid=[];for(let y=0;y<16;y++){const r=[];for(let x=0;x<16;x++){const c=s[y*16+x];r.push(c==='.'?null:+c)}grid.push(r)}`,
    `const d=${jsonStr.replace('"__PALETTE__"', palette).replace('"__SPRITE__"', 'grid').replace('"__DATE__"', 'new Date().toISOString()')};`,
    `const dir=p.join(os.homedir(),'.claude');`,
    `try{fs.mkdirSync(dir,{recursive:true})}catch{}`,
    `fs.writeFileSync(p.join(dir,'buddy.json'),JSON.stringify(d,null,2));`,
    `console.log('Buddy installed: '+d.species+' ('+d.rarity+')')`,
  ].join("");

  return `node -e "${script.replace(/"/g, '\\"')}"`;
}

export default function InstallBuddy({ buddy }: InstallBuddyProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const command = useMemo(() => generateInstallCommand(buddy), [buddy]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = command;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
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
          onClick={() => setExpanded(false)}
          className="text-[9px] font-mono text-[#5A5550] hover:text-[#8A8480] transition-colors"
        >
          [close]
        </button>
      </div>

      <div className="text-[9px] font-mono text-[#8A8480] mb-2 leading-relaxed">
        Paste this in your terminal to set <span className="text-[#F5F0EB]">{buddy.species}</span> as
        your Claude Code buddy character:
      </div>

      <div className="flex items-start gap-1">
        <code className="flex-1 text-[8px] font-mono text-[#8A8480] bg-[#0D0E0C] border border-[#2A2520] rounded px-2 py-1.5 overflow-x-auto whitespace-nowrap max-h-[60px] block">
          {command}
        </code>
        <button
          onClick={handleCopy}
          className="te-button text-[8px] shrink-0"
        >
          {copied ? "OK!" : "COPY"}
        </button>
      </div>

      <div className="text-[8px] font-mono text-[#5A5550] mt-2 leading-relaxed">
        Writes to <span className="text-[#8A8480]">~/.claude/buddy.json</span>
      </div>
    </div>
  );
}
