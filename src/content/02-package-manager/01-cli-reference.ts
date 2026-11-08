import type { DocsContent } from "../../types";
import { rich, code, link } from "../../rich-text";

export default {
	title: "CLI Reference",
	intro: rich`The Recipe CLI executes build-time Rhai recipes inside a configured Ginux domain and returns named published products. Prepare the launcher, verified image and worker first using the ${link("Recipe README", "https://github.com/LevitateOS/recipe/blob/master/README.md")}.`,
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
							"Run necessary acquire/build/install work with custom readiness.",
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
						["recipe list", "List declared metadata without evaluating recipe setup."],
						[
							"recipe info RECIPE",
							"Show declared/inherited metadata; dynamic values are unavailable.",
						],
						["recipe hash FILE", "Compute SHA256, SHA512 and BLAKE3."],
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
						[
							"--build-dir DIR",
							"Logical build destination and lock; default a stable directory under the state directory.",
						],
						["--state-dir DIR", "Where resumable state is kept; default ~/.local/state/recipe."],
						["--input NAME=PATH", "Import a file or tree read-only at /inputs/NAME (repeatable)."],
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
						["--timeout-secs N", "Execution deadline including silent work; default 3600 seconds."],
						["--memory-mib N", "Domain memory bound; default 2048 MiB."],
						[
							"--storage-max-objects N / --storage-max-bytes N",
							"Explicit writable filesystem bounds.",
						],
						[
							"--network-host HOST:PORT",
							"Explicit bounded outbound TCP authority; networking otherwise stays off.",
						],
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
