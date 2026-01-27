import type { DocsContent } from "../../types"
import { rich, code, bold } from "../../rich-text"

export const faqContent: DocsContent = {
	title: "Architecture FAQ",
	intro: "Design decisions and rationale behind LevitateOS components. Each answer explains why we chose a particular approach over alternatives.",
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
									content: rich`LevitateOS is a daily driver Linux distribution competing directly with Arch Linux. It borrows Arch's philosophy (user maintains their own packages, minimal base that users build up) but substitutes hours of compilation with minutes of extraction from pre-built Rocky Linux packages.`,
								},
								{
									type: "table",
									headers: ["Dimension", "Arch Linux", "LevitateOS"],
									rows: [
										["Target User", "Power users seeking control", "Same"],
										["Philosophy", "Minimal base, user builds", "Same"],
										["Package Manager", "pacman + AUR", "recipe (Rhai scripts)"],
										["Binary Source", "Compiled from source", "Extracted from Rocky 10 RPMs"],
										["Build Time", "Hours (compiling)", "Minutes (extracting)"],
									],
								},
							],
						},
						{
							question: "Why not just use Arch?",
							answer: [
								{
									type: "text",
									content: "Arch requires compiling AUR packages. That means build dependencies, compiler toolchains, and waiting. LevitateOS extracts enterprise-tested Rocky RPMs in minutes. Same philosophy, less waiting.",
								},
								{
									type: "text",
									content: "If you want to compile everything yourself, use Arch. If you want the same control without the compilation overhead, use LevitateOS.",
								},
							],
						},
						{
							question: "Why not Fedora?",
							answer: [
								{
									type: "text",
									content: "Fedora is GNOME-focused and opinionated. It makes choices for you. LevitateOS is a base system - you build what you want on top of it.",
								},
								{
									type: "text",
									content: "Fedora ships a complete desktop experience. LevitateOS ships a foundation. Different goals, different users.",
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
									content: "LevitateOS targets modern desktop and workstation hardware with full capabilities.",
								},
							],
						},
						{
							question: "What are the system requirements?",
							answer: [
								{
									type: "table",
									headers: ["Component", "Minimum", "Recommended (LLM-ready)"],
									rows: [
										["CPU", "Intel Haswell / AMD Zen", "8+ cores, AVX2 support"],
										["RAM", "16 GB", "32-64 GB"],
										["Storage", "512 GB NVMe", "1-2 TB NVMe"],
										["GPU", "Integrated / CPU inference", "NVIDIA RTX 3060+ (12GB VRAM)"],
									],
								},
								{
									type: "text",
									content: "LevitateOS ships with local LLM capabilities. The recommended specs enable running 7B-13B parameter models for AI-assisted workflows. CPU-only inference works with 32GB+ RAM.",
								},
							],
						},
						{
							question: "Is this just a hobby project?",
							answer: [
								{
									type: "text",
									content: "Boot the ISO. Run the E2E tests. Read the commit history. Code speaks.",
								},
								{
									type: "text",
									content: rich`The test suite runs full installation workflows in QEMU VMs. The ISO boots on real hardware. Every commit is tested. If something doesn't work, open an issue with specifics.`,
								},
							],
						},
					],
				},
			],
		},
		{
			title: "leviso (ISO Builder)",
			content: [
				{
					type: "qa",
					items: [
						{
							question: "Why use Rocky Linux 10 instead of building from source?",
							answer: [
								{
									type: "list",
									items: [
										rich`${bold("Enterprise-grade packages")} with security patches and stability`,
										rich`${bold("glibc-based")} (not musl) for maximum compatibility`,
										rich`${bold("No compilation required")} - binaries are pre-built`,
										rich`${bold("Builds in minutes")} instead of hours`,
										rich`${bold("Direct RPM extraction")} using ${code("rpm --root --nodeps")}`,
									],
								},
								{
									type: "text",
									content: "Rocky packages are tested in enterprise deployments. You get RHEL stability without maintaining a build farm. This decision is non-negotiable.",
								},
							],
						},
						{
							question: "How do I know the RPMs are safe?",
							answer: [
								{
									type: "text",
									content: rich`Same way you trust any distro - they're GPG-signed by Rocky Linux. Run ${code("rpm -K /path/to/package.rpm")} yourself.`,
								},
								{
									type: "text",
									content: "We don't recompile packages. We don't inject code. We don't modify binaries. We extract what Rocky ships and verify signatures match their public keys.",
								},
								{
									type: "text",
									content: rich`See ${code("SUPPLY_CHAIN.md")} in the repository root for full verification steps.`,
								},
							],
						},
						{
							question: "Why use EROFS instead of a large initramfs?",
							answer: [
								{
									type: "text",
									content: "The old approach loaded a ~250MB initramfs entirely into RAM. The EROFS architecture provides:",
								},
								{
									type: "list",
									items: [
										rich`${bold("RAM savings")}: ~400MB → ~50MB at boot`,
										rich`${bold("Single source of truth")}: Live environment = Installed system (no duplication)`,
										rich`${bold("Simpler installation")}: Extract to disk instead of complex copy logic`,
										rich`${bold("Scalable")}: Easy to add packages without bloating initramfs`,
									],
								},
								{
									type: "text",
									content: rich`The tiny initramfs (~5MB) contains just busybox and mount logic. The EROFS image (~350MB) is mounted read-only with a tmpfs overlay for live modifications.`,
								},
							],
						},
						{
							question: "Why UKI (Unified Kernel Images) instead of separate vmlinuz + initramfs?",
							answer: [
								{
									type: "list",
									items: [
										rich`${bold("Single signed artifact")} - Kernel, initramfs, and cmdline in one PE binary`,
										rich`${bold("Secure Boot ready")} - Single file to sign and verify`,
										rich`${bold("Auto-discovery")} - systemd-boot auto-detects UKIs in /EFI/Linux/`,
										rich`${bold("Simpler installation")} - Copy one file, no boot entry configuration needed`,
										rich`${bold("Modern standard")} - Used by Fedora, Arch, and systemd-first distros`,
									],
								},
							],
						},
						{
							question: "Why UEFI-only (no BIOS support)?",
							answer: [
								{
									type: "text",
									content: "LevitateOS targets modern hardware (2013+). UEFI has been standard for over a decade. Dropping BIOS support allows:",
								},
								{
									type: "list",
									items: [
										rich`${bold("Clean boot stack")} - systemd-boot + UKI only, no GRUB or isolinux complexity`,
										rich`${bold("Secure Boot path")} - UKIs are Secure Boot compatible (signing support planned)`,
										rich`${bold("Simpler code")} - One boot path to test and maintain`,
									],
								},
								{
									type: "text",
									content: "If you have hardware from before 2013 that lacks UEFI, LevitateOS is not the right distribution for you.",
								},
							],
						},
						{
							question: "Why modprobe instead of insmod?",
							answer: [
								{
									type: "text",
									content: rich`Originally used ${code("insmod")} with manual dependency ordering, which was fragile:`,
								},
								{
									type: "code",
									language: "bash",
									content: `# Before (fragile - order matters!)
load_module mbcache
load_module jbd2      # Must come after mbcache
load_module ext4      # Must come after jbd2

# After (robust - modprobe handles dependencies)
load_module ext4      # modprobe loads mbcache, jbd2 automatically`,
								},
								{
									type: "text",
									content: "Benefits: No manual ordering, kernel updates won't break boot, easy to add new modules.",
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
									content: "readelf reads ELF NEEDED entries directly from the file. No execution, no dynamic linker involvement. Works for any architecture on any host.",
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
									content: "YAML isn't a programming language - you can't write conditionals or loops. Python has dependency hell and isn't embeddable without significant overhead. Lua lacks a standard library. Rhai is Rust-native, sandboxed, and actually programmable.",
								},
								{
									type: "text",
									content: "With Rhai, recipes ARE CODE:",
								},
								{
									type: "code",
									language: "rhai",
									content: `let pkg = #{
    name: "ripgrep",
    version: "14.1.0",
};

fn install() {
    let url = \`https://github.com/.../ripgrep-\${pkg.version}-x86_64-unknown-linux-musl.tar.gz\`;
    download(url);
    extract("tar.gz");
    install_bin("rg");
}`,
								},
								{
									type: "list",
									items: [
										rich`${bold("Real programming")} - Variables, conditionals, loops, functions`,
										rich`${bold("Infinite extensibility")} - Recipes define logic, not just data`,
										rich`${bold("Minimal implementation")} - Executor just provides helpers + calls acquire(), build(), install()`,
										rich`${bold("Sandboxed")} - Runs in isolated Rhai VM`,
									],
								},
							],
						},
						{
							question: "Why does state live in recipe files instead of a database?",
							answer: [
								{
									type: "text",
									content: "State lives IN the recipe file itself:",
								},
								{
									type: "code",
									language: "rhai",
									content: `let installed = false;           // Set to true after install
let installed_version = ();      // Version that was installed
let installed_at = ();           // Unix timestamp
let installed_files = [];        // List of installed file paths`,
								},
								{
									type: "list",
									items: [
										rich`${bold("No database needed")} - recipe file IS the source of truth`,
										rich`${bold("Self-contained")} - Everything about a package in one file`,
										rich`${bold("Easy to sync")} - Just copy recipe files between machines`,
										rich`${bold("Simple to debug")} - Edit recipe directly to test`,
										rich`${bold("Self-modifying")} - Engine updates state variables directly in files`,
									],
								},
								{
									type: "text",
									content: rich`To see what's installed: ${code('grep -l "installed = true" recipes/*.rhai')}`,
								},
							],
						},
						{
							question: "What is the recipe lifecycle?",
							answer: [
								{
									type: "code",
									language: "text",
									content: `Engine
├── Context (ExecutionContext)
├── Phases (first-class)
│   ├── acquire() - download, copy, verify
│   ├── build()   - extract, compile, configure
│   └── install() - place files in filesystem
└── Utilities (filesystem, io, env, command)`,
								},
								{
									type: "text",
									content: rich`Execution order: ${code("is_installed()")} check → ${code("acquire()")} → ${code("build()")} (optional) → ${code("install()")}`,
								},
							],
						},
						{
							question: "How does recipe handle dependencies?",
							answer: [
								{
									type: "list",
									items: [
										rich`${bold("Source checksums")}: verify_sha256, verify_sha512, verify_blake3`,
										rich`${bold("Reverse dependency tracking")}: Find what depends on a package`,
										rich`${bold("Dry run mode")}: ${code("--dry-run")} shows what would be installed`,
										rich`${bold("Version constraints")}: Semver support (e.g., "openssl >= 1.1.0")`,
										rich`${bold("Atomic installation")}: Staging + rollback on failure`,
										rich`${bold("Orphan detection")}: Finds packages installed only as dependencies`,
										rich`${bold("Lock file")}: TOML-based lockfile with ${code("--locked")} flag`,
									],
								},
							],
						},
						{
							question: "Are recipes trusted code? What about security?",
							answer: [
								{
									type: "text",
									content: "Yes, recipes are trusted code. They can execute shell commands, download files, and modify your system. This is intentional - recipes need full access to install software.",
								},
								{
									type: "list",
									items: [
										"Recipes are code, not config - they can do anything",
										"Only use recipes from official LevitateOS sources",
										"You write your own recipes - you control what they do",
										"Never run recipes downloaded from untrusted sources",
									],
								},
								{
									type: "text",
									content: "This is the same trust model as Arch's PKGBUILD or Gentoo's ebuilds. The user is responsible for reviewing what they install. LevitateOS doesn't sandbox recipes because that would break legitimate functionality.",
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
									content: "LevitateOS uses 6-phase E2E testing to validate the full installation flow:",
								},
								{
									type: "table",
									headers: ["Phase", "Description"],
									rows: [
										["1. Boot", "Verify UEFI, sync clock"],
										["2. Disk", "Partition, format (label root), mount"],
										["3. Base System", "Mount media, extract EROFS, generate fstab, setup chroot"],
										["4. Configuration", "Timezone, locale, hostname, users"],
										["5. Boot Setup", "Copy UKI, install systemd-boot, enable services"],
										["6. Verification", "Verify system boots from disk, user login, networking"],
									],
								},
								{
									type: "text",
									content: "Unit tests can't catch system integration issues. Installation is inherently end-to-end. Tests run in real QEMU VM with real hardware simulation.",
								},
							],
						},
						{
							question: "How does LevitateOS prevent test cheating?",
							answer: [
								{
									type: "text",
									content: rich`Created ${code("cheat-test")} proc-macro to prevent false-positive tests:`,
								},
								{
									type: "code",
									language: "rust",
									content: `#[cheat_aware(
    protects = "users can boot installed system",
    severity = "CRITICAL",
    cheats = ["skip verification", "hardcode paths", "ignore errors"],
    consequence = "Users get broken system, can't boot"
)]
fn test_bootloader_install() { ... }`,
								},
								{
									type: "text",
									content: rich`Key principle: If users need it → test fails when missing. No "optional" trash bin. Never move missing items from CRITICAL to OPTIONAL just to pass tests.`,
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
							question: "What is \"STOP. READ. THEN ACT\"?",
							answer: [
								{
									type: "text",
									content: "The most important rule in the codebase:",
								},
								{
									type: "list",
									ordered: true,
									items: [
										rich`${bold("STOP")} - Don't assume you know where something goes`,
										rich`${bold("READ")} - Read what already exists first`,
										rich`${bold("ACT")} - Then make informed decisions`,
									],
								},
								{
									type: "text",
									content: "This exists because a previous development session broke tests, created code in the wrong location, and deleted it without checking - wasting significant time and resources. Five minutes reading saves hours of cleanup.",
								},
							],
						},
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
									content: `leviso → bootstrap.tar.xz (~5MB) → Extract → recipe install base → Updates`,
								},
								{
									type: "text",
									content: "What was built: 34 recipe files, bootstrap module, busybox download, static binary compilation - all unnecessary.",
								},
								{
									type: "text",
									content: "The simple solution: The live ISO already contains a complete system in an EROFS image. Just extract it:",
								},
								{
									type: "code",
									language: "text",
									content: `Boot ISO → Mount /mnt → recstrap /mnt (extracts EROFS) → Done`,
								},
								{
									type: "text",
									content: rich`${bold("Lesson")}: Always ask "is this necessary?" before building. The simplest solution is usually correct.`,
								},
							],
						},
						{
							question: "How should architecture decisions be made?",
							answer: [
								{
									type: "text",
									content: "Ask before implementing. Don't silently add workarounds.",
								},
								{
									type: "list",
									ordered: true,
									items: [
										"Document the problem",
										"Propose solution in a team file",
										"Ask for feedback",
										"Don't silently implement",
									],
								},
								{
									type: "text",
									content: "Silent implementation can waste resources, add complexity, and create technical debt.",
								},
							],
						},
						{
							question: "How does LevitateOS stay aligned with Arch's approach?",
							answer: [
								{
									type: "text",
									content: "When unsure about UX decisions, ask \"What does archiso do?\"",
								},
								{
									type: "list",
									items: [
										rich`${bold("Autologin")}: archiso has autologin → LevitateOS has autologin`,
										rich`${bold("Root shell")}: archiso boots to root shell → LevitateOS boots to root shell`,
										rich`${bold("Installer")}: archiso requires manual install → LevitateOS uses recstrap (like pacstrap) + manual config`,
									],
								},
								{
									type: "text",
									content: "LevitateOS competes with Arch. The live ISO experience should match archiso's behavior where applicable.",
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
						["Rocky Linux 10", "Compile from source", "Minutes vs hours, stable packages"],
						["EROFS", "Large initramfs", "RAM savings, scalability, single source"],
						["Rhai recipes", "S-expressions/YAML", "Real programming, infinite extensibility"],
						["State in files", "Database", "Self-contained, easy to sync, simple"],
						["E2E tests", "Unit tests", "Catches integration issues"],
						["modprobe", "insmod", "No manual ordering, robust"],
						["readelf", "ldd", "Cross-compilation safe"],
						["TEAM files", "Comments in code", "Historical record, decision rationale"],
					],
				},
			],
		},
	],
}
