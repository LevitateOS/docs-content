import type { DocsContent } from "../../types";
import { rich, code, link } from "../../rich-text";

export const acornInstallationBootContent: DocsContent = {
	title: "AcornOS Boot & Finish",
	meta: { product: "acorn", scopes: ["install"], audience: ["beginner"], stability: "stable" },
	intro:
		"AcornOS installation steps 15-18. Finish from the live shell. Keep the installed root at /mnt and its EFI partition at /mnt/boot.",
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
					content: rich`AcornOS runs OpenRC, not systemd, but boots with systemd-boot: recsetup copies its EFI binary to ${code("EFI/BOOT")} and ${code("EFI/systemd")} on the EFI partition, then runs ${code("recab init")}. Slot A's kernel (from the live media) goes to ${code("/boot/acornos-a/")}; the kernel mounts the root itself, so there is no initramfs. Both slot entries are written to ${code("/boot/loader/entries/")} naming their partition by PARTUUID, slot A becomes the default and the known-good slot, and recab's trial service is added to the default runlevel. Add ${code('--options "console=ttyS0,115200n8"')} if you need a serial console.`,
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
					content: rich`The system recipe adds ${code("networking")}, ${code("dhcpcd")} and ${code("sshd")} to OpenRC's runlevels. Live-session autologin stays on the ISO.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Inspect installed services and other choices",
					command: "recsetup inspect --root /mnt --json",
				},
				{
					type: "text",
					content: rich`Add another installed service to the default runlevel with ${code("recsetup apply --root /mnt --service SERVICE")} (it runs ${code("rc-update add")} in the target).`,
				},
				{
					type: "command",
					language: "bash",
					description: "WiFi: keep the network saved in the live session and connect at boot",
					command: [
						"cp /etc/wpa_supplicant/wpa_supplicant.conf /mnt/etc/wpa_supplicant/",
						"recsetup apply --root /mnt --service wpa_supplicant",
					],
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
					content: rich`Continue to ${link("Post-Installation", "/docs/acorn-post-installation")}.`,
				},
			],
		},
	],
};
