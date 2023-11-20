import {pub} from "@benev/slate/x/tools/pub.js"
import {ShockDragDrop} from "@benev/construct/x/tools/shockdrop/drag_drop.js"

import {TimelineActions} from "./actions.js"
import {At, Timecode, XClip} from "./types.js"
import {Timeline as TimelineState} from "./types.js"

export class Timeline {
	drag = new ShockDragDrop<XClip, At> ({handle_drop: (_event: DragEvent, grabbed, dropped_at) => this.on_drop.publish({grabbed, dropped_at})})
	on_drop = pub<{grabbed: XClip, dropped_at: At}>()

	constructor(private timeline_actions: TimelineActions) {}

	calculate_proposed_clip_placement({timeline_end, timeline_start, track}: Timecode, grabbed_clip_id: string, state: TimelineState) {
		const clips_to_propose_to = this.#exclude_grabbed_clip_from_proposals(grabbed_clip_id, state.clips)
		const track_clips = clips_to_propose_to.filter(clip => clip.track === track)
		const clip_before = this.#get_clip_positioned_before_grabbed_clip(track_clips, timeline_start)
		const clip_after = this.#get_clip_positioned_after_grabbed_clip(track_clips, timeline_start)
		const grabbed_clip_length = timeline_end - timeline_start

		let start_position = timeline_start
		let shrinked_size = null

		if(clip_before && clip_after) {
			const space_between_clip_after_and_before_grabbed_clip = 
				this.#calculate_space_between_clip_after_and_before_grabbed_clip(clip_before, clip_after)
			if(space_between_clip_after_and_before_grabbed_clip < grabbed_clip_length) {
				shrinked_size = space_between_clip_after_and_before_grabbed_clip
			}
		}

		if(clip_before) {
			const distance_between_grabbed_clip_and_clip_before_it =
				this.#calculate_distance_between_grabbed_clip_and_clip_before_it(clip_before, timeline_start)
			if(distance_between_grabbed_clip_and_clip_before_it < 0) {
				start_position = clip_before.start_at_position + clip_before.duration
			}
		}

		if(clip_after) {
			const distance_between_grabbed_clip_and_clip_after_it =
				this.#calculate_distance_between_grabbed_clip_and_clip_after_it(clip_after, timeline_end)
			if(distance_between_grabbed_clip_and_clip_after_it < 0) {
				start_position = shrinked_size 
					? clip_after.start_at_position - shrinked_size
					: clip_after.start_at_position - grabbed_clip_length
			}
		}

		return {
			start_position,
			shrinked_size,
			track
		}
	}

	#calculate_space_between_clip_after_and_before_grabbed_clip(clip_before: XClip, clip_after: XClip) {
		const space = clip_after.start_at_position - (clip_before.start_at_position + clip_before.duration)
		return space
	}

	#calculate_distance_between_grabbed_clip_and_clip_after_it(clip_after: XClip, timeline_end: number) {
		const distance = clip_after.start_at_position - timeline_end
		return distance
	}

	#calculate_distance_between_grabbed_clip_and_clip_before_it(clip_before: XClip, timeline_start: number) {
		const distance = timeline_start - (clip_before.start_at_position + clip_before.duration)
		return distance
	}

	#get_clip_positioned_before_grabbed_clip(clips: XClip[], timeline_start: number): XClip | undefined {
		const clips_before = clips.filter(clip => clip.start_at_position < timeline_start).sort((a, b) => {
			if(a.start_at_position > b.start_at_position)
				return -1
			else return 1
		})[0]
		return clips_before
	}

	#get_clip_positioned_after_grabbed_clip(clips: XClip[], timeline_start: number) {
		const clips_after = clips.filter(clip => clip.start_at_position > timeline_start).sort((a, b) => {
			if(a.start_at_position < b.start_at_position)
				return -1
			else return 1
		})[0]
		return clips_after
	}

	set_clip_timecode(clip: XClip, start_at_position: number, track: number) {
		this.timeline_actions.set_clip_start_position(clip, start_at_position)
		this.timeline_actions.set_clip_track(clip, track)
	}

	#exclude_grabbed_clip_from_proposals(clip_to_exclude: string, clips: XClip[]) {
		const excluded = clips.filter(clip => clip.id !== clip_to_exclude)
		return excluded
	}
}

