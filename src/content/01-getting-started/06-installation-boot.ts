import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"

export const installationBootContent: DocsContent = {
	title: "Bootloader & Finish",
	meta: { product: "levitate", scopes: ["install"], audience: ["beginner"], stability: "stable" },
	intro: rich`Installation steps 15-18: Install the bootloader, set up the A/B boot layout, enable services, and reboot. See ${link("Installation", "/docs/installation")} for an overview.`,
	sections: [
		{
			title: "15. Install Bootloader",
			content: [
				{
					type: "text",
					content:
						"LevitateOS boots with systemd-boot. Install it to the EFI partition mounted at /boot:",
				},
				{
					type: "note",
					variant: "warning",
					content: rich`${bold("Default update model:")} A/B (slot updates + rollback). ${bold("Mutable mode")} is an explicit opt-in for daredevils, and is unsafe if you let an LLM author recipes without review.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Install systemd-boot to EFI partition",
					command: "bootctl install",
				},
			],
		},
		{
			title: "16. Set Up the A/B Boot Layout",
			content: [
				{
					type: "text",
					content: rich`${code("recab init")} writes a boot entry for each slot (each names its partition by PARTUUID, which is how ${code("recab")} tells the slots apart), copies the kernel into slot A's own directory on the EFI partition, makes slot A the default, records it as known-good, and enables ${code("recab-trial.service")}, which commits a healthy update and reboots out of a failed one. Slot B gets its kernel when you first update. Replace ${code("/dev/sda2")} and ${code("/dev/sda3")} with your slot A and slot B partitions.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Write the slot entries, slot A's kernel and recab's state",
					command:
						"recab init --root / --slot-a /dev/sda2 --slot-b /dev/sda3 --kernel /run/live-media/boot/vmlinuz --initrd /run/live-media/boot/initramfs.img",
				},
				{
					type: "text",
					content: rich`Add kernel options both slots should boot with, such as a serial console, with ${code("--options \"console=ttyS0,115200n8\"")}.`,
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
