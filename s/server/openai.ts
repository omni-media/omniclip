import OpenAI from "openai"
import {assistantInstructions} from "../iso/assistant/knowledge.js"
import type {Assistant, AssistantInput} from "../iso/assistant/types.js"

export class OpenAIAssistant implements Assistant {
	#openai = new OpenAI()

	constructor(public model = "gpt-5.6-luna") {}

	async ask({messages, context}: AssistantInput, signal: AbortSignal) {
		const stream = await this.#openai.responses.create({
			model: this.model,
			instructions: assistantInstructions(context),
			input: messages,
			store: false,
			stream: true,
		}, {signal})

		return (async function*() {
			for await (const event of stream) {
				if (
					event.type === "response.output_text.delta" ||
					event.type === "response.refusal.delta"
				)
					yield event.delta

				if (event.type === "error")
					throw new Error(event.message)

				if (event.type === "response.failed")
					throw new Error(event.response.error?.message ?? "Generation failed")

				if (event.type === "response.incomplete")
					throw new Error(event.response.incomplete_details?.reason ?? "Generation incomplete")
			}
		})()
	}
}
