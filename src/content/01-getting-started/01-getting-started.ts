import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"

export const gettingStartedContent: DocsContent = {
	title: "Getting Started",
	meta: { product: "levitate", scopes: ["install"], audience: ["beginner"], stability: "stable" },
	intro: "Download the LevitateOS live ISO and create bootable installation media.",
	sections: [
		{
			title: "Requirements",
			content: [
				{
					type: "list",
					items: [
						rich`${bold("CPU:")} x86-64-v3 (Intel Haswell or newer, AMD Zen or newer)`,
						rich`${bold("RAM:")} 16 GB`,
						rich`${bold("Storage:")} an NVMe disk. The default A/B layout uses 1 GB for EFI and 20 GB for each system slot, and gives the rest to ${code("/var")}`,
						rich`${bold("Boot:")} UEFI. LevitateOS's boot files are unsigned, so Secure Boot must be disabled`,
					],
				},
				{
					type: "note",
					variant: "info",
					content: rich`${bold("A/B by default:")} the system lives in two root slots. An update is written to the inactive slot, trial-booted once, and kept only if that boot is healthy; you can roll back to the previous slot. ${bold("Mutable mode")}, one root changed in place, is an explicit opt-in without that safety net. See ${link("Atomic Updates (A/B)", "/docs/atomic-updates")}.`,
				},
			],
		},
		{
			title: "Download",
			content: [
				{
					type: "text",
					content: rich`Download the variant you want from ${link("Download", "/download")}. LevitateOS and AcornOS each ship as an x86_64 live ISO that boots into the install environment.`,
				},
				{ type: "text", content: "Example: download the LevitateOS ISO and verify its checksum:" },
				{
					type: "code",
					language: "bash",
					content: `curl -LO https://releases.levitateos.org/latest/levitateos-x86_64.iso
curl -LO https://releases.levitateos.org/latest/levitateos-x86_64.iso.sha512
sha512sum -c levitateos-x86_64.iso.sha512`,
				},
			],
		},
		{
			title: "Creating Bootable Media",
			content: [],
		},
		{
			title: "USB Drive (Linux/macOS)",
			level: 3,
			content: [
				{
					type: "code",
					language: "bash",
					content: `# Find your USB device (usually /dev/sdX or /dev/diskX)
lsblk  # Linux
diskutil list  # macOS

# Write the ISO (CAUTION: this erases the drive)
sudo dd if=levitateos-x86_64.iso of=/dev/sdX bs=4M status=progress oflag=sync`,
				},
			],
		},
		{
			title: "USB Drive (Windows)",
			level: 3,
			content: [
				{
					type: "text",
					content: rich`Use ${link("Rufus", "https://rufus.ie")} with DD image mode.`,
				},
			],
		},
		{
			title: "Virtual Machine (QEMU)",
			level: 3,
			content: [
				{
					type: "code",
					language: "bash",
					content: `# Create a 64GB virtual disk
qemu-img create -f qcow2 disk.qcow2 64G

# Boot the installer (the OVMF firmware path varies by distribution)
qemu-system-x86_64 \\
  -m 16G \\
  -smp 4 \\
  -enable-kvm \\
  -cpu host \\
  -bios /usr/share/ovmf/OVMF.fd \\
  -cdrom levitateos-x86_64.iso \\
  -drive file=disk.qcow2,format=qcow2,if=none,id=disk0 \\
  -device nvme,drive=disk0,serial=levitate \\
  -boot d`,
				},
			],
		},
		{
			title: "Next Steps",
			content: [
				{
					type: "text",
					content: rich`Boot from the ISO to enter the live environment, then follow the ${link("Installation Guide", "/docs/installation")} to install LevitateOS.`,
				},
			],
		},
	],
}
