
import {defineToolkit, type Toolkit} from "@assistant-ui/react"

import {videoTools} from "./video/tool.js"
import {timelinePatchParameters} from "./schema.js"
import {activity, resultActivity} from "./activity.js"
import type {EditorContext} from "../../../../../context/context.js"
import type {TimelinePatchResult} from "../../../../../../iso/timeline.js"
import type {ReasoningEffort} from "../../../../../../server/parts/assistant/analysis.js"

type SkillCall = {skill: string; path: string}

const emptyParameters = {type: "object" as const, properties: {}, additionalProperties: false}

export const createAssistantToolkit = (
	context: EditorContext,
	reasoningEffort: ReasoningEffort,
): Toolkit => defineToolkit({
	read_skill: {
		type: "backend",
		renderText: {
			running: ({args}: {args: SkillCall}) =>
				activity(`Reading ${args.skill}/${args.path}`, "running"),
			complete: ({args}: {args: SkillCall}) =>
				activity(`Read ${args.skill}/${args.path}`, "complete"),
		},
	},
	create_item: {
		type: "frontend",
		description: "Create one opaque ID for a new timeline item. Call this before adding, duplicating, or splitting an item; never invent item IDs.",
		execute: () => ({id: context.omni.getId()}),
		parameters: emptyParameters,
		renderText: {
			running: () => activity("Preparing a new item", "running"),
			complete: ({result}: {result?: {id: string}}) =>
				resultActivity(result, "New item ready", "Could not prepare an item"),
		},
	},
	...videoTools(context, reasoningEffort),
	patch_timeline: {
		type: "frontend",
		description: "Atomically edit the current timeline when the user asks for a change. Use stable item IDs and preserve IDs when replacing complete items. Express timing changes by replacing the item; express reordering or reparenting by replacing the affected containers. The baseRevision must equal the current timelineRevision.",
		execute: context.assistant.patchTimeline,
		parameters: timelinePatchParameters,
		renderText: {
			running: () => activity("Applying timeline changes", "running"),
			complete: ({result}: {result?: TimelinePatchResult}) =>
				result?.success
					? null
					: activity(
						result ? `Timeline unchanged: ${result.error}` : "Timeline change failed",
						"failed",
					),
		},
	},
})

