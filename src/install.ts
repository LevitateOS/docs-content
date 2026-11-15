/**
 * The install procedure, written once for every distro: the steps in order, what each
 * one does, the guide section that has it in full, the programs it runs and its
 * commands. The guide pages, the install state, disk-plan, base-system,
 * system-setup and the website all render it, so an install command exists only here.
 *
 * Every command runs on both live userlands (GNU and busybox): no `mount --mkdir`, no
 * `umount -R`, no fdisk dialogue. Per-distro commands are functions of the distro facts.
 */
import type { Distro } from "./distros";

/** A distro's facts; the procedure follows facts, never the distro's id. */
type Facts = Omit<Distro, "id">;

/** The system image the install copies, on the live ISO (recinit's live rootfs). */
export const LIVE_ROOTFS = "/run/live-rootfs.erofs";
/** Exists only when the machine booted in UEFI mode. */
export const UEFI_VARS = "/sys/firmware/efi/efivars";

/** A step whose result a helper app records, in order; recording one drops the ones after it. */
export const RECORDED_STEPS = ["disk", "base", "setup"] as const;
export type RecordedStep = (typeof RECORDED_STEPS)[number];

export type InstallMode = "ab" | "mutable";

/** How every screen and page names each install mode. */
export const MODE_NAME: Record<InstallMode, string> = { ab: "A/B", mutable: "mutable" };

/** The disk step's result: recpart's apply handoff, as the later steps need it. */
export interface DiskResult {
	disk: string;
	mode: InstallMode;
	/** Where the installed system's root is mounted (recstrap's target). */
	target: string;
	/** Every mount under the target, in the order recpart made them. */
	mounts: { path: string; device: string }[];
	/** A/B: the two roots' devices. */
	slot_a: string | null;
	slot_b: string | null;
	/** The device mounted at `target` (mutable: the root device for the boot entry). */
	root_device: string | null;
}

/** What each recorded step leaves for the steps after it. */
export interface StepResults {
	disk: DiskResult;
	base: {
		target: string;
		/** The image recstrap copied; null when recstrap did not say. */
		rootfs: string | null;
		/** Files, directories and links copied; null when recstrap did not say. */
		entries: number | null;
		/** The fstab the generated entries went into. */
		fstab: string;
	};
	setup: {
		/** Typed in a shell and marked done by the user; false when system-setup applied it. */
		manual: boolean;
		/** What system-setup set; null when it set none, or the step was done by hand. */
		hostname: string | null;
		/** The administrator system-setup created. */
		user: string | null;
	};
}

/** A place in the install guide: a page and, optionally, one of its numbered steps. */
export interface GuideRef {
	slug: GuideSlug;
	/** The section's title as the page shows it ("2. Identify Target Disk"). */
	section?: string;
}

/**
 * The install guide's pages, in order, with their numbered steps. The numbers are
 * counted across the pages, so adding a step renumbers every page after it.
 */
export const GUIDE = [
	{
		slug: "installation-disk",
		title: "Disk Preparation",
		steps: [
			"Boot the Live Environment",
			"Identify Target Disk",
			"Plan the Partitions",
			"Partition, Format and Mount",
			"Check the Mounts",
		],
	},
	{
		slug: "installation-base",
		title: "Base System",
		steps: [
			"Verify Installation Media",
			"Extract Base System",
			"Generate fstab",
			"Inspect the New System",
		],
	},
	{
		slug: "installation-config",
		title: "Configuration",
		steps: [
			"Inspect Available Choices",
			"Set Timezone, Locale and Keymap",
			"Set Hostname",
			"Set Root Password",
			"Create User Account",
		],
	},
	{
		slug: "installation-boot",
		title: "Boot & Finish",
		steps: ["Review Services", "Install the Boot Loader and Entries", "Unmount and Reboot"],
	},
] as const;

type GuidePage = (typeof GUIDE)[number];
export type GuideSlug = GuidePage["slug"];
type GuideStep<S extends GuideSlug> = Extract<GuidePage, { slug: S }>["steps"][number];

function firstNumber(slug: GuideSlug): number {
	let n = 1;
	for (const page of GUIDE) {
		if (page.slug === slug) return n;
		n += page.steps.length;
	}
	throw new Error(`no install guide page '${slug}'`);
}

function guidePage(slug: GuideSlug): GuidePage {
	return GUIDE.find((page) => page.slug === slug)!;
}

/** A guide step's numbered title: `guideStep("installation-disk", "Identify Target Disk")` is "2. Identify Target Disk". */
export function guideStep<S extends GuideSlug>(slug: S, step: GuideStep<S>): string {
	const index = (guidePage(slug).steps as readonly string[]).indexOf(step);
	return `${firstNumber(slug) + index}. ${step}`;
}

/** The page's steps as a range, "steps 1-5". */
export function guideSteps(slug: GuideSlug): string {
	const first = firstNumber(slug);
	return `steps ${first}-${first + guidePage(slug).steps.length - 1}`;
}

/** A guide page's title. */
export function guideTitle(slug: GuideSlug): string {
	return guidePage(slug).title;
}

/** The reference to a numbered guide step. */
export function guideRef<S extends GuideSlug>(slug: S, step?: GuideStep<S>): GuideRef {
	return step === undefined ? { slug } : { slug, section: guideStep(slug, step) };
}

/** The disk the guide's examples use: recpart's default A/B layout on /dev/nvme0n1. */
export const EXAMPLE_DISK: DiskResult = {
	disk: "/dev/nvme0n1",
	mode: "ab",
	target: "/mnt",
	mounts: [
		{ path: "/mnt", device: "/dev/nvme0n1p2" },
		{ path: "/mnt/boot", device: "/dev/nvme0n1p1" },
		{ path: "/mnt/var", device: "/dev/nvme0n1p4" },
	],
	slot_a: "/dev/nvme0n1p2",
	slot_b: "/dev/nvme0n1p3",
	root_device: "/dev/nvme0n1p2",
};

/** Example values for the configuration step: the user picks their own. */
export const EXAMPLE_SETUP = {
	timezone: "Europe/Brussels",
	locale: "en_US.UTF-8",
	keymap: "us",
	user: "yourname",
} as const;

/** `word` as one POSIX shell word. */
export function shellQuote(word: string): string {
	return /^[\w@%+=:,./-]+$/.test(word) ? word : `'${word.replace(/'/g, `'\\''`)}'`;
}

/** recsetup's boot arguments for the disk's layout, or why there are none yet. */
export function bootArgs(disk: DiskResult): string | { missing: string } {
	if (disk.mode === "ab") {
		if (!disk.slot_a || !disk.slot_b)
			return { missing: "the disk step recorded no A/B slot devices" };
		return `--boot ab --slot-a ${shellQuote(disk.slot_a)} --slot-b ${shellQuote(disk.slot_b)}`;
	}
	if (!disk.root_device) return { missing: "the disk step recorded no root device" };
	return `--boot mutable --root-device ${shellQuote(disk.root_device)}`;
}

/** The install's commands; every consumer builds its lines from these. */
export const commands = {
	uefiCheck: () => `ls ${UEFI_VARS}`,
	mediaCheck: () => `ls -la ${LIVE_ROOTFS}`,
	/** Loads a console keymap in the live session (kbd's `loadkeys`, on every image). */
	liveKeymap: (_d: Facts, map: string) => `loadkeys ${map}`,
	diskPlan: () => "disk-plan",
	/** recpart's apply on the whole disk; `--dry-run` shows the steps and any refusal. */
	partition: (disk: string, dryRun = false) =>
		`recpart apply --disk ${shellQuote(disk)} ${dryRun ? "--dry-run" : "--confirm DESTROY"}`,
	baseSystem: () => "base-system",
	systemSetup: () => "system-setup",
	extract: (target: string) => `recstrap ${shellQuote(target)}`,
	fstab: (target: string) => `recfstab --write ${shellQuote(target)}`,
	inspect: (target: string, json = false) =>
		`recsetup inspect --root ${shellQuote(target)}${json ? " --json" : ""}`,
	configure: (
		target: string,
		choice: { timezone?: string; locale?: string; keymap?: string; hostname?: string },
		verb: "apply" | "plan" = "apply",
	) =>
		[
			`recsetup ${verb} --root ${shellQuote(target)}`,
			choice.timezone && `--timezone ${shellQuote(choice.timezone)}`,
			choice.locale && `--locale ${shellQuote(choice.locale)}`,
			choice.keymap && `--keymap ${shellQuote(choice.keymap)}`,
			choice.hostname && `--hostname ${shellQuote(choice.hostname)}`,
		]
			.filter(Boolean)
			.join(" "),
	password: (target: string, user?: string) =>
		`recchroot ${shellQuote(target)} -- passwd${user ? ` ${shellQuote(user)}` : ""}`,
	/** Creates an administrator without putting a password in the request; `passwd` sets it after. */
	createUser: (target: string, user: string) => [
		`printf '%s\\n' '{"users":[{"name":"${user}","admin":true,"password":false}]}' > /tmp/user-setup.json`,
		`recsetup apply --root ${shellQuote(target)} --request /tmp/user-setup.json`,
	],
	boot: (target: string, args: string) =>
		`recsetup apply --root ${shellQuote(target)} ${args} --machine-id${args.includes("--boot ab") ? ` && recab verify-installation --root ${shellQuote(target)}` : ""}`,
	service: (target: string, service: string) =>
		`recsetup apply --root ${shellQuote(target)} --service ${service}`,
	/** Unmounts everything under the target, deepest first (busybox umount has no -R). */
	unmount: (disk: DiskResult) =>
		[...disk.mounts]
			.sort((a, b) => b.path.length - a.path.length)
			.map((mount) => `umount ${shellQuote(mount.path)}`),
	reboot: () => "reboot",
};
