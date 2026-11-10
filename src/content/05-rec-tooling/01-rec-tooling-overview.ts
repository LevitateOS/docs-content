import type { DocsContent } from "../../types";
import { rich, bold, code, link } from "../../rich-text";

export default {
	title: "rec* Tooling Overview",
	intro: "Inventory of the rec* tools: what each one does and where it runs.",
	sections: [
		{
			title: "Context",
			content: [
				{
					type: "text",
					content: rich`The install tools (${code("recpart")}, ${code("recstrap")}, ${code("recfstab")}, ${code("recsetup")}, ${code("recchroot")}) are the manual install path, and the backends of the install screen's step apps. ${code("recab")} manages A/B updates on the installed system. The rest build the boot artifacts and drive the test VMs.`,
				},
			],
		},
		{
			title: "Tool Matrix",
			content: [
				{
					type: "text",
					content: rich`Ordered canonically by tool name.`,
				},
				{
					type: "table",
					headers: ["Tool", "Surface", "Primary Use", "Runs On"],
					rows: [
						[
							rich`${link("recab", "/docs/recab")}`,
							"CLI",
							"System updates and symmetric A/B continuation",
							"Installed system",
						],
						[
							rich`${link("recchroot", "/docs/recchroot")}`,
							"CLI",
							"Chroot with bind mounts",
							"Live ISO",
						],
						[
							rich`${link("recfstab", "/docs/recfstab")}`,
							"CLI",
							"Generate fstab entries",
							"Live ISO",
						],
						[
							rich`${link("recinit", "/docs/recinit")}`,
							"CLI + library",
							"Initramfs builder",
							"Build host",
						],
						[
							rich`${link("reciso", "/docs/reciso")}`,
							"CLI + library",
							"UEFI ISO builder",
							"Build host",
						],
						[
							rich`${link("recpart", "/docs/recpart")}`,
							"CLI + backend",
							"Disk inspect/plan/apply backend",
							"Live ISO",
						],
						[
							rich`${link("recqemu", "/docs/recqemu")}`,
							"Library",
							"Scenario VMs as libvirt domains, serial console",
							"Build host",
						],
						[
							rich`${link("recsetup", "/docs/recsetup")}`,
							"CLI + backend",
							"Configure and boot the installed system",
							"Live ISO",
						],
						["recshuttle", "Library", "SSH transport to scenario VMs", "Build host"],
						[
							rich`${link("recstrap", "/docs/recstrap")}`,
							"CLI",
							"Extract the system image",
							"Live ISO and installed system (used by recab stage)",
						],
					],
					monospaceCol: 0,
				},
			],
		},
		{
			title: "Boundaries",
			content: [
				{
					type: "list",
					items: [
						rich`${bold("Installer-facing")}: ${code("recstrap")}, ${code("recfstab")}, ${code("recchroot")}, ${code("recsetup")}`,
						rich`${bold("Partition backend")}: ${code("recpart")} (inspect/plan/apply and handoff only)`,
						rich`${bold("Build pipeline")}: ${code("recinit")}, ${code("reciso")}`,
						rich`${bold("Test VMs")}: ${code("recqemu")}, ${code("recshuttle")}`,
						rich`${bold("System updates and continuation")}: ${code("recab")}, using Recipe for software operations in the prepared system`,
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
						rich`${link("Installation Tools Overview", "/docs/installation-tools-overview")} - The install tools in order`,
						rich`${link("recipe CLI Reference", "/docs/cli-reference")} - Package manager CLI`,
					],
				},
			],
		},
	],
} satisfies DocsContent;
