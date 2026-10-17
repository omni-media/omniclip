
import {settings} from "./constants.js"

export const getResolutions = (aspectRatio: string) =>
	settings.format.options
		.find(f => f.value === aspectRatio)
		?.resolutions
		.map(r => ({
			value: r.value,
			label: `${r.value.replace('x', ' × ')} (${r.label.match(/\((.+)\)/)?.[1] ?? r.label})`
	}))
	?? []

export const getResolutionLabel = (aspectRatio: string, resolution: string) =>
	settings.format.options
		.find(f => f.value === aspectRatio)
		?.resolutions
		.find(r => r.value === resolution)
		?.label
		.replace(/\s*\(.+\)$/, '')
	?? resolution

export const resolutionToAspectRatio = (res: string) => {
	const [w, h] = res.split('x').map(Number)

	const gcd = (a: number, b: number): number =>
		b === 0 ? a : gcd(b, a % b)

	const d = gcd(w, h)

	return `${w / d}/${h / d}`
}

export const aspectRatioOptions =
	settings.format.options.map(f => ({value: f.value, label: f.label}))
