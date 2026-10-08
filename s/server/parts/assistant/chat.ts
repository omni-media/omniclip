
import {json} from "node:stream/consumers"
import {createOpenAI} from "@ai-sdk/openai"
import type {RequestListener} from "node:http"

import {
	convertToModelMessages,
	pipeUIMessageStreamToResponse,
	stepCountIs,
	streamText,
	toUIMessageStream,
	safeValidateUIMessages,
} from "ai"
import {frontendTools} from "@assistant-ui/ai-sdk"

import {assistantRequest} from "./schema.js"
import {requireEnv} from "../../utils/env.js"
import {assistantTools} from "../../tools.js"
import {skillInstructions} from "../../skills.js"
import type {AssistantContext} from "../../../iso/assistant/types.js"
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
			const parsed = assistantRequest.safeParse(await json(request))

			if (!parsed.success)
				return response.writeHead(400).end("Invalid assistant request")

			const body = parsed.data
			const tools = {...frontendTools(body.tools ?? {}), ...assistantTools}
			const messages = await safeValidateUIMessages({messages: body.messages, tools})

			if (!messages.success)
				return response.writeHead(400).end("Invalid assistant messages")

			const result = streamText({
				tools,
				model,
				stopWhen: stepCountIs(8),
				abortSignal: controller.signal,
				providerOptions: {openai: {reasoningEffort: body.reasoningEffort ?? "xhigh"}},
				system: assistantInstructions(body.context as AssistantContext, skillInstructions),
				messages: await convertToModelMessages(messages.data, {tools})
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

