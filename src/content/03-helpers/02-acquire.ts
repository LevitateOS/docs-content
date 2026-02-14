import type { DocsContent } from "../../types"
import { rich, code } from "../../rich-text"

export const helpersAcquireContent: DocsContent = {
	title: "Acquire Helpers",
	intro:
		"Functions for downloading, cloning, and verifying source materials. All functions take explicit paths and return paths.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`All acquire helpers are pure functions. ${code("download()")} returns the path where the file was saved, which you pass to ${code("verify_sha256()")} and ${code("extract()")}.`,
				},
				{
					type: "code",
					language: "rhai",
					content: `// Explicit data flow
let archive = download(url, join_path(BUILD_DIR, "foo.tar.gz"));
verify_sha256(archive, "abc123...");
extract(archive, BUILD_DIR);`,
				},
			],
		},
		{
			title: "download",
			content: [
				{
					type: "text",
					content: rich`Download a file from a URL to a specific path. Returns the destination path. Shows a progress bar for large files.`,
				},
				{
					type: "code",
					language: "rhai",
					content: `let dest = join_path(BUILD_DIR, "foo-1.0.tar.gz");
let archive = download("https://example.com/foo-1.0.tar.gz", dest);
// archive == dest`,
				},
			],
		},
		{
			title: "download_with_resume",
			content: [
				{
					type: "text",
					content:
						"Download a file with resume support. If the download is interrupted, it will continue from where it left off.",
				},
				{
					type: "code",
					language: "rhai",
					content: `let archive = download_with_resume(
    "https://example.com/large-file.tar.gz",
    join_path(BUILD_DIR, "large-file.tar.gz")
);`,
				},
			],
		},
		{
			title: "github_download_release",
			content: [
				{
					type: "text",
					content: rich`Download a release asset from GitHub. Takes a repo (${code("owner/repo")}), version, and glob pattern for the asset name. Returns the downloaded file path.`,
				},
				{
					type: "code",
					language: "rhai",
					content: `// Download ripgrep release for current architecture
let pattern = "ripgrep-*-" + ARCH + "-unknown-linux-musl.tar.gz";
let archive = github_download_release("BurntSushi/ripgrep", "14.1.0", pattern);

// Download any .tar.gz asset
let archive = github_download_release("jqlang/jq", "1.7.1", "*.tar.gz");`,
				},
			],
		},
		{
			title: "git_clone",
			content: [
				{
					type: "text",
					content:
						"Clone a git repository to a destination directory. Returns the cloned directory path.",
				},
				{
					type: "code",
					language: "rhai",
					content: `let src = git_clone(
    "https://github.com/neovim/neovim.git",
    join_path(BUILD_DIR, "neovim")
);`,
				},
			],
		},
		{
			title: "git_clone_depth",
			content: [
				{
					type: "text",
					content:
						"Shallow clone a git repository with limited history. Much faster for large repos.",
				},
				{
					type: "code",
					language: "rhai",
					content: `// Clone with depth 1 (only latest commit)
let src = git_clone_depth(
    "https://github.com/torvalds/linux.git",
    join_path(BUILD_DIR, "linux"),
    1
);`,
				},
			],
		},
		{
			title: "extract_from_tarball",
			content: [
				{
					type: "text",
					content:
						"Extract specific files from a tarball matching a glob pattern. Useful for extracting just binaries without full extraction.",
				},
				{
					type: "code",
					language: "rhai",
					content: `// Extract only the binary from a release tarball
extract_from_tarball(archive, "*/bin/myapp");`,
				},
			],
		},
		{
			title: "torrent",
			content: [
				{
					type: "text",
					content: "Download a file via BitTorrent. Useful for large files that may be mirrored.",
				},
				{
					type: "code",
					language: "rhai",
					content: `let iso = torrent(
    "magnet:?xt=urn:btih:...",
    join_path(BUILD_DIR, "download")
);`,
				},
			],
		},
		{
			title: "verify_sha256",
			content: [
				{
					type: "text",
					content: "Verify the SHA256 hash of a file. Throws an error if the hash doesn't match.",
				},
				{
					type: "code",
					language: "rhai",
					content: `let archive = download(url, join_path(BUILD_DIR, "foo.tar.gz"));
verify_sha256(archive, "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824");`,
				},
			],
		},
		{
			title: "verify_sha512",
			content: [
				{
					type: "text",
					content: "Verify the SHA512 hash of a file.",
				},
				{
					type: "code",
					language: "rhai",
					content: `verify_sha512(archive, "cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce...");`,
				},
			],
		},
		{
			title: "verify_blake3",
			content: [
				{
					type: "text",
					content:
						"Verify the BLAKE3 hash of a file. BLAKE3 is faster than SHA256 for large files.",
				},
				{
					type: "code",
					language: "rhai",
					content: `verify_blake3(archive, "af1349b9f5f9a1a6a0404dea36dcc9499bcb25c9adc112b7cc9a93cae41f3262");`,
				},
			],
		},
	],
}
