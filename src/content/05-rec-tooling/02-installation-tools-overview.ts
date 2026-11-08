import { bootArgs, commands, EXAMPLE_DISK, EXAMPLE_SETUP } from "../../install";
import type { DocsContent } from "../../types";
import { rich, bold, code, link } from "../../rich-text";

const disk = EXAMPLE_DISK;
const t = disk.target;

export default {
	title: "Installation Tools Overview",
	intro:
		"Command-line tools for manual LevitateOS and AcornOS installation, equivalent to Arch Linux's partitioning tools, pacstrap, genfstab and arch-chroot.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`LevitateOS and AcornOS ship the same five installation tools that mirror Arch Linux's manual installation workflow. They give you complete control over the installation process, and they are also the backends of the install screen's step apps, so the same commands work with or without a TUI.`,
				},
				{
					type: "table",
					headers: ["Tool", "Arch Linux", "Purpose"],
					rows: [
						[
							rich`${link("recpart", "/docs/recpart")}`,
							"fdisk + mkfs + mount",
							"Partition, format and mount the target disk",
						],
						[
							rich`${link("recstrap", "/docs/recstrap")}`,
							"pacstrap",
							"Extract the base system to the target directory",
						],
						[
							rich`${link("recfstab", "/docs/recfstab")}`,
							"genfstab",
							"Generate fstab from mounted filesystems",
						],
						[
							rich`${link("recsetup", "/docs/recsetup")}`,
							"the configuration steps",
							"Time zone, locale, keymap, hostname, users, bootloader and services",
						],
						[
							rich`${link("recchroot", "/docs/recchroot")}`,
							"arch-chroot",
							"Enter chroot with proper bind mounts",
						],
					],
					monospaceCol: 0,
				},
				{
					type: "text",
					content: rich`${bold("Scope note")}: the repo also ships ${code("rec*")} tooling for updates and for building and testing images: ${code("recab")}, ${code("recinit")}, ${code("reciso")}, ${code("recqemu")}. See the ${link("rec* Tooling Overview", "/docs/rec-tooling-overview")}.`,
				},
			],
		},
		{
			title: "Installation Workflow",
			content: [
				{
					type: "text",
					content: rich`The tools are used in sequence. The ${link("Installation Guide", "/docs/installation")} walks through each step.`,
				},
				{
					type: "interactive",
					intro: "Complete installation workflow:",
					steps: [
						{
							command: commands.partition(disk.disk),
							description: `Create the A/B layout and mount it at ${t} (--mode mutable for one root)`,
						},
						{ command: commands.extract(t), description: "Extract the base system" },
						{ command: commands.fstab(t), description: "Generate fstab entries" },
						{
							command: commands.inspect(t, true),
							description: "List the time zones, locales, keymaps and services the target offers",
						},
						{
							command: commands.configure(t, {
								timezone: EXAMPLE_SETUP.timezone,
								locale: EXAMPLE_SETUP.locale,
							}),
							description: "Apply the machine settings",
						},
						{ command: commands.password(t), description: "Set the installed root password" },
						{
							command: commands.boot(t, bootArgs(disk) as string),
							description: "Install systemd-boot and the A/B boot entries",
						},
						...commands.unmount(disk).map((command) => ({
							command,
							description: "Unmount the installed system, deepest mount first",
						})),
						{ command: commands.reboot(), description: "Reboot into the installed system" },
					],
				},
			],
		},
		{
			title: "Design Philosophy",
			content: [
				{
					type: "text",
					content: rich`Each tool does ${bold("one thing")} and does it well:`,
				},
				{
					type: "list",
					items: [
						rich`${bold("recpart")} only prepares the disk. It plans, shows every command, refuses unsafe layouts, and applies the plan only with ${code("--confirm DESTROY")}.`,
						rich`${bold("recstrap")} only extracts files. It does not partition, format, mount, configure, or install bootloaders.`,
						rich`${bold("recfstab")} only generates fstab. It outputs to stdout; you redirect to a file.`,
						rich`${bold("recsetup")} only configures and boots the extracted system. It plans first and prints the exact commands it runs.`,
						rich`${bold("recchroot")} only enters chroot. It sets up mounts, runs your command, and cleans up.`,
					],
				},
				{
					type: "text",
					content:
						"This separation means you understand exactly what each step does. If something goes wrong, you know which tool to debug.",
				},
			],
		},
		{
			title: "Error Codes",
			content: [
				{
					type: "text",
					content: rich`recstrap, recfstab, recchroot and recsetup share one error table: each failure prints a code such as ${code("E004")}, which is also the exit status. The table is the ${code("Code")} enum in ${code("tools/recstrap/src/error.rs")}. recpart has its own (${code("tools/recpart/src/error.rs")}).`,
				},
			],
		},
		{
			title: "See Also",
			content: [
				{
					type: "list",
					items: [
						rich`${link("recpart Reference", "/docs/recpart")} - Prepare the disk`,
						rich`${link("recstrap Reference", "/docs/recstrap")} - Extract the base system`,
						rich`${link("recfstab Reference", "/docs/recfstab")} - Generate fstab entries`,
						rich`${link("recsetup Reference", "/docs/recsetup")} - Configure and boot the system`,
						rich`${link("recchroot Reference", "/docs/recchroot")} - Enter chroot environment`,
						rich`${link("Installation Guide", "/docs/installation")} - Complete installation walkthrough`,
					],
				},
			],
		},
	],
} satisfies DocsContent;
