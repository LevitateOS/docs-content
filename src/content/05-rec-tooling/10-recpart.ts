import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"
import { TOOL_HELP } from "../../tool-help"

export const recpartContent: DocsContent = {
	title: "recpart",
	meta: {
		product: "shared",
		scopes: ["install", "reference"],
		audience: ["operator", "developer"],
		stability: "experimental",
	},
	intro: "Mode-aware partition planning and apply backend for installation flows.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`${code("recpart")} handles disk inventory, deterministic partition planning, and plan application. It is intentionally limited to partitioning/format/mount handoff and does not install payloads.`,
				},
				{
					type: "note",
					variant: "warning",
					content: rich`${bold("Destructive tool")}: real apply requires explicit confirmation (${code("--confirm DESTROY")}). Use ${code("--dry-run")} first.`,
				},
			],
		},
		{
			title: "Usage",
			content: [
				{
					type: "text",
					content: rich`Options as printed by ${code("recpart --help")}:`,
				},
				{
					type: "code",
					language: "text",
					content: TOOL_HELP.recpart,
				},
			],
		},
		{
			title: "Install Modes",
			content: [
				{
					type: "table",
					headers: ["Mode", "Intent"],
					rows: [
						[rich`${code("ab")} (default)`, "A/B immutable-ready layout"],
						[rich`${code("mutable")}`, "Classic mutable root layout"],
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
					description: "Discover candidate disks (JSON)",
					command: "recpart list-disks --json",
				},
				{
					type: "command",
					language: "bash",
					description: "Generate an A/B plan without applying",
					command: "recpart plan --disk /dev/sda --mode ab --json",
				},
				{
					type: "command",
					language: "bash",
					description: "Dry-run apply for review",
					command: "recpart apply --disk /dev/sda --mode ab --dry-run --json",
				},
				{
					type: "command",
					language: "bash",
					description: "Real apply (destructive)",
					command: "recpart apply --disk /dev/sda --mode ab --confirm DESTROY",
				},
			],
		},
		{
			title: "Error Codes",
			content: [
				{
					type: "text",
					content: rich`Every failure prints a code such as ${code("E004")}; the number is also the exit status. The codes and their meaning are the ${code("ErrorCode")} enum in ${code("tools/recpart/src/error.rs")}.`,
				},
			],
		},
		{
			title: "Boundaries",
			content: [
				{
					type: "list",
					items: [
						rich`${bold("Does")}: disk planning, apply, and install handoff metadata`,
						rich`${bold("Does not")}: rootfs extraction (${code("recstrap")}), fstab generation (${code("recfstab")}), or chroot config (${code("recchroot")})`,
						rich`${bold("Does not")}: A/B slot commit/rollback state machine (${code("recab")})`,
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
						rich`${link("recstrap", "/docs/recstrap")} - Extract rootfs`,
						rich`${link("recfstab", "/docs/recfstab")} - Generate fstab`,
						rich`${link("recchroot", "/docs/recchroot")} - Enter target system`,
						rich`${link("recab", "/docs/recab")} - A/B slot state machine`,
					],
				},
			],
		},
	],
}
