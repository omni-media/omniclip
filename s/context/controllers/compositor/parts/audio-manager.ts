import {Compositor} from "../controller.js"
import {AudioEffect} from "../../timeline/types.js"

export class AudioManager extends Map<string, {element: HTMLAudioElement, file: File}> {

	constructor(private compositor: Compositor) {
		super()
	}

	add_video(effect: AudioEffect, file: File) {
		const audio = document.createElement("audio")
		const source = document.createElement("source")
		source.type = "audio/mp3"
		source.src = URL.createObjectURL(file)
		audio.append(source)
		this.set(effect.id, {element: audio, file})
	}

	pause_audios() {
		for(const effect of this.compositor.currently_played_effects) {
			if(effect.kind === "audio") {
				const {element} = this.get(effect.id)!
				element.pause()
			}
		}
	}

	async play_audios() {
		for(const effect of this.compositor.currently_played_effects) {
			if(effect.kind === "audio") {
				const {element} = this.get(effect.id)!
				await element.play()
			}
		}
	}
}
