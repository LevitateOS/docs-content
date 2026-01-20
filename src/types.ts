/**
 * Content structure types for the docs template system.
 * Pages define content as structured data, rendered by DocsPage.
 */

import type { RichText } from "./rich-text"

export interface DocsContent {
	title: string
	intro?: string | RichText
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
	| TableBlock
	| ListBlock
	| ConversationBlock
	| InteractiveBlock
	| CommandBlock

export interface TextBlock {
	type: "text"
	/** Plain string or rich text array from tagged template */
	content: string | RichText
}

export interface CodeBlock {
	type: "code"
	/** Language for syntax highlighting. If omitted, inferred from filename. */
	language?: string
	content: string
	/** Optional filename - when present, shows file header with icon */
	filename?: string
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
	text: string
	/** Optional list items shown after the text */
	list?: string[]
}

export interface InteractiveBlock {
	type: "interactive"
	/** Optional intro text before the steps */
	intro?: string
	steps: InteractiveStep[]
}

export interface InteractiveStep {
	/** The command to type */
	command: string
	/** Description of what this command does */
	description: string
}

export interface CommandBlock {
	type: "command"
	/** Description shown above the command */
	description: string
	/** The command(s) to run - single string or array for multiple lines */
	command: string | string[]
	/** Optional expected output (shown dimmer, not copied) */
	output?: string
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
