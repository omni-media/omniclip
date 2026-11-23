
import {useContext, type ReactNode} from "react"
import {useActionBarReload, useMessageError} from "@assistant-ui/core/react"
import {defaultDirectiveFormatter, groupPartByType, MessagePrimitive, useAuiState} from "@assistant-ui/react"

import {ToolPart} from "./tool-part.js"
import {ToolGroup} from "./tool-group.js"
import {AssistantMarkdown} from "./markdown.js"
import {mentionFormatter} from "../parts/mention-format.js"
import {ErrorState} from "../components/elements/error-state.js"
import {ChatCreditsContext, MessageActions} from "./message-actions.js"
import {ThinkingIndicator} from "../components/elements/thinking-indicator.js"
import {ReasoningRoot, ReasoningTrigger, ReasoningContent, ReasoningText} from "../components/elements/reasoning.js"

const UserText = () => {
	const text = useAuiState(state => state.part.type === "text" ? state.part.text : "")
	const content = mentionFormatter.parse(text).map((part, index) => {
		if (part.kind === "text") return part.text
		if (part.kind === "mention" && (part.type === "timeline" || part.type === "media"))
			return <span key={index} className="mention-chip">@{part.label}</span>
		return defaultDirectiveFormatter.serialize(part)
	})
	return <p>{content}</p>
}

export const UserMessage = () => (
	<MessagePrimitive.Root className="message user">
		<MessagePrimitive.Parts components={{Text: UserText}} />
	</MessagePrimitive.Root>
)

const ThoughtGroup = ({active, children}: {active: boolean; children: ReactNode}) => (
	<div className="assistant-ui-elements">
		<ReasoningRoot variant="ghost" streaming={active}>
			<ReasoningTrigger active={active} />
			<ReasoningContent>
				<ReasoningText>{children}</ReasoningText>
			</ReasoningContent>
		</ReasoningRoot>
	</div>
)

const groupBy = groupPartByType({
	reasoning: ["group-thought", "group-reasoning"],
	"tool-call": ["group-thought", "group-tool"],
	"standalone-tool-call": [],
})

const MessageError = () => {
	const error = useMessageError()
	const {reload, disabled} = useActionBarReload()
	const hasCredits = useContext(ChatCreditsContext)
	return (
		<MessagePrimitive.Error>
			<div className="assistant-ui-elements">
				<ErrorState
					title="The assistant could not answer"
					detail={String(error ?? "An error occurred")}
					retrying={false}
					onRetry={reload}
					retryDisabled={disabled || !hasCredits}
				/>
			</div>
		</MessagePrimitive.Error>
	)
}

export const AssistantMessage = () => (
	<MessagePrimitive.Root className="message assistant">
		<MessagePrimitive.GroupedParts groupBy={groupBy}>
			{({part, children}) => {
				switch (part.type) {
					case "group-thought":
						return <div className="thought">{children}</div>
					case "group-reasoning":
						return <ThoughtGroup active={part.status.type === "running"}>{children}</ThoughtGroup>
					case "group-tool":
						return <ToolGroup indices={part.indices}>{children}</ToolGroup>
					case "text":
						return <AssistantMarkdown />
					case "reasoning":
						return <span style={{whiteSpace: "pre-wrap"}}>{part.text}</span>
					case "indicator":
						return (
							<div className="assistant-ui-elements">
								<ThinkingIndicator className="thinking-indicator" label="Thinking" />
							</div>
						)
					case "tool-call":
						return <ToolPart part={part} />
					default:
						return null
				}
			}}
		</MessagePrimitive.GroupedParts>
		<MessageError />
		<MessageActions />
	</MessagePrimitive.Root>
)

