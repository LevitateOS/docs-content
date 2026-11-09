import type { DocsContent } from "../../types";
import { rich, bold, code, link } from "../../rich-text";
import { DISTROS } from "../../distros";
import { DESKTOP_NAME, INIT_NAME, KERNEL_LINE_NAME } from "../../pages";

/** What the generated DISTROS records do not carry: each variant's goal, base and userland. */
const VARIANT_TEXT = {
	acorn: {
		goal: "Small, strict system: the fewest parts that do the job",
		base: "Alpine APKs",
		userland: "busybox",
	},
	levitate: {
		goal: "Daily-driver workstation, maximum compatibility",
		base: "Locked, signed Fedora RPMs",
		userland: "GNU",
	},
} as const;

export default {
	title: "Variants",
	intro:
		"LevitateOS is a shared build system with two OS variants. They share the recipe engine, the build pipeline and the install and update tools, but differ in their base, libc, init, administrator tool, desktop and kernel line.",
	sections: [
		{
			title: "Variant Matrix",
			content: [
				{
					type: "table",
					headers: ["Variant", "Goal", "Base", "Stack", "Admin", "Desktop", "Kernel"],
					rows: DISTROS.map((distro) => [
						distro.osName,
						VARIANT_TEXT[distro.id].goal,
						VARIANT_TEXT[distro.id].base,
						`${distro.profile.libc} / ${INIT_NAME[distro.profile.init]} / ${VARIANT_TEXT[distro.id].userland}`,
						distro.profile.privilege,
						DESKTOP_NAME[distro.profile.desktop],
						`${distro.kernel.version} (${KERNEL_LINE_NAME[distro.profile.kernel_line]})`,
					]),
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
					content: rich`${code("distro-builder")} builds both from their own contract, ${code("distro/variants/<distro>/distro.toml")} (with the kernel configuration ${code("kconfig")} and the release hooks beside it): what each variant declares for sources, products and the live system. The install screen is the same on both (distro/contract/src/install_ux.rs). Recipes own the package facts; the builder owns orchestration and output locations.`,
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
						rich`${bold("Build/test loop")} → ${code("cargo xtask --help")}, and ${code("architecture.md")} (repo root) for where each fact lives`,
					],
				},
			],
		},
	],
} satisfies DocsContent;
