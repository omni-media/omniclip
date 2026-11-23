
import {editorTools} from "@omnimedia/omniso/assistant/tools"
import {defineToolkit, type Toolkit} from "@assistant-ui/react"
import type {SkillCall} from "@omnimedia/omniso/assistant/schema"
import type {TimelinePatchResult} from "@omnimedia/omniso/timeline"
import type {ProjectSettingsUpdate} from "@omnimedia/omniso/settings"
import type {AssistantContext} from "@omnimedia/omniso/assistant/types"

import {chooseOption} from "./choice.js"
import {mediaToolkit} from "./video/tool.js"
import {ReasoningEffort} from "../parts/runtime.js"
import {ensureMedia} from "./video/ensure-media.js"
import {activity, resultActivity} from "./activity.js"
import type {EditorContext} from "../../../../../context/context.js"

export const createAssistantToolkit = (
	context: EditorContext,
	reasoningEffort: ReasoningEffort,
): Toolkit => defineToolkit({
	choose_option: chooseOption,
	read_project_context: {
		...editorTools.read_project_context,
		type: "frontend",
		description: `${editorTools.read_project_context.description} A mentioned library file may be available even if it is not in this media list. Use probe_media with its mentioned media ID.`,
		execute: () => context.getAssistantContext(),
		renderText: {
			running: () => activity("Reading project context", "running"),
			complete: ({result}: {result?: AssistantContext}) =>
				resultActivity(result, "Read project context", "Could not read project context"),
		},
	},
	web_search: {
		type: "backend",
		renderText: {
			running: () => activity("Searching the web…", "running"),
			complete: ({result}: {result?: string}) =>
				resultActivity(result, "Searched the web", "Web search failed"),
		},
	},
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
	...mediaToolkit(context, reasoningEffort),
	patch_timeline: {
		...editorTools.patch_timeline,
		type: "frontend",
		execute: async patch => {
			try {
				if (patch.baseRevision === context.assistant.revision)
					await ensureMedia(context, patch)
			}
			catch (error) {
				return {success: false as const, error: error instanceof Error ? error.message : String(error)}
			}
			return context.assistant.patchTimeline(patch)
		},
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

