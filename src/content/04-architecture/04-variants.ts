import type { DocsContent } from "../../types";
import { rich, bold, code, link } from "../../rich-text";
import { DISTROS } from "../../distros";
import { desktopOn, INIT_NAME, KERNEL_LINE_NAME } from "../../pages";

/** What the generated DISTROS records do not carry: each variant's goal, base and userland. */
const VARIANT_TEXT = {
	acorn: {
		goal: "Small, strict system: the fewest parts that do the job",
		base: "Alpine 3.24 APK packages",
		userland: "busybox",
	},
	levitate: {
		goal: "Daily-driver workstation, maximum compatibility",
		base: "Fedora 45 RPM packages, signed and locked",
		userland: "GNU",
	},
} as const;

export default {
	title: "Variants",
	intro:
		"LevitateOS and AcornOS are two independent operating systems built by one pipeline. They share the recipe engine, the build pipeline and the install tools, but differ in the packages their userland is built from, libc, init, administrator tool, desktop and kernel line.",
	sections: [
		{
			title: "Variant Matrix",
			content: [
				{
					type: "table",
					headers: [
						"Variant",
						"Goal",
						"Userland built from",
						"Stack",
						"Admin",
						"Desktop",
						"Kernel",
					],
					rows: DISTROS.map((distro) => [
						distro.osName,
						VARIANT_TEXT[distro.id].goal,
						VARIANT_TEXT[distro.id].base,
						`${distro.profile.libc} / ${INIT_NAME[distro.profile.init]} / ${VARIANT_TEXT[distro.id].userland}`,
						distro.profile.privilege,
						desktopOn(distro.profile.desktop),
						`${distro.kernel.version} (${KERNEL_LINE_NAME[distro.profile.kernel_line]})`,
					]),
				},
				{
					type: "note",
					variant: "info",
					content: rich`Both variants use A/B by default. ${code("recab")} manages the two roots: the booted root is locked and changes are made in the other root. Mutable mode is an explicit opt-in. See ${link("A/B Roots", "/docs/atomic-updates")}.`,
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
						rich`${bold("A/B roots")} → ${link("A/B Roots", "/docs/atomic-updates")}`,
						rich`${bold("Build/test loop")} → ${code("cargo xtask --help")}, and ${code("architecture.md")} (repo root) for where each fact lives`,
					],
				},
			],
		},
	],
} satisfies DocsContent;
