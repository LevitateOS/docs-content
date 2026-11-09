import type { DocsContent } from "../../types";
import { rich, code, link } from "../../rich-text";

export default {
	title: "Helpers Overview",
	intro: rich`Functions available in ${link("recipe scripts", "/docs/recipe-format")} with ${code("const RECIPE_API = 2;")} and a literal ${code("NEEDS")} declaration. Helpers take explicit paths and return explicit results; paths come from ${code("RUNTIME")} during setup and ${code("ctx.runtime")} in hooks.`,
	sections: [
		{
			title: "Where Helpers Run",
			content: [
				{
					type: "text",
					content: rich`Every helper with an effect runs inside the recipe's Ginux domain, under its filesystem, task, memory and network limits. Paths refer to the domain's filesystem: ${code("/inputs")}, ${code("/work/build")}, ${code("/work/tools")}, ${code("/work/tmp")} and ${code("/out")}. Commands need their binaries in the selected image or in dependency tools. Network helpers need an endpoint declared in ${code("NEEDS.network")}. Caller endpoint/limit options only narrow that authority, including dependencies. Declare all imported inputs and returned outputs with their kinds.`,
				},
				{
					type: "text",
					content: rich`A helper that fails throws, and the error fails the phase unless the recipe handles it. Readiness checks report work with ${code("needs_work(ctx, reason)")}, never by throwing.`,
				},
			],
		},
		{
			title: "Example",
			content: [
				{
					type: "code",
					language: "rhai",
					filename: "helper-demo.rhai",
					content: `const RECIPE_API = 2;
const NEEDS = #{ outputs: #{ program: "file" } };
let ctx = #{
    name: "helper-demo",
    version: "1.0",
    program: join_path(RUNTIME.paths.output, "bin/hello"),
    payload: "#!/bin/sh\\nprintf 'hello\\\\n'\\n",
};

fn is_acquired(ctx) { ready(ctx) }
fn acquire(ctx) { ctx }
fn is_built(ctx) { ready(ctx) }
fn build(ctx) { ctx }

fn is_installed(ctx) {
    if !is_file(ctx.program) { return needs_work(ctx, "hello output is missing"); }
    if read_file(ctx.program) != ctx.payload {
        return needs_work(ctx, "hello output has different contents");
    }
    ctx.outputs.program = ctx.program;
    ready(ctx)
}

fn install(ctx) {
    mkdir(dirname(ctx.program));
    write_file(ctx.program, ctx.payload);
    chmod(ctx.program, 0o755);
    ctx.outputs.program = ctx.program;
    ctx
}

fn remove(ctx) {
    if is_file(ctx.program) { rm(ctx.program); }
    ctx.outputs = #{};
    ctx
}`,
				},
			],
		},
		{
			title: "Categories",
			content: [
				{
					type: "list",
					items: [
						rich`${link("Acquire", "/docs/helpers-acquire")} - Verified downloads, pinned Git checkouts and checksums`,
						rich`${link("Build", "/docs/helpers-build")} - Archive extraction and root filesystem assembly`,
						rich`${link("Install", "/docs/helpers-install")} - Copying files into the output, disk space and package tools`,
						rich`${link("Filesystem", "/docs/helpers-filesystem")} - Path checks, directories, links, file contents and globs`,
						rich`${link("Environment", "/docs/helpers-environment")} - Environment variables, program lookup and logging`,
						rich`${link("Commands", "/docs/helpers-commands")} - Running programs and shell commands`,
						rich`${link("HTTP", "/docs/helpers-http")} - Release metadata and version strings`,
						rich`${link("Paths", "/docs/helpers-paths")} - Path and string utilities`,
					],
				},
			],
		},
		{
			title: "Readiness Results",
			content: [
				{
					type: "table",
					headers: ["Helper", "Returns", "Meaning"],
					rows: [
						["ready(ctx)", "Map", "The check passes, with the updated context."],
						[
							"needs_work(ctx, reason)",
							"Map",
							"The phase must run; reason is a nonempty explanation.",
						],
					],
					monospaceCol: 0,
				},
				{
					type: "text",
					content: rich`The full list of registered helpers and signatures is the ${link("helper reference", "https://github.com/LevitateOS/recipe/blob/master/HELPERS_AUDIT.md")} (${code("man 7 recipe-helpers")}).`,
				},
			],
		},
	],
} satisfies DocsContent;
