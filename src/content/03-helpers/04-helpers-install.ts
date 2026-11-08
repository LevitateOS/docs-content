import type { DocsContent } from "../../types";
import { rich, code } from "../../rich-text";

export default {
	title: "Install Helpers",
	intro: rich`Functions for placing files in the recipe's output tree (${code("ctx.runtime.paths.output")}, ${code("/out")}) and for using a package manager inside the domain.`,
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`${code("install(ctx)")} writes into ${code("/out")} and selects what it publishes in ${code("ctx.outputs")}. ${code("is_installed(ctx)")} checks the same files and selects the same outputs, so a reused installation is published again.`,
				},
				{
					type: "code",
					language: "rhai",
					content: `fn install(ctx) {
    let out = ctx.runtime.paths.output;
    mkdir(join_path(out, "bin"));
    copy_file(join_path(ctx.src, "myapp"), join_path(out, "bin/myapp"));
    chmod(join_path(out, "bin/myapp"), 0o755);
    mkdir(join_path(out, "share/man/man1"));
    copy_into_dir(join_path(ctx.src, "man/*.1"), join_path(out, "share/man/man1"));
    ctx.outputs.program = join_path(out, "bin/myapp");
    ctx
}`,
				},
			],
		},
		{
			title: "Copying Files",
			content: [
				{
					type: "table",
					headers: ["Helper", "Behavior"],
					rows: [
						["copy_file(src, dst)", "Copy one file to the exact path dst."],
						[
							"copy_file_reflink(src, dst)",
							"Copy with a reflink where the filesystem supports it, else a checked copy.",
						],
						[
							"copy_into_dir(pattern, dest_dir)",
							"Copy every file matching the glob into the existing dest_dir; matching nothing is an error.",
						],
						[
							"copy_tree_contents(src, dest)",
							"Copy a directory's contents, keeping hardlinks, symlink bytes and modes.",
						],
						[
							"copy_first_existing(sources, dst)",
							"Copy the first source in the array that exists; returns its path.",
						],
					],
					monospaceCol: 0,
				},
			],
		},
		{
			title: "make install and CMake",
			content: [
				{
					type: "text",
					content: rich`Build systems that install themselves take the output tree as their destination:`,
				},
				{
					type: "code",
					language: "rhai",
					content: `exec_checked("make", ["install", "DESTDIR=" + ctx.runtime.paths.output], #{ cwd: ctx.src });
exec_checked("cmake", ["--install", "build", "--prefix", join_path(ctx.runtime.paths.output, "usr")], #{ cwd: ctx.src });`,
				},
			],
		},
		{
			title: "check_disk_space",
			content: [
				{
					type: "text",
					content: rich`${code("check_disk_space(path, required_bytes)")} throws if the filesystem holding ${code("path")} has less free space than required. Use it before a large build or extraction.`,
				},
			],
		},
		{
			title: "Package Managers in the Domain",
			content: [
				{
					type: "text",
					content: rich`These run the image's own package tools inside the domain, so they need that tool in the image, its stores, and a network grant for any repository they reach. Payloads they fetch still need verification.`,
				},
				{
					type: "table",
					headers: ["Helper", "Returns"],
					rows: [
						["dnf_install(packages) / dnf_install_allow_erasing(packages)", "()"],
						["dnf_download(packages, dest_dir, arches[, resolve])", "Array of downloaded paths"],
						["dnf_add_repo(url) / dnf_package_available(name)", "() / bool"],
						["rpm_installed(name) / rpm_version(name)", "bool / String"],
						["apk_install(packages) / apk_download(packages, dest_dir)", "() / Array of paths"],
						["apk_add_repo(url) / apk_package_available(name)", "() / bool"],
						["apk_installed(name) / apk_version(name)", "bool / String"],
					],
					monospaceCol: 0,
				},
			],
		},
	],
} satisfies DocsContent;
