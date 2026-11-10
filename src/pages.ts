/**
 * What the distro pages are written with: the titles of the pages that link to each
 * other, the hardware they need, and the wording each distro fact turns into. A page says
 * a per-distro thing only through one of these, never by the distro's name.
 */
import { DISTROS, type Profile } from "./distros";
import { guideTitle, type GuideSlug } from "./install";
import { link, type InlineLink } from "./rich-text";
import type { DistroFacts } from "./types";

/** The titles of the getting-started pages that are not numbered install steps. */
export const PAGE_TITLES = {
	"getting-started": "Getting Started",
	installation: "Installation",
	"post-installation": "Post-Installation",
	troubleshooting: "Troubleshooting",
} as const;

type PageSlug = keyof typeof PAGE_TITLES | GuideSlug;

/** A link to a getting-started page, labelled with its title. */
export function pageLink(slug: PageSlug, section?: string): InlineLink {
	const title =
		slug in PAGE_TITLES
			? PAGE_TITLES[slug as keyof typeof PAGE_TITLES]
			: guideTitle(slug as GuideSlug);
	return link(section ? `${title}: ${section}` : title, `/docs/${slug}`);
}

/**
 * What every distro needs; the default A/B layout fits the disk. One baseline for both:
 * the kernel is x86_64_defconfig plus distro/variants/_shared/kconfig (NVMe, SATA/AHCI,
 * virtio, USB and MMC storage built in), and no build sets a target CPU above generic x86-64.
 */
export const HARDWARE = {
	cpu: "x86-64",
	cpuNote: "any 64-bit Intel or AMD processor",
	storage: "NVMe, SATA, virtio, USB or SD/MMC",
	firmware: "UEFI, with Secure Boot disabled (the boot files are unsigned)",
	ram: "4 GB (8 GB with the desktop)",
	qemuRam: "4G",
	disk: "64 GB",
} as const;

export const DESKTOP_NAME: Record<Profile["desktop"], string> = {
	plasma: "KDE Plasma",
	lxqt: "LXQt",
};

/** The terminal each desktop opens, where the desktop ISO's install screen runs. */
export const TERMINAL_NAME: Record<Profile["desktop"], string> = {
	plasma: "Konsole",
	lxqt: "QTerminal",
};

export const INIT_NAME: Record<Profile["init"], string> = {
	systemd: "systemd",
	openrc: "OpenRC",
};

export const KERNEL_LINE_NAME: Record<Profile["kernel_line"], string> = {
	lts: "long-term support",
	latest: "latest stable",
};

/**
 * Where root's Recipe keeps its recipes, state and image cache on every installed system:
 * on /var, shared by both A/B slots (distro/builder/os-recipes/install-tools.rhai packages them).
 */
export const RECIPE = {
	recipes: "/var/lib/recipe/recipes",
	state: "/var/lib/recipe/state",
	cache: "/var/cache/recipe",
};

/** The privilege tool's command word: `sudo` or `doas`. */
export function admin(d: DistroFacts): string {
	return d.profile.privilege;
}

/** Starting, enabling and checking a service, through the init system. */
export function services(d: DistroFacts) {
	const root = admin(d);
	return d.profile.init === "systemd"
		? {
				list: "systemctl list-units --type=service",
				enable: (name: string) => [`${root} systemctl enable --now ${name}`],
				status: (name: string) => `systemctl status ${name}`,
			}
		: {
				list: "rc-status --all",
				enable: (name: string) => [
					`${root} rc-update add ${name} default`,
					`${root} rc-service ${name} start`,
				],
				status: (name: string) => `rc-service ${name} status`,
			};
}

/**
 * The network stack, live and installed: NetworkManager with wpa_supplicant on both
 * siblings. Only the service name differs, by init system.
 */
export function network(d: DistroFacts) {
	const daemon = d.profile.init === "systemd" ? "NetworkManager" : "networkmanager";
	return {
		wired: "NetworkManager configures a wired connection by itself.",
		listWifi: "nmcli device wifi list",
		connectWifi: ['nmcli --ask device wifi connect "YOUR_NETWORK"'],
		/** Commands that keep the live session's saved networks on the installed system at `target`. */
		keepWifi: (target: string): string[] => [
			`cp -a /etc/NetworkManager/system-connections/. ${target}/etc/NetworkManager/system-connections/`,
		],
		daemon,
		firmware: "If no wireless device appears, the card may need firmware the system does not ship.",
	};
}

/** The differences between the siblings that are intended: privilege tool, desktop and kernel line. */
export function intendedDifferences(): { headers: string[]; rows: string[][] } {
	return {
		headers: ["", ...DISTROS.map((distro) => distro.osName)],
		rows: [
			["Administrator commands", ...DISTROS.map((distro) => distro.profile.privilege)],
			["Desktop edition", ...DISTROS.map((distro) => DESKTOP_NAME[distro.profile.desktop])],
			[
				"Kernel",
				...DISTROS.map(
					(distro) => `${distro.kernel.version} (${KERNEL_LINE_NAME[distro.profile.kernel_line]})`,
				),
			],
		],
	};
}
