import {Readable} from "node:stream"
import {json} from "node:stream/consumers"
import {pipeline} from "node:stream/promises"
import type {RequestListener} from "node:http"

import type {Assistant, AssistantInput} from "../../iso/assistant/types.js"

export const setupAssistantApi = (assistant: Assistant): RequestListener => async(request, response) => {
	const controller = new AbortController()
	response.on("close", () => controller.abort())

	try {
		const input = await json(request) as AssistantInput
		const stream = await assistant.ask(input, controller.signal)

		response.writeHead(200, {"content-type": "text/plain; charset=utf-8"})
		await pipeline(Readable.from(stream), response)
	}
	catch (error) {
		if (response.headersSent)
			response.destroy()
		else if (!response.destroyed)
			response.writeHead(500).end(error instanceof Error ? error.message : String(error))
	}
}
