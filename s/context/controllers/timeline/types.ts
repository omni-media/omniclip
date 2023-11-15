import {Media} from "../../../components/omni-media/types.js"
import {V2} from "../../../components/omni-timeline/utils/coordinates_in_rect.js"

export interface Timeline {
	length: number
	clips: XClip[]
	tracks: XTrack[]
}

export interface Text {
	type: "Text"
	content: string
	size: number
	color: string
}

export interface XClip {
	id: string
	item: Media | Text
	start_at_position: number
	length: number
	start: number
	end: number
	track: number
}

export interface At {
	coordinates: V2
	indicator: Indicator
}

export interface XTrack {
	id: string
}

export type Indicator = "add-track-indicator"
