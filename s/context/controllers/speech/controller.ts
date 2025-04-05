import {State} from "../../types.js"
import {Media} from "../media/controller.js"
import {Transcriber} from "./parts/transcriber.js"
import {AudioEffect, VideoEffect} from "../../types.js"
import { GroupOptions, Subtitle, Word } from "./types.js"
import { Compositor } from "../compositor/controller.js"
import { TextEffectDefault } from "../compositor/parts/text-manager.js"
import { Actions } from "../../actions.js"

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

	constructor(private actions: Actions, private media: Media, private compositor: Compositor) {}

	async createCaptions(state: State) {
		const transcribedClips: {
			subtitles: Subtitle[]
			hash: string
		}[] = []
		const uniqueEffects = Array.from(
			new Map(
				state.effects
					.filter(
						effect =>
							(effect.kind === 'audio' || effect.kind === 'video') &&
							!state.tracks[effect.track].muted
					)
					.map(effect => [effect.id, effect])
			).values()
		) as VideoEffect[] | AudioEffect[]
		await Promise.all(uniqueEffects.map(async effect => {
			const file = await this.media.get_file(effect.file_hash)
			if(file) {
				const arrayBuffer = await file.arrayBuffer()
				const audioCTX = new AudioContext({sampleRate: 16000})
				const decoded = await audioCTX.decodeAudioData(arrayBuffer)
				if(!this.transcriber.isModelLoadingState && !this.transcriber.isBusyState) {
					const value = await this.transcriber.start(decoded)
					if(value) {
						const s = this.wordsToSubtitles(value)
						transcribedClips.push({
							subtitles: s,
							hash: effect.file_hash
						})
						
					}
				}
			}
		}))
		this.actions.add_track() // add new track for captions
		state.effects.forEach(effect => {
			if(effect.kind === "audio" || effect.kind === "video") {
				transcribedClips.find(({subtitles, hash}) => {
					if(effect.file_hash === hash) {
						subtitles.forEach(subtitle => {
							const duration = (subtitle.end - subtitle.start) * 1000
							this.compositor.managers.textManager.add_text_effect(
								{
									...TextEffectDefault(this.compositor),
									duration,
									text: subtitle.text,
									start: 0,
									end: duration,
									track: 0,
									start_at_position: effect.start_at_position + subtitle.start * 1000,
									rect: {
										...TextEffectDefault(this.compositor).rect,
										position_on_canvas: {
											y: 0,
											x: 0
										}
									}
								}
							)
						})
					}
				})
			}
		})
	}

	wordsToSubtitles(
		words: Word[],
		{
			maxLineWidth = 30,
			maxDuration = 3,
			margin = 10,
			minDuration = 1
		}: {
			maxLineWidth?: number
			maxDuration?: number
			margin?: number
			minDuration?: number
		} = {}
	): Subtitle[] {
		const subtitles: Subtitle[] = []
		let block: Word[] = []
		let blockLength = 0 // in characters

		const softBreakWords = /^(and|but|so|then|because)$/i
		const isHardBreak = (text: string) => /[.?!]$/.test(text.trim())
		const isSoftBreak = (text: string) =>
			/[,]$/.test(text.trim()) || softBreakWords.test(text.trim())

		const flushBlock = () => {
			if (!block.length) return
			const first = block[0]
			const last = block.at(-1)
			const text = block.map(w => w.text).join(' ').replace(/\s+/g, ' ').trim()

			subtitles.push({
				start: first?.timestamp[0] ?? 0,
				end: last?.timestamp[1] ?? last?.timestamp[0] ?? 0,
				text
			})

			block = []
			blockLength = 0
		}

		for (let i = 0; i < words.length; i++) {
			const word = words[i]
			const [start, rawEnd] = word.timestamp
			const end = rawEnd ?? start
			const wordText = word.text.trim()
			const duration = block.length ? end - (block[0].timestamp[0] ?? 0) : 0

			const simulatedLength = blockLength + wordText.length + (block.length ? 1 : 0)
			const lowerBound = maxLineWidth - margin
			const upperBound = maxLineWidth + margin

			// --- break at punctuation within margin ---
			if (simulatedLength >= lowerBound) {
				let lookaheadLength = simulatedLength
				let foundBreak = false

				for (let j = i; j < words.length; j++) {
					const w = words[j]
					const wText = w.text.trim()
					const isBreak = isHardBreak(wText) || isSoftBreak(wText)

					lookaheadLength += wText.length + 1

					if (isBreak && lookaheadLength <= upperBound) {
						for (let k = i; k <= j; k++) {
							block.push(words[k])
							blockLength += words[k].text.trim().length + 1
						}
						i = j
						foundBreak = true
						break
					}

					if (lookaheadLength > upperBound) break
				}

				if (foundBreak) {
					flushBlock()
					continue
				} else if (simulatedLength > upperBound) {
					flushBlock()
					block.push(word)
					blockLength = wordText.length
					continue
				}
			}

			// --- flush if maxDuration exceeded ---
			if (duration > maxDuration) {
				flushBlock()
				block.push(word)
				blockLength = wordText.length
				continue
			}

			// --- default push ---
			block.push(word)
			blockLength = simulatedLength

			// --- flush immediately on hard break
			if (isHardBreak(wordText)) {
				flushBlock()
				continue
			}
		}

		flushBlock()

		// --- smart merge for ultra-short lines like "it." ---
		for (let i = 0; i < subtitles.length - 1; i++) {
			const a = subtitles[i]
			const b = subtitles[i + 1]
			const aDur = a.end - a.start
			const bDur = b.end - b.start
			const aEndsStrong = /[.?!]$/.test(a.text)

			const shouldMerge = (aDur < minDuration || bDur < minDuration) && !(aEndsStrong && bDur >= minDuration)

			if (shouldMerge) {
				a.text = `${a.text} ${b.text}`.replace(/\s+/g, ' ').trim()
				a.end = b.end
				subtitles.splice(i + 1, 1)
				i-- // recheck
			}
		}

		return subtitles
	}
}
