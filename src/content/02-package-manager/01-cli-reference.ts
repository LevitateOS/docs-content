import type { DocsContent } from "../../types"
import { rich, code, link } from "../../rich-text"

export const cliReferenceContent: DocsContent = {
	title: "CLI Reference",
	meta: {
		product: "shared",
		scopes: ["reference"],
		audience: ["developer"],
		stability: "experimental",
	},
	intro: rich`The Recipe CLI executes build-time Rhai recipes inside a configured Ginux domain and returns named published products. Prepare the launcher, verified image and worker first using the ${link("Recipe README", "https://github.com/LevitateOS/recipe/blob/main/README.md")}.`,
	sections: [
		{
			title: "Commands",
			content: [
				{
					type: "table",
					headers: ["Command", "Behavior"],
					rows: [
						["recipe install RECIPE", "Run necessary acquire/build/install work with custom readiness."],
						["recipe isinstalled RECIPE", "Check the owned selected target; work needed returns nonzero."],
						["recipe isbuilt RECIPE", "Run the custom build readiness check."],
						["recipe isacquired RECIPE", "Run the custom source readiness check."],
						["recipe remove RECIPE", "Remove owned target files; earlier publications remain immutable."],
						["recipe cleanup RECIPE", "Run optional cleanup with reason manual by default."],
						["recipe list", "List declared metadata without evaluating recipe setup."],
						["recipe info RECIPE", "Show declared/inherited metadata; dynamic values are unavailable."],
						["recipe hash FILE", "Compute SHA256, SHA512 and BLAKE3."],
					],
					monospaceCol: 0,
				},
				{
					type: "text",
					content: rich`${code("RECIPE")} is a path or name resolved using ${code("--recipes-path")}. Current scope covers managed build products and owned target views; live-system activation is outside this interface. Run ${code("recipe --help")} and ${code("recipe install --help")} for current syntax.`,
				},
			],
		},
		{
			title: "Inputs and Results",
			content: [
				{
					type: "code",
					language: "bash",
					content: `recipe install ./producer.rhai \\
  --input source=./offline-source \\
  --build-dir .artifacts/work/example \\
  --state-dir .artifacts/state/example \\
  --json-output .artifacts/example.json`,
				},
				{
					type: "text",
					content: rich`Inputs are imported read-only at ${code("/inputs/NAME")}. A named ${code("target")} input seeds owned ${code("/out")} for fresh state. Final JSON contains validated published host paths in ${code("ctx.outputs")}; diagnostics go to stderr. Use the same inputs, recipe and destination for retained checks/removal. Published products retain coordinator ownership; privileged producers require matching consumer privileges or explicit product installation.`,
				},
			],
		},
		{
			title: "Execution Options",
			content: [
				{
					type: "table",
					headers: ["Option", "Purpose"],
					rows: [
						["--recipes-path DIR", "Name/module/dependency search directory."],
						["--define KEY=VALUE", "Recipe-specific constant; not a host filesystem import."],
						["--jobs N", "Requested jobs, 1–16, default 1."],
						["--force-install / --force-build / --force-acquire", "Rerun progressively more work for the main recipe."],
						["--no-persist-state", "Disable recovery while retaining managed execution/publication."],
						["--timeout-secs N", "Execution deadline including silent work; default 3600 seconds."],
						["--memory-mib N", "Domain memory bound; default 2048 MiB."],
						["--storage-max-objects N / --storage-max-bytes N", "Explicit writable filesystem bounds."],
						["--network-host HOST:PORT", "Explicit bounded outbound TCP authority; networking otherwise stays off."],
						["--network-max-bytes N", "Cumulative network byte cap; default 8 GiB."],
					],
					monospaceCol: 0,
				},
				{
					type: "text",
					content: rich`Only ${code("ctx.state")} and matching files are recovered. Diagnostics live under ${code("<state-root>/logs/<invocation-id>")}. Cancellation/deadline failures preserve the last complete checkpoint and cannot publish failed work.`,
				},
			],
		},
		{
			title: "Optional Repair and Authoring",
			content: [
				{
					type: "text",
					content: rich`Normal execution needs no AI provider. ${code("install --autofix")} explicitly enables bounded coordinator-side patch/retry with configured provider/profile and allowed paths; readiness checks stay protected. See the ${link("current author guide", "https://github.com/LevitateOS/recipe/blob/main/WRITING_RECIPES.md")} for the sole API 2 contract and runnable example.`,
				},
			],
		},
	],
}
