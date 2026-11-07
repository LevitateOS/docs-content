import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"
import { TOOL_HELP } from "../../tool-help"

export const recukiContent: DocsContent = {
	title: "recuki",
	meta: {
		product: "shared",
		scopes: ["reference"],
		audience: ["developer"],
		stability: "experimental",
	},
	intro: "Build Unified Kernel Images (UKIs) from kernel + initramfs + cmdline.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`${code("recuki")} wraps ${code("ukify")} to produce a single ${code(".efi")} artifact that bundles kernel, initramfs, and command line. The live ISO's boot menu entries are UKIs built this way; systemd-boot finds them on its own.`,
				},
			],
		},
		{
			title: "Usage",
			content: [
				{
					type: "text",
					content: rich`Options as printed by ${code("recuki --help")}:`,
				},
				{
					type: "code",
					language: "text",
					content: TOOL_HELP.recuki,
				},
			],
		},
		{
			title: "Boundaries",
			content: [
				{
					type: "list",
					items: [
						rich`${bold("Does")}: build UKI files`,
						rich`${bold("Does not")}: sign UKIs, install to ESP, or build initramfs`,
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
						rich`${link("recinit", "/docs/recinit")} - Build initramfs`,
						rich`${link("reciso", "/docs/reciso")} - Assemble ISO with UKIs`,
					],
				},
			],
		},
	],
}
