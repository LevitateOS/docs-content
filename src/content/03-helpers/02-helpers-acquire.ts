import type { DocsContent } from "../../types";
import { rich, code } from "../../rich-text";

export default {
	title: "Acquire Helpers",
	intro:
		"Functions for downloading, checking out and verifying source materials. Every payload is pinned: downloads need a SHA256, Git checkouts a full commit id.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`Source facts (URL, version, digest) belong in the recipe. Acquire into ${code("ctx.runtime.paths.build")} and let ${code("is_acquired")} check the real files. Every server a recipe contacts, including each redirect target, must be in ${code("NEEDS.network")}, for example ${code('["example.com:443"]')}. Caller ${code("--network-host")} can only narrow that declaration. These function fragments require a complete recipe with real publisher URLs/digests and declared outputs; example.com is a placeholder.`,
				},
				{
					type: "code",
					language: "rhai",
					content: `fn acquire(ctx) {
    let archive = join_path(ctx.runtime.paths.build, "foo.tar.gz");
    download(ctx.url, archive, ctx.sha256);
    extract(archive, ctx.runtime.paths.build);
    ctx
}`,
				},
			],
		},
		{
			title: "download",
			content: [
				{
					type: "text",
					content: rich`${code("download(url, dest, sha256[, resume])")} downloads to the exact path ${code("dest")} and returns it. The full 64-hex SHA256 is required. Bytes are staged and checked (status, length, hash) and replace ${code("dest")} only after they verify, so a failed or truncated transfer never replaces a valid file. Pass ${code("true")} as the fourth argument to resume a partial download; the resumed response's identity and ranges are checked too.`,
				},
				{
					type: "code",
					language: "rhai",
					content: `let iso = download(
    "https://example.com/large-file.tar.xz",
    join_path(ctx.runtime.paths.build, "large-file.tar.xz"),
    ctx.sha256,
    true
);`,
				},
			],
		},
		{
			title: "git_checkout",
			content: [
				{
					type: "text",
					content: rich`${code("git_checkout(url, dest, commit)")} checks out a pinned commit into the exact directory ${code("dest")} and returns it. ${code("commit")} is a full 40- or 64-hex object id; the origin and the checked-out tree are validated. The URL must name the repository directly (Git redirects are disabled), and hooks, fsmonitor, replacement objects and submodule recursion are off. A local repository must be an imported input.`,
				},
				{
					type: "code",
					language: "rhai",
					content: `let src = git_checkout(
    "https://github.com/neovim/neovim.git",
    join_path(ctx.runtime.paths.build, "neovim"),
    ctx.commit
);`,
				},
			],
		},
		{
			title: "github_download_release",
			content: [
				{
					type: "text",
					content: rich`${code("github_download_release(repo, pattern, dest_dir, sha256)")} picks the asset of the repository's latest release whose name matches the glob ${code("pattern")}, downloads it to ${code("dest_dir/<asset name>")} with the same verified download as ${code("download")}, and returns the path. The digest is required.`,
				},
				{
					type: "code",
					language: "rhai",
					content: `let archive = github_download_release(
    "BurntSushi/ripgrep",
    "ripgrep-*-x86_64-unknown-linux-musl.tar.gz",
    ctx.runtime.paths.build,
    ctx.sha256
);`,
				},
			],
		},
		{
			title: "verify_sha256 / verify_sha512 / verify_blake3",
			content: [
				{
					type: "text",
					content:
						"Check an existing file against an expected digest. Each throws if the digest is malformed or does not match.",
				},
				{
					type: "code",
					language: "rhai",
					content: `verify_sha256(archive, "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824");
verify_sha512(archive, ctx.sha512);
verify_blake3(archive, ctx.blake3);`,
				},
				{
					type: "text",
					content: rich`${code("recipe hash FILE")} prints all three digests for a file you are pinning.`,
				},
			],
		},
		{
			title: "fetch_sha256",
			content: [
				{
					type: "text",
					content: rich`${code("fetch_sha256(url, filename)")} reads a remote checksum file (${code("sha256sum")} format or ${code("SHA256 (filename) = …")}) and returns the hash listed for ${code("filename")}. It throws if there is none.`,
				},
				{
					type: "note",
					variant: "warning",
					content:
						"A digest fetched from the same unauthenticated source as the payload is not source verification. Pin the digest in the recipe when the publisher offers no signed checksum.",
				},
			],
		},
	],
} satisfies DocsContent;
