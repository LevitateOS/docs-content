import type { DocsContent } from "../../types";
import { rich, code, bold, link } from "../../rich-text";
import { HARDWARE } from "../../pages";

export default {
	title: "Architecture FAQ",
	intro:
		"Design decisions and rationale behind LevitateOS components. Each answer explains why we chose a particular approach over alternatives.",
	sections: [
		{
			title: "Core Philosophy",
			content: [
				{
					type: "qa",
					items: [
						{
							question: "What is LevitateOS and why does it exist?",
							answer: [
								{
									type: "text",
									content: rich`LevitateOS is a daily driver Linux distribution competing directly with Arch Linux. It borrows Arch's philosophy (you maintain your own packages on a minimal base) but takes its core system (glibc, systemd, coreutils, OpenSSH and the rest of a minimal base) pre-built from Fedora instead of compiling it, and it updates atomically: A/B slots by default, with a trial boot before each update is kept.`,
								},
								{
									type: "table",
									headers: ["Dimension", "Arch Linux", "LevitateOS"],
									rows: [
										["Target User", "Power users seeking control", "Same"],
										["Philosophy", "Minimal base, user builds", "Same"],
										["Package Manager", "pacman + AUR", "recipe (Rhai scripts)"],
										[
											"Binary Source",
											"Compiled from source",
											"Core extracted from signed Fedora RPMs",
										],
										["Updates", "In place", "A/B slots, trial boot, rollback"],
										["Build Time", "Hours (compiling)", "Minutes (extracting)"],
									],
								},
								{
									type: "text",
									content: rich`Its sibling ${bold("AcornOS")} is built by the same pipeline on musl, OpenRC and busybox, from Alpine packages. See ${link("Variants", "/docs/variants")}.`,
								},
							],
						},
						{
							question: "Why not just use Arch?",
							answer: [
								{
									type: "text",
									content:
										"Arch requires compiling AUR packages. That means build dependencies, compiler toolchains, and waiting. LevitateOS extracts its core from signed Fedora RPMs in minutes. Same philosophy, less waiting.",
								},
								{
									type: "text",
									content:
										"If you want to compile everything yourself, use Arch. If you want the same control without the compilation overhead, use LevitateOS.",
								},
							],
						},
						{
							question: "Why not Fedora?",
							answer: [
								{
									type: "text",
									content:
										"Fedora is GNOME-focused and opinionated. It makes choices for you. LevitateOS is a base system - you build what you want on top of it.",
								},
								{
									type: "text",
									content:
										"Fedora ships a complete desktop experience. LevitateOS ships a foundation. Different goals, different users.",
								},
							],
						},
						{
							question: "What is LevitateOS NOT?",
							answer: [
								{
									type: "list",
									items: [
										"An embedded OS (too small, missing capabilities)",
										"A container base image",
										"A server-only distro",
										"A resource-constrained system",
									],
								},
								{
									type: "text",
									content:
										"LevitateOS targets modern desktop and workstation hardware with full capabilities.",
								},
							],
						},
						{
							question: "What are the system requirements?",
							answer: [
								{
									type: "table",
									headers: ["Component", "Baseline"],
									rows: [
										["CPU", `${HARDWARE.cpu} (${HARDWARE.cpuNote})`],
										["RAM", HARDWARE.ram],
										["Storage", `${HARDWARE.disk}, on ${HARDWARE.storage}`],
										["Firmware", HARDWARE.firmware],
									],
								},
							],
						},
						{
							question: "Is this just a hobby project?",
							answer: [
								{
									type: "text",
									content: "Boot the ISO. Run the scenarios. Read the commit history. Code speaks.",
								},
								{
									type: "text",
									content: rich`The scenarios boot the live ISO, install it, reboot into the installed system, log in and check it at runtime, and stage, trial-boot and roll back an A/B update, all in VMs. If something doesn't work, open an issue with specifics.`,
								},
							],
						},
					],
				},
			],
		},
		{
			title: "distro-builder (ISO Builder)",
			content: [
				{
					type: "qa",
					items: [
						{
							question: "Why take the base from Fedora instead of building it from source?",
							answer: [
								{
									type: "list",
									items: [
										rich`${bold("Current, maintained packages")}: Fedora's release plus its security updates`,
										rich`${bold("glibc-based")} (not musl) for maximum compatibility`,
										rich`${bold("No compilation required")} - binaries are pre-built`,
										rich`${bold("Builds in minutes")} instead of hours`,
										rich`${bold("Direct RPM extraction")}: the system recipe unpacks a locked set of packages into the root filesystem itself, recording each file's owner and mode without root. No package manager is involved`,
									],
								},
								{
									type: "text",
									content:
										"Fedora keeps the toolchain and libraries current, which matters for a desktop where users build new software, and the A/B slots make moving to each new Fedora release cheap to undo.",
								},
							],
						},
						{
							question: "How do I know the RPMs are safe?",
							answer: [
								{
									type: "text",
									content: rich`They're Fedora's own signed builds. ${code("cargo xtask base lock")} picks each package from Fedora's release and updates repositories and checks it against the repository checksum and the release's signing key before it is locked; builds then verify every RPM against the locked SHA256.`,
								},
								{
									type: "text",
									content:
										"We don't recompile packages. We don't inject code. We don't modify binaries. We extract what Fedora ships.",
								},
							],
						},
						{
							question: "Why use EROFS instead of a large initramfs?",
							answer: [
								{
									type: "text",
									content:
										"Loading the whole system into RAM as one large initramfs wastes memory and duplicates the system. The EROFS architecture provides:",
								},
								{
									type: "list",
									items: [
										rich`${bold("RAM savings")}: the system is read from the medium, not unpacked into memory`,
										rich`${bold("Single source of truth")}: Live environment = Installed system (no duplication)`,
										rich`${bold("Simpler installation")}: ${code("recstrap")} extracts the same image to disk`,
										rich`${bold("Scalable")}: Easy to add packages without bloating initramfs`,
									],
								},
								{
									type: "text",
									content: rich`The live initramfs, built by ${code("recinit")}, contains just busybox, the boot modules and mount logic. It mounts the EROFS system image read-only, with the live overlay image and a tmpfs on top, and switches into it.`,
								},
							],
						},
						{
							question: "How does LevitateOS boot?",
							answer: [
								{
									type: "list",
									items: [
										rich`${bold("systemd-boot everywhere")} - no GRUB or isolinux`,
										rich`${bold("Live ISO")}: Unified Kernel Images built by ${code("reciso")}, each one PE binary holding the kernel, initramfs and command line, which systemd-boot finds on its own`,
										rich`${bold("Installed system")}: one boot entry per slot, naming the slot's kernel and initramfs in ${code("/boot/levitateos-a/")} or ${code("/boot/levitateos-b/")} and its root by ${code("root=PARTUUID=")}. ${code("recab")} rewrites a slot's kernel and trial options without touching the other slot`,
									],
								},
							],
						},
						{
							question: "Why UEFI-only (no BIOS support)?",
							answer: [
								{
									type: "text",
									content:
										"LevitateOS targets modern hardware (2013+). UEFI has been standard for over a decade. Dropping BIOS support allows:",
								},
								{
									type: "list",
									items: [
										rich`${bold("Clean boot stack")} - systemd-boot only, no GRUB or isolinux complexity`,
										rich`${bold("A/B boot selection")} - recab picks the next slot through systemd-boot's EFI variables`,
										rich`${bold("Simpler code")} - One boot path to test and maintain`,
									],
								},
								{
									type: "text",
									content:
										"If you have hardware from before 2013 that lacks UEFI, LevitateOS is not the right distribution for you.",
								},
							],
						},
						{
							question: "How are boot modules loaded?",
							answer: [
								{
									type: "text",
									content: rich`${code("recinit")} reads the kernel's ${code("modules.dep")} when it builds the initramfs and stores the boot modules in dependency order, so the init simply loads them in that order:`,
								},
								{
									type: "code",
									language: "bash",
									content: `# Before (fragile - hand-maintained order)
load_module mbcache
load_module jbd2      # Must come after mbcache
load_module ext4      # Must come after jbd2

# After (resolved at build time against the exact kernel)
recinit build-tiny --modules-dir /lib/modules/6.12.0 ...   # ext4 brings mbcache and jbd2, in order`,
								},
								{
									type: "text",
									content:
										"Benefits: No manual ordering, kernel updates won't break boot, easy to add new modules.",
								},
							],
						},
						{
							question: "Why readelf instead of ldd for library detection?",
							answer: [
								{
									type: "text",
									content: rich`${code("ldd")} executes binaries with the host dynamic linker - broken for cross-compilation:`,
								},
								{
									type: "code",
									language: "rust",
									content: `// Before (broken for cross-compilation)
let ldd_output = Command::new("ldd").arg(&bin_path).output();
// If host is musl and target is glibc → wrong libraries

// After (works everywhere)
let libs = get_all_dependencies(&ctx.rootfs, &bin_path)?;
// Reads ELF headers directly - no execution`,
								},
								{
									type: "text",
									content:
										"readelf reads ELF NEEDED entries directly from the file. No execution, no dynamic linker involvement. Works for any architecture on any host.",
								},
							],
						},
					],
				},
			],
		},
		{
			title: "recipe (Package Manager)",
			content: [
				{
					type: "qa",
					items: [
						{
							question: "Why Rhai instead of Python, Lua, or YAML?",
							answer: [
								{
									type: "text",
									content:
										"YAML isn't a programming language - you can't write conditionals or loops. Python has dependency hell and isn't embeddable without significant overhead. Lua lacks a standard library. Rhai is Rust-native, sandboxed, and actually programmable.",
								},
								{
									type: "text",
									content: rich`This complete offline recipe copies an explicitly supplied script. Save it as ${code("copy-program.rhai")}, supply your script file, and run ${code("recipe install ./copy-program.rhai --input script=./script.sh")}. The returned program path is the validated publication.`,
								},
								{
									type: "code",
									language: "rhai",
									filename: "copy-program.rhai",
									content: `const RECIPE_API = 2;
const NEEDS = #{ inputs: #{ script: "file" }, outputs: #{ program: "file" } };
let ctx = #{ name: "copy-program", program: join_path(RUNTIME.paths.output, "bin/program") };
fn is_acquired(ctx) { ready(ctx) }
fn is_built(ctx) { ready(ctx) }
fn is_installed(ctx) {
    if !is_file(ctx.program) { return needs_work(ctx, "program is missing"); }
    if read_file(ctx.program) != read_file("/inputs/script") {
        return needs_work(ctx, "program has different bytes");
    }
    ctx.outputs.program = ctx.program; ready(ctx)
}
fn install(ctx) {
    mkdir(dirname(ctx.program)); copy_file("/inputs/script", ctx.program);
    chmod(ctx.program, 0o755); ctx.outputs.program = ctx.program; ctx
}`,
								},
								{
									type: "list",
									items: [
										rich`${bold("Real programming")} - Variables, conditionals, loops, functions`,
										rich`${bold("Infinite extensibility")} - Recipes define logic, not just data`,
										rich`${bold("Minimal implementation")} - The executor provides helpers, runs the readiness checks and calls acquire(), build() and install()`,
										rich`${bold("Isolated")} - Every recipe runs inside a Ginux build domain, never on the host`,
									],
								},
							],
						},
						{
							question: "Where does recipe keep its state?",
							answer: [
								{
									type: "text",
									content: rich`Recipe files are never rewritten. The only state a recipe carries between runs is ${code("ctx.state")}, saved by the coordinator together with a matching snapshot of the recipe's files under the state directory (${code("~/.local/state/recipe")} by default). State alone never proves work is done:`,
								},
								{
									type: "list",
									items: [
										rich`${bold("Readiness checks look at real files")} - ${code("is_installed")}, ${code("is_built")} and ${code("is_acquired")} inspect what is on disk`,
										rich`${bold("Package facts come from the recipe")} - name, version and digests are read fresh on every run`,
										rich`${bold("Outputs are published")} - a successful run returns the published paths in ${code("ctx.outputs")}`,
									],
								},
							],
						},
						{
							question: "What is the recipe lifecycle?",
							answer: [
								{
									type: "code",
									language: "text",
									content: `recipe install foo
├── is_installed(ctx)  ready? done, publish outputs
├── is_built(ctx)      ready? skip to install
├── is_acquired(ctx)   ready? skip to build
├── acquire(ctx)       download, check out, verify
├── build(ctx)         extract, configure, compile
└── install(ctx)       place files in /out, select ctx.outputs`,
								},
								{
									type: "text",
									content: rich`Each check returns ${code("ready(ctx)")} or ${code("needs_work(ctx, reason)")}, and is run again after its phase. See ${link("Recipe Format", "/docs/recipe-format")}.`,
								},
							],
						},
						{
							question: "How does recipe handle dependencies?",
							answer: [
								{
									type: "list",
									items: [
										rich`${bold("Literal declarations")}: ${code("let deps = [...]")} and ${code("let build_deps = [...]")}, read before launch without running the recipe`,
										rich`${bold("Dependency order")}: dependencies install first, each with its own readiness checks`,
										rich`${bold("Shared tools")}: dependency products land in ${code("/work/tools")} and their executables are on ${code("PATH")}`,
										rich`${bold("Inheritance")}: ${code("//! extends: base.rhai")} reuses one base recipe`,
										rich`${bold("Verified sources")}: downloads need a SHA256, Git checkouts a full commit id`,
									],
								},
							],
						},
						{
							question: "Are recipes trusted code? What about security?",
							answer: [
								{
									type: "text",
									content:
										"Yes, recipes are trusted code. They can run commands, download files, and install software. This is intentional.",
								},
								{
									type: "text",
									content:
										"They run inside a Ginux domain with bounded memory, storage and time, network limited to declared NEEDS endpoints that callers may only narrow, and no view of the host's files beyond the inputs they are given. LevitateOS defaults to A/B. System changes must be prepared in the inactive slot through recab and Recipe and trial-booted before commitment; current release-image staging does not yet implement incremental continuation or Recipe targeting of that slot.",
								},
								{
									type: "list",
									items: [
										"Recipes are code whose effects remain bounded by the supported configured contract",
										"Only use recipes from official LevitateOS sources",
										"You write your own recipes - you control what they do",
										"Never run recipes downloaded from untrusted sources",
									],
								},
								{
									type: "text",
									content:
										"This is the same trust model as Arch's PKGBUILD or Gentoo's ebuilds. The user is responsible for reviewing what they install. Isolation and A/B updates limit the damage, but they don't make untrusted recipes safe.",
								},
							],
						},
					],
				},
			],
		},
		{
			title: "Testing Philosophy",
			content: [
				{
					type: "qa",
					items: [
						{
							question: "Why end-to-end (E2E) testing instead of unit tests?",
							answer: [
								{
									type: "text",
									content:
										"LevitateOS tests the real artifacts with named scenarios. Each one runs on its own against existing build outputs:",
								},
								{
									type: "table",
									headers: ["Scenario", "Checks"],
									rows: [
										["build-preflight", "The build inputs and host prerequisites"],
										["live-boot", "The ISO boots to the live system"],
										["live-tools", "The install tools work in the live system"],
										[
											"install",
											"Partition, extract, configure and install the bootloader on a VM disk",
										],
										["installed-boot", "The installed disk boots"],
										["automated-login", "Login on the installed system"],
										["runtime", "The installed system's services and behavior at runtime"],
										[
											"ab-update",
											"Stage the release into slot B, then trial boot, fallback, commit and rollback",
										],
									],
									monospaceCol: 0,
								},
								{
									type: "text",
									content:
										"Unit tests can't catch system integration issues. Installation is inherently end-to-end. The scenarios run in libvirt VMs with UEFI firmware, a virtual disk and a serial console.",
								},
							],
						},
					],
				},
			],
		},
		{
			title: "Lessons Learned",
			content: [
				{
					type: "qa",
					items: [
						{
							question: "What happened with the bootstrap tarball approach?",
							answer: [
								{
									type: "text",
									content: "A costly mistake. The original plan:",
								},
								{
									type: "code",
									language: "text",
									content: `ISO builder → bootstrap.tar.xz (~5MB) → Extract → recipe install base → Updates`,
								},
								{
									type: "text",
									content:
										"What was built: 34 recipe files, bootstrap module, busybox download, static binary compilation - all unnecessary.",
								},
								{
									type: "text",
									content:
										"The simple solution: The live ISO already contains a complete system in an EROFS image. Just extract it:",
								},
								{
									type: "code",
									language: "text",
									content: `Boot ISO → recpart apply (mounts /mnt) → recstrap /mnt (extracts EROFS) → Done`,
								},
								{
									type: "text",
									content: rich`${bold("Lesson")}: Always ask "is this necessary?" before building. The simplest solution is usually correct.`,
								},
							],
						},
						{
							question: "How does LevitateOS stay aligned with Arch's approach?",
							answer: [
								{
									type: "text",
									content: 'When unsure about UX decisions, ask "What does archiso do?"',
								},
								{
									type: "list",
									items: [
										rich`${bold("Autologin")}: archiso has autologin → LevitateOS has autologin`,
										rich`${bold("Root shell")}: archiso boots to root shell → LevitateOS boots to a root shell beside the install guide`,
										rich`${bold("Installer")}: archiso requires manual install → LevitateOS uses recpart, recstrap (like pacstrap), recfstab (like genfstab) and recsetup, with a TUI for each step`,
									],
								},
								{
									type: "text",
									content:
										"LevitateOS competes with Arch. The live ISO experience should match archiso's behavior where applicable.",
								},
							],
						},
					],
				},
			],
		},
		{
			title: "Technical Decisions Summary",
			content: [
				{
					type: "table",
					headers: ["Decision", "Alternative", "Why Chosen"],
					rows: [
						["Fedora base", "Compile from source", "Minutes vs hours, maintained packages"],
						["A/B slots", "Update in place", "Trial boot before commit, rollback"],
						["EROFS", "Large initramfs", "RAM savings, scalability, single source"],
						["Rhai recipes", "S-expressions/YAML", "Real programming, infinite extensibility"],
						[
							"Ginux build domains",
							"Build on the host",
							"Isolation, explicit inputs, no network by default",
						],
						["E2E scenarios", "Unit tests", "Catches integration issues"],
						["Build-time module order", "Hand-ordered insmod", "No manual ordering, robust"],
						["readelf", "ldd", "Cross-compilation safe"],
					],
				},
			],
		},
	],
} satisfies DocsContent;
