
import {TextStyleOptions} from "pixi.js"
import {transitions} from "@omnimedia/omnitool"

export type BrowserTab = "media" | "transitions" | "text"

export type TextPreset = {
	id: string
	label: string
	content: string
	styles: TextStyleOptions
}

export const DEFAULT_TRANSITION_DURATION = 700
export const DEFAULT_TEXT_DURATION = 3000
export const MEDIA_GROUP = "omniclip-media"

export const TRANSITIONS = Object
	.values(transitions)
	.sort((a, b) => a.label.localeCompare(b.label))

export const TEXT_PRESETS: TextPreset[] = [
	{
		id: "basic",
		label: "Basic Title",
		content: "Title",
		styles: {fill: "#ffffff", fontSize: 64, fontWeight: "600"},
	},
	{
		id: "lower-third",
		label: "Lower Third",
		content: "Lower Third",
		styles: {fill: "#ffffff", fontSize: 42, fontWeight: "600"},
	},
	{
		id: "caption",
		label: "Caption",
		content: "Caption",
		styles: {fill: "#ffffff", fontSize: 36, fontWeight: "500"},
	},
	{
		id: "bold",
		label: "Bold Center",
		content: "Bold Title",
		styles: {fill: "#f5f5f5", fontSize: 78, fontWeight: "800"},
	},
]

