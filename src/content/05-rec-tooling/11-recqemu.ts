import type { DocsContent } from "../../types"
import { rich, bold, code, link } from "../../rich-text"

export const recqemuContent: DocsContent = {
	title: "recqemu",
	meta: {
		product: "shared",
		scopes: ["reference"],
		audience: ["developer"],
		stability: "experimental",
	},
	intro: "Library utilities for QEMU command construction and test process management.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`${code("recqemu")} is a Rust library, not a standalone CLI. It is used by test harnesses and runtime wrappers for consistent VM command generation.`,
				},
				{
					type: "note",
					variant: "info",
					content: rich`${bold("Library-only")}: use this from Rust code paths; there is no user-facing ${code("recqemu")} command binary.`,
				},
			],
		},
		{
			title: "Primary API Surface",
			content: [
				{
					type: "table",
					headers: ["API", "Purpose"],
					rows: [
						[rich`${code("QemuBuilder")}`, "Fluent QEMU command construction"],
						[rich`${code("find_ovmf/find_ovmf_vars")}`, "Firmware discovery across distros"],
						[rich`${code("create_disk")}`, "Create qcow2 disks"],
						[rich`${code("serial::Console")}`, "Serial console IO primitives"],
						[rich`${code("process::*")}`, "QEMU process/lock utilities"],
					],
					monospaceCol: 0,
				},
			],
		},
		{
			title: "Rust Example",
			content: [
				{
					type: "code",
					language: "rust",
					content: `use recqemu::{create_disk, find_ovmf, QemuBuilder};
use std::path::Path;

create_disk(Path::new("disk.qcow2"), "20G")?;

let ovmf = find_ovmf().expect("OVMF not found");
let mut cmd = QemuBuilder::new()
    .memory("4G")
    .smp(4)
    .cdrom("levitate.iso")
    .disk("disk.qcow2")
    .uefi(ovmf)
    .user_network()
    .build_interactive();

cmd.status()?;`,
				},
			],
		},
		{
			title: "Consumers",
			content: [
				{
					type: "list",
					items: [
						rich`${code("testing/install-tests")} (QEMU test sessions and console control)`,
						rich`runtime wrappers that need deterministic QEMU command composition`,
					],
				},
			],
		},
		{
			title: "See Also",
			content: [
				{
					type: "list",
					items: [
						rich`${link("reciso", "/docs/reciso")} - ISO artifacts to boot in QEMU`,
						rich`${link("Installation Tools Overview", "/docs/installation-tools-overview")} - Installer-facing commands`,
					],
				},
			],
		},
	],
}
