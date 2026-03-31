# Claude Buddy CLI — Distribution Plan

## What it does
The CLI tool (`cli/claude-buddy.mjs`) shows your Claude Code buddy in the terminal alongside usage tracking (daily/weekly tokens, peak/off-peak status).

## Commands
```
node claude-buddy.mjs                  # Dashboard: buddy + usage (auto-detects userId)
node claude-buddy.mjs "name"           # Generate buddy for any name
node claude-buddy.mjs --statusline     # Compact 1-line for Claude Code status bar
node claude-buddy.mjs --buddy-only     # Just the buddy sprite + stats
node claude-buddy.mjs --id             # Print your Claude Code userId
```

## Distribution Options

### Option A: npm package (recommended)
Users install globally and run anywhere.

**Setup:**
1. Create `package.json` in `cli/` directory:
   ```json
   {
     "name": "claude-buddy",
     "version": "1.0.0",
     "description": "Your Claude Code companion — pixel buddy + usage tracker",
     "bin": { "claude-buddy": "./claude-buddy.mjs" },
     "type": "module",
     "license": "MIT"
   }
   ```
2. Publish: `cd cli && npm publish`
3. Users install: `npm install -g claude-buddy`
4. Users run: `claude-buddy`

**Or without installing:**
```
npx claude-buddy
```

### Option B: Direct download from site
Add a route or static file that serves `claude-buddy.mjs`. Users download and run with Node.

**User flow:**
```
curl -o claude-buddy.mjs https://claudebuddy.com/cli/claude-buddy.mjs
node claude-buddy.mjs
```

### Option C: Homebrew tap
For macOS users. Requires a GitHub repo with a formula.

```
brew tap basement/claude-buddy
brew install claude-buddy
```

## Claude Code Integration

### As a statusline provider
Users add to `~/.claude/settings.json`:
```json
{
  "statusLine": {
    "command": "claude-buddy --statusline"
  }
}
```

### As an MCP tool (future)
Could extend to be an MCP server so Claude Code can reference the buddy in conversations.

## Dependencies
Zero. The script is self-contained — no `node_modules` required. Only needs Node.js 18+.

## Files the CLI reads
- `~/.claude.json` — for `userID`
- `~/.claude/usage-tracker.json` — daily/weekly token totals (written by claude-usage-rs)
- `~/.claude/usage-windows.json` — peak/off-peak promotion config

## TODO
- [ ] Create cli/package.json with bin field
- [ ] Test `npx` flow locally with `npm link`
- [ ] Publish to npm as `claude-buddy`
- [ ] Add download button to the website
- [ ] Add install instructions to site footer or info panel
