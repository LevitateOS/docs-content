#!/usr/bin/env npx tsx
/**
 * Generates navigation.ts by scanning the content directory structure.
 *
 * Folder structure:
 *   content/
 *   ├── 01-getting-started/
 *   │   ├── 01-install.ts
 *   │   └── 02-manual-install.ts
 *   └── 02-package-manager/
 *       ├── 01-cli-reference.ts
 *       └── 02-recipe-format.ts
 *
 * - Folders become nav sections, sorted by numeric prefix
 * - Files become nav items, sorted by numeric prefix
 * - Numeric prefixes are stripped for display names and routes
 * - kebab-case is converted to Title Case for display
 */

import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CONTENT_DIR = path.join(__dirname, "../src/content")
const OUTPUT_FILE = path.join(__dirname, "../src/navigation.generated.ts")

interface NavItem {
	title: string
	href: string
	exportName: string
	filePath: string
}

interface NavSection {
	title: string
	slug: string
	order: number
	items: NavItem[]
}

/** Strip numeric prefix: "01-getting-started" -> "getting-started" */
function stripPrefix(name: string): string {
	return name.replace(/^\d+-/, "")
}

/** Get numeric prefix for sorting: "01-foo" -> 1, "foo" -> Infinity */
function getOrder(name: string): number {
	const match = name.match(/^(\d+)-/)
	return match ? parseInt(match[1], 10) : Infinity
}

/** Known acronyms that should be uppercased */
const ACRONYMS = new Set(["cli", "api", "url", "html", "css", "js", "ts", "ui", "ux", "id", "os"])

/** Convert kebab-case to Title Case: "getting-started" -> "Getting Started" */
function toTitleCase(slug: string): string {
	return slug
		.split("-")
		.map((word) => {
			if (ACRONYMS.has(word.toLowerCase())) {
				return word.toUpperCase()
			}
			return word.charAt(0).toUpperCase() + word.slice(1)
		})
		.join(" ")
}

/** Convert kebab-case to camelCase: "cli-reference" -> "cliReference" */
function toCamelCase(slug: string): string {
	return slug.replace(/-([a-z])/g, (_, char) => char.toUpperCase())
}

/** Generate export name from slug: "cli-reference" -> "cliReferenceContent" */
function toExportName(slug: string): string {
	return toCamelCase(slug) + "Content"
}

function scanContentDir(): NavSection[] {
	const sections: NavSection[] = []

	// Read category folders
	const entries = fs.readdirSync(CONTENT_DIR, { withFileTypes: true })
	const folders = entries
		.filter((e) => e.isDirectory() && /^\d+-/.test(e.name))
		.sort((a, b) => getOrder(a.name) - getOrder(b.name))

	for (const folder of folders) {
		const folderSlug = stripPrefix(folder.name)
		const folderPath = path.join(CONTENT_DIR, folder.name)

		// Read content files in folder
		const files = fs
			.readdirSync(folderPath)
			.filter((f) => f.endsWith(".ts") && /^\d+-/.test(f))
			.sort((a, b) => getOrder(a) - getOrder(b))

		const items: NavItem[] = files.map((file) => {
			const fileSlug = stripPrefix(file.replace(/\.ts$/, ""))
			return {
				title: toTitleCase(fileSlug),
				href: `/docs/${fileSlug}`,
				exportName: toExportName(fileSlug),
				filePath: `./content/${folder.name}/${file.replace(/\.ts$/, "")}`,
			}
		})

		sections.push({
			title: toTitleCase(folderSlug),
			slug: folderSlug,
			order: getOrder(folder.name),
			items,
		})
	}

	return sections
}

function generateOutput(sections: NavSection[]): string {
	const imports: string[] = []
	const reexports: string[] = []

	for (const section of sections) {
		for (const item of section.items) {
			imports.push(
				`import { ${item.exportName} } from "${item.filePath}"`
			)
			reexports.push(item.exportName)
		}
	}

	const navSections = sections.map((section) => {
		const items = section.items
			.map(
				(item) =>
					`\t\t\t{ title: "${item.title}", href: "${item.href}" }`
			)
			.join(",\n")
		return `\t{
\t\ttitle: "${section.title}",
\t\titems: [
${items}
\t\t],
\t}`
	})

	return `// AUTO-GENERATED - DO NOT EDIT
// Run: npx tsx scripts/generate-nav.ts

import type { NavSection } from "./types"

${imports.join("\n")}

export const docsNav: NavSection[] = [
${navSections.join(",\n")}
]

// Re-export content for direct imports
export { ${reexports.join(", ")} }
`
}

// Main
const sections = scanContentDir()
const output = generateOutput(sections)
fs.writeFileSync(OUTPUT_FILE, output)

console.log(`Generated ${OUTPUT_FILE}`)
console.log(`  ${sections.length} sections`)
console.log(`  ${sections.reduce((acc, s) => acc + s.items.length, 0)} pages`)
