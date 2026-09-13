
export type AssistantMessage = {
	role: "system" | "user" | "assistant"
	content: string
}

export type AssistantInput = {
	messages: AssistantMessage[]
}

export interface Assistant {
	ask(input: AssistantInput, signal: AbortSignal): Promise<AsyncIterable<string>>
}
