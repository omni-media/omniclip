import {ZipAction} from "@benev/slate/x/watch/zip/action.js"
import {generate_id} from "@benev/slate/x/tools/generate_id.js"

import {AnyEffect} from "./types.js"
import {TimelineHelpers} from "./helpers.js"
import {actionize} from "../../../utils/actionize.js"

export const timeline_actions = actionize({
	add_text_effect: state => () => {
		const effect: AnyEffect = {
			id: generate_id(),
			kind: "text",
			content: "something",
			size: 5,
			color: "white",
			start_at_position: 1000,
			duration: 5000,
			start: 0,
			end: 5000,
			track: 0
		}
		state.timeline.effects.push(effect)
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
	add_track: state => () => {
		state.timeline.tracks.push({id: generate_id()})
	},
	zoom_in: state => () => {
		state.timeline.zoom += 0.5
	},
	zoom_out: state => () => {
		state.timeline.zoom -= 0.5
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
	}
})

export type TimelineActions = ZipAction.Callable<typeof timeline_actions>
