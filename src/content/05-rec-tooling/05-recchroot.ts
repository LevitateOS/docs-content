import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"
import { TOOL_HELP } from "../../tool-help"

export const recchrootContent: DocsContent = {
	title: "recchroot",
	meta: {
		product: "levitate",
		scopes: ["install"],
		audience: ["operator", "developer"],
		stability: "stable",
	},
	intro: "Enter a chroot environment with proper bind mounts. Like arch-chroot for Arch Linux.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`${code("recchroot")} sets up the necessary bind mounts (/dev, /proc, /sys, /run), enters the chroot, runs your command (or an interactive shell), and cleans up on exit. This is the equivalent of Arch Linux's ${code("arch-chroot")} command.`,
				},
				{
					type: "note",
					variant: "warning",
					content: rich`${bold("Default update model:")} A/B immutable (slot updates + rollback). ${bold("Mutable mode")} is an explicit opt-in for daredevils, and is unsafe if you let an LLM author recipes without review.`,
				},
				{
					type: "text",
					content:
						"The tool handles mount cleanup automatically, even if the command fails or is interrupted with Ctrl+C.",
				},
			],
		},
		{
			title: "Usage",
			content: [
				{
					type: "text",
					content: rich`Options as printed by ${code("recchroot --help")}:`,
				},
				{
					type: "code",
					language: "text",
					content: TOOL_HELP.recchroot,
				},
			],
		},
		{
			title: "Examples",
			content: [
				{
					type: "command",
					language: "bash",
					description: "Enter interactive shell",
					command: "recchroot /mnt",
				},
				{
					type: "command",
					language: "bash",
					description: "Run single command",
					command: "recchroot /mnt passwd",
				},
				{
					type: "command",
					language: "bash",
					description: "Install bootloader",
					command: "recchroot /mnt bootctl install",
				},
				{
					type: "command",
					language: "bash",
					description: "Run multiple commands with shell",
					command: "recchroot /mnt /bin/bash -c 'passwd && bootctl install'",
				},
			],
		},
		{
			title: "Mount Handling",
			content: [
				{
					type: "text",
					content: rich`${bold("Required mounts")} (always created):`,
				},
				{
					type: "table",
					headers: ["Source", "Target", "Purpose"],
					rows: [
						[
							rich`${code("/proc")}`,
							rich`${code("<chroot>/proc")}`,
							"Process information filesystem",
						],
						[rich`${code("/sys")}`, rich`${code("<chroot>/sys")}`, "Kernel/hardware information"],
						[rich`${code("/dev")}`, rich`${code("<chroot>/dev")}`, "Device nodes"],
						[rich`${code("/run")}`, rich`${code("<chroot>/run")}`, "Runtime data (udev, systemd)"],
					],
					monospaceCol: 0,
				},
				{
					type: "text",
					content: rich`${bold("Optional mounts")} (created if source exists):`,
				},
				{
					type: "table",
					headers: ["Source", "Target", "Purpose"],
					rows: [
						[
							rich`${code("/sys/firmware/efi/efivars")}`,
							rich`${code("<chroot>/sys/firmware/efi/efivars")}`,
							"EFI variables (for bootloader installation)",
						],
					],
					monospaceCol: 0,
				},
				{
					type: "text",
					content: rich`${bold("DNS resolution")}: ${code("/etc/resolv.conf")} is copied into the chroot so network operations work.`,
				},
			],
		},
		{
			title: "Cleanup Behavior",
			content: [
				{
					type: "text",
					content: "Mounts are always cleaned up, even when:",
				},
				{
					type: "list",
					items: [
						"The command exits with an error",
						"The command is interrupted with Ctrl+C (SIGINT)",
						"The process receives SIGTERM or SIGQUIT",
						"Mount setup fails partway through",
					],
				},
				{
					type: "text",
					content: rich`Unmounts are performed in reverse order with ${code("MNT_DETACH")} to handle busy filesystems. Unmount failures are warnings, not errors.`,
				},
			],
		},
		{
			title: "Protected Paths",
			content: [
				{
					type: "text",
					content: rich`The tool refuses host system directories as a target. The list is ${code("PROTECTED_PATHS")} in ${code("tools/recstrap/src/guard.rs")}.`,
				},
			],
		},
		{
			title: "Error Codes",
			content: [
				{
					type: "text",
					content: rich`Every failure prints a code such as ${code("E004")}; the number is also the exit status. The codes and their meaning are the ${code("Code")} enum in ${code("tools/recstrap/src/error.rs")}.`,
				},
			],
		},
		{
			title: "Exit Status",
			content: [
				{
					type: "text",
					content:
						"recchroot returns the exit status of the command run inside the chroot. If the command exits with status 0, recchroot exits with 0. If the command exits with status 5, recchroot exits with 5.",
				},
				{
					type: "text",
					content: "Errors from recchroot itself use the error codes in the table above.",
				},
			],
		},
		{
			title: "Comparison with arch-chroot",
			content: [
				{
					type: "table",
					headers: ["Feature", "recchroot", "arch-chroot"],
					rows: [
						["Bind mounts", "/proc, /sys, /dev, /run", "Same + /sys/firmware/efi/efivars"],
						["efivars mount", "Automatic if UEFI", "Automatic if UEFI"],
						["resolv.conf", "Copied", "Bind mounted"],
						["Cleanup on signal", "Yes", "Yes"],
						["Implementation", "Rust", "Bash script"],
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
						rich`${link("recstrap", "/docs/recstrap")} - Extract the base system`,
						rich`${link("recfstab", "/docs/recfstab")} - Generate fstab entries`,
						rich`${link("Installation Tools Overview", "/docs/installation-tools-overview")} - Workflow overview`,
					],
				},
			],
		},
	],
}
