import type { DocsContent } from "../../types"
import { rich, code, link } from "../../rich-text"

export const helpersOverviewContent: DocsContent = {
	title: "Helpers Overview",
	intro: rich`Helper functions available in ${link("recipe scripts", "/docs/recipe-format")}. All helpers are pure functions that take explicit inputs and return explicit outputs.`,
	sections: [
		{
			title: "Introduction",
			content: [
				{
					type: "text",
					content:
						"Helper functions are organized by lifecycle phase. All functions are pure - they take explicit paths as input and return paths or results. This makes data flow visible and enables caching.",
				},
				{
					type: "code",
					language: "rhai",
					content: `let ctx = #{
    name: "foo",
    version: "1.0",
    source_dir: "",
};

fn acquire(ctx) {
    let archive = download(
        "https://example.com/foo-1.0.tar.gz",
        join_path(BUILD_DIR, "foo.tar.gz")
    );
    extract(archive, BUILD_DIR);
    ctx.source_dir = join_path(BUILD_DIR, "foo-1.0");
    ctx
}

fn build(ctx) {
    shell_in(ctx.source_dir, "./configure --prefix=" + PREFIX);
    shell_in(ctx.source_dir, "make -j" + NPROC);
    ctx
}

fn install(ctx) {
    shell("install -Dm755 " + join_path(ctx.source_dir, "foo") + " " + join_path(PREFIX, "bin/foo"));
    ctx
}`,
				},
			],
		},
		{
			title: "Categories",
			content: [
				{
					type: "list",
					items: [
						rich`${link("Acquire", "/docs/helpers-acquire")} - Download, clone, and verify sources`,
						rich`${link("Build", "/docs/helpers-build")} - Extract archives`,
						rich`${link("Install", "/docs/helpers-install")} - Install files to PREFIX`,
						rich`${link("Filesystem", "/docs/helpers-filesystem")} - File and directory operations`,
						rich`${link("Environment", "/docs/helpers-environment")} - Environment variables`,
						rich`${link("Commands", "/docs/helpers-commands")} - Shell command execution`,
						rich`${link("HTTP", "/docs/helpers-http")} - HTTP requests and GitHub API`,
						rich`${link("Paths", "/docs/helpers-paths")} - Path manipulation utilities`,
						rich`${link("LLM", "/docs/helpers-llm")} - AI-assisted version/URL extraction`,
					],
				},
			],
		},
		{
			title: "Built-in Variables",
			content: [
				{
					type: "text",
					content: "These constants are available in all recipe scripts:",
				},
				{
					type: "table",
					headers: ["Variable", "Description", "Example"],
					rows: [
						["PREFIX", "Installation prefix (or $OUT if set)", "/usr/local"],
						["BUILD_DIR", "Temporary build directory", "/tmp/recipe-build-xxx"],
						["ARCH", "Target architecture", "x86_64, aarch64"],
						["NPROC", "Number of CPU cores", "8"],
						["RPM_PATH", "RPM repository path (from env)", "/var/cache/rpms"],
					],
					monospaceCol: 0,
				},
			],
		},
		{
			title: "Pure Function Design",
			content: [
				{
					type: "text",
					content: rich`All helpers take explicit inputs and return explicit outputs. For example, ${code("download(url, dest)")} returns the path where the file was saved, and ${code("extract(archive, dest)")} takes that path as input:`,
				},
				{
					type: "code",
					language: "rhai",
					content: `// Explicit data flow - you can see where files come from and go
let archive = download(url, join_path(BUILD_DIR, "foo.tar.gz"));
verify_sha256(archive, "abc123...");
extract(archive, BUILD_DIR);`,
				},
				{
					type: "text",
					content: rich`This pure function design enables the ${link("living ctx persistence model", "/docs/recipe-format#living-ctx-persistence")} - since all data flow is explicit through ${code("ctx")}, the engine can safely persist state to disk after each phase. There's no hidden state that could become stale or inconsistent.`,
				},
			],
		},
		{
			title: "Complete Example",
			content: [
				{
					type: "text",
					content: "A full recipe demonstrating multiple helper categories:",
				},
				{
					type: "code",
					filename: "ripgrep.rhai",
					language: "rhai",
					content: `let ctx = #{
    name: "ripgrep",
    version: "14.1.0",
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
    let src = ctx.extract_dir;
    shell("install -Dm755 " + join_path(src, "rg") + " " + join_path(PREFIX, "bin/rg"));
    shell("install -Dm644 " + join_path(src, "doc/rg.1") + " " + join_path(PREFIX, "share/man/man1/rg.1"));

    if dir_exists(join_path(src, "complete")) {
        shell("install -Dm644 " + join_path(src, "complete/_rg") + " " + join_path(PREFIX, "share/zsh/site-functions/_rg"));
    }
    ctx
}

fn check_update() {
    let latest = github_latest_release(ctx.repo);
    if latest != ctx.version { latest } else { () }
}`,
				},
			],
		},
	],
}
