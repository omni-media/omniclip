
import type {DataType, DeviceType} from "@huggingface/transformers"

export type AssistantDtype = Exclude<DataType, "auto">

export type AssistantModelOptions = {
	id: string
	name: string
	contextLength: number
}

export type AssistantSettings = {
	device: DeviceType
	dtype: DataType
	contextLength: "auto" | number
	maxOutputTokens: number
	temperature: number
	topP: number
	topK: number
	repetitionPenalty: number
}

export const assistantModels = [
	{
		id: "onnx-community/gemma-4-E2B-it-ONNX",
		name: "Gemma 4 E2B",
		source: "Local",
		contextLength: 131_072,
	},
	{
		id: "onnx-community/gemma-4-E4B-it-ONNX",
		name: "Gemma 4 E4B",
		source: "Local",
		contextLength: 131_072,
	},
] as const satisfies readonly (AssistantModelOptions & {source: "Local"})[]

export const defaultAssistantSettings = {
	device: "auto",
	dtype: "auto",
	contextLength: "auto",
	maxOutputTokens: 400,
	temperature: 0.2,
	topP: 1,
	topK: 50,
	repetitionPenalty: 1,
} as const satisfies AssistantSettings

export type AssistantModelId = typeof assistantModels[number]["id"]
