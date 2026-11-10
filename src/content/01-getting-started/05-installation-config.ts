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
import { pageLink } from "../../pages";

const SLUG = "installation-config";
const target = EXAMPLE_DISK.target;
const choice = { timezone: EXAMPLE_SETUP.timezone, locale: EXAMPLE_SETUP.locale };

export default distroPage((d) => ({
	title: guideTitle(SLUG),
	intro: `Installation ${guideSteps(SLUG)}. Run these commands in the live shell, with the installed system mounted at ${target}. Recipe prepares the system defaults; recsetup applies your machine's choices using the setup program shipped in that system.`,
	sections: [
		{
			title: guideStep(SLUG, "Inspect Available Choices"),
			content: [
				{
					type: "note",
					variant: "info",
					content: rich`${bold("These steps in one tool:")} ${code("system-setup")} asks for the keyboard layout, time zone, language, hostname, root password and a user, shows the commands ${code("recsetup")} would run, and applies them after you confirm. The install screen starts it from the configuration step. The commands below do the same by hand.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Answer the questions, review and apply",
					command: commands.systemSetup(),
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
					content: rich`Continue to ${pageLink("installation-boot")}.`,
				},
			],
		},
	],
}));
