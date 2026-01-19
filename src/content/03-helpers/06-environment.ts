import type { DocsContent } from "../../types"

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
					content: "Set an environment variable for the current process.",
				},
				{
					type: "code",
					language: "rhai",
					content: `set_env("CFLAGS", "-O2 -march=native");
set_env("CC", "clang");
run("make");`,
				},
			],
		},
	],
}
