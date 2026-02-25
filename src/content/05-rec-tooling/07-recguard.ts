import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"

export const recguardContent: DocsContent = {
	title: "recguard",
	meta: {
		product: "shared",
		scopes: ["reference"],
		audience: ["operator", "developer"],
		stability: "experimental",
	},
	intro: "Policy enforcement spec for installed-system mutability models.",
	sections: [
		{
			title: "Current Status",
			content: [
				{
					type: "note",
					variant: "warning",
					content: rich`${code("recguard")} currently exists as requirements/spec documentation. There is no implemented Rust crate or CLI binary in this repository yet.`,
				},
				{
					type: "text",
					content: rich`Canonical spec source: ${code("tools/recguard/REQUIREMENTS.md")}.`,
				},
			],
		},
		{
			title: "Intended Boundary",
			content: [
				{
					type: "list",
					items: [
						rich`${bold("Intended role")}: verify observed system state against declared mutability policy`,
						rich`${bold("Does not")}: partition disks (${code("recpart")})`,
						rich`${bold("Does not")}: extract payloads (${code("recstrap")})`,
						rich`${bold("Does not")}: perform slot transitions (${code("recab")})`,
					],
				},
			],
		},
		{
			title: "Why This Page Exists",
			content: [
				{
					type: "text",
					content:
						"To make the tool inventory explicit and remove hidden gaps between repository surface and published docs.",
				},
			],
		},
		{
			title: "See Also",
			content: [
				{
					type: "list",
					items: [
						rich`${link("recab", "/docs/recab")} - A/B state-machine scaffold`,
						rich`${link("recpart", "/docs/recpart")} - Partition plan/apply backend`,
					],
				},
			],
		},
	],
}
