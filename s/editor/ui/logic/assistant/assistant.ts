
import {Comrade, type Thread} from "@e280/comrade"

import {abortable} from "../utils/abortable.js"
import {assistantModels} from "../models/assistant.js"
import type {AssistantProgressCallback, AssistantRequest, AssistantSchematic} from "./parts/types.js"

export class Assistant {
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

	async #run({modelId, messages, settings}: AssistantRequest) {
		const thread = await this.thread
		const model = assistantModels.find(model => model.id === modelId)!
		await thread.work.prepare(model, settings)
		await thread.work.ask(messages, settings)
	}

	ask(request: AssistantRequest) {
		return new ReadableStream<string>({
			start: async controller => {
				this.#receiveText = text => controller.enqueue(text)
				try {
					await abortable(this.#run(request), request.signal, () => this.dispose())
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

