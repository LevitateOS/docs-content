import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"

export const installationBaseContent: DocsContent = {
	title: "Base System",
	meta: { product: "levitate", scopes: ["install"], audience: ["beginner"], stability: "stable" },
	intro: rich`Installation steps 6-9: Verify media, extract the system, generate fstab, and enter chroot. See ${link("Installation", "/docs/installation")} for an overview.`,
	sections: [
		{
			title: "6. Verify Installation Media",
			content: [
				{
					type: "text",
					content:
						"The live media is already mounted. Verify the canonical EROFS payload path is accessible:",
				},
				{
					type: "command",
					language: "bash",
					description: "Check for EROFS image",
					command: "ls -la /run/live-rootfs.erofs",
				},
			],
		},
		{
			title: "7. Extract Base System",
			content: [
				{
					type: "text",
					content: rich`Use ${code("recstrap")} to extract the EROFS image to your mounted root:`,
				},
				{
					type: "command",
					language: "bash",
					description: "Extract system to /mnt",
					command: "recstrap /mnt",
				},
				{
					type: "text",
					content: rich`This extracts the complete system: kernel, systemd, coreutils, networking, and the ${code("recipe")} package manager.`,
				},
				{
					type: "note",
					variant: "warning",
					content: rich`${bold("Default update model:")} A/B immutable (slot updates + rollback). ${bold("Mutable mode")} is an explicit opt-in for daredevils, and is unsafe if you let an LLM author recipes without review. See ${link("Atomic Updates (A/B)", "/docs/atomic-updates")}.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Verify extraction succeeded",
					command: "ls /mnt/bin /mnt/usr /mnt/etc",
				},
			],
		},
		{
			title: "8. Generate fstab",
			content: [
				{
					type: "text",
					content: rich`Use ${code("recfstab")} (like Arch's ${code("genfstab")}) to automatically detect mounted filesystems and generate fstab entries:`,
				},
				{
					type: "command",
					language: "bash",
					description: "Generate fstab from current mounts",
					command: "recfstab /mnt >> /mnt/etc/fstab",
				},
				{
					type: "command",
					language: "bash",
					description: "Verify the generated fstab",
					command: "cat /mnt/etc/fstab",
				},
				{
					type: "text",
					content: rich`You should see entries for ${code("/")} (ext4) and ${code("/boot")} (vfat) with UUIDs.`,
				},
				{
					type: "text",
					content: rich`With the default A/B layout, you should also see an entry for ${code("/var")} (ext4). Persistent state (including ${code("/var/home")}) lives there.`,
				},
			],
		},
		{
			title: "9. Enter the New System",
			content: [
				{
					type: "text",
					content: rich`Use ${code("recchroot")} (like Arch's ${code("arch-chroot")}) to enter the new system. It automatically sets up bind mounts for ${code("/dev")}, ${code("/proc")}, ${code("/sys")}, ${code("/run")}, and EFI variables:`,
				},
				{
					type: "command",
					language: "bash",
					description: "Enter the installed system",
					command: "recchroot /mnt",
				},
				{
					type: "text",
					content: rich`You are now inside the new system. Continue to ${link("Configuration", "/docs/installation-config")} (steps 10-14).`,
				},
			],
		},
	],
}
