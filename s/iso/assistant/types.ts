
import type {TimelineFile} from "@omnimedia/omnitool"

export type AssistantMessage = {
	role: "system" | "user" | "assistant"
	content: string
}

export type AssistantContext = {
	timeline: TimelineFile
	playhead: number
	viewedItemId: number
	selectedItemId: number | null
}

export type AssistantInput = {
	messages: AssistantMessage[]
	context: AssistantContext
}

export interface Assistant {
	ask(input: AssistantInput, signal: AbortSignal): Promise<AsyncIterable<string>>
}
