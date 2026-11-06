import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"
import { TOOL_HELP } from "../../tool-help"

export const recinitContent: DocsContent = {
	title: "recinit",
	meta: {
		product: "shared",
		scopes: ["reference"],
		audience: ["developer"],
		stability: "experimental",
	},
	intro: "Rootless initramfs builder for live and installed-system boot paths.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`${code("recinit")} builds initramfs images without requiring root or external generator frameworks.`,
				},
				{
					type: "table",
					headers: ["Command", "Purpose"],
					rows: [
						[rich`${code("build-tiny")}`, "Build live/tiny initramfs (busybox-based)"],
						[rich`${code("build-install")}`, "Build install initramfs (systemd-based)"],
						[rich`${code("modules")}`, "Inspect module presets"],
					],
					monospaceCol: 0,
				},
			],
		},
		{
			title: "Usage",
			content: [
				{
					type: "text",
					content: rich`Options as printed by ${code("recinit --help")}:`,
				},
				{
					type: "code",
					language: "text",
					content: TOOL_HELP.recinit,
				},
			],
		},
		{
			title: "Notes",
			content: [
				{
					type: "list",
					items: [
						rich`${bold("Tiny/live")}: expects busybox + init template inputs`,
						rich`${bold("Install")}: expects staged rootfs and module set`,
						rich`${bold("Preset control")}: supports named presets plus custom comma-separated module lists`,
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
						rich`${link("recuki", "/docs/recuki")} - Build UKIs`,
						rich`${link("reciso", "/docs/reciso")} - Build bootable ISO`,
					],
				},
			],
		},
	],
}
