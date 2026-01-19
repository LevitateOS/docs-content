// Types
export * from "./types"

// Hooks
export { useCopyToClipboard } from "./hooks/useCopyToClipboard"

// Navigation and content (auto-generated)
export {
	docsNav,
	installContent,
	manualInstallContent,
	cliReferenceContent,
	recipeFormatContent,
	helperFunctionsContent,
} from "./navigation.generated"

// Content manifest for programmatic access
export const docsManifest = {
	install: () =>
		import("./content/01-getting-started/01-install").then(
			(m) => m.installContent
		),
	"manual-install": () =>
		import("./content/01-getting-started/02-manual-install").then(
			(m) => m.manualInstallContent
		),
	"cli-reference": () =>
		import("./content/02-package-manager/01-cli-reference").then(
			(m) => m.cliReferenceContent
		),
	"recipe-format": () =>
		import("./content/02-package-manager/02-recipe-format").then(
			(m) => m.recipeFormatContent
		),
	"helper-functions": () =>
		import("./content/02-package-manager/03-helper-functions").then(
			(m) => m.helperFunctionsContent
		),
} as const

export type DocsSlug = keyof typeof docsManifest
