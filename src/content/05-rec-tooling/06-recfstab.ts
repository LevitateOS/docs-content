import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"
import { TOOL_HELP } from "../../tool-help"

export const recfstabContent: DocsContent = {
	title: "recfstab",
	meta: {
		product: "shared",
		scopes: ["install"],
		audience: ["operator", "developer"],
		stability: "stable",
	},
	intro: "Generate fstab entries from mounted filesystems. Like genfstab for Arch Linux.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`${code("recfstab")} reads mounted filesystems under a root directory and outputs properly formatted fstab entries to stdout. This is the equivalent of Arch Linux's ${code("genfstab")} command.`,
				},
				{
					type: "text",
					content:
						"The output is suitable for appending to /etc/fstab. Only storage the target owns is listed: filesystems under the root backed by a block device or a network share, and the target's swap. Mount points are written relative to the root.",
				},
			],
		},
		{
			title: "Usage",
			content: [
				{
					type: "text",
					content: rich`Options as printed by ${code("recfstab --help")}:`,
				},
				{
					type: "code",
					language: "text",
					content: TOOL_HELP.recfstab,
				},
			],
		},
		{
			title: "Examples",
			content: [
				{
					type: "command",
					language: "bash",
					description: "Generate fstab with UUIDs (default)",
					command: "recfstab /mnt >> /mnt/etc/fstab",
				},
				{
					type: "command",
					language: "bash",
					description: "Generate fstab with filesystem LABELs",
					command: "recfstab -L /mnt >> /mnt/etc/fstab",
				},
				{
					type: "command",
					language: "bash",
					description: "Generate fstab with partition UUIDs",
					command: "recfstab -p /mnt >> /mnt/etc/fstab",
				},
				{
					type: "command",
					language: "bash",
					description: "Preview output without writing",
					command: "recfstab /mnt",
				},
			],
		},
		{
			title: "Output Format",
			content: [
				{
					type: "text",
					content: "Each mount produces a commented device path followed by the fstab entry:",
				},
				{
					type: "code",
					language: "bash",
					content: `# /dev/nvme0n1p2
UUID=a1b2c3d4-e5f6-7890-abcd-ef1234567890	/	ext4	relatime	0	1

# /dev/nvme0n1p1
UUID=ABCD-1234	/boot	vfat	relatime,fmask=0022,dmask=0022,codepage=437,iocharset=ascii,shortname=mixed,utf8,errors=remount-ro	0	0

# /dev/nvme0n1p4
UUID=0f1e2d3c-4b5a-6978-8796-a5b4c3d2e1f0	/var	ext4	relatime	0	2`,
				},
				{
					type: "text",
					content: rich`Fields: device identifier, mount point, filesystem type, options, dump, pass. Pass is 1 for ${code("/")}, 2 for other ext2/3/4, XFS and F2FS filesystems, and 0 for the rest (vfat and btrfs are not checked at boot).`,
				},
			],
		},
		{
			title: "Identifier Types",
			content: [
				{
					type: "table",
					headers: ["Type", "Flag", "Example", "Use Case"],
					rows: [
						["UUID", "(default)", "UUID=a1b2c3d4-...", "Most reliable for single-disk systems"],
						["LABEL", "-L", "LABEL=ROOT_A", "Human-readable if you label filesystems"],
						["PARTUUID", "-p", "PARTUUID=12345678-01", "GPT partition UUID, survives reformatting"],
						["PARTLABEL", "-t", "PARTLABEL=EFI", "GPT partition label if set during partitioning"],
					],
				},
			],
		},
		{
			title: "Filtered Options",
			content: [
				{
					type: "text",
					content:
						"Options the kernel adds at mount time are removed, since they should not be pinned in fstab. Everything else is kept as mounted:",
				},
				{
					type: "list",
					items: [
						rich`${code("rw")} - the default`,
						rich`${code("seclabel")} - SELinux runtime state`,
						rich`${code("subvolid=<id>")} - changes when a btrfs subvolume is recreated, while ${code("subvol=<path>")} is preserved`,
					],
				},
				{
					type: "text",
					content: rich`An entry left with no options gets ${code("defaults")}.`,
				},
			],
		},
		{
			title: "What Is Left Out",
			content: [
				{
					type: "text",
					content:
						"Pseudo filesystems (proc, sysfs, devpts, cgroup, efivarfs and the like), tmpfs, overlays and FUSE daemons are not the target's storage, so they are never listed. When a path is mounted twice, only the visible (last) mount is used.",
				},
			],
		},
		{
			title: "Swap Handling",
			content: [
				{
					type: "text",
					content: rich`Active swap (from ${code("swapon --show")}) is included when it belongs to the target:`,
				},
				{
					type: "list",
					items: [
						rich`${bold("Swap files")} under the root, with the path written relative to the root`,
						rich`${bold("Swap partitions")} on one of the disks that hold the target's filesystems`,
						rich`${bold("The live system's own swap")}, on any other disk (including zram), is left out`,
					],
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
			title: "Requirements",
			content: [
				{
					type: "list",
					items: [
						rich`${code("findmnt")}, ${code("swapon")} and ${code("blkid")} from util-linux`,
						rich`A device without the chosen identifier (for example no filesystem label with ${code("-L")}) is an error, not a fallback to the raw device path`,
						"Root privileges, for reliable block metadata access",
					],
				},
			],
		},
		{
			title: "Comparison with genfstab",
			content: [
				{
					type: "table",
					headers: ["Feature", "recfstab", "genfstab"],
					rows: [
						["Identifier types", "UUID, LABEL, PARTUUID, PARTLABEL", "Same"],
						["Output to stdout", "Yes", "Yes"],
						["Pseudo-filesystem filtering", "Automatic", "Automatic"],
						["Network filesystems", "Included", "Included"],
						["btrfs subvolumes", "Supported", "Supported"],
						["Swap detection", "Automatic", "Automatic"],
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
						rich`${link("recstrap", "/docs/recstrap")} - Extract the base system`,
						rich`${link("recchroot", "/docs/recchroot")} - Enter chroot environment`,
						rich`${link("Installation Tools Overview", "/docs/installation-tools-overview")} - Workflow overview`,
					],
				},
			],
		},
	],
}
