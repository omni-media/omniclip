import {jsonSchema, tool, type ToolSet} from "ai"

import {readSkill, skillNames} from "./skills.js"

type SkillCall = {skill: string; path: string}

export const assistantTools: ToolSet = {
	read_skill: tool({
		description: "Read SKILL.md or one referenced file from an available skill.",
		inputSchema: jsonSchema<SkillCall>({
			type: "object",
			properties: {
				skill: {type: "string", enum: skillNames},
				path: {type: "string", description: "SKILL.md or a linked path relative to it"},
			},
			required: ["skill", "path"],
			additionalProperties: false,
		}),
		execute: ({skill, path}) => readSkill(skill, path),
	}),
}
