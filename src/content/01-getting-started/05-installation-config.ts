import type { DocsContent } from "../../types"
import { rich, code, link } from "../../rich-text"

export const installationConfigContent: DocsContent = {
	title: "Configuration",
	meta: { product: "levitate", scopes: ["install"], audience: ["beginner"], stability: "stable" },
	intro: rich`Installation steps 10-14: Configure timezone, locale, hostname, and user accounts. See ${link("Installation", "/docs/installation")} for an overview.`,
	sections: [
		{
			title: "10. Set Timezone",
			content: [
				{
					type: "command",
					language: "bash",
					description: "List available timezones",
					command: "ls /usr/share/zoneinfo/",
				},
				{
					type: "command",
					language: "bash",
					description: "Set your timezone (example: US Eastern)",
					command: "ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime",
				},
				{
					type: "command",
					language: "bash",
					description: "Sync hardware clock",
					command: "hwclock --systohc",
				},
			],
		},
		{
			title: "11. Set Locale",
			content: [
				{
					type: "text",
					content: "Enable and generate your locale:",
				},
				{
					type: "command",
					language: "bash",
					description: "Uncomment en_US.UTF-8 (or your preferred locale)",
					command: "sed -i 's/#en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen",
				},
				{
					type: "command",
					language: "bash",
					description: "Generate locales",
					command: "locale-gen",
				},
				{
					type: "command",
					language: "bash",
					description: "Set system locale",
					command: 'echo "LANG=en_US.UTF-8" > /etc/locale.conf',
				},
				{
					type: "text",
					content: rich`For other locales, edit ${code("/etc/locale.gen")} and uncomment the lines you need before running ${code("locale-gen")}.`,
				},
			],
		},
		{
			title: "12. Set Hostname",
			content: [
				{
					type: "text",
					content: rich`Set your hostname (replace ${code("myhostname")} with your preferred name):`,
				},
				{
					type: "command",
					language: "bash",
					description: "Set hostname",
					command: 'echo "myhostname" > /etc/hostname',
				},
				{
					type: "command",
					language: "bash",
					description: "Create the hosts file",
					command: `cat > /etc/hosts << 'EOF'
127.0.0.1   localhost
::1         localhost
127.0.1.1   myhostname.localdomain myhostname
EOF`,
				},
			],
		},
		{
			title: "13. Set Root Password",
			content: [
				{
					type: "command",
					language: "bash",
					description: "Set the root password",
					command: "passwd",
				},
			],
		},
		{
			title: "14. Create User Account",
			content: [
				{
					type: "text",
					content: rich`Create your user (replace ${code("yourname")} with your username):`,
				},
				{
					type: "command",
					language: "bash",
					description: "Create user with home directory and add to wheel group",
					command: "useradd -m -G wheel -s /bin/bash yourname",
				},
				{
					type: "command",
					language: "bash",
					description: "Set user password",
					command: "passwd yourname",
				},
				{
					type: "text",
					content: "Enable sudo for the wheel group:",
				},
				{
					type: "command",
					language: "bash",
					description: "Create sudoers file for wheel group",
					command: `echo '%wheel ALL=(ALL:ALL) ALL' > /etc/sudoers.d/wheel && chmod 0440 /etc/sudoers.d/wheel`,
				},
				{
					type: "text",
					content: rich`Continue to ${link("Bootloader & Finish", "/docs/installation-boot")} (steps 15-18).`,
				},
			],
		},
	],
}
