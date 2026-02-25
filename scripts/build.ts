/**
 * Build script for docs-content
 *
 * Generates src/generated/index.ts with pre-computed navigation and content.
 * This removes the dependency on Vite's import.meta.glob, making the package
 * work in any runtime (Bun, Node, etc).
 *
 * Run:
 *   bun scripts/build.ts
 *   bun scripts/build.ts --validate-only
 */

import { readdir, readFile, mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import type {
	DocsAudience,
	DocsContent,
	DocsPageMeta,
	DocsProduct,
	DocsScope,
	DocsStability,
	NavSection,
} from "../src/types"
import { snapshotDocsContent } from "./syntax"

const SRC_DIR = join(import.meta.dir, "../src")
const CONTENT_DIR = join(SRC_DIR, "content")
const GENERATED_DIR = join(SRC_DIR, "generated")

interface ContentEntry {
	filePath: string
	sectionOrder: number
	sectionName: string
	pageOrder: number
	pageName: string
	slug: string
	meta: DocsPageMeta
	content: DocsContent
}

type BuildOptions = {
	validateOnly?: boolean
	checkGenerated?: boolean
}

async function assertGeneratedOutput(outputPath: string, expectedOutput: string): Promise<void> {
	let currentOutput: string
	try {
		currentOutput = await readFile(outputPath, "utf8")
	} catch (err) {
		if ((err as NodeJS.ErrnoException).code === "ENOENT") {
			throw new Error(
				`Generated docs contract file is missing at '${outputPath}'. Remediation: bun run build (docs/content).`,
			)
		}
		throw err
	}

	if (currentOutput !== expectedOutput) {
		throw new Error(
			`Generated docs contract file is stale at '${outputPath}'. Remediation: bun run build (docs/content) and commit updated src/generated/index.ts.`,
		)
	}
}

async function discoverContentFiles(): Promise<string[]> {
	const files: string[] = []
	const sections = await readdir(CONTENT_DIR)

	for (const section of sections) {
		if (!section.match(/^\d+-/)) continue
		const sectionPath = join(CONTENT_DIR, section)
		const pages = await readdir(sectionPath)

		for (const page of pages) {
			if (!page.endsWith(".ts")) continue
			files.push(join(sectionPath, page))
		}
	}

	return files
}

function parseContentPath(
	filePath: string,
): { sectionOrder: number; sectionName: string; pageOrder: number; pageName: string } | null {
	// Path format: .../content/01-getting-started/02-installation.ts
	const match = filePath.match(/\/(\d+)-([^/]+)\/(\d+)-([^.]+)\.ts$/)
	if (!match) return null

	const [, sectionOrderStr, sectionName, pageOrderStr, pageName] = match
	return {
		sectionOrder: parseInt(sectionOrderStr, 10),
		sectionName,
		pageOrder: parseInt(pageOrderStr, 10),
		pageName,
	}
}

function generateSlug(sectionName: string, pageName: string): string {
	// helpers section files get "helpers-" prefix, others use filename directly
	return sectionName === "helpers" ? `helpers-${pageName}` : pageName
}

function toTitleCase(str: string): string {
	return str
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ")
}

function getNavSection(sectionName: string): { key: string; title: string } {
	return { key: sectionName, title: toTitleCase(sectionName) }
}

const PRODUCT_VALUES: DocsProduct[] = ["levitate", "acorn", "ralph", "shared"]
const SCOPE_VALUES: DocsScope[] = ["install", "post_install", "architecture", "reference"]
const AUDIENCE_VALUES: DocsAudience[] = ["beginner", "operator", "developer"]
const STABILITY_VALUES: DocsStability[] = ["stable", "experimental"]

function inferMetaFromSection(sectionName: string, pageName: string): DocsPageMeta {
	if (sectionName === "getting-started") {
		return {
			product: "levitate",
			scopes: pageName === "post-installation" ? ["install", "post_install"] : ["install"],
			audience: ["beginner"],
			stability: "stable",
		}
	}

	if (sectionName === "installation-tools" || sectionName === "rec-tooling") {
		return {
			product: "levitate",
			scopes: ["install"],
			audience: ["operator", "developer"],
			stability: "stable",
		}
	}

	if (sectionName === "architecture") {
		return {
			product: "levitate",
			scopes: ["architecture"],
			audience: ["developer"],
			stability: "stable",
		}
	}

	return {
		product: "levitate",
		scopes: ["reference"],
		stability: "stable",
	}
}

function normalizeEnum<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
	if (typeof value !== "string") {
		return fallback
	}

	return allowed.includes(value as T) ? (value as T) : fallback
}

function normalizeEnumArray<T extends string>(
	value: unknown,
	allowed: readonly T[],
	fallback: readonly T[],
): T[] {
	if (!Array.isArray(value)) {
		return [...fallback]
	}

	const normalized = value.filter((entry): entry is T => {
		return typeof entry === "string" && allowed.includes(entry as T)
	})

	if (normalized.length === 0) {
		return [...fallback]
	}

	return Array.from(new Set(normalized))
}

function normalizeMeta(rawMeta: unknown, inferred: DocsPageMeta): DocsPageMeta {
	if (typeof rawMeta !== "object" || rawMeta === null) {
		return inferred
	}

	const candidate = rawMeta as {
		product?: unknown
		scopes?: unknown
		audience?: unknown
		stability?: unknown
	}

	const meta: DocsPageMeta = {
		product: normalizeEnum(candidate.product, PRODUCT_VALUES, inferred.product),
		scopes: normalizeEnumArray(candidate.scopes, SCOPE_VALUES, inferred.scopes),
	}

	const audience = normalizeEnumArray(candidate.audience, AUDIENCE_VALUES, [])
	if (audience.length > 0) {
		meta.audience = audience
	}

	const stability = normalizeEnum(
		candidate.stability,
		STABILITY_VALUES,
		inferred.stability ?? "stable",
	)
	if (stability.length > 0) {
		meta.stability = stability
	}

	return meta
}

function resolvePageMeta(
	content: DocsContent,
	sectionName: string,
	pageName: string,
): DocsPageMeta {
	const inferred = inferMetaFromSection(sectionName, pageName)
	return normalizeMeta(content.meta, inferred)
}

async function loadContentEntries(): Promise<ContentEntry[]> {
	const files = await discoverContentFiles()
	const entries: ContentEntry[] = []

	for (const filePath of files) {
		const parsed = parseContentPath(filePath)
		if (!parsed) continue

		const slug = generateSlug(parsed.sectionName, parsed.pageName)

		// Import the module
		const module = await import(filePath)

		// Find the DocsContent export (first export matching the shape)
		const content = Object.values(module).find(
			(val): val is DocsContent =>
				val !== null && typeof val === "object" && "title" in val && "sections" in val,
		)

		if (!content) {
			console.warn(`No DocsContent export found in ${filePath}`)
			continue
		}

		const meta = resolvePageMeta(content, parsed.sectionName, parsed.pageName)
		const contentWithMeta: DocsContent = {
			...content,
			meta,
		}

		const snapshotted = await snapshotDocsContent(contentWithMeta, {
			filePath,
			slug,
		})

		entries.push({
			filePath,
			...parsed,
			slug,
			meta,
			content: snapshotted,
		})
	}

	return entries.sort((a, b) => a.sectionOrder - b.sectionOrder || a.pageOrder - b.pageOrder)
}

function buildNavigation(entries: ContentEntry[]): NavSection[] {
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

	return Array.from(sectionMap.values())
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
}

function buildContentMap(entries: ContentEntry[]): Record<string, DocsContent> {
	const contentBySlug: Record<string, DocsContent> = {}
	for (const entry of entries) {
		contentBySlug[entry.slug] = entry.content
	}
	return contentBySlug
}

function buildMetaMap(entries: ContentEntry[]): Record<string, DocsPageMeta> {
	const metaBySlug: Record<string, DocsPageMeta> = {}
	for (const entry of entries) {
		metaBySlug[entry.slug] = entry.meta
	}
	return metaBySlug
}

async function generateOutput(entries: ContentEntry[]): Promise<string> {
	const nav = buildNavigation(entries)
	const contentBySlug = buildContentMap(entries)
	const metaBySlug = buildMetaMap(entries)

	const lines: string[] = [
		"/**",
		" * AUTO-GENERATED FILE - DO NOT EDIT",
		" *",
		" * Generated by: bun scripts/build.ts",
		" */",
		"",
		'import type { NavSection, DocsContent, DocsPageMeta } from "../types"',
		"",
	]

	// Export navigation
	lines.push("export const docsNav: NavSection[] = " + JSON.stringify(nav, null, "\t"))
	lines.push("")

	// Export content by slug with build-time syntax snapshot payloads
	lines.push(
		"export const contentBySlug: Record<string, DocsContent> = " +
			JSON.stringify(contentBySlug, null, "\t"),
	)
	lines.push("")

	lines.push(
		"export const metaBySlug: Record<string, DocsPageMeta> = " +
			JSON.stringify(metaBySlug, null, "\t"),
	)
	lines.push("")

	return lines.join("\n")
}

export async function runBuild(options: BuildOptions = {}): Promise<void> {
	console.log("Building docs-content...")

	const entries = await loadContentEntries()
	console.log(`Loaded ${entries.length} content files`)

	const output = await generateOutput(entries)
	const outputPath = join(GENERATED_DIR, "index.ts")

	if (options.checkGenerated) {
		await assertGeneratedOutput(outputPath, output)
		console.log("Generated contract is up to date")
	}

	if (options.validateOnly) {
		console.log("Syntax validation passed")
		return
	}

	await mkdir(GENERATED_DIR, { recursive: true })
	await writeFile(outputPath, output)

	console.log(`Generated: ${outputPath}`)
	console.log("Done!")
}

async function main() {
	const validateOnly = process.argv.includes("--validate-only")
	const checkGenerated = process.argv.includes("--check-generated")
	await runBuild({ validateOnly, checkGenerated })
}

if (import.meta.main) {
	main().catch((err) => {
		console.error("Build failed:", err)
		process.exit(1)
	})
}
