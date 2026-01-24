# CLAUDE.md - docs-content

## What is docs-content?

Single source of truth for LevitateOS documentation. Consumed by both website and TUI.

## What Belongs Here

- All user-facing documentation
- Installation guides
- Command references
- Troubleshooting guides

## What Does NOT Belong Here

| Don't put here | Put it in |
|----------------|-----------|
| TUI rendering | `docs/tui/` |
| Website rendering | `website/` (submodule) |
| Developer docs | `.teams/KNOWLEDGE_*.md` |

## Key Rules

### Docs Are the Spec

Documentation = what the final ISO should be. If ISO doesn't match docs, **fix the ISO**, not the docs.

- **Wrong:** "timedatectl missing from ISO, remove from docs"
- **Right:** "timedatectl in docs, add to ISO"

### Write for Humans

```bash
# BAD - AI garbage
[ -d /sys/firmware/efi ] && echo "UEFI" || echo "BIOS"

# GOOD - Human commands
ls /sys/firmware/efi/efivars
```

Avoid: `&&` chains, `>/dev/null 2>&1`, test brackets `[ ]`.

### When to Update

Only update when:
1. User explicitly asks
2. Feature is complete AND user confirms
3. Actual error (typo, wrong path)

Do NOT update because ISO is unfinished.
