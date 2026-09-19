import {defineToolkit} from "@assistant-ui/react"

import type {EditorContext} from "../../../../context/context.js"
import type {TimelinePatchResult} from "../../../../../iso/timeline.js"

type SkillCall = {skill: string; path: string}
type ItemIdResult = {id: string}

const id = {type: "string" as const, pattern: "^[0-9a-f]{32}$"}

export const createAssistantToolkit = (context: EditorContext) => defineToolkit({
	read_skill: {
		type: "backend",
		renderText: {
			running: ({args}: {args: SkillCall}) =>
				<div>Reading {args.skill}/{args.path}</div>,
			complete: ({args}: {args: SkillCall}) =>
				<div>Read {args.skill}/{args.path}</div>,
		},
	},
	create_item_id: {
		type: "frontend",
		description: "Create one opaque ID for a new timeline item. Call this before adding, duplicating, or splitting an item; never invent item IDs.",
		execute: () => ({id: context.omni.getId()}),
		parameters: {
			type: "object",
			properties: {},
			additionalProperties: false,
		},
		renderText: {
			running: () => <div>Creating an item ID</div>,
			complete: ({result}: {result?: ItemIdResult}) =>
				<div>{result ? "Created an item ID" : "Could not create an item ID"}</div>,
		},
	},
	patch_timeline: {
		type: "frontend",
		description: "Atomically edit the current timeline when the user asks for a change. Use stable item IDs and preserve IDs when replacing complete items. Express timing changes by replacing the item; express reordering or reparenting by replacing the affected containers. The baseRevision must equal the current timelineRevision.",
		execute: context.patchTimeline,
		parameters: {
			type: "object",
			properties: {
				baseRevision: {type: "integer"},
				operations: {
					type: "array",
					minItems: 1,
					items: {
						type: "object",
						properties: {
							op: {enum: ["add", "replace", "remove", "set_root", "set_audio"]},
							itemId: {...id, description: "Required by replace, remove, and set_root."},
							item: {
								type: "object",
								properties: {id, kind: {type: "integer"}},
								required: ["id", "kind"],
								additionalProperties: true,
							},
							audio: {
								description: "Audio settings required by set_audio; null removes them.",
								anyOf: [
									{type: "null"},
									{
										type: "object",
										properties: {gain: {type: "number"}, enabled: {type: "boolean"}},
										additionalProperties: false,
									},
								],
							},
						},
						required: ["op"],
						additionalProperties: false,
					},
				},
			},
			required: ["baseRevision", "operations"],
			additionalProperties: false,
		},
		renderText: {
			running: () => <div>Applying timeline changes</div>,
			complete: ({result}: {result?: TimelinePatchResult}) => <div>
				{!result
					? "Timeline change failed"
					: result.success ? result.summary : `Timeline unchanged: ${result.error}`}
			</div>,
		},
	},
})

