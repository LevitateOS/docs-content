import type { DocsContent } from "../../types";
import { rich, code } from "../../rich-text";

export default {
	title: "Filesystem Helpers",
	intro:
		"File and directory operations: path checks, directories, links, permissions, file contents and globs. Paths are in the domain's filesystem.",
	sections: [
		{
			title: "exists / is_file / is_dir",
			content: [
				{
					type: "text",
					content: rich`${code("exists(path)")} is true for anything at the path, ${code("is_file(path)")} only for a regular file and ${code("is_dir(path)")} only for a directory.`,
				},
				{
					type: "code",
					language: "rhai",
					content: `if is_file(join_path(ctx.src, "configure")) {
    exec_checked("./configure", ["--prefix=/usr"], #{ cwd: ctx.src });
}
if is_dir(join_path(ctx.runtime.paths.build, "vendor")) {
    log("vendor directory present");
}`,
				},
			],
		},
		{
			title: "mkdir / rm / mv",
			content: [
				{
					type: "list",
					items: [
						rich`${code("mkdir(path)")} creates the directory and its parents, like ${code("mkdir -p")}.`,
						rich`${code("rm(pattern)")} removes every path matching a glob; directories are removed with their contents.`,
						rich`${code("mv(src, dst)")} renames a file or directory.`,
					],
				},
				{
					type: "code",
					language: "rhai",
					content: `mkdir(join_path(ctx.runtime.paths.output, "share/man/man1"));
rm(join_path(ctx.runtime.paths.build, "*.tmp"));
mv(join_path(ctx.src, "config.example"), join_path(ctx.src, "config.toml"));`,
				},
			],
		},
		{
			title: "ln / ln_force / chmod",
			content: [
				{
					type: "text",
					content: rich`${code("ln(target, link)")} creates a symbolic link; ${code("ln_force")} replaces whatever is at ${code("link")}. ${code("chmod(path, mode)")} takes an octal mode.`,
				},
				{
					type: "code",
					language: "rhai",
					content: `let bin = join_path(ctx.runtime.paths.output, "bin");
ln("python3", join_path(bin, "python"));
chmod(join_path(bin, "myapp"), 0o755);`,
				},
			],
		},
		{
			title: "Reading and Writing Files",
			content: [
				{
					type: "table",
					headers: ["Helper", "Behavior"],
					rows: [
						["read_file(path)", "Contents as a string; throws if unreadable."],
						["read_file_or_empty(path)", "Contents, or an empty string if the file can't be read."],
						["write_file(path, content)", "Replace the file's contents."],
						["append_file(path, content)", "Append to the file."],
						[
							"append_line_if_missing(path, line)",
							"Append the exact line once; returns true if it was added.",
						],
						["replace_in_file(path, from, to)", "Replace every occurrence of from in the file."],
					],
					monospaceCol: 0,
				},
				{
					type: "code",
					language: "rhai",
					content: `let release = trim(read_file(join_path(ctx.src, "include/config/kernel.release")));
append_line_if_missing(join_path(ctx.runtime.paths.output, "etc/shells"), "/bin/zsh");`,
				},
			],
		},
		{
			title: "glob_list / glob_exists",
			content: [
				{
					type: "text",
					content: rich`${code("glob_list(pattern)")} returns the matching paths, sorted; no match is an empty array. ${code("glob_exists(pattern)")} is true if anything matches. An invalid pattern or an unreadable directory is an error.`,
				},
				{
					type: "code",
					language: "rhai",
					content: `for file in glob_list(join_path(ctx.src, "src/*.c")) {
    log("found " + file);
}`,
				},
			],
		},
	],
} satisfies DocsContent;
