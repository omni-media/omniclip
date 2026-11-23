
import * as z from "zod"
import {editorTools as sharedEditorTools} from "@omnimedia/omniso/assistant/tools"

const itemInput = z.strictObject({
	itemId: z.string().describe("An existing media item ID from read_project_context."),
})

export const editorTools = [
	...Object.entries(sharedEditorTools).map(([name, {description, parameters}]) => ({name, description, inputSchema: parameters})),
	{name: "provide_media", description: "Copy an item's original source to a temporary local file for video inspection. No trims/effects are baked in. Identical sources reuse one file.", inputSchema: itemInput},
	{name: "audio_analyze", description: "Analyze speech, music, or sounds in an item's original source through Omniclip's cloud service. Sends audio only, defaults to the item's trim, and requires the signed-in user's active subscription and AI credits. start/end and returned part offsets are source seconds; analysis timestamps are part-local.", inputSchema: itemInput.extend({
		prompt: z.string().min(1),
		start: z.number().min(0).optional().describe("Original source start in seconds, overriding the item's trim."),
		end: z.number().positive().optional().describe("Original source end in seconds, overriding the item's trim."),
	})},
] as const
