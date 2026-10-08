import * as z from "zod"

const itemIdSchema = z.string().regex(/^[0-9a-f]{32}$/)

export const skillCallParameters = z.strictObject({
	skill: z.string(),
	path: z.string().describe("SKILL.md or a linked path relative to it"),
})

export type SkillCall = z.infer<typeof skillCallParameters>

export const timelinePatchParameters = z.strictObject({
	baseRevision: z.number().int(),
	operations: z.array(z.strictObject({
		op: z.enum(["add", "replace", "remove", "set_root", "set_audio"]),
		itemId: itemIdSchema.optional().describe("Required by replace, remove, and set_root."),
		item: z.looseObject({id: itemIdSchema, kind: z.number().int()}).optional(),
		audio: z.strictObject({
			gain: z.number().optional(),
			enabled: z.boolean().optional(),
		}).nullable().optional().describe("Audio settings required by set_audio; null removes them."),
	})).min(1),
})
