import {historical, non_historical} from "./actions.js"
import {BroadcastOptions} from "../utils/with-broadcast.js"

// export interface OmniStateHistorical {
// 	timeline: HistoricalState
// }

// export interface OmniStateNonHistorical {
// 	timeline: NonHistoricalState
// }

// export type OmniState = OmniStateHistorical & OmniStateNonHistorical

export type State = HistoricalState & NonHistoricalState

export type V2 = [number, number]
export type ExportStatus = "complete" | "composing" | "demuxing" | "flushing"

export interface HistoricalState {
	projectName: string
	projectId: string
	effects: AnyEffect[]
	tracks: XTrack[]
}

export interface NonHistoricalState {
	selected_effect: AnyEffect | null
	is_playing: boolean
	is_exporting: boolean
	export_progress: number
	export_status: ExportStatus
	fps: number
	timecode: number
	length: number
	zoom: number
	timebase: number
	log: string
	settings: Settings
}

// export type XTimeline = NonHistoricalState & HistoricalState

export interface Effect {
	id: string
	start_at_position: number
	duration: number
	start: number
	end: number
	track: number
}

export interface VideoEffect extends Effect {
	kind: "video"
	thumbnail: string
	raw_duration: number
	frames: number
	rect: EffectRect
	file_hash: string
	name: string
}

export interface AudioEffect extends Effect {
	kind: "audio"
	raw_duration: number
	file_hash: string
	name: string
}

export interface ImageEffect extends Effect {
	kind: "image"
	rect: EffectRect
	file_hash: string
	name: string
}

export type TextEffectProps = Omit<TextEffect, keyof Effect | "kind">
export type FontStyle = "italic" | "bold" | "normal"
export type Font = string
export type TextAlign = "left" | "right" | "center"

export interface EffectRect {
	width: number
	height: number
	scaleX: number
	scaleY: number
	position_on_canvas: {
		x: number
		y: number
	}
	rotation: number
}

export interface TextEffect extends Effect {
	kind: "text"
	font: Font
	content: string
	color: string
	size: number
	style: FontStyle
	align: TextAlign
	rect: EffectRect
}

export type AnyEffect = (
	| VideoEffect
	| AudioEffect
	| TextEffect
	| ImageEffect
)

export type Timeline = {
  effects: AnyEffect[]
}

export interface Timecode {
	milliseconds: number
	seconds: number
	minutes: number
	hours: number
}

export interface EffectTimecode {
	timeline_start: number
	timeline_end: number
	track: number
}

export interface At {
	coordinates: V2
	indicator: Indicator
}

export interface XTrack {
	id: string
}

export interface Grabbed {
	effect: AnyEffect
	offset: {
		x: number
		y: number
	}
}

export interface ProposedTimecode {
	proposed_place: {
		start_at_position: number
		track: number
	}
	duration: number | null
	effects_to_push: AnyEffect[] | null
}

export type AspectRatio = "16/9" | "1/1" | "4/3" | "9/16" | "3/2" | "21/9"
export type Standard = "4k" | "2k" | "1080p" | "720p" | "480p"

export type Settings = {
	width: number
	height: number
	bitrate: number
	aspectRatio: AspectRatio
	standard: Standard
}

export type Indicator = AddTrackIndicator | null
export interface AddTrackIndicator {
	index: number
	type: "addTrack"
}
export type Status = "render" | "decode" | "demux" | "fetch"

// Utility type to adjust action types for broadcasting
type WithBroadcast<T> = T extends (...args: infer P) => (...innerArgs: infer I) => infer R
	? (...args: P) => (...innerArgs: [...I, BroadcastOptions?]) => R
	: never

// Apply WithBroadcast to all actions
export type HistoricalActionsWithBroadcast = {
	[K in keyof typeof historical]: WithBroadcast<typeof historical[K]>
}

export type NonHistoricalActionsWithBroadcast = {
	[K in keyof typeof non_historical]: WithBroadcast<typeof non_historical[K]>
}
