import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"

export const atomicUpdatesContent: DocsContent = {
	title: "Atomic Updates (A/B)",
	intro:
		"LevitateOS variants default to an A/B immutable system layout: build the next system in slot B, trial-boot it, then commit. Roll back by booting the previous slot.",
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
						rich`${bold("Slot A")}: current system`,
						rich`${bold("Slot B")}: next system (built before activation)`,
						rich`${bold("Persistent state")}: mounted at ${code("/var")} (includes ${code("/var/home")})`,
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
						"Compose slot B (recipes install into the inactive slot, not live /)",
						"Validate slot B offline (sanity checks, expected files, services)",
						"Reboot and trial-boot slot B once",
						"Commit slot B if healthy, otherwise roll back to slot A",
					],
				},
				{
					type: "text",
					content: rich`See also the checkpoint ladder in ${code("checkpoints.md")} (07Update Slot B Trial Boot).`,
				},
			],
		},
		{
			title: "Mutable Mode (Optional)",
			content: [
				{
					type: "text",
					content:
						"Mutable mode exists for daredevils on public-facing desktop variants (LevitateOS/AcornOS). It allows in-place system mutation, at the cost of drift and a much larger blast radius for recipe changes.",
				},
				{
					type: "note",
					variant: "warning",
					content:
						"Mutable mode is explicitly unsafe when combined with LLM-assisted recipe authoring. Expect breakage. Prefer A/B unless you are debugging or experimenting.",
				},
			],
		},
		{
			title: "Appliance Variants",
			content: [
				{
					type: "text",
					content:
						"Appliance variants are immutable-only. They ship primarily as installed-disk images and are designed to run unattended.",
				},
				{
					type: "list",
					items: [rich`${bold("RalphOS")}: agents-only automation host (disk images first)`],
				},
				{
					type: "text",
					content: rich`If you’re looking for a daily-driver desktop experience, start with ${link("Getting Started", "/docs/getting-started")}.`,
				},
			],
		},
	],
}
