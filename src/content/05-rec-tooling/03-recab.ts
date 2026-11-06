import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"
import { TOOL_HELP } from "../../tool-help"

export const recabContent: DocsContent = {
	title: "recab",
	meta: {
		product: "shared",
		scopes: ["reference"],
		audience: ["operator", "developer"],
		stability: "experimental",
	},
	intro: "A/B slot management: which slot runs, which boots next, commit and rollback (systemd-boot backend).",
	sections: [
		{
			title: "Status",
			content: [
				{
					type: "text",
					content: rich`${code("recab")} is implemented on systemd-boot, with systemd (LevitateOS) or OpenRC (AcornOS) as init: it finds the running slot by matching the kernel's ${code("root=")} against the slot entries, stages trial boots by writing systemd-boot's ${code("LoaderEntryOneShot")} variable itself (no ${code("bootctl")} needed), lets its trial service commit a healthy trial or reboot out of a failed one, and keeps its state in ${code("/var/lib/recab")}. ${code("recab status --json")} prints the JSON described by ${code("tools/recab/docs/status.schema.json")}.`,
				},
			],
		},
		{
			title: "Usage",
			content: [
				{
					type: "text",
					content: rich`Options as printed by ${code("recab --help")}:`,
				},
				{
					type: "code",
					language: "text",
					content: TOOL_HELP.recab,
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
						rich`${link("recpart", "/docs/recpart")} - Install disk/backend handoff`,
						rich`${link("Atomic Updates (A/B)", "/docs/atomic-updates")} - A/B model context`,
					],
				},
			],
		},
	],
}
