import type { DocsContent } from "../../types";
import { rich, bold, code, link } from "../../rich-text";

export default {
	title: "Atomic Updates (A/B)",
	intro:
		"Recab owns system updates and continuation between interchangeable A/B slots. The active system root stays immutable; changes and updates are prepared in the other slot, trial-booted, then committed or rolled back.",
	sections: [
		{
			title: "Two Equivalent Initial Systems",
			content: [
				{
					type: "text",
					content:
						"Installation must populate A and B with the same system and final machine configuration, including matching kernels and initramfs images. Both must be bootable at first use. Their partition references, boot paths and slot identity differ; the system contents are equivalent. A initially runs committed, and B is its matching inactive copy.",
				},
				{
					type: "list",
					items: [
						rich`${bold("A and B")}: interchangeable system slots, labelled ${code("ROOT_A")} and ${code("ROOT_B")}. Active and inactive are roles that reverse after a successful trial.`,
						rich`${bold("Persistent data")}: ${code("STATE")} is mounted at ${code("/var")}. User homes and caches can be shared without becoming part of the system delta.`,
						rich`${bold("EFI partition")}: systemd-boot, a boot entry per slot, and each slot's matching kernel and initramfs.`,
					],
				},
			],
		},
		{
			title: "Required Continuation and Update Lifecycle",
			content: [
				{
					type: "list",
					ordered: true,
					items: [
						"Boot committed A with an immutable system root. To make system change X, prepare writable B as a continuation of A, synchronizing only differences.",
						"Recipe applies X to B. If an update is available, recab coordinates its download and application to the same prepared B. Preserve X or report conflicts before activation.",
						"Finalize B and its matching boot artifacts. Schedule one trial boot while A remains the protected fallback.",
						"A healthy trial commits B. A failed trial returns to A after a reboot; hard-hang recovery requires a watchdog.",
						"For change Y while running committed B, synchronize inactive A to B's current system using only differences, then apply Y. Keep X and the previous update. Repeat B→A→B with the same capabilities.",
					],
				},
				{
					type: "text",
					content:
						"Synchronization includes deletions, metadata and links and preserves destination-specific identity. It excludes shared data and runtime mounts. Unchanged system data should not be rewritten on every continuation. A prepared system can receive several changes and updates before one reboot.",
				},
			],
		},
		{
			title: "Current Implementation Limits",
			content: [
				{
					type: "note",
					variant: "warning",
					content: rich`The complete lifecycle is not implemented yet. Today's installation populates A and leaves B without a system kernel. ${code("recab stage")} formats the inactive slot and extracts a release image, carrying selected configuration from the running system. It cannot yet preserve pending changes in that slot, synchronize whole-system deltas, or direct Recipe changes into a continuation.`,
				},
				{
					type: "text",
					content: rich`The immutability work in the checkout protects the system root and supplies writable per-slot ${code("/etc")} overlays. Older images may still remount root writable; this is not the intended A/B policy. Root's current Recipe profile is shared on ${code("/var")}, so package activation there is not yet isolated to a system slot. Recab remains responsible for closing these gaps.`,
				},
				{
					type: "text",
					content: rich`See ${link("recab", "/docs/recab")} for existing commands and ${link("Post-Installation", "/docs/post-installation")} for the current release-image update procedure and its limitations.`,
				},
			],
		},
		{
			title: "Fallback and Rollback Scope",
			content: [
				{
					type: "text",
					content:
						"While a trial is uncommitted, its known-good fallback must not be overwritten. After commitment, beginning the next continuation overwrites the older system and ends that older rollback; the running committed system becomes the protected fallback. Two slots do not retain an unlimited history.",
				},
				{
					type: "text",
					content:
						"System package selection and configuration must follow the corresponding system generation. Shared user and application data remain shared; a boot rollback does not undo every data migration or change under /var.",
				},
			],
		},
		{
			title: "Mutable Mode (Optional)",
			content: [
				{
					type: "text",
					content: rich`Mutable mode is one root partition changed in place, chosen explicitly at install time with ${code("recpart --mode mutable")} and ${code("recsetup apply --boot mutable")}. It has no second slot, trial boot or A/B rollback. It is separate from the required immutable A/B lifecycle.`,
				},
			],
		},
	],
} satisfies DocsContent;
