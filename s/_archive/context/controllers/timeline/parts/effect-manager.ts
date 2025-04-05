import {generate_id} from "@benev/slate"

import {Actions} from "../../../actions.js"
import {Media} from "../../media/controller.js"
import {EffectDrop} from "./drag-related/effect-drag.js"
import {Compositor} from "../../compositor/controller.js"
import {AnyEffect, At, ProposedTimecode, State} from "../../../types.js"
import {get_effects_at_timestamp} from "../../video-export/utils/get_effects_at_timestamp.js"

// EffectManager: Manages effect state updates
export class EffectManager {
	#copiedEffect: AnyEffect | null = null

	constructor(private actions: Actions, private compositor: Compositor, private media: Media) {}

	setProposedTimecode({grabbed, position}: EffectDrop, proposedTimecode: ProposedTimecode, state: State) {
		this.actions.set_effect_start_position(grabbed.effect, proposedTimecode.proposed_place.start_at_position)
		this.actions.set_effect_track(grabbed.effect, proposedTimecode.proposed_place.track)

		if (proposedTimecode.duration && grabbed.effect.duration !== proposedTimecode.duration) {
			const end = grabbed.effect.start + proposedTimecode.duration
			this.actions.set_effect_end(grabbed.effect, end)
		}

		if (proposedTimecode.effects_to_push) {
			this.#pushEffectsForward(proposedTimecode.effects_to_push, grabbed.effect.end - grabbed.effect.start)
		}

		const isCurrentTrackEmpty = this.#isTrackEmpty(state, grabbed.effect)
		const isDroppedOnAddTrackIndicator = this.#isDroppedOnAddTrackIndicator(position)

		if (isCurrentTrackEmpty) {
			this.#adjustForEmptyTrack({ grabbed, position }, proposedTimecode, state)
		} else if (isDroppedOnAddTrackIndicator) {
			this.#adjustForAddTrackDrop({ grabbed, position }, state)
		}
	}
	// start -- that neets to be moved to EffectPlacementProposal --
	#isTrackEmpty(state: State, effect: AnyEffect) {
		return !state.effects.filter(e => e.id !== effect.id).some(e => e.track === effect.track)
	}

	#isEffectDroppedOnSameTrack(effect: AnyEffect, proposedTimecode: ProposedTimecode) {
		return proposedTimecode.proposed_place.track === effect.track
	}

	#isDroppedOnAddTrackIndicator(position: At) {
		return position.indicator?.type === "addTrack"
	}

	#adjustForEmptyTrack(event: EffectDrop, proposedTimecode: ProposedTimecode, state: State) {
		const targetTrackIndex = event.position.indicator?.index
		const isDroppedOnSameTrack = this.#isEffectDroppedOnSameTrack(event.grabbed.effect, proposedTimecode)
		const isDroppedOnAddTrackIndicator = this.#isDroppedOnAddTrackIndicator(event.position)

		if (isDroppedOnSameTrack) {
			if (event.grabbed.effect.track === targetTrackIndex) {
				this.actions.set_effect_track(event.grabbed.effect, event.grabbed.effect.track)
				return
			}
		} else if (isDroppedOnAddTrackIndicator) {
			this.#handleAddTrackDrop(event, targetTrackIndex!, state)
		} else {
			this.actions.remove_track(state.tracks[event.grabbed.effect.track].id)
			this.#reorderTracksForEmptyDrop(event, proposedTimecode, state)
		}
	}

	#handleAddTrackDrop(event: EffectDrop, targetTrackIndex: number, state: State) {
		const grabbedTrackIndex = event.grabbed.effect.track

		if (grabbedTrackIndex === targetTrackIndex) {
			this.actions.set_effect_track(event.grabbed.effect, grabbedTrackIndex)
		} else if (grabbedTrackIndex > targetTrackIndex) {
			this.actions.set_effect_track(event.grabbed.effect, targetTrackIndex + 1)
			state.effects.filter(e => e.id !== event.grabbed.effect.id).forEach(e => {
				if (e.track > targetTrackIndex && e.track <= grabbedTrackIndex) {
					this.actions.set_effect_track(e, e.track + 1)
				}
			})
		} else {
			this.actions.set_effect_track(event.grabbed.effect, targetTrackIndex)
			state.effects.filter(e => e.id !== event.grabbed.effect.id).forEach(e => {
				if (e.track <= targetTrackIndex && e.track > grabbedTrackIndex) {
					this.actions.set_effect_track(e, e.track - 1)
				}
			})
		}
	}

	#reorderTracksForEmptyDrop({ grabbed }: EffectDrop, proposedTimecode: ProposedTimecode, state: State) {
		if (proposedTimecode.proposed_place.track > grabbed.effect.track) {
			this.actions.set_effect_track(grabbed.effect, proposedTimecode.proposed_place.track - 1)
		}
		this.#lowerTracksAboveLevel(grabbed.effect.track, state.effects)
	}

	#adjustForAddTrackDrop(event: EffectDrop, state: State) {
		this.actions.add_track()
		const targetTrackIndex = event.position.indicator!.index

		if (event.grabbed.effect.track > targetTrackIndex) {
			this.actions.set_effect_track(event.grabbed.effect, targetTrackIndex + 1)
			state.effects.filter(e => e.id !== event.grabbed.effect.id).forEach(e => {
				if (e.track > targetTrackIndex) {
					this.actions.set_effect_track(e, e.track + 1)
				}
			})
		} else {
			this.actions.set_effect_track(event.grabbed.effect, targetTrackIndex + 1)
			state.effects.filter(e => e.id !== event.grabbed.effect.id).forEach(e => {
				if (e.track > targetTrackIndex) {
					this.actions.set_effect_track(e, e.track + 1)
				}
			})
		}
	}
	// end

	#lowerTracksAboveLevel(trackLevel: number, effects: AnyEffect[]) {
		effects.forEach(effect => {
			if (effect.track > trackLevel) {
				this.actions.set_effect_track(effect, effect.track - 1)
			}
		})
	}

	#isLastTrack(state: State) {
		return state.tracks.length === 1
	}

	removeEffect(state: State, effect: AnyEffect) {
		if(!this.#isLastTrack(state) && this.#isTrackEmpty(state, effect)) {
			this.actions.remove_track(state.tracks[effect.track].id)
			this.#lowerTracksAboveLevel(effect.track, state.effects)
		}

		if(this.compositor.selectedElement) {
			this.compositor.app.stage.removeChild(this.compositor.selectedElement.transformer)
		}

		this.compositor.managers.animationManager.removeAnimations(effect)
		this.compositor.managers.transitionManager.getTransitions()
			.filter(transition => transition.incoming.id === effect.id || transition.outgoing.id === effect.id)
				.forEach(transition => this.compositor.managers.transitionManager.removeTransition(transition.id))

		this.actions.remove_effect(effect)
		this.actions.set_selected_effect(null)
	}

	#getEffectAfter(effect: AnyEffect, track: number, state: State) {
		return [...state.effects].filter(e => e.track === track).sort((a, b) => a.start_at_position - b.start_at_position)
		.find(e => e.start_at_position > effect.start_at_position)
	}

	#getEffectBefore(effect: AnyEffect, track: number, state: State) {
		return [...state.effects].filter(e => e.track === track).sort((a, b) => a.start_at_position - b.start_at_position)
		.find(e => e.start_at_position < effect.start_at_position)
	}

	#pushEffectsForward(effectsToPush: AnyEffect[], pushBy: number) {
		effectsToPush.forEach(effect => {
			this.actions.set_effect_start_position(effect, effect.start_at_position + pushBy)
		})
	}

	splitEffectAtTimestamp(state: State) {
		const normalizedTimecode = this.#normalizeToTimebase(state)
		const selectedEffect = state.effects.find(e => e.id === state.selected_effect?.id)
		
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
		this.compositor.setOrDiscardActiveObjectOnCanvas(undefined, state)
		if (!effect) {
			this.actions.set_selected_effect(null, {omit: true})
				this.compositor.managers.textManager.set_selected_effect(null)
		} else {
			if (effect.kind === "text") {
				this.compositor.managers.textManager.set_selected_effect(effect)
				this.actions.set_selected_effect(effect, {omit: true})
			} else {
				this.compositor.managers.textManager.set_selected_effect(null)
				this.actions.set_selected_effect(effect, {omit: true})
			}
			this.compositor.setOrDiscardActiveObjectOnCanvas(effect, state)
		}
		this.compositor.app.render()
	}

	#normalizeToTimebase(state: State): number {
		const frameDuration = 1000 / state.timebase
		return Math.round(state.timecode / frameDuration) * frameDuration
	}

	copySelectedEffect(state: State) {
		this.#copiedEffect = state.selected_effect
	}

	isEffectOverlapping(effect: AnyEffect, effects: AnyEffect[], track: number): boolean {
		const effectStart = effect.start_at_position
		const effectEnd = effect.start_at_position + (effect.end - effect.start)

		// Filter effects on the specified track and exclude the effect being checked
		const filteredEffects = effects.filter(
			otherEffect =>
				otherEffect.track === track && // Same track
				otherEffect !== effect // Exclude the effect being checked
		)

		for (const otherEffect of filteredEffects) {
			const otherEffectStart = otherEffect.start_at_position
			const otherEffectEnd = otherEffect.start_at_position + (otherEffect.end - otherEffect.start)

			// Check if the two effects overlap
			if (effectStart < otherEffectEnd && effectEnd > otherEffectStart) {
				return true
			}
		}

		return false
	}

	pasteSelectedEffect(state: State) {
		const effect = state.effects.find(e => e.id === this.#copiedEffect?.id) ?? this.#copiedEffect
		if(effect) {
			const modified = {
				...effect,
				id: generate_id(),
				start_at_position: this.#normalizeToTimebase(state)
			} satisfies AnyEffect
			for(let track = effect.track; track >= 0; track--) {
				const isOverlapping = this.isEffectOverlapping(modified, state.effects, track)
				if(isOverlapping && track === 0) {
					this.actions.add_track()
					state.effects.forEach(e => this.actions.set_effect_track(e, e.track + 1))
					modified.track = 0
					this.#addSplitEffect(modified)
					break
				}
				if(!isOverlapping) {
					modified.track = track
					this.#addSplitEffect(modified)
					break
				}
			}
		}
	}

	cutSelectedEffect(state: State) {
		if(state.selected_effect) {
			this.actions.remove_effect(state.selected_effect)
		}
		this.#copiedEffect = state.selected_effect
	}
}
