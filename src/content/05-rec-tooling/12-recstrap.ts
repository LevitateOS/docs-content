import { bootArgs, commands, EXAMPLE_DISK, EXAMPLE_SETUP } from "../../install";
import type { DocsContent } from "../../types";
import { rich, bold, code, link } from "../../rich-text";
import { TOOL_HELP } from "../../tool-help";

const t = EXAMPLE_DISK.target;

export default {
	title: "recstrap",
	intro:
		"Extract the base system (LevitateOS or AcornOS) to a target directory. Like pacstrap for Arch Linux.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`${code("recstrap")} extracts the system's EROFS image from the live ISO to a mounted target directory. ${code("recab")} owns system updates and continuation; its current ${code("stage")} implementation uses recstrap for destructive release-image extraction. Incremental continuation is still missing.`,
				},
				{
					type: "text",
					content: rich`${code("recstrap")} is ${bold("EROFS-only")}. The rootfs is an ${code(".erofs")} image file or a partition holding one; anything else (including ${code(".squashfs")}) is rejected. It mounts the image read-only and copies its files into the target.`,
				},
				{
					type: "text",
					content: rich`After running recstrap, complete the installation: generate ${code("/etc/fstab")} with ${code("recfstab")}, then configure the system, set passwords and install the bootloader with ${code("recsetup")}.`,
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
					command: "recstrap --rootfs /media/usb/filesystem.erofs /mnt",
				},
				{
					type: "command",
					language: "bash",
					description: "Run pre-flight checks only (no extraction)",
					command: "recstrap --check /mnt",
				},
				{
					type: "command",
					language: "bash",
					description: "Skip the mount point and empty-target checks",
					command: "recstrap --force /mnt",
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
						"Target is not a protected system path (never overridable)",
						"Running as root",
						"Target is writable",
						rich`Target is not on the running system's root filesystem or another host system directory (only ${code("--allow-host-root-fs")}, never implied by ${code("--force")})`,
						rich`Target is a mount point (${code("--allow-non-mountpoint")} or ${code("--force")})`,
						rich`Target is empty, ${code("lost+found")} aside (${code("--allow-nonempty")} or ${code("--force")})`,
						"At least 2 GB free on the target",
						"A rootfs image was found",
						"The rootfs is an image file or a partition, not a directory",
						"The rootfs is not inside the target",
						rich`The rootfs is EROFS: an image file named ${code(".erofs")}, with the EROFS superblock magic`,
						"The running kernel supports EROFS (built in or loadable)",
					],
				},
				{
					type: "text",
					content: rich`After extraction, recstrap checks that ${code("bin")}, ${code("etc")}, ${code("lib")}, ${code("sbin")}, ${code("usr")} and ${code("var")} exist in the target before it reports success.`,
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
						rich`${code("/run/live-rootfs.erofs")} - the live system's handle to the rootfs payload partition or image file`,
						rich`${code("/run/live-media/live/filesystem.erofs")} - the image file on the mounted boot medium`,
					],
				},
			],
		},
		{
			title: "Protected Paths",
			content: [
				{
					type: "text",
					content: rich`The tool refuses host system directories as a target. The list is ${code("PROTECTED_PATHS")} in ${code("tools/recstrap/src/guard.rs")}.`,
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
					content: [
						"# Generate fstab",
						commands.fstab(t),
						"",
						"# Configure the system",
						commands.configure(t, {
							timezone: EXAMPLE_SETUP.timezone,
							locale: EXAMPLE_SETUP.locale,
						}),
						"",
						"# Set the root password (root is locked by default)",
						commands.password(t),
						"",
						"# Install systemd-boot and the A/B boot entries",
						commands.boot(t, bootArgs(EXAMPLE_DISK) as string),
						"",
						"# Unmount and reboot",
						...commands.unmount(EXAMPLE_DISK),
						commands.reboot(),
					].join("\n"),
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
} satisfies DocsContent;
