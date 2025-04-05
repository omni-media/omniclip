import {LineJoin} from "./pixi.mjs.js"
import {ZipAction} from "@benev/slate/x/watch/zip/action.js"
import {generate_id} from "@benev/slate/x/tools/generate_id.js"
import type {
	ColorSource, TEXT_GRADIENT, TextStyleAlign, TextStyleFontStyle, TextStyleFontVariant, TextStyleFontWeight, TextStyleTextBaseline, TextStyleWhiteSpace
} from "pixi.js"

import {Helpers} from "./helpers.js"
import {collaboration} from "./context.js"
import {withBroadcast} from "../utils/with-broadcast.js"
import {Transition} from "./controllers/compositor/parts/transition-manager.js"
import {Filter, FilterType} from "./controllers/compositor/parts/filter-manager.js"
import {actionize_historical, actionize_non_historical} from "./../utils/actionize.js"
import {
	AnyEffect,
	AudioEffect,
	ExportStatus,
	Font,
	ImageEffect,
	TextEffect,
	EffectRect,
	VideoEffect,
	Standard,
	AspectRatio,
	State,
	HistoricalActionsWithBroadcast,
	NonHistoricalActionsWithBroadcast
} from "./types.js"
import {Animation, AnimationFor} from "./controllers/compositor/parts/animation-manager.js"

export const non_historical = actionize_non_historical({
	clear_project: state => () => {},
	set_incoming_non_historical_state_webrtc: state => (historical: State) => {
		for(const k in state) {
			const key = k as keyof typeof state
			//@ts-ignore
			state[key] = historical[key]
		}
	},
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
	set_is_exporting: state => (is_exporting: boolean) => {
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
	},
	update_transition: state => (transitionId: string) => {
		// empty action for collaboration to trigger transition update
	}
})

export const historical = actionize_historical({
	toggle_track_muted: state => (trackId: string) => {
		const track =state.tracks.find(track => track.id === trackId)
		if(track) {
			track.muted = !track.muted
		}
	},
	toggle_track_visibility: state => (trackId: string) => {
		const track =state.tracks.find(track => track.id === trackId)
		if(track) {
			track.visible = !track.visible
		}
	},
	toggle_track_locked: state => (trackId: string) => {
		const track =state.tracks.find(track => track.id === trackId)
		if(track) {
			track.locked = !track.locked
		}
	},
	add_transition: state => (transition: Transition) => {
		state.transitions.push(transition)
	},
	remove_transition: state => (id: string) => {
		state.transitions = state.transitions.filter(t => t.id !== id)
	},
	set_transition_duration: state => (duration: number, transitionId: string) => {
		const effect = state.transitions.find(t => t.id === transitionId)
		if(effect)
			effect.duration = duration
	},
	clear_transitions: state => () => {
		state.transitions = []
	},
	clear_animations: state => () => {
		state.animations = []
	},
	set_animation_duration: state => (duration: number, {id}: VideoEffect | ImageEffect) => {
		const effect = state.animations.find(a => a.targetEffect.id === id)
		if(effect)
			effect.duration = duration
	},
	set_animations: state => (animations: Animation[]) => {
		state.animations = animations
	},
	add_animation: state => (animation: Animation, animationFor: AnimationFor) => {
		state.animations.push(animation)
	},
	remove_animation: state => (effect: VideoEffect | ImageEffect, type: "in" | "out", animationFor: AnimationFor) => {
		state.animations = state.animations.filter((animation) => !(animation.targetEffect.id === effect.id && animation.type === type && animation.for === animationFor))
	},
	remove_filter: state => (effect: ImageEffect | VideoEffect, type: FilterType) => {
		state.filters = state.filters.filter(filter => !(filter.targetEffectId === effect.id && filter.type === type))
	},
	add_filter: state => (filter: Filter) => {
		state.filters.push(filter)
	},
	set_incoming_historical_state_webrtc: state => (historical: State) => {
		for(const k in state) {
			const key = k as keyof typeof state
			//@ts-ignore
			state[key] = historical[key]
		}
	},
	set_project_id: state => (id: string) => {
		state.projectId = id
	},
	set_effects: state => (effects: AnyEffect[]) => {
		state.effects = effects
	},
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
	set_pivot: state => ({id}: VideoEffect | ImageEffect | TextEffect, x: number, y: number) => {
		const effect = state.effects.find(effect => effect.id === id) as VideoEffect | ImageEffect
		effect!.rect.pivot = {x, y}
	},
	set_text_fill: state => ({id}: TextEffect, color: string, index: number) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.fill[index] = color
	},
	move_text_fill_up: state => ({id}: TextEffect, index: number) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		[effect.fill[index - 1], effect.fill[index]] = [effect.fill[index], effect.fill[index - 1]]
	},
	move_text_fill_down: state => ({id}: TextEffect, index: number) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		[effect.fill[index], effect.fill[index + 1]] = [effect.fill[index + 1], effect.fill[index]]
	},
	set_text_font: state => ({id}: TextEffect, font: Font) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.fontFamily = font
	},
	set_font_size: state => ({id}: TextEffect, size: number) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.fontSize = size
	},
	set_font_style: state => ({id}: TextEffect, style: TextStyleFontStyle) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.fontStyle = style
	},
	set_font_align: state => ({id}: TextEffect, align: TextStyleAlign) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.align = align
	},
	set_font_variant: state => ({id}: TextEffect, variant: TextStyleFontVariant) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.fontVariant = variant
	},
	set_font_weight: state => ({id}: TextEffect, weight: TextStyleFontWeight) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.fontWeight = weight
	},
	set_fill_gradient_type: state => ({id}: TextEffect, type: TEXT_GRADIENT) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.fillGradientType = type
	},
	add_fill_gradient_stop: state => ({id}: TextEffect) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.fillGradientStops.push(0)
	},
	remove_fill_gradient_stop: state => ({id}: TextEffect, index: number) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.fillGradientStops = effect.fillGradientStops.filter((_, i) => i !== index)
	},
	set_fill_gradient_stop: state => ({id}: TextEffect, index: number, value: number) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.fillGradientStops[index] = value
	},
	set_text_rect: state => ({id}: TextEffect, rect: EffectRect) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.rect = rect
	},
	set_text_content: state => ({id}: TextEffect, content: string) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.text = content
	},
	add_text_fill: state => ({id}: TextEffect) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.fill.push("#FFFFFF")
	},
	remove_text_fill: state => ({id}: TextEffect, index: number) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.fill = effect.fill.filter((_, i) => i !== index)
	},
	set_stroke_color: state => ({id}: TextEffect, value: string) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.stroke = value
	},
	set_stroke_thickness: state => ({id}: TextEffect, value: number) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.strokeThickness = value
	},
	set_stroke_line_join: state => ({id}: TextEffect, value: LineJoin) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.lineJoin = value
	},
	set_stroke_miter_limit: state => ({id}: TextEffect, value: number) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.miterLimit = value
	},
	set_text_baseline: state => ({id}: TextEffect, value: TextStyleTextBaseline) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.textBaseline = value
	},
	set_letter_spacing: state => ({id}: TextEffect, value: number) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.letterSpacing = value
	},
	set_drop_shadow_distance: state => ({id}: TextEffect, value: number) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.dropShadowDistance = value
	},
	set_drop_shadow_blur: state => ({id}: TextEffect, value: number) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.dropShadowBlur = value
	},
	set_drop_shadow_alpha: state => ({id}: TextEffect, value: number) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.dropShadowAlpha = value
	},
	set_drop_shadow_angle: state => ({id}: TextEffect, value: number) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.dropShadowAngle = value
	},
	set_drop_shadow_color: state => ({id}: TextEffect, value: ColorSource) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.dropShadowColor = value
	},
	toggle_drop_shadow: state => ({id}: TextEffect, value: boolean) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.dropShadow = value
	},
	set_word_wrap:state => ({id}: TextEffect, value: boolean) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.wordWrap = value
	},
	set_break_words:state => ({id}: TextEffect, value: boolean) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.breakWords = value
	},
	set_wrap_width:state => ({id}: TextEffect, value: number) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.wordWrapWidth = value
	},
	set_leading:state => ({id}: TextEffect, value: number) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.leading = value
	},
	set_line_height:state => ({id}: TextEffect, value: number) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.lineHeight = value
	},
	set_white_space:state => ({id}: TextEffect, value: TextStyleWhiteSpace) => {
		const effect = state.effects.find(effect => effect.id === id) as TextEffect
		effect.whiteSpace = value
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
		state.tracks.push({id: generate_id(), muted: false, locked: false, visible: true})
	},
	remove_track: state => (id: string) => {
		const new_arr = state.tracks.filter(track => track.id !== id)
		state.tracks = new_arr
	},
	remove_tracks: state => () => {
		state.tracks = []
		state.tracks.push({id: generate_id(), muted: false, locked: false, visible: true})
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
	}
})

// Wrapped actions
export const historical_actions: HistoricalActionsWithBroadcast = Object.entries(
	historical
).reduce((acc, [key, action]) => {
	acc[key as keyof HistoricalActions] = withBroadcast(action, (a, p) => {
		collaboration.broadcastAction(a, p)
	})
	return acc
}, {} as any)

export const non_historical_actions: NonHistoricalActionsWithBroadcast = Object.entries(
	non_historical
).reduce((acc, [key, action]) => {
	acc[key as keyof NonHistoricalActions] = withBroadcast(action, (a, p) => {
		collaboration.broadcastAction(a, p)
	})
	return acc
}, {} as any)

export type Actions = HistoricalActions & NonHistoricalActions
type HistoricalActions = ZipAction.Callable<typeof historical_actions>
type NonHistoricalActions = ZipAction.Callable<typeof non_historical_actions>
