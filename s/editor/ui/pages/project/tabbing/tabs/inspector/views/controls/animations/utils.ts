
import {AnimationPreset, animationPresets, Item} from "@omnimedia/omnitool"

export type PresetChoice = AnimationPreset | "none"
export type PresetDirection = "enter" | "exit"
export type PresetItem = Item.Text | Item.Video | Item.Image

const ORDER = ["fade", "slide", "zoom", "spin", "bounce"]

const presetOrder = (name: string) => {
	const i = ORDER.findIndex(prefix => name.toLowerCase().startsWith(prefix))
	return i === -1 ? ORDER.length : i
}

export const getPresetEntries = (direction: PresetDirection) => {
	const suffix = direction === "enter" ? "In" : "Out"
	return (Object.entries(animationPresets) as [AnimationPreset, typeof animationPresets[AnimationPreset]][])
		.filter(([name]) => name.endsWith(suffix))
		.sort(([a], [b]) => presetOrder(a) - presetOrder(b))
}

export const seconds = (ms: number) =>
	Number((ms / 1000).toFixed(2))
