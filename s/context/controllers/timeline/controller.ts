import {generate_id} from "@benev/slate"
import {pub} from "@benev/slate/x/tools/pub.js"
import {ShockDragDrop} from "@benev/construct/x/tools/shockdrop/drag_drop.js"

import {TimelineActions} from "./actions.js"
import {Compositor} from "../compositor/controller.js"
import {effectTrimHandler} from "./parts/effect-trim-handler.js"
import {Grabbed, At, ProposedTimecode, AnyEffect} from "./types.js"
import {EffectTimecode, XTimeline as TimelineState, XTimeline} from "./types.js"
import {get_effects_at_timestamp} from "../video-export/utils/get_effects_at_timestamp.js"

export class Timeline {
	effect_drag = new ShockDragDrop<Grabbed, At> ({handle_drop: (_event: DragEvent, grabbed, dropped_at) => this.on_drop.publish({grabbed, dropped_at})})
	playhead_drag = new ShockDragDrop<boolean, {x: number}>({handle_drop: (_event: DragEvent) => {}})
	on_drop = pub<{grabbed: Grabbed, dropped_at: At}>()
	effect_trim_handler: effectTrimHandler
	on_playhead_drag = pub()
	
	constructor(private timeline_actions: TimelineActions) {
		this.effect_trim_handler = new effectTrimHandler(timeline_actions)
	}

	calculate_proposed_timecode({timeline_end, timeline_start, track}: EffectTimecode, grabbed_effect_id: string, state: TimelineState) {
		const effects_to_propose_to = this.#exclude_grabbed_effect_from_proposals(grabbed_effect_id, state.effects)
		const track_effects = effects_to_propose_to.filter(effect => effect.track === track)
		const effect_before = this.#get_effects_positioned_before_grabbed_effect(track_effects, timeline_start)[0]
		const effect_after = this.#get_effects_positioned_after_grabbed_effect(track_effects, timeline_start)[0]
		const grabbed_effect_length = timeline_end - timeline_start

		let start_position = timeline_start
		let shrinked_size = null
		let push_effects_forward = null

		if(effect_before && effect_after) {
			const no_space = 0
			const space_between_effect_after_and_before_grabbed_effect =
				this.#calculate_space_between_effect_after_and_before_grabbed_effect(effect_before, effect_after)
			if(space_between_effect_after_and_before_grabbed_effect < grabbed_effect_length && space_between_effect_after_and_before_grabbed_effect > no_space) {
				shrinked_size = space_between_effect_after_and_before_grabbed_effect
			}
			else if(space_between_effect_after_and_before_grabbed_effect === no_space) {
				const effects_after = this.#get_effects_positioned_after_grabbed_effect(track_effects, timeline_start)
				push_effects_forward = effects_after
			}
		}

		if(effect_before) {
			const distance_between_grabbed_effect_and_effect_before_it =
				this.#calculate_distance_between_grabbed_effect_and_effect_before_it(effect_before, timeline_start)
			if(distance_between_grabbed_effect_and_effect_before_it < 0) {
				start_position = effect_before.start_at_position + (effect_before.end - effect_before.start)
			}
		}

		if(effect_after) {
			const distance_between_grabbed_effect_and_effect_after_it =
				this.#calculate_distance_between_grabbed_effect_and_effect_after_it(effect_after, timeline_end)
			if(distance_between_grabbed_effect_and_effect_after_it < 0) {
				start_position = push_effects_forward
					? effect_after.start_at_position
					: shrinked_size
					? effect_after.start_at_position - shrinked_size
					: effect_after.start_at_position - grabbed_effect_length
			}
		}

		return {
			proposed_place: {
				start_at_position: this.#round_to_nearest_frame_place(start_position, state.timebase),
				track
			},
			duration: shrinked_size,
			effects_to_push: push_effects_forward
		}
	}

	#push_effects_forward(effects_to_push: AnyEffect[], push_by: number) {
		effects_to_push.forEach(c => this.timeline_actions.set_effect_start_position(c, c.start_at_position + push_by)
		)
	}

	#calculate_space_between_effect_after_and_before_grabbed_effect(effect_before: AnyEffect, effect_after: AnyEffect) {
		const space = effect_after.start_at_position - (effect_before.start_at_position + (effect_before.end - effect_before.start))
		return space
	}

	#calculate_distance_between_grabbed_effect_and_effect_after_it(effect_after: AnyEffect, timeline_end: number) {
		const distance = effect_after.start_at_position - timeline_end
		return distance
	}

	#calculate_distance_between_grabbed_effect_and_effect_before_it(effect_before: AnyEffect, timeline_start: number) {
		const distance = timeline_start - (effect_before.start_at_position + (effect_before.end - effect_before.start))
		return distance
	}

	#get_effects_positioned_before_grabbed_effect(effects: AnyEffect[], timeline_start: number) {
		const effects_before = effects.filter(effect => effect.start_at_position < timeline_start).sort((a, b) => {
			if(a.start_at_position > b.start_at_position)
				return -1
			else return 1
		})
		return effects_before
	}

	#get_effects_positioned_after_grabbed_effect(effects: AnyEffect[], timeline_start: number) {
		const effects_after = effects.filter(effect => effect.start_at_position > timeline_start).sort((a, b) => {
			if(a.start_at_position < b.start_at_position)
				return -1
			else return 1
		})
		return effects_after
	}

	#round_to_nearest_frame_place(start_at_position: number, timebase: number) {
		const rounded = Math.round(start_at_position / (1000/timebase)) * 1000/timebase
		return rounded
	}

	set_proposed_timecode(effect: AnyEffect, {proposed_place, duration, effects_to_push}: ProposedTimecode) {
		this.timeline_actions.set_effect_start_position(effect, proposed_place.start_at_position)
		this.timeline_actions.set_effect_track(effect, proposed_place.track)
		if(duration && effect.duration !== duration) {
			this.timeline_actions.set_effect_duration(effect, duration)
		}
		if(effects_to_push) {
			this.#push_effects_forward(effects_to_push, (effect.end - effect.start))
		}
	}

	#exclude_grabbed_effect_from_proposals(effect_to_exclude: string, effects: AnyEffect[]) {
		const excluded = effects.filter(effect => effect.id !== effect_to_exclude)
		return excluded
	}

	get_effects_on_track(timeline: XTimeline, track_id: number) {
		return timeline.effects.filter(effect => effect.track === track_id)
	}

	add_split_effect(effect: AnyEffect, compositor: Compositor) {
		if(effect.kind === "video") {
			const {file, fabric} = compositor.managers.videoManager.get(effect.id)!
			const element = fabric.getElement() as HTMLVideoElement
			effect.id = generate_id()
			compositor.managers.videoManager.add_video_effect(effect, file, element.videoWidth, element.videoHeight)
		}
	}

	split(timeline: XTimeline, compositor: Compositor) {
		const normalized_timecode = this.#normalize_to_timebase(timeline)
		const selected = timeline.effects.find(effect => effect.id === timeline.selected_effect?.id)
		const effects = get_effects_at_timestamp(timeline.effects, normalized_timecode)
		if(selected) {
			this.#split(selected, timeline, compositor)
		} else if(effects.length !== 0) {
			this.#split(effects[0], timeline, compositor)
		} 
	}

	#split(effect: AnyEffect, timeline: XTimeline, compositor: Compositor) {
		const normalized_timecode = this.#normalize_to_timebase(timeline)
		const is_between = get_effects_at_timestamp([effect], normalized_timecode)
		const if_split_effect_is_atleast_one_frame = 
			normalized_timecode - effect.start_at_position >= timeline.timebase &&
			(effect.start_at_position + effect.end) - normalized_timecode >= timeline.timebase
		if(is_between.length !== 0 && if_split_effect_is_atleast_one_frame) {
			const end = normalized_timecode - (effect.start_at_position - effect.start)
			this.timeline_actions.set_effect_end(effect, end)
			const start = (normalized_timecode - effect.start_at_position) + effect.start
			const split_effect = {...effect, start, start_at_position: normalized_timecode, end: effect.end}
			this.add_split_effect(split_effect, compositor)
		}
	}

	#normalize_to_timebase(timeline: XTimeline) {
		const frame_duration = 1000/timeline.timebase
		const normalized = Math.round(timeline.timecode / frame_duration) * frame_duration
		return normalized
	}
}

