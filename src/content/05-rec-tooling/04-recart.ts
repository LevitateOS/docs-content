import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"

export const recartContent: DocsContent = {
	title: "recart",
	meta: {
		product: "shared",
		scopes: ["reference"],
		audience: ["operator", "developer"],
		stability: "experimental",
	},
	intro: "Centralized artifact-store manager for outputs and blob lifecycle operations.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`${code("recart")} provides artifact-store introspection and maintenance commands (${code("status")}, ${code("ls")}, ${code("gc")}, ${code("prune")}, ${code("serve")}, ${code("ingest")}).`,
				},
				{
					type: "note",
					variant: "warning",
					content: rich`${bold("Operator caution")}: ${code("gc")} and ${code("prune")} mutate artifact state. Review repository policy and dry-run expectations before use.`,
				},
			],
		},
		{
			title: "Usage",
			content: [
				{
					type: "code",
					language: "bash",
					content: "recart [--repo <PATH>] <COMMAND>",
				},
				{
					type: "table",
					headers: ["Command", "Purpose"],
					rows: [
						[rich`${code("status")}`, "Show store counts and size"],
						[rich`${code("ls <kind>")}`, "List index entries for artifact kind"],
						[rich`${code("gc")}`, "Delete unreferenced blobs"],
						[rich`${code("prune --keep-last N")}`, "Retain newest N entries per kind, then gc"],
						[rich`${code("ingest")}`, "Ingest existing artifacts from configured distro dirs"],
						[rich`${code("serve")}`, "Start local web UI over artifact/store state"],
					],
					monospaceCol: 0,
				},
			],
		},
		{
			title: "Examples",
			content: [
				{
					type: "command",
					language: "bash",
					description: "Inspect store health",
					command: "recart status",
				},
				{
					type: "command",
					language: "bash",
					description: "List rootfs entries",
					command: "recart ls rootfs_erofs",
				},
				{
					type: "command",
					language: "bash",
					description: "Prune aggressively and collect",
					command: "recart prune --keep-last 3",
				},
				{
					type: "command",
					language: "bash",
					description: "Start local UI",
					command: "recart serve --bind 127.0.0.1 --port 8765",
				},
			],
		},
		{
			title: "Current Caveat",
			content: [
				{
					type: "text",
					content: rich`Current ingest paths in implementation still reference distro directories such as ${code("leviso/")}, ${code("AcornOS/")}, and ${code("IuppiterOS/")}. Treat behavior as implementation-detail while policy migration is in progress.`,
				},
			],
		},
		{
			title: "See Also",
			content: [
				{
					type: "list",
					items: [
						rich`${link("rec* Tooling Overview", "/docs/rec-tooling-overview")} - Full tool inventory`,
					],
				},
			],
		},
	],
}
