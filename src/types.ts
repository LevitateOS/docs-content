/**
 * The docs' content model: pages as structured data, which the website and install-docs
 * render. The unions are closed, so a renderer that misses a kind fails its typecheck.
 */

import type { Distro } from "./distros";
import type { RichText } from "./rich-text";

export interface DocsContent {
	title: string;
	intro?: string | RichText;
	sections: Section[];
}

/** What a distro page is written from: the distro's facts, without its id, so text can follow a fact but not a name. */
export type DistroFacts = Omit<Distro, "id">;

/**
 * A page written once and rendered for every distro, as a function of its facts. Every
 * distro gets it under the same slug, and its title must not depend on the distro.
 */
export interface DistroPage {
	kind: "distro-page";
	render: (d: DistroFacts) => DocsContent;
}

export function distroPage(render: (d: DistroFacts) => DocsContent): DistroPage {
	return { kind: "distro-page", render };
}

/** What a content file's default export is. */
export type PageSource = DocsContent | DistroPage;

export type DocsSyntaxLanguage = "bash" | "rust" | "rhai" | "toml" | "text";

export interface Section {
	title: string;
	level?: 2 | 3;
	content: ContentBlock[];
}

export type ContentBlock =
	| TextBlock
	| CodeBlock
	| TableBlock
	| ListBlock
	| InteractiveBlock
	| CommandBlock
	| QABlock
	| NoteBlock;

export interface TextBlock {
	type: "text";
	/** Plain string or rich text array from tagged template */
	content: string | RichText;
}

/** A build-time snapshot of syntax-coloured lines, one set per appearance: `[[fg=#hex]]…[[/]]`
 * markup in the colours of the light or the dark syntax theme (`syntax-theme.ts`). */
export interface HighlightedLines {
	light: string[];
	dark: string[];
}

export interface CodeBlock {
	type: "code";
	/** Language for syntax highlighting. */
	language: DocsSyntaxLanguage;
	content: string;
	/** Optional filename - when present, shows file header with icon */
	filename?: string;
	/** Build-time snapshot of syntax-colored lines for TUI rendering */
	highlightedLines?: HighlightedLines;
}

export interface TableBlock {
	type: "table";
	headers: (string | RichText)[];
	rows: (string | RichText)[][];
	/** Column index to render in monospace font (0-indexed) */
	monospaceCol?: number;
}

export interface ListBlock {
	type: "list";
	ordered?: boolean;
	items: (string | RichText | ListItem)[];
}

export interface ListItem {
	text: string | RichText;
	children?: (string | RichText)[];
}

export interface InteractiveBlock {
	type: "interactive";
	/** Optional intro text before the steps */
	intro?: string | RichText;
	steps: InteractiveStep[];
}

export interface InteractiveStep {
	/** The command to type */
	command: string;
	/** Description of what this command does */
	description: string | RichText;
}

export interface CommandBlock {
	type: "command";
	/** Language for syntax highlighting. */
	language: DocsSyntaxLanguage;
	/** Description shown above the command */
	description: string;
	/** The command(s) to run - single string or array for multiple lines */
	command: string | string[];
	/** Optional expected output (shown dimmer, not copied) */
	output?: string;
	/** Build-time snapshot of syntax-colored command lines for TUI rendering */
	highlightedCommandLines?: HighlightedLines;
}

/** Navigation section for docs sidebar */
export interface NavSection {
	title: string;
	items: NavItem[];
}

export interface NavItem {
	title: string;
	slug: string;
	/** A distro page (every distro has its own) or a page shared by every distro. */
	distro: boolean;
}

export interface QABlock {
	type: "qa";
	items: QAItem[];
}

export interface QAItem {
	/** The question text */
	question: string | RichText;
	/** Answer content - can contain any block types */
	answer: ContentBlock[];
}

export interface NoteBlock {
	type: "note";
	/** Visual style: info (blue), warning (yellow), danger (red) */
	variant: "info" | "warning" | "danger";
	/** Note content */
	content: string | RichText;
}
