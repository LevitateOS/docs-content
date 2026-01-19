// Types
export * from "./types"

// Rich text helpers
export { rich, link, bold, code, italic } from "./rich-text"
export type { RichText, InlineNode, InlineLink, InlineBold, InlineCode, InlineItalic } from "./rich-text"

// Navigation and content (auto-discovered)
export { docsNav, contentBySlug } from "./discovery"

export type { DocsContent } from "./types"
