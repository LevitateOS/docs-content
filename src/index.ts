// Types
export * from "./types"

// Hooks
export { useCopyToClipboard } from "./hooks/useCopyToClipboard"

// Navigation
export { docsNav } from "./navigation"

// Content
export { installContent } from "./content/install"
export { manualInstallContent } from "./content/manual-install"
export { recipeCliContent } from "./content/recipe"
export { recipesContent } from "./content/recipes"

// Content manifest for programmatic access
export const docsManifest = {
	install: () => import("./content/install").then((m) => m.installContent),
	"manual-install": () => import("./content/manual-install").then((m) => m.manualInstallContent),
	recipe: () => import("./content/recipe").then((m) => m.recipeCliContent),
	recipes: () => import("./content/recipes").then((m) => m.recipesContent),
} as const

export type DocsSlug = keyof typeof docsManifest
