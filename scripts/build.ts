/**
 * The docs build: the one page discovery. It loads every page under src/content,
 * renders each distro page for every distro, and writes src/generated/index.ts with the
 * navigation, the pages and their slugs as types. It refuses anything it cannot place:
 * a file outside `NN-section/NN-page.ts`, a file without exactly one (default) export, a
 * page of the wrong shape, a distro page whose title depends on the distro, and a slug
 * used twice.
 *
 * Run:
 *   bun scripts/build.ts                       # write src/generated/index.ts
 *   bun scripts/build.ts --check-generated     # fail if it is not current
 */

import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { ContentBlock, DocsContent, NavSection, PageSource } from "../src/types";
import { DISTROS, type DistroId } from "../src/distros";
import { snapshotDocsContent } from "./syntax";

const SRC_DIR = join(import.meta.dir, "../src");
const CONTENT_DIR = join(SRC_DIR, "content");
const OUTPUT = join(SRC_DIR, "generated", "index.ts");
const NAME = /^(\d+)-([a-z0-9][a-z0-9-]*)$/;
const BLOCK_TYPES: readonly ContentBlock["type"][] = [
	"text",
	"code",
	"table",
	"list",
	"interactive",
	"command",
	"qa",
	"note",
];
const PAGE_KEYS = new Set(["title", "intro", "sections"]);

interface Entry {
	file: string;
	sectionOrder: number;
	sectionTitle: string;
	pageOrder: number;
	/** The page file's name, which is its slug in every section. */
	slug: string;
	/** Shared pages: one content; distro pages: one per distro. */
	content: DocsContent | Record<DistroId, DocsContent>;
}

const failures: string[] = [];
function fail(file: string, message: string): void {
	failures.push(`${file}: ${message}`);
}

function titleCase(name: string): string {
	return name
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

function checkBlocks(file: string, where: string, blocks: unknown): void {
	if (!Array.isArray(blocks)) return fail(file, `${where} is not a list of blocks`);
	blocks.forEach((block, i) => {
		const type = (block as { type?: unknown })?.type;
		if (!BLOCK_TYPES.includes(type as ContentBlock["type"])) {
			return fail(file, `${where}[${i}] has unknown block type '${String(type)}'`);
		}
		if (type === "qa") {
			(block as { items: { answer: unknown }[] }).items.forEach((item, j) =>
				checkBlocks(file, `${where}[${i}].items[${j}].answer`, item.answer),
			);
		}
	});
}

/** `value` is a DocsContent, or the reason it is not. */
function checkPage(file: string, value: unknown, label: string): value is DocsContent {
	if (typeof value !== "object" || value === null) {
		fail(file, `${label} is not a page`);
		return false;
	}
	const before = failures.length;
	for (const key of Object.keys(value)) {
		if (!PAGE_KEYS.has(key)) fail(file, `${label} has unknown field '${key}'`);
	}
	const page = value as Partial<DocsContent>;
	if (typeof page.title !== "string" || page.title.length === 0) {
		fail(file, `${label} has no title`);
	}
	if (!Array.isArray(page.sections)) {
		fail(file, `${label} has no sections`);
	} else {
		page.sections.forEach((section, i) =>
			checkBlocks(file, `${label}.sections[${i}](${section.title}).content`, section.content),
		);
	}
	return failures.length === before;
}

async function loadEntry(
	file: string,
	sectionOrder: number,
	sectionName: string,
	page: string,
): Promise<Entry | null> {
	const match = NAME.exec(page.replace(/\.ts$/, ""));
	if (!page.endsWith(".ts") || !match) {
		fail(file, "is not named NN-page.ts");
		return null;
	}
	const module = (await import(file)) as Record<string, unknown>;
	const exports = Object.keys(module);
	if (exports.length !== 1 || exports[0] !== "default") {
		fail(file, `must have exactly one export, the default (has: ${exports.join(", ") || "none"})`);
		return null;
	}
	const source = module.default as PageSource;
	const slug = match[2]!;
	const base = {
		file,
		sectionOrder,
		sectionTitle: titleCase(sectionName),
		pageOrder: Number(match[1]),
		slug,
	};
	if ("kind" in source && source.kind === "distro-page") {
		const content = {} as Record<DistroId, DocsContent>;
		for (const distro of DISTROS) {
			const { id, ...facts } = distro;
			const rendered = source.render(facts);
			if (!checkPage(file, rendered, `the page for ${id}`)) return null;
			content[id] = await snapshotDocsContent(rendered, { filePath: file, slug });
		}
		const titles = new Set(Object.values(content).map((c) => c.title));
		if (titles.size > 1) {
			fail(file, `its title differs between distros (${[...titles].join(" / ")})`);
			return null;
		}
		return { ...base, content };
	}
	if (!checkPage(file, source, "the page")) return null;
	return {
		...base,
		content: await snapshotDocsContent(source as DocsContent, { filePath: file, slug }),
	};
}

async function loadEntries(): Promise<Entry[]> {
	const entries: Entry[] = [];
	for (const section of (await readdir(CONTENT_DIR)).sort()) {
		const match = NAME.exec(section);
		const dir = join(CONTENT_DIR, section);
		if (!match) {
			fail(dir, "is not a section directory named NN-section");
			continue;
		}
		for (const page of (await readdir(dir)).sort()) {
			const entry = await loadEntry(join(dir, page), Number(match[1]), match[2]!, page);
			if (entry) entries.push(entry);
		}
	}
	const seen = new Map<string, string>();
	for (const entry of entries) {
		const other = seen.get(entry.slug);
		if (other) fail(entry.file, `slug '${entry.slug}' is also ${other}'s`);
		seen.set(entry.slug, entry.file);
	}
	return entries.sort((a, b) => a.sectionOrder - b.sectionOrder || a.pageOrder - b.pageOrder);
}

function isDistro(entry: Entry): entry is Entry & { content: Record<DistroId, DocsContent> } {
	return !("sections" in entry.content);
}

function navigation(entries: Entry[]): NavSection[] {
	const sections: NavSection[] = [];
	for (const entry of entries) {
		let section = sections.find((s) => s.title === entry.sectionTitle);
		if (!section) sections.push((section = { title: entry.sectionTitle, items: [] }));
		const content = isDistro(entry) ? Object.values(entry.content)[0]! : entry.content;
		section.items.push({ title: content.title, slug: entry.slug, distro: isDistro(entry) });
	}
	return sections;
}

function union(values: readonly string[]): string {
	return values.length === 0 ? "never" : values.map((v) => JSON.stringify(v)).join(" | ");
}

function generate(entries: Entry[]): string {
	const shared = entries.filter((e) => !isDistro(e));
	const distro = entries.filter(isDistro);
	const sharedPages = Object.fromEntries(shared.map((e) => [e.slug, e.content]));
	const distroPages = Object.fromEntries(
		DISTROS.map((d) => [d.id, Object.fromEntries(distro.map((e) => [e.slug, e.content[d.id]]))]),
	);
	const json = (value: unknown) => JSON.stringify(value, null, "\t");
	return [
		"/**",
		" * AUTO-GENERATED by `bun scripts/build.ts` (docs/content). Do not edit.",
		" */",
		"",
		'import type { DistroId } from "../distros";',
		'import type { DocsContent, NavSection } from "../types";',
		"",
		"/** Pages shared by every distro. */",
		`export type SharedSlug = ${union(shared.map((e) => e.slug))};`,
		"/** Pages every distro has its own version of, under the same slug. */",
		`export type DistroSlug = ${union(distro.map((e) => e.slug))};`,
		"export type DocsSlug = SharedSlug | DistroSlug;",
		"",
		`export const docsNav: NavSection[] = ${json(navigation(entries))};`,
		"",
		`export const sharedPages: Record<SharedSlug, DocsContent> = ${json(sharedPages)};`,
		"",
		`export const distroPages: Record<DistroId, Record<DistroSlug, DocsContent>> = ${json(distroPages)};`,
		"",
	].join("\n");
}

async function main(): Promise<void> {
	const check = process.argv.includes("--check-generated");
	const entries = await loadEntries();
	if (failures.length > 0) {
		throw new Error(`${failures.length} problem(s) in the docs:\n  ${failures.join("\n  ")}`);
	}
	const output = generate(entries);
	if (check) {
		const current = await readFile(OUTPUT, "utf8").catch(() => null);
		if (current !== output) {
			throw new Error(`${OUTPUT} is missing or stale: run bun run build (docs/content)`);
		}
		console.log(`docs: ${entries.length} pages, generated index current`);
		return;
	}
	await mkdir(join(SRC_DIR, "generated"), { recursive: true });
	await writeFile(OUTPUT, output);
	console.log(`docs: ${entries.length} pages -> ${OUTPUT}`);
}

main().catch((error) => {
	console.error(`docs build failed: ${error instanceof Error ? error.message : String(error)}`);
	process.exit(1);
});
