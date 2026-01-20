import type { DocsContent } from "../../types"
import { rich, code, link } from "../../rich-text"

export const installationBootContent: DocsContent = {
	title: "Bootloader & Finish",
	intro: rich`Installation steps 14-16: Install the bootloader, enable services, and reboot. See ${link("Installation", "/docs/installation")} for an overview.`,
	sections: [
		{
			title: "14. Install Bootloader",
			content: [
				{
					type: "text",
					content: "Install systemd-boot:",
				},
				{
					type: "code",
					language: "bash",
					content: `# Install systemd-boot to EFI partition
bootctl install

# Check what kernel files exist (note the exact filenames)
ls /boot/vmlinuz* /boot/initramfs*`,
				},
				{
					type: "text",
					content: "Create the loader configuration:",
				},
				{
					type: "code",
					language: "bash",
					content: `nano /boot/loader/loader.conf`,
				},
				{
					type: "code",
					filename: "/boot/loader/loader.conf",
					content: `default levitate.conf
timeout 3
editor no`,
				},
				{
					type: "text",
					content: "Get your root partition UUID and create the boot entry:",
				},
				{
					type: "code",
					language: "bash",
					content: `blkid /dev/sda2
nano /boot/loader/entries/levitate.conf`,
				},
				{
					type: "code",
					filename: "/boot/loader/entries/levitate.conf",
					content: `title   LevitateOS
linux   /vmlinuz-linux
initrd  /initramfs-linux.img
options root=UUID=your-root-uuid-here rw quiet`,
				},
				{
					type: "text",
					content: rich`Use the exact kernel filenames from the ${code("ls")} command. For Intel CPUs, add ${code("initrd /intel-ucode.img")} before initramfs. For AMD: ${code("initrd /amd-ucode.img")}.`,
				},
			],
		},
		{
			title: "15. Enable Services",
			content: [
				{
					type: "code",
					language: "bash",
					content: `# Initialize machine ID (required by systemd)
systemd-machine-id-setup

# Enable networking
systemctl enable NetworkManager`,
				},
			],
		},
		{
			title: "16. Exit and Reboot",
			content: [
				{
					type: "code",
					language: "bash",
					content: `# Exit chroot
exit

# Unmount all partitions
umount -R /mnt

# Reboot
reboot`,
				},
				{
					type: "text",
					content: "Remove the installation media when prompted.",
				},
			],
		},
		{
			title: "Post-Installation",
			content: [
				{
					type: "text",
					content: "Log in with your user account and install packages:",
				},
				{
					type: "code",
					language: "bash",
					content: `recipe list           # List available packages
recipe install ripgrep # Install a package
recipe info firefox    # View package info`,
				},
				{
					type: "text",
					content: rich`See the ${link("CLI Reference", "/docs/cli-reference")} for all available commands.`,
				},
			],
		},
		{
			title: "Troubleshooting",
			content: [],
		},
		{
			title: "System fails to boot",
			level: 3,
			content: [
				{
					type: "text",
					content: "Boot from the ISO again and verify your installation:",
				},
				{
					type: "code",
					language: "bash",
					content: `# Mount your partitions
mount /dev/sda2 /mnt
mount /dev/sda1 /mnt/boot

# Check fstab has correct UUIDs
cat /mnt/etc/fstab
blkid

# Re-enter chroot
mount --bind /dev /mnt/dev
mount --bind /dev/pts /mnt/dev/pts
mount --bind /proc /mnt/proc
mount --bind /sys /mnt/sys
mount --bind /sys/firmware/efi/efivars /mnt/sys/firmware/efi/efivars
mount --bind /run /mnt/run
chroot /mnt /bin/bash

# Reinstall bootloader
bootctl install`,
				},
			],
		},
		{
			title: "No network after reboot",
			level: 3,
			content: [
				{
					type: "code",
					language: "bash",
					content: `# Check NetworkManager status
systemctl status NetworkManager

# Start if not running
sudo systemctl enable --now NetworkManager

# Connect to WiFi
nmcli device wifi connect "YourNetwork" password "YourPassword"`,
				},
			],
		},
	],
}
