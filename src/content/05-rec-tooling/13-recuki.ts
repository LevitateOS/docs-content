import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"

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
					content: rich`${code("recuki")} wraps ${code("ukify")} to produce a single ${code(".efi")} artifact that bundles kernel, initramfs, and command line.`,
				},
				{
					type: "note",
					variant: "info",
					content: rich`Current implementation is marked beta in tool-local docs; keep production rollout explicit.`,
				},
			],
		},
		{
			title: "Usage",
			content: [
				{
					type: "code",
					language: "bash",
					content: "recuki -k <KERNEL> -i <INITRD> -c <CMDLINE> -o <OUTPUT> [OPTIONS]",
				},
				{
					type: "command",
					language: "bash",
					description: "Basic UKI build",
					command: "recuki -k vmlinuz -i initramfs.img -c 'root=LABEL=root rw' -o levitateos.efi",
				},
				{
					type: "command",
					language: "bash",
					description: "UKI build with OS branding metadata",
					command:
						"recuki -k vmlinuz -i initramfs.img -c 'root=LABEL=root rw' --os-name LevitateOS --os-id levitateos --os-version 1.0 -o levitateos.efi",
				},
			],
		},
		{
			title: "Key Options",
			content: [
				{
					type: "table",
					headers: ["Option", "Description"],
					rows: [
						[rich`${code("-k, --kernel")}`, "Kernel image path (vmlinuz)"],
						[rich`${code("-i, --initrd")}`, "Initramfs image path"],
						[rich`${code("-c, --cmdline")}`, "Kernel command line"],
						[rich`${code("-o, --output")}`, "Output UKI file path"],
						[rich`${code("--os-name/--os-id/--os-version")}`, "Optional OS branding metadata"],
					],
					monospaceCol: 0,
				},
				{
					type: "text",
					content: rich`${bold("Requirement")}: ${code("ukify")} must be installed.`,
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
