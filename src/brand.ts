/**
 * How each distro's own screens are told apart: an accent, a second accent and the colour
 * of its header band. They are the website's colours for the two (its sage and pine for
 * LevitateOS, its sand and acorn brown for AcornOS), so a terminal app and a page of
 * the site read as one thing.
 */
import { distroByOsId, osReleaseValue, type Distro, type DistroId } from "./distros";

type Hex = `#${string}`;

export const BRAND: Record<DistroId, { accent: Hex; highlight: Hex; band: Hex }> = {
	levitate: { accent: "#c7d9ba", highlight: "#e4cba6", band: "#214438" },
	acorn: { accent: "#e4cba6", highlight: "#c7d9ba", band: "#644532" },
};

/** The distro an os-release text belongs to, when it is one of ours. */
export function distroOfOsRelease(osRelease: string): Distro | undefined {
	const id = osReleaseValue(osRelease, "ID");
	return id ? distroByOsId(id.toLowerCase()) : undefined;
}

/** A distro's name and colours. Without one (a checkout on another system) the colours
 * are LevitateOS's and nobody is named. */
export function brandOf(distro: Distro | undefined) {
	return { name: distro?.osName ?? "", ...BRAND[distro?.id ?? "levitate"] };
}
