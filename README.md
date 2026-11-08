# @levitate/docs-content

> **STOP. READ. THEN ACT.** Before writing code, read the existing content files. Before deleting anything, read it first.

Structured documentation content library for LevitateOS. Single source of truth consumed by both website and TUI viewer.

## Status

| Metric | Value |
|--------|-------|
| Stage | Beta |
| Target | TypeScript/Bun |
| Last verified | 2026-01-23 |

### Works

- Structured content types (text, code, table, list, interactive, command, qa, note); every renderer handles each
- One install guide for every distro: distro pages are written once from the distro facts
- The install procedure (`./install`), which the guide, the install TUIs and the website render

### Known Issues

- See parent repo issues

---

## Author

<!-- HUMAN WRITTEN - DO NOT MODIFY -->

[Waiting for human input]

<!-- END HUMAN WRITTEN -->

---

## Installation

```bash
bun add @levitate/docs-content
```

## Usage

```typescript
import { docsFor, docsNav, sharedPages } from "@levitate/docs-content"
import { installSteps, commands } from "@levitate/docs-content/install"

const pages = docsFor("acorn") // every page AcornOS has, by slug
```

## Pages

A page is `src/content/<NN-section>/<NN-page>.ts` with one default export: a `DocsContent`
object (a page every distro shares), or `distroPage((d) => ...)` (a page written once and
rendered for every distro from its facts, under the same slug and title). The file name is
the slug. Per-distro wording goes through a fact (`src/pages.ts`, `src/distros.ts`), never
through the distro's name. `bun run build` refuses a misnamed file, a missing or extra
export, an unknown field or block type, a distro-dependent title and a duplicate slug, and
writes `src/generated/index.ts` (not tracked: run it after checkout, and after editing a page).

## Development

```bash
bun run typecheck   # Validate types
bun run lint        # Run linter
bun run format      # Format code
bun run check       # Run all checks
```

## License

MIT
