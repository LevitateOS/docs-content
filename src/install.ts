/**
 * The install procedure, written once for every distro: the steps in order, what each
 * one does, the guide section that has it in full, the programs it runs and its
 * commands. The guide pages, install-hub, the install state, disk-plan, base-system,
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

/** A recorded step, in order; recording one drops the ones after it. */
export const RECORDED_STEPS = ["preflight", "disk", "base", "setup", "boot"] as const;
export type RecordedStep = (typeof RECORDED_STEPS)[number];
export type InstallStepId = RecordedStep | "finish";

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
	/** A/B: the two system slots' devices. */
	slot_a: string | null;
	slot_b: string | null;
	/** The device mounted at `target` (mutable: the root device for the boot entry). */
	root_device: string | null;
}

/** What each recorded step leaves for the steps after it. */
export interface StepResults {
	preflight: { uefi: true; media: true };
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
	boot: { mode: InstallMode };
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
		steps: ["Install the Boot Loader and Entries", "Review Services", "Unmount and Reboot"],
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
		`recsetup apply --root ${shellQuote(target)} ${args} --machine-id`,
	service: (target: string, service: string) =>
		`recsetup apply --root ${shellQuote(target)} --service ${service}`,
	/** Unmounts everything under the target, deepest first (busybox umount has no -R). */
	unmount: (disk: DiskResult) =>
		[...disk.mounts]
			.sort((a, b) => b.path.length - a.path.length)
			.map((mount) => `umount ${shellQuote(mount.path)}`),
	reboot: () => "reboot",
	/**
	 * Stages a release into the inactive slot, from its ISO mounted at `iso`: the system
	 * image, the kernel and the initramfs.
	 */
	stage: (d: Facts, iso = "/mnt") =>
		`recab stage --rootfs ${iso}/live/filesystem.erofs --kernel ${iso}/boot/vmlinuz --initrd ${iso}/boot/${d.installedInitramfs}`,
};

/** A check the preflight step makes on the live system: `path` exists. */
export interface Check {
	path: string;
	label: string;
	fix: string;
}

/** How a step is done. */
export type StepRun =
	/** Start the step's app; it records its own result. */
	| { kind: "app"; argv: readonly string[] }
	/** Check the live system; nothing to run. */
	| { kind: "checks"; checks: readonly Check[] }
	/** Run these commands as they are. */
	| { kind: "commands"; lines: readonly string[] }
	/** Not possible yet, and why. */
	| { kind: "unavailable"; why: string };

export interface InstallStep {
	id: InstallStepId;
	title: string;
	/** One line on what the step does. */
	about: string;
	/** Where the guide has the step in full. */
	guide: GuideRef;
	/** The programs the step's commands and apps run, which the live ISO must ship. */
	programs: readonly string[];
	run: StepRun;
}

/** Each step's title and what it does, in order. */
export const STEP_INFO: { [S in InstallStepId]: { title: string; about: string } } = {
	preflight: { title: "Preflight", about: "Check that this machine can take the install." },
	disk: {
		title: "Disk",
		about: "Choose a disk and a layout, then partition, format and mount it.",
	},
	base: { title: "Base system", about: "Copy the system onto the disk and write its fstab." },
	setup: {
		title: "Configuration",
		about: "Time zone, locale, keymap, hostname, root password and a user.",
	},
	boot: {
		title: "Boot",
		about: "Install the boot loader and the boot entries for the disk's layout.",
	},
	finish: {
		title: "Finish",
		about:
			"Unmount the new system and reboot into it. Remove the install media when the machine restarts.",
	},
};

/** What the steps before have recorded. */
export interface InstallContext {
	disk?: DiskResult;
}

/** Every install step, in order, for distro `d` given what the earlier steps recorded. */
export function installSteps(_d: Facts, ctx: InstallContext): InstallStep[] {
	const { disk } = ctx;
	const target = disk?.target;
	const noDisk = (what: string): StepRun => ({
		kind: "unavailable",
		why: `The disk step says ${what}.`,
	});
	const boot = disk ? bootArgs(disk) : null;
	return [
		{
			id: "preflight",
			...STEP_INFO.preflight,
			guide: guideRef("installation-disk", "Boot the Live Environment"),
			programs: [],
			run: {
				kind: "checks",
				checks: [
					{
						path: UEFI_VARS,
						label: "Booted in UEFI mode",
						fix: "Reboot and pick the UEFI entry for the install media in the firmware's boot menu.",
					},
					{
						path: LIVE_ROOTFS,
						label: `Install media mounted (${LIVE_ROOTFS})`,
						fix: "Boot the live ISO again; the system image it installs is missing.",
					},
				],
			},
		},
		{
			id: "disk",
			...STEP_INFO.disk,
			guide: guideRef("installation-disk", "Identify Target Disk"),
			programs: ["disk-plan", "recpart"],
			run: { kind: "app", argv: [commands.diskPlan()] },
		},
		{
			id: "base",
			...STEP_INFO.base,
			guide: guideRef("installation-base", "Extract Base System"),
			programs: ["base-system", "recstrap", "recfstab"],
			run: target
				? { kind: "app", argv: [commands.baseSystem()] }
				: noDisk("where the system goes"),
		},
		{
			id: "setup",
			...STEP_INFO.setup,
			guide: guideRef("installation-config", "Set Timezone, Locale and Keymap"),
			programs: ["system-setup", "recsetup", "recchroot", "loadkeys"],
			run: target ? { kind: "app", argv: [commands.systemSetup()] } : noDisk("where the system is"),
		},
		{
			id: "boot",
			...STEP_INFO.boot,
			guide: guideRef("installation-boot", "Install the Boot Loader and Entries"),
			programs: ["recsetup"],
			run:
				disk && typeof boot === "string"
					? { kind: "commands", lines: [commands.boot(disk.target, boot)] }
					: boot && typeof boot === "object"
						? { kind: "unavailable", why: `Not runnable: ${boot.missing}.` }
						: noDisk("which partitions to boot"),
		},
		{
			id: "finish",
			...STEP_INFO.finish,
			guide: guideRef("installation-boot", "Unmount and Reboot"),
			programs: ["umount", "reboot"],
			run: disk
				? { kind: "commands", lines: [...commands.unmount(disk), commands.reboot()] }
				: noDisk("what to unmount"),
		},
	];
}
