import type { DocsContent } from "../../types";
import { rich, code } from "../../rich-text";

export default {
	title: "Path Helpers",
	intro:
		"Pure functions for building paths and working with strings. They have no effects and never touch the filesystem.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`Build paths from ${code("src")}, ${code("out")}, ${code("WORK")} and the other engine constants with ${code("join_path()")} instead of string concatenation.`,
				},
			],
		},
		{
			title: "join_path",
			content: [
				{
					type: "text",
					content: "Join two path segments.",
				},
				{
					type: "code",
					language: "rhai",
					content: `let dir = join_path(WORK, "foo-1.0");
// WORK + "/foo-1.0"
let program = join_path(out, "bin/myapp");
// the output folder + "/bin/myapp"`,
				},
			],
		},
		{
			title: "dirname / basename",
			content: [
				{
					type: "text",
					content: "Get the parent directory, or the final component, of a path.",
				},
				{
					type: "code",
					language: "rhai",
					content: `dirname("/out/bin/myapp");          // "/out/bin"
basename("/work/build/foo.tar.gz");  // "foo.tar.gz"`,
				},
			],
		},
		{
			title: "String Helpers",
			content: [
				{
					type: "table",
					headers: ["Helper", "Returns"],
					rows: [
						["trim(s)", "s without leading and trailing whitespace"],
						["starts_with(s, prefix) / ends_with(s, suffix)", "bool"],
						["contains(s, pattern)", "bool"],
						["replace(s, from, to)", "s with every from replaced"],
						["split(s, sep)", "Array of strings"],
					],
					monospaceCol: 0,
				},
				{
					type: "code",
					language: "rhai",
					content: `let release = trim(read_file(join_path(src.source, "VERSION")));
if ends_with(archive, ".zip") {
    extract_with_format(archive, WORK, "zip");
}
let parts = split(PACKAGE.version, ".");`,
				},
			],
		},
		{
			title: "Common Patterns",
			content: [
				{
					type: "code",
					language: "rhai",
					content: `fn build(src, out) {
    let archive = join_path(WORK, "foo-1.0.tar.gz");
    let dir = join_path(WORK, "foo-1.0");
    let program = join_path(out, "bin/foo");
    let manpage = join_path(out, "share/man/man1/foo.1");
}`,
				},
			],
		},
	],
} satisfies DocsContent;
