
import {Conversation, Engine} from "@litert-lm/core"

import {cacheModel} from "./parts/cache.js"
import {getChunkText} from "./parts/utils.js"
import type {AssistantProgressCallback} from "./parts/types.js"
import {conversationConfig, modelUrl} from "./parts/constants.js"


export class AssistantModel {
	#engine?: Engine
	#conversation?: Conversation

	async ask(
		question: string,
		onProgress: AssistantProgressCallback,
		onToken: (token: string) => void | Promise<void>,
	) {
		const conversation = await this.#getConversation(onProgress)
		const stream = conversation.sendMessageStreaming(question)

		for await (const chunk of stream) {
			const text = getChunkText(chunk.content)
			if (text)
				await onToken(text)
		}
	}

	async dispose() {
		await this.#conversation?.delete()
		await this.#engine?.delete()
	}

	async #getConversation(onProgress: AssistantProgressCallback) {
		if (this.#conversation)
			return this.#conversation

		const engine = await this.#getEngine(onProgress)

		return this.#conversation = await engine.createConversation(conversationConfig)
	}

	async #getEngine(onProgress: AssistantProgressCallback) {
		if (this.#engine)
			return this.#engine

		onProgress({
			progress: 0,
			text: "Loading Gemma 4 E2B with LiteRT-LM…",
		})

		const model = await cacheModel(modelUrl, (loaded, total) => {
			onProgress({
				progress: total ? loaded / total : 0,
				text: "Downloading Gemma 4 E2B…",
			})
		})

		onProgress({
			progress: 1,
			text: "Initializing Gemma 4 E2B…",
		})

		this.#engine = await Engine.create({
			model,
			mainExecutorSettings: {maxNumTokens: 8192},
		})

		onProgress({
			progress: 1,
			text: "Gemma 4 E2B loaded",
		})

		return this.#engine
	}
}

