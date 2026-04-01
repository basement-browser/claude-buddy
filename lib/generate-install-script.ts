import { Buddy } from "./types";

/** Encode a 16x16 sprite grid into a compact 256-char string */
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

const RARITY_STARS: Record<string, string> = {
  Common: "\u2605",
  Uncommon: "\u2605\u2605",
  Rare: "\u2605\u2605\u2605",
  Epic: "\u2605\u2605\u2605\u2605",
  Legendary: "\u2605\u2605\u2605\u2605\u2605",
};

/**
 * The minimal pixel-art renderer script (~2KB).
 * Reads ~/.claude/buddy.json and renders the 16x16 sprite in terminal.
 */
const RENDER_SCRIPT = `#!/usr/bin/env node
const fs=require('fs'),os=require('os'),p=require('path');
const f=p.join(os.homedir(),'.claude','buddy.json');
if(!fs.existsSync(f)){console.log('No buddy installed. Visit https://claudebuddy.me');process.exit(1)}
const b=JSON.parse(fs.readFileSync(f,'utf8'));
const R='\\x1b[0m';
const bg=(h)=>{const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),bl=parseInt(h.slice(5,7),16);return\`\\x1b[48;2;\${r};\${g};\${bl}m\`};
const fg=(h)=>{const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),bl=parseInt(h.slice(5,7),16);return\`\\x1b[38;2;\${r};\${g};\${bl}m\`};
const rc={'Common':'\\x1b[37m','Uncommon':'\\x1b[32m','Rare':'\\x1b[34m','Epic':'\\x1b[35m','Legendary':'\\x1b[33m'};
const stars={'Common':'\\u2605','Uncommon':'\\u2605\\u2605','Rare':'\\u2605\\u2605\\u2605','Epic':'\\u2605\\u2605\\u2605\\u2605','Legendary':'\\u2605\\u2605\\u2605\\u2605\\u2605'};
const compact=process.argv.includes('--compact');
if(compact){
  const c=rc[b.rarity]||'';
  const sh=b.isShiny?'\\u2726 ':'';
  console.log(c+sh+b.species+' '+stars[b.rarity]+R);
  process.exit(0);
}
console.log('');
const sh=b.isShiny?'\\x1b[33m\\u2726 \\x1b[0m':'';
console.log('  '+(rc[b.rarity]||'')+sh+b.species+' '+stars[b.rarity]+R+'  '+'\\x1b[2m'+b.rarity+(b.isShiny?' Shiny':'')+R);
console.log('');
for(let y=0;y<16;y++){
  let l='  ';
  for(let x=0;x<16;x++){
    const idx=b.sprite[y]?.[x];
    if(idx!==null&&idx!==undefined)l+=bg(b.palette[idx])+'  '+R;
    else l+='  ';
  }
  console.log(l);
}
console.log('');
const bar=(v,c)=>{const f=Math.round(v/99*10);return c+'\\u2588'.repeat(f)+R+'\\x1b[2m'+'\\u2591'.repeat(10-f)+R};
console.log('  '+bar(b.stats.vibe,'\\x1b[32m')+' VIB '+bar(b.stats.chaos,'\\x1b[31m')+' CHA');
console.log('  '+bar(b.stats.focus,'\\x1b[34m')+' FOC '+bar(b.stats.luck,'\\x1b[33m')+' LCK');
console.log('');
console.log('  \\x1b[2m"'+b.soul+'"'+R);
console.log('');
`;

/**
 * Generate the full install script for a buddy.
 * Returns a Node.js script that sets up everything when piped to `node`.
 */
export function generateInstallScript(buddy: Buddy, baseUrl: string): string {
  const encoded = encodeSprite(buddy.sprite);
  const buddyJson = JSON.stringify(
    {
      species: buddy.species,
      rarity: buddy.rarity,
      isShiny: buddy.isShiny,
      palette: buddy.palette,
      sprite: "SPRITE_PLACEHOLDER",
      stats: buddy.stats,
      soul: buddy.soulDescription,
      name: buddy.name,
      installedAt: "DATE_PLACEHOLDER",
    },
    null,
    2
  );

  const rarityColor: Record<string, string> = {
    Common: "\\x1b[37m",
    Uncommon: "\\x1b[32m",
    Rare: "\\x1b[34m",
    Epic: "\\x1b[35m",
    Legendary: "\\x1b[33m",
  };
  const rc = rarityColor[buddy.rarity] || "";
  const stars = RARITY_STARS[buddy.rarity] || "";

  return `#!/usr/bin/env node
// Claude Buddy Installer - https://claudebuddy.me
// Installs ${buddy.species} (${buddy.rarity}${buddy.isShiny ? " Shiny" : ""}) as your Claude Code buddy

const fs = require('fs');
const os = require('os');
const p = require('path');

const R = '\\x1b[0m';
const BOLD = '\\x1b[1m';
const DIM = '\\x1b[2m';
const GREEN = '\\x1b[32m';
const ORANGE = '\\x1b[38;2;232;115;74m';
const bg = (h) => { const r = parseInt(h.slice(1,3),16), g = parseInt(h.slice(3,5),16), bl = parseInt(h.slice(5,7),16); return \`\\x1b[48;2;\${r};\${g};\${bl}m\`; };

const HOME = os.homedir();
const CLAUDE_DIR = p.join(HOME, '.claude');
const BUDDY_DIR = p.join(CLAUDE_DIR, 'buddy');
const BUDDY_JSON = p.join(CLAUDE_DIR, 'buddy.json');
const SETTINGS_JSON = p.join(CLAUDE_DIR, 'settings.json');
const BACKUP_DIR = p.join(BUDDY_DIR, 'backup');

// ── Decode sprite ──
const encoded = '${encoded}';
const sprite = [];
for (let y = 0; y < 16; y++) {
  const row = [];
  for (let x = 0; x < 16; x++) {
    const c = encoded[y * 16 + x];
    row.push(c === '.' ? null : +c);
  }
  sprite.push(row);
}

// ── Buddy data ──
const buddyData = ${buddyJson
    .replace('"SPRITE_PLACEHOLDER"', "sprite")
    .replace('"DATE_PLACEHOLDER"', "new Date().toISOString()")};

// ── Statusline wrapper ──
const statuslineWrapper = \`#!/bin/bash
# Claude Buddy statusline wrapper
# Prepends buddy info to your existing statusline

# Save stdin so we can pass it to the original statusline too
INPUT=$(cat)

BUDDY_JSON="$HOME/.claude/buddy.json"
BUDDY_PART=""
if [ -f "$BUDDY_JSON" ]; then
  BUDDY_PART=$(node -e "const b=JSON.parse(require('fs').readFileSync(process.env.HOME+'/.claude/buddy.json','utf8'));const s={'Common':'\\\\u2605','Uncommon':'\\\\u2605\\\\u2605','Rare':'\\\\u2605\\\\u2605\\\\u2605','Epic':'\\\\u2605\\\\u2605\\\\u2605\\\\u2605','Legendary':'\\\\u2605\\\\u2605\\\\u2605\\\\u2605\\\\u2605'};const c={'Common':'\\\\x1b[37m','Uncommon':'\\\\x1b[32m','Rare':'\\\\x1b[34m','Epic':'\\\\x1b[35m','Legendary':'\\\\x1b[33m'};const sh=b.isShiny?'\\\\x1b[33m\\\\u2726 \\\\x1b[0m':'';process.stdout.write(c[b.rarity]+sh+b.species+' '+s[b.rarity]+'\\\\x1b[0m')" 2>/dev/null)
fi

# Run existing statusline if backed up, passing saved stdin
EXISTING_CMD="$HOME/.claude/buddy/backup/statusline-original.sh"
EXISTING_OUTPUT=""
if [ -f "$EXISTING_CMD" ] && [ -x "$EXISTING_CMD" ]; then
  EXISTING_OUTPUT=$(echo "$INPUT" | "$EXISTING_CMD")
fi

if [ -n "$BUDDY_PART" ] && [ -n "$EXISTING_OUTPUT" ]; then
  printf "%s | %s\\n" "$BUDDY_PART" "$EXISTING_OUTPUT"
elif [ -n "$BUDDY_PART" ]; then
  printf "%s\\n" "$BUDDY_PART"
elif [ -n "$EXISTING_OUTPUT" ]; then
  printf "%s\\n" "$EXISTING_OUTPUT"
fi
\`;

// ── Render script ──
const renderScript = ${JSON.stringify(RENDER_SCRIPT)};

// ── Install ──
console.log('');
console.log(ORANGE + '  \u2728 Installing Claude Buddy...' + R);
console.log('');

// Create directories
fs.mkdirSync(BUDDY_DIR, { recursive: true });
fs.mkdirSync(BACKUP_DIR, { recursive: true });

// Write buddy.json
fs.writeFileSync(BUDDY_JSON, JSON.stringify(buddyData, null, 2));

// Write renderer
fs.writeFileSync(p.join(BUDDY_DIR, 'render.cjs'), renderScript, { mode: 0o755 });

// Write statusline wrapper
fs.writeFileSync(p.join(BUDDY_DIR, 'statusline.sh'), statuslineWrapper, { mode: 0o755 });

// Back up and update settings.json
let settings = {};
if (fs.existsSync(SETTINGS_JSON)) {
  try {
    settings = JSON.parse(fs.readFileSync(SETTINGS_JSON, 'utf8'));
    // Back up existing settings
    fs.writeFileSync(p.join(BACKUP_DIR, 'settings.json.backup'), JSON.stringify(settings, null, 2));
  } catch {}
}

// Back up existing statusline command if it points to a different script
const existingCmd = settings.statusLine?.command;
if (existingCmd && !existingCmd.includes('buddy/statusline.sh')) {
  // Resolve ~ in path
  const resolved = existingCmd.replace(/^~/, HOME);
  if (fs.existsSync(resolved)) {
    fs.copyFileSync(resolved, p.join(BACKUP_DIR, 'statusline-original.sh'));
    fs.chmodSync(p.join(BACKUP_DIR, 'statusline-original.sh'), 0o755);
  }
}

// Update settings to use our wrapper
settings.statusLine = {
  type: 'command',
  command: '~/.claude/buddy/statusline.sh',
};
fs.writeFileSync(SETTINGS_JSON, JSON.stringify(settings, null, 2));

// ── Show buddy preview ──
const palette = ${JSON.stringify(buddy.palette)};
for (let y = 0; y < 16; y++) {
  let line = '  ';
  for (let x = 0; x < 16; x++) {
    const idx = sprite[y]?.[x];
    if (idx !== null && idx !== undefined) line += bg(palette[idx]) + '  ' + R;
    else line += '  ';
  }
  console.log(line);
}

console.log('');
console.log('  ' + '${rc}' + ${buddy.isShiny ? "'\\x1b[33m\\u2726 \\x1b[0m' + " : ""}'\u2588\u2588 ${buddy.species} ${stars}' + R + '  ' + DIM + '${buddy.rarity}${buddy.isShiny ? " Shiny" : ""}' + R);
console.log('  ' + DIM + '"${buddy.soulDescription}"' + R);
console.log('');
console.log(GREEN + '  \\u2713' + R + ' Buddy data saved to ' + DIM + '~/.claude/buddy.json' + R);
console.log(GREEN + '  \\u2713' + R + ' Pixel art renderer at ' + DIM + '~/.claude/buddy/render.cjs' + R);
console.log(GREEN + '  \\u2713' + R + ' Statusline configured ' + DIM + '(restart Claude Code to see it)' + R);
console.log('');
console.log('  ' + DIM + 'See your buddy anytime:  ' + R + 'node ~/.claude/buddy/render.cjs');
console.log('  ' + DIM + 'Uninstall:               ' + R + 'curl -fsSL ${baseUrl}/uninstall | node');
console.log('');
`;
}
