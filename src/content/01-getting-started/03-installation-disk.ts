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
					type: "command",
					description: "Verify you booted in UEFI mode",
					command: "ls /sys/firmware/efi/efivars",
				},
				{
					type: "text",
					content: rich`If ${code("/sys/firmware/efi/efivars")} doesn't exist, you're in BIOS mode. Reboot and select UEFI boot in your firmware settings.`,
				},
				{
					type: "command",
					description: "Set keyboard layout (optional, default is US)",
					command: "loadkeys us",
				},
				{
					type: "command",
					description: "Sync system clock",
					command: "timedatectl set-ntp true",
				},
			],
		},
		{
			title: "2. Identify Target Disk",
			content: [
				{
					type: "command",
					description: "List all disks and identify your installation target",
					command: "lsblk -d -o NAME,SIZE,MODEL,TRAN",
					output: `NAME      SIZE MODEL                   TRAN
sda       500G Samsung SSD 860         sata
nvme0n1     1T WD Black SN850X         nvme`,
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
					content: rich`${bold("WARNING: This will erase all data on the disk.")} We'll create this layout:`,
				},
				{
					type: "table",
					headers: ["Partition", "Size", "Type", "Mount"],
					rows: [
						["/dev/sda1", "512 MB", "EFI System", "/boot"],
						["/dev/sda2", "Remainder", "Linux filesystem", "/"],
					],
				},
				{
					type: "text",
					content: "Start fdisk:",
				},
				{
					type: "code",
					language: "bash",
					content: `fdisk /dev/sda`,
				},
				{
					type: "text",
					content: "Inside fdisk, enter these commands:",
				},
				{
					type: "interactive",
					steps: [
						{ command: "g", description: "Create new GPT partition table" },
						{ command: "n", description: "New partition (EFI)" },
						{ command: "1", description: "Partition number" },
						{ command: "Enter", description: "Default first sector" },
						{ command: "+512M", description: "Size" },
						{ command: "t", description: "Change partition type" },
						{ command: "1", description: "EFI System" },
						{ command: "n", description: "New partition (root)" },
						{ command: "2", description: "Partition number" },
						{ command: "Enter", description: "Default first sector" },
						{ command: "Enter", description: "Use remaining space" },
						{ command: "w", description: "Write changes and exit" },
					],
				},
				{
					type: "text",
					content: rich`Verify with ${code("lsblk /dev/sda")}. For NVMe drives, partitions are named ${code("/dev/nvme0n1p1")}, ${code("/dev/nvme0n1p2")}, etc.`,
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
