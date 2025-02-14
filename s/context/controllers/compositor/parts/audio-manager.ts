import {generate_id} from "@benev/slate"

import {Compositor} from "../controller.js"
import {Actions} from "../../../actions.js"
import {collaboration} from "../../../context.js"
import {AudioEffect, State} from "../../../types.js"
import {isEffectMuted} from "../utils/is_effect_muted.js"
import {Audio} from "../../../../components/omni-media/types.js"
import {find_place_for_new_effect} from "../../timeline/utils/find_place_for_new_effect.js"

export class AudioManager extends Map<string, HTMLAudioElement> {

	constructor(private compositor: Compositor, private actions: Actions) {super()}

	create_and_add_audio_effect(audio: Audio, state: State) {
		collaboration.broadcastMedia(audio)
		const duration = audio.element.duration * 1000
		const adjusted_duration_to_timebase = Math.floor(duration / (1000/state.timebase)) * (1000/state.timebase)
		const effect: AudioEffect = {
			id: generate_id(),
			kind: "audio",
			name: audio.file.name,
			file_hash: audio.hash,
			raw_duration: duration,
			duration: adjusted_duration_to_timebase,
			start_at_position: 0,
			start: 0,
			end: adjusted_duration_to_timebase,
			track: 2,
		}
		const {position, track} = find_place_for_new_effect(state.effects, state.tracks)
		effect.start_at_position = position!
		effect.track = track
		this.add_audio_effect(effect, audio.file)
	}

	add_audio_effect(effect: AudioEffect, file: File, recreate?: boolean) {
		const audio = document.createElement("audio")
		const source = document.createElement("source")
		source.type = "audio/mp3"
		source.src = URL.createObjectURL(file)
		audio.append(source)
		this.set(effect.id, audio)
		if(recreate) {return}
		this.actions.add_audio_effect(effect)
	}

	pause_audios() {
		for(const effect of this.compositor.currently_played_effects.values()) {
			if(effect.kind === "audio") {
				const element = this.get(effect.id)
				if(element)
					element.pause()
			}
		}
	}

	async play_audios() {
		for(const effect of this.compositor.currently_played_effects.values()) {
			if(effect.kind === "audio") {
				const element = this.get(effect.id)
				if(element) {
					const isMuted = isEffectMuted(effect)
					element.muted = isMuted
					await element.play()
				}
			}
		}
	}

	pause_audio(effect: AudioEffect) {
		const element = this.get(effect.id)
		if(element)
			element.pause()
	}

	async play_audio(effect: AudioEffect) {
		const element = this.get(effect.id)
		if(element)
			await element.play()
	}
}
