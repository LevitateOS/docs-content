import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"

export const installationBootContent: DocsContent = {
	title: "Bootloader & Finish",
	intro: rich`Installation steps 15-18: Install pre-built UKI, install bootloader, enable services, and reboot. See ${link("Installation", "/docs/installation")} for an overview.`,
	sections: [
		{
			title: "15. Install Boot Image (UKI)",
			content: [
				{
					type: "text",
					content: "LevitateOS uses Unified Kernel Images (UKI) - a single file containing the kernel, initramfs, and boot parameters. The ISO includes pre-built UKIs ready to copy.",
				},
				{
					type: "command",
					description: "Create the EFI Linux directory",
					command: "mkdir -p /boot/EFI/Linux",
				},
				{
					type: "command",
					description: "Copy the pre-built UKI from the ISO",
					command: "cp /media/cdrom/boot/uki/levitateos.efi /boot/EFI/Linux/",
				},
				{
					type: "text",
					content: "Optionally copy the recovery UKI for emergency access:",
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
					content: "Install systemd-boot. It automatically discovers UKIs in /boot/EFI/Linux/:",
				},
				{
					type: "command",
					description: "Install systemd-boot to EFI partition",
					command: "bootctl install",
				},
				{
					type: "note",
					variant: "info",
					content: rich`${bold("No boot entries needed:")} systemd-boot auto-discovers UKIs in ${code("/boot/EFI/Linux/")}. The UKI contains all boot parameters.`,
				},
				{
					type: "text",
					content: "Optionally configure bootloader timeout:",
				},
				{
					type: "command",
					description: "Set boot menu timeout (optional)",
					command: `cat > /boot/loader/loader.conf << 'EOF'
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
