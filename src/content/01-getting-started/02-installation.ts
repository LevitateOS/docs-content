import { distroPage } from "../../types";
import { rich, bold, code, link } from "../../rich-text";
import { GUIDE, guideSteps } from "../../install";
import { intendedDifferences, PAGE_TITLES, pageLink } from "../../pages";

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
					content: rich`${bold("A/B by default:")} the disk gets two system slots and a ${code("/var")} state partition. Updates go to the inactive slot and are trial-booted before they are kept. ${bold("Mutable mode")}, one root changed in place, is an explicit opt-in. See ${link("Atomic Updates (A/B)", "/docs/atomic-updates")}.`,
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
						rich`${bold("Partition")} - Create the default A/B layout with ${code("disk-plan")} or ${code("recpart")}: EFI, system slot A, system slot B and the ${code("/var")} state partition`,
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
			title: "The Sibling Distros",
			content: [
				{
					type: "text",
					content:
						"LevitateOS and AcornOS install and update the same way, with the same tools. They are meant to differ only in these:",
				},
				{ type: "table", ...intendedDifferences() },
			],
		},
	],
}));
