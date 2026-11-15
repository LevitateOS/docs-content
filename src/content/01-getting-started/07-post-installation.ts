import { distroPage } from "../../types";
import { rich, code, link } from "../../rich-text";
import { admin, DESKTOP_NAME, PAGE_TITLES, pageLink, RECIPE, services } from "../../pages";

export default distroPage((d) => ({
	title: PAGE_TITLES["post-installation"],
	intro: rich`After rebooting, log in with your user account and start using your new ${d.osName} system. Administrative commands go through ${code(admin(d))}.`,
	sections: [
		{
			title: "Desktop",
			content: [
				{
					type: "text",
					content: `The desktop edition uses ${DESKTOP_NAME[d.profile.desktop]}. Open the applications menu with the icon at the bottom left. The desktop is software installed through Recipe, like the apps: Recipe lists it, and you can remove it or install a different desktop there. Removing the last desktop is allowed and leaves a text login. Recipe is the window for finding and managing software; Recab shows the two roots: the booted one, locked, and the other, unlocked; Recdirstat shows where disk space goes. The screenshots on the website show development previews with sample data.`,
				},
			],
		},
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
					description: "Mutable installations: start a service now and at every boot",
					command: services(d).enable("SERVICE"),
				},
				{
					type: "text",
					content: rich`On A/B installations the booted root is locked, so ordinary ${code("/etc")} cannot be changed in the running root. Make the change in the other root, which is unlocked and mounted at ${code("/run/recab/other")}, then run ${code("recab boot-other")} and reboot. Mutable installations have one root, changed in place, and no recab.`,
				},
			],
		},
		{
			title: "Software with Recipe",
			content: [
				{
					type: "text",
					content: rich`On A/B installations, root's Recipe package commands write system software into the other root, which is unlocked. The catalog starts with ${code("ripgrep")}, which provides ${code("rg")}. The booted root stays unchanged; run ${code("recab boot-other")} and reboot to start the root that holds the change. Mutable installations have one root, and Recipe changes it directly. The ${link("Recipe page", "/recipe")} explains how recipes, sources, scopes and isolation work.`,
				},
				{
					type: "note",
					variant: "info",
					content: rich`These commands require an image built with the current Recipe runtime and catalog. The native Ginux launcher needs root for bootstrap, so use ${code(admin(d))} for installation. On older images or a development host, follow the ${link("Recipe README", "https://github.com/LevitateOS/recipe/blob/master/README.md")} to select the launcher and verified image.`,
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
					description: "Install ripgrep into the other root and boot it (A is running)",
					command: [
						`${admin(d)} recipe --system install ripgrep`,
						`${admin(d)} recab boot-other`,
						`${admin(d)} reboot`,
						"# After the other root has started:",
						"rg --version",
					],
				},
				{
					type: "command",
					language: "bash",
					description: "Show active packages and update ripgrep to the catalog's version",
					command: [`${admin(d)} recipe installed`, `${admin(d)} recipe update ripgrep`],
				},
				{
					type: "text",
					content: rich`${code("recipe update ripgrep")} runs the currently selected recipe and applies its pinned version to the other root after successful production. Run ${code("recab boot-other")} and reboot to start it. It does not fetch an unpinned upstream release or edit the recipe's version and checksum. An administrator can also maintain a recipe override in ${code(RECIPE.recipes)}.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Remove ripgrep from the other root",
					command: `${admin(d)} recipe remove ripgrep`,
				},
				{
					type: "text",
					content: rich`Removal uses the installed receipt, so it works without the source recipe or a Ginux runtime. It removes only unchanged owned files, retaining other owners and refusing administrator edits. Run ${code("recab boot-other")} and reboot to start the root without it. ${code("recipe installed")} reports active and prepared receipts, whereas ${code("recipe list")} lists available recipes.`,
				},
				{
					type: "text",
					content: rich`System software is in the booted root's ${code("/usr/lib/recipe/profile")}; login adds its commands and ordinary users' independent profiles to ${code("PATH")}. Root's immutable-system commands do not activate the shared ${code(RECIPE.profile)}. When using a custom ${code("--package-root DIR")}, add ${code("DIR/profile/bin")} to your shell's ${code("PATH")}.`,
				},
				{
					type: "text",
					content: rich`Name lookup checks the mutable catalog at ${code(RECIPE.recipes)} before the image's ${code(RECIPE.catalog)}. A same-named local recipe overrides the shipped one. ${code("--recipes-path")} or ${code("RECIPE_PATH")} selects one collection explicitly. See the ${link("CLI Reference", "/docs/cli-reference")} and ${link("Recipe Format", "/docs/recipe-format")} for authoring and producer-only execution.`,
				},
			],
		},
		{
			title: "The Two Roots",
			content: [
				{
					type: "text",
					content: rich`An A/B installation has two roots, A and B. The booted root is locked. The other root is unlocked, and changes are made there. Boot the other root and the roles swap. If a root does not finish starting, the machine starts the previous root again. Mutable installations have no recab and no A/B.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Show which root is booted and which is the other",
					command: `${admin(d)} recab status`,
				},
				{
					type: "command",
					language: "bash",
					description: "Make the other root a copy of the booted root",
					command: `${admin(d)} recab copy`,
				},
				{
					type: "text",
					content: rich`${code("recab copy")} overwrites the other root, so anything written into it before is gone. Use it to start changes from the running system. See ${link("A/B Roots", "/docs/atomic-updates")} for how a change lands.`,
				},
			],
		},
		{
			title: "Disk Usage",
			content: [
				{
					type: "text",
					content:
						"Open Recdirstat and choose Browse to see folders and a map of their sizes. Select a folder to inspect it before deciding what to keep. The two systems page compares the running system with the other root.",
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
