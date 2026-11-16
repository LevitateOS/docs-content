import type { DocsContent } from "../../types";
import { rich, code, link } from "../../rich-text";

export default {
	title: "Recipe Format",
	intro: rich`Recipes are ${link("Rhai", "https://rhai.rs")} files. A recipe states its facts in literal declarations and writes code only for what is unusual. Every recipe starts with ${code("const RECIPE_API = 1;")} and declares a literal ${code("const NEEDS = #{...};")} for typed inputs, outputs and execution authority. An empty declaration has no inputs, outputs or network grants. Recipe reads the declarations without running the recipe, downloads and unpacks the sources, places the files, records what is done, installs, removes and cleans up. A recipe that starts no program runs on the host, confined by Recipe; any other runs inside a configured Ginux domain.`,
	sections: [
		{
			title: "Two Uses, One Format",
			content: [
				{
					type: "table",
					headers: ["Collection in the source tree", "Owner and purpose"],
					rows: [
						[
							"distro/builder/os-recipes/",
							"The OS builder: root filesystems, kernels, build tools and live overlays. Its products become system images managed by recab.",
						],
						[
							"recipes/",
							"The user-managed software catalog, starting with ripgrep. Recipe activates its package output independently of the OS image.",
						],
					],
					monospaceCol: 0,
				},
				{
					type: "text",
					content: rich`Both collections use the engine in ${code("tools/recipe")} and the same API 1 declarations. Their directory and consumer identify their purpose. A named package output selects CLI activation; the OS builder uses ${code("--no-activate")}. There is no second recipe format or engine. No image bundles apps: the desktop and its apps are group recipes in the public catalogue, installed through Recipe during the installation.`,
				},
				{
					type: "text",
					content: rich`A normal recipe has one output, and its body never names it. The output's name in ${code("NEEDS.outputs")} says what it is: ${code("package")} is a package activated in a profile, ${code("system")} is a tree written into a system root, ${code("tools")} is put on the PATH of a consumer, and any other name is a product the caller picks up. Normal package removal uses the installed receipt.`,
				},
			],
		},
		{
			title: "A Complete Recipe",
			content: [
				{
					type: "text",
					content: rich`This is the ripgrep recipe. The ${code("SOURCES")} entry is downloaded and unpacked by Recipe, and ${code("FILES")} says which of its files go where in the package. The recipe has no code at all.`,
				},
				{
					type: "code",
					language: "rhai",
					filename: "ripgrep.rhai",
					content: `const RECIPE_API = 1;
const NEEDS = #{
    outputs: #{ "package": "directory" },
    network: ["github.com:443", "release-assets.githubusercontent.com:443"],
    network_max_bytes: 8388608,
    timeout_secs: 300,
};
const ABOUT = #{
    kind: "tool", category: "utilities",
    details: "Searches the files under a folder for a text pattern, fast.",
    homepage: "https://github.com/BurntSushi/ripgrep", license: "MIT OR Unlicense",
    adds: #{ programs: ["rg"], menu: [] }, keeps: [],
};
const PACKAGE = #{ name: "ripgrep", version: "15.2.0", description: "Fast recursive text search with rg" };
const UPSTREAM = #{ github: "BurntSushi/ripgrep" };
const SOURCES = #{
    release: #{
        url: "https://github.com/BurntSushi/ripgrep/releases/download/15.2.0/ripgrep-15.2.0-x86_64-unknown-linux-musl.tar.gz",
        sha256: "33e15bcf1624b25cdd2a55813a47a2f95dbe126268203e76aa6a585d1e7b149c",
    },
};
// One source: paths are inside it; its single top folder is left out.
const FILES = [
    ["rg",          "bin/rg", 0o755],
    ["doc/rg.1",    "share/man/man1/rg.1"],
    ["COPYING",     "share/licenses/ripgrep/COPYING"],
    ["LICENSE-MIT", "share/licenses/ripgrep/LICENSE-MIT"],
    ["UNLICENSE",   "share/licenses/ripgrep/UNLICENSE"],
];`,
				},
				{
					type: "text",
					content: rich`Run it with ${code("recipe install ./ripgrep.rhai --no-activate --build-dir ./ripgrep-work")} to publish the package output without activating it.`,
				},
			],
		},
		{
			title: "Declarations",
			content: [
				{
					type: "table",
					headers: ["Part", "Purpose"],
					rows: [
						[
							"RECIPE_API",
							"The number 1. The first line of every recipe; the engine accepts nothing else.",
						],
						[
							"NEEDS",
							"What the recipe may use: inputs, defines, outputs, network, limits. Required.",
						],
						[
							"ABOUT",
							"What a front end shows: kind, category, details, homepage, license, adds, steps, keeps.",
						],
						["PACKAGE", "name, version and description, as literal strings."],
						[
							"SOURCES",
							"What Recipe downloads before anything else: a url with its sha256, or a git repository with a full commit.",
						],
						["FILES", "Which files of the sources go where in the output."],
						[
							"PACKAGES",
							"The distribution packages a group is made of; the pins file beside the recipe lists the exact ones.",
						],
						["ACCOUNTS", "Users and groups of a system output."],
						[
							"UPSTREAM",
							"Where the newest version can be found: a GitHub repository, or a latest() function.",
						],
						["RERUN", "true: run every time, never reuse a result."],
						[
							"deps, build_deps",
							"Literal lists of the recipes this one needs installed, or only while it builds.",
						],
					],
					monospaceCol: 0,
				},
				{
					type: "text",
					content: rich`Declarations are literal data: no helper calls, no variables, no arithmetic. That is how ${code("recipe list")}, ${code("info")}, ${code("validate")} and the app can show them without running the recipe. A recipe may also define ${code("build(src, out)")}, ${code("configure(tree)")} (only with ${code("PACKAGES")}), ${code("verify(out)")}, ${code("latest()")} and ${code("cleanup(reason)")}. ${code("build")} gets the unpacked sources by name in ${code("src")} and the output folder in ${code("out")}. ${code("verify")} only reads the result and starts no program. Recipes that still use ${code("ctx")}, ${code("RUNTIME")} or the hooks ${code("acquire")}, ${code("install")}, ${code("remove")}, ${code("is_acquired")}, ${code("is_built")} and ${code("is_installed")} are refused with the line to change.`,
				},
			],
		},
		{
			title: "Constants",
			content: [
				{
					type: "table",
					headers: ["Constant", "Value"],
					rows: [
						[
							"PREFIX",
							"Where the package output will live once activated; () with --no-activate, for a dependency and for other outputs.",
						],
						["JOBS", "How many jobs the user asked for, 1 to 16."],
						[
							"HOST_LIBC",
							'"glibc", "musl" or "unknown": the C library of the system the result is installed on.',
						],
						["PACKAGE_FORMAT", '"rpm" or "apk" with PACKAGES; () without.'],
						["INPUTS", "Each declared input's read-only path; () for an optional input not given."],
						["DEFINES", "Each declared define's value, given or default."],
						[
							"DEPS",
							"Each dependency's output path; a map by output name for a dependency with several outputs.",
						],
						[
							"WORK",
							"A private folder for build material, deleted after a successful run unless kept.",
						],
					],
					monospaceCol: 0,
				},
				{
					type: "text",
					content: rich`These are visible in every function the engine calls and in every function those call. A value computed at the top level is not; compute it inside the function.`,
				},
			],
		},
		{
			title: "Steps and States",
			content: [
				{
					type: "table",
					headers: ["Step", "What Recipe does"],
					rows: [
						["download", "Fetches the sources and pins for this system into the download store."],
						[
							"build",
							"Unpacks, places FILES, runs build or configure, runs verify and keeps the result.",
						],
						[
							"install",
							"Activates a package output, writes a system output into the root, or publishes a producer's outputs.",
						],
						[
							"cleanup",
							"Deletes the program's downloads, unpacked sources, build material and saved state.",
						],
					],
					monospaceCol: 0,
				},
				{
					type: "text",
					content: rich`${code("recipe install")} does every step still missing, then cleanup, unless the user chose to keep the material with ${code("--keep")}. Each step can also be run alone. A program is in one of four states, decided from Recipe's own records and not by running recipe code: ${code("none")}, ${code("downloaded")}, ${code("built")} and ${code("installed")}. ${code("recipe state NAME")} prints it.`,
				},
				{
					type: "text",
					content: rich`An interrupted ${code("build")} resumes from the newest checkpoint. A recipe saves values with ${code("save(name, value)")} and ${code("checkpoint(name)")}, and reads them back with ${code("saved(name)")} and ${code("reached(name)")}. Recipe keeps one checkpoint at most and deletes it when the install succeeds.`,
				},
			],
		},
		{
			title: "Verified Sources",
			content: [
				{
					type: "text",
					content: rich`Every ${code("SOURCES")} URL needs a full SHA256, and a Git source needs a full commit id. Recipe stores a download under its SHA256 and unpacks archives (${code("tar.gz")}, ${code("tar.xz")}, ${code("tar.bz2")}, ${code("tar.zst")}, ${code("zip")}) and ${code("rpm")} files natively, without scripts. Declare every contacted host, including redirects, in ${code("NEEDS.network")}; ${code("recipe validate")} says which one is missing. Caller ${code("--network-host HOST:PORT")} restrictions can only narrow those grants across the graph. A recipe without ${code("SOURCES")} may download inside ${code("build")} with the helpers in ${link("Acquire Helpers", "/docs/helpers-acquire")}.`,
				},
			],
		},
		{
			title: "Dependencies and Inheritance",
			content: [
				{
					type: "code",
					language: "rhai",
					content: `//! extends: base.rhai
const RECIPE_API = 1;
let deps = ["runtime-tools"];
let build_deps = ["compiler-tools"];`,
				},
				{
					type: "text",
					content: rich`${code("deps")} and ${code("build_deps")} are literal arrays, read before launch. Each dependency runs in its own instance with its own NEEDS. A dependency's output reaches the consumer through ${code("DEPS")}; a directory output named ${code("tools")} is also put on the consumer's ${code("PATH")}. Caller restrictions narrow every instance without lending parent grants. A child recipe can extend one base recipe, which declares ${code("RECIPE_API")} too. Only one level of ${code("extends")} is supported.`,
				},
			],
		},
		{
			title: "Inputs and Products",
			content: [
				{
					type: "text",
					content: rich`Declare each input name and kind in ${code("NEEDS.inputs")}, then bind immutable inputs with ${code("--input NAME=PATH")}. Dependencies use ${code("--input DEP::NAME=PATH")} and never implicitly inherit inputs. Genuine choices a caller makes are defines: declared in ${code("NEEDS.defines")} with a default (${code("()")} means required), given with ${code("--define NAME=VALUE")} and read as ${code("DEFINES.NAME")}. After a successful run the final JSON contains the published host paths in ${code("outputs")}. Declare every published name and kind in ${code("NEEDS.outputs")}. Consumers validate the names and kinds they need instead of guessing build paths.`,
				},
			],
		},
		{
			title: "Authoritative Guides",
			content: [
				{
					type: "list",
					items: [
						rich`${link("Specification", "https://github.com/LevitateOS/recipe/blob/master/docs/recipe-format.md")} - the API 1 format in full.`,
						rich`${link("Writing recipes", "https://github.com/LevitateOS/recipe/blob/master/WRITING_RECIPES.md")} - the author guide.`,
						rich`${link("Recipe README", "https://github.com/LevitateOS/recipe/blob/master/README.md")} - environment preparation, CLI, diagnostics and recovery.`,
					],
				},
			],
		},
	],
} satisfies DocsContent;
