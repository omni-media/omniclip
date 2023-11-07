import {Media} from "../../types.js"

export type Track = TrackItem[]

export interface Text {
	content: string
	size: number
	color: string
}

export interface TrackItem {
	item: Media | Text
	start: number
	end: number
	priority: number
}

