export type V2 = [number, number]
export type ExportStatus = "complete" | "composing" | "demuxing" | "flushing"

export interface TimelineHistorical {
	selected_effect: AnyEffect | null
	effects: AnyEffect[]
	tracks: XTrack[]
}

export interface TimelineNonHistorical {
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
}

export type XTimeline = TimelineNonHistorical & TimelineHistorical

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
}

export interface AudioEffect extends Effect {
	kind: "audio"
	raw_duration: number
}

export interface ImageEffect extends Effect {
	kind: "image"
	url: string
}

export type TextEffectProps = Omit<TextEffect, keyof Effect | "kind">
export type FontStyle = "italic" | "bold" | "normal"
export type Font = "Arial" | "Lato"
export type TextAlign = "left" | "right" | "center"

export interface TextRect {
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
	rect: TextRect
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

export type Indicator = "add-track-indicator"
export type Status = "render" | "decode" | "demux" | "fetch"
