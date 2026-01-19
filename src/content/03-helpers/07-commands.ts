import type { DocsContent } from "../../types"

export const helpersCommandsContent: DocsContent = {
	title: "Command Helpers",
	intro: "Alternative command execution functions with different return types and behaviors.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content:
						"These functions have `PREFIX` and `BUILD_DIR` environment variables set automatically. Use these when you need the command's output or exit code rather than just running it.",
				},
			],
		},
		{
			title: "run_output",
			content: [
				{
					type: "text",
					content: "Run a command and return its stdout. Fails if the command returns non-zero.",
				},
				{
					type: "code",
					language: "rhai",
					content: `let version = run_output("git describe --tags");
let arch = run_output("uname -m").trim();`,
				},
			],
		},
		{
			title: "run_status",
			content: [
				{
					type: "text",
					content: "Run a command and return its exit code. Does not fail on non-zero exit.",
				},
				{
					type: "code",
					language: "rhai",
					content: `let status = run_status("which clang");
if status == 0 {
    set_env("CC", "clang");
}`,
				},
			],
		},
		{
			title: "exec",
			content: [
				{
					type: "text",
					content:
						"Execute a command with an array of arguments (no shell interpretation). Returns the exit code.",
				},
				{
					type: "code",
					language: "rhai",
					content: `let code = exec("git", ["clone", "--depth", "1", url]);`,
				},
			],
		},
		{
			title: "exec_output",
			content: [
				{
					type: "text",
					content: "Execute a command and return its stdout. Fails if exit code is non-zero.",
				},
				{
					type: "code",
					language: "rhai",
					content: `let output = exec_output("rustc", ["--version"]);`,
				},
			],
		},
	],
}
