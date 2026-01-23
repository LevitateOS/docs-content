import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"

export const installationToolsOverviewContent: DocsContent = {
	title: "Installation Tools Overview",
	intro: "Command-line tools for manual LevitateOS installation, equivalent to Arch Linux's pacstrap, genfstab, and arch-chroot.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`LevitateOS provides three installation tools that mirror Arch Linux's manual installation workflow. These tools give you complete control over the installation process.`,
				},
				{
					type: "table",
					headers: ["LevitateOS", "Arch Linux", "Purpose"],
					rows: [
						[
							rich`${link("recstrap", "/docs/recstrap")}`,
							"pacstrap",
							"Extract base system to target directory",
						],
						[
							rich`${link("recfstab", "/docs/recfstab")}`,
							"genfstab",
							"Generate fstab from mounted filesystems",
						],
						[
							rich`${link("recchroot", "/docs/recchroot")}`,
							"arch-chroot",
							"Enter chroot with proper bind mounts",
						],
					],
					monospaceCol: 0,
				},
			],
		},
		{
			title: "Installation Workflow",
			content: [
				{
					type: "text",
					content: rich`The three tools are used in sequence during installation. This workflow assumes you have already ${link("prepared your disks", "/docs/installation-disk")}.`,
				},
				{
					type: "interactive",
					intro: "Complete installation workflow:",
					steps: [
						{
							command: "mount /dev/sda2 /mnt",
							description: "Mount root partition",
						},
						{
							command: "mount --mkdir /dev/sda1 /mnt/boot",
							description: "Mount EFI System Partition",
						},
						{
							command: "recstrap /mnt",
							description: "Extract the base system",
						},
						{
							command: "recfstab /mnt >> /mnt/etc/fstab",
							description: "Generate fstab entries",
						},
						{
							command: "recchroot /mnt",
							description: "Enter the new system",
						},
						{
							command: "passwd",
							description: "Set root password (inside chroot)",
						},
						{
							command: "bootctl install",
							description: "Install bootloader (inside chroot)",
						},
						{
							command: "exit",
							description: "Exit chroot",
						},
						{
							command: "reboot",
							description: "Reboot into installed system",
						},
					],
				},
			],
		},
		{
			title: "Design Philosophy",
			content: [
				{
					type: "text",
					content: rich`Each tool does ${bold("one thing")} and does it well:`,
				},
				{
					type: "list",
					items: [
						rich`${bold("recstrap")} only extracts files. It does not partition, format, mount, configure, or install bootloaders.`,
						rich`${bold("recfstab")} only generates fstab. It outputs to stdout; you redirect to a file.`,
						rich`${bold("recchroot")} only enters chroot. It sets up mounts, runs your command, and cleans up.`,
					],
				},
				{
					type: "text",
					content:
						"This separation means you understand exactly what each step does. If something goes wrong, you know which tool to debug.",
				},
			],
		},
		{
			title: "Error Codes",
			content: [
				{
					type: "text",
					content:
						"All three tools use consistent error code formatting. Error messages include a code like E001, E002, etc. These codes are unique per tool and documented in each tool's reference page.",
				},
				{
					type: "code",
					language: "bash",
					content: `# Example error output
recstrap: E001: target directory '/mnt' does not exist
recfstab: E006: no filesystems found under '/mnt'
recchroot: E007: must run as root`,
				},
			],
		},
		{
			title: "See Also",
			content: [
				{
					type: "list",
					items: [
						rich`${link("recstrap Reference", "/docs/recstrap")} - Extract the base system`,
						rich`${link("recfstab Reference", "/docs/recfstab")} - Generate fstab entries`,
						rich`${link("recchroot Reference", "/docs/recchroot")} - Enter chroot environment`,
						rich`${link("Installation Guide", "/docs/installation")} - Complete installation walkthrough`,
					],
				},
			],
		},
	],
}
