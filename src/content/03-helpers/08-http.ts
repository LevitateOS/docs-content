import type { DocsContent } from "../../types"

export const helpersHttpContent: DocsContent = {
	title: "HTTP Helpers",
	intro: "Functions for HTTP requests and GitHub API access, useful for checking updates.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content:
						"Timeout defaults to 30 seconds (configurable via `RECIPE_HTTP_TIMEOUT` env var).",
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
					content:
						"Get the latest release version from a GitHub repository. Strips the `v` prefix automatically.",
				},
				{
					type: "code",
					language: "rhai",
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
			content: [
				{
					type: "text",
					content:
						"Get the latest tag from a GitHub repository. Strips the `v` prefix automatically.",
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
			title: "parse_version",
			content: [
				{
					type: "text",
					content: "Strip common prefixes from version strings (`v`, `release-`, `version-`).",
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
