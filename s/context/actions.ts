import {ZipAction} from "@benev/slate/x/watch/zip/action.js"
import {generate_id} from "@benev/slate/x/tools/generate_id.js"

import {Helpers} from "./helpers.js"
import {actionize_historical, actionize_non_historical} from "./../utils/actionize.js"
import {AnyEffect, AudioEffect, ExportStatus, Font, FontStyle, ImageEffect, TextAlign, TextEffect, EffectRect, VideoEffect, Standard, AspectRatio} from "./types.js"

export const non_historical_actions = actionize_non_historical({
	set_standard: state => (standard: Standard) => {
		state.settings.standard = standard
	},
	set_aspect_ratio: state => (aspectRatio: AspectRatio) => {
		state.settings.aspectRatio = aspectRatio
	},
	set_bitrate: state => (value: number) => {
		state.settings.bitrate = value
	},
	zoom_in: state => () => {
		state.zoom += 0.1
	},
	zoom_out: state => () => {
		state.zoom -= 0.1
	},
	set_timecode: state => (timecode: number) => {
		state.timecode = timecode
	},
	increase_timecode: state => (by_milliseconds: number) => {
		state.timecode += by_milliseconds
	},
	set_is_playing: state => (is_playing: boolean) => {
		state.is_playing = is_playing
	},
	toggle_is_playing: state => () => {
		state.is_playing = !state.is_playing
	},
	set_is_exporting: state => (is_exporting) => {
		state.is_exporting = is_exporting
	},
	set_export_progress: state => (progress: number) => {
		state.export_progress = progress
	},
	set_timebase: state => (timebase: number) => {
		state.timebase = timebase
	},
	set_export_status: state => (status: ExportStatus) => {
		state.export_status = status
	},
	set_fps: state => (fps: number) => {
		state.fps = fps
	},
	set_log: state => (log: string) => {
		state.log = log
	},
	set_selected_effect: state => (effect: AnyEffect | null) => {
		state.selected_effect = effect
	},
	set_project_resolution: state => (width: number, height: number) => {
		state.settings = {
			...state.settings,
			width,
			height
		}
	}
})

export const historical_actions = actionize_historical({
	set_project_name: state => (value: string) => {
		state.projectName = value
	},
	add_text_effect: state => (effect: TextEffect) => {
		state.effects.push(effect)
	},
	add_image_effect: state => (effect: ImageEffect) => {
		state.effects.push(effect)
	},
	add_video_effect: state => (effect: VideoEffect) => {
		state.effects.push(effect)
	},
	add_audio_effect: state => (effect: AudioEffect) => {
		state.effects.push(effect)
	},
	set_text_color: state => ({id}: TextEffect, color: string) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.color = color
	},
	set_text_font: state => ({id}: TextEffect, font: Font) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.font = font
	},
	set_font_size: state => ({id}: TextEffect, size: number) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.size = size
	},
	set_font_style: state => ({id}: TextEffect, style: FontStyle) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.style = style
	},
	set_text_align: state => ({id}: TextEffect, align: TextAlign) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.align = align
	},
	set_text_rect: state => ({id}: TextEffect, rect: EffectRect) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.rect = rect
	},
	set_text_content: state => ({id}: TextEffect, content: string) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.content = content
	},
	set_effect_track: state => (effect: AnyEffect, track: number) => {
		const helper = new Helpers(state)
		helper.get_effect(effect.id)!.track = track
	},
	set_effect_duration: state => ({id}: AnyEffect, duration: number) => {
		const helper = new Helpers(state)
		const effect = helper.get_effect(id)
		effect!.duration = duration
		effect!.end = effect!.start + duration
	},
	set_effect_start_position: state => ({id}: AnyEffect, x: number) => {
		const helper = new Helpers(state)
		const effect = helper.get_effect(id)
		effect!.start_at_position = x
	},
	set_effect_start: state => ({id}: AnyEffect, start: number) => {
		const helper = new Helpers(state)
		const effect = helper.get_effect(id)
		effect!.start = start
	},
	set_effect_end: state => ({id}: AnyEffect, end: number) => {
		const helper = new Helpers(state)
		const effect = helper.get_effect(id)
		effect!.end = end
	},
	add_track: state => () => {
		state.tracks.push({id: generate_id()})
	},
	remove_track: state => (id: string) => {
		const new_arr = state.tracks.filter(track => track.id !== id)
		state.tracks = new_arr
	},
	remove_tracks: state => () => {
		state.tracks = []
		state.tracks.push({id: generate_id()})
	},
	set_rotation: state => ({id}: TextEffect | ImageEffect | VideoEffect, rotation: number) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect | VideoEffect | ImageEffect
		effect.rect.rotation = rotation
	},
	set_position_on_canvas: state => ({id}: TextEffect | ImageEffect | VideoEffect, x: number, y: number) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.rect.position_on_canvas = {x, y}
	},
	set_effect_width: state => ({id}: TextEffect | ImageEffect | VideoEffect, width: number) => {
		const effect = state.effects.find(effect => effect.id === id) as Exclude<AnyEffect, AudioEffect>
		effect.rect.width = width
	},
	set_effect_height: state => ({id}: TextEffect | ImageEffect | VideoEffect, height: number) => {
		const effect = state.effects.find(effect => effect.id === id) as Exclude<AnyEffect, AudioEffect>
		effect.rect.height = height
	},
	remove_effect: state => ({id}: AnyEffect) => {
		const effects = state.effects.filter(effect => effect.id !== id)
		state.effects = effects
	},
	set_effect_scale: state => (effect: TextEffect | ImageEffect | VideoEffect, scale: {x: number, y: number}) => {
		const eff = state.effects.find(({id}) => effect.id === id) as TextEffect | VideoEffect | ImageEffect
		eff.rect.scaleX = scale.x
		eff.rect.scaleY = scale.y
	},
	remove_all_effects: state => () => {
		state.effects = []
	},
        set_effect_volume: state => ({id}: AudioEffect | VideoEffect, volume: number) => {
            const effect = state.effects.find(effect => effect.id === id) as AudioEffect | VideoEffect
            effect.volume = volume;
        }
})

export type Actions = HistoricalActions & NonHistoricalActions
type HistoricalActions = ZipAction.Callable<typeof historical_actions>
type NonHistoricalActions = ZipAction.Callable<typeof non_historical_actions>
