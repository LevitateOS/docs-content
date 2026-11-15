import { distroPage } from "../../types";
import { rich, bold, code } from "../../rich-text";
import { commands, EXAMPLE_DISK, guideStep, guideSteps, guideTitle } from "../../install";
import { INIT_NAME, network, pageLink } from "../../pages";

const SLUG = "installation-base";
const target = EXAMPLE_DISK.target;

export default distroPage((d) => ({
	title: guideTitle(SLUG),
	intro: rich`Installation ${guideSteps(SLUG)}: Verify media, extract the system, generate fstab, and inspect the target. See ${pageLink("installation")} for an overview.`,
	sections: [
		{
			title: guideStep(SLUG, "Verify Installation Media"),
			content: [
				{
					type: "note",
					variant: "info",
					content: rich`${bold("Option 1, the helper app:")} ${code("base-system")} checks the target, copies the system with a progress bar, shows the fstab entries (and any lines already in the target's fstab they would replace) and writes them. It reads the target from the disk step, so after ${code("disk-plan")} it needs no arguments. When it says the system is on the disk, go to ${pageLink("installation-config")}. ${bold("Option 2, by hand:")} skip ${code("base-system")} and use the commands below. Either way the system is copied, not installed: it has no boot files yet.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Check, copy and write the fstab interactively",
					command: commands.baseSystem(),
				},
				{
					type: "note",
					variant: "warning",
					content: rich`${bold("Skip this - only if doing it by hand.")} ${code("base-system")} already checked the media.`,
				},
				{
					type: "text",
					content:
						"The live media is already mounted. Verify the system image it installs is there:",
				},
				{
					type: "command",
					language: "bash",
					description: "Check for the EROFS image",
					command: commands.mediaCheck(),
				},
			],
		},
		{
			title: guideStep(SLUG, "Extract Base System"),
			content: [
				{
					type: "note",
					variant: "warning",
					content: rich`${bold("Skip this - only if doing it by hand.")} ${code("base-system")} already extracted the system.`,
				},
				{
					type: "text",
					content: rich`Use ${code("recstrap")} to extract the EROFS image to your mounted root:`,
				},
				{
					type: "command",
					language: "bash",
					description: `Extract the system to ${target}`,
					command: commands.extract(target),
				},
				{
					type: "text",
					content: rich`This extracts the minimal base system: ${INIT_NAME[d.profile.init]}, the userland, kernel modules, ${code(d.profile.privilege)}, the ${code("recipe")} package manager and, on A/B installations, ${code("recab")}. The rest (${network(d).daemon}, the desktop, Firefox, audio, printing and so on) comes in the next part, installed through Recipe. It checks the target first and the extracted system afterwards, before it reports success.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Verify extraction succeeded",
					command: `ls ${target}/bin ${target}/usr ${target}/etc`,
				},
			],
		},
		{
			title: guideStep(SLUG, "Generate fstab"),
			content: [
				{
					type: "note",
					variant: "warning",
					content: rich`${bold("Skip this - only if doing it by hand.")} ${code("base-system")} already wrote the fstab.`,
				},
				{
					type: "text",
					content: rich`Use ${code("recfstab")} (like Arch's ${code("genfstab")}) to detect the mounted filesystems and write their fstab entries:`,
				},
				{
					type: "command",
					language: "bash",
					description: "Generate fstab from current mounts",
					command: commands.fstab(target),
				},
				{
					type: "command",
					language: "bash",
					description: "Verify the generated fstab",
					command: `cat ${target}/etc/fstab`,
				},
				{
					type: "text",
					content: rich`You should see entries for ${code("/")} (ext4), ${code("/boot")} (vfat) and, with the default A/B layout, ${code("/var")} (ext4), each with its UUID. Persistent state, shared by both roots, lives on ${code("/var")}. Root B has no entry: it is not mounted.`,
				},
			],
		},
		{
			title: guideStep(SLUG, "Inspect the New System"),
			content: [
				{
					type: "note",
					variant: "warning",
					content: rich`${bold("Skip this - only if doing it by hand.")} This only reads the system. ${code("system-setup")} shows the same choices on its own pages.`,
				},
				{
					type: "text",
					content: rich`Stay in the live shell. ${code("recsetup")} reads the mounted target and lists the configuration choices it ships: its init system, libc and privilege tool among them.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Inspect the installed system",
					command: commands.inspect(target, true),
				},
				{
					type: "text",
					content: rich`The system is copied, not installed. Continue from the live shell to ${pageLink("installation-config")} (${guideSteps("installation-config")}).`,
				},
			],
		},
	],
}));
