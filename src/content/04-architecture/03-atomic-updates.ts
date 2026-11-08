import type { DocsContent } from "../../types";
import { rich, bold, code, link } from "../../rich-text";

export default {
	title: "Atomic Updates (A/B)",
	intro:
		"LevitateOS and AcornOS default to an A/B system layout: write the next system into the inactive slot, trial-boot it, then commit. Roll back by booting the previous slot. The system changes only this way; software you add with Recipe is kept on the shared /var.",
	sections: [
		{
			title: "What “A/B” Means",
			content: [
				{
					type: "text",
					content:
						"A/B systems keep two system slots on disk (A and B). Only one is active at a time. Updates write to the inactive slot and switch boot to it on reboot.",
				},
				{
					type: "list",
					items: [
						rich`${bold("Slot A")} (label ${code("ROOT_A")}): the installed system after a fresh install`,
						rich`${bold("Slot B")} (label ${code("ROOT_B")}): where the next system is written`,
						rich`${bold("Persistent state")} (label ${code("STATE")}): mounted at ${code("/var")}, shared by both slots: recab's state and Recipe's packages and state live here. Home directories under ${code("/home")} are in the slot and are not carried yet`,
						rich`${bold("EFI partition")}: systemd-boot, one boot entry per slot, and each slot's kernel (and its initramfs, on a system that boots one)`,
					],
				},
			],
		},
		{
			title: "Update Lifecycle (Default)",
			content: [
				{
					type: "list",
					ordered: true,
					items: [
						rich`Write the new system into the inactive slot: ${code("recab stage --rootfs <image> --kernel <vmlinuz>")}, plus ${code("--initrd <initramfs>")} on a system that boots one. The machine's hostname, accounts, enabled services, network connections and SSH host keys come along, as the image's ${code("/usr/lib/recab/carried")} lists them.`,
						rich`Trial-boot it once: ${code("recab set-next B")} (the inactive slot), then reboot`,
						rich`If slot B comes up with no failed services, recab's trial service (a systemd unit or an OpenRC service, with the system's init) commits it. If services fail, startup never finishes, the new system cannot mount its root, or its kernel or init crashes, the machine reboots into slot A by itself. ${code("recab status")} shows how the last trial ended.`,
						rich`Later, ${code("recab rollback")} returns to the previous slot while it still holds that system`,
					],
				},
				{
					type: "note",
					variant: "info",
					content: rich`Each slot's root is remounted read-write after boot; A/B gives you a second, untouched system to return to, not a read-only root.`,
				},
				{
					type: "text",
					content: rich`See ${link("recab", "/docs/recab")} for every command, and ${link("Post-Installation", "/docs/post-installation")} for an update from a new release.`,
				},
			],
		},
		{
			title: "Mutable Mode (Optional)",
			content: [
				{
					type: "text",
					content: rich`Mutable mode is one root partition changed in place, chosen at install time with ${code("recpart --mode mutable")} and ${code("recsetup apply --boot mutable")}. It has no second slot, so there is no trial boot and no rollback, and every change lands on the running system.`,
				},
				{
					type: "note",
					variant: "warning",
					content:
						"Mutable mode is an explicit opt-in. Prefer A/B unless you have a reason to change the running system directly.",
				},
			],
		},
	],
} satisfies DocsContent;
