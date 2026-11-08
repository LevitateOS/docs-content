import type { DocsContent } from "../../types";
import { rich, bold, code, link } from "../../rich-text";
import { TOOL_HELP } from "../../tool-help";

export default {
	title: "recchroot",
	intro: "Enter a chroot environment with proper bind mounts. Like arch-chroot for Arch Linux.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`${code("recchroot")} sets up the necessary bind mounts (/proc, /sys, /dev, /run), enters the chroot, runs your command (or root's login shell in the target), and cleans up on exit. This is the equivalent of Arch Linux's ${code("arch-chroot")} command.`,
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
					command: "recchroot /mnt -- passwd",
				},
				{
					type: "command",
					language: "bash",
					description: "Check the installed bootloader",
					command: "recchroot /mnt -- bootctl status",
				},
				{
					type: "command",
					language: "bash",
					description: "Set a user's password",
					command: "recchroot /mnt -- passwd yourname",
				},
			],
		},
		{
			title: "Mount Handling",
			content: [
				{
					type: "table",
					headers: ["Source", "Target", "Purpose"],
					rows: [
						[
							rich`${code("/proc")}`,
							rich`${code("<chroot>/proc")}`,
							"Process information filesystem",
						],
						[
							rich`${code("/sys")}`,
							rich`${code("<chroot>/sys")}`,
							"Kernel/hardware information; bound recursively, so EFI variables come along on UEFI",
						],
						[rich`${code("/dev")}`, rich`${code("<chroot>/dev")}`, "Device nodes"],
						[rich`${code("/run")}`, rich`${code("<chroot>/run")}`, "Runtime data (udev, systemd)"],
					],
					monospaceCol: 0,
				},
				{
					type: "text",
					content: rich`${bold("DNS resolution")}: the live system's ${code("/etc/resolv.conf")} is bind-mounted over the target's for the session, so network operations work without writing into the target. A target ${code("resolv.conf")} that is a symlink is left alone; it resolves inside the chroot.`,
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
					content: rich`While the session is open, recchroot itself ignores those signals (the command gets the default handling), so an interrupt stops the command and recchroot still undoes its mounts. Unmounts run in reverse order with ${code("MNT_DETACH")}; a mount that cannot be removed is reported as an error.`,
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
						"recchroot returns the exit status of the command run inside the chroot: 0 for 0, 5 for 5. A command killed by signal N gives 128+N, as shells report it.",
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
						["Bind mounts", "/proc, /sys, /dev, /run", "Same"],
						["efivars", "Included with /sys on UEFI", "Mounted on UEFI"],
						["resolv.conf", "Bind mounted for the session", "Bind mounted"],
						["Default command", "Root's login shell in the target", "/bin/bash"],
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
} satisfies DocsContent;
