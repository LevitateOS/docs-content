import type { DocsContent } from "../../types";
import { rich, bold, code, link } from "../../rich-text";
import { TOOL_HELP } from "../../tool-help";

export default {
	title: "recab",
	intro:
		"System updates and symmetric A/B continuation: prepare the next system, apply changes and updates through Recipe, trial-boot it, commit or fall back.",
	sections: [
		{
			title: "Required Update Lifecycle",
			content: [
				{
					type: "list",
					ordered: true,
					items: [
						"Installation populates A and B with equivalent personalized systems and matching boot artifacts. Both are bootable at first use; only partition references, boot paths and slot identity differ.",
						"While committed A runs with an immutable system root, prepare writable B as its continuation and apply system change X through Recipe.",
						"Discover and download a system update and apply it to that same prepared B. Preserve X or report a conflict; do not erase the preparation.",
						"Finalize B and its matching kernel and initramfs, then trial-boot it. Commit a healthy result or return to A after a failed trial triggers a reboot.",
						"For change Y while running committed B, bring inactive A up to B's current system using only differences, retain X and the update, then apply Y. Repeat in either direction.",
					],
				},
				{
					type: "text",
					content: rich`${code("recab")} owns this system update lifecycle. ${code("Recipe")} owns software acquisition, builds, installation, update and removal inside Ginux; recab coordinates those operations for the prepared system. Slot letters have identical capabilities.`,
				},
			],
		},
		{
			title: "Implementation Status",
			content: [
				{
					type: "note",
					variant: "warning",
					content: rich`The full lifecycle above is required but incomplete. Today's ${code("init")} leaves B unpopulated; ${code("stage")} formats the inactive slot and carries selected configuration from the running system. Incremental continuation, preparation sessions, update discovery/download and Recipe targeting of the inactive system are missing. Staging again would discard X already prepared there.`,
				},
				{
					type: "text",
					content: rich`The existing backend uses systemd-boot with systemd or OpenRC. ${code("set-next")} schedules a one-shot trial, the trial service commits a healthy boot or requests recovery after a failed one, and ${code("rollback")} selects the previous known-good system while it remains available. Hard hangs still require a watchdog. ${code("status --json")} reports the current boot state and action verdicts; preparation progress and generation readiness still need extending.`,
				},
			],
		},
		{
			title: "Current Release Image Staging",
			content: [
				{
					type: "text",
					content: rich`This existing update path replaces the inactive system. It does not preserve a pending continuation. Start with ${code("recab status")}; the example assumes A is running. When B is running, the trial target is A.`,
				},
				{
					type: "code",
					language: "bash",
					content: `recab status
recab stage --from-media /mnt/release
recab set-next B      # example: A is running
reboot
# After a healthy trial, B is committed and A remains the rollback target.
recab rollback       # select A for the next boot, while A still holds its system`,
				},
				{
					type: "text",
					content: rich`${code("stage")} extracts an EROFS release using ${code("recstrap")}, carries the paths listed in ${code("/usr/lib/recab/carried")}, and installs the kernel and installed-system initramfs. The carried-path baseline is not a whole-system delta or conflict-aware merge. Staging refuses an uncommitted running system and a target selected for next boot. ${code("--change-flavour")} explicitly permits switching base/desktop flavour.`,
				},
			],
		},
		{
			title: "Current CLI",
			content: [
				{
					type: "text",
					content: rich`Implemented options from ${code("recab --help")}; these do not yet expose the full required lifecycle:`,
				},
				{
					type: "code",
					language: "text",
					content: TOOL_HELP.recab,
				},
			],
		},
		{
			title: "Safety and Persistence",
			content: [
				{
					type: "list",
					items: [
						rich`${bold("Protected fallback")}: never prepare over the fallback while the running trial is uncommitted. Starting a new preparation over the older system ends that older rollback; the committed active system remains protected.`,
						rich`${bold("Generation readiness")}: incomplete preparation must not be trial-booted. The current ESP-file presence check alone does not establish a completed system.`,
						rich`${bold("Shared state")}: user data and caches can remain on ${code("/var")}; system selection and configuration belong to their generation. Today's root Recipe profile is shared, so it does not yet provide that system isolation. Boot rollback does not reverse all shared application data.`,
					],
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
						rich`${link("Atomic Updates (A/B)", "/docs/atomic-updates")} - The system lifecycle and implementation limits`,
					],
				},
			],
		},
	],
} satisfies DocsContent;
