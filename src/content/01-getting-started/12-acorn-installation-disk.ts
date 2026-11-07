import type { DocsContent } from "../../types";
import { rich, bold, code, link } from "../../rich-text";

export const acornInstallationDiskContent: DocsContent = {
	title: "AcornOS Disk Preparation",
	meta: { product: "acorn", scopes: ["install"], audience: ["beginner"], stability: "stable" },
	intro: rich`AcornOS installation steps 1-5: Boot the live environment and prepare your disk. See ${link("Installing AcornOS", "/docs/acorn-installation")} for an overview.`,
	sections: [
		{
			title: "1. Boot the Live Environment",
			content: [
				{
					type: "text",
					content: rich`Boot from the AcornOS ISO. The install screen opens: a root shell beside this guide.`,
				},
				{
					type: "note",
					variant: "info",
					content: rich`${bold("Secure Boot:")} AcornOS's boot files are unsigned. If your system won't boot the ISO, disable Secure Boot in your UEFI firmware settings.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Verify you booted in UEFI mode",
					command: "ls /sys/firmware/efi/efivars",
				},
				{
					type: "text",
					content: rich`If ${code("/sys/firmware/efi/efivars")} doesn't exist, you booted in legacy BIOS mode. AcornOS requires UEFI. Reboot and select UEFI boot in your firmware settings.`,
				},
				{
					type: "text",
					content: rich`The live environment uses the US keyboard layout; it ships no console keymaps to switch to. The installed system's keymap is set in step 11.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Set the clock from the network (optional; needs a wired connection)",
					command: "ntpd -q -n -p pool.ntp.org",
				},
			],
		},
		{
			title: "Network (Optional)",
			content: [
				{
					type: "text",
					content: rich`Installation is fully offline - no network required. On a wired connection, ${code("dhcpcd")} configures the interface at boot. The live ISO has no WiFi tools.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Show the interfaces and their addresses",
					command: "ip addr",
				},
			],
		},
		{
			title: "2. Identify Target Disk",
			content: [
				{
					type: "note",
					variant: "info",
					content: rich`${bold("Steps 2-5 in one tool:")} ${code("disk-plan")} lists the disks, lets you choose A/B or mutable and erase the whole disk or edit its partitions (for example to keep Windows), shows the plan and every command, runs recpart's safety checks, and partitions, formats and mounts the disk once you confirm. The steps below do the same with ${code("recpart")} directly.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Plan, check and apply the disk layout interactively",
					command: "disk-plan",
				},
				{
					type: "command",
					language: "bash",
					description: "List candidate disks",
					command: "recpart list-disks",
					output: `recpart candidate disks
  /dev/nvme0n1
    size: 2000398934016 bytes (logical 512 / physical 512)
    model: Samsung SSD 990 PRO 2TB | transport: nvme | read-only: no`,
				},
				{
					type: "command",
					language: "bash",
					description:
						"Show what is on a disk now: partitions, filesystems, used space, mounts and free gaps",
					command: "recpart inspect --disk /dev/nvme0n1",
				},
				{
					type: "text",
					content: rich`This guide uses ${code("/dev/nvme0n1")} as an example. ${bold("Replace it with your actual device.")} NVMe partitions are named ${code("nvme0n1p1")}, ${code("nvme0n1p2")} and so on; SATA and virtio disks are ${code("/dev/sda")} or ${code("/dev/vda")} with partitions ${code("sda1")}, ${code("vda1")}.`,
				},
			],
		},
		{
			title: "3. Plan the Partitions",
			content: [
				{
					type: "text",
					content: rich`${code("recpart plan")} shows the layout, the exact sfdisk script and every command, without touching the disk. The default A/B layout:`,
				},
				{
					type: "table",
					headers: ["Partition", "Size", "Filesystem (label)", "Mount"],
					rows: [
						["/dev/nvme0n1p1", "1 GiB", "FAT (EFI)", "/boot"],
						["/dev/nvme0n1p2", "20 GiB", "ext4 (ROOT_A)", "/ (system slot A)"],
						["/dev/nvme0n1p3", "20 GiB", "ext4 (ROOT_B)", "not mounted (system slot B)"],
						["/dev/nvme0n1p4", "Remainder", "ext4 (STATE)", "/var"],
					],
				},
				{
					type: "command",
					language: "bash",
					description: "Preview the default A/B layout",
					command: "recpart plan --disk /dev/nvme0n1",
				},
				{
					type: "note",
					variant: "info",
					content: rich`${bold("Why this layout:")} slot A holds the installed system and slot B is where the next system is written, so an update never touches the running one and rollback is a reboot. Everything that must survive an update lives in ${code("/var")}.`,
				},
				{
					type: "list",
					items: [
						rich`${bold("Sizes:")} ${code("--efi-size-mb")}, ${code("--root-a-size-mb")}, ${code("--root-b-size-mb")} and ${code("--state-size-mb")} change them; both slots must be the same size.`,
						rich`${bold("Mutable layout:")} ${code("--mode mutable")} creates only EFI and one root (label ROOT).`,
						rich`${bold("Dual boot:")} don't erase the disk. Use ${code("disk-plan")}'s editor, or pass an explicit layout with ${code("--layout layout.json")}, to keep the existing EFI partition and Windows, shrink a partition to make room, and create the slots and state partition in the free space.`,
					],
				},
			],
		},
		{
			title: "4. Partition, Format and Mount",
			content: [
				{
					type: "text",
					content: rich`${bold("WARNING: the default layout erases all data on the disk.")} Review the steps with ${code("--dry-run")} first; the real run needs the confirmation token ${code("DESTROY")}.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Show every step apply would run, and anything it would refuse",
					command: "recpart apply --disk /dev/nvme0n1 --dry-run",
				},
				{
					type: "command",
					language: "bash",
					description: "Partition, format and mount the disk",
					command: "recpart apply --disk /dev/nvme0n1 --confirm DESTROY",
				},
				{
					type: "text",
					content: rich`recpart writes the partition table, formats each partition with its label, and mounts the new system: slot A at ${code("/mnt")}, the EFI partition at ${code("/mnt/boot")} and the state partition at ${code("/mnt/var")}. Slot B stays unmounted. Its output ends with the install target and each mount.`,
				},
				{
					type: "note",
					variant: "warning",
					content: rich`${bold("Write down the slot devices:")} with the default layout, slot A is ${code("/dev/nvme0n1p2")} and slot B ${code("/dev/nvme0n1p3")}. Step 15 needs both. ${code("recpart apply --json")} reports them as ${code("slot_a_device")} and ${code("slot_b_device")}.`,
				},
			],
		},
		{
			title: "5. Check the Mounts",
			content: [
				{
					type: "command",
					language: "bash",
					description: "Confirm the new system's filesystems are mounted",
					command: "findmnt -R /mnt",
				},
				{
					type: "text",
					content: rich`You should see slot A on ${code("/mnt")}, the EFI partition on ${code("/mnt/boot")} and the state partition on ${code("/mnt/var")}.`,
				},
				{
					type: "text",
					content: rich`Continue to ${link("Base System", "/docs/acorn-installation-base")} (steps 6-9).`,
				},
			],
		},
		{
			title: "Manual Partitioning (Alternative)",
			content: [
				{
					type: "text",
					content: rich`If you would rather partition by hand, do this instead of steps 3 and 4. It creates the same layout and labels as ${code("recpart")}, with util-linux's ${code("sfdisk")} (busybox's ${code("fdisk")} cannot write GPT).`,
				},
				{
					type: "command",
					language: "bash",
					description: "Write a GPT table: EFI, slot A, slot B (the same size) and state",
					command: `sfdisk /dev/nvme0n1 <<'EOF'
label: gpt
size=1GiB, type=U
size=20GiB, type=L
size=20GiB, type=L
type=L
EOF`,
				},
				{
					type: "command",
					language: "bash",
					description: "Format the four partitions",
					command: [
						"mkfs.fat -F32 -n EFI /dev/nvme0n1p1",
						"mkfs.ext4 -L ROOT_A /dev/nvme0n1p2",
						"mkfs.ext4 -L ROOT_B /dev/nvme0n1p3",
						"mkfs.ext4 -L STATE /dev/nvme0n1p4",
					],
				},
				{
					type: "command",
					language: "bash",
					description: "Mount slot A, then the EFI and state partitions inside it",
					command: [
						"mount /dev/nvme0n1p2 /mnt",
						"mkdir -p /mnt/boot /mnt/var",
						"mount /dev/nvme0n1p1 /mnt/boot",
						"mount /dev/nvme0n1p4 /mnt/var",
					],
				},
				{
					type: "text",
					content: "Leave slot B unmounted. It is the inactive slot that updates are written to.",
				},
			],
		},
	],
};
