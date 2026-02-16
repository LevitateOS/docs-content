import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"

export const variantsContent: DocsContent = {
	title: "Variants",
	intro:
		"LevitateOS is a shared build system with multiple OS variants. They share the recipe engine and tooling, but differ in base, init, and intended deployment.",
	sections: [
		{
			title: "Variant Matrix",
			content: [
				{
					type: "table",
					headers: ["Variant", "Goal", "Base", "Init", "Primary Artifact", "Mutable?"],
					rows: [
						[
							"LevitateOS",
							"Daily-driver desktop/workstation",
							"Rocky RPM extraction (glibc)",
							"systemd",
							"ISO (installer/live)",
							"Optional (unsafe)",
						],
						[
							"AcornOS",
							"Daily-driver desktop/workstation (musl mirror)",
							"Alpine APK extraction (musl)",
							"OpenRC",
							"ISO (installer/live)",
							"Optional (unsafe)",
						],
						[
							"RalphOS",
							"Agents-only automation appliance",
							"Levitate-based (glibc) profile",
							"systemd",
							"QCOW2 + raw .img",
							"No",
						],
					],
				},
				{
					type: "note",
					variant: "info",
					content: rich`All variants are A/B immutable by default. Mutable mode (where it exists) is an explicit opt-in for daredevils, and is unsafe if you let an LLM author recipes without review. See ${link("Atomic Updates (A/B)", "/docs/atomic-updates")}.`,
				},
			],
		},
		{
			title: "RalphOS (High-Level)",
			content: [
				{
					type: "text",
					content:
						"RalphOS is not a user-interactive desktop OS. It is an agents-only host designed to run an orchestration control plane (ralphd) and isolated sandboxes with tight security defaults.",
				},
				{
					type: "list",
					items: [
						rich`${bold("Immutable-only")}: A/B slots, trial boot, commit/rollback`,
						rich`${bold("Provision-first")}: initial access via injected SSH key`,
						rich`${bold("Disk images first")}: qcow2 for VMs, raw .img for bare metal`,
					],
				},
				{
					type: "text",
					content:
						"RalphOS details live alongside the repo in the RalphOS planning notes (pre-release).",
				},
			],
		},
		{
			title: "Where To Start",
			content: [
				{
					type: "list",
					items: [
						rich`${bold("Desktop")} → ${link("Getting Started", "/docs/getting-started")}`,
						rich`${bold("Packages")} → ${link("recipe CLI Reference", "/docs/cli-reference")}`,
						rich`${bold("Update model")} → ${link("Atomic Updates (A/B)", "/docs/atomic-updates")}`,
						rich`${bold("Build/test loop")} → ${code("stages.md")} (repo root)`,
					],
				},
			],
		},
	],
}
