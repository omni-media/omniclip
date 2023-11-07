import {Media} from "../../types.js"

export type Track = TrackItem[]

export interface TrackItem {
	media: Media
	start: number
	end: number
	priority: number
}

