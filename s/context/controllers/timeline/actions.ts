import {ZipAction} from "@benev/slate/x/watch/zip/action.js"
import {generate_id} from "@benev/slate/x/tools/generate_id.js"

import {TimelineHelpers} from "./helpers.js"
import {find_place_for_new_effect} from "./utils/find_place_for_new_effect.js"
import {actionize_historical, actionize_non_historical} from "../../../utils/actionize.js"
import {AnyEffect, AudioEffect, ExportStatus, Font, FontStyle, ImageEffect, TextAlign, TextEffect, EffectRect, VideoEffect} from "./types.js"

export const timeline_non_historical_actions = actionize_non_historical({
	zoom_in: state => () => {
		state.timeline.zoom += 0.1
	},
	zoom_out: state => () => {
		state.timeline.zoom -= 0.1
	},
	set_timecode: state => (timecode: number) => {
		state.timeline.timecode = timecode
	},
	increase_timecode: state => (by_milliseconds: number) => {
		state.timeline.timecode += by_milliseconds
	},
	set_is_playing: state => (is_playing: boolean) => {
		state.timeline.is_playing = is_playing
	},
	toggle_is_playing: state => () => {
		state.timeline.is_playing = !state.timeline.is_playing
	},
	set_is_exporting: state => (is_exporting) => {
		state.timeline.is_exporting = is_exporting
	},
	set_export_progress: state => (progress: number) => {
		state.timeline.export_progress = progress
	},
	set_timebase: state => (timebase: number) => {
		state.timeline.timebase = timebase
	},
	set_export_status: state => (status: ExportStatus) => {
		state.timeline.export_status = status
	},
	set_fps: state => (fps: number) => {
		state.timeline.fps = fps
	},
	set_log: state => (log: string) => {
		state.timeline.log = log
	},
})

export const timeline_historical_actions = actionize_historical({
	add_text_effect: state => () => {
		const effect: TextEffect = {
			id: generate_id(),
			kind: "text",
			start_at_position: 0,
			duration: 5000,
			start: 0,
			end: 5000,
			track: 0,
			size: 38,
			content: "example",
			style: "normal",
			font: "Lato",
			color: "#e66465",
			align: "center",
			rect: {
				position_on_canvas: {
					x: 100,
					y: 50,
				},
				width: 100,
				height: 20,
				rotation: 0
			}
		}
		const {position, track} = find_place_for_new_effect(state.timeline.effects, state.timeline.tracks)
		effect.start_at_position = position!
		effect.track = track
		state.timeline.effects.push(effect)
	},
	add_image_effect: state => (effect: ImageEffect) => {
		state.timeline.effects.push(effect)
	},
	add_video_effect: state => (effect: VideoEffect) => {
		state.timeline.effects.push(effect)
	},
	add_audio_effect: state => (effect: AudioEffect) => {
		state.timeline.effects.push(effect)
	},
	set_text_color: state => (color: string) => {
		(state.timeline.selected_effect as TextEffect).color = color
		const effect = state.timeline.effects.find(({id}) => id === state.timeline.selected_effect?.id) as TextEffect
		effect.color = color
	},
	set_text_font: state => (font: Font) => {
		(state.timeline.selected_effect as TextEffect).font = font
		const effect = state.timeline.effects.find(({id}) => id === state.timeline.selected_effect?.id) as TextEffect
		effect.font = font
	},
	set_font_size: state => (size: number) => {
		(state.timeline.selected_effect as TextEffect).size = size
		const effect = state.timeline.effects.find(({id}) => id === state.timeline.selected_effect?.id) as TextEffect
		effect.size = size
	},
	set_font_style: state => (style: FontStyle) => {
		(state.timeline.selected_effect as TextEffect).style = style
		const effect = state.timeline.effects.find(({id}) => id === state.timeline.selected_effect?.id) as TextEffect
		effect.style = style
	},
	set_text_align: state => (align: TextAlign) => {
		(state.timeline.selected_effect as TextEffect).align = align
		const effect = state.timeline.effects.find(({id}) => id === state.timeline.selected_effect?.id) as TextEffect
		effect.align = align
	},
	set_text_rect: state => ({id}: TextEffect, rect: EffectRect) => {
		const effect = state.timeline.effects.find(effect => effect.id === id) as TextEffect
		(state.timeline.selected_effect as TextEffect).rect = rect
		effect.rect = rect
	},
	set_text_content: state => (content: string) => {
		const effect = state.timeline.effects.find(({id}) => id === state.timeline.selected_effect?.id) as TextEffect
		(state.timeline.selected_effect as TextEffect).content = content
		effect.content = content
	},
	set_selected_effect: state => (effect: AnyEffect | null) => {
		state.timeline.selected_effect = effect
	},
	set_effect_track: state => (effect: AnyEffect, track: number) => {
		const helper = new TimelineHelpers(state.timeline)
		helper.get_effect(effect.id)!.track = track
	},
	set_effect_duration: state => ({id}: AnyEffect, duration: number) => {
		const helper = new TimelineHelpers(state.timeline)
		const effect = helper.get_effect(id)
		effect!.duration = duration
		effect!.end = effect!.start + duration
	},
	set_effect_start_position: state => ({id}: AnyEffect, x: number) => {
		const helper = new TimelineHelpers(state.timeline)
		const effect = helper.get_effect(id)
		effect!.start_at_position = x
	},
	set_effect_start: state => ({id}: AnyEffect, start: number) => {
		const helper = new TimelineHelpers(state.timeline)
		const effect = helper.get_effect(id)
		effect!.start = start
	},
	set_effect_end: state => ({id}: AnyEffect, end: number) => {
		const helper = new TimelineHelpers(state.timeline)
		const effect = helper.get_effect(id)
		effect!.end = end
	},
	add_track: state => () => {
		state.timeline.tracks.push({id: generate_id()})
	},
	set_rotation: state => ({id}: TextEffect | ImageEffect | VideoEffect, rotation: number) => {
		const effect = state.timeline.effects.find(effect => effect.id === id) as TextEffect | VideoEffect | ImageEffect
		effect.rect.rotation = rotation
		if(state.timeline.selected_effect?.kind !== "audio")
			state.timeline.selected_effect!.rect.rotation = rotation
	},
	set_position_on_canvas: state => ({id}: TextEffect | ImageEffect | VideoEffect, x: number, y: number) => {
		const effect = state.timeline.effects.find(effect => effect.id === id) as TextEffect
		effect.rect.position_on_canvas = {x, y}
		if(state.timeline.selected_effect?.kind !== "audio")
			state.timeline.selected_effect!.rect.position_on_canvas = {x, y}
	},
	set_effect_width: state => ({id}: TextEffect | ImageEffect | VideoEffect, width: number) => {
		const effect = state.timeline.effects.find(effect => effect.id === id) as Exclude<AnyEffect, AudioEffect>
		effect.rect.width = width
		if(state.timeline.selected_effect?.kind !== "audio")
			state.timeline.selected_effect!.rect.width = width
	},
	set_effect_height: state => ({id}: TextEffect | ImageEffect | VideoEffect, height: number) => {
		const effect = state.timeline.effects.find(effect => effect.id === id) as Exclude<AnyEffect, AudioEffect>
		effect.rect.height = height
		if(state.timeline.selected_effect?.kind !== "audio")
			state.timeline.selected_effect!.rect.height = height
	}
})

export type TimelineActions = TimelineHistoricalActions & TimelineNonHistoricalActions
type TimelineHistoricalActions = ZipAction.Callable<typeof timeline_historical_actions>
type TimelineNonHistoricalActions = ZipAction.Callable<typeof timeline_non_historical_actions>
