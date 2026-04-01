export const runtime = "edge";

const UNINSTALL_SCRIPT = `#!/usr/bin/env node
// Claude Buddy Uninstaller - https://claudebuddy.me

const fs = require('fs');
const os = require('os');
const p = require('path');

const R = '\\x1b[0m';
const DIM = '\\x1b[2m';
const GREEN = '\\x1b[32m';
const ORANGE = '\\x1b[38;2;232;115;74m';

const HOME = os.homedir();
const CLAUDE_DIR = p.join(HOME, '.claude');
const BUDDY_DIR = p.join(CLAUDE_DIR, 'buddy');
const BUDDY_JSON = p.join(CLAUDE_DIR, 'buddy.json');
const SETTINGS_JSON = p.join(CLAUDE_DIR, 'settings.json');
const BACKUP_DIR = p.join(BUDDY_DIR, 'backup');
const SETTINGS_BACKUP = p.join(BACKUP_DIR, 'settings.json.backup');

console.log('');
console.log(ORANGE + '  Uninstalling Claude Buddy...' + R);
console.log('');

let buddyName = '';
// Read buddy info before removing
if (fs.existsSync(BUDDY_JSON)) {
  try {
    const b = JSON.parse(fs.readFileSync(BUDDY_JSON, 'utf8'));
    buddyName = b.species || '';
  } catch {}
}

// Restore settings.json from backup
if (fs.existsSync(SETTINGS_BACKUP)) {
  try {
    const backup = JSON.parse(fs.readFileSync(SETTINGS_BACKUP, 'utf8'));
    fs.writeFileSync(SETTINGS_JSON, JSON.stringify(backup, null, 2));
    console.log(GREEN + '  \\u2713' + R + ' Restored original settings.json');
  } catch {
    // If backup is corrupted, just remove our statusline entry
    removeStatuslineEntry();
  }
} else {
  removeStatuslineEntry();
}

function removeStatuslineEntry() {
  if (fs.existsSync(SETTINGS_JSON)) {
    try {
      const settings = JSON.parse(fs.readFileSync(SETTINGS_JSON, 'utf8'));
      if (settings.statusLine?.command?.includes('buddy/statusline.sh')) {
        delete settings.statusLine;
        fs.writeFileSync(SETTINGS_JSON, JSON.stringify(settings, null, 2));
        console.log(GREEN + '  \\u2713' + R + ' Removed buddy statusline config');
      }
    } catch {}
  }
}

// Remove buddy.json
if (fs.existsSync(BUDDY_JSON)) {
  fs.unlinkSync(BUDDY_JSON);
  console.log(GREEN + '  \\u2713' + R + ' Removed ' + DIM + '~/.claude/buddy.json' + R);
}

// Remove buddy directory
if (fs.existsSync(BUDDY_DIR)) {
  fs.rmSync(BUDDY_DIR, { recursive: true, force: true });
  console.log(GREEN + '  \\u2713' + R + ' Removed ' + DIM + '~/.claude/buddy/' + R);
}

console.log('');
if (buddyName) {
  console.log('  ' + DIM + buddyName + ' has been released back into the wild.' + R);
} else {
  console.log('  ' + DIM + 'Claude Buddy has been uninstalled.' + R);
}
console.log('  ' + DIM + 'Restart Claude Code to apply changes.' + R);
console.log('');
`;

export async function GET() {
  return new Response(UNINSTALL_SCRIPT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
