
import type {infer as Infer} from "zod"
import type {fileRequest, videoRequest, uploadedParts} from "./schema.js"

export const reasoningEfforts = ['none', 'low', 'medium', 'xhigh'] as const
export type ReasoningEffort = typeof reasoningEfforts[number]
export type UploadedPart = Infer<typeof uploadedParts>[number]
export type VideoRequest = Infer<typeof videoRequest>
export type FileRequest = Infer<typeof fileRequest>
