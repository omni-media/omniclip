import {ZipAction} from "@benev/slate/x/watch/zip/action.js"
import {generate_id} from "@benev/slate/x/tools/generate_id.js"

import {XClip} from "./types.js"
import {TimelineHelpers} from "./helpers.js"
import {actionize} from "../../../utils/actionize.js"

export const timeline_actions = actionize({
	set_clip_track: state => (clip: XClip, track: number) => {
		const helper = new TimelineHelpers(state.timeline)
		helper.get_clip(clip.id)!.track = track
	},
	set_clip_duration: state => ({id}: XClip, duration: number) => {
		const helper = new TimelineHelpers(state.timeline)
		const clip = helper.get_clip(id)
		clip!.duration = duration
		clip!.end = clip!.start + duration
	},
	set_clip_start_position: state => ({id}: XClip, x: number) => {
		const helper = new TimelineHelpers(state.timeline)
		const clip = helper.get_clip(id)
		clip!.start_at_position = x
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
