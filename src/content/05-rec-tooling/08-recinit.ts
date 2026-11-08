import type { DocsContent } from "../../types";
import { rich, bold, code, link } from "../../rich-text";
import { TOOL_HELP } from "../../tool-help";

export default {
	title: "recinit",
	intro: "Rootless initramfs builder for the live ISO and installed systems.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`${code("recinit")} builds initramfs images without requiring root or external generators such as dracut or mkinitcpio. It writes the CPIO archive itself, resolves boot modules against the kernel's ${code("modules.dep")}, and stores them in load order.`,
				},
				{
					type: "table",
					headers: ["Command", "Purpose"],
					rows: [
						[
							rich`${code("build-tiny")}`,
							"Build the live ISO initramfs (busybox-based): find the boot medium, mount the EROFS rootfs and live overlay, switch_root",
						],
						[
							rich`${code("build-install")}`,
							"Build an initramfs for booting an installed system from disk (systemd-based)",
						],
						[rich`${code("modules")}`, "List module presets and the modules in each"],
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
						rich`${bold("Tiny/live")}: takes the kernel's module tree, a static busybox and the ISO label; the init template is built in (${code("--template")} replaces it)`,
						rich`${bold("Install")}: takes the staged rootfs, its module tree and a static busybox for the emergency shell; firmware is copied unless ${code("--no-firmware")}`,
						rich`${bold("Preset control")}: named presets (${code("live")}, ${code("install")}) or a comma-separated module list`,
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
						rich`${link("reciso", "/docs/reciso")} - Build bootable ISO`,
					],
				},
			],
		},
	],
} satisfies DocsContent;
