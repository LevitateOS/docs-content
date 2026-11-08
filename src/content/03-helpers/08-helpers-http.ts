import type { DocsContent } from "../../types";
import { rich, code, link } from "../../rich-text";

export default {
	title: "HTTP Helpers",
	intro:
		"Bounded metadata requests: release versions, tags and small text documents. Payload downloads use the verified Acquire helpers.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`Each request times out after 30 seconds and needs a network grant for its host, such as ${code("--network-host api.github.com:443")}. Metadata tells a recipe author what is new; it never makes an unverified payload trustworthy. For downloading files, see ${link("Acquire Helpers", "/docs/helpers-acquire")}.`,
				},
			],
		},
		{
			title: "http_get",
			content: [
				{
					type: "text",
					content:
						"Fetch a URL and return the response body as text. The response size is bounded.",
				},
				{
					type: "code",
					language: "rhai",
					content: `let page = http_get("https://example.com/releases/latest.txt");`,
				},
			],
		},
		{
			title: "github_latest_release / github_latest_tag",
			content: [
				{
					type: "text",
					content: rich`Return the version of a repository's latest release, or its latest tag, with a leading ${code("v")} removed.`,
				},
				{
					type: "code",
					language: "rhai",
					content: `let latest = github_latest_release("BurntSushi/ripgrep");   // "14.1.0", not "v14.1.0"
let tag = github_latest_tag("torvalds/linux");`,
				},
			],
		},
		{
			title: "github_download_release",
			content: [
				{
					type: "text",
					content: rich`Download a matching asset of the latest release, verified against a required SHA256. See ${link("Acquire Helpers", "/docs/helpers-acquire")}.`,
				},
			],
		},
		{
			title: "parse_version",
			content: [
				{
					type: "text",
					content: rich`Strip a common prefix from a version string (${code("v")}, ${code("release-")} or ${code("version-")}).`,
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
} satisfies DocsContent;
