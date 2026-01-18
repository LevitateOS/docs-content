import type { DocsContent } from "../types"

export const manualInstallContent: DocsContent = {
	title: "Manual Installation Guide",
	intro: "This guide walks through installing LevitateOS by hand. Use this if you prefer full control or are installing without the AI assistant.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content:
						"Installing LevitateOS manually follows the same process as other Linux distributions like Arch or Gentoo. You'll boot from a live environment, prepare your disk, install the base system, and configure it before rebooting into your new installation.",
				},
			],
		},
		{
			title: "What You'll Do",
			content: [
				{
					type: "list",
					items: [
						"**Prepare** - Boot the live ISO, connect to the internet",
						"**Partition** - Create EFI and root partitions on your disk",
						"**Install** - Run `recipe bootstrap` to install the base system",
						"**Configure** - Set timezone, locale, hostname, users, and bootloader",
						"**Reboot** - Boot into your new LevitateOS installation",
					],
				},
			],
		},
		{
			title: "Time Required",
			content: [
				{
					type: "text",
					content:
						"A typical installation takes 15-30 minutes depending on your hardware and familiarity with the process.",
				},
			],
		},
		{
			title: "Prerequisites",
			content: [
				{
					type: "list",
					items: [
						"**Architecture:** x86_64",
						"**Disk:** 8GB minimum (20GB recommended)",
						"**RAM:** 512MB minimum (2GB recommended)",
						"**Boot mode:** UEFI (this guide assumes UEFI)",
					],
				},
			],
		},
		{
			title: "1. Boot the Live Environment",
			content: [
				{
					type: "text",
					content:
						"Boot from the LevitateOS ISO. You'll be dropped into a root shell with the `recipe` package manager available.",
				},
				{
					type: "code",
					language: "bash",
					content: `# Verify you booted in UEFI mode
ls /sys/firmware/efi/efivars

# Set keyboard layout (optional, default is US)
loadkeys us

# Sync system clock
timedatectl set-ntp true`,
				},
				{
					type: "text",
					content:
						"If `/sys/firmware/efi/efivars` doesn't exist, you're in BIOS mode. Reboot and select UEFI boot in your firmware settings.",
				},
			],
		},
		{
			title: "2. Connect to the Internet",
			content: [
				{
					type: "text",
					content: "Wired connections should work automatically. For WiFi:",
				},
				{
					type: "code",
					language: "bash",
					content: `# List available networks
nmcli device wifi list

# Connect to WiFi
nmcli device wifi connect "YourNetwork" password "YourPassword"

# Verify connectivity
ping -c 3 levitateos.org`,
				},
			],
		},
		{
			title: "3. Identify Target Disk",
			content: [
				{
					type: "text",
					content: "List all disks and identify your installation target:",
				},
				{
					type: "code",
					language: "bash",
					content: `lsblk -d -o NAME,SIZE,MODEL,TRAN

# Example output:
# NAME      SIZE MODEL                   TRAN
# sda       500G Samsung SSD 860         sata
# nvme0n1     1T WD Black SN850X         nvme`,
				},
				{
					type: "text",
					content:
						"This guide uses `/dev/sda`. **Replace with your actual device** (e.g., `/dev/nvme0n1` for NVMe).",
				},
			],
		},
		{
			title: "4. Partition the Disk",
			content: [
				{
					type: "text",
					content:
						"**WARNING: This will erase all data on the disk.** Create a 512MB EFI partition and use the rest for root:",
				},
				{
					type: "code",
					language: "bash",
					content: `# Wipe existing partition table (DESTROYS ALL DATA)
wipefs -a /dev/sda

# Create GPT partition table and partitions
parted /dev/sda --script \\
  mklabel gpt \\
  mkpart "EFI" fat32 1MiB 513MiB \\
  set 1 esp on \\
  mkpart "root" ext4 513MiB 100%

# Verify
lsblk /dev/sda`,
				},
				{
					type: "text",
					content: "For NVMe drives, partitions are named `/dev/nvme0n1p1`, `/dev/nvme0n1p2`, etc.",
				},
			],
		},
		{
			title: "5. Format Partitions",
			content: [
				{
					type: "code",
					language: "bash",
					content: `# Format EFI partition
mkfs.fat -F32 -n EFI /dev/sda1

# Format root partition
mkfs.ext4 -L root /dev/sda2`,
				},
			],
		},
		{
			title: "6. Mount Filesystems",
			content: [
				{
					type: "code",
					language: "bash",
					content: `# Mount root partition
mount /dev/sda2 /mnt

# Create mount point and mount EFI
mkdir -p /mnt/boot
mount /dev/sda1 /mnt/boot`,
				},
			],
		},
		{
			title: "7. Install Base System",
			content: [
				{
					type: "text",
					content: "Install the base system using `recipe bootstrap`. This is similar to Arch's `pacstrap`:",
				},
				{
					type: "code",
					language: "bash",
					content: `recipe bootstrap /mnt`,
				},
				{
					type: "text",
					content: "This installs the base system: kernel, systemd, coreutils, networking, and the `recipe` package manager itself.",
				},
			],
		},
		{
			title: "8. Generate fstab",
			content: [
				{
					type: "text",
					content: "First, get the UUIDs for your partitions:",
				},
				{
					type: "code",
					language: "bash",
					content: `# Display partition UUIDs
blkid /dev/sda1 /dev/sda2`,
				},
				{
					type: "text",
					content: "Create the fstab file (use nano or vim):",
				},
				{
					type: "code",
					language: "bash",
					content: `nano /mnt/etc/fstab`,
				},
				{
					type: "text",
					content: "Add the following content, replacing the UUIDs with your actual values from `blkid`:",
				},
				{
					type: "file",
					filename: "/etc/fstab",
					content: `# <device>                <mount>  <type>  <options>  <dump>  <fsck>
UUID=your-root-uuid-here  /        ext4    defaults   0       1
UUID=your-efi-uuid-here   /boot    vfat    defaults   0       2`,
				},
			],
		},
		{
			title: "9. Enter the New System",
			content: [
				{
					type: "code",
					language: "bash",
					content: `# Bind mount system directories
mount --bind /dev /mnt/dev
mount --bind /dev/pts /mnt/dev/pts
mount --bind /proc /mnt/proc
mount --bind /sys /mnt/sys
mount --bind /sys/firmware/efi/efivars /mnt/sys/firmware/efi/efivars
mount --bind /run /mnt/run

# Enter chroot
chroot /mnt /bin/bash`,
				},
			],
		},
		{
			title: "10. Set Timezone",
			content: [
				{
					type: "code",
					language: "bash",
					content: `# List timezones
ls /usr/share/zoneinfo/

# Set your timezone (example: US Eastern)
ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

# Sync hardware clock
hwclock --systohc`,
				},
			],
		},
		{
			title: "11. Set Locale",
			content: [
				{
					type: "code",
					language: "bash",
					content: `# Set system locale
echo "LANG=en_US.UTF-8" > /etc/locale.conf`,
				},
			],
		},
		{
			title: "12. Set Hostname",
			content: [
				{
					type: "text",
					content: "Set your hostname (replace `myhostname` with your preferred name):",
				},
				{
					type: "code",
					language: "bash",
					content: `echo "myhostname" > /etc/hostname`,
				},
				{
					type: "text",
					content: "Edit the hosts file:",
				},
				{
					type: "code",
					language: "bash",
					content: `nano /etc/hosts`,
				},
				{
					type: "text",
					content: "Add the following (use the same hostname you chose above):",
				},
				{
					type: "file",
					filename: "/etc/hosts",
					content: `127.0.0.1   localhost
::1         localhost
127.0.1.1   myhostname.localdomain myhostname`,
				},
			],
		},
		{
			title: "13. Set Root Password",
			content: [
				{
					type: "code",
					language: "bash",
					content: `passwd`,
				},
			],
		},
		{
			title: "14. Create User Account",
			content: [
				{
					type: "text",
					content: "Create your user (replace `yourname` with your username):",
				},
				{
					type: "code",
					language: "bash",
					content: `useradd -m -G wheel -s /bin/bash yourname
passwd yourname`,
				},
				{
					type: "text",
					content: "Enable sudo for the wheel group:",
				},
				{
					type: "code",
					language: "bash",
					content: `nano /etc/sudoers.d/wheel`,
				},
				{
					type: "text",
					content: "Add this single line:",
				},
				{
					type: "file",
					filename: "/etc/sudoers.d/wheel",
					content: `%wheel ALL=(ALL:ALL) ALL`,
				},
				{
					type: "text",
					content: "Save and set correct permissions:",
				},
				{
					type: "code",
					language: "bash",
					content: `chmod 0440 /etc/sudoers.d/wheel`,
				},
			],
		},
		{
			title: "15. Install Bootloader",
			content: [
				{
					type: "text",
					content: "Install systemd-boot and check kernel files:",
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
					type: "text",
					content: "Add:",
				},
				{
					type: "file",
					filename: "/boot/loader/loader.conf",
					content: `default levitate.conf
timeout 3
editor no`,
				},
				{
					type: "text",
					content: "Get your root partition UUID:",
				},
				{
					type: "code",
					language: "bash",
					content: `blkid /dev/sda2`,
				},
				{
					type: "text",
					content: "Create the boot entry:",
				},
				{
					type: "code",
					language: "bash",
					content: `nano /boot/loader/entries/levitate.conf`,
				},
				{
					type: "text",
					content: "Add the following, replacing the UUID and adjusting kernel filenames if needed:",
				},
				{
					type: "file",
					filename: "/boot/loader/entries/levitate.conf",
					content: `title   LevitateOS
linux   /vmlinuz-linux
initrd  /initramfs-linux.img
options root=UUID=your-root-uuid-here rw quiet`,
				},
			],
		},
		{
			title: "16. Enable Services",
			content: [
				{
					type: "code",
					language: "bash",
					content: `# Enable networking
systemctl enable NetworkManager`,
				},
			],
		},
		{
			title: "17. Exit and Reboot",
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
					content:
						"Log in with your user account and install additional packages:",
				},
				{
					type: "code",
					language: "bash",
					content: `# List available recipes
recipe list

# Install a package
recipe install ripgrep

# View package info
recipe info firefox`,
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
					content:
						"Boot from the ISO again and verify your installation:",
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
mount --bind /proc /mnt/proc
mount --bind /sys /mnt/sys
mount --bind /sys/firmware/efi/efivars /mnt/sys/firmware/efi/efivars
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
