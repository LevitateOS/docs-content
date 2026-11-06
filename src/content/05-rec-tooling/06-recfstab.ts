import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"
import { TOOL_HELP } from "../../tool-help"

export const recfstabContent: DocsContent = {
	title: "recfstab",
	meta: {
		product: "levitate",
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
					type: "note",
					variant: "warning",
					content: rich`${bold("Default update model:")} A/B immutable (slot updates + rollback). ${bold("Mutable mode")} is an explicit opt-in for daredevils, and is unsafe if you let an LLM author recipes without review.`,
				},
				{
					type: "text",
					content:
						"The output is suitable for appending to /etc/fstab. Pseudo-filesystems (proc, sysfs, tmpfs) are automatically filtered out.",
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
UUID=a1b2c3d4-e5f6-7890-abcd-ef1234567890	/	ext4	defaults	0	1

# /dev/nvme0n1p1
UUID=ABCD-1234	/boot	vfat	fmask=0022,dmask=0022	0	2`,
				},
				{
					type: "text",
					content: "Fields: device identifier, mount point, filesystem type, options, dump, pass",
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
						["LABEL", "-L", "LABEL=system-a", "Human-readable if you label filesystems"],
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
						"Runtime-only mount options are automatically removed from the output since they should not persist in fstab:",
				},
				{
					type: "list",
					items: [
						rich`${code("rw")} / ${code("ro")} - Read-write/read-only (determined at mount time)`,
						rich`${code("seclabel")} - SELinux label option`,
						rich`${code("noatime")}, ${code("relatime")}, ${code("lazytime")} - Runtime atime options removed`,
						rich`${code("subvolid=<id>")} - Removed, while ${code("subvol=<path>")} is preserved`,
					],
				},
			],
		},
		{
			title: "Pseudo-Filesystems",
			content: [
				{
					type: "text",
					content: "These filesystem types are automatically excluded:",
				},
				{
					type: "code",
					language: "text",
					content: `autofs  binder  binfmt_misc  bpf  cgroup  cgroup2  configfs  debugfs
devpts  devtmpfs  efivarfs  fuse.gvfsd-fuse  fuse.portal  fusectl
hugetlbfs  mqueue  nsfs  overlay  proc  pstore  ramfs  rpc_pipefs
securityfs  selinuxfs  sysfs  tmpfs  tracefs`,
				},
			],
		},
		{
			title: "Swap Handling",
			content: [
				{
					type: "text",
					content: "Swap partitions and files under the root are included automatically:",
				},
				{
					type: "list",
					items: [
						rich`${bold("Swap partitions")} - Detected from ${code("/proc/swaps")}, included with priority if set`,
						rich`${bold("Swap files")} - Detected and path adjusted relative to root`,
						rich`${bold("zram")} - Excluded (runtime-only compressed RAM swap)`,
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
						rich`${code("findmnt")} - Part of util-linux, used to enumerate mounts`,
						rich`${code("blkid")} - Optional, used to look up UUID/LABEL/PARTUUID/PARTLABEL; missing ${code("blkid")} falls back to raw device paths`,
						"Root privileges are recommended for reliable block metadata access",
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
