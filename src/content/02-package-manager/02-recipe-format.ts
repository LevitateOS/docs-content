import type { DocsContent } from "../../types"

export const recipeFormatContent: DocsContent = {
	title: "Recipe Format",
	intro: "Recipes are [Rhai](https://rhai.rs) scripts that define how to acquire, build, and install packages. Each recipe declares metadata as variables and implements lifecycle functions.",
	sections: [
		{
			title: "Basic Structure",
			content: [
				{
					type: "text",
					content:
						"A recipe is a `.rhai` file with variables defining package metadata and functions implementing the installation lifecycle.",
				},
				{
					type: "code",
					language: "rhai",
					content: `let name = "mypackage";
let version = "1.0.0";
let description = "Short description";
let installed = false;

fn acquire() {
    download(\`https://example.com/\${name}-\${version}.tar.gz\`);
}

fn build() {
    extract("tar.gz");
    cd(\`\${name}-\${version}\`);
    run(\`./configure --prefix=\${PREFIX}\`);
    run(\`make -j\${NPROC}\`);
}

fn install() {
    run("make install");
}`,
				},
			],
		},
		{
			title: "Required Variables",
			content: [
				{
					type: "table",
					headers: ["Variable", "Type", "Description"],
					rows: [
						["name", "String", "Package name (alphanumeric, hyphens, underscores)"],
						["version", "String", "Package version"],
						["installed", "Boolean", "Installation state (start with `false`)"],
					],
					monospaceCol: 0,
				},
			],
		},
		{
			title: "Optional Variables",
			content: [
				{
					type: "table",
					headers: ["Variable", "Type", "Description"],
					rows: [
						["description", "String", "Human-readable description"],
						["deps", "Array", "Dependencies: `let deps = [\"pkg1\", \"pkg2\"];`"],
					],
					monospaceCol: 0,
				},
				{
					type: "text",
					content: "When `installed = true`, these are also expected:",
				},
				{
					type: "table",
					headers: ["Variable", "Type", "Description"],
					rows: [
						["installed_version", "String", "Version that was installed"],
						["installed_files", "Array", "Paths of installed files (for removal)"],
						["installed_at", "Integer", "Unix timestamp of installation"],
					],
					monospaceCol: 0,
				},
				{
					type: "text",
					content: "These are set automatically by the recipe CLI after successful installation.",
				},
			],
		},
		{
			title: "Built-in Constants",
			content: [
				{
					type: "text",
					content: "These read-only values are available in all recipe scripts:",
				},
				{
					type: "table",
					headers: ["Constant", "Example Value", "Description"],
					rows: [
						["PREFIX", "/usr/local", "Installation prefix"],
						["BUILD_DIR", "/tmp/recipe-xxxx", "Temporary build directory"],
						["ARCH", "x86_64", "Target architecture"],
						["NPROC", "8", "Number of CPU cores"],
						["RPM_PATH", "/var/cache/rpms", "RPM repository path (from env)"],
					],
					monospaceCol: 0,
				},
			],
		},
		{
			title: "Lifecycle",
			content: [
				{
					type: "text",
					content: "When you run `recipe install <package>`, the CLI executes these phases in order:",
				},
				{
					type: "list",
					ordered: true,
					items: [
						"**Check** - `is_installed()` or recipe state (skip if already installed)",
						"**Acquire** - `acquire()` downloads or copies source materials",
						"**Build** - `build()` compiles or transforms sources (optional)",
						"**Pre-install** - `pre_install()` hook (optional)",
						"**Install** - `install()` copies files to PREFIX",
						"**Post-install** - `post_install()` hook (optional)",
						"**State update** - CLI sets `installed = true` and records metadata",
					],
				},
				{
					type: "text",
					content: "For removal (`recipe remove`), the phases are:",
				},
				{
					type: "list",
					ordered: true,
					items: [
						"**Pre-remove** - `pre_remove()` hook (optional)",
						"**Delete** - Remove all files in `installed_files`",
						"**Remove** - `remove()` custom cleanup (optional)",
						"**Post-remove** - `post_remove()` hook (optional)",
					],
				},
			],
		},
		{
			title: "Required Functions",
			content: [
				{
					type: "table",
					headers: ["Function", "Purpose"],
					rows: [
						["acquire()", "Download or copy source materials to BUILD_DIR"],
						["install()", "Install files to PREFIX"],
					],
					monospaceCol: 0,
				},
			],
		},
		{
			title: "Optional Functions",
			content: [
				{
					type: "table",
					headers: ["Function", "Purpose"],
					rows: [
						["build()", "Compile or transform sources"],
						["is_installed()", "Custom installation check (return bool)"],
						["check_update()", "Check for updates (return version string or `()`)"],
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
			title: "Examples",
			content: [],
		},
		{
			title: "Pre-built Binary",
			level: 3,
			content: [
				{
					type: "text",
					content: "Download and extract a pre-built release:",
				},
				{
					type: "file",
					filename: "ripgrep.rhai",
					language: "rhai",
					content: `let name = "ripgrep";
let version = "14.1.1";
let description = "Fast line-oriented search tool";
let installed = false;

fn acquire() {
    let url = \`https://github.com/BurntSushi/ripgrep/releases/download/\${version}/ripgrep-\${version}-\${ARCH}-unknown-linux-musl.tar.gz\`;
    download(url);
}

fn build() {
    extract("tar.gz");
    cd(\`ripgrep-\${version}-\${ARCH}-unknown-linux-musl\`);
}

fn install() {
    install_bin("rg");
    install_man("doc/rg.1");
}`,
				},
				{
					type: "text",
					content: "See [Helper Functions](/docs/helper-functions) for `download()`, `extract()`, `install_bin()`, etc.",
				},
			],
		},
		{
			title: "Source Build",
			level: 3,
			content: [
				{
					type: "text",
					content: "Build from source using configure/make:",
				},
				{
					type: "file",
					filename: "bash.rhai",
					language: "rhai",
					content: `let name = "bash";
let version = "5.2.37";
let description = "GNU Bourne-Again Shell";
let installed = false;

fn acquire() {
    download(\`https://ftp.gnu.org/gnu/bash/bash-\${version}.tar.gz\`);
}

fn build() {
    extract("tar.gz");
    cd(\`bash-\${version}\`);
    run(\`./configure --prefix=\${PREFIX}\`);
    run(\`make -j\${NPROC}\`);
}

fn install() {
    run("make install");
}`,
				},
			],
		},
		{
			title: "With Dependencies",
			level: 3,
			content: [
				{
					type: "text",
					content: "Declare dependencies with the `deps` array:",
				},
				{
					type: "file",
					filename: "htop.rhai",
					language: "rhai",
					content: `let name = "htop";
let version = "3.3.0";
let description = "Interactive process viewer";
let deps = ["ncurses"];
let installed = false;

fn acquire() {
    download(\`https://github.com/htop-dev/htop/releases/download/\${version}/htop-\${version}.tar.xz\`);
}

fn build() {
    extract("tar.xz");
    cd(\`htop-\${version}\`);
    run(\`./configure --prefix=\${PREFIX}\`);
    run(\`make -j\${NPROC}\`);
}

fn install() {
    run("make install");
}`,
				},
				{
					type: "text",
					content: "Install with `recipe install htop --deps` to resolve and install dependencies first.",
				},
			],
		},
		{
			title: "With Update Checking",
			level: 3,
			content: [
				{
					type: "text",
					content: "Implement `check_update()` to enable `recipe update`:",
				},
				{
					type: "code",
					language: "rhai",
					content: `fn check_update() {
    let latest = github_latest_release("BurntSushi/ripgrep");
    if latest != version {
        latest  // Return new version
    } else {
        ()      // No update available
    }
}`,
				},
				{
					type: "text",
					content: "When an update is found, `recipe upgrade` will remove the old version and install the new one.",
				},
			],
		},
		{
			title: "Package Resolution",
			content: [
				{
					type: "text",
					content: "When you run `recipe install <name>`, the CLI looks for recipes in this order:",
				},
				{
					type: "list",
					ordered: true,
					items: [
						"If `<name>` contains `/` or ends with `.rhai`: treat as explicit path",
						"`<recipes_dir>/<name>.rhai`",
						"`<recipes_dir>/<name>/<name>.rhai` (subdirectory style)",
					],
				},
				{
					type: "text",
					content: "The default recipes directory is `~/.local/share/recipe/recipes/`. Override with `--recipes-path` or `RECIPE_PATH` environment variable.",
				},
			],
		},
		{
			title: "State Persistence",
			content: [
				{
					type: "text",
					content: "After successful installation, the CLI updates the recipe file itself with installation metadata. This means recipes are self-contained - the file contains both the instructions and the current state.",
				},
				{
					type: "text",
					content: "State updates are atomic: written to a temporary file first, then renamed to prevent corruption if interrupted.",
				},
			],
		},
		{
			title: "See Also",
			content: [
				{
					type: "list",
					items: [
						"[CLI Reference](/docs/cli-reference) - Commands for installing and managing packages",
						"[Helper Functions](/docs/helper-functions) - All available functions for recipes",
					],
				},
			],
		},
	],
}
