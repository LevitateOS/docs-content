import type { DocsContent } from "../../types";
import { rich, code, link } from "../../rich-text";

export const installationConfigContent: DocsContent = {
	title: "Configuration",
	meta: { product: "levitate", scopes: ["install"], audience: ["beginner"], stability: "stable" },
	intro:
		"Run these commands in the live shell, with the installed system mounted at /mnt. Recipe prepares the system defaults; recsetup applies your machine's choices using the setup program shipped in that system.",
	sections: [
		{
			title: "10. Inspect Available Choices",
			content: [
				{
					type: "command",
					language: "bash",
					description: "List the target's timezones, locales, keymaps, shells, groups and services",
					command: "recsetup inspect --root /mnt --json",
				},
			],
		},
		{
			title: "11. Set Timezone and Locale",
			content: [
				{
					type: "command",
					language: "bash",
					description: "Preview your choices",
					command: "recsetup plan --root /mnt --timezone Europe/Brussels --locale en_US.UTF-8",
				},
				{
					type: "command",
					language: "bash",
					description: "Apply timezone and locale",
					command: "recsetup apply --root /mnt --timezone Europe/Brussels --locale en_US.UTF-8",
				},
				{
					type: "text",
					content: rich`Choose values listed by ${code("recsetup inspect")}. To select a console layout, add ${code("--keymap us")} with an available keymap.`,
				},
			],
		},
		{
			title: "12. Set Hostname",
			content: [
				{
					type: "command",
					language: "bash",
					description: "Set hostname and its hosts-file mapping",
					command: "recsetup apply --root /mnt --hostname myhostname",
				},
			],
		},
		{
			title: "13. Set Root Password",
			content: [
				{
					type: "text",
					content:
						"The release image has a locked root account. Set a password interactively; it is never stored in a setup request or passed as a command argument.",
				},
				{
					type: "command",
					language: "bash",
					description: "Set the installed root password",
					command: "recchroot /mnt -- passwd",
				},
			],
		},
		{
			title: "14. Create User Account",
			content: [
				{
					type: "command",
					language: "bash",
					description: "Create an administrator without putting a password in the request",
					command: `cat > /tmp/user-setup.json <<'EOF'
{"users":[{"name":"yourname","admin":true,"password":false}]}
EOF
recsetup apply --root /mnt --request /tmp/user-setup.json
recchroot /mnt -- passwd yourname`,
				},
				{
					type: "text",
					content:
						"The system recipe already supplies the administrator rule for wheel. No additional sudoers file is needed.",
				},
				{
					type: "text",
					content: rich`Continue to ${link("Bootloader & Finish", "/docs/installation-boot")}.`,
				},
			],
		},
	],
};
