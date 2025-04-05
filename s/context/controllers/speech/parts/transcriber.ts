import { signal } from "@benev/slate"

import constants from "../constants.js"
import {ProgressItem, Subtitle, TranscriberData, TranscriberUpdateData, Word} from "../types.js"

export class Transcriber {
	#transcript = signal<TranscriberData | undefined>(undefined)
	#isBusy = signal(false)
	#isModelLoading = signal(false)
	#progressItems = signal<ProgressItem[]>([])

	#model = signal(constants.DEFAULT_MODEL)
	#subtask = signal(constants.DEFAULT_SUBTASK)
	#multilingual = signal(constants.DEFAULT_MULTILINGUAL)
	#language = signal(constants.DEFAULT_LANGUAGE)

	#webWorker = useWorker(this.handleMessage.bind(this))

	private handleMessage(event: MessageEvent) {
		const message = event.data
		switch (message.status) {
			case "progress":
				this.#progressItems.value = this.#progressItems.value.map((item) =>
					item.file === message.file ? { ...item, progress: message.progress } : item
				)
				break
			case "update":
			case "complete": {
				const busy = message.status === "update"
				const updateMessage = message as TranscriberUpdateData
				this.#transcript.value = {
					isBusy: busy,
					text: updateMessage.data.text,
					tps: updateMessage.data.tps,
					chunks: updateMessage.data.chunks,
				}
				this.#isBusy.value = busy
				console.log(this.#transcript.value, this.#transcript.value)
				break
			}
			case "initiate":
				this.#isModelLoading.value = true
				this.#progressItems.value = [...this.#progressItems.value, message]
				break
			case "ready":
				this.#isModelLoading.value = false
				break
			case "error":
				this.#isBusy.value = false
				alert(
					`An error occurred: "${message.data.message}". Please file a bug report.`
				)
				break
			case "done":
				this.#progressItems.value = this.#progressItems.value.filter(
					(item) => item.file !== message.file
				)
				break
		}
	}

	onInputChange() {
		this.#transcript.value = undefined
	}

	setModel(v: string) {
		this.#model.value = v
	}
	setSubtask(v: string) {
		this.#subtask.value = v
	}
	setMultilingual(v: boolean) {
		this.#multilingual.value = v
	}
	setLanguage(v: string) {
		this.#language.value = v
	}

	start(audioData: AudioBuffer | undefined): Promise<Word[] | undefined> | undefined {
		if (!audioData) return
		this.#transcript.value = undefined
		this.#isBusy.value = true

		let audio
		if (audioData.numberOfChannels === 2) {
			const SCALING_FACTOR = Math.sqrt(2)
			const left = audioData.getChannelData(0)
			const right = audioData.getChannelData(1)
			audio = new Float32Array(left.length)
			for (let i = 0; i < audioData.length; ++i) {
				audio[i] = (SCALING_FACTOR * (left[i] + right[i])) / 2
			}
		} else {
			audio = audioData.getChannelData(0)
		}

		this.#webWorker.postMessage({
			audio,
			model: this.#model.value,
			multilingual: this.#multilingual.value,
			subtask: this.#multilingual.value ? this.#subtask.value : null,
			language:
				this.#multilingual.value && this.#language.value !== "auto"
					? this.#language.value
					: null,
		})

		return new Promise((resolve) => {
			this.#isBusy.subscribe((v) => {
				if(!v) {
					resolve(this.#transcript.value?.chunks)
				}
			})
		})

	}

	get isModelLoadingState() {
		return this.#isModelLoading.value
	}
	get isBusyState() {
		return this.#isBusy.value
	}
	get progress() {
		return this.#progressItems.value
	}
	get output() {
		return this.#transcript.value
	}
	get modelState() {
		return this.#model.value
	}
	get multilingualState() {
		return this.#multilingual.value
	}
	get subtaskState() {
		return this.#subtask.value
	}
	get languageState() {
		return this.#language.value
	}
}

function useWorker(handler: MessageEventHandler) {
	const worker =  new Worker(new URL("./worker.js", import.meta.url), {
		type: "module",
	})
	worker.addEventListener("message", handler)
	return worker
}

export interface MessageEventHandler {
	(event: MessageEvent): void
}
