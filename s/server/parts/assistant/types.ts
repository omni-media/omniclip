
import {UIMessage} from "ai"
import {FrontendTools} from "@assistant-ui/ai-sdk"

import {ProjectSession} from "../cleanup.js"
import {AssistantContext} from "../../../iso/assistant/types.js"

export type AssistantRequest = {
	messages: UIMessage[]
	tools?: FrontendTools
	context: AssistantContext
	reasoningEffort?: "none" | "low" | "medium" | "xhigh"
}

export const reasoningEfforts = ['none', 'low', 'medium', 'xhigh'] as const
export type ReasoningEffort = typeof reasoningEfforts[number]
export type UploadedPart = {fileName: string; start: number; end: number}
export type VideoRequest = {prompt: string; fileName: string; reasoningEffort: ReasoningEffort}
export type FileRequest = ProjectSession & {fileName: string}
export type ModelResponse = {choices?: {message?: {content?: string}}[]}
