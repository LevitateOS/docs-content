import type { DocsContent } from "../../types";
import { rich, bold, code, link } from "../../rich-text";
import { TOOL_HELP } from "../../tool-help";

export default {
	title: "recpart",
	intro: "Mode-aware partition planning and apply backend for installation flows.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`${code("recpart")} handles disk inventory, deterministic partition planning, and plan application. It is the backend of ${code("disk-plan")} on the live ISO. It reads what is on a disk (${code("inspect")}), plans either a template layout (${code("ab")} or ${code("mutable")}) or an explicit one (keep, delete, create, resize and format partitions, each with a role), prints the exact sfdisk script and every command, and applies the plan: it partitions, resizes, formats, mounts the new system under ${code("--mount-root")} (default ${code("/mnt")}) and activates swap. It does not install payloads.`,
				},
				{
					type: "note",
					variant: "warning",
					content: rich`${bold("Destructive tool")}: real apply requires explicit confirmation (${code("--confirm DESTROY")}). Use ${code("--dry-run")} first: it prints every step and anything apply would refuse.`,
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
					headers: ["Mode", "Template layout"],
					rows: [
						[
							rich`${code("ab")} (default)`,
							"EFI (1 GiB, /boot), ROOT_A (20 GiB, /), ROOT_B (20 GiB, unmounted) and STATE (the rest, at least 4 GiB, /var)",
						],
						[rich`${code("mutable")}`, "EFI (1 GiB, /boot) and ROOT (the rest, at least 8 GiB, /)"],
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
					description: "Show a disk's partitions, filesystems, used space, mounts and free gaps",
					command: "recpart inspect --disk /dev/nvme0n1",
				},
				{
					type: "command",
					language: "bash",
					description: "Generate an A/B plan without applying",
					command: "recpart plan --disk /dev/nvme0n1 --mode ab --json",
				},
				{
					type: "command",
					language: "bash",
					description: "Dry-run apply for review",
					command: "recpart apply --disk /dev/nvme0n1 --mode ab --dry-run --json",
				},
				{
					type: "command",
					language: "bash",
					description: "Real apply (destructive)",
					command: "recpart apply --disk /dev/nvme0n1 --mode ab --confirm DESTROY",
				},
				{
					type: "command",
					language: "bash",
					description:
						"Plan an explicit layout, for example keeping an existing EFI partition for dual boot",
					command: "recpart plan --disk /dev/nvme0n1 --layout layout.json",
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
						rich`${bold("Does")}: disk inspection, planning, layout checks against the install mode, apply, and install handoff metadata (install target, mounts, slot A and B devices)`,
						rich`${bold("Does not")}: rootfs extraction (${code("recstrap")}), fstab generation (${code("recfstab")}), or system configuration (${code("recsetup")})`,
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
} satisfies DocsContent;
