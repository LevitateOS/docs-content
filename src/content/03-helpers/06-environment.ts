import type { DocsContent } from "../../types"
import { rich, code } from "../../rich-text"

export const helpersEnvironmentContent: DocsContent = {
	title: "Environment Helpers",
	intro: "Functions for reading and setting environment variables.",
	sections: [
		{
			title: "env",
			content: [
				{
					type: "text",
					content: "Get an environment variable. Returns empty string if not set.",
				},
				{
					type: "code",
					language: "rhai",
					content: `let home = env("HOME");
let cc = env("CC");
if cc == "" {
    cc = "gcc";
}`,
				},
			],
		},
		{
			title: "set_env",
			content: [
				{
					type: "text",
					content: rich`Set an environment variable for the current process and all subsequent ${code("shell()")} calls.`,
				},
				{
					type: "code",
					language: "rhai",
					content: `set_env("CFLAGS", "-O2 -march=native");
set_env("CC", "clang");
shell_in(ctx.source_dir, "make");`,
				},
			],
		},
		{
			title: "Logging",
			content: [
				{
					type: "text",
					content: "Log messages at different levels:",
				},
				{
					type: "code",
					language: "rhai",
					content: `log("Building kernel...");           // Info level
debug("Source dir: " + ctx.source_dir); // Debug level (hidden by default)
warn("Config changed, rebuilding");     // Warning level`,
				},
			],
		},
	],
}
