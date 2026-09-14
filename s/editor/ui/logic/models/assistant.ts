
import type {DataType, DeviceType} from "@huggingface/transformers"

export type AssistantDtype = Exclude<DataType, "auto">

export type AssistantModelOptions = {
	id: string
	name: string
	maxContextLength: number
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

export const localAssistantModels = [
	{
		id: "onnx-community/gemma-4-E2B-it-ONNX",
		name: "Gemma 4 E2B",
		source: "Local",
		maxContextLength: 131_072,
	},
	{
		id: "onnx-community/gemma-4-E4B-it-ONNX",
		name: "Gemma 4 E4B",
		source: "Local",
		maxContextLength: 131_072,
	},
	{
		id: "onnx-community/Qwen3.5-2B-ONNX-OPT",
		name: "Qwen3.5 2B",
		source: "Local",
		maxContextLength: 262_144,
	},
] as const satisfies readonly (AssistantModelOptions & {source: "Local"})[]

export const assistantModels = [
	...localAssistantModels,
	{id: "cloud", name: "Omniclip Cloud", source: "Cloud"},
] as const

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
export type LocalAssistantModelId = typeof localAssistantModels[number]["id"]
