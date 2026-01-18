import type { DocsContent } from "../types"

export const recipeCliContent: DocsContent = {
	title: "recipe CLI Reference",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content:
						"`recipe` is the self-sufficient package manager for LevitateOS. It builds packages from S-expression recipes without depending on apt, dnf, pacman, or any other package manager.",
				},
				{ type: "code", language: "bash", content: "recipe <command> [options] [arguments]" },
			],
		},
		{
			title: "Commands",
			content: [],
		},
		{
			title: "install",
			level: 3,
			content: [
				{ type: "text", content: "Install a package and its dependencies:" },
				{
					type: "code",
					language: "bash",
					content: `recipe install <package>

# Examples
recipe install ripgrep
recipe install ./my-package.recipe  # From local file`,
				},
			],
		},
		{
			title: "remove",
			level: 3,
			content: [
				{ type: "text", content: "Remove an installed package:" },
				{
					type: "code",
					language: "bash",
					content: `recipe remove <package>

# Example
recipe remove firefox`,
				},
			],
		},
		{
			title: "list",
			level: 3,
			content: [
				{ type: "text", content: "List available packages:" },
				{
					type: "code",
					language: "bash",
					content: `recipe list

# Output shows:
# [ ] package-name   version   description
# [*] = installed`,
				},
			],
		},
		{
			title: "info",
			level: 3,
			content: [
				{ type: "text", content: "Show package details:" },
				{
					type: "code",
					language: "bash",
					content: `recipe info <package>

# Output includes:
# - Name, version, description
# - License, homepage
# - Build dependencies
# - Runtime dependencies`,
				},
			],
		},
		{
			title: "deps",
			level: 3,
			content: [
				{ type: "text", content: "Show dependency tree:" },
				{
					type: "code",
					language: "bash",
					content: `recipe deps <package>

# Example output:
# [*] ripgrep 14.1.0
#   (build) rust
#     (build) llvm
#   pcre2`,
				},
			],
		},
		{
			title: "Options",
			content: [
				{
					type: "table",
					headers: ["Option", "Description"],
					rows: [
						["--recipe-dir <path>", "Recipe directory (default: /usr/share/recipe/recipes)"],
						["--prefix <path>", "Installation prefix (default: /usr/local)"],
						["-v, --verbose", "Verbose output"],
						["-n, --dry-run", "Show what would be done without doing it"],
					],
					monospaceCol: 0,
				},
			],
		},
		{
			title: "Recipe Directory",
			content: [
				{
					type: "text",
					content: "Recipes are stored in `/usr/share/recipe/recipes/` by default. Each package has a `.recipe` file:",
				},
				{
					type: "code",
					language: "bash",
					content: `/usr/share/recipe/recipes/
├── ripgrep.recipe
├── firefox.recipe
├── sway.recipe
└── ...`,
				},
			],
		},
		{
			title: "Installed Database",
			content: [
				{
					type: "text",
					content: "Installed packages are tracked in `/var/lib/recipe/installed`.",
				},
			],
		},
	],
}
