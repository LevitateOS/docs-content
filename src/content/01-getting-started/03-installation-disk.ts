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
					type: "note",
					variant: "info",
					content: rich`${bold("Secure Boot:")} If your system won't boot, disable Secure Boot in your UEFI firmware settings. LevitateOS does not currently ship with signed bootloaders.`,
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
			title: "WiFi Connection (Optional)",
			content: [
				{
					type: "text",
					content: "Installation is fully offline - no network required. Skip this if using Ethernet or don't need network access.",
				},
				{
					type: "command",
					description: "List wireless interfaces",
					command: "iwctl device list",
				},
				{
					type: "command",
					description: "Scan and connect (replace wlan0 and YOUR_NETWORK)",
					command: "iwctl station wlan0 connect YOUR_NETWORK",
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
					output: `NAME      SIZE MODEL                     TRAN
nvme0n1     2T Samsung 990 PRO 2TB      nvme
nvme1n1     1T WD Black SN850X 1TB      nvme
sda       4.0T Seagate Barracuda        sata`,
				},
				{
					type: "text",
					content: rich`This guide uses ${code("/dev/sda")} as an example. ${bold("Replace with your actual device.")} Most modern systems use NVMe (${code("/dev/nvme0n1")}) - partitions are named ${code("nvme0n1p1")}, ${code("nvme0n1p2")}, etc.`,
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
					type: "note",
					variant: "warning",
					content: rich`${bold("Dual-boot:")} If keeping Windows, do NOT create a new EFI partition. Use your existing EFI partition (usually the first partition on your Windows disk). Only create the root partition for LevitateOS.`,
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
					type: "command",
					description: "Start fdisk",
					command: "fdisk /dev/sda",
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
					type: "command",
					description: "Format EFI partition",
					command: "mkfs.fat -F32 -n EFI /dev/sda1",
				},
				{
					type: "command",
					description: "Format root partition",
					command: "mkfs.ext4 -L root /dev/sda2",
				},
			],
		},
		{
			title: "5. Mount Filesystems",
			content: [
				{
					type: "command",
					description: "Mount root partition",
					command: "mount /dev/sda2 /mnt",
				},
				{
					type: "command",
					description: "Create mount point and mount EFI",
					command: ["mkdir -p /mnt/boot", "mount /dev/sda1 /mnt/boot"],
				},
				{
					type: "text",
					content: rich`Continue to ${link("Base System", "/docs/installation-base")} (steps 6-9).`,
				},
			],
		},
	],
}
