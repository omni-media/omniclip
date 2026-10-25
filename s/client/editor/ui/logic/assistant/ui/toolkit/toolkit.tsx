
import {editorTools} from "@omnimedia/omniso/assistant/tools"
import {defineToolkit, type Toolkit} from "@assistant-ui/react"
import type {SkillCall} from "@omnimedia/omniso/assistant/schema"
import type {TimelinePatchResult} from "@omnimedia/omniso/timeline"
import type {ProjectSettingsUpdate} from "@omnimedia/omniso/settings"
import type {AssistantContext} from "@omnimedia/omniso/assistant/types"

import {videoTools} from "./video/tool.js"
import {ReasoningEffort} from "../parts/runtime.js"
import {activity, resultActivity} from "./activity.js"
import type {EditorContext} from "../../../../../context/context.js"

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

