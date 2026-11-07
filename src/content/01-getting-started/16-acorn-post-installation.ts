import type { DocsContent } from "../../types";
import { rich, code, link } from "../../rich-text";

export const acornPostInstallationContent: DocsContent = {
	title: "AcornOS Post-Installation",
	meta: {
		product: "acorn",
		scopes: ["install", "post_install"],
		audience: ["beginner"],
		stability: "stable",
	},
	intro: rich`After rebooting, log in with your user account and start using your new AcornOS system. Administrative commands go through ${code("doas")}.`,
	sections: [
		{
			title: "Services",
			content: [
				{
					type: "command",
					language: "bash",
					description: "Show the services in each runlevel and whether they run",
					command: "rc-status --all",
				},
				{
					type: "command",
					language: "bash",
					description: "Start a service now and at every boot",
					command: ["doas rc-update add SERVICE default", "doas rc-service SERVICE start"],
				},
			],
		},
		{
			title: "System Updates",
			content: [
				{
					type: "text",
					content: rich`A new AcornOS release is written into the inactive slot (slot B after a fresh install) and trial-booted once. Mount the new release ISO, then stage its system image and kernel (AcornOS boots without an initramfs):`,
				},
				{
					type: "command",
					language: "bash",
					description: "Mount the new release ISO",
					command: "doas mount -o loop,ro acornos-x86_64.iso /mnt",
				},
				{
					type: "command",
					language: "bash",
					description: "Write the new system into the inactive slot",
					command:
						"doas recab stage --rootfs /mnt/live/filesystem.erofs --kernel /mnt/boot/vmlinuz",
				},
				{
					type: "command",
					language: "bash",
					description: "Boot the staged slot once, as a trial",
					command: ["doas umount /mnt", "doas recab set-next B", "doas reboot"],
				},
				{
					type: "text",
					content: rich`The hostname, accounts, enabled services and SSH host keys are carried into the new slot. If it starts cleanly, the trial service commits it; if not, the machine reboots into the previous slot by itself. ${code("recab status")} shows which slot runs and how the last trial ended, and ${code("doas recab rollback")} returns to the previous slot later. See ${link("Atomic Updates (A/B)", "/docs/atomic-updates")}.`,
				},
			],
		},
		{
			title: "Next Steps",
			content: [
				{
					type: "list",
					items: [
						"Set up development tools and editors (vim ships with the system)",
						rich`Review ${link("Troubleshooting", "/docs/acorn-troubleshooting")} if you encounter issues`,
					],
				},
			],
		},
	],
};
