import type { DocsContent } from "../../types"

export const recipeFormatContent: DocsContent = {
	title: "Recipe Format",
	sections: [
		{
			title: "Overview",
			content: [
				{
					type: "text",
					content:
						"LevitateOS uses **S-expression recipes** - a Lisp-like format that's both human-readable and easy for LLMs to generate. The parser is only 30 lines, making it simple and reliable.",
				},
				{
					type: "text",
					content:
						"A single recipe can handle both **binary** and **source** builds, with version constraints, conditional dependencies, and split packages.",
				},
			],
		},
		{
			title: "Basic Structure",
			content: [
				{
					type: "code",
					language: "lisp",
					content: `(package "name" "version"
  (acquire ...)     ; How to get the package
  (build ...)       ; How to build (optional for binaries)
  (install ...)     ; How to install
  (configure ...)   ; Post-install configuration (optional)
  (deps ...)        ; Dependencies (optional)
)`,
				},
			],
		},
		{
			title: "Examples",
			content: [],
		},
		{
			title: "Binary Package",
			level: 3,
			content: [
				{ type: "text", content: "Simple binary download and install:" },
				{
					type: "code",
					language: "lisp",
					content: `(package "ripgrep" "14.1.0"
  (acquire
    (binary
      (x86_64 "https://github.com/BurntSushi/ripgrep/releases/download/14.1.0/ripgrep-14.1.0-x86_64-unknown-linux-musl.tar.gz")))
  (build
    (extract tar-gz))
  (install
    (to-bin "rg")
    (to-man "doc/rg.1")))`,
				},
			],
		},
		{
			title: "Source Package",
			level: 3,
			content: [
				{ type: "text", content: "Build from source with dependencies:" },
				{
					type: "code",
					language: "lisp",
					content: `(package "htop" "3.3.0"
  (acquire
    (source "https://github.com/htop-dev/htop/releases/download/3.3.0/htop-3.3.0.tar.xz"
      (sha256 "abc123...")))
  (deps
    (build "gcc" "make" "ncurses-dev")
    (runtime "ncurses"))
  (build
    (extract tar-xz)
    (run "./configure --prefix=/usr")
    (run "make"))
  (install
    (run "make install DESTDIR=$PKG")))`,
				},
			],
		},
		{
			title: "Package with Features",
			level: 3,
			content: [
				{ type: "text", content: "Conditional dependencies based on features:" },
				{
					type: "code",
					language: "lisp",
					content: `(package "firefox" "133.0"
  (acquire
    (binary
      (x86_64 "https://...")))
  (deps
    (runtime
      "gtk3 >= 3.24"
      "dbus"
      (if wayland "wayland >= 1.20")
      (if pulseaudio "pulseaudio")
      (if pipewire "pipewire")))
  (features
    (default wayland pulseaudio)
    (optional pipewire))
  (install
    (to-prefix "lib/firefox")))`,
				},
			],
		},
		{
			title: "Actions Reference",
			content: [],
		},
		{
			title: "acquire",
			level: 3,
			content: [
				{ type: "text", content: "How to download the package:" },
				{
					type: "code",
					language: "lisp",
					content: `(acquire
  ; Binary: pre-built binaries per architecture
  (binary
    (x86_64 "URL")
    (aarch64 "URL"))

  ; Source: tarball with optional checksum
  (source "URL"
    (sha256 "HASH"))

  ; Git: clone from repository
  (git "URL"
    (tag "v1.0.0"))
    ; or (branch "main")
    ; or (commit "abc123")))`,
				},
			],
		},
		{
			title: "build",
			level: 3,
			content: [
				{ type: "text", content: "Build steps:" },
				{
					type: "code",
					language: "lisp",
					content: `(build
  ; Extract archives
  (extract tar-gz)   ; .tar.gz
  (extract tar-xz)   ; .tar.xz
  (extract tar-bz2)  ; .tar.bz2
  (extract zip)      ; .zip

  ; Run commands
  (run "./configure --prefix=/usr")
  (run "make -j$(nproc)")

  ; Apply patches
  (patch "fix-musl.patch")

  ; Set environment
  (env "CFLAGS" "-O2 -pipe"))`,
				},
			],
		},
		{
			title: "install",
			level: 3,
			content: [
				{ type: "text", content: "Installation locations:" },
				{
					type: "code",
					language: "lisp",
					content: `(install
  ; Install to /usr/bin
  (to-bin "binary-name")

  ; Install to /usr/lib
  (to-lib "libfoo.so")

  ; Install man pages
  (to-man "doc/program.1")

  ; Install to custom prefix
  (to-prefix "lib/program")

  ; Run make install
  (run "make install DESTDIR=$PKG"))`,
				},
			],
		},
		{
			title: "deps",
			level: 3,
			content: [
				{ type: "text", content: "Dependency specification:" },
				{
					type: "code",
					language: "lisp",
					content: `(deps
  ; Build-time only
  (build "gcc" "make" "cmake")

  ; Runtime dependencies
  (runtime
    "glibc"
    "openssl >= 3.0"      ; Minimum version
    "libpng ~= 1.6"       ; Compatible release (1.6.x)
    "zlib >= 1.2, < 2.0"  ; Version range
  )

  ; Conditional dependencies
  (runtime
    (if wayland "wayland-protocols")
    (if !x11 "xorg-libs")))`,
				},
			],
		},
		{
			title: "configure",
			level: 3,
			content: [
				{ type: "text", content: "Post-install configuration:" },
				{
					type: "code",
					language: "lisp",
					content: `(configure
  ; Create config file
  (config "/etc/program.conf"
    "setting=value")

  ; Create symlink
  (link "/usr/bin/program" "/usr/bin/prog")

  ; Set file permissions
  (chmod "/usr/bin/program" "755")

  ; Run post-install script
  (run "ldconfig"))`,
				},
			],
		},
		{
			title: "Version Constraints",
			content: [
				{
					type: "table",
					headers: ["Operator", "Example", "Meaning"],
					rows: [
						[">=", ">= 1.0", "1.0 or higher"],
						["<=", "<= 2.0", "2.0 or lower"],
						["~=", "~= 1.4", "Compatible release (1.4.x, < 2.0)"],
						["=", "= 1.0.0", "Exact version"],
						[",", ">= 1.0, < 2.0", "Multiple constraints (AND)"],
					],
					monospaceCol: 0,
				},
			],
		},
		{
			title: "Split Packages",
			content: [
				{
					type: "text",
					content:
						"Create subpackages for development files, documentation, etc:",
				},
				{
					type: "code",
					language: "lisp",
					content: `(package "openssl" "3.2.0"
  (acquire (source "..."))
  (build ...)
  (install ...)

  (split "openssl-dev"
    (files
      "usr/include/*"
      "usr/lib/*.a"
      "usr/lib/pkgconfig/*")
    (deps (runtime "openssl"))))`,
				},
			],
		},
		{
			title: "LLM Generation",
			content: [
				{
					type: "text",
					content:
						"The S-expression format was specifically designed for small LLMs (3B parameters) to generate reliably. The simple grammar and consistent structure mean fewer hallucinations compared to YAML or TOML.",
				},
				{ type: "text", content: "To generate a recipe, ask the AI installer:" },
				{
					type: "conversation",
					messages: [{ role: "user", text: "create a recipe for ripgrep 14.1.0" }],
				},
			],
		},
	],
}
