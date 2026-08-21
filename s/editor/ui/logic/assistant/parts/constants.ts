
import {assistantKnowledge} from "./knowledge.js"

export const modelUrl = "https://huggingface.co/litert-community/gemma-4-E2B-it-litert-lm/resolve/main/gemma-4-E2B-it-web.litertlm"

export const conversationConfig = {
	preface: {
		messages: [
			{role: "system", content: assistantKnowledge},
		],
	},
	sessionConfig: {
		maxOutputTokens: 400,
		samplerParams: {temperature: 0.2},
	},
}
