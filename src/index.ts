// Types
export * from "./types"

// Navigation
export { docsNav } from "./navigation"

// Content
export { installContent } from "./content/install"
export { manualInstallContent } from "./content/manual-install"
export { levitateContent } from "./content/levitate"
export { recipesContent } from "./content/recipes"

// Content manifest for programmatic access
export const docsManifest = {
	install: () => import("./content/install").then((m) => m.installContent),
	"manual-install": () => import("./content/manual-install").then((m) => m.manualInstallContent),
	levitate: () => import("./content/levitate").then((m) => m.levitateContent),
	recipes: () => import("./content/recipes").then((m) => m.recipesContent),
} as const

export type DocsSlug = keyof typeof docsManifest
