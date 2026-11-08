// The content model
export * from "./types";
export { rich, link, bold, code, italic, plainText } from "./rich-text";
export type {
	RichText,
	InlineNode,
	InlineLink,
	InlineBold,
	InlineCode,
	InlineItalic,
} from "./rich-text";

// The built docs: navigation, shared pages and each distro's pages
import type { DistroId } from "./distros";
import type { DocsContent } from "./types";
import { distroPages, docsNav, sharedPages, type DocsSlug } from "./generated";
export { distroPages, docsNav, sharedPages };
export type { DistroSlug, DocsSlug, SharedSlug } from "./generated";

/** Every page `distro` has, by slug: the shared pages and its own distro pages. */
export function docsFor(distro: DistroId): Record<DocsSlug, DocsContent> {
	return { ...sharedPages, ...distroPages[distro] };
}

export { INDUSTRIAL_PASTEL_1984_THEMES } from "./syntax-theme";
