import type { NavSection } from "./types"

export const docsNav: NavSection[] = [
	{
		title: "Getting Started",
		items: [
			{ title: "Installation (LLM)", href: "/docs/install" },
			{ title: "Manual Installation", href: "/docs/manual-install" },
		],
	},
	{
		title: "Package Manager",
		items: [
			{ title: "CLI Reference", href: "/docs/recipe" },
			{ title: "Recipe Format", href: "/docs/recipes" },
		],
	},
]
