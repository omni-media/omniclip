
import * as z from "zod"
import {ToolResponse} from "assistant-stream"
import {defineToolkit, type ToolCallMessagePartProps, type Toolkit} from "@assistant-ui/react"

import {TimelineAnalysis} from "./types.js"
import {inspectTimeline} from "./timeline.js"
import {ReasoningEffort} from "../../parts/runtime.js"
import {activity, resultActivity} from "../activity.js"
import {mediaAnalysis, VideoContext} from "./context.js"
import type {EditorContext} from "../../../../../../context/context.js"
import {emptyParameters} from "../../../../../../../../iso/assistant/tools.js"
import {clearUploadProgress, setProgressMessage, setUploadProgress, useUploadProgress} from "./progress.js"

export const videoTools = (context: EditorContext, reasoningEffort: ReasoningEffort): Toolkit => defineToolkit({
	provide_selected_video: {
		type: "frontend",
		description: "Upload the original source video of the selected clip as temporary context for the cloud model. Call this before inspect_video whenever visual or audio understanding of the source is needed. This does not include timeline edits, effects, captions, or the clip trim.",
		execute: async (_, {toolCallId}) => {
			const item = context.session.index.getItemMaybe(context.session.$selectedItem())
			if (!item || !("mediaHash" in item)) throw new Error("Select a video clip first.")

			const source = context.project.resources.require(item.mediaHash).blob
			if (!source.type.startsWith("video/")) throw new Error("The selected item is not a video.")

			try {
				setProgressMessage(toolCallId, "Preparing video context")
				const video = new VideoContext(
					context.strata.projectId,
					item.mediaHash,
					source,
					progress => setUploadProgress(toolCallId, "Uploading video context", progress),
				)
				const parts = await video.provide()
				const mediaContext = parts.map(({path, start, end}, index) =>
					`Part ${index + 1}/${parts.length}: ${path} (${start.toFixed(2)}s–${end.toFixed(2)}s)`
				).join("\n")
				return new ToolResponse({
					result: {parts},
					modelContent: [{type: "text", text: `The selected source video is available as temporary cloud model context:\n${mediaContext}\nInspect every part in order with inspect_video before answering the user's question.`}],
				})
			}
			finally {
				clearUploadProgress(toolCallId)
			}
		},
		parameters: emptyParameters,
		render: function ProvideVideoActivity({status, toolCallId, result}: ToolCallMessagePartProps<unknown, {parts: unknown[]}>) {
			const progress = useUploadProgress(toolCallId)
			return status.type === "running"
				? activity(progress, "running")
				: resultActivity(result, "Video context ready", "Could not provide video context")
		},
	},
	inspect_video: {
		type: "frontend",
		description: "Ask the cloud model to inspect video context previously prepared with provide_selected_video. Call it immediately after that tool, using its path and a precise question about the source video.",
		execute: async ({path, prompt}) => {
			const {analysis} = await mediaAnalysis.inspectVideo({
				prompt,
				path,
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
		parameters: z.strictObject({
			path: z.string().describe("The path returned by provide_selected_video."),
			prompt: z.string().describe("The precise question to answer about the selected video."),
		}),
		renderText: {
			running: () => activity("Inspecting video with cloud model", "running"),
			complete: ({result}: {result?: {analysis: string}}) =>
				resultActivity(result, "Inspected the selected video", "Video inspection failed"),
		},
	},
	inspect_timeline: {
		type: "frontend",
		description: "Inspect every video source in the current timeline, one at a time, when the user's question needs visual or audio understanding of the whole edit. This analyzes original sources, not a rendered timeline, so use the timeline context to account for edits, timing, captions, and effects.",
		execute: async ({prompt}, {toolCallId}) => {
			try {
				const analyses = await inspectTimeline(context, prompt, reasoningEffort,
					message => setProgressMessage(toolCallId, message),
				)
				const mediaContext = analyses.map(({itemId, mediaHash, start, end, analysis}) =>
					`Timeline item ${itemId}, source ${mediaHash}, part ${start}s–${end}s:\n${analysis}`
				).join("\n\n")
				return new ToolResponse({
					result: {analyses},
					modelContent: [{type: "text", text: `Timeline source analyses:\n${mediaContext}\nUse these with the current timeline context to answer the user's question.`}],
				})
			}
			finally {
				clearUploadProgress(toolCallId)
			}
		},
		parameters: z.strictObject({
			prompt: z.string().describe("The user's question about the timeline."),
		}),
		render: function InspectTimelineActivity({status, toolCallId, result}: ToolCallMessagePartProps<unknown, {analyses: TimelineAnalysis[]}>) {
			const progress = useUploadProgress(toolCallId)
			return status.type === "running"
				? activity(progress, "running")
				: resultActivity(result, "Inspected timeline sources", "Timeline inspection failed")
		},
	},
})

