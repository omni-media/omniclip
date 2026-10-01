
import {json} from "node:stream/consumers"
import {createOpenAI} from "@ai-sdk/openai"
import type {RequestListener} from "node:http"

import {
	convertToModelMessages,
	pipeUIMessageStreamToResponse,
	stepCountIs,
	streamText,
	toUIMessageStream,
} from "ai"
import {frontendTools} from "@assistant-ui/ai-sdk"

import {AssistantRequest} from "./types.js"
import {requireEnv} from "../../utils/env.js"
import {assistantTools} from "../../tools.js"
import {skillInstructions} from "../../skills.js"
import {assistantInstructions} from "../../../iso/assistant/knowledge.js"


export const assistantChatApi = (): RequestListener => {
	const model = createOpenAI({
		name: "cloud-model",
		apiKey: requireEnv("DASHSCOPE_API_KEY"),
		baseURL: requireEnv("QWEN_API_URL").replace(/\/chat\/completions$/, ""),
	}).chat("qwen3.8-omni-flash")

	return async(request, response) => {
		const controller = new AbortController()
		response.on("close", () => controller.abort())

		try {
			const body = await json(request) as AssistantRequest
			const tools = {...frontendTools(body.tools ?? {}), ...assistantTools}
			const reasoningEffort = body.reasoningEffort ?? "xhigh"
			const result = streamText({
				tools,
				model,
				stopWhen: stepCountIs(8),
				abortSignal: controller.signal,
				providerOptions: {openai: {reasoningEffort}},
				system: assistantInstructions(body.context, skillInstructions),
				messages: await convertToModelMessages(body.messages, {tools})
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
}

