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
			title: guideStep(SLUG, "Install the Boot Loader and Entries"),
			content: [
				{
					type: "text",
					content: rich`Use the slot A and B devices reported by ${code("recpart apply")}. Previewing with ${code("recsetup plan")} runs no installation commands.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Install systemd-boot, write slot entries and initialize machine identity",
					command: commands.boot(target, args(EXAMPLE_DISK)),
				},
				{
					type: "text",
					content: rich`recsetup installs systemd-boot on the EFI partition, the way the target supports (${code("bootctl install")} where the target has it, otherwise by copying its EFI binary), then runs ${code("recab init")}: slot A's kernel${d.installedInitramfs ? " and initramfs" : ""} (from the live media) go to ${code(`/boot/${d.osId}-a/`)}, both slot entries are written to ${code("/boot/loader/entries/")} naming their partition by PARTUUID, slot A becomes the default and the known-good slot, and the trial service is enabled. ${d.installedInitramfs ? "" : "The kernel mounts the root itself, so there is no initramfs. "}Add ${code('--options "console=ttyS0,115200n8"')} if you need a serial console.`,
				},
				{
					type: "text",
					content: rich`For an explicitly selected mutable layout, use ${code(args(MUTABLE))} instead of the A/B arguments.`,
				},
			],
		},
		{
			title: guideStep(SLUG, "Review Services"),
			content: [
				{
					type: "text",
					content: rich`The system recipe starts ${network(d).installedServices.join(", ")} at boot. Live-session autologin and shell overrides stay on the ISO.`,
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
				...(network(d).keepWifi(target).length > 0
					? [
							{
								type: "command" as const,
								language: "bash" as const,
								description: "WiFi: keep the network saved in the live session and connect at boot",
								command: network(d).keepWifi(target),
							},
						]
					: []),
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
