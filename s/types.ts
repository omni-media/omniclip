import {Track} from "./components/omni-timeline/types.js"

export type MediaType = "Audio" | "Video" | "Image"

export interface OmniState {
	timeline: TimelineState
}

export interface Media {
	type: MediaType
	source: string
}

export interface Text {
	content: string
	size: number
	color: string
	position_x: number
	position_y:number
}

export type TimelineState = Track[]
