import * as z from "zod"
import {timelinePatchParameters} from "./schema.js"
import {projectSettingsUpdateParameters} from "../settings.js"

export const emptyParameters = z.strictObject({})

export const editorTools = {
	update_settings: {
		description: "Update project settings when the user requests it. Supply only fields to change; other settings are preserved. When changing canvas format, supply both resolution and its matching aspectRatio. This changes canvas settings, not clip transforms or timing. Returns the updated project context. Settings are saved separately from timeline undo history.",
		parameters: projectSettingsUpdateParameters,
	},
	create_item: {
		description: "Create one opaque ID for a new timeline item. Call this before adding, duplicating, or splitting an item; never invent item IDs.",
		parameters: emptyParameters,
	},
	patch_timeline: {
		description: "Atomically edit the current timeline when the user asks for a change. Use stable item IDs and preserve IDs when replacing complete items. Express timing changes by replacing the item; express reordering or reparenting by replacing the affected containers. Use timelineRevision from the latest supplied project context as baseRevision. After a revision mismatch, rebuild the patch from that context; never guess or increment a revision.",
		parameters: timelinePatchParameters,
	},
}
