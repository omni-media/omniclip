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
}

export interface AudioEffect extends Effect {
	kind: "audio"
	raw_duration: number
}

export interface ImageEffect extends Effect {
	kind: "image"
	url: string
	rect: EffectRect
}

export type TextEffectProps = Omit<TextEffect, keyof Effect | "kind">
export type FontStyle = "italic" | "bold" | "normal"
export type Font = "Arial" | "Lato"
export type TextAlign = "left" | "right" | "center"

export interface EffectRect {
	width: number
	height: number
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

export type AspectRatio = "16/9" | "16/10" | "4/3"

export type Settings = {
	width: number
	height: number
	aspect_ratio: AspectRatio
}

export type Indicator = "add-track-indicator"
export type Status = "render" | "decode" | "demux" | "fetch"
