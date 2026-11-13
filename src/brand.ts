/**
 * How each distro's own screens are told apart: the mode it starts in, its palette in that
 * mode (surfaces, text, rules, accents, header band, status colours) and the accents that
 * the older callers read directly. The colours come from each variant's `distro.toml`
 * (`[look.light]` and `[look.dark]`, the mode in `profile.appearance`) through the
 * generated `distros.ts`, not from the website: the terminal apps, the desktop look and
 * the website all take them from the same declaration.
 */
import { DISTROS, distroByOsId, osReleaseValue, type Distro } from "./distros";

/** One mode's colours, as `#rrggbb`. */
export type Palette = { -readonly [K in keyof Distro["look"]["light"]]: `#${string}` };

/** The mode a distro starts in. */
export type Appearance = Distro["profile"]["appearance"];

/** The distro an os-release text belongs to, when it is one of ours. */
export function distroOfOsRelease(osRelease: string): Distro | undefined {
	const id = osReleaseValue(osRelease, "ID");
	return id ? distroByOsId(id.toLowerCase()) : undefined;
}

/** A distro's name, starting mode and colours of that mode. Without one (a checkout on
 * another system) the colours are LevitateOS's and nobody is named. */
export function brandOf(distro: Distro | undefined) {
	const own = distro ?? DISTROS.find((d) => d.id === "levitate") ?? DISTROS[0];
	const appearance: Appearance = own.profile.appearance;
	const palette: Palette = own.look[appearance];
	return {
		name: distro?.osName ?? "",
		appearance,
		palette,
		accent: palette.accent,
		highlight: palette.highlight,
		band: palette.band,
	};
}
