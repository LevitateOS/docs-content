# Documentation CMS Review

Comprehensive review of the custom documentation system (docs-content + website rendering).

**Date:** 2026-01-19
**Reviewed by:** Claude Opus 4.5

---

## Critical Issues (ALL FIXED ✓)

### 1. Regex Pattern Limitations in Markdown Parser ✓ FIXED

**File:** `website/src/components/docs/DocsPage.tsx` (line 272)

**Original Pattern:** `/`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g`

**Problems (were):**
- URLs with query params fail: `[text](url?param=1&other=2)` stops at first `)`
- Cannot handle `*` inside bold: `**5*2=10**` only matches `**5`
- Cannot handle `)` in URLs: `[link](path/to/file(1).txt)` breaks

**Fix Applied:**
- New regex: `/`([^`]+)`|\[([^\]]+)\]\(((?:[^()]+|\([^()]*\))+)\)|\*\*(.+?)\*\*/g`
- URLs now support query params and one level of nested parentheses
- Bold now uses non-greedy match (allows `*` inside)
- Added JSDoc noting this is legacy; prefer RichText for new content

---

### 2. Duplicate Hook Implementation ✓ FIXED

**Files (were):**
- `docs-content/src/hooks/useCopyToClipboard.ts` (local implementation)
- `website/src/components/docs/DocsPage.tsx` line 4 (imports from `usehooks-ts`)

**Problem (was):** Local `useCopyToClipboard` was exported from `@levitate/docs-content` but the website imported from `usehooks-ts` instead. The local implementation was completely unused.

**Fix Applied:**
- Removed `docs-content/src/hooks/useCopyToClipboard.ts`
- Removed `docs-content/src/hooks/` directory
- Removed export from `docs-content/src/index.ts`
- Website continues using `usehooks-ts` (the established pattern)

---

### 3. Missing Return Type in useCopyToClipboard ✓ FIXED

**File (was):** `docs-content/src/hooks/useCopyToClipboard.ts`

**Problem (was):** Returns `{ copied, copy }` but had no TypeScript return type annotation.

**Fix Applied:** Resolved by removing the unused hook entirely (see issue #2).

---

## Medium Issues

### 4. Unused NavItemSection Type

**File:** `docs-content/src/types.ts` (lines 104-108)

```typescript
export interface NavItemSection {
  title: string
  anchor: string
  level: 2 | 3
}
```

**Problem:** Defined but never populated by discovery system. `docsNav` never sets the `sections` property on `NavItem`.

**Impact:** Table of contents feature is partially implemented but unused.

**Fix:** Either implement TOC generation or remove the type.

---

### 5. Empty Content Sections Have No UI Feedback

**Files:** Multiple content files use `content: []` as placeholder sections.

**Examples:**
- `content/01-getting-started/01-getting-started.ts` line 37: "Creating Bootable Media"
- `content/02-package-manager/01-cli-reference.ts` line 21: "Commands"
- `content/02-package-manager/02-recipe-format.ts` line 180: "Examples"

**Problem:** Renders as empty sections with only a heading. No warning to content authors.

**Impact:** Incomplete documentation may go unnoticed.

**Fix:** Add dev-mode warning or placeholder text for empty sections.

---

### 6. inferLanguage Missing Common Extensions

**File:** `website/src/components/docs/DocsPage.tsx` (lines 183-197)

**Current map:**
```typescript
const langMap: Record<string, string> = {
  conf: "conf",
  json: "json",
  yaml: "yaml",
  yml: "yaml",
  toml: "toml",
  sh: "bash",
  bash: "bash",
  zsh: "bash",
  rhai: "rhai",
}
```

**Missing:** `.c`, `.cpp`, `.h`, `.rs`, `.ts`, `.tsx`, `.js`, `.jsx`, `.py`, `.rb`, `.go`, `.java`, `.kt`, `.swift`, `.md`, `.html`, `.css`, `.scss`, `.sql`, `.xml`

**Impact:** Unknown file types won't display a language badge.

**Fix:** Expand the language map.

---

### 7. Table Row/Column Count Not Validated

**File:** `website/src/components/docs/DocsPage.tsx` (lines 299-325)

**Problem:** If a row has fewer/more cells than headers, it renders misaligned without warning.

**Impact:** Malformed tables from copy-paste errors won't be caught.

**Fix:** Add validation or normalize row lengths.

---

### 8. monospaceCol Out of Bounds Not Handled

**File:** `website/src/components/docs/DocsPage.tsx` (line 315)

**Code:**
```typescript
className={j === table.monospaceCol ? "font-mono" : ""}
```

**Problem:** If `table.monospaceCol >= row.length`, no error but styling logic is confusing.

**Impact:** Incorrect styling on malformed tables.

**Fix:** Add bounds check or ignore invalid monospaceCol values.

---

## Low Issues

### 9. Anchor Generation Loses Information

**File:** `website/src/components/docs/DocsPage.tsx` (lines 82-88)

**Code:**
```typescript
function toAnchor(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
}
```

**Problems:**
- "HTTP/2" becomes "http2"
- "C++" becomes "c"
- "123" stays "123" (no letter prefix)
- Emojis disappear silently
- Potential collisions between different titles

**Fix:** Use a slugify library or improve the algorithm.

---

### 10. Duplicate Inline Content Rendering Logic

**File:** `website/src/components/docs/DocsPage.tsx`

Three separate functions render inline content identically:
- `IntroRenderer` (lines 42-80)
- `TextBlockRenderer` (lines 199-238)
- `InlineContentRenderer` (lines 328-357)

**Impact:** Code duplication, maintenance burden, harder to fix bugs consistently.

**Fix:** Consolidate into a single reusable component.

---

### 11. No Validation of Content Structure

**File:** `docs-content/src/discovery.ts` (lines 30-35)

**Code:**
```typescript
function isDocsContent(val: unknown): val is DocsContent {
  return (
    typeof val === "object" &&
    val !== null &&
    "title" in val &&
    "sections" in val
  )
}
```

**Problem:** Doesn't validate that `sections` is actually an array or that items have correct shape.

**Impact:** Could load malformed content at runtime.

**Fix:** Add runtime validation with zod or manual checks.

---

### 12. parseInt Without Error Handling

**File:** `docs-content/src/discovery.ts` (lines 44-45)

**Problem:** `parseInt()` on filename prefixes doesn't validate results. If filename is `aa-name/bb-file.ts`, `parseInt("aa", 10)` returns `NaN`.

**Impact:** Malformed filenames could break sort order silently.

**Fix:** Add NaN check and fallback.

---

### 13. Copy Button State Persists Incorrectly

**File:** `website/src/components/docs/DocsPage.tsx` (lines 140-180)

**Code:**
```typescript
const hasCopied = copiedText === file.content
```

**Problem:** If user copies content, then views a different file with identical content, "copied" state persists incorrectly.

**Impact:** Minor UX confusion.

**Fix:** Track file identity, not just content.

---

### 14. ListItem.children Limited to 2-Level Nesting

**File:** `docs-content/src/types.ts` (line 65)

```typescript
export interface ListItem {
  text: string | RichText
  children?: (string | RichText)[]
}
```

**Problem:** `children` only allows strings/RichText, not nested `ListItem`. Cannot create 3+ level nested lists.

**Impact:** Limited list nesting capability.

**Fix:** Allow recursive `ListItem[]` for children if needed.

---

### 15. ConversationMessage Doesn't Support RichText

**File:** `docs-content/src/types.ts` (lines 68-78)

```typescript
export interface ConversationMessage {
  role: "user" | "ai"
  text: string  // <- not RichText
  list?: string[]
}
```

**Problem:** Inconsistent with other text fields that support RichText.

**Impact:** Cannot use bold/code/links in conversation messages.

**Fix:** Update to `text: string | RichText`.

---

### 16. Package.json Exports Too Broad

**File:** `docs-content/package.json` (line 10)

```json
"./content/*": "./src/content/*.ts"
```

**Problem:** Exports all content files individually, which might not be intended.

**Impact:** Creates unnecessary export surface area.

**Fix:** Remove if not needed, or document if intentional.

---

### 17. No Clipboard Error Handling

**File:** `docs-content/src/hooks/useCopyToClipboard.ts` (lines 6-14)

**Problem:** `navigator.clipboard.writeText()` can throw but errors are silently ignored. Clipboard API requires HTTPS in most browsers.

**Impact:** Copy silently fails in some environments.

**Fix:** Add try/catch with fallback (execCommand or user notification).

---

### 18. InlineNodeRenderer Default Case Returns null

**File:** `website/src/components/docs/DocsPage.tsx` (line 260)

```typescript
default:
  return null
```

**Problem:** With exhaustive type checking, this should be `never`. Returns `null` suggests type might not be exhaustive.

**Impact:** Future inline node types might not be handled.

**Fix:** Add exhaustive check: `const _exhaustive: never = node`.

---

### 19. Unused Hook Export Creates Confusion

**File:** `docs-content/src/index.ts` (line 9)

Exports `useCopyToClipboard` but website imports from `usehooks-ts`.

**Impact:** API inconsistency, confusion about which hook to use.

**Fix:** Remove export or document intended usage.

---

## Feature Gaps

### 20. No Table of Contents Generation

`NavItemSection` type exists but is never populated. The discovery system could extract section titles and generate TOC automatically.

**Benefit:** Better navigation on long documentation pages.

---

### 21. No Search Functionality

No full-text search across documentation content.

**Benefit:** Users can find content without manual browsing.

**Options:**
- Client-side search (Fuse.js, MiniSearch)
- Build-time index generation
- Algolia/Typesense integration

---

### 22. No Build-Time Content Validation

No validation that:
- Content matches TypeScript types at runtime
- Internal links (`/docs/...`) point to valid pages
- External links are reachable
- Required fields are present

**Benefit:** Catch content errors before deployment.

**Options:**
- Zod schema validation
- Custom lint rules
- Link checker in CI

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 3 |
| Medium | 5 |
| Low | 11 |
| Feature Gap | 3 |

### Priority Fixes

1. **Regex parser** - Most impactful bug, affects URL parsing
2. **Duplicate hook** - Clean up dead code
3. **Language map** - Quick win, expand file extensions
4. **Consolidate renderers** - Reduce duplication

### Future Enhancements

1. Table of contents generation
2. Build-time validation
3. Full-text search
