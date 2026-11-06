import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"
import { TOOL_HELP } from "../../tool-help"

export const recstrapContent: DocsContent = {
	title: "recstrap",
	meta: {
		product: "levitate",
		scopes: ["install"],
		audience: ["operator", "developer"],
		stability: "stable",
	},
	intro: "Extract the LevitateOS base system to a target directory. Like pacstrap for Arch Linux.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`${code("recstrap")} extracts the LevitateOS EROFS image from the live ISO to a mounted target directory. This is the equivalent of Arch Linux's ${code("pacstrap")} command.`,
				},
				{
					type: "text",
					content: rich`${code("recstrap")} is ${bold("EROFS-only")}. Files that are not ${code(".erofs")} images (including ${code(".squashfs")}) are rejected.`,
				},
				{
					type: "note",
					variant: "warning",
					content: rich`${bold("Default update model:")} A/B immutable (slot updates + rollback). ${bold("Mutable mode")} is an explicit opt-in for daredevils, and is unsafe if you let an LLM author recipes without review.`,
				},
				{
					type: "text",
					content: rich`After running recstrap, you must manually complete the installation: generate ${code("/etc/fstab")}, install a bootloader, set passwords, and configure the system.`,
				},
			],
		},
		{
			title: "Usage",
			content: [
				{
					type: "text",
					content: rich`Options as printed by ${code("recstrap --help")}:`,
				},
				{
					type: "code",
					language: "text",
					content: TOOL_HELP.recstrap,
				},
			],
		},
		{
			title: "Examples",
			content: [
				{
					type: "command",
					language: "bash",
					description: "Extract to mounted root partition",
					command: "recstrap /mnt",
				},
				{
					type: "command",
					language: "bash",
					description: "Use custom EROFS image location",
					command: "recstrap /mnt --rootfs /media/usb/filesystem.erofs",
				},
				{
					type: "command",
					language: "bash",
					description: "Run pre-flight checks only (no extraction)",
					command: "recstrap /mnt --check",
				},
				{
					type: "command",
					language: "bash",
					description: "Force extraction to non-empty directory",
					command: "recstrap /mnt --force",
				},
			],
		},
		{
			title: "Pre-flight Validation",
			content: [
				{
					type: "text",
					content:
						"Before extraction, recstrap validates critical conditions to catch problems early. Use --check to run only validation without extracting.",
				},
				{
					type: "list",
					ordered: true,
					items: [
						"Running as root",
						"fsck.erofs is available",
						"Target directory exists",
						"Target is a directory (not a file)",
						"Target is not a protected system path",
						"Target is writable",
						"Target is a mount point (skipped with --force)",
						"Target is empty (skipped with --force; lost+found ignored)",
						"Sufficient disk space (minimum 2GB)",
						"EROFS image exists",
						"EROFS image is a regular file",
						"Rootfs filename ends with .erofs",
						"EROFS image is readable",
						"EROFS image is not inside the target directory",
						"EROFS superblock magic is valid",
						"Kernel has EROFS support available",
					],
				},
			],
		},
		{
			title: "EROFS Auto-Detection",
			content: [
				{
					type: "text",
					content: "If --rootfs is not specified, recstrap searches these paths in order:",
				},
				{
					type: "list",
					items: [
						rich`${code("/run/live-rootfs.erofs")}`,
						rich`${code("/run/live-media/live/filesystem.erofs")}`,
						rich`${code("/run/initramfs/live/filesystem.erofs")}`,
						rich`${code("/run/archiso/bootmnt/live/filesystem.erofs")}`,
						rich`${code("/mnt/cdrom/live/filesystem.erofs")}`,
						rich`${code("/media/cdrom/live/filesystem.erofs")}`,
					],
				},
			],
		},
		{
			title: "Protected Paths",
			content: [
				{
					type: "text",
					content: rich`The tool refuses host system directories as a target. The list is ${code("PROTECTED_PATHS")} in ${code("distro-spec/src/shared/paths.rs")}.`,
				},
			],
		},
		{
			title: "Error Codes",
			content: [
				{
					type: "text",
					content: rich`Every failure prints a code such as ${code("E004")}; the number is also the exit status. The codes and their meaning are the ${code("Code")} enum in ${code("tools/recstrap/src/error.rs")}.`,
				},
			],
		},
		{
			title: "Post-Extraction",
			content: [
				{
					type: "text",
					content: "After recstrap completes, continue with the installation:",
				},
				{
					type: "code",
					language: "bash",
					content: `# Generate fstab
recfstab /mnt >> /mnt/etc/fstab

# Copy pre-built UKIs from live media
mkdir -p /mnt/boot/EFI/Linux
cp /run/live-media/boot/uki/levitateos-system-a.efi /mnt/boot/EFI/Linux/
cp /run/live-media/boot/uki/levitateos-system-b.efi /mnt/boot/EFI/Linux/

# Enter chroot
recchroot /mnt

# Optional: apply user setup script generated by recstrap
bash /root/setup-initial-user.sh

# Or set root password directly (root is locked by default)
passwd root

# Install bootloader (auto-discovers UKI)
bootctl install

# Exit and reboot
exit
reboot`,
				},
			],
		},
		{
			title: "Comparison with pacstrap",
			content: [
				{
					type: "table",
					headers: ["Feature", "recstrap", "pacstrap"],
					rows: [
						["Source", "EROFS image", "Package repository"],
						["Speed", "Fast (extract only)", "Slower (download + install)"],
						["Package selection", "Full base system", "Selectable packages"],
						["Offline capable", "Yes (from live ISO)", "No (needs network)"],
					],
				},
			],
		},
		{
			title: "See Also",
			content: [
				{
					type: "list",
					items: [
						rich`${link("recfstab", "/docs/recfstab")} - Generate fstab entries`,
						rich`${link("recchroot", "/docs/recchroot")} - Enter chroot environment`,
						rich`${link("Installation Tools Overview", "/docs/installation-tools-overview")} - Workflow overview`,
					],
				},
			],
		},
	],
}
