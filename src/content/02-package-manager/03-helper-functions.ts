import type { DocsContent } from "../../types"

export const helperFunctionsContent: DocsContent = {
	title: "Helper Functions",
	intro: "Complete reference for all helper functions available in recipe scripts. These functions handle source acquisition, building, installation, filesystem operations, and more.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content:
						"Recipe scripts have access to a rich set of helper functions organized into categories. These functions manage implicit state (like the last downloaded file) to enable clean, declarative recipes.",
				},
				{
					type: "code",
					language: "javascript",
					content: `// Typical recipe flow
fn acquire() {
    download("https://example.com/foo-1.0.tar.gz");
    verify_sha256("abc123...");
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
			title: "Acquire Helpers",
			content: [
				{
					type: "text",
					content:
						"Functions for downloading and verifying source materials. Both `download()` and `copy()` set internal state used by `verify_sha256()` and `extract()`.",
				},
			],
		},
		{
			title: "download",
			level: 3,
			content: [
				{
					type: "text",
					content: "Download a file from a URL with progress bar. Saves to `BUILD_DIR/{filename}`.",
				},
				{
					type: "code",
					language: "javascript",
					content: `download("https://example.com/foo-1.0.tar.gz");
// Downloads to BUILD_DIR/foo-1.0.tar.gz`,
				},
			],
		},
		{
			title: "copy",
			level: 3,
			content: [
				{
					type: "text",
					content: "Copy files matching a glob pattern to the build directory.",
				},
				{
					type: "code",
					language: "javascript",
					content: `copy("./local-sources/*.tar.gz");
copy("/path/to/patches/*");`,
				},
			],
		},
		{
			title: "verify_sha256",
			level: 3,
			content: [
				{
					type: "text",
					content: "Verify the SHA256 hash of the last downloaded or copied file. Fails if hash doesn't match.",
				},
				{
					type: "code",
					language: "javascript",
					content: `download("https://example.com/foo-1.0.tar.gz");
verify_sha256("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");`,
				},
			],
		},
		{
			title: "Build Helpers",
			content: [
				{
					type: "text",
					content:
						"Functions for extracting archives and running build commands. The `run()` function has `PREFIX` and `BUILD_DIR` environment variables automatically set.",
				},
			],
		},
		{
			title: "extract",
			level: 3,
			content: [
				{
					type: "text",
					content: "Extract the last downloaded archive to `BUILD_DIR`. Supports multiple formats.",
				},
				{
					type: "table",
					headers: ["Format", "Extensions"],
					rows: [
						["tar.gz / tgz", ".tar.gz, .tgz"],
						["tar.xz / txz", ".tar.xz, .txz"],
						["tar.bz2 / tbz2", ".tar.bz2, .tbz2"],
						["zip", ".zip"],
					],
					monospaceCol: 0,
				},
				{
					type: "code",
					language: "javascript",
					content: `download("https://example.com/foo-1.0.tar.xz");
extract("tar.xz");`,
				},
			],
		},
		{
			title: "cd",
			level: 3,
			content: [
				{
					type: "text",
					content: "Change the current working directory for subsequent `run()` calls. Relative paths are resolved from `BUILD_DIR`.",
				},
				{
					type: "code",
					language: "javascript",
					content: `extract("tar.gz");
cd("foo-1.0");        // Now in BUILD_DIR/foo-1.0
run("./configure");   // Runs in that directory
cd("/tmp/other");     // Absolute paths work too`,
				},
			],
		},
		{
			title: "run / shell",
			level: 3,
			content: [
				{
					type: "text",
					content: "Run a shell command in the current directory. Shows a spinner for long-running commands. `shell()` is an alias for `run()` - use it when your recipe defines its own `run()` function.",
				},
				{
					type: "text",
					content: "**Environment variables automatically set:**",
				},
				{
					type: "list",
					items: [
						"`PREFIX` - Installation prefix (e.g., `/usr/local`)",
						"`BUILD_DIR` - Temporary build directory",
					],
				},
				{
					type: "code",
					language: "javascript",
					content: `run("./configure --prefix=$PREFIX");
run("make -j4");
run("make install");

// Use shell() if recipe has its own run() function
shell("make test");`,
				},
			],
		},
		{
			title: "Install Helpers",
			content: [
				{
					type: "text",
					content:
						"Functions for installing files to PREFIX following FHS directory structure. All install functions track installed files for clean removal and support glob patterns.",
				},
			],
		},
		{
			title: "install_bin",
			level: 3,
			content: [
				{
					type: "text",
					content: "Install files to `PREFIX/bin/` with executable permissions (0755).",
				},
				{
					type: "code",
					language: "javascript",
					content: `install_bin("myapp");           // Single file
install_bin("target/release/*"); // Glob pattern`,
				},
			],
		},
		{
			title: "install_lib",
			level: 3,
			content: [
				{
					type: "text",
					content: "Install files to `PREFIX/lib/` with standard permissions (0644).",
				},
				{
					type: "code",
					language: "javascript",
					content: `install_lib("libfoo.so");
install_lib("*.a");`,
				},
			],
		},
		{
			title: "install_man",
			level: 3,
			content: [
				{
					type: "text",
					content: "Install man pages to `PREFIX/share/man/manN/`. The section number is auto-detected from the file extension (e.g., `foo.1` goes to `man1/`).",
				},
				{
					type: "code",
					language: "javascript",
					content: `install_man("doc/*.1");    // Section 1 (commands)
install_man("config.5");   // Section 5 (config files)
install_man("api.3");      // Section 3 (library functions)`,
				},
			],
		},
		{
			title: "install_to_dir",
			level: 3,
			content: [
				{
					type: "text",
					content: "Install files to a custom subdirectory of PREFIX. Optionally specify permissions.",
				},
				{
					type: "code",
					language: "javascript",
					content: `// Without mode (preserves source permissions)
install_to_dir("docs/*", "share/doc/myapp");

// With explicit mode
install_to_dir("scripts/*", "libexec/myapp", 0o755);`,
				},
			],
		},
		{
			title: "rpm_install",
			level: 3,
			content: [
				{
					type: "text",
					content: "Extract all `.rpm` files in the build directory to PREFIX. Requires `rpm2cpio` and `cpio` in PATH. Useful for repackaging Fedora/RHEL packages.",
				},
				{
					type: "code",
					language: "javascript",
					content: `fn acquire() {
    download("https://mirror.example.com/package-1.0.x86_64.rpm");
}

fn install() {
    rpm_install();  // Extracts RPM contents to PREFIX
}`,
				},
			],
		},
		{
			title: "Filesystem Helpers",
			content: [
				{
					type: "text",
					content: "Basic filesystem operations for checking paths, creating directories, and managing files.",
				},
			],
		},
		{
			title: "exists / file_exists / dir_exists",
			level: 3,
			content: [
				{
					type: "text",
					content: "Check if paths exist.",
				},
				{
					type: "code",
					language: "javascript",
					content: `if exists("/usr/bin/gcc") {
    run("make CC=gcc");
}

if file_exists("config.toml") {
    // Use existing config
}

if dir_exists("vendor") {
    cd("vendor");
}`,
				},
			],
		},
		{
			title: "mkdir",
			level: 3,
			content: [
				{
					type: "text",
					content: "Create a directory and all parent directories (like `mkdir -p`).",
				},
				{
					type: "code",
					language: "javascript",
					content: `mkdir("/opt/myapp/data");`,
				},
			],
		},
		{
			title: "rm",
			level: 3,
			content: [
				{
					type: "text",
					content: "Remove files or directories matching a glob pattern.",
				},
				{
					type: "code",
					language: "javascript",
					content: `rm("*.tmp");
rm("build/cache/*");`,
				},
			],
		},
		{
			title: "mv",
			level: 3,
			content: [
				{
					type: "text",
					content: "Move or rename a file.",
				},
				{
					type: "code",
					language: "javascript",
					content: `mv("config.example", "config.toml");`,
				},
			],
		},
		{
			title: "ln",
			level: 3,
			content: [
				{
					type: "text",
					content: "Create a symbolic link (Unix only).",
				},
				{
					type: "code",
					language: "javascript",
					content: `ln("myapp-1.0", "myapp");  // myapp -> myapp-1.0`,
				},
			],
		},
		{
			title: "chmod",
			level: 3,
			content: [
				{
					type: "text",
					content: "Change file permissions (Unix only). Takes octal mode.",
				},
				{
					type: "code",
					language: "javascript",
					content: `chmod("script.sh", 0o755);   // rwxr-xr-x
chmod("secret.key", 0o600);  // rw-------`,
				},
			],
		},
		{
			title: "I/O Helpers",
			content: [
				{
					type: "text",
					content: "Functions for reading files and listing directory contents.",
				},
			],
		},
		{
			title: "read_file",
			level: 3,
			content: [
				{
					type: "text",
					content: "Read a file's contents as a string.",
				},
				{
					type: "code",
					language: "javascript",
					content: `let config = read_file("config.toml");
if config.contains("debug = true") {
    // Handle debug mode
}`,
				},
			],
		},
		{
			title: "glob_list",
			level: 3,
			content: [
				{
					type: "text",
					content: "List files matching a glob pattern. Returns an array of paths.",
				},
				{
					type: "code",
					language: "javascript",
					content: `let sources = glob_list("src/*.c");
for file in sources {
    print(file);
}`,
				},
			],
		},
		{
			title: "Environment Helpers",
			content: [
				{
					type: "text",
					content: "Functions for reading and setting environment variables.",
				},
			],
		},
		{
			title: "env",
			level: 3,
			content: [
				{
					type: "text",
					content: "Get an environment variable. Returns empty string if not set.",
				},
				{
					type: "code",
					language: "javascript",
					content: `let home = env("HOME");
let cc = env("CC");
if cc == "" {
    cc = "gcc";
}`,
				},
			],
		},
		{
			title: "set_env",
			level: 3,
			content: [
				{
					type: "text",
					content: "Set an environment variable for the current process.",
				},
				{
					type: "code",
					language: "javascript",
					content: `set_env("CFLAGS", "-O2 -march=native");
set_env("CC", "clang");
run("make");`,
				},
			],
		},
		{
			title: "Command Helpers",
			content: [
				{
					type: "text",
					content: "Alternative command execution functions with different return types. These have `PREFIX` and `BUILD_DIR` environment variables set automatically.",
				},
			],
		},
		{
			title: "run_output",
			level: 3,
			content: [
				{
					type: "text",
					content: "Run a command and return its stdout. Fails if the command returns non-zero.",
				},
				{
					type: "code",
					language: "javascript",
					content: `let version = run_output("git describe --tags");
let arch = run_output("uname -m").trim();`,
				},
			],
		},
		{
			title: "run_status",
			level: 3,
			content: [
				{
					type: "text",
					content: "Run a command and return its exit code. Does not fail on non-zero exit.",
				},
				{
					type: "code",
					language: "javascript",
					content: `let status = run_status("which clang");
if status == 0 {
    set_env("CC", "clang");
}`,
				},
			],
		},
		{
			title: "HTTP Helpers",
			content: [
				{
					type: "text",
					content: "Functions for HTTP requests and GitHub API access. Useful for checking updates. Timeout defaults to 30 seconds (configurable via `RECIPE_HTTP_TIMEOUT` env var).",
				},
			],
		},
		{
			title: "http_get",
			level: 3,
			content: [
				{
					type: "text",
					content: "Fetch content from a URL (GET request). Returns the response body as a string.",
				},
				{
					type: "code",
					language: "javascript",
					content: `let page = http_get("https://api.example.com/version");`,
				},
			],
		},
		{
			title: "github_latest_release",
			level: 3,
			content: [
				{
					type: "text",
					content: "Get the latest release version from a GitHub repository. Strips the `v` prefix automatically.",
				},
				{
					type: "code",
					language: "javascript",
					content: `fn check_update() {
    let latest = github_latest_release("BurntSushi/ripgrep");
    // Returns "14.1.0" (not "v14.1.0")
    if latest != version {
        latest
    } else {
        ()
    }
}`,
				},
			],
		},
		{
			title: "github_latest_tag",
			level: 3,
			content: [
				{
					type: "text",
					content: "Get the latest tag from a GitHub repository. For repos without releases. Strips the `v` prefix automatically.",
				},
				{
					type: "code",
					language: "javascript",
					content: `let latest = github_latest_tag("torvalds/linux");
// Returns "6.7" for tag "v6.7"`,
				},
			],
		},
		{
			title: "parse_version",
			level: 3,
			content: [
				{
					type: "text",
					content: "Strip common prefixes from version strings (`v`, `release-`, `version-`).",
				},
				{
					type: "code",
					language: "javascript",
					content: `parse_version("v1.0.0");        // "1.0.0"
parse_version("release-2.0");   // "2.0"
parse_version("version-3.1");   // "3.1"`,
				},
			],
		},
		{
			title: "Process Helpers",
			content: [
				{
					type: "text",
					content: "Direct command execution without shell interpretation. Useful for running installed programs or when you need precise argument control.",
				},
			],
		},
		{
			title: "exec",
			level: 3,
			content: [
				{
					type: "text",
					content: "Execute a command with an array of arguments. Returns the exit code.",
				},
				{
					type: "code",
					language: "javascript",
					content: `let code = exec("git", ["clone", "--depth", "1", url]);`,
				},
			],
		},
		{
			title: "exec_output",
			level: 3,
			content: [
				{
					type: "text",
					content: "Execute a command and return its stdout. Fails if exit code is non-zero.",
				},
				{
					type: "code",
					language: "javascript",
					content: `let output = exec_output("rustc", ["--version"]);`,
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
					type: "file",
					filename: "ripgrep.rhai",
					language: "javascript",
					content: `let name = "ripgrep";
let version = "14.1.0";
let description = "Fast line-oriented search tool";
let installed = false;

fn acquire() {
    let url = \`https://github.com/BurntSushi/ripgrep/releases/download/\${version}/ripgrep-\${version}-\${ARCH}-unknown-linux-musl.tar.gz\`;
    download(url);
    verify_sha256("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
}

fn build() {
    extract("tar.gz");
    cd(\`ripgrep-\${version}-\${ARCH}-unknown-linux-musl\`);
}

fn install() {
    install_bin("rg");
    install_man("doc/rg.1");

    // Install shell completions
    if dir_exists("complete") {
        install_to_dir("complete/_rg", "share/zsh/site-functions");
        install_to_dir("complete/rg.bash", "share/bash-completion/completions");
    }
}

fn check_update() {
    let latest = github_latest_release("BurntSushi/ripgrep");
    if latest != version {
        latest
    } else {
        ()
    }
}`,
				},
			],
		},
	],
}
