
import * as z from "zod"
import {tool, type ToolSet} from "ai"

import {readSkill, skillNames} from "./skills.js"
import {skillCallParameters} from "../iso/assistant/schema.js"

export const assistantTools: ToolSet = {
	read_skill: tool({
		description: "Read SKILL.md or one referenced file from an available skill.",
		inputSchema: skillCallParameters.extend({
			skill: z.enum(skillNames),
		}),
		execute: ({skill, path}) => readSkill(skill, path),
	}),
}
