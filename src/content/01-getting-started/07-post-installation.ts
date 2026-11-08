import { distroPage } from "../../types";
import { rich, code, link } from "../../rich-text";
import { commands } from "../../install";
import { admin, DESKTOP_NAME, PAGE_TITLES, pageLink, RECIPE, services } from "../../pages";

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
					content: rich`${code("recipe")} is the package manager. A package is a Rhai recipe: ${code("recipe")} looks a name up in root's recipes, ${code(RECIPE.recipes)}, or takes a path to a ${code(".rhai")} file. Its recipes, state and image cache are on ${code("/var")}, which both slots share, so they stay through a system update.`,
				},
				{
					type: "command",
					language: "bash",
					description: "List the recipes",
					command: `${admin(d)} recipe list`,
				},
				{
					type: "command",
					language: "bash",
					description: "Show a recipe's name, version and description",
					command: `${admin(d)} recipe info ripgrep`,
				},
				{
					type: "command",
					language: "bash",
					description: "Build and install a package from its recipe",
					command: `${admin(d)} recipe install ripgrep`,
				},
				{
					type: "text",
					content: rich`${code("recipe install")} runs the recipe in a Ginux domain and publishes what it produces under ${code(".artifacts/ginux-export")} in the current directory; its JSON names the paths in ${code("ctx.outputs")}. It does not change the running system.`,
				},
				{
					type: "note",
					variant: "warning",
					content: rich`${code("recipe install")} needs the Ginux launcher (${code("GINUX_BIN")}) and a Ginux root image, which ${d.osName} does not ship yet. ${code("recipe list")} and ${code("recipe info")} need neither.`,
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
					content: rich`The hostname, accounts, enabled services, network connections and SSH host keys are carried into the new slot, and ${code("/var")} (with Recipe's packages and state) is shared by both slots, home directories included (${code("/home")} is a symlink to ${code("/var/home")}); the rest of the system comes from the new image. If it starts cleanly, the trial service commits it; if not, the machine reboots into the previous slot by itself. ${code("recab status")} shows which slot runs and how the last trial ended, and ${code(`${admin(d)} recab rollback`)} returns to the previous slot later. See ${link("Atomic Updates (A/B)", "/docs/atomic-updates")}.`,
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
