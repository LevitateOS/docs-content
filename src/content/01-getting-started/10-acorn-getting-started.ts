import type { DocsContent } from "../../types"
import { rich, link } from "../../rich-text"

export const acornGettingStartedContent: DocsContent = {
	title: "AcornOS Getting Started",
	meta: { product: "acorn", scopes: ["install"], audience: ["beginner"], stability: "stable" },
	intro: "Download the AcornOS live ISO and create bootable installation media.",
	sections: [
		{
			title: "Download",
			content: [
				{
					type: "text",
					content: rich`Download AcornOS from ${link("Download", "/download")}. It ships as an x86_64 live ISO that boots into the install environment.`,
				},
				{ type: "text", content: "Example: download the AcornOS ISO and verify its checksum:" },
				{
					type: "code",
					language: "bash",
					content: `curl -LO https://releases.levitateos.org/latest/acornos-x86_64.iso
curl -LO https://releases.levitateos.org/latest/acornos-x86_64.iso.sha512
sha512sum -c acornos-x86_64.iso.sha512`,
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
sudo dd if=acornos-x86_64.iso of=/dev/sdX bs=4M status=progress oflag=sync`,
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
  -m 4G \\
  -smp 2 \\
  -enable-kvm \\
  -cpu host \\
  -bios /usr/share/ovmf/OVMF.fd \\
  -cdrom acornos-x86_64.iso \\
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
					content: rich`Boot from the ISO to enter the live environment, then follow ${link("Installing AcornOS", "/docs/acorn-installation")}.`,
				},
			],
		},
	],
}
