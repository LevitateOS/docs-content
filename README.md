# @levitate/docs-content

> **STOP. READ. THEN ACT.** Before writing code, read the existing content files. Before deleting anything, read it first.

Structured documentation content library for LevitateOS. Single source of truth consumed by both website and TUI viewer.

## Installation

```bash
bun add @levitate/docs-content
```

## Usage

```typescript
import { installContent, levitateContent } from '@levitate/docs-content';
```

## Content Types

- `text` - Paragraphs and inline markdown
- `code` - Syntax-highlighted code blocks
- `table` - Data tables with headers
- `list` - Bulleted and numbered lists
- `conversation` - Command/response pairs
- `qa` - Question and answer format
- `command` - Terminal commands with descriptions
- `interactive` - Step-by-step tutorials

## Adding Content

1. Create content file in `src/content/`
2. Export from `src/index.ts`
3. Run `bun run build`

## Development

```bash
bun run typecheck   # Validate types
bun run lint        # Run linter
bun run format      # Format code
bun run check       # Run all checks
```

## License

MIT
