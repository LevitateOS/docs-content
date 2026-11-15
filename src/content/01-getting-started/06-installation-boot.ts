import { distroPage } from "../../types";
import { rich, bold, code } from "../../rich-text";
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
	intro: `Installation ${guideSteps(SLUG)}. Required, whichever way you did the earlier parts: the helper apps do not do this. Run it in the live terminal, with the new system's root at ${target} and its EFI partition at ${target}/boot.`,
	sections: [
		{
			title: "What Installed Means",
			content: [
				{
					type: "note",
					variant: "warning",
					content: rich`${bold("Not installed yet.")} Copying the system and configuring it leaves a disk the firmware cannot boot. The installation is complete only when the boot files and boot entries exist on the EFI partition ${bold("and")} the verification has passed. The Boot step below writes them and shows its progress and its result in the terminal; the Finish step comes after a passing result. Do not reboot before then.`,
				},
			],
		},
		{
			title: guideStep(SLUG, "Review Services"),
			content: [
				{
					type: "note",
					variant: "info",
					content: rich`${bold("Optional.")} Nothing here is needed to finish; read it if you want another service started at boot.`,
				},
				{
					type: "text",
					content: rich`The network group recipe, installed with the default software, starts ${network(d).daemon} at boot. Live-session autologin and shell overrides stay on the ISO.`,
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
					content: rich`${bold("Required.")} Use the root A and B devices reported by ${code("recpart apply")} (or by ${code("disk-plan")}). Previewing with ${code("recsetup plan")} runs no installation commands. The command prints a line as each step starts (${code("recsetup: step N/M: ...")}), ends with ${code("Completed N setup steps.")} when the boot files and entries are written, and on A/B then runs the verification, which ends with ${code("verify-installation: PASSED")}. Any other ending, ${code("FAILED")} or an error, means the system is not installed: fix the cause and run the same command again.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Make root B a copy of root A and write both boot entries",
					command: commands.boot(target, args(EXAMPLE_DISK)),
				},
				{
					type: "text",
					content: rich`${code("recsetup")} calls ${code("recab init")}, which copies the target's systemd-boot EFI binary and writes the boot layout. It copies root A to root B, writes both boot entries and makes A the boot default. Retry the same command after an interruption: completed settings and passwords are preserved. Finish all service/network choices before this step. Add ${code('--options "console=ttyS0,115200n8"')} for a serial console.`,
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
					type: "note",
					variant: "warning",
					content: rich`${bold("Required, after the Boot step passed.")} On A/B that is ${code("verify-installation: PASSED")}. On a mutable installation, which has no recab, it is the boot entry you can list here.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Mutable installations: confirm the boot entry exists on the EFI partition",
					command: `ls ${target}/boot/loader/entries`,
				},
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
					content: rich`After the reboot, ${d.osName} is installed. Continue to ${pageLink("post-installation")}.`,
				},
			],
		},
	],
}));
