import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"

export const installationBaseContent: DocsContent = {
	title: "Base System",
	intro: rich`Installation steps 6-9: Extract the system and configure fstab. See ${link("Installation", "/docs/installation")} for an overview.`,
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
					type: "command",
					description: "Get the UUIDs for your partitions",
					command: "blkid /dev/sda1 /dev/sda2",
				},
				{
					type: "text",
					content: rich`Create the fstab file, replacing UUIDs with your values from ${code("blkid")}:`,
				},
				{
					type: "command",
					description: "Create the fstab file",
					command: `cat > /mnt/etc/fstab << 'EOF'
# <device>                <mount>  <type>  <options>  <dump>  <fsck>
UUID=your-root-uuid-here  /        ext4    defaults   0       1
UUID=your-efi-uuid-here   /boot    vfat    defaults   0       2
EOF`,
				},
			],
		},
		{
			title: "9. Enter the New System",
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
					content: rich`Continue to ${link("Configuration", "/docs/installation-config")} (steps 10-14).`,
				},
			],
		},
	],
}
