
import {randomUUID} from "node:crypto"
import {ExposedError} from "@e280/renraku"

import {R2Bucket} from "../bucket.js"
import {requireEnv} from "../../utils/env.js"
import {trackTemporaryUpload, type ProjectSession} from "../cleanup.js"

export const reasoningEfforts = ['none', 'low', 'medium', 'xhigh'] as const
export type ReasoningEffort = typeof reasoningEfforts[number]
type VideoRequest = {prompt: string; fileName: string; reasoningEffort: ReasoningEffort}
type ModelResponse = {choices?: {message?: {content?: string}}[]}

export const mediaAnalysisApi = (r2: R2Bucket) => ({
	async uploadTarget(input: ProjectSession) {
		const target = await r2.createUploadTarget(`analysis/${randomUUID()}`)
		trackTemporaryUpload(input.projectId, target.fileName)
		return target
	},
	async inspectVideo(input: VideoRequest) {
		if (!isVideoRequest(input)) throw new ExposedError("Invalid video request")

		const videoUrl = await r2.downloadUrl(input.fileName)
		return {analysis: await analyzeVideo(videoUrl, input.prompt, input.reasoningEffort)}
	},
})

export type MediaAnalysisApi = ReturnType<typeof mediaAnalysisApi>

async function analyzeVideo(videoUrl: string, prompt: string, reasoningEffort: ReasoningEffort) {
	const response = await fetch(requireEnv("QWEN_API_URL"), {
		method: "POST",
		headers: {
			authorization: `Bearer ${requireEnv("DASHSCOPE_API_KEY")}`,
			"content-type": "application/json",
		},
		body: JSON.stringify({
			model: "qwen3.8-omni-flash",
			enable_thinking: reasoningEffort !== "none",
			reasoning_effort: reasoningEffort,
			modalities: ["text"],
			messages: [{role: "user", content: [
				{type: "video_url", video_url: {url: videoUrl}},
				{type: "text", text: prompt},
			]}],
		}),
	})
	if (!response.ok)
		throw new ExposedError(`Cloud model video analysis failed (${response.status}): ${await response.text()}`)

	const content = (await response.json() as ModelResponse).choices?.[0]?.message?.content
	if (!content) throw new ExposedError("Cloud model returned no analysis")
	return content
}

function isVideoRequest(value: unknown): value is VideoRequest {
	return !!value && typeof value === "object" &&
		typeof (value as VideoRequest).fileName === "string" &&
		(value as VideoRequest).fileName.startsWith("analysis/") &&
		typeof (value as VideoRequest).prompt === "string" &&
		isReasoningEffort((value as VideoRequest).reasoningEffort)
}

function isReasoningEffort(value: unknown): value is ReasoningEffort {
	return value === "none" || value === "low" || value === "medium" || value === "xhigh"
}

