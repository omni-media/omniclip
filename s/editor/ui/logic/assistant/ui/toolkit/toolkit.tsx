
import {defineToolkit, type Toolkit} from "@assistant-ui/react"

import {videoTools} from "./video/tool.js"
import {ReasoningEffort} from "../parts/runtime.js"
import {activity, resultActivity} from "./activity.js"
import type {EditorContext} from "../../../../../context/context.js"
import {editorTools} from "../../../../../../iso/assistant/tools.js"
import type {TimelinePatchResult} from "../../../../../../iso/timeline.js"

import type {SkillCall} from "../../../../../../iso/assistant/schema.js"
import type {AssistantContext} from "../../../../../../iso/assistant/types.js"
import type {ProjectSettingsUpdate} from "../../../../../../iso/settings.js"

export const createAssistantToolkit = (
	context: EditorContext,
	reasoningEffort: ReasoningEffort,
): Toolkit => defineToolkit({
	update_settings: {
		...editorTools.update_settings,
		type: "frontend",
		execute: (settings: ProjectSettingsUpdate) => {
			context.assistant.updateProjectSettings(settings)
			return context.getAssistantContext()
		},
		renderText: {
			running: () => activity("Updating project settings", "running"),
			complete: ({result}: {result?: AssistantContext}) =>
				resultActivity(result, "Project settings updated", "Could not update project settings"),
		},
	},
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
		execute: () => ({id: context.session.getId()}),
		renderText: {
			running: () => null,
			complete: ({result}: {result?: {id: string}}) =>
				result?.id ? null : activity("Could not prepare an item", "failed"),
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

