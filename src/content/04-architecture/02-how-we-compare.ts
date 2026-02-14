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
						["Local AI integration", "No", "No", "No", "Yes"],
						["Rolling release", "Yes", "No (6mo)", "Yes", "Yes"],
						["Package source", "Compile AUR", "Fedora repos", "Nixpkgs", "Rocky RPMs"],
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
						rich`${bold("Enterprise packages")}: Rocky RPMs are tested in production RHEL deployments`,
						rich`${bold("Programmable recipes")}: Rhai scripts can do anything, not just declare dependencies`,
						rich`${bold("No build dependencies")}: You don't need gcc to install software`,
						rich`${bold("Local LLM ready")}: First-class AI tooling built into the distribution`,
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
						rich`${bold("Fewer packages than AUR")}: Rocky's repository is curated enterprise software. Niche packages require writing recipes.`,
						rich`${bold("Not Nix-level reproducibility")}: A/B + lock files help, but we don't (yet) match NixOS generation semantics.`,
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
						"You prefer enterprise-tested packages over bleeding edge",
						"You want real scripting power in your package manager",
						"You plan to run local AI models and want integrated tooling",
						"You want full control over your system without a guided installer",
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
						rich`${bold("You want a huge package ecosystem")}: AUR has more packages than Rocky repos`,
						rich`${bold("You prefer guided installation")}: Fedora and Ubuntu have better installers`,
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
