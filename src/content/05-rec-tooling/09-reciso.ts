import type { DocsContent } from "../../types";
import { rich, code, link } from "../../rich-text";
import { TOOL_HELP } from "../../tool-help";

export default {
	title: "reciso",
	intro: "Create bootable UEFI ISOs from kernel, initramfs, and EROFS rootfs.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`${code("reciso")} builds UEFI bootable media with systemd-boot, and can include prebuilt UKIs or build them inline. By default the rootfs and live overlay images are appended to the ISO as GPT partitions, which the live initramfs mounts directly; ${code("--live-payload-layout iso-files")} keeps them as files under ${code("live/")} instead. A ${code(".sha512")} checksum is written next to the ISO unless ${code("--no-checksum")}.`,
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
					],
				},
			],
		},
	],
} satisfies DocsContent;
