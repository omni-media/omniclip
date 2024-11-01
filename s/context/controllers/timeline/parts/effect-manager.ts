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

	setSelectedEffect(effect: AnyEffect | undefined, state: State) {
		if (!effect) {
			// Clear selection if no effect is provided
			this.compositor.canvas.discardActiveObject()
			this.actions.set_selected_effect(null)
		} else {
			// Set the effect as selected in actions and update canvas
			this.actions.set_selected_effect(effect)
			if (effect.kind === "text") {
				this.compositor.managers.textManager.set_clicked_effect(effect)
			}
			this.compositor.setOrDiscardActiveObjectOnCanvas(effect, state)
		}

		this.compositor.canvas.renderAll()
	}

	#normalizeToTimebase(state: State): number {
		const frameDuration = 1000 / state.timebase
		return Math.round(state.timecode / frameDuration) * frameDuration
	}
}
