import type { DocsContent } from "../../types"
import { rich, link } from "../../rich-text"

export const postInstallationContent: DocsContent = {
	title: "Post-Installation",
	intro: rich`After rebooting, log in with your user account and start using your new system.`,
	sections: [
		{
			title: "Package Management",
			content: [
				{
					type: "text",
					content: "Install additional packages using the recipe package manager:",
				},
				{
					type: "note",
					variant: "info",
					content:
						"Immutable-by-default: recipe changes are composed into the inactive slot (B) and activated on reboot after a trial boot + commit. Mutable mode exists as an explicit opt-in for daredevils.",
				},
				{
					type: "command",
					description: "List available packages",
					command: "recipe list",
				},
				{
					type: "command",
					description: "Install a package",
					command: "recipe install ripgrep",
				},
				{
					type: "command",
					description: "View package info",
					command: "recipe info firefox",
				},
				{
					type: "text",
					content: rich`See the ${link("CLI Reference", "/docs/cli-reference")} for all available commands.`,
				},
			],
		},
		{
			title: "System Updates",
			content: [
				{
					type: "text",
					content: "Keep your system up to date (A/B default):",
				},
				{
					type: "command",
					description: "Update package lists",
					command: "recipe update",
				},
				{
					type: "command",
					description: "Upgrade installed packages",
					command: "recipe upgrade",
				},
				{
					type: "command",
					description: "Reboot to trial-boot the updated slot (B)",
					command: "reboot",
				},
			],
		},
		{
			title: "Graphics Drivers",
			content: [
				{
					type: "text",
					content: "Intel and AMD graphics work out of the box. For NVIDIA:",
				},
				{
					type: "command",
					description: "Install NVIDIA proprietary drivers",
					command: "recipe install nvidia-driver",
				},
				{
					type: "command",
					description: "Reboot to load the driver",
					command: "reboot",
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
