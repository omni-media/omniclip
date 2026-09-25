
import type {ReactNode} from "react"
import {ChevronRightIcon} from "lucide-react"
import {ErrorPrimitive, groupPartByType, MessagePrimitive, MessagePartPrimitive} from "@assistant-ui/react"

import {ToolGroup} from "./tool-group.js"
import {MessageActions} from "./message-actions.js"

export const UserMessage = () => <MessagePrimitive.Root className="message user">
	<MessagePrimitive.Parts />
</MessagePrimitive.Root>

const ThoughtGroup = ({active, children}: {active: boolean; children: ReactNode}) =>
	<details className="thought-group" open={active}>
		<summary>
			{active ? <span className="thinking-shimmer">Thinking</span> : "Thinking"}
			<ChevronRightIcon />
		</summary>
		<div className="thought-content">{children}</div>
	</details>

const groupBy = groupPartByType({
	reasoning: ["group-thought", "group-reasoning"],
	"tool-call": ["group-thought", "group-tool"],
})

export const AssistantMessage = () => <MessagePrimitive.Root className="message assistant">
	<MessagePrimitive.GroupedParts groupBy={groupBy}>
		{({part, children}) => {
			switch (part.type) {
				case "group-thought":
					return <div className="thought">{children}</div>
				case "group-reasoning":
					return <ThoughtGroup active={part.status.type === "running"}>{children}</ThoughtGroup>
				case "group-tool":
					return <ToolGroup failed={part.counts.incomplete > 0} indices={part.indices}>{children}</ToolGroup>
				case "text":
					return <MessagePartPrimitive.Text />
				case "indicator":
					return <div className="thinking-indicator"><span className="thinking-shimmer">Thinking</span></div>
				case "tool-call":
					return part.toolUI ?? null
				default:
					return null
			}
		}}
	</MessagePrimitive.GroupedParts>
	<MessagePrimitive.Error>
		<ErrorPrimitive.Root className="error">
			The assistant could not answer: <ErrorPrimitive.Message />
		</ErrorPrimitive.Root>
	</MessagePrimitive.Error>
	<MessageActions />
</MessagePrimitive.Root>

