import type { DocsContent } from "../../types";
import { rich, code, link } from "../../rich-text";

export default {
	title: "CLI Reference",
	intro: rich`The Recipe CLI is the shared engine for OS-building recipes and user-managed software recipes. It executes Rhai recipes inside a configured Ginux domain and returns named published files. Live-system software activation and updates are still unimplemented (see ${link("Post-Installation", "/docs/post-installation")}). Prepare the launcher, verified image and worker before executing recipes using the ${link("Recipe README", "https://github.com/LevitateOS/recipe/blob/master/README.md")}.`,
	sections: [
		{
			title: "Commands",
			content: [
				{
					type: "table",
					headers: ["Command", "Behavior"],
					rows: [
						[
							"recipe install RECIPE",
							"Run necessary acquire/build/install work and publish output files; does not activate them on the running system.",
						],
						[
							"recipe isinstalled RECIPE",
							"Check the owned selected target; work needed returns nonzero.",
						],
						["recipe isbuilt RECIPE", "Run the custom build readiness check."],
						["recipe isacquired RECIPE", "Run the custom source readiness check."],
						[
							"recipe remove RECIPE",
							"Remove owned target files; earlier publications remain immutable.",
						],
						["recipe cleanup RECIPE", "Run optional cleanup with reason manual by default."],
						[
							"recipe list",
							"List recipe files and declared metadata, not installed applications; does not run setup.",
						],
						[
							"recipe info RECIPE",
							"Show declared/inherited metadata; dynamic values are unavailable.",
						],
						["recipe hash FILE", "Compute SHA256, SHA512 and BLAKE3."],
						[
							"recipe validate RECIPE",
							"Validate declarations, dependency inputs and derived contracts without running hooks.",
						],
						["recipe inspect RECIPE", "Inspect declared authority and typed inputs/outputs."],
						[
							"recipe explain RECIPE",
							"Explain effective authority, narrowing and denial provenance.",
						],
						[
							"recipe diff BEFORE AFTER",
							"Compare declared/effective contracts and dependency authority.",
						],
					],
					monospaceCol: 0,
				},
				{
					type: "text",
					content: rich`${code("RECIPE")} is a path to a ${code(".rhai")} file, or a name looked up in ${code("--recipes-path")} (default ${code("$RECIPE_PATH")}, else ${code("~/.local/share/recipe/recipes")}), with ${code(".rhai")} appended if needed. Run ${code("recipe --help")} and ${code("recipe <command> --help")} for the full syntax.`,
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
					content: rich`The producer must declare source as a directory in NEEDS.inputs and its returned products in NEEDS.outputs. Inputs are imported read-only at ${code("/inputs/NAME")}. A named ${code("target")} input seeds owned ${code("/out")} for fresh state. Final JSON contains validated published host paths in ${code("ctx.outputs")}; diagnostics go to stderr. Use the same inputs, recipe and destination for manual readiness; matching cached dependencies are required, and their install hooks never run. Explicit remove/cleanup uses that same cached-dependency rule and fails before the main hook if matching products are unavailable. Published products retain coordinator ownership; privileged producers require matching consumer privileges or explicit product installation.`,
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
						[
							"--build-dir DIR",
							"Logical build destination and lock; default a stable directory under the state directory.",
						],
						["--state-dir DIR", "Where resumable state is kept; default ~/.local/state/recipe."],
						[
							"--input NAME=PATH",
							"Bind a declared input kind at /inputs/NAME; DEP::NAME binds a dependency input.",
						],
						["--json-output FILE", "Write the final ctx JSON to a file instead of stdout."],
						["--define KEY=VALUE", "Recipe-specific constant; not a host filesystem import."],
						["--jobs N", "Requested jobs, 1–16, default 1."],
						[
							"--force-install / --force-build / --force-acquire",
							"Rerun progressively more work for the main recipe.",
						],
						[
							"--no-persist-state",
							"Disable recovery while retaining managed execution/publication.",
						],
						[
							"--timeout-secs N",
							"Cap the recipe-declared deadline, including silent work, across the graph.",
						],
						[
							"--memory-mib N",
							"Cap each process's declared virtual address space, not total tree RAM.",
						],
						[
							"--storage-max-objects N / --storage-max-bytes N",
							"Explicit writable filesystem bounds.",
						],
						[
							"--network-host HOST:PORT",
							"Restrict declared endpoints across the graph; cannot add authority.",
						],
						["--no-network", "Remove network authority from the complete dependency graph."],
						["--network-max-bytes N", "Lower each instance's declared cumulative byte budget."],
					],
					monospaceCol: 0,
				},
				{
					type: "text",
					content: rich`Contracts use versioned configured catalog 1002. Numeric TCP endpoints do not isolate HTTP identities; normal TLS verification remains required. Resolution selects and records a deterministic bounded address subset. CPU affinity exposes real eligible IDs, configured sysinfo is zero-filled, and poll/events have bounded waits without general signal-mask/restart semantics. See the ${link("supported runtime limits", "https://github.com/LevitateOS/recipe/blob/master/docs/runtime-limits.md")}. Only ${code("ctx.state")} and matching files are recovered. Diagnostics live under ${code("<state-root>/logs/<invocation-id>")}. Cancellation/deadline failures preserve the last complete checkpoint and cannot publish failed work.`,
				},
			],
		},
		{
			title: "Writing Recipes",
			content: [
				{
					type: "text",
					content: rich`See the ${link("Recipe Format", "/docs/recipe-format")} and the ${link("author guide", "https://github.com/LevitateOS/recipe/blob/master/WRITING_RECIPES.md")} for the API 2 contract and a runnable example.`,
				},
			],
		},
	],
} satisfies DocsContent;
