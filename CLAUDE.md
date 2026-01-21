# CLAUDE.md - Docs Content

## ⛔ STOP. READ. THEN ACT.

Every time you think you know where something goes - **stop. Read first.**

Every time you think something is worthless and should be deleted - **stop. Read it first.**

Every time you're about to write code - **stop. Read what already exists first.**

The five minutes you spend reading will save hours of cleanup.

---

## Docs Are the Spec

Documentation = what the final ISO should be. If ISO doesn't match docs, fix the ISO - NOT the docs.

**Wrong:** "timedatectl missing from ISO, remove from docs"
**Right:** "timedatectl in docs, add to ISO"

## Write for Humans

```bash
# BAD - AI garbage
[ -d /sys/firmware/efi ] && echo "UEFI" || echo "BIOS"
command -v nano >/dev/null 2>&1 && echo "installed"

# GOOD - Human commands
ls /sys/firmware/efi/efivars
which nano
```

Avoid: `&&` chains, `>/dev/null 2>&1`, test brackets `[ ]`, excessive error handling.

## When to Update

Only update docs when:
1. User explicitly asks
2. Feature complete AND user confirms
3. Actual error (typo, wrong path)

Do NOT update because ISO is unfinished.
