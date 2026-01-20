import type { DocsContent } from "../../types"
import { rich, code, link } from "../../rich-text"

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
					content: "Keep your system up to date:",
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
			],
		},
		{
			title: "Next Steps",
			content: [
				{
					type: "list",
					items: [
						rich`Configure your ${link("desktop environment", "/docs/desktop")} or window manager`,
						"Set up development tools and editors",
						rich`Review ${link("Troubleshooting", "/docs/troubleshooting")} if you encounter issues`,
					],
				},
			],
		},
	],
}
