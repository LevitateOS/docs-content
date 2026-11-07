import type { DocsContent } from "../../types"
import { rich, bold } from "../../rich-text"

export const howWeCompareContent: DocsContent = {
	title: "How We Compare",
	intro:
		"Honest comparison with other distributions. We show our strengths and admit our weaknesses.",
	sections: [
		{
			title: "Feature Comparison",
			content: [
				{
					type: "table",
					headers: ["Aspect", "Arch", "Fedora", "NixOS", "LevitateOS"],
					rows: [
						["Time to usable system", "Hours", "30 min", "Hours", "15 min"],
						["Package customization", "Full (AUR)", "Limited", "Full (nix)", "Full (Rhai)"],
						["Binary packages", "Partial", "Yes", "Yes", "Yes"],
						["Reproducible builds", "No", "No", "Yes", "Partial (lock + A/B)"],
						["Learning curve", "Medium", "Low", "High", "Medium"],
						["Community size", "Huge", "Large", "Medium", "Growing"],
						["Atomic updates + rollback", "No", "Atomic editions only", "Yes (generations)", "Yes (A/B slots)"],
						["Rolling release", "Yes", "No (6mo)", "Yes", "No (follows Fedora releases)"],
						["Package source", "Compile AUR", "Fedora repos", "Nixpkgs", "Fedora RPMs (core) + recipes"],
					],
				},
			],
		},
		{
			title: "Where LevitateOS Wins",
			content: [
				{
					type: "list",
					items: [
						rich`${bold("Speed")}: Extract pre-built packages in minutes, not hours of compilation`,
						rich`${bold("Maintained base")}: the core comes from Fedora's signed builds and their security updates`,
						rich`${bold("Programmable recipes")}: Rhai scripts can do anything, not just declare dependencies`,
						rich`${bold("No build dependencies")}: You don't need gcc to install software`,
						rich`${bold("A/B by default")}: updates go to the inactive slot, are trial-booted and kept only if healthy, with rollback; a mutable root is an explicit opt-in`,
						rich`${bold("Isolated builds")}: every recipe runs in its own build domain with no network unless you grant it`,
					],
				},
			],
		},
		{
			title: "Where We're Weaker",
			content: [
				{
					type: "text",
					content:
						"Every distribution has tradeoffs. Here's where LevitateOS falls short compared to alternatives:",
				},
				{
					type: "list",
					items: [
						rich`${bold("Smaller community")}: We're new. Arch and Fedora have decades of community knowledge.`,
						rich`${bold("Fewer packages than AUR")}: only a small core comes from Fedora. Everything else needs a recipe.`,
						rich`${bold("Not Nix-level reproducibility")}: A/B slots and locked package sets help, but LevitateOS does not model NixOS generations.`,
						rich`${bold("Less documentation")}: Arch Wiki is comprehensive. Our docs are growing but not there yet.`,
						rich`${bold("Younger project")}: Less battle-tested edge cases compared to established distros.`,
					],
				},
				{
					type: "text",
					content:
						"If these limitations matter to you, use the distro that fits your needs. We won't pretend to be everything for everyone.",
				},
			],
		},
		{
			title: "When to Use LevitateOS",
			content: [
				{
					type: "text",
					content: "LevitateOS is the right choice when:",
				},
				{
					type: "list",
					items: [
						"You want Arch's philosophy without compilation wait times",
						"You want a maintained Fedora base without Fedora's defaults",
						"You want real scripting power in your package manager",
						"You want updates you can trial-boot and roll back",
						"You want to install and configure your system yourself, step by step",
					],
				},
			],
		},
		{
			title: "When to Use Something Else",
			content: [
				{
					type: "text",
					content: "Use a different distro when:",
				},
				{
					type: "list",
					items: [
						rich`${bold("You need NixOS-style reproducibility")}: LevitateOS isn't trying to be NixOS`,
						rich`${bold("You want a huge package ecosystem")}: AUR has far more packages than LevitateOS has recipes`,
						rich`${bold("You want a graphical installer")}: Fedora and Ubuntu have one; LevitateOS installs Arch-style, from a shell or step-by-step terminal apps`,
						rich`${bold("You need extensive documentation")}: Arch Wiki is unmatched`,
						rich`${bold("You want a large support community")}: Our community is still growing`,
					],
				},
				{
					type: "text",
					content:
						"No distribution is perfect for everyone. Pick the one that matches your priorities.",
				},
			],
		},
	],
}
