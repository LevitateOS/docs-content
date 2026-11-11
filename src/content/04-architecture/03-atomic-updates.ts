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
					content: rich`The lifecycle is implemented through CLI and existing frontends; full boot validation and production publishing remain outstanding. Installation now finishes with equivalent personalized A/B systems and shared immutable boot payloads. A is committed/default and B is ready at first use; interrupted installation resumes its saved generation. ${code("recab stage")} and ${code("update apply")} now merge a verified release into the preparation without formatting or discarding X. Structured conflicts block finalization; recovery uses the originally captured O/C/N plan. Whole-system delta synchronization is now available through ${code("recab prepare")}; Finalization validates and seals either inactive slot before publishing its boot entry. Recipe targeting, preserved selection and baseline-aware merging are implemented. Health-assessment failures use generation-bound fallback recovery. Frontends consume guarded operations and readiness from recab. No new VM boot evidence is implied.`,
				},
				{
					type: "text",
					content: rich`Installed immutable boot now protects the root device and keeps ordinary ${code("/etc")} read-only. Nonempty legacy overlays are refused; this release provides no adoption command. Durable generation/preparation records exist, and ${code("prepare")} synchronizes the inactive filesystem using changed ranges while preserving metadata, links and its slot identity. Reopening preserves pending changes. Synchronization alone does not finalize a bootable candidate. Explicit runtime policy now handles mount tables, DNS and known init writers without a writable configuration overlay. Protocol v3 binds the boot entry to the sealed root/slot/generation and protects both root devices; actual installed boots remain unverified with these changes. Root's system Recipe profile belongs to each slot; user profiles remain independent. Old development installs are inspectable but cannot mutate state through this release. Legacy adoption/bootstrap is not implemented; use compatible recovery media or a fresh installation. Never change a state version by hand or overwrite the only known-good fallback to force an upgrade.`,
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
