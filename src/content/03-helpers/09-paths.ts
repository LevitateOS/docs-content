import type { DocsContent } from "../../types"
import { rich, code } from "../../rich-text"

export const helpersPathsContent: DocsContent = {
	title: "Path Helpers",
	intro:
		"Pure functions for building paths and working with strings. They have no effects and never touch the filesystem.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`Build paths from the runtime's paths with ${code("join_path()")} instead of string concatenation, and keep them in ${code("ctx")} fields so every hook uses the same ones.`,
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
					content: `let src = join_path(ctx.runtime.paths.build, "foo-1.0");
// "/work/build/foo-1.0"
let program = join_path(ctx.runtime.paths.output, "bin/myapp");
// "/out/bin/myapp"`,
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
					content: `let release = trim(read_file(join_path(ctx.src, "VERSION")));
if ends_with(ctx.url, ".zip") {
    extract_with_format(ctx.archive, ctx.runtime.paths.build, "zip");
}
let parts = split(ctx.version, ".");`,
				},
			],
		},
		{
			title: "Common Patterns",
			content: [
				{
					type: "code",
					language: "rhai",
					content: `let ctx = #{
    name: "foo",
    version: "1.0",
    archive: join_path(RUNTIME.paths.build, "foo-1.0.tar.gz"),
    src: join_path(RUNTIME.paths.build, "foo-1.0"),
    program: join_path(RUNTIME.paths.output, "bin/foo"),
    manpage: join_path(RUNTIME.paths.output, "share/man/man1/foo.1"),
};`,
				},
			],
		},
	],
}
