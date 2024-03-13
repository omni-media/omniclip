import {Compositor} from "../controller.js"
import {AudioEffect} from "../../timeline/types.js"

export class AudioManager extends Map<string, HTMLAudioElement> {

	constructor(private compositor: Compositor) {
		super()
	}

	add_video(effect: AudioEffect) {
		const audio = document.createElement("audio")
		const source = document.createElement("source")
		source.type = "audio/mp3"
		source.src = URL.createObjectURL(effect.file)
		audio.append(source)
		this.set(effect.id, audio)
	}

	pause_audios() {
		for(const effect of this.compositor.currently_played_effects) {
			if(effect.kind === "audio") {
				const audio = this.get(effect.id)
				audio?.pause()
			}
		}
	}

	async play_audios() {
		for(const effect of this.compositor.currently_played_effects) {
			if(effect.kind === "audio") {
				const audio = this.get(effect.id)
				await audio?.play()
			}
		}
	}
}
