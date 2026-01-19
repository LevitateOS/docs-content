import type { DocsContent } from "../../types"

export const helpersBuildContent: DocsContent = {
	title: "Build Helpers",
	intro: "Functions for extracting archives and running build commands.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content:
						"The `run()` function has `PREFIX` and `BUILD_DIR` environment variables automatically set.",
				},
			],
		},
		{
			title: "extract",
			content: [
				{
					type: "text",
					content: "Extract the last downloaded archive to `BUILD_DIR`. Supports multiple formats:",
				},
				{
					type: "table",
					headers: ["Format", "Extensions"],
					rows: [
						["tar.gz / tgz", ".tar.gz, .tgz"],
						["tar.xz / txz", ".tar.xz, .txz"],
						["tar.bz2 / tbz2", ".tar.bz2, .tbz2"],
						["zip", ".zip"],
					],
					monospaceCol: 0,
				},
				{
					type: "code",
					language: "rhai",
					content: `download("https://example.com/foo-1.0.tar.xz");
extract("tar.xz");`,
				},
			],
		},
		{
			title: "cd",
			content: [
				{
					type: "text",
					content: "Change the current working directory for subsequent `run()` calls. Relative paths are resolved from `BUILD_DIR`.",
				},
				{
					type: "code",
					language: "rhai",
					content: `extract("tar.gz");
cd("foo-1.0");        // Now in BUILD_DIR/foo-1.0
run("./configure");   // Runs in that directory
cd("/tmp/other");     // Absolute paths work too`,
				},
			],
		},
		{
			title: "run / shell",
			content: [
				{
					type: "text",
					content: "Run a shell command in the current directory. Shows a spinner for long-running commands. `shell()` is an alias for `run()` - use it when your recipe defines its own `run()` function.",
				},
				{
					type: "text",
					content: "**Environment variables automatically set:**",
				},
				{
					type: "list",
					items: [
						"`PREFIX` - Installation prefix (e.g., `/usr/local`)",
						"`BUILD_DIR` - Temporary build directory",
					],
				},
				{
					type: "code",
					language: "rhai",
					content: `run("./configure --prefix=$PREFIX");
run("make -j4");
run("make install");

// Use shell() if recipe has its own run() function
shell("make test");`,
				},
			],
		},
	],
}
