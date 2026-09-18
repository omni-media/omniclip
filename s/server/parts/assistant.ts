
import {json} from "node:stream/consumers"
import type {RequestListener} from "node:http"

import {
	convertToModelMessages,
	pipeUIMessageStreamToResponse,
	stepCountIs,
	streamText,
	toUIMessageStream,
	type UIMessage,
} from "ai"
import {frontendTools, type FrontendTools} from "@assistant-ui/ai-sdk"

import type {Hub} from "../hub.js"
import {assistantTools} from "../tools.js"
import {skillInstructions} from "../skills.js"
import type {AssistantContext} from "../../iso/assistant/types.js"
import {assistantInstructions} from "../../iso/assistant/knowledge.js"

type AssistantRequest = {
	messages: UIMessage[]
	tools?: FrontendTools
	context: AssistantContext
}

export const setupAssistantApi = (hub: Hub): RequestListener => async(request, response) => {
	const controller = new AbortController()
	response.on("close", () => controller.abort())

	try {
		const body = await json(request) as AssistantRequest
		const tools = {...frontendTools(body.tools ?? {}), ...assistantTools}
		const result = streamText({
			tools,
			model: hub.assistantModel,
			stopWhen: stepCountIs(8),
			abortSignal: controller.signal,
			providerOptions: {openai: {store: false}},
			system: assistantInstructions(body.context, skillInstructions),
			messages: await convertToModelMessages(body.messages)
		})

		await pipeUIMessageStreamToResponse({
			response,
			stream: toUIMessageStream({stream: result.stream, tools}),
		})
	}
	catch (error) {
		if (response.headersSent)
			response.destroy()
		else if (!response.destroyed)
			response.writeHead(500).end(error instanceof Error ? error.message : String(error))
	}
}

