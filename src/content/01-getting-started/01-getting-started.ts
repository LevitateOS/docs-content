import { distroPage } from "../../types";
import { rich, bold, code, link } from "../../rich-text";
import { DISTROS } from "../../distros";
import { HARDWARE, PAGE_TITLES, pageLink } from "../../pages";

export default distroPage((d) => ({
	title: PAGE_TITLES["getting-started"],
	intro: `Get the ${d.osName} live ISO and create bootable installation media.`,
	sections: [
		{
			title: "Requirements",
			content: [
				{
					type: "list",
					items: [
						rich`${bold("CPU:")} ${HARDWARE.cpu}`,
						rich`${bold("RAM:")} ${HARDWARE.ram}`,
						rich`${bold("Storage:")} ${HARDWARE.disk}. The default A/B layout uses 1 GB for EFI and 20 GB for each system slot, and gives the rest to ${code("/var")}`,
						rich`${bold("Boot:")} UEFI. ${d.osName}'s boot files are unsigned, so Secure Boot must be disabled`,
					],
				},
				{
					type: "note",
					variant: "info",
					content: rich`${bold("A/B by default:")} the system lives in two root slots. An update is written to the inactive slot, trial-booted once, and kept only if that boot is healthy; you can roll back to the previous slot. ${bold("Mutable mode")}, one root changed in place, is an explicit opt-in without that safety net. See ${link("Atomic Updates (A/B)", "/docs/atomic-updates")}.`,
				},
			],
		},
		{
			title: "Get the ISO",
			content: [
				{
					type: "text",
					content: rich`${d.osName} is not released yet, so there is no download; see ${link("Download", "/download")} for its status. It will ship as an x86_64 live ISO that boots into the install environment. Today you build the ISO from the public source, in a checkout of the repository:`,
				},
				{
					type: "code",
					language: "bash",
					content: `cargo xtask setup
cargo xtask build kernel <distro> --prebuilt
cargo xtask build live-tools <distro>`,
				},
				{
					type: "text",
					content: rich`Use the variant's id as <distro> (${DISTROS.map((distro) => distro.id).join(" or ")}). The last command prints the path of the ISO it built; ${code("cargo xtask --help")} lists every build. A release will publish a ${code(`${d.isoFile}.sha512`)} checksum beside the ISO, checked with ${code("sha512sum -c")}.`,
				},
			],
		},
		{
			title: "Creating Bootable Media",
			content: [],
		},
		{
			title: "USB Drive (Linux/macOS)",
			level: 3,
			content: [
				{
					type: "code",
					language: "bash",
					content: `# Find your USB device (usually /dev/sdX or /dev/diskX)
lsblk  # Linux
diskutil list  # macOS

# Write the ISO (CAUTION: this erases the drive)
sudo dd if=${d.isoFile} of=/dev/sdX bs=4M status=progress oflag=sync`,
				},
			],
		},
		{
			title: "USB Drive (Windows)",
			level: 3,
			content: [
				{
					type: "text",
					content: rich`Use ${link("Rufus", "https://rufus.ie")} with DD image mode.`,
				},
			],
		},
		{
			title: "Virtual Machine (QEMU)",
			level: 3,
			content: [
				{
					type: "code",
					language: "bash",
					content: `# Create a ${HARDWARE.disk} virtual disk
qemu-img create -f qcow2 disk.qcow2 ${HARDWARE.disk.replace(" GB", "G")}

# Boot the installer (the OVMF firmware path varies by distribution)
qemu-system-x86_64 \\
  -m ${HARDWARE.qemuRam} \\
  -smp 2 \\
  -enable-kvm \\
  -cpu host \\
  -bios /usr/share/ovmf/OVMF.fd \\
  -cdrom ${d.isoFile} \\
  -drive file=disk.qcow2,format=qcow2,if=none,id=disk0 \\
  -device nvme,drive=disk0,serial=disk0 \\
  -boot d`,
				},
			],
		},
		{
			title: "Next Steps",
			content: [
				{
					type: "text",
					content: rich`Boot from the ISO to enter the live environment, then follow the ${pageLink("installation")} guide to install ${d.osName}.`,
				},
			],
		},
	],
}));
