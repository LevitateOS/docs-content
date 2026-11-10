import { distroPage } from "../../types";
import { rich, bold, code, link } from "../../rich-text";
import {
	commands,
	EXAMPLE_DISK,
	guideStep,
	guideSteps,
	guideTitle,
	UEFI_VARS,
} from "../../install";
import { network, pageLink } from "../../pages";

const SLUG = "installation-disk";
const disk = EXAMPLE_DISK.disk;
const target = EXAMPLE_DISK.target;
/** The example disk's partitions: EFI, slot A, slot B, state. */
const part = (n: number) => `${disk}p${n}`;

export default distroPage((d) => ({
	title: guideTitle(SLUG),
	intro: rich`Installation ${guideSteps(SLUG)}: Boot the live environment and prepare your disk. See ${pageLink("installation")} for an overview.`,
	sections: [
		{
			title: guideStep(SLUG, "Boot the Live Environment"),
			content: [
				{
					type: "text",
					content: rich`Boot from the ${d.osName} ISO (see ${pageLink("getting-started")}). The install screen opens beside this guide. On the left, ${code("install-hub")} lists the install steps and does each one: it starts ${code("disk-plan")} for the disk and ${code("base-system")} for the base system, runs this guide's commands for the boot loader, and opens a shell for the rest (${code("s")} at any time; ${code("exit")} returns). The commands below work the same typed by hand. Ctrl-] switches between the panes.`,
				},
				{
					type: "note",
					variant: "info",
					content: rich`${bold("Secure Boot:")} ${d.osName}'s boot files are unsigned. If your system won't boot the ISO, disable Secure Boot in your UEFI firmware settings.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Verify you booted in UEFI mode",
					command: commands.uefiCheck(),
				},
				{
					type: "text",
					content: rich`If ${code(UEFI_VARS)} doesn't exist, you booted in legacy BIOS mode. ${d.osName} requires UEFI. Reboot and select UEFI boot in your firmware settings.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Set keyboard layout (optional, default is US)",
					command: commands.liveKeymap(d, "us"),
				},
			],
		},
		{
			title: "WiFi Connection (Optional)",
			content: [
				{
					type: "text",
					content: `Installation is fully offline - no network required. ${network(d).wired} Skip this if you don't need network access.`,
				},
				{
					type: "command",
					language: "bash",
					description: "List wireless interfaces",
					command: network(d).listWifi,
				},
				{
					type: "command",
					language: "bash",
					description: "Connect (replace YOUR_NETWORK, then type its passphrase)",
					command: network(d).connectWifi,
				},
				{ type: "text", content: network(d).firmware },
			],
		},
		{
			title: guideStep(SLUG, "Identify Target Disk"),
			content: [
				{
					type: "note",
					variant: "info",
					content: rich`${bold("These steps in one tool:")} ${code("disk-plan")} lists the disks, lets you choose A/B or mutable and erase the whole disk or edit its partitions (for example to keep Windows), shows the plan and every command, runs recpart's safety checks, and partitions, formats and mounts the disk once you confirm. The steps below do the same with ${code("recpart")} directly.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Plan, check and apply the disk layout interactively",
					command: commands.diskPlan(),
				},
				{
					type: "command",
					language: "bash",
					description: "List candidate disks",
					command: "recpart list-disks",
					output: `recpart candidate disks
  ${disk}
    size: 2000398934016 bytes (logical 512 / physical 512)
    model: Samsung SSD 990 PRO 2TB | transport: nvme | read-only: no`,
				},
				{
					type: "command",
					language: "bash",
					description:
						"Show what is on a disk now: partitions, filesystems, used space, mounts and free gaps",
					command: `recpart inspect --disk ${disk}`,
				},
				{
					type: "text",
					content: rich`This guide uses ${code(disk)} as an example. ${bold("Replace it with your actual device.")} NVMe partitions are named ${code("nvme0n1p1")}, ${code("nvme0n1p2")} and so on; SATA and virtio disks are ${code("/dev/sda")} or ${code("/dev/vda")} with partitions ${code("sda1")}, ${code("vda1")}.`,
				},
			],
		},
		{
			title: guideStep(SLUG, "Plan the Partitions"),
			content: [
				{
					type: "text",
					content: rich`${code("recpart plan")} shows the layout, the exact sfdisk script and every command, without touching the disk. The default A/B layout:`,
				},
				{
					type: "table",
					headers: ["Partition", "Size", "Filesystem (label)", "Mount"],
					rows: [
						[part(1), "1 GiB", "FAT (EFI)", "/boot"],
						[part(2), "20 GiB", "ext4 (ROOT_A)", "/ (system slot A)"],
						[part(3), "20 GiB", "ext4 (ROOT_B)", "not mounted (system slot B)"],
						[part(4), "Remainder", "ext4 (STATE)", "/var"],
					],
					monospaceCol: 0,
				},
				{
					type: "command",
					language: "bash",
					description: "Preview the default A/B layout",
					command: `recpart plan --disk ${disk}`,
				},
				{
					type: "note",
					variant: "info",
					content: rich`${bold("Why this layout:")} A and B are interchangeable system slots. Installation must populate both with equivalent personalized systems; updates and system changes continue the active system in the inactive slot. The current installer still leaves B unpopulated. ${code("/var")} holds shared persistent data, including homes in ${code("/var/home")}. See ${link("Atomic Updates (A/B)", "/docs/atomic-updates")} for the lifecycle and current gaps.`,
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
			title: guideStep(SLUG, "Partition, Format and Mount"),
			content: [
				{
					type: "text",
					content: rich`${bold("WARNING: the default layout erases all data on the disk.")} Review the steps with ${code("--dry-run")} first; the real run needs the confirmation token ${code("DESTROY")}.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Show every step apply would run, and anything it would refuse",
					command: commands.partition(disk, true),
				},
				{
					type: "command",
					language: "bash",
					description: "Partition, format and mount the disk",
					command: commands.partition(disk),
				},
				{
					type: "text",
					content: rich`recpart writes the partition table, formats each partition with its label, and mounts the new system: slot A at ${code(target)}, the EFI partition at ${code(`${target}/boot`)} and the state partition at ${code(`${target}/var`)}. Slot B stays unmounted. Its output ends with the install target and each mount.`,
				},
				{
					type: "note",
					variant: "warning",
					content: rich`${bold("Write down the slot devices:")} with the default layout, slot A is ${code(part(2))} and slot B ${code(part(3))}. ${guideStep("installation-boot", "Install the Boot Loader and Entries")} needs both. ${code("recpart apply --json")} reports them as ${code("slot_a_device")} and ${code("slot_b_device")}.`,
				},
			],
		},
		{
			title: guideStep(SLUG, "Check the Mounts"),
			content: [
				{
					type: "command",
					language: "bash",
					description: "Confirm the new system's filesystems are mounted",
					command: `findmnt -R ${target}`,
				},
				{
					type: "text",
					content: rich`You should see slot A on ${code(target)}, the EFI partition on ${code(`${target}/boot`)} and the state partition on ${code(`${target}/var`)}.`,
				},
				{
					type: "text",
					content: rich`Continue to ${pageLink("installation-base")} (${guideSteps("installation-base")}).`,
				},
			],
		},
		{
			title: "Manual Partitioning (Alternative)",
			content: [
				{
					type: "text",
					content: rich`If you would rather partition by hand, do this instead of the plan and apply steps. It creates the same layout and labels as ${code("recpart")}, with util-linux's ${code("sfdisk")}.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Write a GPT table: EFI, slot A, slot B (the same size) and state",
					command: `sfdisk ${disk} <<'EOF'
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
						`mkfs.fat -F32 -n EFI ${part(1)}`,
						`mkfs.ext4 -L ROOT_A ${part(2)}`,
						`mkfs.ext4 -L ROOT_B ${part(3)}`,
						`mkfs.ext4 -L STATE ${part(4)}`,
					],
				},
				{
					type: "command",
					language: "bash",
					description: "Mount slot A, then the EFI and state partitions inside it",
					command: [
						`mount ${part(2)} ${target}`,
						`mkdir -p ${target}/boot ${target}/var`,
						`mount ${part(1)} ${target}/boot`,
						`mount ${part(4)} ${target}/var`,
					],
				},
				{
					type: "text",
					content: "Leave slot B unmounted. It is the inactive slot that updates are written to.",
				},
			],
		},
	],
}));
