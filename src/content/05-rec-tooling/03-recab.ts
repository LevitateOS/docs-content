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
					content: rich`The full lifecycle above is required but incomplete. Installation now copies the personalized A into B, seals both and publishes equivalent generation-bound boot entries; ${code("stage")} formats the inactive slot and carries selected configuration from the running system. Generation identity, readiness and durable preparation sessions now exist. ${code("prepare")} now synchronizes the inactive ext4 filesystem incrementally in either direction, removes its boot entry and finishes ${code("prepared")}. Reopening preserves pending changes. Finalization now validates and seals either candidate, requires compatible candidate/fallback readers, reuses matching boot objects and publishes its entry last. Recipe install/update/remove now apply isolated payloads and generation-owned receipts to the preparation; configuration edits use a bounded temporary file. The builder and recab now share a release manifest binding identity, inventory, boot artifacts and compatibility. Import verifies the complete set without changing a preparation. Update discovery/download and release merging remain missing. Staging refuses an existing preparation to protect X.`,
				},
				{
					type: "text",
					content: rich`The existing backend uses systemd-boot with systemd or OpenRC. ${code("set-next")} schedules a one-shot trial, the trial service commits a healthy boot or requests recovery after a failed one, and ${code("rollback")} selects the previous known-good system while it remains available. Hard hangs still require a watchdog. ${code("status --json")} reports the current boot state and action verdicts; schema 6 also reports pending/completed Recipe publications, preparation identity/revision/progress, synchronization/finalization write counters, boot seals and generation readiness. Incomplete candidates and mismatched boot artifacts cannot be scheduled.`,
				},
			],
		},
		{
			title: "Prepared System Software",
			content: [
				{
					type: "text",
					content: rich`Root's ${code("recipe install")}, ${code("update")} and ${code("remove")} commands on immutable A/B installations delegate to recab. ${code("--system")} selects this explicitly. Recipe runs inside Ginux with isolated payload outputs; recab applies them only to the inactive preparation. Updates/removals refuse incompatible ownership and administrator edits. The running system stays unchanged until a finalized candidate is trial-booted.`,
				},
				{
					type: "code",
					language: "bash",
					content: `recipe --system install service
recipe --system installed
recipe --system isinstalled service --prepared
recab edit /etc/example.conf
recab finalize
recab set-next B      # A is running; use A when B is running
reboot`,
				},
				{
					type: "text",
					content: rich`System packages and their receipts belong to the slot, under ${code("/usr/lib/recipe")}. ${code("installed")} distinguishes active and prepared selection; ${code("isinstalled")} defaults to the active system. An interrupted publication requires ${code("recab change recover")} or explicit discard before more edits/finalization. Independent ${code("--package-root")} profiles and ${code("--no-activate")} builders retain their own routes.`,
				},
			],
		},
		{
			title: "Verified Release Inputs",
			content: [
				{
					type: "text",
					content: rich`Media and online payloads use one ${code("release.json")}, binding distro/profile, architecture, channel/sequence, intended system inventory and exact rootfs/kernel/initramfs hashes and sizes. The installed distribution key verifies detached Ed25519 signatures. With no configured key, unsigned local input requires explicit ${code("--trusted-local")}; that flag cannot bypass a configured key.`,
				},
				{
					type: "code",
					language: "bash",
					content: "recab release import /mnt/release/release.json --trusted-local",
				},
				{
					type: "text",
					content: rich`Import checks compatibility, actual EROFS metadata and matching kernel/modules/initramfs, then retains the exact verified bytes in a content-addressed cache. It leaves the running system, preparation X, ledger and boot entries unchanged. ${code("stage --manifest PATH")} and ${code("stage --from-media MEDIA")} use the same verifier before replacing the inactive system. Configured online discovery/download and merging into X remain P08/P09.`,
				},
			],
		},
		{
			title: "Current Release Image Staging",
			content: [
				{
					type: "text",
					content: rich`This path verifies the media manifest and replaces the inactive system. It refuses an existing preparation; it cannot yet apply an update while preserving a pending continuation. Start with ${code("recab status")}; the example assumes A is running. When B is running, the trial target is A.`,
				},
				{
					type: "code",
					language: "bash",
					content: `recab status
recab stage --from-media /mnt/release  # add --trusted-local for unsigned local media
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
						rich`${bold("Generation readiness")}: incomplete preparation must not be trial-booted. Recab requires recorded generation readiness and matching boot artifacts; ESP-file presence alone is insufficient.`,
						rich`${bold("Shared state")}: user data and caches can remain on ${code("/var")}; system selection and configuration belong to their generation. On immutable A/B installs, root's Recipe package commands target the inactive system; its system profile belongs to that slot. Boot rollback does not reverse all shared application data.`,
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
