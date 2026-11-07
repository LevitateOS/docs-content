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
	intro: "Library for running scenario VMs as libvirt domains and driving them over the serial console.",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content: rich`${code("recqemu")} is a Rust library, not a standalone CLI. Every VM the scenarios and ${code("cargo xtask run")} boot is a transient libvirt domain on the user's session (${code("qemu:///session")}, or ${code("LEVITATE_LIBVIRT_URI")}), named ${code("<distro>-<scenario>")}, so it can be watched and managed in Cockpit or with ${code("virsh -c qemu:///session list")}.`,
				},
				{
					type: "note",
					variant: "info",
					content: rich`${bold("Library-only")}: use this from Rust code paths; there is no user-facing ${code("recqemu")} command binary.`,
				},
				{
					type: "text",
					content: rich`Each domain has 4 GiB of memory, 4 CPUs (KVM when ${code("/dev/kvm")} exists), a q35 machine with UEFI (OVMF), user networking through passt, and a VNC display on 127.0.0.1 for Cockpit. A guest reboot or power-off ends the domain, so the caller starts the next boot.`,
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
						[rich`${code("libvirt::DomainSpec")}`, "A VM: firmware, disk, boot ISO, extra CDs, fw_cfg entries, SSH forward, serial target and log"],
						[rich`${code("libvirt::Domain")}`, "Create (paused), resume, keep running, or destroy a domain"],
						[rich`${code("serial::Console")}`, "Serial console: wait for boot, log in, run commands and read their exit status"],
						[rich`${code("serial::protocol")}`, "The serial test protocol and its guest-side profile script"],
						[rich`${code("find_ovmf / find_ovmf_vars")}`, "Firmware discovery (OVMF_PATH, else the Fedora, Debian/Ubuntu, Arch and NixOS locations)"],
						[rich`${code("create_disk")}`, "Create a qcow2 disk with qemu-img"],
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
					content: `use recqemu::libvirt::{Domain, DomainSpec, SerialTarget, UefiVars};
use recqemu::serial::Console;

let spec = DomainSpec {
    name: "levitate-live-boot".into(),
    title: "Scenario VM levitate-live-boot".into(),
    uefi_code: recqemu::find_ovmf()?,
    uefi_vars: UefiVars::Fresh { template: recqemu::find_ovmf_vars()?, path: vars_path },
    disk: Some(disk),
    boot_iso: Some(iso),
    extra_cdroms: vec![],
    fw_cfg: vec![],
    ssh_forward: Some(port),
    serial: SerialTarget::Socket(socket.clone()),
    serial_log: log,
};
let domain = Domain::create_paused(&spec)?;   // paused: no output is missed
let mut console = Console::connect(&socket, Duration::from_secs(20))?;
domain.resume()?;`,
				},
			],
		},
		{
			title: "Requirements",
			content: [
				{
					type: "list",
					items: [
						"libvirt with the QEMU driver (the session daemon starts on demand)",
						"passt, for user networking",
						"OVMF (edk2) firmware",
						rich`${code("qemu-img")}, for ${code("create_disk")}`,
						rich`Cockpit with ${code("cockpit-machines")} to manage the VMs in a browser (optional)`,
					],
				},
				{
					type: "text",
					content: rich`${code("cargo xtask doctor")} checks these.`,
				},
			],
		},
		{
			title: "Consumers",
			content: [
				{
					type: "list",
					items: [
						rich`${code("testing/install-tests")} (the scenarios)`,
						rich`${code("xtask")} (${code("cargo xtask run")}, with a pty serial console for ${code("virsh console")})`,
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
						rich`${link("reciso", "/docs/reciso")} - ISO artifacts to boot in the VMs`,
						rich`${link("Installation Tools Overview", "/docs/installation-tools-overview")} - Installer-facing commands`,
					],
				},
			],
		},
	],
}
