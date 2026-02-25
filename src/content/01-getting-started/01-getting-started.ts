import type { DocsContent } from "../../types"
import { rich, bold, link } from "../../rich-text"

export const gettingStartedContent: DocsContent = {
	title: "Getting Started",
	meta: { product: "levitate", scopes: ["install"], audience: ["beginner"], stability: "stable" },
	intro: "Download a LevitateOS variant and create bootable installation media (desktop variants).",
	sections: [
		{
			title: "Requirements",
			content: [
				{
					type: "list",
					items: [
						rich`${bold("CPU:")} x86_64, Intel Haswell (2013) or AMD Zen (2017) or newer`,
						rich`${bold("RAM:")} 16GB minimum, 32GB+ recommended for local LLM inference`,
						rich`${bold("Storage:")} 512GB NVMe SSD minimum (1TB+ recommended for AI models)`,
						rich`${bold("GPU:")} NVIDIA RTX 3060+ (12GB VRAM) for LLM acceleration, or CPU-only with 32GB+ RAM`,
						rich`${bold("Boot:")} UEFI required (Secure Boot must be disabled)`,
					],
				},
				{
					type: "note",
					variant: "warning",
					content: rich`${bold("Default update model:")} A/B immutable (slot updates + rollback). ${bold("Mutable mode")} is an explicit opt-in for daredevils, and is unsafe if you let an LLM author recipes without review. See ${link("Atomic Updates (A/B)", "/docs/atomic-updates")}.`,
				},
			],
		},
		{
			title: "Download",
			content: [
				{
					type: "text",
					content: rich`Download the variant you want from ${link("Download", "/download")}. Desktop variants ship as live ISOs; appliance variants ship as disk images.`,
				},
				{ type: "text", content: "Example: download the LevitateOS ISO and verify the checksum:" },
				{
					type: "code",
					language: "bash",
					content: `curl -LO https://releases.levitateos.org/latest/LevitateOS.iso
curl -LO https://releases.levitateos.org/latest/SHA256SUMS
sha256sum -c SHA256SUMS`,
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
sudo dd if=LevitateOS.iso of=/dev/sdX bs=4M status=progress oflag=sync`,
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
					content: `# Create a 256GB virtual disk
qemu-img create -f qcow2 disk.qcow2 256G

# Boot the installer
qemu-system-x86_64 \\
  -m 8G \\
  -smp 4 \\
  -enable-kvm \\
  -cpu host \\
  -bios /usr/share/ovmf/OVMF.fd \\
  -cdrom LevitateOS.iso \\
  -drive file=disk.qcow2,format=qcow2,if=virtio \\
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
