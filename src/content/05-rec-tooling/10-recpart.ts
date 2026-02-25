import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"

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
					type: "code",
					language: "bash",
					content: "recpart <COMMAND> [OPTIONS]",
				},
				{
					type: "table",
					headers: ["Command", "Purpose"],
					rows: [
						[rich`${code("list-disks")}`, "Enumerate candidate disks"],
						[rich`${code("plan")}`, "Generate deterministic layout and script"],
						[rich`${code("apply")}`, "Apply partition plan to disk"],
					],
					monospaceCol: 0,
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
					type: "table",
					headers: ["Code", "Description"],
					rows: [
						["E001", "Invalid target disk / safety failure"],
						["E002", "Required tool missing"],
						["E003", "Plan generation or policy validation failed"],
						["E004", "Missing destructive confirmation"],
						["E005", "Partition apply failed"],
						["E006", "Filesystem format failed"],
						["E007", "Mount operation failed"],
						["E008", "Handoff generation failed"],
						["E009", "JSON serialization failed"],
						["E010", "Reserved not-implemented code"],
						["E011", "Root privileges required"],
						["E012", "Internal/runtime error"],
					],
					monospaceCol: 0,
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
						rich`${link("recab", "/docs/recab")} - A/B slot state machine scaffold`,
					],
				},
			],
		},
	],
}
