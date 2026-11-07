import type { DocsContent } from "../../types"
import { rich, code } from "../../rich-text"

export const troubleshootingContent: DocsContent = {
	title: "Troubleshooting",
	meta: { product: "levitate", scopes: ["install"], audience: ["beginner"], stability: "stable" },
	intro: "Common issues and solutions for LevitateOS installation and usage.",
	sections: [
		{
			title: "Boot Issues",
			content: [
				{
					type: "qa",
					items: [
						{
							question: "System fails to boot",
							answer: [
								{
									type: "text",
									content: "Boot from the ISO again and check the installed boot files:",
								},
								{
									type: "command",
									language: "bash",
									description: "Mount slot A, the EFI partition and the state partition",
									command: [
										"mount /dev/nvme0n1p2 /mnt",
										"mount /dev/nvme0n1p1 /mnt/boot",
										"mount /dev/nvme0n1p4 /mnt/var",
									],
								},
								{
									type: "command",
									language: "bash",
									description: "Check that both slot entries and slot A's kernel are on the EFI partition",
									command: ["ls /mnt/boot/loader/entries", "ls /mnt/boot/levitateos-a"],
								},
								{
									type: "text",
									content: rich`You should see ${code("levitateos-a.conf")} and ${code("levitateos-b.conf")}, and ${code("vmlinuz")} and ${code("initramfs.img")} for slot A. Each entry's ${code("options")} line names its slot by ${code("root=PARTUUID=")}; compare it with ${code("blkid -s PARTUUID /dev/nvme0n1p2")}.`,
								},
								{
									type: "command",
									language: "bash",
									description: "Reinstall systemd-boot and the A/B boot layout",
									command:
										"recsetup apply --root /mnt --boot ab --slot-a /dev/nvme0n1p2 --slot-b /dev/nvme0n1p3",
								},
							],
						},
						{
							question: "Bootloader not found (UEFI)",
							answer: [
								{
									type: "text",
									content: "Ensure you booted in UEFI mode and the ESP is mounted correctly:",
								},
								{
									type: "command",
									language: "bash",
									description: "Check if EFI variables are accessible",
									command: "ls /sys/firmware/efi/efivars",
								},
								{
									type: "command",
									language: "bash",
									description: "Verify ESP is mounted at /boot",
									command: "findmnt /boot",
								},
							],
						},
						{
							question: "An update did not stay",
							answer: [
								{
									type: "text",
									content: rich`A trial boot that fails, or does not finish starting, is not committed: the machine reboots into the known-good slot. ${code("recab status")} shows the running and known-good slots and how the last trial ended. Fix the cause, then stage and trial the slot again.`,
								},
								{
									type: "command",
									language: "bash",
									description: "Show the slots and the last trial",
									command: "recab status",
								},
							],
						},
					],
				},
			],
		},
		{
			title: "Network Issues",
			content: [
				{
					type: "qa",
					items: [
						{
							question: "No network after reboot",
							answer: [
								{
									type: "command",
									language: "bash",
									description: "Check NetworkManager status",
									command: "systemctl status NetworkManager",
								},
								{
									type: "command",
									language: "bash",
									description: "Start if not running",
									command: "sudo systemctl enable --now NetworkManager",
								},
								{
									type: "command",
									language: "bash",
									description: "Connect to WiFi",
									command: 'nmcli device wifi connect "YourNetwork" password "YourPassword"',
								},
							],
						},
						{
							question: "WiFi adapter not detected",
							answer: [
								{
									type: "text",
									content: "Check if the wireless driver is loaded:",
								},
								{
									type: "command",
									language: "bash",
									description: "List network interfaces",
									command: "ip link",
								},
								{
									type: "command",
									language: "bash",
									description: "Check for wireless devices",
									command: "nmcli device",
								},
								{
									type: "text",
									content:
										"If no wireless device appears, you may need to install additional firmware packages.",
								},
							],
						},
					],
				},
			],
		},
		{
			title: "Package Issues",
			content: [
				{
					type: "qa",
					items: [
						{
							question: "Package installation fails",
							answer: [
								{
									type: "text",
									content: rich`The error names the failing phase and the recipe's reason. Each phase's readiness check can be run on its own:`,
								},
								{
									type: "command",
									language: "bash",
									description: "See which phase still needs work",
									command: [
										"recipe isacquired packagename",
										"recipe isbuilt packagename",
										"recipe isinstalled packagename",
									],
								},
								{
									type: "text",
									content: rich`Networking is off unless granted: a recipe that downloads needs ${code("--network-host HOST:443")} for each server it uses. The full log of every run is under ${code("~/.local/state/recipe/logs/")}.`,
								},
								{
									type: "command",
									language: "bash",
									description: "Retry, redoing acquisition and build",
									command: "recipe install packagename --force-acquire",
								},
							],
						},
					],
				},
			],
		},
	],
}
