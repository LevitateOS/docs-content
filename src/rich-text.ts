/**
 * Rich text system using tagged template literals.
 * Provides type-safe inline formatting for docs content.
 *
 * @example
 * import { rich, link, bold, code } from './rich-text'
 *
 * const content = rich`Download from ${link("Rufus", "https://rufus.ie")} and use ${bold("DD mode")}.`
 */

// Inline node types
export interface InlineLink {
	type: "link"
	text: string
	href: string
}

export interface InlineBold {
	type: "bold"
	text: string
}

export interface InlineCode {
	type: "code"
	text: string
}

export interface InlineItalic {
	type: "italic"
	text: string
}

export type InlineNode = string | InlineLink | InlineBold | InlineCode | InlineItalic

export type RichText = InlineNode[]

// Helper functions for creating inline nodes
export const link = (text: string, href: string): InlineLink => ({
	type: "link",
	text,
	href,
})

export const bold = (text: string): InlineBold => ({
	type: "bold",
	text,
})

export const code = (text: string): InlineCode => ({
	type: "code",
	text,
})

export const italic = (text: string): InlineItalic => ({
	type: "italic",
	text,
})

/**
 * Tagged template literal for rich text.
 * Interleaves static strings with inline nodes.
 *
 * @example
 * rich`Hello ${bold("world")}!`
 * // Returns: ["Hello ", { type: "bold", text: "world" }, "!"]
 */
export function rich(strings: TemplateStringsArray, ...values: InlineNode[]): RichText {
	const result: RichText = []

	strings.forEach((str, i) => {
		if (str) {
			result.push(str)
		}
		if (i < values.length) {
			result.push(values[i])
		}
	})

	return result
}

// Type guard helpers
export const isInlineLink = (node: InlineNode): node is InlineLink =>
	typeof node !== "string" && node.type === "link"

export const isInlineBold = (node: InlineNode): node is InlineBold =>
	typeof node !== "string" && node.type === "bold"

export const isInlineCode = (node: InlineNode): node is InlineCode =>
	typeof node !== "string" && node.type === "code"

export const isInlineItalic = (node: InlineNode): node is InlineItalic =>
	typeof node !== "string" && node.type === "italic"
