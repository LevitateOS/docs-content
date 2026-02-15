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
						"Installing LevitateOS follows the same process as Arch Linux. You'll boot from a live environment, prepare your disk, extract the system with recstrap, and configure before rebooting. No network connection is required.",
				},
				{
					type: "note",
					variant: "warning",
					content: rich`${bold("Default update model:")} A/B immutable (slot updates + rollback). ${bold("Mutable mode")} is an explicit opt-in for daredevils, and is unsafe if you let an LLM author recipes without review. See ${link("Atomic Updates (A/B)", "/docs/atomic-updates")}.`,
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
						rich`${bold("Partition")} - Create the default A/B layout: EFI + system-a + system-b + var`,
						rich`${bold("Extract")} - Use recstrap to extract the system (like pacstrap)`,
						rich`${bold("Configure")} - Set timezone, locale, hostname, users`,
						rich`${bold("Bootloader")} - Install systemd-boot and A/B boot entries`,
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
						rich`${link("Base System", "/docs/installation-base")} - Extract with recstrap, generate fstab, enter chroot (steps 6-9)`,
						rich`${link("Configuration", "/docs/installation-config")} - Timezone, locale, hostname, passwords, user account (steps 10-14)`,
						rich`${link("Bootloader & Finish", "/docs/installation-boot")} - Install A/B boot images, install bootloader, enable services, reboot (steps 15-18)`,
					],
				},
			],
		},
	],
}
