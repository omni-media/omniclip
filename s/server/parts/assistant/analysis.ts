
import {ExposedError} from "@e280/renraku"
import type {ZodType} from "zod"

import {R2Bucket} from "../bucket.js"
import {requireEnv} from "../../utils/env.js"
import {trackTemporaryUpload} from "../cleanup.js"
import {FileRequest, ReasoningEffort, VideoRequest} from "./types.js"
import {fileRequest, videoRequest, uploadedPartsFor, modelResponse} from "./schema.js"

export const mediaAnalysisApi = (r2: R2Bucket, userId: string) => {
	const storage = r2.forUser(userId)
	const trackUpload = (projectId: string, path: string) =>
		trackTemporaryUpload(`${userId}/${projectId}`, storage.key(path))

	return {
		async uploadTarget(input: FileRequest) {
			const {projectId, path} = parse(fileRequest, input, "Invalid upload request")
			const target = await storage.createUploadTarget(path)
			trackUpload(projectId, path)
			return target
		},
		async getUploadedParts(input: FileRequest) {
			const {projectId, path} = parse(fileRequest, input, "Invalid upload request")
			const manifest = await storage.getJson<unknown>(path)
			if (manifest == null) return manifest
			const parts = parse(uploadedPartsFor(path), manifest, "Invalid uploaded parts")
			trackUpload(projectId, path)
			for (const part of parts)
				trackUpload(projectId, part.path)
			return parts
		},
		async inspectVideo(input: VideoRequest) {
			const {path, prompt, reasoningEffort} = parse(videoRequest, input, "Invalid video request")
			const videoUrl = await storage.downloadUrl(path)
			return {analysis: await analyzeVideo(videoUrl, prompt, reasoningEffort)}
		},
	}
}

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

	return parse(modelResponse, await response.json(), "Cloud model returned no analysis")
		.choices[0].message.content
}

function parse<T>(schema: ZodType<T>, input: unknown, message: string): T {
	const result = schema.safeParse(input)
	if (!result.success) throw new ExposedError(message)
	return result.data
}

