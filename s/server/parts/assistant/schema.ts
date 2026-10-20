import * as z from "zod"
import {reasoningEfforts} from "./types.js"
import {projectId} from "../../../iso/schemas/session.js"

const sourcePath = z.string().min(1)

export const fileRequest = z.object({
	projectId,
	path: sourcePath,
}).refine(request => request.path.startsWith(`${request.projectId}/`), {
	message: "Upload does not belong to this project",
	path: ["path"],
})

export const videoRequest = z.object({
	path: sourcePath,
	prompt: z.string(),
	reasoningEffort: z.enum(reasoningEfforts),
})

export const uploadedParts = z.array(z.object({
	path: sourcePath,
	start: z.number().nonnegative(),
	end: z.number().nonnegative(),
}).refine(part => part.end >= part.start))

export function uploadedPartsFor(path: string) {
	const prefix = path.slice(0, path.lastIndexOf("/") + 1)
	return uploadedParts.refine(parts => parts.every(part => part.path.startsWith(prefix)), {
		message: "Uploaded part does not belong to this source",
	})
}

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
