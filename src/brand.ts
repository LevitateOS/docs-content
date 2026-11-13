/**
 * How each distro's own terminal screens are told apart: its name and its dark palette
 * (surfaces, text, rules, accents, header band, status colours) and the accents that the
 * older callers read directly. The colours come from each variant's `distro.toml`
 * (`[look.dark]`) through the generated `distros.ts`, not from the website.
 */
import { DISTROS, distroByOsId, osReleaseValue, type Distro } from "./distros";

/** One mode's colours, as `#rrggbb`. */
export type Palette = { -readonly [K in keyof Distro["look"]["light"]]: `#${string}` };

/** The distro an os-release text belongs to, when it is one of ours. */
export function distroOfOsRelease(osRelease: string): Distro | undefined {
	const id = osReleaseValue(osRelease, "ID");
	return id ? distroByOsId(id.toLowerCase()) : undefined;
}

/** A distro's name and its DARK palette, always. Terminal apps are dark on both distros (a
 * light terminal app is unnatural), each in its own dark palette; the mode a distro starts
 * in (`profile.appearance`) is for its desktop and its pages on the website, which read
 * `look` themselves. Without a distro (a checkout on another system) the colours are
 * LevitateOS's and nobody is named. */
export function brandOf(distro: Distro | undefined) {
	const own = distro ?? DISTROS.find((d) => d.id === "levitate") ?? DISTROS[0];
	const palette: Palette = own.look.dark;
	return {
		name: distro?.osName ?? "",
		palette,
		accent: palette.accent,
		highlight: palette.highlight,
		band: palette.band,
	};
}
