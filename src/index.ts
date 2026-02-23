// Types
export * from "./types"
export * from "./render-contract"

// Rich text helpers
export { rich, link, bold, code, italic } from "./rich-text"
export type {
	RichText,
	InlineNode,
	InlineLink,
	InlineBold,
	InlineCode,
	InlineItalic,
} from "./rich-text"

// Navigation and content (pre-built)
export { docsNav, contentBySlug, metaBySlug } from "./generated"

export type { DocsContent, DocsSyntaxLanguage } from "./types"
