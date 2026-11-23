
import * as z from "zod"
import {useAuiState, useToolArgsStatus, type ToolCallMessagePartProps} from "@assistant-ui/react"

import {OptionList} from "../components/elements/option-list.js"

const parameters = z.strictObject({
	question: z.string(),
	options: z.array(z.string()).min(2).max(4),
	descriptions: z.array(z.string()).optional(),
})

type Choice = z.infer<typeof parameters>
type Answer = {answer: string}

export const chooseOption = {
	type: "human" as const,
	description: "When you need the user to decide how to proceed and can offer a few clear options, use this tool to ask. Give each option a short label and a matching short description explaining its effect. For example, offer cropping to fill the canvas or fitting the whole video with empty space. Do not ask if the user's preference is already clear.",
	parameters,
	render: function ChoiceTool({args, result, addResult}: ToolCallMessagePartProps<Choice, Answer>) {
		const {argsStatus} = useToolArgsStatus<Choice>()
		const canAnswer = useAuiState(state => state.thread.capabilities.answerToolCall)
		const {question, options = [], descriptions} = args
		const choices = options.map((label, index) => ({
			id: label,
			label,
			description: descriptions?.[index],
		}))

		return <div className="assistant-choice assistant-ui-elements">
			<div>{question}</div>
			<OptionList
				aria-label={question}
				options={choices}
				choice={result ? [result.answer] : undefined}
				onConfirm={argsStatus === "complete" && canAnswer ? ([answer]) => addResult({answer}) : undefined}
			/>
		</div>
	},
}

