import { createHighlighter, createJavaScriptRegexEngine } from "shiki"
import type { ContentBlock, DocsContent, DocsSyntaxLanguage } from "../src/types"

const SHIKI_THEME = "github-dark"
const SHIKI_LANGUAGES = ["bash", "rust", "toml"] as const
const DOCS_SYNTAX_LANGUAGES = ["bash", "rust", "rhai", "toml", "text"] as const

type SyntaxContext = {
	filePath: string
	slug: string
	sectionIndex: number
	sectionTitle: string
	blockPath: string
	blockType: string
}

type SnapshotContext = {
	filePath: string
	slug: string
}

type ShikiToken = {
	content?: unknown
	color?: unknown
}

type ShikiTokenResult = {
	tokens?: unknown
}

type SyntaxHighlighter = Awaited<ReturnType<typeof createHighlighter>>

let highlighterPromise: Promise<SyntaxHighlighter> | null = null

function syntaxError(context: SyntaxContext, message: string): never {
	const location = `${context.filePath} :: ${context.blockPath} (${context.blockType})`
	throw new Error(
		`Syntax snapshot failure for '${context.slug}': ${message}. Location: ${location}. Remediation: bun run build (docs/content).`,
	)
}

function normalizeHexColor(value: unknown): string | null {
	if (typeof value !== "string") {
		return null
	}

	const candidate = value.trim().toLowerCase()
	if (/^#[0-9a-f]{6}$/.test(candidate)) {
		return candidate
	}

	if (/^#[0-9a-f]{3}$/.test(candidate)) {
		const [, r, g, b] = candidate
		return `#${r}${r}${g}${g}${b}${b}`
	}

	if (/^#[0-9a-f]{8}$/.test(candidate)) {
		return candidate.slice(0, 7)
	}

	return null
}

function escapeStyleText(value: string): string {
	return value
		.replaceAll("{", "\\{")
		.replaceAll("}", "\\}")
		.replaceAll("[[", "\\[[")
}

function isDocsSyntaxLanguage(value: string): value is DocsSyntaxLanguage {
	return DOCS_SYNTAX_LANGUAGES.includes(value as DocsSyntaxLanguage)
}

function resolveLanguage(value: unknown, context: SyntaxContext): DocsSyntaxLanguage {
	if (typeof value !== "string") {
		syntaxError(context, "missing required language")
	}

	const normalized = value.trim()
	if (!isDocsSyntaxLanguage(normalized)) {
		syntaxError(
			context,
			`unsupported language '${normalized}' (supported: ${DOCS_SYNTAX_LANGUAGES.join(", ")})`,
		)
	}

	return normalized
}

function shikiLanguageFor(language: DocsSyntaxLanguage): "bash" | "rust" | "toml" | "text" {
	switch (language) {
		case "bash":
			return "bash"
		case "rust":
			return "rust"
		case "rhai":
			return "rust"
		case "toml":
			return "toml"
		case "text":
			return "text"
	}
}

function normalizeCommandSource(command: unknown, context: SyntaxContext): string {
	if (typeof command === "string") {
		return command
	}

	if (!Array.isArray(command)) {
		syntaxError(context, "command payload must be string or string[]")
	}

	const pieces = command.filter((entry): entry is string => typeof entry === "string")
	if (pieces.length !== command.length) {
		syntaxError(context, "command[] payload contains non-string entry")
	}

	return pieces.join("\n")
}

function normalizeTokenLines(result: ShikiTokenResult, context: SyntaxContext): string[] {
	if (!Array.isArray(result.tokens)) {
		syntaxError(context, "highlighter returned malformed token payload")
	}

	return result.tokens.map((line, lineIndex) => {
		if (!Array.isArray(line)) {
			syntaxError(context, `token line ${lineIndex} is not an array`)
		}

		return line
			.map((token) => {
				const fragment = (token as ShikiToken).content
				const text = typeof fragment === "string" ? fragment : ""
				const escapedText = escapeStyleText(text)
				const color = normalizeHexColor((token as ShikiToken).color)
				if (!color || escapedText.length === 0) {
					return escapedText
				}
				return `[[fg=${color}]]${escapedText}[[/]]`
			})
			.join("")
	})
}

async function getHighlighter(): Promise<SyntaxHighlighter> {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({
			themes: [SHIKI_THEME],
			langs: [...SHIKI_LANGUAGES],
			engine: createJavaScriptRegexEngine(),
		})
	}

	return highlighterPromise
}

function highlightSource(
	source: string,
	language: DocsSyntaxLanguage,
	context: SyntaxContext,
	highlighter: SyntaxHighlighter,
): string[] {
	if (source.length === 0) {
		return [""]
	}

	if (language === "text") {
		return source.split("\n").map(escapeStyleText)
	}

	const tokens = highlighter.codeToTokens(source, {
		lang: shikiLanguageFor(language),
		theme: SHIKI_THEME,
	}) as ShikiTokenResult

	return normalizeTokenLines(tokens, context)
}

function snapshotBlock(
	block: ContentBlock,
	context: SyntaxContext,
	highlighter: SyntaxHighlighter,
): ContentBlock {
	switch (block.type) {
		case "code": {
			const language = resolveLanguage(block.language, context)
			const codeContent = typeof block.content === "string" ? block.content : ""
			return {
				...block,
				language,
				highlightedLines: highlightSource(codeContent, language, context, highlighter),
			}
		}
		case "command": {
			const language = resolveLanguage(block.language, context)
			const commandSource = normalizeCommandSource(block.command, context)
			return {
				...block,
				language,
				highlightedCommandLines: highlightSource(commandSource, language, context, highlighter),
			}
		}
		case "qa":
			return {
				...block,
				items: block.items.map((item, itemIndex) => ({
					...item,
					answer: item.answer.map((answerBlock, answerIndex) =>
						snapshotBlock(
							answerBlock,
							{
								...context,
								blockPath: `${context.blockPath}.items[${itemIndex}].answer[${answerIndex}]`,
								blockType: answerBlock.type,
							},
							highlighter,
						),
					),
				})),
			}
		default:
			return block
	}
}

export async function snapshotDocsContent(
	content: DocsContent,
	context: SnapshotContext,
): Promise<DocsContent> {
	const highlighter = await getHighlighter()

	return {
		...content,
		sections: content.sections.map((section, sectionIndex) => ({
			...section,
			content: section.content.map((block, blockIndex) =>
				snapshotBlock(
					block,
					{
						filePath: context.filePath,
						slug: context.slug,
						sectionIndex,
						sectionTitle: section.title,
						blockPath: `sections[${sectionIndex}](${section.title}).content[${blockIndex}]`,
						blockType: block.type,
					},
					highlighter,
				),
			),
		})),
	}
}
