import type { DocsContent } from "../../types"
import { rich, code } from "../../rich-text"

export const helpersLlmContent: DocsContent = {
	title: "LLM Helpers",
	intro:
		"AI-assisted functions for extracting version numbers and download URLs from unstructured sources. These helpers use a local LLM to parse complex web pages.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`LLM helpers are useful when version numbers or download URLs aren't available via a clean API (like GitHub releases). They fetch a web page and use AI to extract the information. Requires a local LLM configured via ${code("RECIPE_LLM_ENDPOINT")}.`,
				},
			],
		},
		{
			title: "llm_extract",
			content: [
				{
					type: "text",
					content: "Extract arbitrary information from a web page using a natural language prompt.",
				},
				{
					type: "code",
					language: "rhai",
					content: `let result = llm_extract(
    "https://example.com/downloads",
    "Find the SHA256 checksum for the Linux x86_64 download"
);`,
				},
			],
		},
		{
			title: "llm_find_latest_version",
			content: [
				{
					type: "text",
					content:
						"Find the latest version number from a download page. The LLM parses the page and returns just the version string.",
				},
				{
					type: "code",
					language: "rhai",
					content: `fn check_update() {
    // For software without GitHub releases
    let latest = llm_find_latest_version("https://example.com/downloads/");
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
			title: "llm_find_download_url",
			content: [
				{
					type: "text",
					content:
						"Find the download URL for a specific version and platform. Useful for complex download pages.",
				},
				{
					type: "code",
					language: "rhai",
					content: `fn acquire(ctx) {
    let url = llm_find_download_url(
        "https://example.com/downloads/",
        ctx.version,
        "Linux x86_64 tarball"
    );
    let archive = download(url, join_path(BUILD_DIR, ctx.name + ".tar.gz"));
    // ...
}`,
				},
			],
		},
		{
			title: "When to Use",
			content: [
				{
					type: "text",
					content: "Prefer structured APIs when available:",
				},
				{
					type: "table",
					headers: ["Source", "Use"],
					rows: [
						["GitHub releases", "github_latest_release(), github_download_release()"],
						["GitHub tags", "github_latest_tag()"],
						["Direct URLs", "download()"],
						["Unstructured pages", "llm_* helpers"],
					],
					monospaceCol: 1,
				},
				{
					type: "text",
					content:
						"LLM helpers are slower and require a local LLM, so only use them when no structured alternative exists.",
				},
			],
		},
		{
			title: "Configuration",
			content: [
				{
					type: "text",
					content: rich`Set the ${code("RECIPE_LLM_ENDPOINT")} environment variable to your local LLM server:`,
				},
				{
					type: "code",
					language: "bash",
					content: `export RECIPE_LLM_ENDPOINT="http://localhost:11434/v1"`,
				},
			],
		},
	],
}
