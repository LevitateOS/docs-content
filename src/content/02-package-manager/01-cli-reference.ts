import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"

export const cliReferenceContent: DocsContent = {
	title: "recipe CLI Reference",
	intro:
		"Complete reference for the recipe package manager CLI - a local-first package manager using Rhai scripts.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`${code("recipe")} is the local-first package manager for LevitateOS. It executes Rhai scripts that define how to acquire, build, and install packages.`,
				},
				{
					type: "note",
					variant: "info",
					content:
						"Immutable-by-default: on A/B systems, recipe changes are composed into the inactive slot (B) and activated on reboot after a trial boot + commit. Mutable mode exists as an explicit opt-in for daredevils.",
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
				{ type: "text", content: "Install a package by executing its recipe lifecycle:" },
				{
					type: "code",
					language: "bash",
					content: `recipe install <package>
recipe install <package> --deps    # Also install dependencies
recipe install ./path/to/pkg.rhai  # From local file`,
				},
				{
					type: "text",
					content: rich`${bold("Lifecycle phases:")}`,
				},
				{
					type: "list",
					ordered: true,
					items: [
						rich`${code("is_installed()")} - Skip if already installed (optional)`,
						rich`${code("acquire()")} - Download/copy source materials (required)`,
						rich`${code("build()")} - Compile or transform (optional)`,
						rich`${code("pre_install()")} - Pre-install hook (optional)`,
						rich`${code("install()")} - Copy files to PREFIX (required)`,
						rich`${code("post_install()")} - Post-install hook (optional)`,
					],
				},
				{
					type: "text",
					content: rich`After successful install, the recipe is updated with ${code("installed = true")}, ${code("installed_version")}, ${code("installed_at")} (timestamp), and ${code("installed_files")} (list of installed paths).`,
				},
				{
					type: "text",
					content:
						"On immutable A/B systems, installs and upgrades target the inactive slot. The running system is not mutated in-place; activation happens via reboot (trial boot slot B, then commit).",
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
					content: `recipe remove <package>`,
				},
				{
					type: "text",
					content: rich`${bold("Removal phases:")}`,
				},
				{
					type: "list",
					ordered: true,
					items: [
						rich`${code("pre_remove()")} - Pre-removal hook (optional)`,
						rich`Delete all files tracked in ${code("installed_files")}`,
						rich`${code("remove()")} - Custom cleanup during deletion (optional)`,
						"Clean up empty directories",
						rich`${code("post_remove()")} - Post-removal hook (optional)`,
					],
				},
				{
					type: "text",
					content:
						"If any files fail to delete, the package state is preserved and you'll need to fix permissions before retrying.",
				},
			],
		},
		{
			title: "update",
			level: 3,
			content: [
				{ type: "text", content: "Check for available updates:" },
				{
					type: "code",
					language: "bash",
					content: `recipe update              # Check all installed packages
recipe update <package>    # Check specific package`,
				},
				{
					type: "text",
					content: rich`Calls the recipe's ${code("check_update()")} function if defined. This function should return a new version string if an update is available, or ${code("()")} if up to date. When an update is found, the recipe's ${code("version")} variable is updated.`,
				},
				{
					type: "text",
					content: rich`Example ${code("check_update()")} implementation:`,
				},
				{
					type: "code",
					language: "rhai",
					content: `fn check_update() {
    let latest = github_latest_release("owner/repo");
    if latest != version {
        latest  // Return new version
    } else {
        ()      // No update
    }
}`,
				},
			],
		},
		{
			title: "upgrade",
			level: 3,
			content: [
				{ type: "text", content: "Upgrade packages to newer versions:" },
				{
					type: "code",
					language: "bash",
					content: `recipe upgrade              # Upgrade all with pending updates
recipe upgrade <package>    # Upgrade specific package`,
				},
				{
					type: "text",
					content: rich`Compares the recipe's ${code("version")} against ${code("installed_version")}. Uses semantic versioning comparison when possible, falling back to string comparison. If an upgrade is needed, upgrades into the inactive slot (A/B default) or in-place in mutable mode.`,
				},
			],
		},
		{
			title: "list",
			level: 3,
			content: [
				{ type: "text", content: "List all available packages:" },
				{
					type: "code",
					language: "bash",
					content: `recipe list

# Output shows installation status and versions:
# ripgrep    [installed: 14.1.0]
# htop       [available: 3.3.0]
# curl       [installed: 8.0, 8.5 available]`,
				},
			],
		},
		{
			title: "search",
			level: 3,
			content: [
				{ type: "text", content: "Search for packages by name:" },
				{
					type: "code",
					language: "bash",
					content: `recipe search <pattern>

# Example:
recipe search rip
#   ripgrep 14.1.0  Fast line-oriented search tool`,
				},
			],
		},
		{
			title: "info",
			level: 3,
			content: [
				{ type: "text", content: "Show detailed package information:" },
				{
					type: "code",
					language: "bash",
					content: `recipe info <package>

# Output includes:
# Name:        ripgrep
# Version:     14.1.0
# Description: Fast line-oriented search tool
# Depends:     pcre2
# Recipe:      /path/to/ripgrep.rhai
#
# Status:      Installed
# Installed:   14.1.0
# Installed at: 2024-01-15T10:30:00
# Files:       3 files
#              /usr/local/bin/rg
#              /usr/local/share/man/man1/rg.1
#              ...`,
				},
			],
		},
		{
			title: "deps",
			level: 3,
			content: [
				{ type: "text", content: "Show package dependencies:" },
				{
					type: "code",
					language: "bash",
					content: `recipe deps <package>           # Direct dependencies
recipe deps <package> --resolve # Full install order`,
				},
				{
					type: "text",
					content: rich`Without ${code("--resolve")}, shows direct dependencies only. With ${code("--resolve")}, performs topological sort to show the full install order with cycle detection.`,
				},
				{
					type: "code",
					language: "bash",
					content: `# Direct dependencies:
recipe deps myapp
#   - libfoo
#   - libbar

# Resolved install order:
recipe deps myapp --resolve
#   1. core [installed]
#   2. libfoo
#   3. libbar
#   4. myapp`,
				},
			],
		},
		{
			title: "Global Options",
			content: [
				{
					type: "table",
					headers: ["Option", "Default", "Description"],
					rows: [
						["-r, --recipes-path", "$XDG_DATA_HOME/recipe/recipes", "Path to recipes directory"],
						["-p, --prefix", "/usr/local", "Installation prefix"],
						["-b, --build-dir", "(temp dir)", "Build directory"],
					],
					monospaceCol: 0,
				},
				{
					type: "text",
					content: rich`The ${code("RECIPE_PATH")} environment variable can also set the recipes directory.`,
				},
			],
		},
		{
			title: "Writing Recipes",
			content: [
				{
					type: "text",
					content: rich`Recipes are Rhai scripts (${code(".rhai")} files) that define package metadata and lifecycle functions. See ${link("Recipe Format", "/docs/recipe-format")} for the full specification.`,
				},
			],
		},
		{
			title: "Required Variables",
			level: 3,
			content: [
				{
					type: "table",
					headers: ["Variable", "Type", "Description"],
					rows: [
						["name", "String", "Package name"],
						["version", "String", "Package version"],
						["installed", "Boolean", "Installation state (start with `false`)"],
					],
					monospaceCol: 0,
				},
				{
					type: "text",
					content: rich`When ${code("installed = true")}, these are also required:`,
				},
				{
					type: "table",
					headers: ["Variable", "Type", "Description"],
					rows: [
						["installed_version", "String", "Version that was installed"],
						["installed_files", "Array", "List of installed file paths"],
					],
					monospaceCol: 0,
				},
			],
		},
		{
			title: "Optional Variables",
			level: 3,
			content: [
				{
					type: "table",
					headers: ["Variable", "Type", "Description"],
					rows: [
						["description", "String", "Short package description"],
						["deps", "Array", "List of dependency package names"],
						["installed_at", "Integer", "Unix timestamp of installation"],
					],
					monospaceCol: 0,
				},
			],
		},
		{
			title: "Required Functions",
			level: 3,
			content: [
				{
					type: "table",
					headers: ["Function", "Purpose"],
					rows: [
						["acquire()", "Download or copy source materials"],
						["install()", "Install files to PREFIX"],
					],
					monospaceCol: 0,
				},
			],
		},
		{
			title: "Optional Functions",
			level: 3,
			content: [
				{
					type: "table",
					headers: ["Function", "Purpose"],
					rows: [
						["build()", "Compile or transform sources"],
						["is_installed()", "Custom installation check"],
						["check_update()", "Check for new versions"],
						["pre_install()", "Hook before install phase"],
						["post_install()", "Hook after install phase"],
						["pre_remove()", "Hook before removal"],
						["remove()", "Custom cleanup during removal"],
						["post_remove()", "Hook after removal"],
					],
					monospaceCol: 0,
				},
			],
		},
		{
			title: "Built-in Variables",
			level: 3,
			content: [
				{
					type: "text",
					content: "These constants are available in recipe scripts:",
				},
				{
					type: "table",
					headers: ["Variable", "Description"],
					rows: [
						["PREFIX", "Installation prefix (e.g., /usr/local)"],
						["BUILD_DIR", "Temporary build directory"],
						["ARCH", "Target architecture (x86_64, aarch64)"],
						["NPROC", "Number of CPU cores"],
						["RPM_PATH", "RPM repository path (from environment)"],
					],
					monospaceCol: 0,
				},
			],
		},
		{
			title: "Minimal Recipe Example",
			level: 3,
			content: [
				{
					type: "code",
					filename: "hello.rhai",
					language: "rhai",
					content: `let name = "hello";
let version = "1.0.0";
let installed = false;

fn acquire() {
    // Download source
    download("https://example.com/hello-1.0.0.tar.gz");
}

fn build() {
    extract("tar.gz");
    cd("hello-1.0.0");
    run("make");
}

fn install() {
    install_bin("hello");
}`,
				},
			],
		},
		{
			title: "Recipe with Dependencies",
			level: 3,
			content: [
				{
					type: "code",
					filename: "myapp.rhai",
					language: "rhai",
					content: `let name = "myapp";
let version = "2.0.0";
let description = "My application";
let deps = ["libfoo", "libbar"];
let installed = false;

fn acquire() {
    download(\`https://example.com/myapp-\${version}.tar.xz\`);
}

fn build() {
    extract("tar.xz");
    cd(\`myapp-\${version}\`);
    run(\`./configure --prefix=\${PREFIX}\`);
    run(\`make -j\${NPROC}\`);
}

fn install() {
    run("make install");
}

fn check_update() {
    let latest = github_latest_tag("owner/myapp");
    if latest != version { latest } else { () }
}`,
				},
			],
		},
		{
			title: "Package Resolution",
			content: [
				{
					type: "text",
					content: rich`When you run ${code("recipe install <name>")}, the CLI looks for recipes in this order:`,
				},
				{
					type: "list",
					ordered: true,
					items: [
						rich`Explicit path if it contains ${code("/")} or ends with ${code(".rhai")}`,
						rich`${code("<recipes_dir>/<name>.rhai")}`,
						rich`${code("<recipes_dir>/<name>/<name>.rhai")} (subdirectory style)`,
					],
				},
				{
					type: "text",
					content: rich`Package names must be alphanumeric with hyphens/underscores only. Path traversal (e.g., ${code("../")} ) is rejected.`,
				},
			],
		},
		{
			title: "Concurrency & Safety",
			content: [
				{
					type: "text",
					content:
						"The recipe CLI uses file locking to prevent concurrent operations on the same package. If a lock file exists from a crashed operation, delete it manually:",
				},
				{
					type: "code",
					language: "bash",
					content: "rm /path/to/recipes/package.rhai.lock",
				},
				{
					type: "text",
					content:
						"Recipe state updates are atomic - the file is written to a temp file first, then renamed. This prevents corruption if the process is interrupted.",
				},
			],
		},
		{
			title: "See Also",
			content: [
				{
					type: "list",
					items: [
						rich`${link("Recipe Format", "/docs/recipe-format")} - Full specification for writing recipes`,
						rich`${link("Helper Functions", "/docs/helpers-overview")} - All available functions for recipes`,
					],
				},
			],
		},
	],
}
