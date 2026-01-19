import type { NavSection, DocsContent } from "./types"

// Import all content directly
import { gettingStartedContent } from "./content/01-getting-started/01-getting-started"
import { installationContent } from "./content/01-getting-started/02-installation"
import { cliReferenceContent } from "./content/02-package-manager/01-cli-reference"
import { recipeFormatContent } from "./content/02-package-manager/02-recipe-format"
import { helpersOverviewContent } from "./content/03-helpers/01-overview"
import { helpersAcquireContent } from "./content/03-helpers/02-acquire"
import { helpersBuildContent } from "./content/03-helpers/03-build"
import { helpersInstallContent } from "./content/03-helpers/04-install"
import { helpersFilesystemContent } from "./content/03-helpers/05-filesystem"
import { helpersEnvironmentContent } from "./content/03-helpers/06-environment"
import { helpersCommandsContent } from "./content/03-helpers/07-commands"
import { helpersHttpContent } from "./content/03-helpers/08-http"

// Content organized by structure (mirrors folder layout)
const structure = {
	"Getting Started": {
		"getting-started": gettingStartedContent,
		"installation": installationContent,
	},
	"Package Manager": {
		"cli-reference": cliReferenceContent,
		"recipe-format": recipeFormatContent,
	},
	"Helpers": {
		"helpers-overview": helpersOverviewContent,
		"helpers-acquire": helpersAcquireContent,
		"helpers-build": helpersBuildContent,
		"helpers-install": helpersInstallContent,
		"helpers-filesystem": helpersFilesystemContent,
		"helpers-environment": helpersEnvironmentContent,
		"helpers-commands": helpersCommandsContent,
		"helpers-http": helpersHttpContent,
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
	gettingStartedContent,
	installationContent,
	cliReferenceContent,
	recipeFormatContent,
	helpersOverviewContent,
	helpersAcquireContent,
	helpersBuildContent,
	helpersInstallContent,
	helpersFilesystemContent,
	helpersEnvironmentContent,
	helpersCommandsContent,
	helpersHttpContent,
}
