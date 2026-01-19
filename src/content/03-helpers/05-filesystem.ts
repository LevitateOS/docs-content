import type { DocsContent } from "../../types"

export const helpersFilesystemContent: DocsContent = {
	title: "Filesystem Helpers",
	intro: "File and directory operations including path checks, manipulation, and reading.",
	sections: [
		{
			title: "exists / file_exists / dir_exists",
			content: [
				{
					type: "text",
					content: "Check if paths exist.",
				},
				{
					type: "code",
					language: "rhai",
					content: `if exists("/usr/bin/gcc") {
    run("make CC=gcc");
}

if file_exists("config.toml") {
    // ...
}

if dir_exists("vendor") {
    cd("vendor");
}`,
				},
			],
		},
		{
			title: "mkdir",
			content: [
				{
					type: "text",
					content: "Create a directory and all parent directories.",
				},
				{
					type: "code",
					language: "rhai",
					content: `mkdir("/opt/myapp/data");`,
				},
			],
		},
		{
			title: "rm",
			content: [
				{
					type: "text",
					content: "Remove files or directories matching a glob pattern.",
				},
				{
					type: "code",
					language: "rhai",
					content: `rm("*.tmp");
rm("build/cache/*");`,
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
					content: `mv("config.example", "config.toml");`,
				},
			],
		},
		{
			title: "ln",
			content: [
				{
					type: "text",
					content: "Create a symbolic link.",
				},
				{
					type: "code",
					language: "rhai",
					content: `ln("myapp-1.0", "myapp");  // myapp -> myapp-1.0`,
				},
			],
		},
		{
			title: "chmod",
			content: [
				{
					type: "text",
					content: "Change file permissions. Takes octal mode.",
				},
				{
					type: "code",
					language: "rhai",
					content: `chmod("script.sh", 0o755);   // rwxr-xr-x
chmod("secret.key", 0o600);  // rw-------`,
				},
			],
		},
		{
			title: "read_file",
			content: [
				{
					type: "text",
					content: "Read a file's contents as a string.",
				},
				{
					type: "code",
					language: "rhai",
					content: `let config = read_file("config.toml");
if config.contains("debug = true") {
    // ...
}`,
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
					content: `let sources = glob_list("src/*.c");
for file in sources {
    print(file);
}`,
				},
			],
		},
	],
}
