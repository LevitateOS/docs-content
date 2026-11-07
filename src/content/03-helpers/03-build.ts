import type { DocsContent } from "../../types"
import { rich, code, link } from "../../rich-text"

export const helpersBuildContent: DocsContent = {
	title: "Build Helpers",
	intro: "Functions for extracting archives and assembling root filesystem trees. For running compilers and build tools, see the Commands helpers.",
	sections: [
		{
			title: "extract",
			content: [
				{
					type: "text",
					content: rich`${code("extract(archive, dest)")} unpacks an archive into ${code("dest")}, detecting the format from the file name. Every member path is validated; an entry that would escape ${code("dest")} fails the extraction.`,
				},
				{
					type: "table",
					headers: ["Format", "Extensions"],
					rows: [
						["tar.gz", ".tar.gz, .tgz"],
						["tar.xz", ".tar.xz, .txz"],
						["tar.bz2", ".tar.bz2, .tbz2"],
						["tar.zst", ".tar.zst, .tzst"],
						["zip", ".zip"],
					],
					monospaceCol: 0,
				},
				{
					type: "code",
					language: "rhai",
					content: `let archive = download(ctx.url, join_path(ctx.runtime.paths.build, "foo-1.0.tar.xz"), ctx.sha256);
extract(archive, ctx.runtime.paths.build);
// creates /work/build/foo-1.0/`,
				},
			],
		},
		{
			title: "extract_with_format",
			content: [
				{
					type: "text",
					content: rich`${code("extract_with_format(archive, dest, format)")} names the format explicitly (${code("tar.gz")}, ${code("tar.xz")}, ${code("tar.bz2")}, ${code("tar.zst")} or ${code("zip")}), for files whose name doesn't say.`,
				},
				{
					type: "code",
					language: "rhai",
					content: `extract_with_format(archive, ctx.runtime.paths.build, "tar.gz");`,
				},
			],
		},
		{
			title: "Root Filesystem Helpers",
			content: [
				{
					type: "text",
					content: rich`System recipes assemble a complete root filesystem without build-host privileges. These helpers unpack packages into a root directory and record each file's intended owner, mode and extended attributes in the root's target manifest; the image writer applies that metadata, not the build user's.`,
				},
				{
					type: "table",
					headers: ["Helper", "Behavior"],
					rows: [
						["target_extract_rpm(rpm, root)", "Unpack an RPM into root, recording its ownership, modes and capabilities."],
						["target_extract_tar(archive, root)", "Unpack a tar archive into root the same way."],
						["target_capture_apks(root, archives)", "Record the metadata of the packages apk installed under root, read from their pinned .apk archives."],
						["target_mode(root, path, mode)", "Set the recorded mode of one path, such as 0o440 for a sudoers file."],
						["target_finalize(root)", "Finish the manifest after the recipe's own changes: paths that no longer exist are dropped and files the recipe created are owned by root."],
					],
					monospaceCol: 0,
				},
				{
					type: "code",
					language: "rhai",
					content: `for rpm in glob_list(join_path("/inputs/rpms", "*.rpm")) {
    target_extract_rpm(rpm, rootfs);
}
target_mode(rootfs, "etc/sudoers.d/10-wheel", 0o440);
target_finalize(rootfs);`,
				},
			],
		},
		{
			title: "Running Build Commands",
			content: [
				{
					type: "text",
					content: rich`Run build tools with ${code("exec_checked")}, setting the working directory and environment for that command only:`,
				},
				{
					type: "code",
					language: "rhai",
					content: `fn build(ctx) {
    exec_checked("./configure", ["--prefix=/usr"], #{ cwd: ctx.src });
    exec_checked("make", ["-j" + ctx.runtime.options.jobs], #{ cwd: ctx.src });
    ctx
}`,
				},
				{
					type: "text",
					content: rich`See the ${link("Command Helpers", "/docs/helpers-commands")} for ${code("exec")}, ${code("exec_output")} and the shell variants.`,
				},
			],
		},
	],
}
