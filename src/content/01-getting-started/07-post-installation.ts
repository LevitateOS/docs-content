import { distroPage } from "../../types";
import { rich, code, link } from "../../rich-text";
import { commands } from "../../install";
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
					content: `The desktop edition uses ${DESKTOP_NAME[d.profile.desktop]}. Open the applications menu with the icon at the bottom left. Recipe is the window for finding and managing software; Recab shows the running system and the other system slot; Recdirstat shows where disk space goes. The screenshots on the website show development previews with sample data.`,
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
					content: rich`On immutable A/B installations, persistent service configuration belongs to a Recipe system change in the inactive preparation. Commands that write ordinary ${code("/etc")} cannot change the running root. Finalize and trial-boot the prepared configuration.`,
				},
			],
		},
		{
			title: "Software with Recipe",
			content: [
				{
					type: "text",
					content: rich`On immutable A/B installations, root's Recipe package commands apply software to the prepared inactive system. The catalog starts with ${code("ripgrep")}, which provides ${code("rg")}. System changes, bundled apps and system updates belong to ${code("recab")}'s A/B continuation lifecycle, using the same Recipe/Ginux engine. The running root stays unchanged; finalize and trial-boot the preparation to activate its changes. Release merging now preserves prepared changes or reports conflicts.`,
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
					description: "Prepare ripgrep, finalize and trial-boot it (A is running)",
					command: [
						`${admin(d)} recipe --system install ripgrep`,
						`${admin(d)} recab finalize`,
						`${admin(d)} recab set-next B`,
						`${admin(d)} reboot`,
						"# After a successful trial boot:",
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
					content: rich`${code("recipe update ripgrep")} runs the currently selected recipe and applies its pinned version to the inactive preparation after successful production. Finalize and trial-boot that system to activate it. It does not fetch an unpinned upstream release or edit the recipe's version and checksum. A newer shipped catalog arrives with an OS image update; an administrator can also maintain a recipe override in ${code(RECIPE.recipes)}.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Remove ripgrep from the prepared system",
					command: `${admin(d)} recipe remove ripgrep`,
				},
				{
					type: "text",
					content: rich`Removal uses the installed receipt, so it works without the source recipe or a Ginux runtime. It removes only unchanged owned files from the prepared selection, retaining other owners and refusing administrator edits. Finalize and trial-boot to activate the removal. ${code("recipe installed")} reports active and prepared receipts, whereas ${code("recipe list")} lists available recipes.`,
				},
				{
					type: "text",
					content: rich`System software is in the booted slot's ${code("/usr/lib/recipe/profile")}; login adds its commands and ordinary users' independent profiles to ${code("PATH")}. Root's immutable-system commands do not activate the shared ${code(RECIPE.profile)}. When using a custom ${code("--package-root DIR")}, add ${code("DIR/profile/bin")} to your shell's ${code("PATH")}.`,
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
					content: `Recab imports and verifies one release manifest without changing a preparation. For unsigned local media, pass --trusted-local explicitly; a configured distribution key always requires its signature. Recab owns ${d.osName} system updates. The required flow preserves local changes and downloaded updates in one prepared continuation, in either direction. With a producer-configured source and public key, recab update check and recab update download discover and cache signed updates through Recipe without changing the running system or X. Offline update apply merges the verified release into the preparation, preserving local changes/removals or reporting conflicts. Use update conflicts, resolve and recover before finalize. Media staging uses this same merge and does not format the inactive slot. A missing original baseline needs explicit verified adoption; finalization uses the merged release’s matching boot set.`,
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
					description: "Merge the verified release and finalize if conflict-free",
					command: `${admin(d)} ${commands.stage(d)}`,
				},
				{
					type: "command",
					language: "bash",
					description:
						"Boot the staged slot once (example assumes A is running; use A when B is running)",
					command: [
						`${admin(d)} umount /mnt`,
						`${admin(d)} recab set-next B`,
						`${admin(d)} reboot`,
					],
				},
				{
					type: "text",
					content: rich`${code("recab-tui")} shows both systems, prepared changes, available/downloaded releases and conflicts. It exposes preparation, Recipe changes, configuration edits, release merging, resolution/recovery, finalization and trial controls through recab’s guarded operations. It changes the boot setup, so open it as root.`,
				},
				{
					type: "command",
					language: "bash",
					description: "Open the A/B updates screen",
					command: `${admin(d)} recab-tui`,
				},
				{
					type: "text",
					content: rich`Staging now compares the original release, prepared continuation and incoming release. It preserves prepared changes and explicit deletions or reports conflicts; it never silently replaces X. Shared ${code("/var")} and user homes persist, while system package selection is isolated by slot. A healthy trial commits; a judged failure requests fallback. ${code("recab rollback")} selects the previous known-good system while it still exists, without restoring all shared data. See ${link("Atomic Updates (A/B)", "/docs/atomic-updates")} for the complete required lifecycle and remaining gaps.`,
				},
			],
		},
		{
			title: "Disk Usage",
			content: [
				{
					type: "text",
					content: "Open Recdirstat and choose Browse to see folders and a map of their sizes. Select a folder to inspect it before deciding what to keep. The two systems page compares the running system with the other slot; read the role shown there to tell whether it is the next system or the one from before.",
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
