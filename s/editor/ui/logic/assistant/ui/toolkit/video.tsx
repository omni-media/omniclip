import Renraku from "@e280/renraku"
import {ToolResponse} from "assistant-stream"
import {defineToolkit} from "@assistant-ui/react"

import {activity, resultActivity} from "./activity.js"
import type {EditorContext} from "../../../../../context/context.js"
import type {MediaAnalysisApi, ReasoningEffort} from "../../../../../../server/parts/assistant/analysis.js"

const mediaAnalysis = Renraku.httpRemote<MediaAnalysisApi>({url: "/api/analyze"})

async function uploadVideo(source: Blob) {
	const target = await mediaAnalysis.uploadTarget()
	const response = await fetch(target.uploadUrl, {
		method: "PUT",
		headers: {"content-type": source.type || "video/mp4"},
		body: source,
	})
	if (!response.ok)
		throw new Error(`R2 upload failed: ${response.status} ${await response.text()}`)
	return target.fileName
}

export const videoTools = (context: EditorContext, reasoningEffort: ReasoningEffort) => defineToolkit({
	provide_selected_video: {
		type: "frontend",
		description: "Upload the original source video of the selected clip as temporary context for the cloud model. Call this before inspect_video whenever visual or audio understanding of the source is needed. This does not include timeline edits, effects, captions, or the clip trim.",
		execute: async () => {
			const item = context.session.index.getItemMaybe(context.session.$selectedItem())
			if (!item || !("mediaHash" in item)) throw new Error("Select a video clip first.")

			const source = context.project.resources.require(item.mediaHash).blob
			if (!source.type.startsWith("video/")) throw new Error("The selected item is not a video.")

			const fileName = await uploadVideo(source)
			return new ToolResponse({
				result: {fileName},
				modelContent: [{type: "text", text: `The selected source video is available as temporary cloud model context with fileName ${fileName}. Call inspect_video with this fileName and the user's precise question.`}],
			})
		},
		parameters: {type: "object", properties: {}, additionalProperties: false},
		renderText: {
			running: () => activity("Providing video context to cloud model", "running"),
			complete: ({result}: {result?: {fileName: string}}) =>
				resultActivity(result, "Video context ready", "Could not provide video context"),
		},
	},
	inspect_video: {
		type: "frontend",
		description: "Ask the cloud model to inspect video context previously prepared with provide_selected_video. Call it immediately after that tool, using its fileName and a precise question about the source video.",
		execute: async ({fileName, prompt}: {fileName: string; prompt: string}) => {
			const {analysis} = await mediaAnalysis.inspectVideo({
				prompt,
				fileName,
				reasoningEffort
			}).catch(error => {
				console.error("Video inspection failed", error)
				throw error
			})
			return new ToolResponse({
				result: {analysis},
				modelContent: [{type: "text", text: `Cloud model analysis of the selected source video:\n${analysis}`}],
			})
		},
		parameters: {
			type: "object",
			properties: {
				fileName: {type: "string", description: "The fileName returned by provide_selected_video."},
				prompt: {type: "string", description: "The precise question to answer about the selected video."},
			},
			required: ["fileName", "prompt"],
			additionalProperties: false,
		},
		renderText: {
			running: () => activity("Inspecting video with cloud model", "running"),
			complete: ({result}: {result?: {analysis: string}}) =>
				resultActivity(result, "Inspected the selected video", "Video inspection failed"),
		},
	},
})

