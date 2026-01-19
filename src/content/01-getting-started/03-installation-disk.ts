import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"

export const installationDiskContent: DocsContent = {
	title: "Disk Preparation",
	intro: rich`Installation steps 1-5: Boot the live environment and prepare your disk. See ${link("Installation", "/docs/installation")} for an overview.`,
	sections: [
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
				{
					type: "text",
					content: rich`Continue to ${link("Base System", "/docs/installation-base")} (steps 6-8).`,
				},
			],
		},
	],
}
