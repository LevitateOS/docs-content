import type { DocsContent } from "../../types"
import { rich, bold, link } from "../../rich-text"

export const installationContent: DocsContent = {
	title: "Installation",
	intro: "Step-by-step guide to installing LevitateOS from the live environment.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content:
						"Installing LevitateOS follows the same process as Gentoo. You'll boot from a live environment, prepare your disk, extract the base tarball, and configure the system before rebooting. No network connection is required.",
				},
			],
		},
		{
			title: "What You'll Do",
			content: [
				{
					type: "list",
					items: [
						rich`${bold("Boot")} - Boot the live ISO`,
						rich`${bold("Partition")} - Create EFI and root partitions on your disk`,
						rich`${bold("Extract")} - Extract the stage3 tarball to install the base system`,
						rich`${bold("Configure")} - Set timezone, locale, hostname, users, and bootloader`,
						rich`${bold("Reboot")} - Boot into your new LevitateOS installation`,
					],
				},
			],
		},
		{
			title: "Installation Steps",
			content: [
				{
					type: "list",
					items: [
						rich`${link("Disk Preparation", "/docs/installation-disk")} - Boot, identify disk, partition, format, mount (steps 1-5)`,
						rich`${link("Base System", "/docs/installation-base")} - Extract stage3, generate fstab, enter chroot (steps 6-8)`,
						rich`${link("Configuration", "/docs/installation-config")} - Timezone, locale, hostname, passwords, user account (steps 9-13)`,
						rich`${link("Bootloader & Finish", "/docs/installation-boot")} - Install bootloader, enable services, reboot (steps 14-16)`,
					],
				},
			],
		},
	],
}
