import type { DocsContent } from "../../types"
import { rich, code } from "../../rich-text"

export const helpersInstallContent: DocsContent = {
	title: "Install Helpers",
	intro: "Functions for installing files to PREFIX. Use shell commands with explicit paths for most installations.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`The recommended pattern for installing files is to use ${code("shell()")} with the ${code("install")} command, which provides fine-grained control over permissions and destinations:`,
				},
				{
					type: "code",
					language: "rhai",
					content: `fn install(ctx) {
    let src = ctx.extract_dir;

    // Install binary with executable permissions
    shell("install -Dm755 " + join_path(src, "myapp") + " " + join_path(PREFIX, "bin/myapp"));

    // Install man page with read permissions
    shell("install -Dm644 " + join_path(src, "myapp.1") + " " + join_path(PREFIX, "share/man/man1/myapp.1"));

    // Install config file
    shell("install -Dm644 " + join_path(src, "config.toml") + " " + join_path(PREFIX, "etc/myapp/config.toml"));

    ctx
}`,
				},
			],
		},
		{
			title: "install Command Reference",
			content: [
				{
					type: "text",
					content: rich`The ${code("install")} command (from coreutils) is the standard way to install files:`,
				},
				{
					type: "table",
					headers: ["Flag", "Description"],
					rows: [
						["-D", "Create parent directories as needed"],
						["-m MODE", "Set permissions (e.g., 755, 644)"],
						["-d", "Create directories only"],
					],
					monospaceCol: 0,
				},
				{
					type: "code",
					language: "rhai",
					content: `// Common permission patterns
shell("install -Dm755 src dest");  // Executable (rwxr-xr-x)
shell("install -Dm644 src dest");  // Read-only (rw-r--r--)
shell("install -Dm600 src dest");  // Private (rw-------)

// Create directory
shell("install -dm755 " + join_path(PREFIX, "share/myapp"));`,
				},
			],
		},
		{
			title: "make install Pattern",
			content: [
				{
					type: "text",
					content: "For packages with Makefiles, use make install with DESTDIR:",
				},
				{
					type: "code",
					language: "rhai",
					content: `fn install(ctx) {
    shell_in(ctx.source_dir, "make install DESTDIR=" + PREFIX);
    ctx
}`,
				},
			],
		},
		{
			title: "CMake install Pattern",
			content: [
				{
					type: "text",
					content: "For CMake projects:",
				},
				{
					type: "code",
					language: "rhai",
					content: `fn install(ctx) {
    shell_in(ctx.source_dir, "cmake --install build --prefix " + PREFIX);
    ctx
}`,
				},
			],
		},
		{
			title: "Copying Multiple Files",
			content: [
				{
					type: "text",
					content: "For copying multiple files or directories:",
				},
				{
					type: "code",
					language: "rhai",
					content: `fn install(ctx) {
    let src = ctx.extract_dir;

    // Copy directory tree
    shell("cp -r " + join_path(src, "share/icons") + " " + join_path(PREFIX, "share/"));

    // Copy with glob (via shell)
    shell("cp " + join_path(src, "lib/*.so*") + " " + join_path(PREFIX, "lib/"));

    ctx
}`,
				},
			],
		},
	],
}
