# Notification Beep for Claude Code Completion

## Goal
Play a notification beep whenever Claude Code finishes responding using Claude Code hooks.

## Solution: Use the Stop Hook

The `Stop` hook runs when the main Claude Code agent has finished responding (does not run if stopped by user interrupt).

## Implementation Steps

### Step 1: Choose Your Notification Sound

Pick one of these macOS notification methods:

**Option A: System Sound (Recommended)**
```bash
afplay /System/Library/Sounds/Ping.aiff
```

**Option B: Terminal Bell**
```bash
printf '\a'
```

**Option C: Custom Sound**
```bash
afplay /path/to/your/custom/sound.mp3
```

**Option D: Voice Notification**
```bash
say "Done"
```

### Step 2: Create a Hook Script (Optional but Recommended)

Create a script at `~/.config/claude/hooks/notify-complete.sh`:

```bash
#!/bin/bash
# Play notification when Claude Code finishes

# Play system sound
afplay /System/Library/Sounds/Ping.aiff

# Exit successfully to allow Claude to stop normally
exit 0
```

Make it executable:
```bash
chmod +x ~/.config/claude/hooks/notify-complete.sh
```

### Step 3: Configure the Hook

Add to your Claude Code settings (`.claude/settings.json` in your project or global settings):

**Simple approach (inline command):**
```json
{
  "hooks": {
    "Stop": {
      "type": "command",
      "command": "afplay /System/Library/Sounds/Ping.aiff"
    }
  }
}
```

**Script approach (recommended):**
```json
{
  "hooks": {
    "Stop": {
      "type": "command",
      "command": "~/.config/claude/hooks/notify-complete.sh"
    }
  }
}
```

### Step 4: Test the Hook

1. Save the settings configuration
2. Restart Claude Code or reload settings
3. Ask Claude Code to perform a simple task
4. Listen for the beep when Claude finishes responding

## Available macOS System Sounds

Located in `/System/Library/Sounds/`:
- Basso.aiff
- Blow.aiff
- Bottle.aiff
- Frog.aiff
- Funk.aiff
- Glass.aiff
- Hero.aiff
- Morse.aiff
- Ping.aiff
- Pop.aiff
- Purr.aiff
- Sosumi.aiff
- Submarine.aiff
- Tink.aiff

Test them with: `afplay /System/Library/Sounds/[SoundName].aiff`

## Important Notes

- The Stop hook only runs when Claude Code finishes normally (not when interrupted by user)
- Keep the command fast to avoid delays
- Use `exit 0` to allow Claude to stop normally
- Use `exit 1` with a reason if you want to block the stop (not recommended for notifications)

## Troubleshooting

If the beep doesn't play:
1. Check that the sound file exists and is accessible
2. Verify the hook configuration is valid JSON
3. Check Claude Code logs for hook execution errors
4. Test the command manually in terminal first
5. Ensure the hook script has executable permissions (if using a script)

## Advanced: Multiple Notifications

You can combine multiple notification methods:

```bash
#!/bin/bash
# Play sound
afplay /System/Library/Sounds/Glass.aiff &

# Show notification (requires terminal-notifier: brew install terminal-notifier)
# terminal-notifier -message "Claude Code finished" -title "Claude Code"

exit 0
```
