import type { DocsContent } from "../../types";
import { rich, code, link } from "../../rich-text";

export default {
	title: "Helpers Overview",
	intro: rich`Functions available in ${link("recipe scripts", "/docs/recipe-format")} with ${code("const RECIPE_API = 1;")} and a literal ${code("NEEDS")} declaration. Helpers take explicit paths and return explicit results; paths come from the arguments of ${code("build(src, out)")} and from the engine constants ${code("WORK")}, ${code("INPUTS")} and ${code("DEPS")}.`,
	sections: [
		{
			title: "Where Helpers Run",
			content: [
				{
					type: "text",
					content: rich`A recipe that starts no program runs on the host, where helpers reach only the run's own folders (${code("src")}, ${code("out")}, ${code("WORK")}, ${code("INPUTS")}) and the hosts in ${code("NEEDS.network")}. Any other recipe runs inside its Ginux domain, under its filesystem, task, memory and network limits, where paths refer to the domain's filesystem. Commands need their binaries in the selected image or in dependency tools. Network helpers need an endpoint declared in ${code("NEEDS.network")}. Caller endpoint/limit options only narrow that authority, including dependencies. Declare all imported inputs and returned outputs with their kinds.`,
				},
				{
					type: "text",
					content: rich`A helper that fails throws, and the error fails the step unless the recipe handles it. ${code("verify")} only reads and starts no program.`,
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
					content: `const RECIPE_API = 1;
const NEEDS = #{ outputs: #{ program: "file" } };
const PACKAGE = #{ name: "helper-demo", version: "1.0", description: "Writes a small script" };

fn build(src, out) {
    write_file(out, "#!/bin/sh\\nprintf 'hello\\\\n'\\n");
    chmod(out, 0o755);
}

fn verify(out) {
    if !is_file(out) { throw "the program was not written"; }
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
			title: "System Tree and Saved Values",
			content: [
				{
					type: "table",
					headers: ["Helper", "Does"],
					rows: [
						["put(tree, path, text, mode)", "Write text at path in a system tree, with mode in the target metadata."],
						["put_link(tree, path, target)", "A symbolic link at path to target."],
						["tree_text(tree, path)", "The text of a packaged file; fails naming the file when the packages no longer ship it."],
						["enable_service(tree, unit, service)", "Enable a systemd unit on an rpm tree or an OpenRC service on an apk tree."],
						["save(name, value) / saved(name)", "Keep a value across an interruption, and read it back."],
						["checkpoint(name) / reached(name)", "Record a checkpoint, and tell whether this run was restored from it or a later one."],
					],
					monospaceCol: 0,
				},
				{
					type: "text",
					content: rich`The full list of registered helpers and signatures is ${code("man 7 recipe-helpers")}.`,
				},
			],
		},
		],
} satisfies DocsContent;
