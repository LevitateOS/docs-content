import type { DocsContent } from "../../types"
import { rich, code } from "../../rich-text"

export const helpersInstallContent: DocsContent = {
	title: "Install Helpers",
	intro: "Functions for installing files to PREFIX following FHS directory structure.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content:
						"All install functions track installed files for clean removal and support glob patterns.",
				},
			],
		},
		{
			title: "install_bin",
			content: [
				{
					type: "text",
					content: rich`Install files to ${code("PREFIX/bin/")} with executable permissions (0755).`,
				},
				{
					type: "code",
					language: "rhai",
					content: `install_bin("myapp");
install_bin("target/release/*");  // glob patterns work`,
				},
			],
		},
		{
			title: "install_lib",
			content: [
				{
					type: "text",
					content: rich`Install files to ${code("PREFIX/lib/")} with standard permissions (0644).`,
				},
				{
					type: "code",
					language: "rhai",
					content: `install_lib("libfoo.so");
install_lib("*.a");`,
				},
			],
		},
		{
			title: "install_man",
			content: [
				{
					type: "text",
					content: rich`Install man pages to ${code("PREFIX/share/man/manN/")}. The section number is auto-detected from the file extension (e.g., ${code("foo.1")} goes to ${code("man1/")}).`,
				},
				{
					type: "code",
					language: "rhai",
					content: `install_man("doc/*.1");    // Section 1 (commands)
install_man("config.5");   // Section 5 (config files)
install_man("api.3");      // Section 3 (library functions)`,
				},
			],
		},
		{
			title: "install_to_dir",
			content: [
				{
					type: "text",
					content:
						"Install files to a custom subdirectory of PREFIX. Optionally specify permissions.",
				},
				{
					type: "code",
					language: "rhai",
					content: `// Without mode (preserves source permissions)
install_to_dir("docs/*", "share/doc/myapp");

// With explicit mode
install_to_dir("scripts/*", "libexec/myapp", 0o755);`,
				},
			],
		},
		{
			title: "rpm_install",
			content: [
				{
					type: "text",
					content: rich`Extract all ${code(".rpm")} files in the build directory to PREFIX. Requires ${code("rpm2cpio")} and ${code("cpio")} in PATH. Useful for repackaging Fedora/RHEL packages.`,
				},
				{
					type: "code",
					language: "rhai",
					content: `fn acquire() {
    download("https://mirror.example.com/package-1.0.x86_64.rpm");
}

fn install() {
    rpm_install();  // extracts to PREFIX
}`,
				},
			],
		},
	],
}
