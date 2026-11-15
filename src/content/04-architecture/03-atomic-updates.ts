import type { DocsContent } from "../../types";
import { rich, bold, code, link } from "../../rich-text";

export default {
	title: "A/B Roots",
	intro:
		"An A/B installation has two root filesystems, A and B. The booted root is locked. The other root is unlocked, and system changes are made there. Boot the other root and the roles swap.",
	sections: [
		{
			title: "Two Roots",
			content: [
				{
					type: "text",
					content: rich`Installation sets up root A and makes root B a copy of it. Both are bootable at first use, and A is the boot default.`,
				},
				{
					type: "list",
					items: [
						rich`${bold("Booted root")}: locked. It is mounted read-only and its block device is read-only.`,
						rich`${bold("Other root")}: unlocked. It is writable, mounted read-write at ${code("/run/recab/other")}.`,
						rich`${bold("Shared /var")}: a third, writable partition shared by both roots.`,
						rich`${bold("EFI partition")}: the boot loader, one boot entry per root, and each root's kernel and initramfs.`,
					],
				},
				{
					type: "text",
					content:
						"Which root is locked follows only from which root booted. Boot B and B is locked and A is unlocked. Boot A and it reverses.",
				},
			],
		},
		{
			title: "How a Change Lands",
			content: [
				{
					type: "list",
					ordered: true,
					items: [
						rich`Run ${code("recab status")} to see which root is booted and which is the other.`,
						"Write the change into the other root. Recipe writes system software there; the booted root is never written to.",
						rich`Run ${code("recab boot-other")} and reboot. The other root starts once.`,
						"If it finishes starting, it becomes the boot default and the roles are swapped: the root you came from is now the unlocked one.",
						"If it does not finish starting, the next boot starts the previous root again.",
					],
				},
				{
					type: "text",
					content: rich`To start over from the running system, run ${code("recab copy")}. It overwrites the other root with a copy of the booted root, so changes start from the current working system. Anything written into the other root before is gone.`,
				},
			],
		},
		{
			title: "Updating the System",
			content: [
				{
					type: "text",
					content: rich`Updates use the same path. They are written and have not been built or run yet. A release is signed and named ${code("1.0")}, ${code("1.1")} and so on. ${code("recab update")} downloads it, makes the other root a copy of the booted one, lets Recipe apply the release there and starts that root once. A daily check only shows a notice that a release exists; nothing is downloaded or installed until you ask. Mutable installations are updated by the Updater app instead, since they have no other root. Software you installed yourself keeps updating from the Recipe catalog.`,
				},
			],
		},
		{
			title: "The Boot Default",
			content: [
				{
					type: "text",
					content:
						"The boot default is the root that last finished starting. Starting the other root is a one-time pick, either from the boot menu or with recab boot-other. A root that does not finish starting leaves the default untouched, so the machine starts the previous root again.",
				},
			],
		},
		{
			title: "Mutable Mode (Optional)",
			content: [
				{
					type: "text",
					content: rich`Mutable mode is one root partition changed in place, chosen explicitly at install time with ${code("recpart --mode mutable")} and ${code("recsetup apply --boot mutable")}. It has no second root, no ${code("recab")} and no A/B.`,
				},
			],
		},
		{
			title: "See Also",
			content: [
				{
					type: "text",
					content: rich`See ${link("recab", "/docs/recab")} for the commands.`,
				},
			],
		},
	],
} satisfies DocsContent;
