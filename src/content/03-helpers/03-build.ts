import type { DocsContent } from "../../types"
import { rich, code } from "../../rich-text"

export const helpersBuildContent: DocsContent = {
	title: "Build Helpers",
	intro: "Functions for extracting archives. For running commands, see the Commands helpers.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`Build helpers extract archives to prepare sources for compilation. Use ${code("shell()")} or ${code("shell_in()")} from the Commands helpers to run build commands.`,
				},
			],
		},
		{
			title: "extract",
			content: [
				{
					type: "text",
					content: rich`Extract an archive to a destination directory. Takes the archive path and destination directory as arguments. Format is auto-detected from the file extension.`,
				},
				{
					type: "table",
					headers: ["Format", "Extensions"],
					rows: [
						["tar.gz / tgz", ".tar.gz, .tgz"],
						["tar.xz / txz", ".tar.xz, .txz"],
						["tar.bz2 / tbz2", ".tar.bz2, .tbz2"],
						["tar.zst", ".tar.zst"],
						["zip", ".zip"],
					],
					monospaceCol: 0,
				},
				{
					type: "code",
					language: "rhai",
					content: `let archive = download(url, join_path(BUILD_DIR, "foo-1.0.tar.xz"));
extract(archive, BUILD_DIR);
// Creates BUILD_DIR/foo-1.0/`,
				},
			],
		},
		{
			title: "extract_with_format",
			content: [
				{
					type: "text",
					content: "Extract an archive with an explicit format. Useful when the file extension doesn't match the actual format.",
				},
				{
					type: "code",
					language: "rhai",
					content: `// Force tar.gz extraction even if extension is wrong
extract_with_format(archive, BUILD_DIR, "tar.gz");`,
				},
			],
		},
		{
			title: "Running Build Commands",
			content: [
				{
					type: "text",
					content: rich`Use ${code("shell_in()")} to run commands in a specific directory. This is the recommended pattern instead of changing directories:`,
				},
				{
					type: "code",
					language: "rhai",
					content: `fn build(ctx) {
    let src = ctx.source_dir;

    // Run configure in the source directory
    shell_in(src, "./configure --prefix=" + PREFIX);

    // Run make in the source directory
    shell_in(src, "make -j" + NPROC);

    ctx
}`,
				},
				{
					type: "text",
					content: rich`See ${code("shell()")}, ${code("shell_in()")}, ${code("shell_output()")} in the Commands helpers for more options.`,
				},
			],
		},
	],
}
