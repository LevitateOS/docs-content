import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"

export const recchrootContent: DocsContent = {
	title: "recchroot",
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
					type: "code",
					language: "bash",
					content: "recchroot <CHROOT_DIR> [COMMAND]...",
				},
				{
					type: "table",
					headers: ["Argument", "Description"],
					rows: [
						[rich`${code("CHROOT_DIR")}`, "Directory to chroot into (e.g., /mnt)"],
						[rich`${code("COMMAND")}`, "Command to run (default: /bin/bash)"],
					],
					monospaceCol: 0,
				},
			],
		},
		{
			title: "Options",
			content: [
				{
					type: "table",
					headers: ["Option", "Description"],
					rows: [
						[rich`${code("--version")}`, "Show version"],
						[rich`${code("--help")}`, "Show help"],
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
					description: "Enter interactive shell",
					command: "recchroot /mnt",
				},
				{
					type: "command",
					description: "Run single command",
					command: "recchroot /mnt passwd",
				},
				{
					type: "command",
					description: "Install bootloader",
					command: "recchroot /mnt bootctl install",
				},
				{
					type: "command",
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
					content: "These paths cannot be used as chroot targets:",
				},
				{
					type: "code",
					language: "text",
					content: `/  /bin  /boot  /dev  /etc  /home  /lib  /lib64  /opt\n/proc  /root  /run  /sbin  /srv  /sys  /tmp  /usr  /var`,
				},
				{
					type: "text",
					content: rich`Use a mount point like ${code("/mnt")} instead.`,
				},
			],
		},
		{
			title: "Error Codes",
			content: [
				{
					type: "table",
					headers: ["Code", "Exit", "Description"],
					rows: [
						["E001", "1", "Target directory does not exist"],
						["E002", "2", "Target is not a directory"],
						["E003", "3", "Failed to create mount point directory"],
						["E004", "4", "Mount operation failed"],
						["E005", "5", "Unmount operation failed (warning only)"],
						["E006", "6", "Command execution failed"],
						["E007", "7", "Must run as root"],
						["E008", "8", "Target is a protected system path"],
					],
					monospaceCol: 0,
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
