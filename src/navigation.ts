import type { NavSection, DocsContent } from "./types"

// Import all content directly
import { installContent } from "./content/01-getting-started/01-install"
import { manualInstallContent } from "./content/01-getting-started/02-manual-install"
import { cliReferenceContent } from "./content/02-package-manager/01-cli-reference"
import { recipeFormatContent } from "./content/02-package-manager/02-recipe-format"
import { helperFunctionsContent } from "./content/02-package-manager/03-helper-functions"

// Content organized by structure (mirrors folder layout)
const structure = {
	"Getting Started": {
		install: installContent,
		"manual-install": manualInstallContent,
	},
	"Package Manager": {
		"cli-reference": cliReferenceContent,
		"recipe-format": recipeFormatContent,
		"helper-functions": helperFunctionsContent,
	},
} as const

// Build navigation from structure
export const docsNav: NavSection[] = Object.entries(structure).map(
	([sectionTitle, pages]) => ({
		title: sectionTitle,
		items: Object.entries(pages).map(([slug, content]) => ({
			title: content.title,
			href: `/docs/${slug}`,
		})),
	})
)

// Content by slug for direct access
export const contentBySlug: Record<string, DocsContent> = Object.fromEntries(
	Object.values(structure).flatMap((pages) =>
		Object.entries(pages).map(([slug, content]) => [slug, content])
	)
)

// Re-export all content
export {
	installContent,
	manualInstallContent,
	cliReferenceContent,
	recipeFormatContent,
	helperFunctionsContent,
}
