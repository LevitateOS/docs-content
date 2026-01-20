import type { DocsContent } from "../../types"
import { rich, code, link } from "../../rich-text"

export const installationConfigContent: DocsContent = {
	title: "Configuration",
	intro: rich`Installation steps 9-13: Configure timezone, locale, hostname, and user accounts. See ${link("Installation", "/docs/installation")} for an overview.`,
	sections: [
		{
			title: "9. Set Timezone",
			content: [
				{
					type: "code",
					language: "bash",
					content: `# List timezones
ls /usr/share/zoneinfo/

# Set your timezone (example: US Eastern)
ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

# Sync hardware clock
hwclock --systohc`,
				},
			],
		},
		{
			title: "10. Set Locale",
			content: [
				{
					type: "text",
					content: "Enable and generate your locale:",
				},
				{
					type: "code",
					language: "bash",
					content: `# Uncomment en_US.UTF-8 (or your preferred locale)
sed -i 's/#en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen

# Generate locales
locale-gen

# Set system locale
echo "LANG=en_US.UTF-8" > /etc/locale.conf`,
				},
				{
					type: "text",
					content: rich`For other locales, edit ${code("/etc/locale.gen")} and uncomment the lines you need before running ${code("locale-gen")}.`,
				},
			],
		},
		{
			title: "11. Set Hostname",
			content: [
				{
					type: "text",
					content: rich`Set your hostname (replace ${code("myhostname")} with your preferred name):`,
				},
				{
					type: "code",
					language: "bash",
					content: `echo "myhostname" > /etc/hostname`,
				},
				{
					type: "text",
					content: "Create the hosts file:",
				},
				{
					type: "code",
					language: "bash",
					content: `nano /etc/hosts`,
				},
				{
					type: "code",
					filename: "/etc/hosts",
					content: `127.0.0.1   localhost
::1         localhost
127.0.1.1   myhostname.localdomain myhostname`,
				},
			],
		},
		{
			title: "12. Set Root Password",
			content: [
				{
					type: "code",
					language: "bash",
					content: `passwd`,
				},
			],
		},
		{
			title: "13. Create User Account",
			content: [
				{
					type: "text",
					content: rich`Create your user (replace ${code("yourname")} with your username):`,
				},
				{
					type: "code",
					language: "bash",
					content: `useradd -m -G wheel -s /bin/bash yourname
passwd yourname`,
				},
				{
					type: "text",
					content: "Enable sudo for the wheel group:",
				},
				{
					type: "code",
					language: "bash",
					content: `nano /etc/sudoers.d/wheel`,
				},
				{
					type: "code",
					filename: "/etc/sudoers.d/wheel",
					content: `%wheel ALL=(ALL:ALL) ALL`,
				},
				{
					type: "code",
					language: "bash",
					content: `chmod 0440 /etc/sudoers.d/wheel`,
				},
				{
					type: "text",
					content: rich`Continue to ${link("Bootloader & Finish", "/docs/installation-boot")} (steps 14-16).`,
				},
			],
		},
	],
}
