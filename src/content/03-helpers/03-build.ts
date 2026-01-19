import type { DocsContent } from "../../types"
import { rich, code } from "../../rich-text"

export const helpersBuildContent: DocsContent = {
	title: "Build Helpers",
	intro: "Functions for extracting archives and running build commands.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`The ${code("run()")} function has ${code("PREFIX")} and ${code("BUILD_DIR")} environment variables automatically set.`,
				},
			],
		},
		{
			title: "extract",
			content: [
				{
					type: "text",
					content: rich`Extract the last downloaded archive to ${code("BUILD_DIR")}. Supports multiple formats:`,
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
					content: rich`Change the current working directory for subsequent ${code("run()")} calls. Relative paths are resolved from ${code("BUILD_DIR")}.`,
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
					content: rich`Run a shell command in the current directory. Shows a spinner for long-running commands. ${code("shell()")} is an alias for ${code("run()")} - use it when your recipe defines its own ${code("run()")} function.`,
				},
				{
					type: "text",
					content: rich`${code("Environment variables automatically set:")}`,
				},
				{
					type: "list",
					items: [
						rich`${code("PREFIX")} - Installation prefix (e.g., ${code("/usr/local")})`,
						rich`${code("BUILD_DIR")} - Temporary build directory`,
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
