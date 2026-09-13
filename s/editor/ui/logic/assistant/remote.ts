
import type {Assistant, AssistantInput} from "../../../../iso/assistant/types.js"

export class RemoteAssistant implements Assistant {
	constructor(public endpoint = "/api/assistant") {}

	async ask(input: AssistantInput, signal: AbortSignal) {
		const response = await fetch(this.endpoint, {
			method: "POST",
			headers: {"content-type": "application/json"},
			body: JSON.stringify(input),
			signal,
		})
		if (!response.ok)
			throw new Error(await response.text())

		return response.body!.pipeThrough(new TextDecoderStream())
	}
}

