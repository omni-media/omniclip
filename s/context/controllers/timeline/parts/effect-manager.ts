import {generate_id} from "@benev/slate"

import {Actions} from "../../../actions.js"
import {Media} from "../../media/controller.js"
import {Compositor} from "../../compositor/controller.js"
import {AnyEffect, ProposedTimecode, State} from "../../../types.js"
import {get_effects_at_timestamp} from "../../video-export/utils/get_effects_at_timestamp.js"

// EffectManager: Manages effect state updates
export class EffectManager {
	constructor(private actions: Actions, private compositor: Compositor, private media: Media) {}

	setProposedTimecode(effect: AnyEffect, proposedTimecode: ProposedTimecode) {
		this.actions.set_effect_start_position(effect, proposedTimecode.proposed_place.start_at_position)
		this.actions.set_effect_track(effect, proposedTimecode.proposed_place.track)

		if (proposedTimecode.duration && effect.duration !== proposedTimecode.duration) {
			const end = effect.start + proposedTimecode.duration
			this.actions.set_effect_end(effect, end)
		}

		if (proposedTimecode.effects_to_push) {
			this.#pushEffectsForward(proposedTimecode.effects_to_push, effect.end - effect.start)
		}
	}

	removeEffect(effect: AnyEffect) {
		this.actions.remove_effect(effect)
	}

	#pushEffectsForward(effectsToPush: AnyEffect[], pushBy: number) {
		effectsToPush.forEach(effect => {
			this.actions.set_effect_start_position(effect, effect.start_at_position + pushBy)
		})
	}

	/**
		* Splits an effect at a specified time, creating a new effect from the split point.
		* If no specific effect is selected, splits any effect present at the timestamp.
		* @param state - The current application state.
	*/
	splitEffectAtTimestamp(state: State) {
		const normalizedTimecode = this.#normalizeToTimebase(state)
		const selectedEffect = state.selected_effect
		
		// If an effect is selected, attempt to split it
		if (selectedEffect) {
			this.#splitEffect(selectedEffect, normalizedTimecode, state)
			return
		}

		// If no effect is selected, find any effect at the timestamp and split the first one found
		const effectsAtTimestamp = get_effects_at_timestamp(state.effects, normalizedTimecode)
		if (effectsAtTimestamp.length > 0) {
			this.#splitEffect(effectsAtTimestamp[0], normalizedTimecode, state)
		}
	}

	/**
		* Splits a given effect at a specified timecode, updating its end and creating a new split effect.
		* @param effect - The effect to split.
		* @param timecode - The timecode at which to split the effect.
		* @param state - The current application state.
	*/
	#splitEffect(effect: AnyEffect, timecode: number, state: State) {
		const isEffectInRange = get_effects_at_timestamp([effect], timecode)

		const isSplitPossible =
			timecode - effect.start_at_position >= state.timebase &&
			(effect.start_at_position + effect.end) - timecode >= state.timebase

		if (isEffectInRange.length !== 0 && isSplitPossible) {
			// Update the end time of the original effect to the split position
			const end = timecode - (effect.start_at_position - effect.start)
			this.actions.set_effect_end(effect, end)

			// Create the new effect that starts from the split position
			const start = (timecode - effect.start_at_position) + effect.start
			const newEffect: AnyEffect = {
				...effect,
				start,
				start_at_position: timecode,
				end: effect.end,
				id: generate_id(),
			}

			// Add the new split effect
			this.#addSplitEffect(newEffect)
		}
	}

	/**
		* Adds a new split effect to the timeline.
		* @param effect - The newly created split effect.
	*/
	async #addSplitEffect(effect: AnyEffect) {
		const file = effect.kind !== "text" ? await this.media.get_file(effect.file_hash) : null

		if (effect.kind === "video") {
			file ? this.compositor.managers.videoManager.add_video_effect(effect, file) : this.actions.add_video_effect(effect)
		} else if (effect.kind === "text") {
			this.compositor.managers.textManager.add_text_effect(effect)
		} else if (effect.kind === "image") {
			file ? this.compositor.managers.imageManager.add_image_effect(effect, file) : this.actions.add_image_effect(effect)
		} else if (effect.kind === "audio") {
			file ? this.compositor.managers.audioManager.add_audio_effect(effect, file) : this.actions.add_audio_effect(effect)
		}
	}

	/**
		* Normalizes the timecode to the nearest frame based on the state's timebase.
		* @param state - The application state.
		* @returns The normalized timecode.
	*/
	#normalizeToTimebase(state: State): number {
		const frameDuration = 1000 / state.timebase
		return Math.round(state.timecode / frameDuration) * frameDuration
	}
}
