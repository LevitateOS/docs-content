import type { DocsContent } from "../../types";
import { rich, code, link } from "../../rich-text";

export default {
	title: "Recipe Format",
	intro: rich`Recipes are ${link("Rhai", "https://rhai.rs")} scripts executed inside a configured Ginux domain. They own package facts and custom acquire/build/install behavior. Every executable recipe declares ${code("const RECIPE_API = 2;")}.`,
	sections: [
		{
			title: "A Complete Recipe",
			content: [
				{
					type: "text",
					content: rich`This recipe installs a small program into its output tree without downloading or compiling anything. Run it with ${code("recipe install ./hello.rhai --build-dir ./hello-work")}.`,
				},
				{
					type: "code",
					language: "rhai",
					filename: "hello.rhai",
					content: `const RECIPE_API = 2;
let ctx = #{
    name: "hello",
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
				{
					type: "text",
					content: rich`The final JSON's ${code("outputs.program")} is the published host path; inside hooks the same file is ${code("/out/bin/hello")}.`,
				},
			],
		},
		{
			title: "Context and Runtime",
			content: [
				{
					type: "table",
					headers: ["Field", "Purpose"],
					rows: [
						["RUNTIME / ctx.runtime", "Immutable invocation paths, target, operation and options."],
						[
							"ctx.name / ctx.version",
							"Package facts initialized from the current recipe on every run.",
						],
						[
							"ctx.state",
							"The only restored namespace: resumable values paired with a filesystem checkpoint.",
						],
						["ctx.outputs", "Named files/directories selected for validated publication."],
					],
					monospaceCol: 0,
				},
				{
					type: "table",
					headers: ["Path", "Domain path", "Contents"],
					rows: [
						[
							"runtime.paths.inputs",
							"/inputs",
							"Imported read-only inputs, one per --input NAME=PATH",
						],
						["runtime.paths.build", "/work/build", "Owned build and acquisition work"],
						["runtime.paths.tools", "/work/tools", "Shared dependency products"],
						["runtime.paths.temp", "/work/tmp", "Owned scratch space"],
						[
							"runtime.paths.output / .target",
							"/out",
							"The selected output and installed-target tree",
						],
						["runtime.paths.recipe_dir", "(staged)", "The recipe's own directory"],
					],
					monospaceCol: 0,
				},
				{
					type: "text",
					content: rich`${code("runtime.target.os")} and ${code(".arch")} name the execution target (Linux x86_64), ${code("runtime.operation")} the running command, and ${code("runtime.options")} the job count and force flags. A named ${code("target")} input seeds ${code("/out")} on fresh state. Recipe source files are never rewritten; put only genuinely resumable data in ${code("ctx.state")}.`,
				},
			],
		},
		{
			title: "Lifecycle and Readiness",
			content: [
				{
					type: "text",
					content: rich`Install checks ${code("is_installed")} first, then ${code("is_built")} and ${code("is_acquired")}, and runs only the phases that are needed: ${code("acquire")} → ${code("build")} → ${code("install")}. After each phase the executor runs its check again.`,
				},
				{
					type: "list",
					items: [
						rich`Checks return ${code("ready(ctx)")} or ${code('needs_work(ctx, "a concrete reason")')}. A check that throws is an error, not a request for work. Check the real files, not a saved boolean.`,
						rich`${code("acquire(ctx)")}, ${code("build(ctx)")}, ${code("install(ctx)")} and ${code("remove(ctx)")} return the updated context. A missing check means work is needed; a missing required action fails.`,
						rich`${code("cleanup(ctx, reason)")} is optional. Reasons are ${code("manual")} and ${code("auto.<phase>.<success|failure>")}.`,
					],
				},
			],
		},
		{
			title: "Verified Sources",
			content: [
				{
					type: "code",
					language: "rhai",
					content: `fn acquire(ctx) {
    let archive = join_path(ctx.runtime.paths.build, "source.tar.xz");
    download(ctx.url, archive, ctx.sha256);
    extract(archive, ctx.runtime.paths.build);
    ctx
}`,
				},
				{
					type: "text",
					content: rich`${code("download")} requires a full SHA256 and replaces the destination only after the bytes verify. ${code("git_checkout(url, dest, commit)")} requires an exact destination and a full commit id. Networking is off unless the caller grants ${code("--network-host HOST:PORT")}; recipes cannot add grants. See ${link("Acquire Helpers", "/docs/helpers-acquire")}.`,
				},
			],
		},
		{
			title: "Dependencies and Inheritance",
			content: [
				{
					type: "code",
					language: "rhai",
					content: `//! extends: base.rhai
const RECIPE_API = 2;
let deps = ["runtime-tools"];
let build_deps = ["compiler-tools"];`,
				},
				{
					type: "text",
					content: rich`${code("deps")} and ${code("build_deps")} are literal arrays, read before launch. Dependencies use the same contract, install into the shared ${code("/work/tools")}, and their executables are put on ${code("PATH")}. A child recipe can extend one base recipe: the base's setup runs first and the child's functions override the base's. Only one level of ${code("extends")} is supported.`,
				},
			],
		},
		{
			title: "Inputs and Products",
			content: [
				{
					type: "text",
					content: rich`Callers import immutable inputs with ${code("--input NAME=PATH")} at ${code("/inputs/NAME")}. After successful execution and archive validation, the final JSON contains the published host paths in ${code("ctx.outputs")}. Consumers validate the names and kinds they need instead of guessing build paths. Remove and cleanup change owned files; imported inputs and earlier publications stay immutable.`,
				},
			],
		},
		{
			title: "Authoritative Guides",
			content: [
				{
					type: "list",
					items: [
						rich`${link("Writing recipes", "https://github.com/LevitateOS/recipe/blob/master/WRITING_RECIPES.md")} — lifecycle, state, inputs and outputs in full.`,
						rich`${link("Recipe README", "https://github.com/LevitateOS/recipe/blob/master/README.md")} — environment preparation, CLI, diagnostics and recovery.`,
						rich`${link("Helper reference", "https://github.com/LevitateOS/recipe/blob/master/HELPERS_AUDIT.md")} — registered helper signatures.`,
					],
				},
			],
		},
	],
} satisfies DocsContent;
