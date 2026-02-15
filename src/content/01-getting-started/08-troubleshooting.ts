import type { DocsContent } from "../../types"

export const troubleshootingContent: DocsContent = {
	title: "Troubleshooting",
	intro: "Common issues and solutions for LevitateOS installation and usage.",
	sections: [
		{
			title: "Boot Issues",
			content: [
				{
					type: "note",
					variant: "warning",
					content:
						"Default update model is A/B immutable (slot updates + rollback). Mutable mode is an explicit opt-in for daredevils, and is unsafe if you let an LLM author recipes without review.",
				},
				{
					type: "qa",
					items: [
						{
							question: "System fails to boot",
							answer: [
								{
									type: "text",
									content: "Boot from the ISO again and verify your installation:",
								},
								{
									type: "command",
									description: "Mount your partitions",
									command: [
										"mount /dev/sda2 /mnt",
										"mount /dev/sda1 /mnt/boot",
										"mount /dev/sda4 /mnt/var",
									],
								},
								{
									type: "command",
									description: "Verify slot A partition is labeled 'system-a'",
									command: "blkid /dev/sda2 | grep 'LABEL=\"system-a\"'",
								},
								{
									type: "command",
									description: "Verify slot A boot image exists",
									command: "ls -la /mnt/boot/EFI/Linux/levitateos-system-a.efi",
								},
								{
									type: "command",
									description: "Reinstall A/B boot images if missing",
									command: [
										"mkdir -p /mnt/boot/EFI/Linux",
										"cp /media/cdrom/boot/uki/levitateos-system-a.efi /mnt/boot/EFI/Linux/",
										"cp /media/cdrom/boot/uki/levitateos-system-b.efi /mnt/boot/EFI/Linux/",
									],
								},
								{
									type: "command",
									description: "Re-enter chroot and reinstall bootloader",
									command: ["recchroot /mnt", "bootctl install", "exit"],
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
									description: "Check if EFI variables are accessible",
									command: "ls /sys/firmware/efi/efivars",
								},
								{
									type: "command",
									description: "Verify ESP is mounted at /boot",
									command: "mount | grep boot",
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
									description: "Check NetworkManager status",
									command: "systemctl status NetworkManager",
								},
								{
									type: "command",
									description: "Start if not running",
									command: "sudo systemctl enable --now NetworkManager",
								},
								{
									type: "command",
									description: "Connect to WiFi",
									command: 'nmcli device wifi connect "YourNetwork" password "YourPassword"',
								},
							],
						},
						{
							question: "WiFi adapter not detected",
							answer: [
								{
									type: "text",
									content: "Check if the wireless driver is loaded:",
								},
								{
									type: "command",
									description: "List network interfaces",
									command: "ip link",
								},
								{
									type: "command",
									description: "Check for wireless devices",
									command: "nmcli device",
								},
								{
									type: "text",
									content:
										"If no wireless device appears, you may need to install additional firmware packages.",
								},
							],
						},
					],
				},
			],
		},
		{
			title: "Package Issues",
			content: [
				{
					type: "qa",
					items: [
						{
							question: "Package installation fails",
							answer: [
								{
									type: "text",
									content: "Try updating the package database first:",
								},
								{
									type: "command",
									description: "Update package lists",
									command: "recipe update",
								},
								{
									type: "command",
									description: "Retry installation",
									command: "recipe install packagename",
								},
							],
						},
					],
				},
			],
		},
	],
}
