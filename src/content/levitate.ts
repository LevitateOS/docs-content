import type { DocsContent } from "../types"

export const levitateContent: DocsContent = {
	title: "levitate CLI Reference",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content:
						"`levitate` is the self-sufficient package manager for LevitateOS. It handles the full package lifecycle without depending on apt, dnf, pacman, or any other package manager.",
				},
				{ type: "code", language: "bash", content: "levitate <command> [options] [arguments]" },
			],
		},
		{
			title: "Commands",
			content: [],
		},
		{
			title: "install",
			level: 3,
			content: [
				{ type: "text", content: "Install one or more packages:" },
				{
					type: "code",
					language: "bash",
					content: `levitate install <package> [packages...]

# Examples
levitate install ripgrep
levitate install firefox chromium
levitate install "openssl >= 3.0"  # With version constraint`,
				},
			],
		},
		{
			title: "remove",
			level: 3,
			content: [
				{ type: "text", content: "Remove installed packages:" },
				{
					type: "code",
					language: "bash",
					content: `levitate remove <package> [packages...]

# Examples
levitate remove firefox
levitate remove --purge firefox  # Also remove config files`,
				},
			],
		},
		{
			title: "search",
			level: 3,
			content: [
				{ type: "text", content: "Search for packages:" },
				{
					type: "code",
					language: "bash",
					content: `levitate search <query>

# Examples
levitate search browser
levitate search "text editor"`,
				},
			],
		},
		{
			title: "info",
			level: 3,
			content: [
				{ type: "text", content: "Show package details:" },
				{
					type: "code",
					language: "bash",
					content: `levitate info <package>

# Output includes:
# - Name, version, description
# - Dependencies
# - Installed files
# - Features`,
				},
			],
		},
		{
			title: "list",
			level: 3,
			content: [
				{ type: "text", content: "List packages:" },
				{
					type: "code",
					language: "bash",
					content: `levitate list              # List installed packages
levitate list --available  # List all available packages
levitate list --upgradable # List packages with updates`,
				},
			],
		},
		{
			title: "deps",
			level: 3,
			content: [
				{ type: "text", content: "Show dependency tree:" },
				{
					type: "code",
					language: "bash",
					content: `levitate deps <package>

# Example output:
# firefox
# ├── gtk3 >= 3.24
# │   ├── glib2
# │   ├── pango
# │   └── cairo
# ├── dbus
# └── wayland >= 1.20`,
				},
			],
		},
		{
			title: "update",
			level: 3,
			content: [
				{ type: "text", content: "Update package database and upgrade packages:" },
				{
					type: "code",
					language: "bash",
					content: `levitate update            # Update package database
levitate upgrade           # Upgrade all packages
levitate upgrade firefox   # Upgrade specific package`,
				},
			],
		},
		{
			title: "desktop",
			level: 3,
			content: [
				{ type: "text", content: "Install the complete Sway Wayland desktop:" },
				{
					type: "code",
					language: "bash",
					content: `levitate desktop

# Installs:
# - wayland, wlroots
# - sway (compositor)
# - foot (terminal)
# - waybar (status bar)
# - wofi (launcher)
# - mako (notifications)
# - swaylock, swayidle
# - grim, slurp (screenshots)`,
				},
			],
		},
		{
			title: "Options",
			content: [
				{
					type: "table",
					headers: ["Option", "Description"],
					rows: [
						["-y, --yes", "Assume yes to all prompts"],
						["-n, --dry-run", "Show what would be done without doing it"],
						["-v, --verbose", "Increase output verbosity"],
						["--no-deps", "Don't install dependencies"],
						["--with-features <f>", "Enable specific features"],
						["--without-features <f>", "Disable specific features"],
						["--root <path>", "Install to alternate root"],
					],
					monospaceCol: 0,
				},
			],
		},
		{
			title: "Features",
			content: [
				{
					type: "text",
					content:
						"Packages can have optional features that enable additional functionality or dependencies.",
				},
				{
					type: "code",
					language: "bash",
					content: `# Install with specific features
levitate install firefox --with-features wayland,pipewire

# Install without certain features
levitate install firefox --without-features pulseaudio

# List package features
levitate info firefox | grep Features`,
				},
			],
		},
		{
			title: "Configuration",
			content: [
				{ type: "text", content: "Configuration is stored in `/etc/levitate/config`:" },
				{
					type: "code",
					language: "bash",
					content: `# Recipe repository URL
REPO_URL=https://recipes.levitateos.org

# Package cache directory
CACHE_DIR=/var/cache/levitate

# Installation prefix
PREFIX=/usr

# Default features (comma-separated)
DEFAULT_FEATURES=wayland,pipewire`,
				},
			],
		},
		{
			title: "Exit Codes",
			content: [
				{
					type: "table",
					headers: ["Code", "Meaning"],
					rows: [
						["0", "Success"],
						["1", "General error"],
						["2", "Package not found"],
						["3", "Dependency resolution failed"],
						["4", "Download failed"],
						["5", "Build failed"],
					],
					monospaceCol: 0,
				},
			],
		},
	],
}
