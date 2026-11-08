import { distroPage } from "../../types";
import { rich, code, link } from "../../rich-text";
import { commands } from "../../install";
import { admin, DESKTOP_NAME, PAGE_TITLES, pageLink, services } from "../../pages";

export default distroPage((d) => ({
	title: PAGE_TITLES["post-installation"],
	intro: rich`After rebooting, log in with your user account and start using your new ${d.osName} system. Administrative commands go through ${code(admin(d))}.`,
	sections: [
		{
			title: "Services",
			content: [
				{
					type: "command",
					language: "bash",
					description: "Show the services and whether they run",
					command: services(d).list,
				},
				{
					type: "command",
					language: "bash",
					description: "Start a service now and at every boot",
					command: services(d).enable("SERVICE"),
				},
			],
		},
		{
			title: "Package Management",
			content: [
				{
					type: "text",
					content: rich`Packages are Rhai recipes that you keep yourself. ${code("recipe")} looks recipes up by name in ${code("~/.local/share/recipe/recipes")} (or ${code("--recipes-path")}), or takes a path to a ${code(".rhai")} file.`,
				},
				{
					type: "note",
					variant: "info",
					content:
						"A/B by default: recipe changes are composed into the inactive slot and activated on reboot after a trial boot and commit. Mutable mode is an explicit opt-in.",
				},
				{
					type: "command",
					language: "bash",
					description: "List your recipes",
					command: "recipe list",
				},
				{
					type: "command",
					language: "bash",
					description: "Show a recipe's name, version and description",
					command: "recipe info ripgrep",
				},
				{
					type: "command",
					language: "bash",
					description: "Install a package from its recipe",
					command: "recipe install ripgrep",
				},
				{
					type: "text",
					content: rich`See the ${link("CLI Reference", "/docs/cli-reference")} for all commands and the ${link("Recipe Format", "/docs/recipe-format")} to write your own recipes.`,
				},
			],
		},
		{
			title: "System Updates",
			content: [
				{
					type: "text",
					content: `A new ${d.osName} release is written into the inactive slot (slot B after a fresh install) and trial-booted once. Mount the new release ISO, then stage its system image and kernel${d.installedInitramfs ? " and initramfs" : " (the system boots without an initramfs)"}:`,
				},
				{
					type: "command",
					language: "bash",
					description: "Mount the new release ISO",
					command: `${admin(d)} mount -o loop,ro ${d.isoFile} /mnt`,
				},
				{
					type: "command",
					language: "bash",
					description: "Write the new system into the inactive slot",
					command: `${admin(d)} ${commands.stage(d)}`,
				},
				{
					type: "command",
					language: "bash",
					description: "Boot the staged slot once, as a trial",
					command: [
						`${admin(d)} umount /mnt`,
						`${admin(d)} recab set-next B`,
						`${admin(d)} reboot`,
					],
				},
				{
					type: "text",
					content: rich`The hostname, accounts, enabled services, network connections and SSH host keys are carried into the new slot. If it starts cleanly, the trial service commits it; if not, the machine reboots into the previous slot by itself. ${code("recab status")} shows which slot runs and how the last trial ended, and ${code(`${admin(d)} recab rollback`)} returns to the previous slot later. See ${link("Atomic Updates (A/B)", "/docs/atomic-updates")}.`,
				},
			],
		},
		{
			title: "Next Steps",
			content: [
				{
					type: "list",
					items: [
						`A ${DESKTOP_NAME[d.profile.desktop]} desktop edition of ${d.osName} is in development`,
						"Set up development tools and editors",
						rich`Review ${pageLink("troubleshooting")} if you encounter issues`,
					],
				},
			],
		},
	],
}));
