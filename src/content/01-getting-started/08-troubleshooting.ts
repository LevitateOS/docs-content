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
									description: "Check fstab has correct UUIDs",
									command: ["cat /mnt/etc/fstab", "blkid"],
								},
								{
									type: "command",
									description: "Re-enter chroot",
									command: [
										"mount --bind /dev /mnt/dev",
										"mount --bind /dev/pts /mnt/dev/pts",
										"mount --bind /proc /mnt/proc",
										"mount --bind /sys /mnt/sys",
										"mount --bind /sys/firmware/efi/efivars /mnt/sys/firmware/efi/efivars",
										"mount --bind /run /mnt/run",
										"chroot /mnt /bin/bash",
									],
								},
								{
									type: "command",
									description: "Reinstall bootloader",
									command: "bootctl install",
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
