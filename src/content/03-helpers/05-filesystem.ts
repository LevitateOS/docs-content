import type { DocsContent } from "../../types"
import { rich, code } from "../../rich-text"

export const helpersFilesystemContent: DocsContent = {
	title: "Filesystem Helpers",
	intro: "File and directory operations including path checks, manipulation, and reading.",
	sections: [
		{
			title: "exists / is_file / is_dir",
			content: [
				{
					type: "text",
					content: "Check if paths exist. These are essential for the is_* check functions in recipes.",
				},
				{
					type: "code",
					language: "rhai",
					content: `// Check if anything exists at path
if exists("/usr/bin/gcc") {
    set_env("CC", "gcc");
}

// Check specifically for a file
if is_file(join_path(ctx.source_dir, "configure")) {
    shell_in(ctx.source_dir, "./configure");
}

// Check specifically for a directory
if is_dir(join_path(BUILD_DIR, "vendor")) {
    log("Vendor directory exists");
}`,
				},
				{
					type: "text",
					content: rich`Aliases: ${code("file_exists()")} = ${code("is_file()")}, ${code("dir_exists()")} = ${code("is_dir()")}`,
				},
			],
		},
		{
			title: "mkdir",
			content: [
				{
					type: "text",
					content: "Create a directory and all parent directories (like mkdir -p).",
				},
				{
					type: "code",
					language: "rhai",
					content: `mkdir(BUILD_DIR);
mkdir(join_path(PREFIX, "bin"));
mkdir(join_path(PREFIX, "share/man/man1"));`,
				},
			],
		},
		{
			title: "rm",
			content: [
				{
					type: "text",
					content: "Remove files or directories. Accepts a path string.",
				},
				{
					type: "code",
					language: "rhai",
					content: `rm(join_path(BUILD_DIR, "tmp"));
rm(join_path(ctx.source_dir, "build"));`,
				},
			],
		},
		{
			title: "mv",
			content: [
				{
					type: "text",
					content: "Move or rename a file.",
				},
				{
					type: "code",
					language: "rhai",
					content: `mv(
    join_path(ctx.source_dir, "config.example"),
    join_path(ctx.source_dir, "config.toml")
);`,
				},
			],
		},
		{
			title: "ln",
			content: [
				{
					type: "text",
					content: "Create a symbolic link. First argument is the target, second is the link name.",
				},
				{
					type: "code",
					language: "rhai",
					content: `// Create symlink: /usr/local/bin/python -> python3
ln(
    join_path(PREFIX, "bin/python3"),
    join_path(PREFIX, "bin/python")
);`,
				},
			],
		},
		{
			title: "chmod",
			content: [
				{
					type: "text",
					content: "Change file permissions. Takes octal mode as integer.",
				},
				{
					type: "code",
					language: "rhai",
					content: `chmod(join_path(PREFIX, "bin/myapp"), 0o755);   // rwxr-xr-x
chmod(join_path(PREFIX, "etc/secret.key"), 0o600);  // rw-------`,
				},
			],
		},
		{
			title: "read_file / read_file_or_empty",
			content: [
				{
					type: "text",
					content: rich`Read a file's contents as a string. ${code("read_file_or_empty()")} returns empty string if file doesn't exist instead of throwing.`,
				},
				{
					type: "code",
					language: "rhai",
					content: `// Read kernel version from file
let version = trim(read_file(join_path(build_dir, "include/config/kernel.release")));

// Read with fallback to empty
let cached_hash = read_file_or_empty(join_path(build_dir, ".hash"));
if cached_hash == "" {
    // No cached hash, need to rebuild
}`,
				},
			],
		},
		{
			title: "write_file / append_file",
			content: [
				{
					type: "text",
					content: "Write or append content to a file.",
				},
				{
					type: "code",
					language: "rhai",
					content: `write_file(join_path(build_dir, ".hash"), new_hash);
append_file(join_path(PREFIX, "etc/shells"), "/bin/zsh\\n");`,
				},
			],
		},
		{
			title: "glob_list",
			content: [
				{
					type: "text",
					content: "List files matching a glob pattern. Returns an array of paths.",
				},
				{
					type: "code",
					language: "rhai",
					content: `let sources = glob_list(join_path(ctx.source_dir, "src/*.c"));
for file in sources {
    log("Found: " + file);
}`,
				},
			],
		},
	],
}
