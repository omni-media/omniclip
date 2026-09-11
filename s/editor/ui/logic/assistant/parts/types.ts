import type {AsSchematic} from "@e280/comrade"
import type {Message, PreTrainedModel, Processor} from "@huggingface/transformers"
import type {AssistantDtype, AssistantModelId, AssistantModelOptions, AssistantSettings} from "../../models/assistant.js"

export type AssistantBackend = {
	processor: Processor
	model: PreTrainedModel
	contextLength: number
}

export type AssistantProgressReport = {progress: number, text: string}
export type AssistantProgressCallback = (report: AssistantProgressReport) => void

export type AssistantRequest = {
	modelId: AssistantModelId
	messages: Message[]
	settings: AssistantSettings
	signal: AbortSignal
}

export type AssistantSchematic = AsSchematic<{
	work: {
		availableDtypes(modelId: string): Promise<AssistantDtype[]>
		prepare(options: AssistantModelOptions, settings: AssistantSettings): Promise<void>
		ask(messages: Message[], settings: AssistantSettings): Promise<void>
	}
	host: {
		loading(report: AssistantProgressReport): Promise<void>
		deliverText(text: string): Promise<void>
	}
}>
