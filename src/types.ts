/**
 * Content structure types for the docs template system.
 * Pages define content as structured data, rendered by DocsPage.
 */

export interface DocsContent {
	title: string
	intro?: string
	sections: Section[]
}

export interface Section {
	title: string
	level?: 2 | 3
	content: ContentBlock[]
}

export type ContentBlock =
	| TextBlock
	| CodeBlock
	| FileBlock
	| TableBlock
	| ListBlock
	| ConversationBlock
	| LinkBlock
	| InlineCodeBlock

export interface TextBlock {
	type: "text"
	content: string
}

export interface CodeBlock {
	type: "code"
	language: string
	content: string
}

export interface FileBlock {
	type: "file"
	filename: string
	content: string
	language?: string
}

export interface TableBlock {
	type: "table"
	headers: string[]
	rows: string[][]
	/** Column index to render in monospace font (0-indexed) */
	monospaceCol?: number
}

export interface ListBlock {
	type: "list"
	ordered?: boolean
	items: (string | ListItem)[]
}

export interface ListItem {
	text: string
	children?: string[]
}

export interface ConversationBlock {
	type: "conversation"
	messages: ConversationMessage[]
}

export interface ConversationMessage {
	role: "user" | "ai"
	text: string
	/** Optional list items shown after the text */
	list?: string[]
}

export interface LinkBlock {
	type: "link"
	text: string
	href: string
}

export interface InlineCodeBlock {
	type: "inline-code"
	content: string
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
