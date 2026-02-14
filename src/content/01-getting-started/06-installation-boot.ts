import type { DocsContent } from "../../types"
import { rich, link } from "../../rich-text"

export const installationBootContent: DocsContent = {
	title: "Bootloader & Finish",
	intro: rich`Installation steps 15-18: Install A/B boot images, install bootloader, enable services, and reboot. See ${link("Installation", "/docs/installation")} for an overview.`,
	sections: [
		{
			title: "15. Install Boot Images (A/B UKIs)",
			content: [
				{
					type: "text",
					content:
						"LevitateOS boots via Unified Kernel Images (UKI) and systemd-boot. The default install uses two boot images: slot A (system-a) and slot B (system-b).",
				},
				{
					type: "command",
					description: "Create the EFI Linux directory",
					command: "mkdir -p /boot/EFI/Linux",
				},
				{
					type: "command",
					description: "Copy slot A boot image (system-a)",
					command: "cp /media/cdrom/boot/uki/levitateos-system-a.efi /boot/EFI/Linux/",
				},
				{
					type: "command",
					description: "Copy slot B boot image (system-b)",
					command: "cp /media/cdrom/boot/uki/levitateos-system-b.efi /boot/EFI/Linux/",
				},
				{
					type: "command",
					description: "Copy recovery UKI (optional)",
					command: "cp /media/cdrom/boot/uki/levitateos-recovery.efi /boot/EFI/Linux/",
				},
			],
		},
		{
			title: "16. Install Bootloader",
			content: [
				{
					type: "text",
					content: "Install systemd-boot and create explicit boot entries for slot A and slot B:",
				},
				{
					type: "command",
					description: "Install systemd-boot to EFI partition",
					command: "bootctl install",
				},
				{
					type: "command",
					description: "Create slot A + slot B boot entries",
					command: [
						"mkdir -p /boot/loader/entries",
						`cat > /boot/loader/entries/levitate-a.conf << 'EOF'
title   LevitateOS (Slot A)
efi     /EFI/Linux/levitateos-system-a.efi
EOF`,
						`cat > /boot/loader/entries/levitate-b.conf << 'EOF'
title   LevitateOS (Slot B)
efi     /EFI/Linux/levitateos-system-b.efi
EOF`,
					],
				},
				{
					type: "command",
					description: "Configure bootloader defaults",
					command: `cat > /boot/loader/loader.conf << 'EOF'
default levitate-a.conf
timeout 3
editor no
EOF`,
				},
			],
		},
		{
			title: "17. Enable Services",
			content: [
				{
					type: "command",
					description: "Initialize machine ID (required by systemd)",
					command: "systemd-machine-id-setup",
				},
				{
					type: "command",
					description: "Enable networking",
					command: "systemctl enable NetworkManager",
				},
			],
		},
		{
			title: "18. Exit and Reboot",
			content: [
				{
					type: "command",
					description: "Exit chroot",
					command: "exit",
				},
				{
					type: "command",
					description: "Unmount all partitions",
					command: "umount -R /mnt",
				},
				{
					type: "command",
					description: "Reboot",
					command: "reboot",
				},
				{
					type: "text",
					content: "Remove the installation media when prompted.",
				},
				{
					type: "text",
					content: rich`Continue to ${link("Post-Installation", "/docs/post-installation")} for next steps. If you encounter issues, see ${link("Troubleshooting", "/docs/troubleshooting")}.`,
				},
			],
		},
	],
}
