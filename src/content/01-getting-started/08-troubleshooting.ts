import type { DocsContent } from "../../types"
import { rich, code } from "../../rich-text"

export const troubleshootingContent: DocsContent = {
	title: "Troubleshooting",
	intro: "Common issues and solutions for LevitateOS installation and usage.",
	sections: [
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
									content: "Boot from the ISO again and verify your installation:",
								},
								{
									type: "command",
									description: "Mount your partitions",
									command: ["mount /dev/sda2 /mnt", "mount /dev/sda1 /mnt/boot"],
								},
								{
									type: "command",
									description: "Verify root partition is labeled 'root' (required for UKI)",
									command: "blkid /dev/sda2 | grep 'LABEL=\"root\"'",
								},
								{
									type: "command",
									description: "Verify UKI exists",
									command: "ls -la /mnt/boot/EFI/Linux/levitateos.efi",
								},
								{
									type: "command",
									description: "Reinstall UKI if missing",
									command: [
										"mkdir -p /mnt/boot/EFI/Linux",
										"cp /media/cdrom/boot/uki/levitateos.efi /mnt/boot/EFI/Linux/",
									],
								},
								{
									type: "command",
									description: "Re-enter chroot and reinstall bootloader",
									command: [
										"recchroot /mnt",
										"bootctl install",
										"exit",
									],
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
									content: "If no wireless device appears, you may need to install additional firmware packages.",
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
