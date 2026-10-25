
import * as z from "zod"
import {editorTools as sharedEditorTools, emptyParameters} from "@omnimedia/omniso/assistant/tools"

const itemInput = z.strictObject({
	itemId: z.string().describe("An existing media item ID from read_project_context."),
})

export const editorTools = [
	{name: "read_project_context", description: "Read project settings, the current timeline, revision, selection, playhead, item kinds and source metadata. Timing values are milliseconds.", inputSchema: emptyParameters},
	...Object.entries(sharedEditorTools).map(([name, {description, parameters}]) => ({name, description, inputSchema: parameters})),
	{name: "provide_media", description: "Copy an item's original source to a temporary local file for video inspection. No trims/effects are baked in. Identical sources reuse one file.", inputSchema: itemInput},
	{name: "audio_analyze", description: "TODO: Audio analysis is not implemented yet. This placeholder does not upload or analyze audio.", inputSchema: itemInput.extend({
		prompt: z.string().min(1),
		start: z.number().min(0).optional().describe("Original source start in seconds, overriding the item's trim."),
		end: z.number().positive().optional().describe("Original source end in seconds, overriding the item's trim."),
	})},
] as const
