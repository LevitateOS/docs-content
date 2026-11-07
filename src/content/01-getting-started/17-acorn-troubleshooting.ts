import type { DocsContent } from "../../types";
import { rich, code } from "../../rich-text";

export const acornTroubleshootingContent: DocsContent = {
	title: "AcornOS Troubleshooting",
	meta: { product: "acorn", scopes: ["install"], audience: ["beginner"], stability: "stable" },
	intro: "Common issues and solutions for AcornOS installation and usage.",
	sections: [
		{
			title: "Install Issues",
			content: [
				{
					type: "qa",
					items: [
						{
							question: "recpart refuses the disk",
							answer: [
								{
									type: "text",
									content: rich`It prints the check that failed, an error code and what to do. ${code("--dry-run")} runs the same checks without changing anything.`,
								},
								{
									type: "command",
									language: "bash",
									description: "Show the steps and anything apply would refuse",
									command: "recpart apply --disk /dev/nvme0n1 --dry-run",
								},
							],
						},
					],
				},
			],
		},
		{
			title: "Boot Issues",
			content: [
				{
					type: "qa",
					items: [
						{
							question: "System fails to boot",
							answer: [
								{
									type: "text",
									content: "Boot from the ISO again and check the installed boot files:",
								},
								{
									type: "command",
									language: "bash",
									description: "Mount slot A, the EFI partition and the state partition",
									command: [
										"mount /dev/nvme0n1p2 /mnt",
										"mount /dev/nvme0n1p1 /mnt/boot",
										"mount /dev/nvme0n1p4 /mnt/var",
									],
								},
								{
									type: "command",
									language: "bash",
									description:
										"Check that both slot entries and slot A's kernel are on the EFI partition",
									command: ["ls /mnt/boot/loader/entries", "ls /mnt/boot/acornos-a"],
								},
								{
									type: "text",
									content: rich`You should see ${code("acornos-a.conf")} and ${code("acornos-b.conf")}, and ${code("vmlinuz")} for slot A (no initramfs). Each entry's ${code("options")} line names its slot by ${code("root=PARTUUID=")}; compare it with ${code("blkid -s PARTUUID /dev/nvme0n1p2")}.`,
								},
								{
									type: "command",
									language: "bash",
									description: "Reinstall systemd-boot and the A/B boot layout",
									command:
										"recsetup apply --root /mnt --boot ab --slot-a /dev/nvme0n1p2 --slot-b /dev/nvme0n1p3",
								},
							],
						},
						{
							question: "Bootloader not found (UEFI)",
							answer: [
								{
									type: "text",
									content: "Ensure you booted in UEFI mode and the ESP is mounted correctly:",
								},
								{
									type: "command",
									language: "bash",
									description: "Check if EFI variables are accessible",
									command: "ls /sys/firmware/efi/efivars",
								},
								{
									type: "command",
									language: "bash",
									description: "Verify ESP is mounted at /boot",
									command: "findmnt /boot",
								},
							],
						},
						{
							question: "An update did not stay",
							answer: [
								{
									type: "text",
									content: rich`A trial boot that fails, or does not finish starting, is not committed: the machine reboots into the known-good slot. ${code("recab status")} shows the running and known-good slots and how the last trial ended. Fix the cause, then stage and trial the slot again.`,
								},
								{
									type: "command",
									language: "bash",
									description: "Show the slots and the last trial",
									command: "recab status",
								},
							],
						},
					],
				},
			],
		},
		{
			title: "Network Issues",
			content: [
				{
					type: "qa",
					items: [
						{
							question: "No network after reboot",
							answer: [
								{
									type: "command",
									language: "bash",
									description: "Check the interfaces and their addresses",
									command: "ip addr",
								},
								{
									type: "command",
									language: "bash",
									description: "Check that dhcpcd runs",
									command: "rc-service dhcpcd status",
								},
								{
									type: "command",
									language: "bash",
									description: "Start it now and at every boot",
									command: ["doas rc-update add dhcpcd default", "doas rc-service dhcpcd start"],
								},
							],
						},
						{
							question: "WiFi",
							answer: [
								{
									type: "text",
									content:
										"Check that the card shows up with iw dev and that wpa_supplicant runs (rc-service wpa_supplicant status). Cards that need firmware (most Intel, Realtek, MediaTek and Broadcom chips) do not work yet: the ISO ships no firmware.",
								},
							],
						},
					],
				},
			],
		},
	],
};
