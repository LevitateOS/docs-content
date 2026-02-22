import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"

export const helpersLlmContent: DocsContent = {
	title: "LLM Helpers",
	intro:
		"AI-assisted helpers for extracting versions and download URLs from unstructured sources. These helpers shell out to a local agent CLI (Codex or Claude).",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`LLM helpers are useful when version numbers or download URLs aren't available via a clean API (like GitHub releases). Recipe does not try to parse the model output; it just runs your configured provider and returns the final text.`,
				},
				{
					type: "note",
					variant: "warning",
					content: rich`${bold("Safety:")} LLM output is untrusted. Review the extracted version/URL and anything that will be executed. The default update model is A/B immutable (slot updates + rollback); ${bold("mutable mode")} is an explicit opt-in for daredevils and is unsafe if you let an LLM author recipes without review. See ${link("Atomic Updates (A/B)", "/docs/atomic-updates")}.`,
				},
				{
					type: "text",
					content: rich`Configure the provider via XDG config: ${code("$XDG_CONFIG_HOME/recipe/llm.toml")} (default: ${code("~/.config/recipe/llm.toml")}). You must set ${code("default_provider")} to either ${code("codex")} or ${code("claude")} (equal footing; no implicit fallback). Optionally define named profiles under ${code("[profiles.<name>]")} and select them per run via ${code("recipe --llm-profile <name> ...")}.`,
				},
			],
		},
		{
			title: "llm_extract",
			content: [
				{
					type: "text",
					content:
						"Extract arbitrary information from unstructured text (HTML, changelog, etc) using a natural language prompt.",
				},
				{
					type: "code",
					language: "rhai",
					content: `let html = http_get("https://example.com/downloads");
let result = llm_extract(
    html,
    "Find the SHA256 checksum for the Linux x86_64 download. Return only the checksum."
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
    let latest = llm_find_latest_version("https://example.com/downloads/", "ExampleProject");
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
						"Find a download URL matching criteria from unstructured text (HTML, release notes, etc). Useful for complex download pages.",
				},
				{
					type: "code",
					language: "rhai",
					content: `fn acquire(ctx) {
    let html = http_get("https://example.com/downloads/");
    let url = llm_find_download_url(html, "Linux x86_64 tarball for version " + ctx.version);
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
					content: rich`Create ${code("$XDG_CONFIG_HOME/recipe/llm.toml")} (default: ${code("~/.config/recipe/llm.toml")}):`,
				},
				{
					type: "code",
					language: "toml",
					content: `version = 1
default_provider = "codex" # or "claude"
default_profile = "kernels_nightly" # optional

[providers.codex]
bin = "codex"
args = ["--sandbox", "read-only", "--skip-git-repo-check"]

[providers.claude]
bin = "claude"
args = ["-p", "--output-format", "text", "--no-chrome"]

[profiles.kernels_nightly]
default_provider = "codex"

[profiles.kernels_nightly.providers.codex]
model = "gpt-5.3-codex"
effort = "xhigh" # passed to codex as --config model_reasoning_effort=xhigh`,
				},
			],
		},
	],
}
