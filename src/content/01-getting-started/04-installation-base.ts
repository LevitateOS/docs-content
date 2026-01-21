import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"

export const installationBaseContent: DocsContent = {
	title: "Base System",
	intro: rich`Installation steps 6-9: Mount installation media, extract the base tarball, and enter the new system. See ${link("Installation", "/docs/installation")} for an overview.`,
	sections: [
		{
			title: "6. Mount Installation Media",
			content: [
				{
					type: "command",
					description: "Create mount point and mount the ISO",
					command: [
						"mkdir -p /media/cdrom",
						"mount /dev/sr0 /media/cdrom",
					],
				},
				{
					type: "command",
					description: "Verify the base tarball is accessible",
					command: "ls -la /media/cdrom/levitateos-base.tar.xz",
				},
			],
		},
		{
			title: "7. Extract Base System",
			content: [
				{
					type: "command",
					description: "Extract to the mounted root (preserves permissions)",
					command: "tar xpf /media/cdrom/levitateos-base.tar.xz -C /mnt",
				},
				{
					type: "text",
					content: rich`This extracts the complete base system: kernel, systemd, coreutils, networking, and the ${code("recipe")} package manager.`,
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
					content: rich`Continue to ${link("Configuration", "/docs/installation-config")} (steps 9-13).`,
				},
			],
		},
	],
}
