# CLAUDE.md - Documentation Rules

## The Docs Are the Goal

The documentation represents what the **final** LevitateOS ISO should be. It's the specification, the target, the north star.

**During development:**
- The ISO is being built toward the docs, not the other way around
- If a feature in the docs doesn't work in the current ISO, the ISO needs updating - NOT the docs
- Do NOT modify docs to match an unfinished ISO
- Only update docs when explicitly told to, when it makes sense

**Example of WRONG thinking:**
> "timedatectl doesn't exist in the ISO, let me remove it from the docs"

**Correct thinking:**
> "timedatectl is in the docs, so it needs to be added to the ISO"

---

## Write for Humans, Not LLMs

The docs are read by humans. Write like a human would.

### DO NOT write:
```bash
# Typical AI garbage
[ -d /sys/firmware/efi ] && echo "UEFI boot: OK" || echo "BIOS mode"
test -f /etc/passwd && echo "exists" || echo "missing"
command -v nano >/dev/null 2>&1 && echo "installed"
```

### DO write:
```bash
# Natural commands humans actually typeCan y
ls /sys/firmware/efi/efivars
cat /etc/passwd
which nano
```

### Signs your docs look AI-generated:
- `&&` chains with echo for "success/failure" messages
- Excessive error handling in example commands
- `>/dev/null 2>&1` in user-facing examples
- Test brackets `[ ]` or `[[ ]]` in standalone commands
- Overly verbose comments explaining obvious things

### How humans write commands:
- Direct commands that show output naturally
- Let the command's own output indicate success/failure
- Trust the user to interpret results
- Keep it simple

---

## LLM-Specific Content Has Its Place

If something is specifically for LLM consumption (training data, structured prompts, etc.), it goes in dedicated files with appropriate syntax/format - NOT in user-facing documentation.

---

## When to Update Docs

Only update documentation when:
1. User explicitly asks to update docs
2. A feature is complete AND user confirms docs should reflect it
3. There's an actual error in the docs (typo, wrong path, etc.)

Do NOT update docs because:
- The current ISO doesn't have a feature yet
- You think something could be "improved"
- You want to add AI-style "helpful" patterns
