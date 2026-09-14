
import type {AsSchematic} from "@e280/comrade"
import type {PreTrainedModel, Processor} from "@huggingface/transformers"
import type {AssistantInput} from "../../../../../iso/assistant/types.js"
import type {AssistantDtype, AssistantModelOptions, AssistantSettings} from "../../models/assistant.js"

export type AssistantBackend = {
	processor: Processor
	model: PreTrainedModel
	maxContextLength: number
	settings: AssistantSettings
}

export type AssistantProgressReport = {progress: number, text: string}
export type AssistantProgressCallback = (report: AssistantProgressReport) => void

export type AssistantSchematic = AsSchematic<{
	work: {
		availableDtypes(modelId: string): Promise<AssistantDtype[]>
		prepare(options: AssistantModelOptions, settings: AssistantSettings): Promise<void>
		ask(input: AssistantInput): Promise<void>
	}
	host: {
		loading(report: AssistantProgressReport): Promise<void>
		deliverText(text: string): Promise<void>
	}
}>
