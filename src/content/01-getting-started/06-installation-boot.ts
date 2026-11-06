import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"

export const installationBootContent: DocsContent = {
	title: "Bootloader & Finish",
	meta: { product: "levitate", scopes: ["install"], audience: ["beginner"], stability: "stable" },
	intro: rich`Installation steps 15-18: Install the slot A kernel, install bootloader, enable services, and reboot. See ${link("Installation", "/docs/installation")} for an overview.`,
	sections: [
		{
			title: "15. Install the Kernel for Slot A",
			content: [
				{
					type: "text",
					content:
						"LevitateOS boots with systemd-boot. Each slot keeps its own kernel in its own directory on the EFI partition, so an update to one slot never replaces the kernel the other slot boots. The installer fills slot A; slot B gets its kernel when you first update with recab.",
				},
				{
					type: "note",
					variant: "warning",
					content: rich`${bold("Default update model:")} A/B (slot updates + rollback). ${bold("Mutable mode")} is an explicit opt-in for daredevils, and is unsafe if you let an LLM author recipes without review.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Copy the kernel and initramfs into slot A's directory",
					command: [
						"mkdir -p /boot/levitate-a",
						"cp /run/live-media/boot/vmlinuz /run/live-media/boot/initramfs.img /boot/levitate-a/",
					],
				},
			],
		},
		{
			title: "16. Install Bootloader",
			content: [
				{
					type: "text",
					content: rich`Install systemd-boot and write an entry for each slot. The entry's ${code("root=")} names the slot's partition by PARTUUID; ${code("recab")} reads these entries to know which partition is which slot. Replace ${code("/dev/sda2")} and ${code("/dev/sda3")} with your slot A and slot B partitions.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Install systemd-boot to EFI partition",
					command: "bootctl install",
				},
				{
					type: "command",
					language: "bash",
					description: "Create slot A + slot B boot entries",
					command: [
						"mkdir -p /boot/loader/entries",
						`cat > /boot/loader/entries/levitate-a.conf << EOF
title   LevitateOS (Slot A)
linux   /levitate-a/vmlinuz
initrd  /levitate-a/initramfs.img
options root=PARTUUID=$(blkid -s PARTUUID -o value /dev/sda2) ro rootwait
EOF`,
						`cat > /boot/loader/entries/levitate-b.conf << EOF
title   LevitateOS (Slot B)
linux   /levitate-b/vmlinuz
initrd  /levitate-b/initramfs.img
options root=PARTUUID=$(blkid -s PARTUUID -o value /dev/sda3) ro rootwait
EOF`,
					],
				},
				{
					type: "command",
					language: "bash",
					description: "Configure bootloader defaults",
					command: `cat > /boot/loader/loader.conf << 'EOF'
default levitate-a.conf
timeout 3
editor no
EOF`,
				},
			],
		},
		{
			title: "17. Enable Services",
			content: [
				{
					type: "command",
					language: "bash",
					description: "Initialize machine ID (required by systemd)",
					command: "systemd-machine-id-setup",
				},
				{
					type: "command",
					language: "bash",
					description: "Enable networking",
					command: "systemctl enable NetworkManager",
				},
			],
		},
		{
			title: "18. Exit and Reboot",
			content: [
				{
					type: "command",
					language: "bash",
					description: "Exit chroot",
					command: "exit",
				},
				{
					type: "command",
					language: "bash",
					description: "Unmount all partitions",
					command: "umount -R /mnt",
				},
				{
					type: "command",
					language: "bash",
					description: "Reboot",
					command: "reboot",
				},
				{
					type: "text",
					content: "Remove the installation media when prompted.",
				},
				{
					type: "text",
					content: rich`Continue to ${link("Post-Installation", "/docs/post-installation")} for next steps. If you encounter issues, see ${link("Troubleshooting", "/docs/troubleshooting")}.`,
				},
			],
		},
	],
}
