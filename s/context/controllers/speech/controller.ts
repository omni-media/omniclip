import {Media} from "../media/controller.js"
import {Transcriber} from "./parts/transcriber.js"
import {AudioEffect, VideoEffect} from "../../types.js"

/**
 * SpeechController
 *
 * This controller is responsible for handling all operations related to speech processing,
 * including:
 *   - Converting audio (url/file/record) input to text (transcription)
 *   - Generating captions
 *   - Translating spoken language into different target languages
 *   - Managing model loading, progress tracking, and error handling
 *   - Handling multilingual configurations and settings for optimal performance
 */

export class Speech {
	transcriber = new Transcriber()

	constructor(private media: Media) {}

	async createCaptions(effect: VideoEffect | AudioEffect) {
		const file = await this.media.get_file(effect.file_hash)
		if(file) {
			const arrayBuffer = await file.arrayBuffer()
			const audioCTX = new AudioContext({sampleRate: 16000})
			const decoded = await audioCTX.decodeAudioData(arrayBuffer)
			if(!this.transcriber.isModelLoadingState && !this.transcriber.isBusyState)
				this.transcriber.start(decoded)
		}
	}

}
