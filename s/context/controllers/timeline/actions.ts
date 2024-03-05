import {ZipAction} from "@benev/slate/x/watch/zip/action.js"
import {generate_id} from "@benev/slate/x/tools/generate_id.js"

import {TimelineHelpers} from "./helpers.js"
import {actionize} from "../../../utils/actionize.js"
import {Compositor} from "../compositor/controller.js"
import {Video} from "../../../components/omni-media/types.js"
import {AnyEffect, ExportStatus, Font, FontStyle, TextAlign, TextEffect, TextRect, VideoEffect} from "./types.js"

export const timeline_actions = actionize({
	add_text_effect: state => (compositor: Compositor) => {
		const effect: TextEffect = {
			id: generate_id(),
			kind: "text",
			start_at_position: 1000,
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
					x: compositor.canvas.width / 2,
					y: compositor.canvas.height / 2,
				},
				width: compositor.TextManager.measure_text_width("example", 38, "Lato", "#e66465"),
				height: compositor.TextManager.measure_text_height("example"),
				rotation: 0
			}
		}
		state.timeline.effects.push(effect)
	},
	add_video_effect: state => (video: Video, compositor: Compositor) => {
		const duration = video.element.duration * 1000
		const adjusted_duration_to_timebase = Math.round(duration / (1000/state.timeline.timebase)) * (1000/state.timeline.timebase)
		const effect: VideoEffect = {
			id: generate_id(),
			kind: "video",
			raw_duration: duration,
			duration: adjusted_duration_to_timebase,
			start_at_position: 1500,
			start: 0,
			end: adjusted_duration_to_timebase,
			track: 2,
			file: video.file,
			thumbnail: video.thumbnail
		}
		compositor.VideoManager.add_video(effect)
		state.timeline.effects.push(effect)
	},
	set_export_status: state => (status: ExportStatus) => {
		state.timeline.export_status = status
	},
	set_fps: state => (fps: number) => {
		state.timeline.fps = fps
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
	set_is_exporting: state => (is_exporting) => {
		state.timeline.is_exporting = is_exporting
	},
	set_export_progress: state => (progress: number) => {
		state.timeline.export_progress = progress
	},
	set_text_rect: state => ({id}: TextEffect, rect: TextRect) => {
		const effect = state.timeline.effects.find(effect => effect.id === id) as TextEffect
		(state.timeline.selected_effect as TextEffect).rect = rect
		effect.rect = rect
	},
	set_text_rotation: state => ({id}: TextEffect, rotation: number) => {
		const effect = state.timeline.effects.find(effect => effect.id === id) as TextEffect
		effect.rect.rotation = rotation
		if(state.timeline.selected_effect?.kind === "text")
			state.timeline.selected_effect.rect.rotation = rotation
	},
	set_selected_effect: state => (effect: AnyEffect | null) => {
		state.timeline.selected_effect = effect
	},
	set_text_position_on_canvas: state => ({id}: TextEffect, x: number, y: number) => {
		const effect = state.timeline.effects.find(effect => effect.id === id) as TextEffect
		effect.rect.position_on_canvas = {
			x,
			y
		}
		if(state.timeline.selected_effect?.kind === "text")
			state.timeline.selected_effect.rect.position_on_canvas = {
				x,
				y
			}
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
	set_is_ffmpeg_loading: state => (v: boolean) => {
		state.timeline.is_ffmpeg_loading = v
	}
})

export type TimelineActions = ZipAction.Callable<typeof timeline_actions>
