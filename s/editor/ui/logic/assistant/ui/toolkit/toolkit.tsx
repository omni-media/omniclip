
import {defineToolkit, type Toolkit} from "@assistant-ui/react"

import {videoTools} from "./video/tool.js"
import {ReasoningEffort} from "../parts/runtime.js"
import {activity, resultActivity} from "./activity.js"
import type {EditorContext} from "../../../../../context/context.js"
import {editorTools} from "../../../../../../iso/assistant/tools.js"
import type {TimelinePatchResult} from "../../../../../../iso/timeline.js"

import type {SkillCall} from "../../../../../../iso/assistant/schema.js"

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
		...editorTools.create_item,
		type: "frontend",
		execute: () => ({id: context.omni.getId()}),
		renderText: {
			running: () => activity("Preparing a new item", "running"),
			complete: ({result}: {result?: {id: string}}) =>
				resultActivity(result, "New item ready", "Could not prepare an item"),
		},
	},
	...videoTools(context, reasoningEffort),
	patch_timeline: {
		...editorTools.patch_timeline,
		type: "frontend",
		execute: context.assistant.patchTimeline,
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

