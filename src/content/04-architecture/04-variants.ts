import type { DocsContent } from "../../types";
import { rich, bold, code, link } from "../../rich-text";

export default {
	title: "Variants",
	intro:
		"LevitateOS is a shared build system with two OS variants. They share the recipe engine, the build pipeline and the install and update tools, but differ in their base, libc and init.",
	sections: [
		{
			title: "Variant Matrix",
			content: [
				{
					type: "table",
					headers: ["Variant", "Goal", "Base", "Stack", "Admin", "Artifact"],
					rows: [
						[
							"LevitateOS",
							"Daily-driver desktop/workstation, maximum compatibility",
							"Locked, signed Fedora RPMs",
							"glibc / systemd / GNU",
							"sudo",
							"levitateos-x86_64.iso (live + installer)",
						],
						[
							"AcornOS",
							"Daily-driver desktop/workstation, a smaller and simpler base",
							"Alpine APKs",
							"musl / OpenRC / busybox",
							"doas",
							"acornos-x86_64.iso (live + installer)",
						],
					],
				},
				{
					type: "note",
					variant: "info",
					content: rich`Both variants are A/B by default, with a trial boot and rollback managed by ${code("recab")}; a mutable root is an explicit opt-in. See ${link("Atomic Updates (A/B)", "/docs/atomic-updates")}.`,
				},
			],
		},
		{
			title: "One Pipeline",
			content: [
				{
					type: "text",
					content: rich`${code("distro-builder")} builds both from their own contract, ${code("distro/variants/<distro>/distro.toml")} (with the kernel configuration ${code("kconfig")} and the release hooks beside it): sources and recipes, filesystem products, EROFS/initramfs/UKI transforms, the ISO release, and the boot, install and runtime scenarios. Recipes own the package facts; the builder owns orchestration and output locations.`,
				},
				{
					type: "code",
					language: "bash",
					content: `cargo xtask build live-tools levitate
cargo xtask build live-tools acorn`,
				},
			],
		},
		{
			title: "Where To Start",
			content: [
				{
					type: "list",
					items: [
						rich`${bold("Install")} → ${link("Getting Started", "/docs/getting-started")}`,
						rich`${bold("Packages")} → ${link("recipe CLI Reference", "/docs/cli-reference")}`,
						rich`${bold("Update model")} → ${link("Atomic Updates (A/B)", "/docs/atomic-updates")}`,
						rich`${bold("Build/test loop")} → ${code("architecture.md")} (repo root)`,
					],
				},
			],
		},
	],
} satisfies DocsContent;
