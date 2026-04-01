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

// Restore built-in Claude Code companion
const CONFIG_JSON = p.join(CLAUDE_DIR, 'config.json');
const CONFIG_BACKUP = p.join(BACKUP_DIR, 'config.json.backup');
if (fs.existsSync(CONFIG_BACKUP)) {
  try {
    const backup = JSON.parse(fs.readFileSync(CONFIG_BACKUP, 'utf8'));
    fs.writeFileSync(CONFIG_JSON, JSON.stringify(backup, null, 2));
    console.log(GREEN + '  \\u2713' + R + ' Restored built-in Claude Code companion');
  } catch {}
} else if (fs.existsSync(CONFIG_JSON)) {
  try {
    const config = JSON.parse(fs.readFileSync(CONFIG_JSON, 'utf8'));
    if (config.companionMuted) {
      delete config.companionMuted;
      fs.writeFileSync(CONFIG_JSON, JSON.stringify(config, null, 2));
      console.log(GREEN + '  \\u2713' + R + ' Restored built-in Claude Code companion');
    }
  } catch {}
}

// Remove buddy directory (after reading backups from it)
if (fs.existsSync(BUDDY_DIR)) {
  fs.rmSync(BUDDY_DIR, { recursive: true, force: true });
  console.log(GREEN + '  \\u2713' + R + ' Removed ' + DIM + '~/.claude/buddy/' + R);
}

// Auto-remove shell alias
const shell = process.env.SHELL || '';
let rcFile = p.join(HOME, '.bashrc');
let rcName = '~/.bashrc';
if (shell.includes('zsh')) { rcFile = p.join(HOME, '.zshrc'); rcName = '~/.zshrc'; }
else if (shell.includes('fish')) { rcFile = p.join(HOME, '.config', 'fish', 'config.fish'); rcName = '~/.config/fish/config.fish'; }
if (fs.existsSync(rcFile)) {
  try {
    const rc = fs.readFileSync(rcFile, 'utf8');
    if (rc.includes('.claude/buddy/claude')) {
      // Remove the alias line and its comment
      const cleaned = rc
        .split('\\n')
        .filter(l => !l.includes('.claude/buddy/claude') && !l.includes('# Claude Buddy - shows your buddy'))
        .join('\\n')
        .replace(/\\n{3,}/g, '\\n\\n'); // collapse extra blank lines
      fs.writeFileSync(rcFile, cleaned);
      console.log(GREEN + '  \\u2713' + R + ' Removed shell alias from ' + DIM + rcName + R);
    }
  } catch {}
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
