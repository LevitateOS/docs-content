import type { DocsContent } from "../../types";
import { rich, code, link } from "../../rich-text";

export const installationBootContent: DocsContent = {
	title: "Bootloader & Finish",
	meta: { product: "levitate", scopes: ["install"], audience: ["beginner"], stability: "stable" },
	intro:
		"Finish from the live shell. Keep the installed root at /mnt and its EFI partition at /mnt/boot.",
	sections: [
		{
			title: "15–16. Install Bootloader and A/B Boot Layout",
			content: [
				{
					type: "text",
					content: rich`Use the slot A and B devices reported by ${code("recpart apply")} (step 4). Previewing with ${code("recsetup plan")} runs no installation commands.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Install systemd-boot, write slot entries and initialize machine identity",
					command:
						"recsetup apply --root /mnt --boot ab --slot-a /dev/nvme0n1p2 --slot-b /dev/nvme0n1p3 --machine-id",
				},
				{
					type: "text",
					content: rich`This runs ${code("bootctl install")} in the target, then ${code("recab init")}: slot A's kernel and initramfs (from the live media) go to ${code("/boot/levitateos-a/")}, both slot entries are written to ${code("/boot/loader/entries/")} naming their partition by PARTUUID, slot A becomes the default and the known-good slot, and the trial service is enabled. Add ${code('--options "console=ttyS0,115200n8"')} if you need a serial console.`,
				},
				{
					type: "text",
					content: rich`For an explicitly selected mutable layout, use ${code("--boot mutable --root-device /dev/nvme0n1p2")} instead of the A/B arguments.`,
				},
			],
		},
		{
			title: "17. Review Services",
			content: [
				{
					type: "text",
					content:
						"The system recipe enables NetworkManager. Live-session SSH, autologin, and shell overrides are confined to the live overlay.",
				},
				{
					type: "command",
					language: "bash",
					description: "Inspect installed services and other choices",
					command: "recsetup inspect --root /mnt --json",
				},
				{
					type: "text",
					content: rich`Enable an additional installed service with ${code("recsetup apply --root /mnt --service SERVICE")}.`,
				},
			],
		},
		{
			title: "18. Unmount and Reboot",
			content: [
				{
					type: "command",
					language: "bash",
					description: "Unmount the installed system",
					command: "umount -R /mnt",
				},
				{
					type: "command",
					language: "bash",
					description: "Reboot, then remove the installation media",
					command: "reboot",
				},
				{
					type: "text",
					content: rich`Continue to ${link("Post-Installation", "/docs/post-installation")}.`,
				},
			],
		},
	],
};
