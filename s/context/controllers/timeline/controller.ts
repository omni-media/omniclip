import {generate_id} from "@benev/slate"

import {Actions} from "../../actions.js"
import {Media} from "../media/controller.js"
import {Compositor} from "../compositor/controller.js"
import {PlayheadDrag} from "./parts/drag-related/playhead-drag.js"
import {effectTrimHandler} from "./parts/drag-related/effect-trim.js"
import {EffectDragHandler} from "./parts/drag-related/effect-drag.js"
import {ProposedTimecode, AnyEffect, EffectTimecode, State} from "../../types.js"
import {get_effect_at_timestamp} from "../video-export/utils/get_effect_at_timestamp.js"
import {get_effects_at_timestamp} from "../video-export/utils/get_effects_at_timestamp.js"

export class Timeline {
	effect_trim_handler: effectTrimHandler
	effectDragHandler = new EffectDragHandler()
	playheadDragHandler = new PlayheadDrag()

	constructor(private actions: Actions, private media: Media, private compositor: Compositor) {
		this.effect_trim_handler = new effectTrimHandler(actions)
	}

	calculate_proposed_timecode({timeline_end, timeline_start, track}: EffectTimecode, grabbed_effect_id: string, state: State) {
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
		effects_to_push.forEach(c => this.actions.set_effect_start_position(c, c.start_at_position + push_by)
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
		this.actions.set_effect_start_position(effect, proposed_place.start_at_position)
		this.actions.set_effect_track(effect, proposed_place.track)
		if(duration && effect.duration !== duration) {
			const end = effect.start + duration
			this.actions.set_effect_end(effect, end)
		}
		if(effects_to_push) {
			this.#push_effects_forward(effects_to_push, (effect.end - effect.start))
		}
	}

	#exclude_grabbed_effect_from_proposals(effect_to_exclude: string, effects: AnyEffect[]) {
		const excluded = effects.filter(effect => effect.id !== effect_to_exclude)
		return excluded
	}

	get_effects_on_track(state: State, track_id: number) {
		return state.effects.filter(effect => effect.track === track_id)
	}

	async #add_split_effect(effect: AnyEffect) {
		const file = effect.kind !== "text" ? await this.media.get_file(effect.file_hash) : null
		if(effect.kind === "video") {
			if(file) {
				this.compositor.managers.videoManager.add_video_effect(effect, file)
			} else this.actions.add_video_effect(effect)
		}
		else if(effect.kind === "text") {
			this.compositor.managers.textManager.add_text_effect(effect)
		}
		else if(effect.kind === "image") {
			if(file) {
				this.compositor.managers.imageManager.add_image_effect(effect, file)
			} else this.actions.add_image_effect(effect)
		}
		else if(effect.kind === "audio") {
			if(file) {
				this.compositor.managers.audioManager.add_audio_effect(effect, file)
			} else this.actions.add_audio_effect(effect)
		}
	}

	split(state: State) {
		const normalized_timecode = this.#normalize_to_timebase(state)
		const selected = state.effects.find(effect => effect.id === state.selected_effect?.id)
		const effects = get_effects_at_timestamp(state.effects, normalized_timecode)
		if(selected) {
			this.#split(selected, state)
		} else if(effects.length !== 0) {
			this.#split(effects[0], state)
		} 
	}

	#split(effect: AnyEffect, state: State) {
		const normalized_timecode = this.#normalize_to_timebase(state)
		const is_between = get_effects_at_timestamp([effect], normalized_timecode)
		const if_split_effect_is_atleast_one_frame = 
			normalized_timecode - effect.start_at_position >= state.timebase &&
			(effect.start_at_position + effect.end) - normalized_timecode >= state.timebase
		if(is_between.length !== 0 && if_split_effect_is_atleast_one_frame) {
			const end = normalized_timecode - (effect.start_at_position - effect.start)
			this.actions.set_effect_end(effect, end)
			const start = (normalized_timecode - effect.start_at_position) + effect.start
			const split_effect = {...effect, start, start_at_position: normalized_timecode, end: effect.end, id: generate_id()}
			this.#add_split_effect(split_effect)
		}
	}

	#normalize_to_timebase(state: State) {
		const frame_duration = 1000/state.timebase
		const normalized = Math.round(state.timecode / frame_duration) * frame_duration
		return normalized
	}

	set_selected_effect(effect: AnyEffect, compositor: Compositor, state: State) {
		this.actions.set_selected_effect(effect)
		if(effect.kind === "text") {compositor.managers.textManager.set_clicked_effect(effect)}
		this.set_or_discard_active_object_on_canvas_for_selected_effect(effect, compositor, state)
	}

	set_or_discard_active_object_on_canvas_for_selected_effect(selected_effect: AnyEffect, compositor: Compositor, state: State) {
		const is_effect_on_canvas = get_effect_at_timestamp(selected_effect, state.timecode)
		if(is_effect_on_canvas) {
			const object = compositor.canvas.getObjects().find((object: any) => (object?.effect as AnyEffect)?.id === selected_effect.id)
			if(object !== compositor.canvas.getActiveObject()) {
				if(object)
					compositor.canvas.setActiveObject(object)
			}
		} else {
			compositor.canvas.discardActiveObject()
		}
	}

	remove_selected_effect(state: State) {
		if(state.selected_effect) {
			this.actions.set_selected_effect(null)
			this.actions.remove_effect(state.selected_effect)
		}
	}
}

