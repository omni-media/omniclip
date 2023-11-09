import {Media} from "../../types.js"

export interface Track {
	id: string
	track_items: TrackItem[]
}

export interface Text {
	type: "Text"
	content: string
	size: number
	color: string
}

export interface TrackItem {
	id: string
	item: Media | Text
	start: number
	end: number
	priority: number
}

