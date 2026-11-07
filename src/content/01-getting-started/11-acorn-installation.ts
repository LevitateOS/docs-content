import type { DocsContent } from "../../types";
import { rich, bold, code, link } from "../../rich-text";

export const acornInstallationContent: DocsContent = {
	title: "Installing AcornOS",
	meta: { product: "acorn", scopes: ["install"], audience: ["beginner"], stability: "stable" },
	intro: "Step-by-step guide to installing AcornOS from the live environment.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content:
						"AcornOS is LevitateOS's sibling on musl, OpenRC and busybox, built from Alpine packages. It installs the same way: you boot the live ISO, partition the disk with recpart, extract the system with recstrap, configure it with recsetup, and reboot. No network connection is required.",
				},
				{
					type: "note",
					variant: "info",
					content: rich`${bold("A/B by default:")} the disk gets two system slots and a ${code("/var")} state partition. Updates go to the inactive slot and are trial-booted before they are kept. ${bold("Mutable mode")}, one root changed in place, is an explicit opt-in. See ${link("Atomic Updates (A/B)", "/docs/atomic-updates")}.`,
				},
			],
		},
		{
			title: "Requirements",
			content: [
				{
					type: "list",
					items: [
						rich`${bold("CPU:")} x86-64`,
						rich`${bold("Storage:")} the default A/B layout uses 1 GB for EFI and 20 GB for each system slot, and gives the rest to ${code("/var")}`,
						rich`${bold("Boot:")} UEFI. AcornOS's boot files are unsigned, so Secure Boot must be disabled`,
					],
				},
			],
		},
		{
			title: "What You'll Do",
			content: [
				{
					type: "list",
					items: [
						rich`${bold("Boot")} - Boot the live ISO into the install screen: a shell beside this guide`,
						rich`${bold("Partition")} - Create the default A/B layout with ${code("disk-plan")} or ${code("recpart")}: EFI, system slot A, system slot B and the ${code("/var")} state partition`,
						rich`${bold("Extract")} - Use ${code("recstrap")} to extract the system (like pacstrap)`,
						rich`${bold("Configure")} - Set time zone, locale, keymap, hostname and users with ${code("recsetup")}`,
						rich`${bold("Bootloader")} - Install systemd-boot and the A/B boot entries with ${code("recsetup")}`,
						rich`${bold("Reboot")} - Boot into your new AcornOS installation`,
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
						rich`${link("AcornOS Disk Preparation", "/docs/acorn-installation-disk")} - Boot, identify the disk, partition, format and mount it (steps 1-5)`,
						rich`${link("AcornOS Base System", "/docs/acorn-installation-base")} - Extract with recstrap, generate fstab, inspect the target (steps 6-9)`,
						rich`${link("AcornOS Configuration", "/docs/acorn-installation-config")} - Timezone, locale, hostname, passwords, user account (steps 10-14)`,
						rich`${link("AcornOS Boot & Finish", "/docs/acorn-installation-boot")} - Install the bootloader and A/B boot entries, review services, reboot (steps 15-18)`,
					],
				},
			],
		},
		{
			title: "How It Differs From LevitateOS",
			content: [
				{
					type: "table",
					headers: ["", "LevitateOS", "AcornOS"],
					rows: [
						["Init", "systemd", "OpenRC"],
						[
							"libc and userland",
							"glibc, GNU",
							"musl, busybox (GNU coreutils, findutils and grep beside it)",
						],
						["Install-screen shell", "bash", "sh (busybox ash)"],
						["Admin rule", "sudo for wheel", "doas for wheel"],
						["Network", "NetworkManager", "dhcpcd on wired interfaces; no WiFi tools"],
						["Boot", "kernel and the installed initramfs", "kernel only, no initramfs"],
					],
				},
			],
		},
	],
};
