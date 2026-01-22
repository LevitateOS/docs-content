import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"

export const installationBootContent: DocsContent = {
	title: "Bootloader & Finish",
	intro: rich`Installation steps 15-18: Generate initramfs, install bootloader, enable services, and reboot. See ${link("Installation", "/docs/installation")} for an overview.`,
	sections: [
		{
			title: "15. Generate Initramfs",
			content: [
				{
					type: "text",
					content: "Generate the initramfs using dracut. This creates the initial ramdisk needed to boot:",
				},
				{
					type: "command",
					description: "Find your kernel version",
					command: "ls /usr/lib/modules/",
				},
				{
					type: "command",
					description: "Generate initramfs (replace VERSION with your kernel version)",
					command: "dracut --force --no-hostonly /boot/initramfs.img VERSION",
				},
				{
					type: "command",
					description: "Verify initramfs was created",
					command: "ls -lh /boot/initramfs.img",
				},
			],
		},
		{
			title: "16. Install Bootloader",
			content: [
				{
					type: "text",
					content: "Install systemd-boot:",
				},
				{
					type: "command",
					description: "Install systemd-boot to EFI partition",
					command: "bootctl install",
				},
				{
					type: "command",
					description: "Create the loader configuration",
					command: `cat > /boot/loader/loader.conf << 'EOF'
default levitate.conf
timeout 3
editor no
EOF`,
				},
				{
					type: "text",
					content: "Get your root partition UUID and create the boot entry:",
				},
				{
					type: "command",
					description: "Get root partition UUID",
					command: "blkid /dev/sda2",
				},
				{
					type: "command",
					description: "Create boot entry (replace UUID with value from blkid)",
					command: `cat > /boot/loader/entries/levitate.conf << 'EOF'
title   LevitateOS
linux   /vmlinuz
initrd  /initramfs.img
options root=UUID=your-root-uuid-here rw quiet
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
