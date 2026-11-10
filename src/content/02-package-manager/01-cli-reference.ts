import type { DocsContent } from "../../types";
import { rich, code, link } from "../../rich-text";

export default {
	title: "CLI Reference",
	intro: rich`The Recipe CLI uses one engine for OS-building recipes and user-managed software. It executes recipes in Ginux, publishes their named outputs, and activates a declared package output unless ${code("--no-activate")} is selected. See ${link("Post-Installation", "/docs/post-installation")} for the ripgrep workflow and the ${link("Recipe README", "https://github.com/LevitateOS/recipe/blob/master/README.md")} for runtime setup on a development host.`,
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
							"Run necessary acquire/build/install work, publish outputs and activate a declared package directory. --no-activate keeps producer-only behavior.",
						],
						[
							"recipe isinstalled RECIPE",
							"Check the active package receipt. With --no-activate, run the producer readiness check; work needed returns nonzero.",
						],
						[
							"recipe update PACKAGE",
							"Produce and activate the selected catalog recipe for an already installed package.",
						],
						[
							"recipe installed",
							"List active package receipts without executing recipes or starting Ginux.",
						],
						["recipe isbuilt RECIPE", "Run the custom build readiness check."],
						["recipe isacquired RECIPE", "Run the custom source readiness check."],
						[
							"recipe remove RECIPE",
							"Deactivate an installed package using its receipt, without recipe execution. --no-activate runs the producer remove hook.",
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
					content: rich`${code("RECIPE")} is a path to a ${code(".rhai")} file or a name, with ${code(".rhai")} appended if needed. Default lookup checks ${code("$XDG_DATA_HOME/recipe/recipes")} (normally ${code("~/.local/share/recipe/recipes")}) before the shipped ${code("/usr/share/recipe/recipes")}; a local recipe overrides the same name. ${code("--recipes-path")} or ${code("RECIPE_PATH")} selects only that collection. Run ${code("recipe --help")} and ${code("recipe <command> --help")} for the full syntax.`,
				},
			],
		},
		{
			title: "User Package Lifecycle",
			content: [
				{
					type: "text",
					content: rich`${code("recipe update ripgrep")} uses the currently selected recipe's pinned version and sources. It requires an active installation and does not discover an unpinned latest upstream release or change the catalog. After the catalog changes, run update to produce and activate that version. A failed production or activation keeps the old profile active.`,
				},
				{
					type: "text",
					content: rich`The active profile is ${code("<package-root>/profile")}; put ${code("<package-root>/profile/bin")} on ${code("PATH")}. Installation, update and removal switch complete profile generations. ${code("remove")} uses the active receipt, so a changed or missing recipe and unavailable Ginux runtime do not prevent removing an installed package. Old generations remain inactive on disk.`,
				},
				{
					type: "text",
					content: rich`An image built by the current OS builder supplies ${code("/usr/libexec/recipe/ginux")} and ${code("/usr/share/recipe/runtime/rootfs.tar")} with its digest reference in ${code("root-reference")}. Explicit ${code("GINUX_BIN")}, ${code("GINUX_ROOTFS")} and ${code("GINUX_ROOT")} selections override those defaults. The native launcher needs root bootstrap privileges; receipt inspection and removal do not start it.`,
				},
			],
		},
		{
			title: "Inputs and Results",
			content: [
				{
					type: "code",
					language: "bash",
					content: `recipe install ./producer.rhai --no-activate \\
  --input source=./offline-source \\
  --build-dir .artifacts/work/example \\
  --state-dir .artifacts/state/example \\
  --json-output .artifacts/example.json`,
				},
				{
					type: "text",
					content: rich`The producer must declare source as a directory in NEEDS.inputs and its returned products in NEEDS.outputs. Inputs are imported read-only at ${code("/inputs/NAME")}. A named ${code("target")} input seeds owned ${code("/out")} for fresh state. Final JSON contains validated published host paths in ${code("ctx.outputs")}; diagnostics go to stderr. Use the same inputs, recipe and destination for producer readiness; matching cached dependencies are required, and their install hooks never run. Producer remove (${code("--no-activate")}) and cleanup use that cached-dependency rule and fail before the main hook if matching products are unavailable. Published products retain coordinator ownership. User packages are copied from a validated publication into a new active profile generation; the engine's prior publications remain unchanged.`,
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
						[
							"--recipes-path DIR",
							"Select one recipe collection; disable the default catalog fallback.",
						],
						[
							"--package-root DIR",
							"Package receipts and profile storage; root defaults to /var/lib/recipe, other users to $XDG_DATA_HOME/recipe.",
						],
						[
							"--no-activate",
							"Keep install/remove/isinstalled on the producer lifecycle; the OS builder passes this explicitly.",
						],
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
