
import {RoleScope} from "../../../../context/parts/state.js"

export type RoleSection = {
	label: string
	scope: RoleScope
}

export const roleSections: RoleSection[] = [
	{label: "Video Roles", scope: "video"},
	{label: "Text Roles", scope: "text"},
	{label: "Audio Roles", scope: "audio"},
]

export const rolePalette = ["#34527a", "#5c3b91", "#804c08", "#1b6937", "#696969", "#8f5b1e", "#236f78"]

