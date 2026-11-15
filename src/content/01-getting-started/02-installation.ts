import { distroPage } from "../../types";
import { rich, bold, code, link } from "../../rich-text";
import { GUIDE, guideSteps } from "../../install";
import { DESKTOP_NAME, HARDWARE, intendedDifferences, PAGE_TITLES, pageLink } from "../../pages";

/** What each guide page covers, for the step list. */
const COVERS = {
	"installation-disk": "Boot, identify the disk, partition, format and mount it",
	"installation-base": "Extract with recstrap, generate fstab, inspect the target",
	"installation-config": "Timezone, locale, keymap, hostname, passwords, user account",
	"installation-boot": "Install the boot loader and A/B boot entries, review services, reboot",
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
					content: `Installing ${d.osName} follows the same process as Arch Linux. You boot the live ISO, partition the disk with recpart, extract the system with recstrap, configure it with recsetup, and reboot. No network connection is required.`,
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
						rich`${bold("Boot")} - Boot the live ISO into the install screen: the install steps (${code("install-hub")}), with a shell one key away, beside this guide`,
						rich`${bold("Partition")} - Create the default A/B layout with ${code("disk-plan")} or ${code("recpart")}: EFI, root A, root B and the ${code("/var")} state partition`,
						rich`${bold("Extract")} - Use ${code("recstrap")} to extract the system (like pacstrap)`,
						rich`${bold("Configure")} - Set time zone, locale, keymap, hostname and users with ${code("recsetup")}`,
						rich`${bold("Boot loader")} - Install systemd-boot and the A/B boot entries with ${code("recsetup")}`,
						rich`${bold("Reboot")} - Boot into your new ${d.osName} installation`,
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
					content: rich`${code(d.isoFile)} installs the desktop system: the same base system with ${DESKTOP_NAME[d.profile.desktop]}, whose display manager (${code(d.desktop.displayManager)}) starts at boot once it is installed. It needs ${HARDWARE.ram}. Build it from a checkout like the other ISOs (see ${pageLink("getting-started")} for <distro>); the first command downloads the desktop's locked packages:`,
				},
				{
					type: "code",
					language: "bash",
					content: `cargo xtask build rootfs-source <distro> --desktop
cargo xtask build release <distro>`,
				},
				{
					type: "text",
					content: rich`It boots like the other ISOs: into the install screen on the first virtual console and the serial console, with no desktop yet, so every step of this guide is the same. ${code("recstrap")} extracts the desktop system, and after the reboot the display manager asks for the account you made with ${code("recsetup")}.`,
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
