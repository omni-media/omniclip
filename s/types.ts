import {Track} from "./components/omni-timeline/types.js"

export type MediaType = "Audio" | "Video" | "Image" | "Text"

export interface OmniState {
	raw_media: Media[]
	timeline_data: Timeline
}

export interface Media {
	type: MediaType
	source: string
}

export type Timeline = Track[]
