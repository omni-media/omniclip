export type V2 = [number, number]

export interface XTimeline {
	is_playing: boolean
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

export interface TextEffect extends Effect {
	kind: "text"
	content: string
	color: string
	size: number
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
