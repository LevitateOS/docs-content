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
					content: rich`Recipe manages software independently of the system image. The first catalog package is ${code("ripgrep")}, which provides the ${code("rg")} command. OS-building recipes and user packages use the same engine; ${code("recab")} continues to manage the system image and its bundled desktop apps.`,
				},
				{
					type: "note",
					variant: "info",
					content: rich`These commands require an image built with the current Recipe runtime and catalog. The native Ginux launcher needs root for bootstrap, so use ${code(admin(d))} for installation and updates. On older images or a development host, follow the ${link("Recipe README", "https://github.com/LevitateOS/recipe/blob/master/README.md")} to select the launcher and verified image.`,
				},
				{
					type: "command",
					language: "bash",
					description: "List available recipes and inspect ripgrep",
					command: [`${admin(d)} recipe list`, `${admin(d)} recipe info ripgrep`],
				},
				{
					type: "command",
					language: "bash",
					description: "Install ripgrep and run its command",
					command: [`${admin(d)} recipe install ripgrep`, "rg --version"],
				},
				{
					type: "command",
					language: "bash",
					description: "Show active packages and update ripgrep to the catalog's version",
					command: [`${admin(d)} recipe installed`, `${admin(d)} recipe update ripgrep`],
				},
				{
					type: "text",
					content: rich`${code("recipe update ripgrep")} runs the currently selected recipe and activates its pinned version after successful production. It does not fetch an unpinned upstream release or edit the recipe's version and checksum. A newer shipped catalog arrives with an OS image update; an administrator can also maintain a recipe override in ${code(RECIPE.recipes)}.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Remove ripgrep from the active software profile",
					command: `${admin(d)} recipe remove ripgrep`,
				},
				{
					type: "text",
					content: rich`Removal uses the installed receipt, so it works without the source recipe or a Ginux runtime. It removes this package's commands and shared files from the active profile; older generations remain on disk but are inactive. ${code("recipe installed")} reads the active package receipts, whereas ${code("recipe list")} lists available recipes.`,
				},
				{
					type: "text",
					content: rich`Root's package profile is ${code(RECIPE.profile)}, on shared ${code("/var")}; its commands are in ${code(`${RECIPE.profile}/bin`)}. The installed system's login profile adds that directory and the user's own Recipe profile to ${code("PATH")}. When using a custom ${code("--package-root DIR")}, add ${code("DIR/profile/bin")} to your shell's ${code("PATH")}.`,
				},
				{
					type: "text",
					content: rich`Name lookup checks the mutable catalog at ${code(RECIPE.recipes)} before the image's ${code(RECIPE.catalog)}. A same-named local recipe overrides the shipped one. ${code("--recipes-path")} or ${code("RECIPE_PATH")} selects one collection explicitly. See the ${link("CLI Reference", "/docs/cli-reference")} and ${link("Recipe Format", "/docs/recipe-format")} for authoring and producer-only execution.`,
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
					content: rich`The hostname, accounts, enabled services, network connections and SSH host keys are carried into the new slot, and ${code("/var")} (with Recipe's active software profile, package generations, recipe overrides, retained state and cache) is shared by both slots, home directories included (${code("/home")} is a symlink to ${code("/var/home")}); the rest of the system, including bundled desktop apps, comes from the new image. If it starts cleanly, the trial service commits it; if not, the machine reboots into the previous slot by itself. ${code("recab status")} shows which slot runs and how the last trial ended, and ${code(`${admin(d)} recab rollback`)} returns to the previous slot later. See ${link("Atomic Updates (A/B)", "/docs/atomic-updates")}.`,
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
