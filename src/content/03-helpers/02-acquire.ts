import type { DocsContent } from "../../types"

export const helpersAcquireContent: DocsContent = {
	title: "Acquire Helpers",
	intro: "Functions for downloading and verifying source materials.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content:
						"Both `download()` and `copy()` set internal state used by `verify_sha256()` and `extract()`. This allows chaining without passing file paths explicitly.",
				},
			],
		},
		{
			title: "download",
			content: [
				{
					type: "text",
					content: "Download a file from a URL with progress bar. Saves to `BUILD_DIR/{filename}`.",
				},
				{
					type: "code",
					language: "rhai",
					content: `download("https://example.com/foo-1.0.tar.gz");
// Downloads to BUILD_DIR/foo-1.0.tar.gz`,
				},
			],
		},
		{
			title: "copy",
			content: [
				{
					type: "text",
					content: "Copy files matching a glob pattern to the build directory.",
				},
				{
					type: "code",
					language: "rhai",
					content: `copy("./local-sources/*.tar.gz");
copy("/path/to/patches/*");`,
				},
			],
		},
		{
			title: "verify_sha256",
			content: [
				{
					type: "text",
					content:
						"Verify the SHA256 hash of the last downloaded or copied file. Fails if hash doesn't match.",
				},
				{
					type: "code",
					language: "rhai",
					content: `download("https://example.com/foo-1.0.tar.gz");
verify_sha256("2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824");`,
				},
			],
		},
	],
}
