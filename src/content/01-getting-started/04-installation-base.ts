import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"

export const installationBaseContent: DocsContent = {
	title: "Base System",
	intro: rich`Installation steps 6-8: Extract the stage3 tarball and enter the new system. See ${link("Installation", "/docs/installation")} for an overview.`,
	sections: [
		{
			title: "6. Extract Stage3",
			content: [
				{
					type: "text",
					content: "Extract the stage3 tarball to install the base system:",
				},
				{
					type: "command",
					description: "Find the stage3 tarball on the ISO",
					command: "ls /run/media/*/levitateos-stage3.tar.xz",
				},
				{
					type: "command",
					description: "Extract to the mounted root (preserves permissions)",
					command: "tar xpf /run/media/*/levitateos-stage3.tar.xz -C /mnt",
				},
				{
					type: "text",
					content: rich`This extracts the complete base system: kernel, systemd, coreutils, networking, and the ${code("recipe")} package manager.`,
				},
			],
		},
		{
			title: "7. Generate fstab",
			content: [
				{
					type: "command",
					description: "Get the UUIDs for your partitions",
					command: "blkid /dev/sda1 /dev/sda2",
				},
				{
					type: "command",
					description: "Create the fstab file",
					command: "nano /mnt/etc/fstab",
				},
				{
					type: "text",
					content: rich`Add the following, replacing UUIDs with your values from ${code("blkid")}:`,
				},
				{
					type: "code",
					filename: "/etc/fstab",
					content: `# <device>                <mount>  <type>  <options>  <dump>  <fsck>
UUID=your-root-uuid-here  /        ext4    defaults   0       1
UUID=your-efi-uuid-here   /boot    vfat    defaults   0       2`,
				},
			],
		},
		{
			title: "8. Enter the New System",
			content: [
				{
					type: "command",
					description: "Bind mount system directories",
					command: [
						"mount --bind /dev /mnt/dev",
						"mount --bind /dev/pts /mnt/dev/pts",
						"mount --bind /proc /mnt/proc",
						"mount --bind /sys /mnt/sys",
						"mount --bind /sys/firmware/efi/efivars /mnt/sys/firmware/efi/efivars",
						"mount --bind /run /mnt/run",
					],
				},
				{
					type: "command",
					description: "Enter chroot",
					command: "chroot /mnt /bin/bash",
				},
				{
					type: "text",
					content: rich`Continue to ${link("Configuration", "/docs/installation-config")} (steps 9-13).`,
				},
			],
		},
	],
}
