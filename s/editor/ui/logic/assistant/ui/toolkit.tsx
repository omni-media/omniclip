import {defineToolkit} from "@assistant-ui/react"

type SkillCall = {skill: string; path: string}

export const assistantToolkit = defineToolkit({
	read_skill: {
		type: "backend",
		renderText: {
			running: ({args}: {args: SkillCall}) =>
				<div>Reading {args.skill}/{args.path}</div>,
			complete: ({args}: {args: SkillCall}) =>
				<div>Read {args.skill}/{args.path}</div>,
		},
	},
})
