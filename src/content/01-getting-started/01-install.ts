import type { DocsContent } from "../../types"

export const installContent: DocsContent = {
	title: "Installation Guide",
	sections: [
		{
			title: "Requirements",
			content: [
				{
					type: "list",
					items: [
						"**Architecture:** x86_64",
						"**Disk:** 20GB minimum",
						"**Boot:** UEFI recommended",
					],
				},
			],
		},
		{
			title: "AI Installer (SmolLM3-3B)",
			level: 3,
			content: [
				{ type: "text", content: "The LLM requires GPU acceleration or sufficient RAM:" },
				{
					type: "table",
					headers: ["Hardware", "VRAM/RAM", "Notes"],
					rows: [
						["NVIDIA GPU", "6GB+ VRAM", "CUDA, best compatibility"],
						["NVIDIA GPU (4-bit)", "2GB+ VRAM", "With bitsandbytes quantization"],
						["AMD GPU", "6GB+ VRAM", "ROCm 5.6+, RX 6000/7000 series"],
						["Intel Arc", "6GB+ VRAM", "Via IPEX-LLM"],
						["Apple Silicon", "8GB+ unified", "Metal/MPS acceleration"],
						["CPU only", "8GB+ RAM", "Slow, fallback option"],
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
					content: "Use [Rufus](https://rufus.ie) with DD image mode.",
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
			title: "Using the AI Installer",
			content: [
				{
					type: "text",
					content:
						"LevitateOS features a natural language installer powered by SmolLM3-3B running locally. Run `levitate-installer` and type what you want in plain English.",
				},
			],
		},
		{
			title: "Example Conversation",
			level: 3,
			content: [
				{
					type: "conversation",
					messages: [
						{ role: "user", text: "install to the 500gb nvme drive" },
						{
							role: "ai",
							text: "I found /dev/nvme0n1 (500GB). I'll create a GPT partition table with:",
							list: ["512MB EFI partition", "Rest as ext4 root"],
						},
						{ role: "ai", text: "Proceed?" },
						{ role: "user", text: "yes, and create user vince with sudo" },
						{
							role: "ai",
							text: "Partitioning... Formatting... Installing base system... Creating user vince with sudo privileges... Done!",
						},
					],
				},
			],
		},
		{
			title: "Slash Commands",
			level: 3,
			content: [
				{ type: "text", content: "For advanced control, use slash commands:" },
				{
					type: "table",
					headers: ["Command", "Description"],
					rows: [
						["/disks", "List available disks"],
						["/partition <disk>", "Create partitions on disk"],
						["/user <name>", "Create user account"],
						["/install", "Begin installation"],
						["/help", "Show all commands"],
					],
					monospaceCol: 0,
				},
			],
		},
		{
			title: "Post-Installation",
			content: [],
		},
		{
			title: "Install Packages",
			level: 3,
			content: [
				{
					type: "text",
					content: "After booting into your new system, use `recipe` to install packages:",
				},
				{
					type: "code",
					language: "bash",
					content: `# List available packages
recipe list

# Install a package
recipe install firefox

# View package info
recipe info ripgrep`,
				},
			],
		},
	],
}
