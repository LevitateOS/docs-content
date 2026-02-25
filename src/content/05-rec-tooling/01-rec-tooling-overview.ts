import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"

export const recToolingOverviewContent: DocsContent = {
	title: "rec* Tooling Overview",
	meta: {
		product: "shared",
		scopes: ["reference"],
		audience: ["operator", "developer"],
		stability: "experimental",
	},
	intro: "Repository-wide inventory of rec* tooling, with explicit status and boundaries.",
	sections: [
		{
			title: "Context",
			content: [
				{
					type: "text",
					content: rich`The installer trio (${code("recstrap")}, ${code("recfstab")}, ${code("recchroot")}) remains the primary manual install path. This section covers the broader ${code("rec*")} tool surface so the docs reflect the real repository.`,
				},
				{
					type: "note",
					variant: "warning",
					content: rich`${bold("Status matters")}: not all tools here are equally mature. Each page calls out whether the tool is stable, beta, experimental, scaffold, or draft.`,
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
					headers: ["Tool", "Surface", "Primary Use", "Status"],
					rows: [
						[rich`${link("recab", "/docs/recab")}`, "CLI", "A/B slot state machine", "Scaffold"],
						[
							rich`${link("recart", "/docs/recart")}`,
							"CLI",
							"Artifact-store management",
							"Experimental",
						],
						[
							rich`${link("recchroot", "/docs/recchroot")}`,
							"CLI",
							"Chroot with bind mounts",
							"Stable (installer)",
						],
						[
							rich`${link("recfstab", "/docs/recfstab")}`,
							"CLI",
							"Generate fstab entries",
							"Stable (installer)",
						],
						[
							rich`${link("recguard", "/docs/recguard")}`,
							"Spec (no binary yet)",
							"Mutability policy verification",
							"Draft",
						],
						[
							rich`${link("recinit", "/docs/recinit")}`,
							"CLI + library",
							"Initramfs builder",
							"Experimental",
						],
						[rich`${link("reciso", "/docs/reciso")}`, "CLI + library", "UEFI ISO builder", "Beta"],
						[
							rich`${link("recpart", "/docs/recpart")}`,
							"CLI + backend",
							"Disk plan/apply backend",
							"Experimental",
						],
						[
							rich`${link("recqemu", "/docs/recqemu")}`,
							"Library",
							"QEMU command/process helpers",
							"Beta (library-only)",
						],
						[
							rich`${link("recstrap", "/docs/recstrap")}`,
							"CLI",
							"Extract installed rootfs",
							"Stable (installer)",
						],
						[
							rich`${link("recuki", "/docs/recuki")}`,
							"CLI + library",
							"Unified Kernel Image builder",
							"Beta",
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
						rich`${bold("Installer-facing")}: ${code("recstrap")}, ${code("recfstab")}, ${code("recchroot")}`,
						rich`${bold("Partition backend")}: ${code("recpart")} (plan/apply and handoff only)`,
						rich`${bold("Build pipeline")}: ${code("recinit")}, ${code("recuki")}, ${code("reciso")}`,
						rich`${bold("Infra/automation")}: ${code("recqemu")}, ${code("recart")}`,
						rich`${bold("A/B and policy control-plane")}: ${code("recab")}, ${code("recguard")}`,
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
						rich`${link("Installation Tools Overview", "/docs/installation-tools-overview")} - Installer trio`,
						rich`${link("recipe CLI Reference", "/docs/cli-reference")} - Package manager CLI`,
					],
				},
			],
		},
	],
}
