import type { DocsContent } from "../../types"
import { rich, code } from "../../rich-text"

export const helpersPathsContent: DocsContent = {
	title: "Path Helpers",
	intro:
		"Functions for manipulating file paths. These are essential for building paths to sources, archives, and install destinations.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`Path helpers let you build paths programmatically instead of string concatenation. Use ${code("join_path()")} to combine path segments safely.`,
				},
			],
		},
		{
			title: "join_path",
			content: [
				{
					type: "text",
					content: "Join two path segments. Handles trailing slashes correctly.",
				},
				{
					type: "code",
					language: "rhai",
					content: `let src = join_path(BUILD_DIR, "foo-1.0");
// BUILD_DIR/foo-1.0

let binary = join_path(src, "target/release/myapp");
// BUILD_DIR/foo-1.0/target/release/myapp

let dest = join_path(PREFIX, "bin/myapp");
// /usr/local/bin/myapp`,
				},
			],
		},
		{
			title: "dirname",
			content: [
				{
					type: "text",
					content: "Get the parent directory of a path.",
				},
				{
					type: "code",
					language: "rhai",
					content: `let parent = dirname("/home/user/foo/bar");
// "/home/user/foo"

// Useful for finding monorepo root from BUILD_DIR
let leviso_dir = dirname(BUILD_DIR);
let monorepo = dirname(leviso_dir);`,
				},
			],
		},
		{
			title: "basename",
			content: [
				{
					type: "text",
					content: "Get the final component of a path (filename or directory name).",
				},
				{
					type: "code",
					language: "rhai",
					content: `let name = basename("/home/user/foo.tar.gz");
// "foo.tar.gz"

let dir = basename("/home/user/projects/myapp");
// "myapp"`,
				},
			],
		},
		{
			title: "Common Patterns",
			content: [
				{
					type: "text",
					content: "Path helpers are commonly used to:",
				},
				{
					type: "code",
					language: "rhai",
					content: `// Build archive destination path
let archive = download(url, join_path(BUILD_DIR, ctx.name + ".tar.gz"));

// Build source directory path after extraction
ctx.source_dir = join_path(BUILD_DIR, ctx.name + "-" + ctx.version);

// Build install destination paths
let bin_dest = join_path(PREFIX, "bin/" + ctx.name);
let man_dest = join_path(PREFIX, "share/man/man1/" + ctx.name + ".1");

// Navigate relative to BUILD_DIR
let leviso_dir = dirname(BUILD_DIR);
let output_dir = join_path(leviso_dir, "output");
let staging = join_path(output_dir, "staging");`,
				},
			],
		},
	],
}
