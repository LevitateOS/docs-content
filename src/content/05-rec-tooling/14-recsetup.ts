import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"
import { TOOL_HELP } from "../../tool-help"

export const recsetupContent: DocsContent = {
	title: "recsetup",
	meta: {
		product: "shared",
		scopes: ["install"],
		audience: ["operator", "developer"],
		stability: "experimental",
	},
	intro:
		"Configure and boot an extracted system: time zone, locale, keymap, hostname, accounts, systemd-boot, boot entries, machine id and services. It plans first, shows every command, then applies them.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`${code("recsetup")} does installation steps 10 to 17 against the system that ${link("recstrap", "/docs/recstrap")} extracted to ${code("/mnt")}. It is the backend of the install's setup and boot apps, and the commands it prints are the manual install for anyone who would rather type them.`,
				},
				{
					type: "list",
					items: [
						rich`${code("recsetup inspect")} describes the target and lists what can be chosen: time zones, locales, keymaps, shells, groups and services.`,
						rich`${code("recsetup plan")} checks a request against the target and prints the exact commands, in order, without running anything.`,
						rich`${code("recsetup apply")} runs them in order and stops at the first that fails. Each step's result is recorded: done, failed or not run.`,
					],
				},
				{
					type: "text",
					content: rich`Every section of a request is optional. The setup step asks for the time zone, locale, keymap, hostname and accounts, and the boot step asks for ${code("--boot")}, the machine id and services. Add ${code("--json")} for machine-readable output (errors go to stderr).`,
				},
			],
		},
		{
			title: "Usage",
			content: [
				{
					type: "text",
					content: rich`Options as printed by ${code("recsetup --help")}; ${code("recsetup plan --help")} lists the request flags:`,
				},
				{
					type: "code",
					language: "text",
					content: TOOL_HELP.recsetup,
				},
			],
		},
		{
			title: "Examples",
			content: [
				{
					type: "command",
					language: "bash",
					description: "See what the target offers",
					command: "recsetup inspect --root /mnt",
				},
				{
					type: "command",
					language: "bash",
					description: "Preview the configuration (changes nothing)",
					command:
						"recsetup plan --root /mnt --timezone Europe/Amsterdam --locale en_US.UTF-8 --keymap us --hostname mypc --root-password --user yourname",
				},
				{
					type: "command",
					language: "bash",
					description: "Apply it; the passwords come from stdin, one name:password line each",
					command: `read -rs -p "root password: " RP; echo; read -rs -p "yourname password: " UP; echo
printf 'root:%s\\nyourname:%s\\n' "$RP" "$UP" | recsetup apply --root /mnt --timezone Europe/Amsterdam --locale en_US.UTF-8 --keymap us --hostname mypc --root-password --user yourname --passwords-stdin`,
				},
				{
					type: "command",
					language: "bash",
					description:
						"Install systemd-boot and the A/B boot layout (use the slot devices recpart reported)",
					command:
						"recsetup apply --root /mnt --boot ab --slot-a /dev/nvme0n1p2 --slot-b /dev/nvme0n1p3 --machine-id",
				},
				{
					type: "command",
					language: "bash",
					description: "Mutable layout: one boot entry for the root partition",
					command: "recsetup apply --root /mnt --boot mutable --root-device /dev/nvme0n1p2 --machine-id",
				},
			],
		},
		{
			title: "Request File",
			content: [
				{
					type: "text",
					content: rich`A front end passes the same choices as JSON with ${code("--request setup.json")}; flags override or add to it. Unknown fields are refused. Users default to ${code("admin: true")} (member of wheel) and ${code("password: true")}.`,
				},
				{
					type: "code",
					language: "text",
					content: `{
  "timezone": "Europe/Amsterdam",
  "locale": "en_US.UTF-8",
  "keymap": "us",
  "hostname": "mypc",
  "root_password": true,
  "users": [{ "name": "yourname", "groups": ["audio"], "shell": "/bin/bash" }],
  "boot": { "mode": "ab", "slot_a": "/dev/nvme0n1p2", "slot_b": "/dev/nvme0n1p3", "options": "console=ttyS0,115200n8" },
  "machine_id": true,
  "services": ["sshd"]
}`,
				},
				{
					type: "text",
					content: rich`${code("boot.kernel")} defaults to the live media's ${code("/run/live-media/boot/vmlinuz")}. ${code("boot.initrd")} defaults, on systemd systems, to the installed system's initramfs the live media carries, ${code("/run/live-media/boot/initramfs-installed.img")}, and to none on OpenRC ones, which boot without an initramfs; ${code('""')} (or ${code("--no-initrd")}) means none. The live media's own ${code("initramfs.img")} is refused (E030): it only finds the live medium and ignores ${code("root=")}.`,
				},
			],
		},
		{
			title: "Passwords",
			content: [
				{
					type: "text",
					content: rich`Passwords never go on the command line. ${code("apply --passwords-stdin")} reads one ${code("name:password")} line for root (with ${code("--root-password")}) and for each user whose password is set, and hands them to ${code("chpasswd")} in the target. Apply checks the lines before it changes anything: a missing, extra, repeated or empty password stops it with ${code("E032")}.`,
				},
			],
		},
		{
			title: "How It Decides",
			content: [
				{
					type: "text",
					content: rich`${code("recsetup")} reads the target, not the live system: the init system from ${code("openrc-run")} or ${code("/usr/lib/systemd/systemd")}, the libc from musl's loader, and each command from what the target ships. ${code("inspect --json")} reports what it found. The machine settings (time zone, locale, keymap, hostname, users, machine id and services) are applied by the target's own setup program, ${code("/usr/libexec/recipe-system-setup")}, which the system recipe installs; recsetup checks each choice and runs it through ${code("recchroot")}. The bootloader and boot entries are recsetup's and ${code("recab")}'s.`,
				},
				{
					type: "table",
					headers: ["Step", "systemd (LevitateOS)", "OpenRC (AcornOS)"],
					rows: [
						["Time zone", "/etc/localtime link into /usr/share/zoneinfo", "Same"],
						[
							"Locale",
							"locale-gen, else localedef, else the compiled locales only; then LANG in /etc/locale.conf",
							"musl compiles nothing: LANG in /etc/locale.conf",
						],
						[
							"Keymap",
							"KEYMAP in /etc/vconsole.conf",
							"keymap in /etc/conf.d/keymaps (or loadkeys) and rc-update add … boot",
						],
						["Hostname", "/etc/hostname and /etc/hosts", "Same"],
						[
							"Users",
							"useradd -m -s SHELL -G wheel,…",
							"adduser -D -s SHELL, then addgroup for each group",
						],
						[
							"Admin",
							"wheel; the sudo rule in /etc/sudoers.d/10-wheel ships with the system",
							"wheel; the doas rule in /etc/doas.conf ships with the system",
						],
						["Passwords", "chpasswd in the target", "Same (busybox chpasswd)"],
						[
							"Bootloader",
							"bootctl install --esp-path=/boot --no-variables",
							"copy systemd-boot's EFI binary to EFI/BOOT and EFI/systemd",
						],
						[
							"A/B entries",
							"recab init with both slots and the initramfs",
							"recab init with both slots, no initramfs",
						],
						[
							"Mutable entry",
							"kernel and initramfs on the ESP, one entry with root=PARTUUID",
							"kernel on the ESP, one entry with root=PARTUUID",
						],
						[
							"Machine id",
							"systemd-machine-id-setup",
							"a random /etc/machine-id, unless one exists",
						],
						["Services", "systemctl enable (offline)", "rc-update add … default"],
					],
				},
				{
					type: "text",
					content: rich`A choice the target cannot provide is refused before anything runs (${code("E031")}). For example, a target without time zone data offers only UTC, which it sets by removing ${code("/etc/localtime")}. Paths are resolved inside the root, so a symlink in the target never leads to the live system's files.`,
				},
				{
					type: "note",
					variant: "info",
					content: rich`Users that already exist are left as they are (with a warning), so applying the same request again is safe. The clock (${code("hwclock")}), the network configuration, unmounting and the reboot stay manual.`,
				},
			],
		},
		{
			title: "Error Codes",
			content: [
				{
					type: "text",
					content: rich`Every failure prints a code and a ${bold("fix")}; the number is also the exit status. recsetup shares the error table of recstrap, recchroot and recfstab (${code("tools/recstrap/src/error.rs")}). Its own codes:`,
				},
				{
					type: "table",
					headers: ["Code", "Meaning"],
					rows: [
						[
							"E029",
							"The target's init system is neither systemd nor OpenRC (nothing extracted there?)",
						],
						[
							"E030",
							"The request is invalid: a bad hostname or user name, a missing slot device, unknown JSON fields",
						],
						[
							"E031",
							"The target cannot provide a choice: a time zone, locale, keymap, shell, group, service or tool it lacks",
						],
						[
							"E032",
							"The passwords on stdin do not match the plan, or --passwords-stdin is missing",
						],
						[
							"E033",
							"A boot file is missing: the kernel, the initramfs, /boot, or systemd-boot itself",
						],
						[
							"E034",
							"A path in the target is unsafe: a symlink loop, or a directory where a file goes",
						],
					],
					monospaceCol: 0,
				},
				{
					type: "text",
					content: rich`It also uses shared ones: ${code("E008")} (apply needs root), ${code("E010")} (a protected path such as ${code("/")} as the root), ${code("E023")} (a step's command failed; its output is in the result), and ${code("E027")} (no PARTUUID for the mutable root).`,
				},
			],
		},
		{
			title: "See Also",
			content: [
				{
					type: "list",
					items: [
						rich`${link("Configuration", "/docs/installation-config")} - Steps 10-14 by hand`,
						rich`${link("Bootloader & Finish", "/docs/installation-boot")} - Steps 15-18 by hand`,
						rich`${link("recpart", "/docs/recpart")} - Partitions, and the slot devices for ${code("--boot ab")}`,
						rich`${link("recab", "/docs/recab")} - The A/B layout ${code("recsetup")} sets up`,
					],
				},
			],
		},
	],
}
