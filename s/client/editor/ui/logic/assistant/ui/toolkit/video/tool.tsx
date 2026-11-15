
import * as z from "zod"
import {ToolResponse} from "assistant-stream"
import {emptyParameters} from "@omnimedia/omniso/assistant/tools"
import {defineToolkit, type ToolCallMessagePartProps, type Toolkit} from "@assistant-ui/react"

import {MediaContext} from "./context.js"
import {MediaSplitter} from "./splitter.js"
import {TimelineAnalysis} from "./types.js"
import {inspectTimeline} from "./timeline.js"
import {mediaAnalysisClient} from "../../../../api.js"
import {ReasoningEffort} from "../../parts/runtime.js"
import {activity, resultActivity} from "../activity.js"
import type {EditorContext} from "../../../../../../context/context.js"
import {clearUploadProgress, setProgressMessage, setUploadProgress, useUploadProgress} from "./progress.js"

export const mediaToolkit = (context: EditorContext, reasoningEffort: ReasoningEffort): Toolkit => defineToolkit({
	...mediaTools(context, reasoningEffort, "video"),
	...mediaTools(context, reasoningEffort, "audio"),
	inspect_timeline: {
		type: "frontend",
		description: "Inspect every video and audio source in the current timeline, one at a time, when the user's question needs visual or audio understanding of the whole edit. This analyzes original sources, not a rendered timeline, so use the timeline context to account for edits, timing, captions, and effects.",
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

function mediaTools(context: EditorContext, reasoningEffort: ReasoningEffort, kind: "video" | "audio"): Toolkit {
	const label = kind === "video" ? "Video" : "Audio"
	return defineToolkit({
		[`provide_selected_${kind}`]: {
			type: "frontend",
			description: `Upload the original source ${kind} of the selected clip as temporary context for the cloud model. Call this before inspect_${kind} whenever visual or audio understanding of the source is needed. This does not include timeline edits, effects, captions, or the clip trim.`,
			execute: async (_, {toolCallId}) => {
				const item = context.session.index.getItemMaybe(context.session.$selectedItem())
				if (!item || !("mediaHash" in item)) throw new Error("Select an audio or video clip first.")

				const {blob: source, filename} = context.project.resources.require(item.mediaHash)
				if (!source.type.startsWith(`${kind}/`)) throw new Error(`The selected item is not ${kind}.`)

				try {
					setProgressMessage(toolCallId, `Preparing ${kind} context`)
					const media = new MediaContext(
						context.strata.projectId,
						item.mediaHash,
						new MediaSplitter(source, filename),
						progress => setUploadProgress(toolCallId, `Uploading ${kind} context`, progress),
					)
					const parts = await media.provide()
					const mediaContext = parts.map(({path, start, end}, index) =>
						`Part ${index + 1}/${parts.length}: ${path} (${start.toFixed(2)}s–${end.toFixed(2)}s)`
					).join("\n")
					return new ToolResponse({
						result: {parts},
						modelContent: [{type: "text", text: `The selected source ${kind} is available as temporary cloud model context:\n${mediaContext}\nInspect every part in order with inspect_${kind} before answering the user's question.`}],
					})
				}
				finally {
					clearUploadProgress(toolCallId)
				}
			},
			parameters: emptyParameters,
			render: function ProvideMediaActivity({status, toolCallId, result}: ToolCallMessagePartProps<unknown, {parts: unknown[]}>) {
				const progress = useUploadProgress(toolCallId, `Preparing ${kind} context`)
				return status.type === "running"
					? activity(progress, "running")
					: resultActivity(result, `${label} context ready`, `Could not provide ${kind} context`)
			},
		},
		[`inspect_${kind}`]: {
			type: "frontend",
			description: `Ask the cloud model to inspect ${kind} context previously prepared with provide_selected_${kind}. Call it immediately after that tool, using its path and a precise question about the source ${kind}.`,
			execute: async ({path, prompt}) => {
				const {analysis} = await (kind === "video" ? mediaAnalysisClient.inspectVideo : mediaAnalysisClient.inspectAudio)({
					prompt,
					path,
					reasoningEffort
				}).catch(error => {
					console.error(`${label} inspection failed`, error)
					throw error
				})
				return new ToolResponse({
					result: {analysis},
					modelContent: [{type: "text", text: `Cloud model analysis of the selected source ${kind}:\n${analysis}`}],
				})
			},
			parameters: z.strictObject({
				path: z.string().describe(`The path returned by provide_selected_${kind}.`),
				prompt: z.string().describe(`The precise question to answer about the selected ${kind}.`),
			}),
			renderText: {
				running: () => activity(`Inspecting ${kind} with cloud model`, "running"),
				complete: ({result}: {result?: {analysis: string}}) =>
					resultActivity(result, `Inspected the selected ${kind}`, `${label} inspection failed`),
			},
		},
	})
}

