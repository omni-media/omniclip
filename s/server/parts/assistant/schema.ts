import * as z from "zod"
import {reasoningEfforts} from "./types.js"

const sourceName = z.string().startsWith("analysis/")

export const fileRequest = z.object({
	projectId: z.string().min(1),
	fileName: sourceName,
})

export const videoRequest = z.object({
	fileName: sourceName,
	prompt: z.string(),
	reasoningEffort: z.enum(reasoningEfforts),
})

export const uploadedParts = z.array(z.object({
	fileName: sourceName,
	start: z.number().nonnegative(),
	end: z.number().nonnegative(),
}).refine(part => part.end >= part.start))

export const modelResponse = z.object({
	choices: z.array(z.object({
		message: z.object({content: z.string().min(1)}),
	})).min(1),
})

export const assistantRequest = z.object({
	messages: z.array(z.unknown()),
	tools: z.record(z.string(), z.looseObject({
		description: z.string().optional(),
		parameters: z.record(z.string(), z.unknown()),
		providerOptions: z.record(z.string(), z.record(z.string(), z.unknown())).optional(),
	})).optional(),
	context: z.unknown(),
	reasoningEffort: z.enum(reasoningEfforts).optional(),
})
