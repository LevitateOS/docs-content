import type { DocsContent } from "../../types"
import { rich, bold, link, code } from "../../rich-text"

export const installationContent: DocsContent = {
	title: "Installation",
	intro: "Step-by-step guide to installing LevitateOS from the live environment.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content:
						"Installing LevitateOS follows the same process as Gentoo. You'll boot from a live environment, prepare your disk, extract the stage3 tarball, and configure the system before rebooting. No network connection is required.",
				},
			],
		},
		{
			title: "What You'll Do",
			content: [
				{
					type: "list",
					items: [
						rich`${bold("Boot")} - Boot the live ISO`,
						rich`${bold("Partition")} - Create EFI and root partitions on your disk`,
						rich`${bold("Extract")} - Extract the stage3 tarball to install the base system`,
						rich`${bold("Configure")} - Set timezone, locale, hostname, users, and bootloader`,
						rich`${bold("Reboot")} - Boot into your new LevitateOS installation`,
					],
				},
			],
		},
		{
			title: "1. Boot the Live Environment",
			content: [
				{
					type: "text",
					content: rich`Boot from the LevitateOS ISO (see ${link("Getting Started", "/docs/getting-started")}). You'll be dropped into a root shell.`,
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
					content: rich`If ${code("/sys/firmware/efi/efivars")} doesn't exist, you're in BIOS mode. Reboot and select UEFI boot in your firmware settings.`,
				},
			],
		},
		{
			title: "2. Identify Target Disk",
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
					content: rich`This guide uses ${code("/dev/sda")}. ${bold("Replace with your actual device")} (e.g., ${code("/dev/nvme0n1")} for NVMe).`,
				},
			],
		},
		{
			title: "3. Partition the Disk",
			content: [
				{
					type: "text",
					content: rich`${bold("WARNING: This will erase all data on the disk.")} Create a 512MB EFI partition and use the rest for root:`,
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
					content: rich`For NVMe drives, partitions are named ${code("/dev/nvme0n1p1")}, ${code("/dev/nvme0n1p2")}, etc.`,
				},
			],
		},
		{
			title: "4. Format Partitions",
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
			title: "5. Mount Filesystems",
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
			title: "6. Extract Stage3",
			content: [
				{
					type: "text",
					content: "Extract the stage3 tarball to install the base system:",
				},
				{
					type: "code",
					language: "bash",
					content: `# Find the stage3 tarball on the ISO
ls /run/media/*/levitateos-stage3.tar.xz

# Extract to the mounted root (preserves permissions)
tar xpf /run/media/*/levitateos-stage3.tar.xz -C /mnt`,
				},
				{
					type: "text",
					content: rich`This extracts the complete base system: kernel, systemd, coreutils, networking, and the ${code("recipe")} package manager.`,
				},
			],
		},
		{
			title: "7. Generate fstab",
			content: [
				{
					type: "text",
					content: "Get the UUIDs for your partitions:",
				},
				{
					type: "code",
					language: "bash",
					content: `blkid /dev/sda1 /dev/sda2`,
				},
				{
					type: "text",
					content: "Create the fstab file:",
				},
				{
					type: "code",
					language: "bash",
					content: `nano /mnt/etc/fstab`,
				},
				{
					type: "text",
					content: rich`Add the following, replacing UUIDs with your values from ${code("blkid")}:`,
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
			title: "8. Enter the New System",
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
			title: "9. Set Timezone",
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
			title: "10. Set Locale",
			content: [
				{
					type: "text",
					content: "Enable and generate your locale:",
				},
				{
					type: "code",
					language: "bash",
					content: `# Uncomment en_US.UTF-8 (or your preferred locale)
sed -i 's/#en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen

# Generate locales
locale-gen

# Set system locale
echo "LANG=en_US.UTF-8" > /etc/locale.conf`,
				},
				{
					type: "text",
					content: rich`For other locales, edit ${code("/etc/locale.gen")} and uncomment the lines you need before running ${code("locale-gen")}.`,
				},
			],
		},
		{
			title: "11. Set Hostname",
			content: [
				{
					type: "text",
					content: rich`Set your hostname (replace ${code("myhostname")} with your preferred name):`,
				},
				{
					type: "code",
					language: "bash",
					content: `echo "myhostname" > /etc/hostname`,
				},
				{
					type: "text",
					content: "Create the hosts file:",
				},
				{
					type: "code",
					language: "bash",
					content: `nano /etc/hosts`,
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
			title: "12. Set Root Password",
			content: [
				{
					type: "code",
					language: "bash",
					content: `passwd`,
				},
			],
		},
		{
			title: "13. Create User Account",
			content: [
				{
					type: "text",
					content: rich`Create your user (replace ${code("yourname")} with your username):`,
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
					type: "file",
					filename: "/etc/sudoers.d/wheel",
					content: `%wheel ALL=(ALL:ALL) ALL`,
				},
				{
					type: "code",
					language: "bash",
					content: `chmod 0440 /etc/sudoers.d/wheel`,
				},
			],
		},
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
					type: "file",
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
					type: "file",
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
