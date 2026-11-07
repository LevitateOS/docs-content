import type { DocsContent } from "../../types"
import { rich, code } from "../../rich-text"

export const helpersCommandsContent: DocsContent = {
	title: "Command Helpers",
	intro: "Functions for running programs and shell commands inside the recipe's domain.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`Commands run inside Ginux and need their binaries in the selected image or in dependency tools, whose executables are on ${code("PATH")}. Prefer the ${code("exec")} family: arguments are an array, so nothing is reparsed by a shell. Their output goes to stderr with the rest of the diagnostics.`,
				},
				{
					type: "table",
					headers: ["Helper", "On nonzero exit", "Returns"],
					rows: [
						["exec_checked(cmd, args[, options])", "Throws", "()"],
						["exec_output(cmd, args[, options])", "Throws", "stdout as a string"],
						["exec(cmd, args[, options])", "Returns the status", "exit status (int)"],
						["shell(cmd) / shell_in(dir, cmd)", "Throws", "()"],
						["shell_output(cmd) / shell_output_in(dir, cmd)", "Throws", "stdout as a string"],
						["shell_status(cmd) / shell_status_in(dir, cmd)", "Returns the status", "exit status, or -1 if it could not run"],
					],
					monospaceCol: 0,
				},
			],
		},
		{
			title: "exec_checked",
			content: [
				{
					type: "text",
					content: rich`Run a program and throw if it exits nonzero. The optional map sets ${code("cwd")} and ${code("env")} for this command only; the worker's own directory and environment don't change.`,
				},
				{
					type: "code",
					language: "rhai",
					content: `exec_checked("cargo", ["build", "--release", "--locked", "--offline"], #{
    cwd: "/inputs/source",
    env: #{ CARGO_HOME: join_path(ctx.runtime.paths.build, "cargo") },
});`,
				},
			],
		},
		{
			title: "exec_output",
			content: [
				{
					type: "text",
					content: "Run a program and return its stdout. Throws if it exits nonzero.",
				},
				{
					type: "code",
					language: "rhai",
					content: `let version = trim(exec_output("rustc", ["--version"]));
let files = exec_output("find", [ctx.src, "-name", "*.c"]);`,
				},
			],
		},
		{
			title: "exec",
			content: [
				{
					type: "text",
					content: "Run a program and return its exit status, for a recipe that handles failure itself.",
				},
				{
					type: "code",
					language: "rhai",
					content: `if exec("make", ["check"], #{ cwd: ctx.src }) != 0 {
    warn("test suite failed");
}`,
				},
			],
		},
		{
			title: "shell / shell_in",
			content: [
				{
					type: "text",
					content: rich`Run a command string with ${code("sh -c")}, in the current or the given directory. Use them only when you need shell syntax, and quote any data you put in the string. For a pipeline, check every stage: ${code("bash -o pipefail -c …")} or separate checked steps.`,
				},
				{
					type: "code",
					language: "rhai",
					content: `shell_in(ctx.src, "./configure --prefix=/usr CFLAGS='-O2 -g'");
exec_checked("bash", ["-o", "pipefail", "-c", "rpm2archive - < pkg.rpm | tar -x"], #{ cwd: ctx.runtime.paths.build });`,
				},
			],
		},
		{
			title: "shell_output / shell_status",
			content: [
				{
					type: "code",
					language: "rhai",
					content: `let commit = trim(shell_output_in(ctx.src, "git rev-parse HEAD"));
if shell_status_in(ctx.src, "test -f Makefile") != 0 {
    exec_checked("./configure", [], #{ cwd: ctx.src });
}`,
				},
			],
		},
	],
}
