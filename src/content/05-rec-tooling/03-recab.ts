import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"

export const recabContent: DocsContent = {
	title: "recab",
	meta: {
		product: "shared",
		scopes: ["reference"],
		audience: ["operator", "developer"],
		stability: "experimental",
	},
	intro: "A/B slot management command surface (currently scaffold status).",
	sections: [
		{
			title: "Status",
			content: [
				{
					type: "note",
					variant: "warning",
					content: rich`${code("recab")} is currently a scaffold. The CLI shape exists, but backend behavior is marked TODO/TBD in implementation.`,
				},
			],
		},
		{
			title: "Current CLI Shape",
			content: [
				{
					type: "code",
					language: "bash",
					content: "recab <status|set-next|commit|rollback>",
				},
				{
					type: "table",
					headers: ["Subcommand", "Intended Meaning", "Current State"],
					rows: [
						[rich`${code("status")}`, "Show active/inactive slot status", "Scaffold output"],
						[rich`${code("set-next <a|b>")}`, "Mark next boot target", "Scaffold output"],
						[rich`${code("commit")}`, "Commit currently booted slot", "Scaffold output"],
						[rich`${code("rollback")}`, "Revert to previous slot", "Scaffold output"],
					],
					monospaceCol: 0,
				},
			],
		},
		{
			title: "Design Intent",
			content: [
				{
					type: "list",
					items: [
						rich`${bold("Slot state machine glue")}: intended to be called by higher-level tooling`,
						rich`${bold("Non-goal")}: full updater or package manager`,
						rich`${bold("Future integrations")}: boot try/commit semantics and persistent slot state`,
					],
				},
			],
		},
		{
			title: "See Also",
			content: [
				{
					type: "list",
					items: [
						rich`${link("recguard", "/docs/recguard")} - Policy enforcement layer (draft)`,
						rich`${link("recpart", "/docs/recpart")} - Install disk/backend handoff`,
						rich`${link("Atomic Updates (A/B)", "/docs/atomic-updates")} - A/B model context`,
					],
				},
			],
		},
	],
}
