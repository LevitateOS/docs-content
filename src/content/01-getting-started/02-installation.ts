import type { DocsContent } from "../../types";
import { rich, bold, code, link } from "../../rich-text";

export const installationContent: DocsContent = {
	title: "Installation",
	meta: { product: "levitate", scopes: ["install"], audience: ["beginner"], stability: "stable" },
	intro: "Step-by-step guide to installing LevitateOS from the live environment.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content:
						"Installing LevitateOS follows the same process as Arch Linux. You boot the live ISO, partition the disk with recpart, extract the system with recstrap, configure it with recsetup, and reboot. No network connection is required.",
				},
				{
					type: "note",
					variant: "info",
					content: rich`${bold("A/B by default:")} the disk gets two system slots and a ${code("/var")} state partition. Updates go to the inactive slot and are trial-booted before they are kept. ${bold("Mutable mode")}, one root changed in place, is an explicit opt-in. See ${link("Atomic Updates (A/B)", "/docs/atomic-updates")}.`,
				},
			],
		},
		{
			title: "What You'll Do",
			content: [
				{
					type: "list",
					items: [
						rich`${bold("Boot")} - Boot the live ISO into the install screen: the install steps (${code("install-hub")}), with a shell one key away, beside this guide`,
						rich`${bold("Partition")} - Create the default A/B layout with ${code("recpart")}: EFI, system slot A, system slot B and the ${code("/var")} state partition`,
						rich`${bold("Extract")} - Use ${code("recstrap")} to extract the system (like pacstrap)`,
						rich`${bold("Configure")} - Set time zone, locale, keymap, hostname and users with ${code("recsetup")}`,
						rich`${bold("Bootloader")} - Install systemd-boot and the A/B boot entries with ${code("recsetup")}`,
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
						rich`${link("Disk Preparation", "/docs/installation-disk")} - Boot, identify the disk, partition, format and mount it (steps 1-5)`,
						rich`${link("Base System", "/docs/installation-base")} - Extract with recstrap, generate fstab, inspect the target (steps 6-9)`,
						rich`${link("Configuration", "/docs/installation-config")} - Timezone, locale, hostname, passwords, user account (steps 10-14)`,
						rich`${link("Bootloader & Finish", "/docs/installation-boot")} - Install the bootloader and A/B boot entries, review services, reboot (steps 15-18)`,
					],
				},
			],
		},
	],
};
