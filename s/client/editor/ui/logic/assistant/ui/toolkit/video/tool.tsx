
import * as z from "zod"
import {untab} from "@e280/stz"
import {probe} from "@omnimedia/omnitool"
import {ToolResponse} from "assistant-stream"
import {defineToolkit, type ToolCallMessagePartProps, type Toolkit} from "@assistant-ui/react"

import {MediaContext} from "./context.js"
import {MediaSplitter} from "./splitter.js"
import type {TimelineAnalysis} from "./types.js"
import {inspectTimeline} from "./timeline.js"
import {mediaAnalysisClient} from "../../../../api.js"
import type {ReasoningEffort} from "../../parts/runtime.js"
import {activity, resultActivity} from "../activity.js"
import type {EditorContext} from "../../../../../../context/context.js"
import {clearUploadProgress, setProgressMessage, setUploadProgress, useUploadProgress} from "./progress.js"

export const mediaToolkit = (context: EditorContext, reasoningEffort: ReasoningEffort): Toolkit => defineToolkit({
	provide_media: {
		type: "frontend",
		description: untab(`
			Prepare an original audio or video source for cloud inspection, without timeline edits or trims.
			Pass the ID from a media mention or the mediaHash of a timeline item. Timeline mentions contain item IDs, so look up their mediaHash in the timeline.
			Omit mediaHash to use the selected clip. If nothing is selected, use inspect_timeline for whole-timeline requests or ask the user to select a clip if they specifically asked about the selection.
			Call inspect_media for each returned part with its path and the returned kind.
		`).trim(),
		parameters: z.strictObject({mediaHash: z.string().optional().describe("Source media hash. Omit to use the selected clip.")}),
		render: function ProvideMediaActivity({status, toolCallId, result}: ToolCallMessagePartProps<unknown, {parts: unknown[]}>) {
			const progress = useUploadProgress(toolCallId, "Preparing media context")
			return status.type === "running"
				? activity(progress, "running")
				: resultActivity(result, "Media context ready", "Could not provide media context")
		},
		execute: async ({mediaHash}, {toolCallId}) => {
			const hash = mediaHash ?? selectedMediaHash(context)
			const {blob: source, filename} = await context.controllers.cargo.resolveMedia(hash)
			const [kind, subtype] = source.type.split("/", 2)
			if (subtype === undefined || (kind !== "audio" && kind !== "video"))
				throw new Error("Only audio and video files can be inspected.")

			try {
				setProgressMessage(toolCallId, `Preparing ${kind} context`)
				const splitter = new MediaSplitter(source, filename)
				const parts = await new MediaContext(context.strata.projectId, hash, splitter,
					progress => setUploadProgress(toolCallId, `Uploading ${kind} context`, progress),
				).provide()
				const partLines = parts.map(({path, start, end}, index) =>
					`Part ${index + 1}/${parts.length}: ${path} (${start.toFixed(2)}s–${end.toFixed(2)}s)`
				)
				return new ToolResponse({
					result: {kind, parts},
					modelContent: [{
						type: "text",
						text: [
							`The source ${kind} is available as temporary cloud model context:`,
							...partLines,
							`Call inspect_media with kind "${kind}" for every part in order before answering.`,
						].join("\n"),
					}],
				})
			}
			finally {
				clearUploadProgress(toolCallId)
			}
		},
	},
	inspect_media: {
		type: "frontend",
		description: "Inspect one source part prepared by provide_media. Use its path, the returned media kind, and a focused question.",
		parameters: z.strictObject({
			kind: z.enum(["audio", "video"]).describe("The kind returned by provide_media."),
			path: z.string().describe("The part path returned by provide_media."),
			prompt: z.string().describe("The question to answer about this source."),
		}),
		execute: async ({kind, path, prompt}) => {
			const inspect = kind === "video" ? mediaAnalysisClient.inspectVideo : mediaAnalysisClient.inspectAudio
			const {analysis} = await inspect({prompt, path, reasoningEffort})
			return new ToolResponse({
				result: {analysis},
				modelContent: [{type: "text", text: `Cloud model analysis of the source ${kind}:\n${analysis}`}],
			})
		},
	},
	probe_media: {
		type: "frontend",
		description: "Read local media metadata by mediaHash, including a mentioned library file that is not on the timeline. Media mentions use :media[label]{name=mediaId}; pass the mediaId as mediaHash. Returns duration, dimensions, frame rate, and codecs when available. Use this before calculating a fit or centered position; do not guess source dimensions. For an unrotated item without inherited transforms, use scale = min(canvasWidth / width, canvasHeight / height) to fit the whole image, or max(...) to fill the canvas. Center it at [(canvasWidth - width * scale) / 2, (canvasHeight - height * scale) / 2].",
		parameters: z.strictObject({mediaHash: z.string()}),
		execute: async ({mediaHash}) => {
			const {blob, filename} = await context.controllers.cargo.resolveMedia(mediaHash)
			return {filename, ...await probe(blob)}
		},
		renderText: {
			running: () => activity("Reading media metadata", "running"),
			complete: ({result}: {result?: unknown}) =>
				resultActivity(result, "Read media metadata", "Could not read media metadata"),
		},
	},
	inspect_timeline: {
		type: "frontend",
		description: "Inspect every video and audio source in the current timeline, one at a time. Use this when the request concerns the whole timeline or no clip is selected, unless the user specifically asks about a selected clip. This analyzes original sources, not a rendered timeline, so use the timeline context to account for edits, timing, captions, and effects.",
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

function selectedMediaHash(context: EditorContext) {
	const {session} = context
	const item = session.index.getItemMaybe(session.$selectedItem())
	if (!item || !("mediaHash" in item)) throw new Error("Select an audio or video clip first.")
	return item.mediaHash
}

