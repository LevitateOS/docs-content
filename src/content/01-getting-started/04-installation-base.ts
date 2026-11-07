import type { DocsContent } from "../../types";
import { rich, bold, code, link } from "../../rich-text";

export const installationBaseContent: DocsContent = {
	title: "Base System",
	meta: { product: "levitate", scopes: ["install"], audience: ["beginner"], stability: "stable" },
	intro: rich`Installation steps 6-9: Verify media, extract the system, generate fstab, and inspect the target. See ${link("Installation", "/docs/installation")} for an overview.`,
	sections: [
		{
			title: "6. Verify Installation Media",
			content: [
				{
					type: "note",
					variant: "info",
					content: rich`${bold("Steps 6-8 in one tool:")} ${code("base-system")} checks the target, copies the system with a progress bar, shows the fstab entries (and any lines already in the target's fstab they would replace) and writes them. It reads the target from the disk step, so after ${code("disk-plan")} it needs no arguments. The steps below do the same by hand.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Check, copy and write the fstab interactively",
					command: "base-system",
				},
				{
					type: "text",
					content:
						"The live media is already mounted. Verify the canonical EROFS payload path is accessible:",
				},
				{
					type: "command",
					language: "bash",
					description: "Check for EROFS image",
					command: "ls -la /run/live-rootfs.erofs",
				},
			],
		},
		{
			title: "7. Extract Base System",
			content: [
				{
					type: "text",
					content: rich`Use ${code("recstrap")} to extract the EROFS image to your mounted root:`,
				},
				{
					type: "command",
					language: "bash",
					description: "Extract system to /mnt",
					command: "recstrap /mnt",
				},
				{
					type: "text",
					content: rich`This extracts the complete base system: systemd, the GNU userland, kernel modules, NetworkManager, ${code("recab")} for A/B updates and the ${code("recipe")} package manager. It checks the target first and the extracted system afterwards, before it reports success.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Verify extraction succeeded",
					command: "ls /mnt/bin /mnt/usr /mnt/etc",
				},
			],
		},
		{
			title: "8. Generate fstab",
			content: [
				{
					type: "text",
					content: rich`Use ${code("recfstab")} (like Arch's ${code("genfstab")}) to automatically detect mounted filesystems and generate fstab entries:`,
				},
				{
					type: "command",
					language: "bash",
					description: "Generate fstab from current mounts",
					command: "recfstab --write /mnt",
				},
				{
					type: "command",
					language: "bash",
					description: "Verify the generated fstab",
					command: "cat /mnt/etc/fstab",
				},
				{
					type: "text",
					content: rich`You should see entries for ${code("/")} (ext4) and ${code("/boot")} (vfat) with UUIDs.`,
				},
				{
					type: "text",
					content: rich`With the default A/B layout, you should also see an entry for ${code("/var")} (ext4). Persistent state (including ${code("/var/home")}) lives there. Slot B has no entry: it is not mounted.`,
				},
			],
		},
		{
			title: "9. Inspect the New System",
			content: [
				{
					type: "text",
					content: rich`Stay in the live shell. ${code("recsetup")} reads the mounted target and lists the configuration choices its recipes provide.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Inspect the installed system",
					command: "recsetup inspect --root /mnt --json",
				},
				{
					type: "text",
					content: rich`Continue from the live shell to ${link("Configuration", "/docs/installation-config")} (steps 10-14).`,
				},
			],
		},
	],
};
