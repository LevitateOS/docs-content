import type { DocsContent } from "../../types";
import { rich, code, link } from "../../rich-text";

export default {
	title: "CLI Reference",
	intro: rich`The Recipe CLI uses one engine for OS-building recipes and user-managed software. It runs each recipe on the host when it starts no program and in an isolated Ginux domain otherwise (the Recipe page explains which), publishes their named outputs, and activates a declared package output unless ${code("--no-activate")} is selected. See ${link("Post-Installation", "/docs/post-installation")} for the ripgrep workflow and the ${link("Recipe README", "https://github.com/LevitateOS/recipe/blob/master/README.md")} for runtime setup on a development host.`,
	sections: [
		{
			title: "Commands",
			content: [
				{
					type: "table",
					headers: ["Command", "Behavior"],
					rows: [
						[
							"recipe download RECIPE",
							"The download step only: fetch the sources and pins into the download store.",
						],
						["recipe build RECIPE", "Download what is missing, then build. Does not install."],
						[
							"recipe install RECIPE",
							"Run every missing step, publish outputs and activate a declared package directory, then clean up unless --keep. --no-activate keeps producer-only behavior.",
						],
						[
							"recipe update PACKAGE",
							"Install the version the recipe as fetched names, replacing the installed one. Never edits a recipe.",
						],
						[
							"recipe remove PACKAGE",
							"Remove the installed files using the receipt, then whatever is left of the program's downloads and build material. --keep removes only the installed program.",
						],
						[
							"recipe cleanup [RECIPE]",
							"Delete a program's downloads and build material (every program's without a name); the installed program stays. --downloads or --build limits it; --logs deletes the diagnostic logs.",
						],
						[
							"recipe state RECIPE",
							"Print the program's state: none, downloaded, built or installed.",
						],
						[
							"recipe installed",
							"List active package receipts without executing recipes or starting Ginux.",
						],
						[
							"recipe updates",
							"Tell which installed programs have a different version in their recipe; --upstream also asks whether upstream has a newer one. Only tells; changes nothing.",
						],
						["recipe storage", "Report what each program holds on disk."],
						["recipe history", "List installs, updates, removals and releases."],
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
							"Validate declarations, dependency inputs and derived contracts without running the recipe.",
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
					content: rich`${code("recipe update ripgrep")} installs the version the recipe as fetched names, in place of the installed one. Recipe only tells that upstream has a newer version (${code("recipe updates --upstream")}); it never changes a recipe and never installs a version the recipe does not name. An update is asked for one program at a time.`,
				},
				{
					type: "text",
					content: rich`After a successful install Recipe deletes the downloads, the unpacked source, the build material and the saved state. ${code("--keep")} on ${code("install")}, ${code("update")} or ${code("build")} keeps them, and the choice is remembered per program; ${code("--no-keep")} turns it off. ${code("recipe remove")} frees the program's space at once: there are no earlier versions to keep. When a step fails, Recipe reports the failure; what to do about it is the user's call.`,
				},
				{
					type: "text",
					content: rich`The active profile is ${code("<package-root>/profile")}; put ${code("<package-root>/profile/bin")} on ${code("PATH")}. ${code("remove")} uses the active receipt, so a changed or missing recipe and unavailable Ginux runtime do not prevent removing an installed package.`,
				},
				{
					type: "text",
					content: rich`An image built by the current OS builder supplies ${code("/usr/libexec/recipe/ginux")} and ${code("/usr/share/recipe/runtime/rootfs.tar")} with its digest reference in ${code("root-reference")}. Explicit ${code("GINUX_BIN")}, ${code("GINUX_ROOTFS")} and ${code("GINUX_ROOT")} selections override those defaults. The native launcher needs root bootstrap privileges; receipt inspection and removal do not start it. ${code("recipe runtime remove")} deletes the cached build image; it is fetched again when a recipe needs it.`,
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
					content: rich`The producer must declare source as a directory in NEEDS.inputs and its returned products in NEEDS.outputs. Inputs are imported read-only and reach the recipe through ${code("INPUTS")}. A named ${code("target")} input seeds the output. Final JSON contains validated published host paths in ${code("outputs")}; diagnostics go to stderr. Published products retain coordinator ownership. User packages are activated from a validated publication in the active profile.`,
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
							"Keep install/remove on the producer lifecycle; the OS builder passes this explicitly.",
						],
						[
							"--keep / --no-keep",
							"Keep the downloads and build material after a successful install, remembered per program; --no-keep turns it off and deletes them at once.",
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
						["--json-output FILE", "Write the final result JSON to a file instead of stdout."],
						[
							"--define KEY=VALUE",
							"A define the recipe declares in NEEDS.defines; not a host filesystem import.",
						],
						["--jobs N", "Requested jobs, 1–16, default 1."],
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
					content: rich`Contracts use versioned configured catalog 1002. Numeric TCP endpoints do not isolate HTTP identities; normal TLS verification remains required. Resolution selects and records a deterministic bounded address subset. CPU affinity exposes real eligible IDs, configured sysinfo is zero-filled, and poll/events have bounded waits without general signal-mask/restart semantics. See the ${link("supported runtime limits", "https://github.com/LevitateOS/recipe/blob/master/docs/runtime-limits.md")}. An interrupted build resumes from its newest checkpoint; to redo a step, clean it up and run it again. Diagnostics live under ${code("<state-root>/logs/<invocation-id>")}. Cancellation/deadline failures preserve the last complete checkpoint and cannot publish failed work.`,
				},
			],
		},
		{
			title: "Writing Recipes",
			content: [
				{
					type: "text",
					content: rich`See the ${link("Recipe Format", "/docs/recipe-format")} and the ${link("author guide", "https://github.com/LevitateOS/recipe/blob/master/WRITING_RECIPES.md")} for the API 1 contract and a runnable example.`,
				},
			],
		},
	],
} satisfies DocsContent;
