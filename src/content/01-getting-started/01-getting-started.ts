import type { DocsContent } from "../../types"
import { rich, bold, link } from "../../rich-text"

export const gettingStartedContent: DocsContent = {
	title: "Getting Started",
	intro: "Download LevitateOS and create bootable installation media.",
	sections: [
		{
			title: "Requirements",
			content: [
				{
					type: "list",
					items: [
						rich`${bold("Architecture:")} x86_64 (Haswell 2013+)`,
						rich`${bold("Disk:")} 64GB SSD minimum (256GB NVMe recommended)`,
						rich`${bold("RAM:")} 8GB minimum (16GB recommended)`,
						rich`${bold("Boot:")} UEFI required`,
					],
				},
			],
		},
		{
			title: "Download",
			content: [
				{ type: "text", content: "Download the latest ISO and verify the checksum:" },
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
					content: `qemu-system-x86_64 \\
  -m 4G \\
  -enable-kvm \\
  -cpu host \\
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
