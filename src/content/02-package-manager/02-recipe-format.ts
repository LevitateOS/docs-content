import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"

export const recipeFormatContent: DocsContent = {
	title: "Recipe Format",
	intro: rich`Recipes are ${link("Rhai", "https://rhai.rs")} scripts that define how to acquire, build, and install packages. Each recipe uses a context map (${code("ctx")}) to pass state between lifecycle phases and implements check/action function pairs.`,
	sections: [
		{
			title: "Basic Structure",
			content: [
				{
					type: "text",
					content: rich`A recipe is a ${code(".rhai")} file with a ${code("ctx")} map for metadata and paired lifecycle functions: each action has an ${code("is_*")} check function that returns the context or throws.`,
				},
				{
					type: "code",
					language: "rhai",
					content: `let ctx = #{
    name: "mypackage",
    version: "1.0.0",
    description: "Short description",
    // Custom fields for tracking paths between phases
    source_dir: "",
    build_dir: "",
};

fn is_acquired(ctx) {
    // Check if source exists, return ctx with paths filled in
    let src = join_path(BUILD_DIR, "mypackage-" + ctx.version);
    if is_dir(src) {
        ctx.source_dir = src;
        return ctx;
    }
    throw "source not acquired";
}

fn acquire(ctx) {
    let url = "https://example.com/" + ctx.name + "-" + ctx.version + ".tar.gz";
    let archive = download(url, join_path(BUILD_DIR, ctx.name + ".tar.gz"));
    extract(archive, BUILD_DIR);
    ctx.source_dir = join_path(BUILD_DIR, ctx.name + "-" + ctx.version);
    ctx
}

fn is_built(ctx) {
    let binary = join_path(ctx.source_dir, "mypackage");
    if is_file(binary) {
        return ctx;
    }
    throw "not built";
}

fn build(ctx) {
    shell_in(ctx.source_dir, "./configure --prefix=" + PREFIX);
    shell_in(ctx.source_dir, "make -j" + NPROC);
    ctx
}

fn is_installed(ctx) {
    if is_file(join_path(PREFIX, "bin/mypackage")) {
        return ctx;
    }
    throw "not installed";
}

fn install(ctx) {
    shell_in(ctx.source_dir, "make install DESTDIR=" + PREFIX);
    ctx
}`,
				},
			],
		},
		{
			title: "Context Map (ctx)",
			content: [
				{
					type: "text",
					content: rich`The ${code("ctx")} map holds package metadata and state that flows through lifecycle phases:`,
				},
				{
					type: "table",
					headers: ["Field", "Type", "Description"],
					rows: [
						["name", "String", "Package name (alphanumeric, hyphens, underscores)"],
						["version", "String", "Package version"],
						["description", "String", "Human-readable description"],
						["(custom)", "Any", "Add any fields needed to track paths, state, etc."],
					],
					monospaceCol: 0,
				},
				{
					type: "text",
					content: rich`Functions receive ${code("ctx")} as a parameter and return it (possibly modified) or throw on error. This enables caching - if ${code("is_acquired(ctx)")} succeeds, ${code("acquire(ctx)")} is skipped.`,
				},
			],
		},
		{
			title: "Living ctx Persistence",
			content: [
				{
					type: "text",
					content: rich`The ${code("ctx")} map is a "living" object that persists across invocations. After each lifecycle phase completes, the Rust engine writes the modified ${code("ctx")} back to the ${code(".rhai")} file on disk.`,
				},
				{
					type: "text",
					content: "This persistence model provides three key benefits:",
				},
				{
					type: "list",
					items: [
						rich`${bold("Caching")} - If ${code("is_acquired(ctx)")} succeeds, ${code("acquire(ctx)")} is skipped, but ${code("ctx")} still has paths filled in from the saved state`,
						rich`${bold("Resumability")} - If a build crashes halfway, re-running picks up from the saved ${code("ctx")} state`,
						rich`${bold("Introspection")} - You can see the current state by reading the recipe file directly`,
					],
				},
				{
					type: "text",
					content: "Example: after acquire completes, the recipe file on disk is updated:",
				},
				{
					type: "code",
					language: "rhai",
					content: `// Before acquire runs:
let ctx = #{
    name: "ripgrep",
    version: "14.1.1",
    extract_dir: "",  // Empty - not yet known
};

// After acquire completes, the file on disk becomes:
let ctx = #{
    name: "ripgrep",
    version: "14.1.1",
    extract_dir: "/tmp/recipe-abc123/ripgrep-14.1.1-x86_64-unknown-linux-musl",
};`,
				},
				{
					type: "text",
					content: rich`The next time you run ${code("recipe install ripgrep")}, the engine loads this saved ${code("ctx")} and passes it to ${code("is_acquired(ctx)")}. Since ${code("extract_dir")} is already populated, the check succeeds and ${code("acquire(ctx)")} is skipped entirely.`,
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
						["PREFIX", "/usr/local", "Installation prefix (or $OUT if set)"],
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
					content: rich`When you run ${code("recipe install <package>")}, the CLI executes these phases in order. Each phase has a check function that's called first - if it succeeds, the action is skipped:`,
				},
				{
					type: "list",
					ordered: true,
					items: [
						rich`${bold("Acquire")} - ${code("is_acquired(ctx)")} → ${code("acquire(ctx)")} - Get source materials`,
						rich`${bold("Build")} - ${code("is_built(ctx)")} → ${code("build(ctx)")} - Compile or transform (optional)`,
						rich`${bold("Install")} - ${code("is_installed(ctx)")} → ${code("install(ctx)")} - Copy files to PREFIX`,
					],
				},
				{
					type: "text",
					content: "This check-then-act pattern enables efficient caching. If sources are already downloaded, acquire is skipped. If already built, build is skipped.",
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
						["is_acquired(ctx)", "Check if source materials exist, return ctx with paths or throw"],
						["acquire(ctx)", "Download/copy source materials, return ctx with source_path"],
						["is_installed(ctx)", "Check if package is installed, return ctx or throw"],
						["install(ctx)", "Install files to PREFIX, return ctx"],
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
						["is_built(ctx)", "Check if already built, return ctx or throw"],
						["build(ctx)", "Compile or transform sources, return ctx"],
						["cleanup(ctx)", "Remove build artifacts, preserve installed files"],
						["check_update()", "Check for updates (return version string or `()`)"],
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
			title: "GitHub Release Binary",
			level: 3,
			content: [
				{
					type: "text",
					content: rich`Download a pre-built release using ${code("github_download_release()")}:`,
				},
				{
					type: "code",
					filename: "ripgrep.rhai",
					language: "rhai",
					content: `let ctx = #{
    name: "ripgrep",
    version: "14.1.1",
    repo: "BurntSushi/ripgrep",
    description: "Fast line-oriented search tool",
    extract_dir: "",
};

fn is_acquired(ctx) {
    let dir = join_path(BUILD_DIR, "ripgrep-" + ctx.version + "-" + ARCH + "-unknown-linux-musl");
    if is_file(join_path(dir, "rg")) {
        ctx.extract_dir = dir;
        return ctx;
    }
    throw "not acquired";
}

fn acquire(ctx) {
    mkdir(BUILD_DIR);
    let pattern = "ripgrep-*-" + ARCH + "-unknown-linux-musl.tar.gz";
    let archive = github_download_release(ctx.repo, ctx.version, pattern);
    extract(archive, BUILD_DIR);
    ctx.extract_dir = join_path(BUILD_DIR, "ripgrep-" + ctx.version + "-" + ARCH + "-unknown-linux-musl");
    ctx
}

fn is_installed(ctx) {
    if is_file(join_path(PREFIX, "bin/rg")) {
        return ctx;
    }
    throw "not installed";
}

fn install(ctx) {
    mkdir(join_path(PREFIX, "bin"));
    shell("install -Dm755 " + join_path(ctx.extract_dir, "rg") + " " + join_path(PREFIX, "bin/rg"));
    shell("install -Dm644 " + join_path(ctx.extract_dir, "doc/rg.1") + " " + join_path(PREFIX, "share/man/man1/rg.1"));
    ctx
}`,
				},
				{
					type: "text",
					content: rich`See ${link("Helper Functions", "/docs/helpers-overview")} for ${code("github_download_release()")}, ${code("extract()")}, etc.`,
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
					type: "code",
					filename: "bash.rhai",
					language: "rhai",
					content: `let ctx = #{
    name: "bash",
    version: "5.2.37",
    description: "GNU Bourne-Again Shell",
    source_dir: "",
};

fn is_acquired(ctx) {
    let src = join_path(BUILD_DIR, ctx.name + "-" + ctx.version);
    if is_file(join_path(src, "configure")) {
        ctx.source_dir = src;
        return ctx;
    }
    throw "source not acquired";
}

fn acquire(ctx) {
    mkdir(BUILD_DIR);
    let url = "https://ftp.gnu.org/gnu/bash/bash-" + ctx.version + ".tar.gz";
    let archive = download(url, join_path(BUILD_DIR, "bash.tar.gz"));
    extract(archive, BUILD_DIR);
    ctx.source_dir = join_path(BUILD_DIR, ctx.name + "-" + ctx.version);
    ctx
}

fn is_built(ctx) {
    if is_file(join_path(ctx.source_dir, "bash")) {
        return ctx;
    }
    throw "not built";
}

fn build(ctx) {
    shell_in(ctx.source_dir, "./configure --prefix=" + PREFIX);
    shell_in(ctx.source_dir, "make -j" + NPROC);
    ctx
}

fn is_installed(ctx) {
    if is_file(join_path(PREFIX, "bin/bash")) {
        return ctx;
    }
    throw "not installed";
}

fn install(ctx) {
    shell_in(ctx.source_dir, "make install DESTDIR=" + PREFIX);
    ctx
}`,
				},
			],
		},
		{
			title: "Git Clone Source",
			level: 3,
			content: [
				{
					type: "text",
					content: rich`Clone source from git using ${code("git_clone_depth()")}:`,
				},
				{
					type: "code",
					filename: "neovim.rhai",
					language: "rhai",
					content: `let ctx = #{
    name: "neovim",
    version: "0.10.0",
    repo: "https://github.com/neovim/neovim.git",
    description: "Vim-fork focused on extensibility",
    source_dir: "",
};

fn is_acquired(ctx) {
    let src = join_path(BUILD_DIR, "neovim");
    if is_file(join_path(src, "CMakeLists.txt")) {
        ctx.source_dir = src;
        return ctx;
    }
    throw "source not acquired";
}

fn acquire(ctx) {
    mkdir(BUILD_DIR);
    let src = git_clone_depth(ctx.repo, join_path(BUILD_DIR, "neovim"), 1);
    shell_in(src, "git checkout v" + ctx.version);
    ctx.source_dir = src;
    ctx
}

fn is_built(ctx) {
    if is_file(join_path(ctx.source_dir, "build/bin/nvim")) {
        return ctx;
    }
    throw "not built";
}

fn build(ctx) {
    shell_in(ctx.source_dir, "make CMAKE_BUILD_TYPE=Release");
    ctx
}

fn is_installed(ctx) {
    if is_file(join_path(PREFIX, "bin/nvim")) {
        return ctx;
    }
    throw "not installed";
}

fn install(ctx) {
    shell_in(ctx.source_dir, "make install CMAKE_INSTALL_PREFIX=" + PREFIX);
    ctx
}`,
				},
			],
		},
		{
			title: "With Update Checking",
			level: 3,
			content: [
				{
					type: "text",
					content: rich`Implement ${code("check_update()")} to enable ${code("recipe update")}:`,
				},
				{
					type: "code",
					language: "rhai",
					content: `fn check_update() {
    let latest = github_latest_release("BurntSushi/ripgrep");
    if latest != ctx.version {
        latest  // Return new version
    } else {
        ()      // No update available
    }
}`,
				},
				{
					type: "text",
					content: rich`When an update is found, ${code("recipe upgrade")} will remove the old version and install the new one.`,
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
						rich`If ${code("<name>")} contains ${code("/")} or ends with ${code(".rhai")}: treat as explicit path`,
						rich`${code("<recipes_dir>/<name>.rhai")}`,
						rich`${code("<recipes_dir>/<name>/<name>.rhai")} (subdirectory style)`,
					],
				},
				{
					type: "text",
					content: rich`The default recipes directory is ${code("~/.local/share/recipe/recipes/")}. Override with ${code("--recipes-path")} or ${code("RECIPE_PATH")} environment variable.`,
				},
			],
		},
		{
			title: "See Also",
			content: [
				{
					type: "list",
					items: [
						rich`${link("CLI Reference", "/docs/cli-reference")} - Commands for installing and managing packages`,
						rich`${link("Helper Functions", "/docs/helpers-overview")} - All available functions for recipes`,
						rich`${link("Path Helpers", "/docs/helpers-paths")} - ${code("join_path()")}, ${code("dirname()")}, ${code("basename()")}`,
					],
				},
			],
		},
	],
}
