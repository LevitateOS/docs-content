// AUTO-GENERATED - DO NOT EDIT
// Run: npx tsx scripts/generate-nav.ts

import type { NavSection } from "./types"

import { installContent } from "./content/01-getting-started/01-install"
import { manualInstallContent } from "./content/01-getting-started/02-manual-install"
import { cliReferenceContent } from "./content/02-package-manager/01-cli-reference"
import { recipeFormatContent } from "./content/02-package-manager/02-recipe-format"
import { helperFunctionsContent } from "./content/02-package-manager/03-helper-functions"

export const docsNav: NavSection[] = [
	{
		title: "Getting Started",
		items: [
			{ title: "Install", href: "/docs/install" },
			{ title: "Manual Install", href: "/docs/manual-install" }
		],
	},
	{
		title: "Package Manager",
		items: [
			{ title: "CLI Reference", href: "/docs/cli-reference" },
			{ title: "Recipe Format", href: "/docs/recipe-format" },
			{ title: "Helper Functions", href: "/docs/helper-functions" }
		],
	}
]

// Re-export content for direct imports
export { installContent, manualInstallContent, cliReferenceContent, recipeFormatContent, helperFunctionsContent }
