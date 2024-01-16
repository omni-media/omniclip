export type V2 = [number, number]

export interface XTimeline {
	is_playing: boolean
	selected_effect: AnyEffect | null
	is_exporting: boolean,
	export_progress: number,
	timecode: number
	length: number
	effects: AnyEffect[]
	tracks: XTrack[]
	zoom: number
}

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
	src: string
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
	| TextEffect
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
