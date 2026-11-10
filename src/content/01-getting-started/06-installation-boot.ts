import { distroPage } from "../../types";
import { rich, code } from "../../rich-text";
import {
	bootArgs,
	commands,
	EXAMPLE_DISK,
	guideStep,
	guideSteps,
	guideTitle,
	type DiskResult,
} from "../../install";
import { network, pageLink } from "../../pages";

const SLUG = "installation-boot";
const target = EXAMPLE_DISK.target;
const MUTABLE: DiskResult = { ...EXAMPLE_DISK, mode: "mutable", slot_a: null, slot_b: null };
const args = (disk: DiskResult) => bootArgs(disk) as string;

export default distroPage((d) => ({
	title: guideTitle(SLUG),
	intro: `Installation ${guideSteps(SLUG)}. Finish from the live shell. Keep the installed root at ${target} and its EFI partition at ${target}/boot.`,
	sections: [
		{
			title: guideStep(SLUG, "Review Services"),
			content: [
				{
					type: "text",
					content: rich`The system recipe starts ${network(d).daemon} at boot. Live-session autologin and shell overrides stay on the ISO.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Inspect installed services and other choices",
					command: commands.inspect(target, true),
				},
				{
					type: "text",
					content: rich`Start another installed service at boot with ${code(commands.service(target, "SERVICE"))}.`,
				},
				{
					type: "command",
					language: "bash",
					description: "WiFi: keep the networks saved in the live session",
					command: network(d).keepWifi(target),
				},
			],
		},
		{
			title: guideStep(SLUG, "Install the Boot Loader and Entries"),
			content: [
				{
					type: "text",
					content: rich`Use the slot A and B devices reported by ${code("recpart apply")}. Previewing with ${code("recsetup plan")} runs no installation commands.`,
				},
				{
					type: "command",
					language: "bash",
					description:
						"Populate both personalized systems, seal their roots and publish both boot entries",
					command: commands.boot(target, args(EXAMPLE_DISK)),
				},
				{
					type: "text",
					content: rich`${code("recsetup")} calls ${code("recab init")}, which copies the target's systemd-boot EFI binary and writes the boot layout. It copies the personalized A into B, checks their normalized equivalence, protects both root devices read-only, and publishes both entries with matching hash-named kernel/initramfs objects. A becomes committed/default; B is ready at first use without being recorded as a successful trial. Retry the same command after an interruption: completed settings and passwords are preserved, and a later live generation is never reset. Finish all service/network choices before this step. Add ${code('--options "console=ttyS0,115200n8"')} for a serial console.`,
				},
				{
					type: "text",
					content: rich`For an explicitly selected mutable layout, use ${code(args(MUTABLE))} instead of the A/B arguments.`,
				},
			],
		},
		{
			title: guideStep(SLUG, "Unmount and Reboot"),
			content: [
				{
					type: "command",
					language: "bash",
					description: "Unmount the installed system, deepest mount first",
					command: commands.unmount(EXAMPLE_DISK),
				},
				{
					type: "command",
					language: "bash",
					description: "Reboot, then remove the installation media",
					command: commands.reboot(),
				},
				{
					type: "text",
					content: rich`Continue to ${pageLink("post-installation")}.`,
				},
			],
		},
	],
}));
