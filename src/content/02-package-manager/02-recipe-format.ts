import type { DocsContent } from "../../types"
import { rich, code, link } from "../../rich-text"

export const recipeFormatContent: DocsContent = {
	title: "Recipe Format",
	meta: {
		product: "shared",
		scopes: ["reference"],
		audience: ["developer"],
		stability: "experimental",
	},
	intro: rich`Recipes are ${link("Rhai", "https://rhai.rs")} scripts executed inside a configured Ginux domain. They own package facts and custom acquire/build/install behavior. Every executable recipe declares ${code("const RECIPE_API = 2;")}.`,
	sections: [
		{
			title: "Current Contract",
			content: [
				{
					type: "table",
					headers: ["Field", "Purpose"],
					rows: [
						["RUNTIME / ctx.runtime", "Immutable invocation paths, target and options."],
						["ctx.name / ctx.version", "Package facts initialized from the current recipe."],
						["ctx.state", "Resumable values paired with durable filesystem checkpoints."],
						["ctx.outputs", "Named files/directories selected for validated publication."],
					],
					monospaceCol: 0,
				},
				{
					type: "text",
					content: rich`Checks return ${code("ready(ctx)")} or ${code("needs_work(ctx, reason)")}. Errors fail execution. Phase hooks return updated context, and custom readiness checks the real products. Only ${code("ctx.state")} is restored; recipe source files stay unchanged.`,
				},
			],
		},
		{
			title: "Inputs, Work and Products",
			content: [
				{
					type: "text",
					content: rich`Callers import immutable inputs with ${code("--input NAME=PATH")} at ${code("/inputs/NAME")}. Owned build work uses ${code("/work/build")}, dependency tools ${code("/work/tools")}, and the selected target/output ${code("/out")}. A named ${code("target")} input seeds the owned target on fresh state.`,
				},
				{
					type: "text",
					content: rich`After successful execution and archive validation, final JSON contains the published host paths in ${code("ctx.outputs")}. Consumers validate required names and kinds. Remove/cleanup changes owned files while imported inputs and earlier publications stay immutable. Current scope excludes live-system activation.`,
				},
				{
					type: "text",
					content: rich`Downloads require a SHA256 pin; Git acquisition requires an exact destination and full commit. Callers explicitly grant endpoint permissions and resource bounds. Normal execution uses no AI provider; optional repair belongs to the coordinator.`,
				},
			],
		},
		{
			title: "Authoritative Guides",
			content: [
				{
					type: "list",
					items: [
						rich`${link("Writing recipes", "https://github.com/LevitateOS/recipe/blob/main/WRITING_RECIPES.md")} — current lifecycle and runnable example.`,
						rich`${link("Recipe README", "https://github.com/LevitateOS/recipe/blob/main/README.md")} — environment preparation, CLI, diagnostics and recovery.`,
						rich`${link("Helper reference", "https://github.com/LevitateOS/recipe/blob/main/HELPERS_AUDIT.md")} — registered helper signatures and behavior.`,
					],
				},
			],
		},
	],
}
