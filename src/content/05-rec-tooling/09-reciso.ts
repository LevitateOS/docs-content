import type { DocsContent } from "../../types"
import { rich, code, link } from "../../rich-text"

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
					type: "code",
					language: "bash",
					content: "reciso -k <KERNEL> -i <INITRD> -r <ROOTFS> -l <LABEL> -o <OUTPUT> [OPTIONS]",
				},
				{
					type: "command",
					language: "bash",
					description: "Basic ISO build",
					command:
						"reciso -k vmlinuz -i initramfs.img -r filesystem.erofs -l LEVITATEOS -o levitate.iso",
				},
				{
					type: "command",
					language: "bash",
					description: "Build ISO and inline UKIs",
					command:
						"reciso -k vmlinuz -i initramfs.img -r filesystem.erofs -l LEVITATEOS --build-uki 'Normal::levitateos.efi' --build-uki 'Emergency:emergency:levitateos-recovery.efi' -o levitate.iso",
				},
				{
					type: "command",
					language: "bash",
					description: "Select payload layout explicitly",
					command:
						"reciso -k vmlinuz -i initramfs.img -r filesystem.erofs -l LEVITATEOS --live-payload-layout appended-partitions -o levitate.iso",
				},
			],
		},
		{
			title: "Important Options",
			content: [
				{
					type: "table",
					headers: ["Option", "Description"],
					rows: [
						[rich`${code("--uki <PATH>")}`, "Include prebuilt UKI (repeatable)"],
						[rich`${code("--build-uki <name:extra_cmdline:filename>")}`, "Build UKI inline"],
						[rich`${code("--extra-file <SRC:DST>")}`, "Add extra payload file to ISO"],
						[rich`${code("--overlay-image <PATH>")}`, "Include live overlay image (EROFS)"],
						[
							rich`${code("--live-payload-layout <iso-files|appended-partitions>")}`,
							"Choose live payload placement strategy",
						],
						[rich`${code("--no-checksum")}`, "Skip checksum generation"],
					],
					monospaceCol: 0,
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
