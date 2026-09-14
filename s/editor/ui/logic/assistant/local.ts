
import {Comrade, type Thread} from "@e280/comrade"

import {abortable} from "../utils/abortable.js"
import type {Assistant, AssistantInput} from "../../../../iso/assistant/types.js"
import type {AssistantProgressCallback, AssistantSchematic} from "./parts/types.js"
import {localAssistantModels, type LocalAssistantModelId, type AssistantSettings} from "../models/assistant.js"

export class LocalAssistant implements Assistant {
	#thread?: Promise<Thread<AssistantSchematic>>
	#receiveText?: (text: string) => void

	constructor(public onLoading: AssistantProgressCallback) {}

	get thread() {
		return this.#thread ??= Comrade.thread<AssistantSchematic>({
			label: "OmniclipAssistant",
			workerUrl: new URL("./ui/logic/assistant/worker.bundle.min.js", document.baseURI),
			setupHost: () => ({
				loading: async report => this.onLoading(report),
				deliverText: async text => this.#receiveText?.(text),
			}),
		})
	}

	async availableDtypes(id: string) {
		return (await this.thread).work.availableDtypes(id)
	}

	async prepare(modelId: LocalAssistantModelId, settings: AssistantSettings, signal: AbortSignal) {
		const model = localAssistantModels.find(model => model.id === modelId)!
		await abortable(
			this.thread.then(thread => thread.work.prepare(model, settings)),
			signal, () => this.dispose(),
		)
	}

	async ask(input: AssistantInput, signal: AbortSignal) {
		return new ReadableStream<string>({
			start: async controller => {
				this.#receiveText = text => controller.enqueue(text)
				try {
					await abortable(
						this.thread.then(thread => thread.work.ask(input)),
						signal, () => this.dispose(),
					)
					controller.close()
				}
				finally {this.#receiveText = undefined}
			},
		})
	}

	dispose() {
		this.#thread?.then(thread => thread.terminate())
		this.#thread = undefined
	}
}

