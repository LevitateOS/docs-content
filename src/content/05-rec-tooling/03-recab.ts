import type { DocsContent } from "../../types";
import { rich, code, link } from "../../rich-text";
import { TOOL_HELP } from "../../tool-help";

export default {
	title: "recab",
	intro:
		"The two root filesystems of an A/B installation, root A and root B. The booted root is locked. The other root is unlocked, and changes are made there.",
	sections: [
		{
			title: "The Two Roots",
			content: [
				{
					type: "list",
					items: [
						rich`The booted root is locked: read-only, with its block device read-only.`,
						rich`The other root is unlocked: writable, mounted read-write at ${code("/run/recab/other")}. Changes are made there. Recipe writes system software into it.`,
						rich`Boot the other root and the roles swap. Nothing else decides which is which.`,
						rich`The boot default is the root that last finished starting. A root that does not finish starting is not booted again by default: the machine starts the previous root again.`,
					],
				},
				{
					type: "text",
					content: rich`A mutable (single-root) installation has no A/B and no ${code("recab")}.`,
				},
			],
		},
		{
			title: "Using It",
			content: [
				{
					type: "code",
					language: "bash",
					content: `recab status          # which root is booted, the other one, what boots next
recab copy            # make the other root a copy of the booted root
recab boot-other      # start the other root at the next boot, once
recab boot-other --cancel`,
				},
				{
					type: "text",
					content: rich`To change the system, write into ${code("/run/recab/other")} (Recipe does this), then run ${code("recab boot-other")} and reboot. If the other root finishes starting, it becomes the boot default and the root you came from is now the unlocked one. If it does not, the machine starts the previous root again.`,
				},
				{
					type: "text",
					content: rich`To start over from the running system, run ${code("recab copy")}. It overwrites the other root with a copy of the booted root, boot files included. When the other root cannot be mounted or copied into, its filesystem is created anew. Anything written into the other root before is gone.`,
				},
				{
					type: "text",
					content: rich`${code("recab compare")} shows how the two roots differ. ${code("recab health")} shows how startup ended.`,
				},
			],
		},
		{
			title: "Current CLI",
			content: [
				{
					type: "text",
					content: rich`Commands and options come from ${code("recab --help")}:`,
				},
				{
					type: "code",
					language: "text",
					content: TOOL_HELP.recab,
				},
			],
		},
		{
			title: "See Also",
			content: [
				{
					type: "list",
					items: [
						rich`${link("recpart", "/docs/recpart")} - Installation disk layout`,
						rich`${link("A/B Roots", "/docs/atomic-updates")} - The two roots and how a system change lands`,
					],
				},
			],
		},
	],
} satisfies DocsContent;
