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
			title: "Software with Recipe",
			content: [
				{
					type: "text",
					content: rich`Recipe is the software manager for ${d.osName}. The OS builder and user-managed software share one recipe format and engine. The builder produces the system image, including its bundled desktop apps; ${code("recab")} handles that image's updates. User-managed recipes are a separate catalog for software managed independently of the system image.`,
				},
				{
					type: "note",
					variant: "warning",
					content: rich`The user catalog is not populated yet, and Recipe does not yet activate, update or remove software on the running system. ${code("recipe install")} produces files in an isolated output tree. It also needs a configured Ginux launcher and root image, which ${d.osName} does not ship yet. See the ${link("Recipe README", "https://github.com/LevitateOS/recipe/blob/master/README.md")} for environment preparation.`,
				},
				{
					type: "text",
					content: rich`${code("recipe")} looks names up in root's recipe directory, ${code(RECIPE.recipes)}, or accepts a path to a ${code(".rhai")} file. The directory starts empty. Its recipe files, retained state and image cache live on ${code("/var")}, which both slots share. Preserving that data across system updates does not make a published program active on the system.`,
				},
				{
					type: "command",
					language: "bash",
					description: "List available recipe files (not installed applications)",
					command: `${admin(d)} recipe list`,
				},
				{
					type: "text",
					content: rich`To inspect a recipe without running it, save the ${code("hello.rhai")} example from ${link("Recipe Format", "/docs/recipe-format")} and run:`,
				},
				{
					type: "command",
					language: "bash",
					description: "Show a recipe's name, version and description",
					command: "recipe info ./hello.rhai",
				},
				{
					type: "text",
					content: rich`${code("recipe install")} runs the recipe in a Ginux domain and publishes what it produces under ${code(".artifacts/ginux-export")} in the current directory; its JSON names the paths in ${code("ctx.outputs")}. ${code("recipe remove")} changes the retained output tree and leaves earlier publications intact. ${code("recipe list")} and ${code("recipe info")} need no Ginux environment.`,
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
					content: `A new ${d.osName} release is written into the inactive slot (slot B after a fresh install) and trial-booted once. Mount the new release ISO, then stage its system image, kernel and initramfs:`,
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
					content: rich`${code("recab-tui")} shows the slots and does the same steps from a screen: try the other slot, commit, roll back, or write a system into the inactive slot, each with its effect before and after. It changes the boot setup, so open it as root.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Open the A/B updates screen",
					command: `${admin(d)} recab-tui`,
				},
				{
					type: "text",
					content: rich`The hostname, accounts, enabled services, network connections and SSH host keys are carried into the new slot, and ${code("/var")} (with Recipe's recipe files, retained state and cache) is shared by both slots, home directories included (${code("/home")} is a symlink to ${code("/var/home")}); the rest of the system, including bundled desktop apps, comes from the new image. If it starts cleanly, the trial service commits it; if not, the machine reboots into the previous slot by itself. ${code("recab status")} shows which slot runs and how the last trial ended, and ${code(`${admin(d)} recab rollback`)} returns to the previous slot later. See ${link("Atomic Updates (A/B)", "/docs/atomic-updates")}.`,
				},
			],
		},
		{
			title: "Next Steps",
			content: [
				{
					type: "list",
					items: [
						rich`For ${DESKTOP_NAME[d.profile.desktop]}, install from the desktop ISO: ${pageLink("installation", "From the Desktop ISO")}`,
						"Set up development tools and editors",
						rich`Review ${pageLink("troubleshooting")} if you encounter issues`,
					],
				},
			],
		},
	],
}));
