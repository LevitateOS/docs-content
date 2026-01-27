import type { DocsContent } from "../../types"
import { rich, code, link } from "../../rich-text"

export const helpersHttpContent: DocsContent = {
	title: "HTTP Helpers",
	intro: "Functions for HTTP requests and GitHub API access, useful for update checking and downloading.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`Timeout defaults to 30 seconds (configurable via ${code("RECIPE_HTTP_TIMEOUT")} env var). For downloading files, see ${link("Acquire Helpers", "/docs/helpers-acquire")}.`,
				},
			],
		},
		{
			title: "http_get",
			content: [
				{
					type: "text",
					content: "Fetch content from a URL. Returns the response body as a string.",
				},
				{
					type: "code",
					language: "rhai",
					content: `let page = http_get("https://api.example.com/version");`,
				},
			],
		},
		{
			title: "github_latest_release",
			content: [
				{
					type: "text",
					content: rich`Get the latest release version from a GitHub repository. Strips the ${code("v")} prefix automatically.`,
				},
				{
					type: "code",
					language: "rhai",
					content: `fn check_update() {
    let latest = github_latest_release("BurntSushi/ripgrep");
    // Returns "14.1.0" (not "v14.1.0")
    if latest != ctx.version {
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
			content: [
				{
					type: "text",
					content: rich`Get the latest tag from a GitHub repository. Strips the ${code("v")} prefix automatically. Useful for projects that use tags instead of releases.`,
				},
				{
					type: "code",
					language: "rhai",
					content: `let latest = github_latest_tag("torvalds/linux");
// Returns "6.7" for tag "v6.7"`,
				},
			],
		},
		{
			title: "github_download_release",
			content: [
				{
					type: "text",
					content: rich`Download a release asset from GitHub. Takes the repo, version, and a glob pattern for the asset name. Returns the downloaded file path. See ${link("Acquire Helpers", "/docs/helpers-acquire")} for more details.`,
				},
				{
					type: "code",
					language: "rhai",
					content: `let archive = github_download_release(
    "BurntSushi/ripgrep",
    "14.1.0",
    "ripgrep-*-x86_64-unknown-linux-musl.tar.gz"
);`,
				},
			],
		},
		{
			title: "parse_version",
			content: [
				{
					type: "text",
					content: rich`Strip common prefixes from version strings (${code("v")}, ${code("release-")}, ${code("version-")}).`,
				},
				{
					type: "code",
					language: "rhai",
					content: `parse_version("v1.0.0");        // "1.0.0"
parse_version("release-2.0");   // "2.0"
parse_version("version-3.1");   // "3.1"`,
				},
			],
		},
	],
}
