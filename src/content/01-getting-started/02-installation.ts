import { distroPage } from "../../types";
import { rich, bold, code, link } from "../../rich-text";
import { GUIDE, guideSteps } from "../../install";
import { DESKTOP_NAME, HARDWARE, intendedDifferences, PAGE_TITLES, pageLink } from "../../pages";

/** What each guide page covers, for the step list. */
const COVERS = {
	"installation-disk": "Boot, identify the disk, partition, format and mount it",
	"installation-base": "Extract with recstrap, generate fstab, inspect the target",
	"installation-config": "Timezone, locale, keymap, hostname, passwords, user account",
	"installation-boot":
		"Required after the helper apps: write the boot files and entries, verify, unmount, reboot",
} as const;

export default distroPage((d) => ({
	title: PAGE_TITLES.installation,
	intro: `Step-by-step guide to installing ${d.osName} from the live environment.`,
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: `Installing ${d.osName} follows the same process as Arch Linux. You boot the live ISO, partition the disk with recpart, extract the system with recstrap, configure it with recsetup, write the boot files, and reboot. No network connection is required.`,
				},
				{
					type: "note",
					variant: "info",
					content: rich`${bold("Helper app or by hand, never both.")} Each of the first three parts has a helper app (${code("disk-plan")}, ${code("base-system")}, ${code("system-setup")}) and the plain commands it runs. Use the helper ${bold("or")} the commands. Where a helper did the work, the manual sections that follow it say ${bold("Skip this - only if doing it by hand")}.`,
				},
				{
					type: "note",
					variant: "warning",
					content: rich`${bold("The helper apps do not install the system.")} After ${code("disk-plan")}, ${code("base-system")} and ${code("system-setup")}, the machine still has no boot files. The Boot and Finish steps (${pageLink("installation-boot")}) are required: the installation is complete only when the boot files and entries are on the EFI partition and the verification has passed.`,
				},
				{
					type: "note",
					variant: "info",
					content: rich`${bold("A/B by default:")} the disk gets two roots, A and B, and a ${code("/var")} state partition. The booted root is locked; changes are made in the other root. ${bold("Mutable mode")}, one root changed in place, is an explicit opt-in. See ${link("A/B Roots", "/docs/atomic-updates")}.`,
				},
			],
		},
		{
			title: "What You'll Do",
			content: [
				{
					type: "list",
					items: [
						rich`${bold("Boot")} - Boot the live ISO into the install screen: a root terminal on the left, this guide on the right (Ctrl-] switches panes)`,
						rich`${bold("Partition")} - Create the default A/B layout with ${code("disk-plan")}, or by hand with ${code("recpart")}: EFI, root A, root B and the ${code("/var")} state partition`,
						rich`${bold("Extract")} - ${code("base-system")}, or by hand ${code("recstrap")} (like pacstrap) and ${code("recfstab")}`,
						rich`${bold("Configure")} - ${code("system-setup")}, or by hand ${code("recsetup")}: time zone, locale, keymap, hostname and users`,
						rich`${bold("Boot loader (required, no helper app)")} - ${code("recsetup")} installs systemd-boot and the boot entries on the EFI partition, then verification checks them`,
						rich`${bold("Finish (required)")} - Unmount, reboot, and remove the install media. Only now is ${d.osName} installed`,
					],
				},
			],
		},
		{
			title: "Installation Steps",
			content: [
				{
					type: "list",
					items: GUIDE.map(
						(page) =>
							rich`${pageLink(page.slug)} - ${COVERS[page.slug]} (${guideSteps(page.slug)})`,
					),
				},
			],
		},
		{
			title: "After Installation: The Desktop",
			content: [
				{
					type: "text",
					content: rich`${code(d.isoFile)} installs the same base system as every ISO, then its default software set: ${d.desktop.recipes.length} group recipes, ${DESKTOP_NAME[d.profile.desktop]} and its apps among them, which ${code("recsetup")}'s software step installs through Recipe, offline from the medium, each with a Recipe receipt, so you can remove or replace any of them later like any other software. It needs ${HARDWARE.ram}. Build it from a checkout like the other ISOs (see ${pageLink("getting-started")} for <distro>); the first command downloads the packages the group recipes pin:`,
				},
				{
					type: "code",
					language: "bash",
					content: `cargo xtask build rootfs-source <distro> --desktop
cargo xtask build release <distro>`,
				},
				{
					type: "text",
					content: rich`It boots like the other ISOs: into the install screen on the first virtual console and the serial console, with no desktop, so every step of this guide is the same. ${code("recstrap")} extracts the base system; ${code("recsetup")} installs the default set into it first (its software step, before the accounts and the boot step), and after the reboot the display manager asks for the account you made with ${code("recsetup")}.`,
				},
			],
		},
		{
			title: "The Sibling Distros",
			content: [
				{
					type: "text",
					content:
						"LevitateOS and AcornOS install the same way, with the same tools. They are meant to differ only in these:",
				},
				{ type: "table", ...intendedDifferences() },
			],
		},
	],
}));
