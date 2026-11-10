import { distroPage } from "../../types";
import { rich, code } from "../../rich-text";
import { bootArgs, commands, EXAMPLE_DISK, UEFI_VARS } from "../../install";
import { admin, network, PAGE_TITLES, RECIPE, services } from "../../pages";

const disk = EXAMPLE_DISK.disk;
const target = EXAMPLE_DISK.target;

export default distroPage((d) => ({
	title: PAGE_TITLES.troubleshooting,
	intro: `Common issues and solutions for ${d.osName} installation and usage.`,
	sections: [
		{
			title: "Install Issues",
			content: [
				{
					type: "qa",
					items: [
						{
							question: "recpart refuses the disk",
							answer: [
								{
									type: "text",
									content: rich`It prints the check that failed, an error code and what to do. ${code("--dry-run")} runs the same checks without changing anything.`,
								},
								{
									type: "command",
									language: "bash",
									description: "Show the steps and anything apply would refuse",
									command: commands.partition(disk, true),
								},
							],
						},
					],
				},
			],
		},
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
									command: EXAMPLE_DISK.mounts.map((m) => `mount ${m.device} ${m.path}`),
								},
								{
									type: "command",
									language: "bash",
									description:
										"Check that both slot entries and slot A's kernel are on the EFI partition",
									command: [`ls ${target}/boot/loader/entries`, `ls ${target}/boot/${d.osId}-a`],
								},
								{
									type: "text",
									content: rich`You should see ${code(`${d.osId}-a.conf`)} and ${code(`${d.osId}-b.conf`)}, and ${code("vmlinuz")} and ${code("initramfs.img")} for slot A. Each entry's ${code("options")} line names its slot by ${code("root=PARTUUID=")}; compare it with ${code(`blkid -s PARTUUID ${EXAMPLE_DISK.slot_a}`)}.`,
								},
								{
									type: "command",
									language: "bash",
									description: "Reinstall systemd-boot and the A/B boot layout",
									command: commands.boot(target, bootArgs(EXAMPLE_DISK) as string),
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
									command: `ls ${UEFI_VARS}`,
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
									content: rich`A trial judged failed is not committed and requests a reboot into the known-good slot. Health-checker errors and hard hangs still have recovery gaps; a hang needs a watchdog or manual reboot. ${code("recab status")} shows the running and known-good slots and the last recorded trial. Fix the cause before retrying. Current ${code("stage")} replaces the inactive system and would discard pending changes there.`,
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
									description: "Check the interfaces and their addresses",
									command: "ip addr",
								},
								{
									type: "command",
									language: "bash",
									description: `Check that ${network(d).daemon} runs`,
									command: services(d).status(network(d).daemon),
								},
								{
									type: "command",
									language: "bash",
									description: "Start it now and at every boot",
									command: services(d).enable(network(d).daemon),
								},
							],
						},
						{
							question: "WiFi adapter not detected",
							answer: [
								{
									type: "command",
									language: "bash",
									description: "List wireless devices",
									command: network(d).listWifi,
								},
								{ type: "text", content: network(d).firmware },
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
										`${admin(d)} recipe isacquired packagename`,
										`${admin(d)} recipe isbuilt packagename`,
										`${admin(d)} recipe isinstalled packagename`,
									],
								},
								{
									type: "text",
									content: rich`Inspect ${code("recipe explain packagename")}: downloads need every server and redirect target in the recipe's ${code("NEEDS.network")}. Caller ${code("--network-host")} and ${code("--no-network")} can only restrict it. Manual checks require matching cached dependency products; run install separately to prepare a missing dependency. The full log of every run is under ${code(`${RECIPE.state}/logs/`)}.`,
								},
								{
									type: "command",
									language: "bash",
									description: "Retry, redoing acquisition and build",
									command: `${admin(d)} recipe install packagename --force-acquire`,
								},
							],
						},
					],
				},
			],
		},
	],
}));
