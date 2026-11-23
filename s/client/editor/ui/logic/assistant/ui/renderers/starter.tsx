
import {ThreadPrimitive} from "@assistant-ui/react"

const starterPrompts = [
	{
		title: "Add captions",
		prompt: "Create readable captions for the dialogue in this sequence.",
	},
	{
		title: "Add a title card",
		prompt: "Create a title card that fits the style of this video.",
	},
	{
		title: "Polish this edit",
		prompt: "Review this edit and suggest three high-impact improvements before changing anything.",
	},
	{
		title: "Improve the pacing",
		prompt: "Review this sequence and suggest ways to improve its pacing.",
	},
	{
		title: "Create a lower third",
		prompt: "Create a polished lower third for the main subject in this sequence.",
	},
	{
		title: "Find standout moments",
		prompt: "Find the strongest moments in this sequence and explain why they work.",
	},
]

const rows = [starterPrompts.slice(0, 3), starterPrompts.slice(3)]

export function StarterPrompts({disabled}: {disabled: boolean}) {
	return <div className="starter-prompts">
		{rows.map(row =>
			<div className="starter-prompt-row" key={row[0].title}>
				{row.map(({title, prompt}) =>
					<ThreadPrimitive.Suggestion
						key={title}
						className="starter-prompt"
						prompt={prompt}
						disabled={disabled}
						send>
						{title}
					</ThreadPrimitive.Suggestion>,
				)}
			</div>,
		)}
	</div>
}

