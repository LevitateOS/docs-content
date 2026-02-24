import type { NavSection, DocsContent } from "./types"

// Vite glob import - eagerly loads all content files at build time
const contentModules = import.meta.glob<{
	default?: DocsContent
	[key: string]: DocsContent | undefined
}>("./content/**/*.ts", { eager: true })

interface ContentEntry {
	sectionOrder: number
	sectionName: string
	pageOrder: number
	pageName: string
	slug: string
	content: DocsContent
}

function getNavSection(sectionName: string): { key: string; title: string } {
	const title = sectionName
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ")

	return { key: sectionName, title }
}

// Parse folder/file structure into ordered entries
function parseContentModules(): ContentEntry[] {
	const entries: ContentEntry[] = []

	for (const [path, module] of Object.entries(contentModules)) {
		// Path format: ./content/01-getting-started/02-installation.ts
		const match = path.match(/\.\/content\/(\d+)-([^/]+)\/(\d+)-([^.]+)\.ts$/)
		if (!match) continue

		const [, sectionOrderStr, sectionName, pageOrderStr, pageName] = match

		// Find the DocsContent export (first export that matches DocsContent shape)
		const content = Object.values(module).find(
			(val): val is DocsContent =>
				val !== null && typeof val === "object" && "title" in val && "sections" in val,
		)

		if (!content) continue

		// Generate slug: helpers section files get "helpers-" prefix, others use filename directly
		const slug =
			sectionName === "helpers"
				? `helpers-${pageName}` // 01-overview.ts → helpers-overview
				: pageName // 01-cli-reference.ts → cli-reference

		entries.push({
			sectionOrder: parseInt(sectionOrderStr, 10),
			sectionName,
			pageOrder: parseInt(pageOrderStr, 10),
			pageName,
			slug,
			content,
		})
	}

	return entries.sort((a, b) => a.sectionOrder - b.sectionOrder || a.pageOrder - b.pageOrder)
}

// Build navigation and content map
const entries = parseContentModules()

// Group by section
const sectionMap = new Map<
	string,
	{
		order: number
		title: string
		items: { slug: string; title: string; order: number }[]
	}
>()

for (const entry of entries) {
	const navSection = getNavSection(entry.sectionName)

	if (!sectionMap.has(navSection.key)) {
		sectionMap.set(navSection.key, {
			order: entry.sectionOrder,
			title: navSection.title,
			items: [],
		})
	}

	const section = sectionMap.get(navSection.key)!
	section.order = Math.min(section.order, entry.sectionOrder)

	section.items.push({
		slug: entry.slug,
		title: entry.content.title,
		order: entry.pageOrder,
	})
}

// Build docsNav
export const docsNav: NavSection[] = Array.from(sectionMap.values())
	.sort((a, b) => a.order - b.order)
	.map((section) => ({
		title: section.title,
		items: section.items
			.sort((a, b) => a.order - b.order)
			.map((item) => ({
				title: item.title,
				href: `/docs/${item.slug}`,
			})),
	}))

// Build contentBySlug
export const contentBySlug: Record<string, DocsContent> = Object.fromEntries(
	entries.map((entry) => [entry.slug, entry.content]),
)

// Re-export all content for backwards compatibility
export const allContent = entries.map((e) => e.content)
