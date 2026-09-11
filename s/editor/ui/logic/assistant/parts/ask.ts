
import {Tensor, TextStreamer, type Message} from "@huggingface/transformers"

import type {AssistantBackend} from "./types.js"
import {assistantKnowledge} from "./knowledge.js"
import type {AssistantSettings} from "../../models/assistant.js"

const systemMessage = {role: "system" as const, content: assistantKnowledge}
const templateOptions = {add_generation_prompt: true, enable_thinking: false, tokenize: true as const}

export async function ask(
	backend: AssistantBackend,
	messages: Message[],
	settings: AssistantSettings,
	onText: (text: string) => void,
) {

	const {processor, model} = backend
	const contextLength = settings.contextLength === "auto" ? backend.contextLength : settings.contextLength
	const inputs = fitContext(processor, messages, contextLength - settings.maxOutputTokens)

	try {
		const output = await model.generate({
			...inputs,
			do_sample: settings.temperature > 0,
			max_new_tokens: settings.maxOutputTokens,
			repetition_penalty: settings.repetitionPenalty,
			temperature: settings.temperature || 1,
			top_k: settings.topK,
			top_p: settings.topP,
			return_dict_in_generate: false,
			streamer: new TextStreamer(processor.tokenizer!, {
				skip_prompt: true,
				skip_special_tokens: true,
				callback_function: onText,
			}),
		}) as Tensor
		output.dispose()
	}
	finally {disposeTensors(inputs)}
}

function fitContext(
	processor: AssistantBackend["processor"],
	messages: Message[],
	maxTokens: number,
) {
	let history = messages
	while (true) {
		const inputs = processor.tokenizer!.apply_chat_template(
			[systemMessage, ...history],
			{...templateOptions, chat_template: processor.chat_template},
		)
		if (inputs.input_ids.size <= maxTokens)
			return inputs

		disposeTensors(inputs)
		if (history.length <= 1)
			throw new Error("The message and requested output exceed the context limit. Shorten the message, reduce max tokens, or increase context.")
		history = history.slice(history[1]?.role === "assistant" ? 2 : 1)
	}
}

function disposeTensors(values: Record<string, unknown>) {
	for (const value of Object.values(values))
		if (value instanceof Tensor)
			value.dispose()
}

