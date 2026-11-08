import type { DocsContent } from "../../types";
import { rich, code, link } from "../../rich-text";

export default {
	title: "Environment Helpers",
	intro: "Reading the worker's environment, finding programs, and logging.",
	sections: [
		{
			title: "env",
			content: [
				{
					type: "text",
					content: rich`${code("env(name)")} reads a variable from the worker's explicit environment and returns an empty string when it is not set. Recipes don't change the worker's environment: give a command its own variables with the ${code("env")} option of ${code("exec")}, ${code("exec_checked")} or ${code("exec_output")} (see ${link("Command Helpers", "/docs/helpers-commands")}).`,
				},
				{
					type: "code",
					language: "rhai",
					content: `let path = env("PATH");
exec_checked("make", [], #{ cwd: ctx.src, env: #{ CC: "clang", CFLAGS: "-O2" } });`,
				},
			],
		},
		{
			title: "command_exists",
			content: [
				{
					type: "text",
					content: rich`${code("command_exists(name)")} is true if the program is on the domain's ${code("PATH")}, which includes the executables of the recipe's dependencies.`,
				},
				{
					type: "code",
					language: "rhai",
					content: `if !command_exists("cargo") {
    throw "this recipe needs cargo in the image or a build dependency";
}`,
				},
			],
		},
		{
			title: "Logging",
			content: [
				{
					type: "text",
					content: rich`All diagnostics go to stderr, so stdout carries only the final JSON.`,
				},
				{
					type: "code",
					language: "rhai",
					content: `log("Building kernel...");             // [recipe] message
warn("Config changed, rebuilding");    // [recipe:warn] message
debug("source: " + ctx.src);           // with the recipe's source position
print("plain line");                   // stderr as well`,
				},
			],
		},
	],
} satisfies DocsContent;
