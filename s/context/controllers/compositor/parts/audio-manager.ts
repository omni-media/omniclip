import {generate_id} from "@benev/slate"

import {Compositor} from "../controller.js"
import {TimelineActions} from "../../timeline/actions.js"
import {AudioEffect, XTimeline} from "../../timeline/types.js"
import {Audio} from "../../../../components/omni-media/types.js"
import {find_place_for_new_effect} from "../../timeline/utils/find_place_for_new_effect.js"

export class AudioManager extends Map<string, {element: HTMLAudioElement, file: File}> {

	constructor(private compositor: Compositor, private actions: TimelineActions) {super()}

	create_and_add_audio_effect(audio: Audio, timeline: XTimeline) {
		const duration = audio.element.duration * 1000
		const adjusted_duration_to_timebase = Math.floor(duration / (1000/timeline.timebase)) * (1000/timeline.timebase)
		const effect: AudioEffect = {
			id: generate_id(),
			kind: "audio",
			raw_duration: duration,
			duration: adjusted_duration_to_timebase,
			start_at_position: 0,
			start: 0,
			end: adjusted_duration_to_timebase,
			track: 2,
		}
		const {position, track} = find_place_for_new_effect(timeline.effects, timeline.tracks)
		effect.start_at_position = position!
		effect.track = track
		this.add_audio_effect(effect, audio.file)
	}

	add_audio_effect(effect: AudioEffect, file: File) {
		const audio = document.createElement("audio")
		const source = document.createElement("source")
		source.type = "audio/mp3"
		source.src = URL.createObjectURL(file)
		audio.append(source)
		this.set(effect.id, {element: audio, file})
		this.actions.add_audio_effect(effect)
	}

	pause_audios() {
		for(const effect of this.compositor.currently_played_effects.values()) {
			if(effect.kind === "audio") {
				const {element} = this.get(effect.id)!
				element.pause()
			}
		}
	}

	async play_audios() {
		for(const effect of this.compositor.currently_played_effects.values()) {
			if(effect.kind === "audio") {
				const {element} = this.get(effect.id)!
				await element.play()
			}
		}
	}

	pause_audio(effect: AudioEffect) {
		const {element} = this.get(effect.id)!
		element.pause()
	}

	async play_audio(effect: AudioEffect) {
		const {element} = this.get(effect.id)!
		await element.play()
	}
}