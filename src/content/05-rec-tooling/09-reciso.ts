import type { DocsContent } from "../../types"
import { rich, code, link } from "../../rich-text"
import { TOOL_HELP } from "../../tool-help"

export const recisoContent: DocsContent = {
	title: "reciso",
	meta: {
		product: "shared",
		scopes: ["reference"],
		audience: ["developer"],
		stability: "experimental",
	},
	intro: "Create bootable UEFI ISOs from kernel, initramfs, and EROFS rootfs.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`${code("reciso")} builds UEFI bootable media and can include prebuilt UKIs or build UKIs inline.`,
				},
				{
					type: "note",
					variant: "info",
					content: rich`Current implementation is marked beta in tool-local docs.`,
				},
			],
		},
		{
			title: "Usage",
			content: [
				{
					type: "text",
					content: rich`Options as printed by ${code("reciso --help")}:`,
				},
				{
					type: "code",
					language: "text",
					content: TOOL_HELP.reciso,
				},
			],
		},
		{
			title: "Requirements",
			content: [
				{
					type: "list",
					items: [
						rich`${code("systemd-boot")}`,
						rich`${code("xorriso")}`,
						rich`${code("mtools")}`,
						rich`${code("ukify")} (only when building UKIs inline)`,
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
						rich`${link("recinit", "/docs/recinit")} - Build initramfs inputs`,
						rich`${link("recuki", "/docs/recuki")} - Build UKI inputs`,
					],
				},
			],
		},
	],
}
