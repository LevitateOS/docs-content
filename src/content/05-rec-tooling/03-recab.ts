import type { DocsContent } from "../../types";
import { rich, bold, code, link } from "../../rich-text";
import { TOOL_HELP } from "../../tool-help";

export default {
	title: "recab",
	intro:
		"A/B slot management: which slot runs, which boots next, commit and rollback (systemd-boot backend).",
	sections: [
		{
			title: "How It Works",
			content: [
				{
					type: "text",
					content: rich`${code("recab")} is implemented on systemd-boot, with systemd (LevitateOS) or OpenRC (AcornOS) as init: it finds the running slot by matching the kernel's ${code("root=")} against the slot entries, stages trial boots by writing systemd-boot's ${code("LoaderEntryOneShot")} variable itself (no ${code("bootctl")} needed), lets its trial service commit a healthy trial or reboot out of a failed one, and keeps its state in ${code("/var/lib/recab")}. ${code("recab status --json")} prints the JSON described by ${code("tools/recab/docs/status.schema.json")}.`,
				},
			],
		},
		{
			title: "An Update",
			content: [
				{
					type: "code",
					language: "bash",
					content: `recab stage --rootfs /mnt/live/filesystem.erofs --kernel /mnt/boot/vmlinuz --initrd /mnt/boot/initramfs-installed.img
recab set-next B      # one trial boot of the staged slot
reboot                # into B: committed if it comes up healthy, else back to A
recab rollback        # later, if wanted: back to A, while A still holds its system`,
				},
				{
					type: "text",
					content: rich`${code("stage")} formats the inactive slot, extracts the image with ${code("recstrap")}, and carries over the hostname, machine id, locale, time settings, accounts (merged by name), SSH host keys, enabled services and network connections, as the image's ${code("/usr/lib/recab/carried")} lists them. For the carried directories (systemd units and links, OpenRC runlevels, conf.d) it records what the image shipped in ${code("/usr/lib/recab/baseline")}; the next update carries only what the machine added or changed there, drops what it removed, and takes the rest from the new image. It refuses while the running slot is uncommitted or while the target slot is the next boot.`,
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
						rich`${bold("Slot state machine")}: called by people, installers (${code("recsetup")} runs ${code("recab init")}) and the update scenarios`,
						rich`${bold("Never selects an unbootable slot")}: ${code("set-next")}, ${code("commit")} and ${code("rollback")} refuse a slot whose entry names files missing from the ESP`,
						rich`${bold("Non-goal")}: building the system it stages, or package management`,
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
} satisfies DocsContent;
