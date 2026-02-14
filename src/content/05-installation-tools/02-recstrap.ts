import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"

export const recstrapContent: DocsContent = {
	title: "recstrap",
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
					content: rich`After running recstrap, you must manually complete the installation: generate ${code("/etc/fstab")}, install a bootloader, set passwords, and configure the system.`,
				},
			],
		},
		{
			title: "Usage",
			content: [
				{
					type: "code",
					language: "bash",
					content: "recstrap [OPTIONS] <TARGET>",
				},
				{
					type: "table",
					headers: ["Argument", "Description"],
					rows: [[rich`${code("TARGET")}`, "Target directory (must be mounted, e.g., /mnt)"]],
					monospaceCol: 0,
				},
			],
		},
		{
			title: "Options",
			content: [
				{
					type: "table",
					headers: ["Option", "Description"],
					rows: [
						[
							rich`${code("--erofs <PATH>")}`,
							"Custom EROFS image location (auto-detected from live ISO if not specified)",
						],
						[
							rich`${code("-f, --force")}`,
							"Allow extraction even if target is not empty or not a mount point",
						],
						[rich`${code("-q, --quiet")}`, "Minimal output for scripting"],
						[rich`${code("-c, --check")}`, "Run pre-flight validation only, do not extract"],
						[rich`${code("--version")}`, "Show version"],
						[rich`${code("--help")}`, "Show help"],
					],
					monospaceCol: 0,
				},
			],
		},
		{
			title: "Examples",
			content: [
				{
					type: "command",
					description: "Extract to mounted root partition",
					command: "recstrap /mnt",
				},
				{
					type: "command",
					description: "Use custom EROFS image location",
					command: "recstrap /mnt --erofs /media/usb/filesystem.erofs",
				},
				{
					type: "command",
					description: "Run pre-flight checks only (no extraction)",
					command: "recstrap /mnt --check",
				},
				{
					type: "command",
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
						"Before extraction, recstrap validates 14 conditions to catch problems early. Use --check to run only the validation without extracting.",
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
						"EROFS image is readable",
						"EROFS image is not inside the target directory",
						"Extraction completes successfully",
					],
				},
			],
		},
		{
			title: "EROFS Auto-Detection",
			content: [
				{
					type: "text",
					content: "If --erofs is not specified, recstrap searches these paths in order:",
				},
				{
					type: "list",
					items: [
						rich`${code("/media/cdrom/live/filesystem.erofs")}`,
						rich`${code("/run/initramfs/live/filesystem.erofs")}`,
						rich`${code("/run/archiso/bootmnt/live/filesystem.erofs")}`,
						rich`${code("/mnt/cdrom/live/filesystem.erofs")}`,
					],
				},
			],
		},
		{
			title: "Protected Paths",
			content: [
				{
					type: "text",
					content: rich`These paths are ${bold("always")} blocked as extraction targets, even with ${code("--force")}:`,
				},
				{
					type: "code",
					language: "text",
					content: `/  /bin  /boot  /dev  /etc  /home  /lib  /lib64  /opt\n/proc  /root  /run  /sbin  /srv  /sys  /tmp  /usr  /var`,
				},
				{
					type: "text",
					content: rich`Use a mount point like ${code("/mnt")} instead.`,
				},
			],
		},
		{
			title: "Error Codes",
			content: [
				{
					type: "table",
					headers: ["Code", "Exit", "Description"],
					rows: [
						["E001", "1", "Target directory does not exist"],
						["E002", "2", "Target is not a directory"],
						["E003", "3", "Target directory not writable"],
						["E004", "4", "EROFS image not found"],
						["E005", "5", "EROFS extraction command failed"],
						["E006", "6", "Extracted system verification failed"],
						["E007", "7", "EROFS tools not installed"],
						["E008", "8", "Must run as root"],
						["E009", "9", "Target directory not empty (use --force)"],
						["E010", "10", "Target is a protected system path"],
						["E011", "11", "Target is not a mount point (use --force)"],
						["E012", "12", "Insufficient disk space"],
						["E013", "13", "EROFS image is not a regular file"],
						["E014", "14", "EROFS image is not readable"],
						["E015", "15", "EROFS image is inside target directory"],
					],
					monospaceCol: 0,
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

# Copy pre-built UKI
mkdir -p /mnt/boot/EFI/Linux
cp /media/cdrom/boot/uki/levitateos-system-a.efi /mnt/boot/EFI/Linux/
cp /media/cdrom/boot/uki/levitateos-system-b.efi /mnt/boot/EFI/Linux/

# Enter chroot
recchroot /mnt

# Set root password
passwd

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
