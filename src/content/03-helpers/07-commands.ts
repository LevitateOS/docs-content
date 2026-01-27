import type { DocsContent } from "../../types"
import { rich, code } from "../../rich-text"

export const helpersCommandsContent: DocsContent = {
	title: "Command Helpers",
	intro: "Functions for executing shell commands with different return types and behaviors.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`These functions have ${code("PREFIX")} and ${code("BUILD_DIR")} environment variables set automatically. The ${code("shell_in()")} variants run commands in a specific directory.`,
				},
			],
		},
		{
			title: "shell",
			content: [
				{
					type: "text",
					content: "Run a shell command. Throws an error if the command fails (non-zero exit).",
				},
				{
					type: "code",
					language: "rhai",
					content: `shell("make -j" + NPROC);
shell("install -Dm755 myapp " + join_path(PREFIX, "bin/myapp"));`,
				},
			],
		},
		{
			title: "shell_in",
			content: [
				{
					type: "text",
					content: rich`Run a shell command in a specific directory. This is the recommended way to run commands in a source directory instead of changing directories.`,
				},
				{
					type: "code",
					language: "rhai",
					content: `// Run configure and make in the source directory
shell_in(ctx.source_dir, "./configure --prefix=" + PREFIX);
shell_in(ctx.source_dir, "make -j" + NPROC);
shell_in(ctx.source_dir, "make install");`,
				},
			],
		},
		{
			title: "shell_output",
			content: [
				{
					type: "text",
					content: "Run a command and return its stdout. Throws if the command fails.",
				},
				{
					type: "code",
					language: "rhai",
					content: `let version = shell_output("git describe --tags");
let arch = trim(shell_output("uname -m"));
let cpus = trim(shell_output("nproc"));`,
				},
			],
		},
		{
			title: "shell_output_in",
			content: [
				{
					type: "text",
					content: "Run a command in a specific directory and return its stdout.",
				},
				{
					type: "code",
					language: "rhai",
					content: `let version = shell_output_in(ctx.source_dir, "git describe --tags");`,
				},
			],
		},
		{
			title: "shell_status",
			content: [
				{
					type: "text",
					content: "Run a command and return its exit code. Does not throw on non-zero exit.",
				},
				{
					type: "code",
					language: "rhai",
					content: `let status = shell_status("command -v clang");
if status == 0 {
    set_env("CC", "clang");
}

// Check if a command exists
if shell_status("which rustc") == 0 {
    log("Rust is installed");
}`,
				},
			],
		},
		{
			title: "shell_status_in",
			content: [
				{
					type: "text",
					content: "Run a command in a specific directory and return its exit code.",
				},
				{
					type: "code",
					language: "rhai",
					content: `let status = shell_status_in(ctx.source_dir, "test -f Makefile");
if status != 0 {
    shell_in(ctx.source_dir, "./configure");
}`,
				},
			],
		},
		{
			title: "exec",
			content: [
				{
					type: "text",
					content: "Execute a command with an array of arguments (no shell interpretation). Returns the exit code. Useful when arguments contain special characters.",
				},
				{
					type: "code",
					language: "rhai",
					content: `let code = exec("git", ["clone", "--depth", "1", url]);
let code = exec("cp", ["-r", src, dest]);`,
				},
			],
		},
		{
			title: "exec_output",
			content: [
				{
					type: "text",
					content: "Execute a command with array arguments and return its stdout. Throws if exit code is non-zero.",
				},
				{
					type: "code",
					language: "rhai",
					content: `let output = exec_output("rustc", ["--version"]);
let files = exec_output("find", [src, "-name", "*.c"]);`,
				},
			],
		},
	],
}
