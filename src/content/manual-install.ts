import type { DocsContent } from "../types"

export const manualInstallContent: DocsContent = {
	title: "Manual Installation Guide",
	intro: "This guide is for users installing LevitateOS **without** the LLM assistant. If you have the LLM variant, see the [Installation Guide](/docs/install) instead.",
	sections: [
		{
			title: "1. Boot the ISO",
			content: [
				{
					type: "text",
					content:
						"After booting from the ISO, you'll be dropped into a root shell. The live environment has all the tools you need to partition, format, and install.",
				},
				{
					type: "code",
					language: "bash",
					content: `# You'll see a prompt like:
root@levitate-live ~ #`,
				},
			],
		},
		{
			title: "2. Identify Your Disk",
			content: [
				{ type: "text", content: "List available disks and identify your target:" },
				{
					type: "code",
					language: "bash",
					content: `lsblk -d -o NAME,SIZE,MODEL

# Example output:
# NAME    SIZE MODEL
# sda     500G Samsung SSD
# nvme0n1 1T   WD Black SN850`,
				},
				{
					type: "text",
					content:
						"In this guide, we'll use `/dev/sda`. Replace with your actual device.",
				},
			],
		},
		{
			title: "3. Partition the Disk",
			content: [
				{
					type: "text",
					content: "Create a GPT partition table with EFI and root partitions:",
				},
				{
					type: "code",
					language: "bash",
					content: `# Wipe existing partition table
wipefs -a /dev/sda

# Create partitions with fdisk
fdisk /dev/sda

# In fdisk:
# g        - Create GPT partition table
# n        - New partition (EFI)
#   1      - Partition number
#   [enter] - Default first sector
#   +512M  - 512MB for EFI
# t        - Change type
#   1      - EFI System
# n        - New partition (root)
#   2      - Partition number
#   [enter] - Default first sector
#   [enter] - Use remaining space
# w        - Write and exit`,
				},
				{
					type: "text",
					content: "Or use a single command with `parted`:",
				},
				{
					type: "code",
					language: "bash",
					content: `parted /dev/sda --script \\
  mklabel gpt \\
  mkpart ESP fat32 1MiB 513MiB \\
  set 1 esp on \\
  mkpart root ext4 513MiB 100%`,
				},
			],
		},
		{
			title: "4. Format Partitions",
			content: [
				{
					type: "code",
					language: "bash",
					content: `# Format EFI partition as FAT32
mkfs.fat -F32 /dev/sda1

# Format root partition as ext4
mkfs.ext4 /dev/sda2`,
				},
			],
		},
		{
			title: "5. Mount Filesystems",
			content: [
				{
					type: "code",
					language: "bash",
					content: `# Mount root
mount /dev/sda2 /mnt

# Create and mount EFI
mkdir -p /mnt/boot/efi
mount /dev/sda1 /mnt/boot/efi`,
				},
			],
		},
		{
			title: "6. Install Base System",
			content: [
				{ type: "text", content: "Extract the base system to the target:" },
				{
					type: "code",
					language: "bash",
					content: `# Copy base system
levitate-install --target /mnt

# This installs:
# - Linux kernel
# - Init system (systemd or runit)
# - libc (glibc or musl)
# - GNU coreutils
# - levitate package manager`,
				},
			],
		},
		{
			title: "7. Generate fstab",
			content: [
				{
					type: "code",
					language: "bash",
					content: `# Generate fstab from current mounts
genfstab -U /mnt >> /mnt/etc/fstab

# Verify it looks correct
cat /mnt/etc/fstab`,
				},
			],
		},
		{
			title: "8. Chroot and Configure",
			content: [
				{
					type: "code",
					language: "bash",
					content: `# Enter the new system
arch-chroot /mnt

# Set timezone
ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime
hwclock --systohc

# Set hostname
echo "levitate" > /etc/hostname

# Set root password
passwd

# Create your user
useradd -m -G wheel -s /bin/bash vince
passwd vince

# Enable sudo for wheel group
echo "%wheel ALL=(ALL) ALL" >> /etc/sudoers`,
				},
			],
		},
		{
			title: "9. Install Bootloader",
			content: [
				{
					type: "text",
					content:
						"Install and configure systemd-boot (for systemd variant) or GRUB:",
				},
			],
		},
		{
			title: "systemd-boot (systemd variant)",
			level: 3,
			content: [
				{
					type: "code",
					language: "bash",
					content: `# Install systemd-boot
bootctl install

# Create loader config
cat > /boot/loader/loader.conf << 'EOF'
default levitate.conf
timeout 3
editor no
EOF

# Create boot entry
cat > /boot/loader/entries/levitate.conf << 'EOF'
title   LevitateOS
linux   /vmlinuz-linux
initrd  /initramfs-linux.img
options root=/dev/sda2 rw
EOF`,
				},
			],
		},
		{
			title: "GRUB (runit variant)",
			level: 3,
			content: [
				{
					type: "code",
					language: "bash",
					content: `# Install GRUB
grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=LevitateOS

# Generate config
grub-mkconfig -o /boot/grub/grub.cfg`,
				},
			],
		},
		{
			title: "10. Exit and Reboot",
			content: [
				{
					type: "code",
					language: "bash",
					content: `# Exit chroot
exit

# Unmount
umount -R /mnt

# Reboot
reboot`,
				},
			],
		},
		{
			title: "Post-Installation",
			content: [
				{
					type: "text",
					content:
						"After rebooting, log in and install the desktop environment:",
				},
				{
					type: "code",
					language: "bash",
					content: `# Install Sway desktop stack
levitate desktop

# Or install individual packages
levitate install firefox foot waybar`,
				},
			],
		},
		{
			title: "Troubleshooting",
			content: [],
		},
		{
			title: 'Boot fails with "no bootable device"',
			level: 3,
			content: [
				{
					type: "text",
					content:
						"The EFI partition may not be properly configured. Boot from the ISO again and verify:",
				},
				{
					type: "code",
					language: "bash",
					content: `# Check EFI partition is set correctly
fdisk -l /dev/sda | grep EFI

# Reinstall bootloader
mount /dev/sda2 /mnt
mount /dev/sda1 /mnt/boot/efi
arch-chroot /mnt
bootctl install  # or grub-install`,
				},
			],
		},
		{
			title: "Network not working",
			level: 3,
			content: [
				{
					type: "code",
					language: "bash",
					content: `# For systemd variant
systemctl enable --now systemd-networkd
systemctl enable --now systemd-resolved

# Check status
networkctl status`,
				},
			],
		},
	],
}
