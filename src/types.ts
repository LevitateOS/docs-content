/**
 * Content structure types for the docs template system.
 * Pages define content as structured data, rendered by DocsPage.
 */

import type { RichText } from "./rich-text"

export type DocsProduct = "levitate" | "acorn" | "ralph" | "shared"
export type DocsScope = "install" | "post_install" | "architecture" | "reference"
export type DocsAudience = "beginner" | "operator" | "developer"
export type DocsStability = "stable" | "experimental"

export interface DocsPageMeta {
	product: DocsProduct
	scopes: DocsScope[]
	audience?: DocsAudience[]
	stability?: DocsStability
}

export interface DocsContent {
	title: string
	meta?: DocsPageMeta
	intro?: string | RichText
	sections: Section[]
}

export type DocsSyntaxLanguage = "bash" | "rust" | "rhai" | "toml" | "text"

export interface Section {
	title: string
	level?: 2 | 3
	content: ContentBlock[]
}

export type ContentBlock =
	| TextBlock
	| CodeBlock
	| TableBlock
	| ListBlock
	| ConversationBlock
	| InteractiveBlock
	| CommandBlock
	| QABlock
	| NoteBlock

export interface TextBlock {
	type: "text"
	/** Plain string or rich text array from tagged template */
	content: string | RichText
}

export interface CodeBlock {
	type: "code"
	/** Language for syntax highlighting. */
	language: DocsSyntaxLanguage
	content: string
	/** Optional filename - when present, shows file header with icon */
	filename?: string
	/** Build-time snapshot of syntax-colored lines for TUI rendering */
	highlightedLines?: string[]
}

export interface TableBlock {
	type: "table"
	headers: (string | RichText)[]
	rows: (string | RichText)[][]
	/** Column index to render in monospace font (0-indexed) */
	monospaceCol?: number
}

export interface ListBlock {
	type: "list"
	ordered?: boolean
	items: (string | RichText | ListItem)[]
}

export interface ListItem {
	text: string | RichText
	children?: (string | RichText)[]
}

export interface ConversationBlock {
	type: "conversation"
	messages: ConversationMessage[]
}

export interface ConversationMessage {
	role: "user" | "ai"
	text: string | RichText
	/** Optional list items shown after the text */
	list?: (string | RichText)[]
}

export interface InteractiveBlock {
	type: "interactive"
	/** Optional intro text before the steps */
	intro?: string | RichText
	steps: InteractiveStep[]
}

export interface InteractiveStep {
	/** The command to type */
	command: string
	/** Description of what this command does */
	description: string | RichText
}

export interface CommandBlock {
	type: "command"
	/** Language for syntax highlighting. */
	language: DocsSyntaxLanguage
	/** Description shown above the command */
	description: string
	/** The command(s) to run - single string or array for multiple lines */
	command: string | string[]
	/** Optional expected output (shown dimmer, not copied) */
	output?: string
	/** Build-time snapshot of syntax-colored command lines for TUI rendering */
	highlightedCommandLines?: string[]
}

/** Navigation section for docs sidebar */
export interface NavSection {
	title: string
	items: NavItem[]
}

export interface NavItem {
	title: string
	href: string
	/** Sections within the page (for table of contents) */
	sections?: NavItemSection[]
}

export interface NavItemSection {
	title: string
	anchor: string
	level: 2 | 3
}

export interface QABlock {
	type: "qa"
	items: QAItem[]
}

export interface QAItem {
	/** The question text */
	question: string | RichText
	/** Answer content - can contain any block types */
	answer: ContentBlock[]
}

export interface NoteBlock {
	type: "note"
	/** Visual style: info (blue), warning (yellow), danger (red) */
	variant: "info" | "warning" | "danger"
	/** Note content */
	content: string | RichText
}
