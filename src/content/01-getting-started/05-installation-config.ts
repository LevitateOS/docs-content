import { distroPage } from "../../types";
import { rich, bold, code } from "../../rich-text";
import {
	commands,
	EXAMPLE_DISK,
	EXAMPLE_SETUP,
	guideStep,
	guideSteps,
	guideTitle,
} from "../../install";
import { DESKTOP_NAME, network, pageLink } from "../../pages";

const SLUG = "installation-config";
const target = EXAMPLE_DISK.target;
const choice = { timezone: EXAMPLE_SETUP.timezone, locale: EXAMPLE_SETUP.locale };

export default distroPage((d) => ({
	title: guideTitle(SLUG),
	intro: rich`Installation ${guideSteps(SLUG)}. Run these commands in the live shell, with the installed system mounted at ${target}. The first ${code("recsetup apply")} on the release medium starts by installing the default software through Recipe, then applies your machine's choices using the setup program shipped in that system.`,
	sections: [
		{
			title: guideStep(SLUG, "Inspect Available Choices"),
			content: [
				{
					type: "note",
					variant: "info",
					content: rich`${bold("Option 1, the helper app:")} ${code("system-setup")} asks for the keyboard layout, time zone, language, hostname, root password and a user, shows the commands ${code("recsetup")} would run, and applies them after you confirm. When it has applied them, go to ${pageLink("installation-boot")}. ${bold("Option 2, by hand:")} skip ${code("system-setup")} and use the commands in this page's steps. Either way the system is configured, not installed: it still needs its boot files.`,
				},
				{
					type: "note",
					variant: "info",
					content: rich`${bold("Software first, and it takes some minutes.")} The base system holds only what boots the machine and runs Recipe. The first ${code("recsetup apply")} on the release medium installs the default software through ${code("recipe --system install")}: the desktop (${DESKTOP_NAME[d.profile.desktop]}), Firefox, audio, ${network(d).daemon}, Bluetooth, printing, the firewall, fonts and the rest. It first downloads the release's category parts (the package files, one archive per category) into the package cache, so the live session needs a network, or a folder holding the parts you downloaded earlier, and then installs from that cache. Each one gets a Recipe receipt, so you can remove or replace it later in Recipe, the desktop included. Wait for it to finish.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Answer the questions, review and apply",
					command: commands.systemSetup(),
				},
				{
					type: "note",
					variant: "warning",
					content: rich`${bold("Skip this - only if doing it by hand.")} ${code("system-setup")} lists these choices itself.`,
				},
				{
					type: "command",
					language: "bash",
					description: "List the target's timezones, locales, keymaps, shells, groups and services",
					command: commands.inspect(target, true),
				},
			],
		},
		{
			title: guideStep(SLUG, "Set Timezone, Locale and Keymap"),
			content: [
				{
					type: "note",
					variant: "warning",
					content: rich`${bold("Skip this - only if doing it by hand.")} ${code("system-setup")} already set these.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Preview your choices",
					command: commands.configure(target, choice, "plan"),
				},
				{
					type: "command",
					language: "bash",
					description: "Apply timezone, locale and keymap",
					command: commands.configure(target, { ...choice, keymap: EXAMPLE_SETUP.keymap }),
				},
				{
					type: "text",
					content: [
						...rich`Choose values listed by ${code("recsetup inspect")}. `,
						...(d.profile.libc === "musl"
							? rich`musl compiles no locales, so the locale only sets ${code("LANG")} in ${code("/etc/locale.conf")}. `
							: []),
						...rich`The keymap is the console layout the system loads at boot; leave ${code("--keymap")} out for the US layout.`,
					],
				},
			],
		},
		{
			title: guideStep(SLUG, "Set Hostname"),
			content: [
				{
					type: "note",
					variant: "warning",
					content: rich`${bold("Skip this - only if doing it by hand.")} ${code("system-setup")} already set the hostname.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Set hostname and its hosts-file mapping",
					command: commands.configure(target, { hostname: d.defaultHostname }),
				},
			],
		},
		{
			title: guideStep(SLUG, "Set Root Password"),
			content: [
				{
					type: "note",
					variant: "warning",
					content: rich`${bold("Skip this - only if doing it by hand.")} ${code("system-setup")} already set the root password.`,
				},
				{
					type: "text",
					content:
						"The release image has a locked root account. Set a password interactively; it is never stored in a setup request or passed as a command argument.",
				},
				{
					type: "command",
					language: "bash",
					description: "Set the installed root password",
					command: commands.password(target),
				},
			],
		},
		{
			title: guideStep(SLUG, "Create User Account"),
			content: [
				{
					type: "note",
					variant: "warning",
					content: rich`${bold("Skip this - only if doing it by hand.")} ${code("system-setup")} already created the user.`,
				},
				{
					type: "command",
					language: "bash",
					description:
						"Create an administrator without putting a password in the request, then set it",
					command: [
						...commands.createUser(target, EXAMPLE_SETUP.user),
						commands.password(target, EXAMPLE_SETUP.user),
					],
				},
				{
					type: "text",
					content: rich`An administrator joins ${code("wheel")}. The system recipe already ships the ${code(d.profile.privilege)} rule for wheel (${code(d.privilegeTool.adminRule)} in ${code(d.privilegeTool.adminRuleFile)}), so administrative commands go through ${code(d.profile.privilege)}.`,
				},
				{
					type: "text",
					content: rich`Continue to ${pageLink("installation-boot")}. It is required: the system is not installed until it has run.`,
				},
			],
		},
	],
}));
