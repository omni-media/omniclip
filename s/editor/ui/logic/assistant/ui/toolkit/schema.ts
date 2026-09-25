
const itemIdSchema = {type: "string" as const, pattern: "^[0-9a-f]{32}$"}

export const timelinePatchParameters = {
	type: "object" as const,
	properties: {
		baseRevision: {type: "integer" as const},
		operations: {
			type: "array" as const,
			minItems: 1,
			items: {
				type: "object" as const,
				properties: {
					op: {enum: ["add", "replace", "remove", "set_root", "set_audio"]},
					itemId: {...itemIdSchema, description: "Required by replace, remove, and set_root."},
					item: {
						type: "object" as const,
						properties: {id: itemIdSchema, kind: {type: "integer" as const}},
						required: ["id", "kind"],
						additionalProperties: true,
					},
					audio: {
						description: "Audio settings required by set_audio; null removes them.",
						anyOf: [
							{type: "null" as const},
							{
								type: "object" as const,
								properties: {gain: {type: "number" as const}, enabled: {type: "boolean" as const}},
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
}

