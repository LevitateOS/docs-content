import type { DocsContent } from "../../types"
import { rich, link } from "../../rich-text"

export const helpersOverviewContent: DocsContent = {
	title: "Helpers Overview",
	intro: rich`Helper functions available in ${link("recipe scripts", "/docs/recipe-format")}.`,
	sections: [
		{
			title: "Introduction",
			content: [
				{
					type: "text",
					content:
						"Helper functions are organized into categories. They manage implicit state (like the last downloaded file) to enable declarative recipes.",
				},
				{
					type: "code",
					language: "rhai",
					content: `fn acquire() {
    download("https://example.com/foo-1.0.tar.gz");
}

fn build() {
    extract("tar.gz");
    cd("foo-1.0");
    run("./configure --prefix=$PREFIX");
    run("make -j$NPROC");
}

fn install() {
    install_bin("target/release/myapp");
    install_man("doc/*.1");
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
						rich`${link("Acquire", "/docs/helpers-acquire")} - Download and verify sources`,
						rich`${link("Build", "/docs/helpers-build")} - Extract archives and run commands`,
						rich`${link("Install", "/docs/helpers-install")} - Install files to PREFIX`,
						rich`${link("Filesystem", "/docs/helpers-filesystem")} - File and directory operations`,
						rich`${link("Environment", "/docs/helpers-environment")} - Environment variables`,
						rich`${link("Commands", "/docs/helpers-commands")} - Command execution variants`,
						rich`${link("HTTP", "/docs/helpers-http")} - HTTP requests and GitHub API`,
					],
				},
			],
		},
		{
			title: "Built-in Variables",
			content: [
				{
					type: "text",
					content: "These constants are available in all recipe scripts:",
				},
				{
					type: "table",
					headers: ["Variable", "Description", "Example"],
					rows: [
						["PREFIX", "Installation prefix", "/usr/local"],
						["BUILD_DIR", "Temporary build directory", "/tmp/recipe-build-xxx"],
						["ARCH", "Target architecture", "x86_64, aarch64"],
						["NPROC", "Number of CPU cores", "8"],
						["RPM_PATH", "RPM repository path (from env)", "/var/cache/rpms"],
					],
					monospaceCol: 0,
				},
			],
		},
		{
			title: "Complete Example",
			content: [
				{
					type: "text",
					content: "A full recipe demonstrating multiple helper categories:",
				},
				{
					type: "code",
					filename: "ripgrep.rhai",
					language: "rhai",
					content: `let name = "ripgrep";
let version = "14.1.0";
let description = "Fast line-oriented search tool";
let installed = false;

fn acquire() {
    let url = \`https://github.com/BurntSushi/ripgrep/releases/download/\${version}/ripgrep-\${version}-\${ARCH}-unknown-linux-musl.tar.gz\`;
    download(url);
    verify_sha256("...");
}

fn build() {
    extract("tar.gz");
    cd(\`ripgrep-\${version}-\${ARCH}-unknown-linux-musl\`);
}

fn install() {
    install_bin("rg");
    install_man("doc/rg.1");

    if dir_exists("complete") {
        install_to_dir("complete/_rg", "share/zsh/site-functions");
        install_to_dir("complete/rg.bash", "share/bash-completion/completions");
    }
}

fn check_update() {
    let latest = github_latest_release("BurntSushi/ripgrep");
    if latest != version { latest } else { () }
}`,
				},
			],
		},
	],
}
