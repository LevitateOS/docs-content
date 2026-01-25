import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"

export const installationBaseContent: DocsContent = {
	title: "Base System",
	intro: rich`Installation steps 6-9: Verify media, extract the system, generate fstab, and enter chroot. See ${link("Installation", "/docs/installation")} for an overview.`,
	sections: [
		{
			title: "6. Verify Installation Media",
			content: [
				{
					type: "text",
					content: "The live ISO is already mounted. Verify the squashfs is accessible:",
				},
				{
					type: "command",
					description: "Check for squashfs image",
					command: "ls -la /media/cdrom/live/filesystem.squashfs",
				},
			],
		},
		{
			title: "7. Extract Base System",
			content: [
				{
					type: "text",
					content: rich`Use ${code("recstrap")} to extract the squashfs to your mounted root:`,
				},
				{
					type: "command",
					description: "Extract system to /mnt",
					command: "recstrap /mnt",
				},
				{
					type: "text",
					content: rich`This extracts the complete system: kernel, systemd, coreutils, networking, and the ${code("recipe")} package manager.`,
				},
				{
					type: "command",
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
					description: "Generate fstab from current mounts",
					command: "recfstab /mnt >> /mnt/etc/fstab",
				},
				{
					type: "command",
					description: "Verify the generated fstab",
					command: "cat /mnt/etc/fstab",
				},
				{
					type: "text",
					content: rich`You should see entries for ${code("/")} (ext4) and ${code("/boot")} (vfat) with UUIDs.`,
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
