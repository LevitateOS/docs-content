import type { DocsContent } from "../../types"
import { rich, code, link } from "../../rich-text"

export const postInstallationContent: DocsContent = {
	title: "Post-Installation",
	meta: {
		product: "levitate",
		scopes: ["install", "post_install"],
		audience: ["beginner"],
		stability: "stable",
	},
	intro: rich`After rebooting, log in with your user account and start using your new system.`,
	sections: [
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
					content: rich`A new LevitateOS release is written into the inactive slot (slot B after a fresh install) and trial-booted once. Mount the new release ISO, then stage its system image, kernel and initramfs:`,
				},
				{
					type: "command",
					language: "bash",
					description: "Mount the new release ISO",
					command: "sudo mount -o loop,ro levitateos-x86_64.iso /mnt",
				},
				{
					type: "command",
					language: "bash",
					description: "Write the new system into the inactive slot",
					command:
						"sudo recab stage --rootfs /mnt/live/filesystem.erofs --kernel /mnt/boot/vmlinuz --initrd /mnt/boot/initramfs-installed.img",
				},
				{
					type: "command",
					language: "bash",
					description: "Boot the staged slot once, as a trial",
					command: ["sudo umount /mnt", "sudo recab set-next B", "sudo reboot"],
				},
				{
					type: "text",
					content: rich`The hostname, accounts, enabled services, network connections and SSH host keys are carried into the new slot. If it starts cleanly, the trial service commits it; if not, the machine reboots into the previous slot by itself. ${code("recab status")} shows which slot runs and how the last trial ended, and ${code("sudo recab rollback")} returns to the previous slot later. See ${link("Atomic Updates (A/B)", "/docs/atomic-updates")}.`,
				},
			],
		},
		{
			title: "Next Steps",
			content: [
				{
					type: "list",
					items: [
						"Install a desktop environment or window manager (Sway, GNOME, KDE, etc.)",
						"Set up development tools and editors",
						rich`Review ${link("Troubleshooting", "/docs/troubleshooting")} if you encounter issues`,
					],
				},
			],
		},
	],
}
