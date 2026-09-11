
import {useId} from "react"
import {
	CheckIcon,
	CopyIcon,
	RefreshCwIcon,
	Volume2Icon,
	VolumeXIcon,
} from "lucide-react"
import WaTooltip from "@awesome.me/webawesome/dist/react/tooltip/index.js"
import {
	ActionBarPrimitive,
	AuiIf,
	ErrorPrimitive,
	MessagePrimitive,
	useMessageTiming,
} from "@assistant-ui/react"

export const UserMessage = () => <MessagePrimitive.Root className="message user">
	<MessagePrimitive.Content />
</MessagePrimitive.Root>

const seconds = (milliseconds: number | undefined) =>
	milliseconds === undefined ? "—" : `${(milliseconds / 1000).toFixed(2)}s`

const MessageTiming = () => {
	const id = useId()
	const timing = useMessageTiming()
	return timing?.totalStreamTime !== undefined
		? <>
			<span className="message-timing" id={id} tabIndex={0}>
				{seconds(timing.totalStreamTime)}
			</span>
			<WaTooltip
				className="timing-tooltip"
				for={id}
				placement="bottom"
				distance={6}
				withoutArrow>
				<span className="timing-grid">
					<span>First token</span><strong>{seconds(timing.firstTokenTime)}</strong>
					<span>Total</span><strong>{seconds(timing.totalStreamTime)}</strong>
					<span>Speed</span><strong>{timing.tokensPerSecond?.toFixed(1) ?? "—"} tok/s</strong>
					<span>Chunks</span><strong>{timing.totalChunks}</strong>
				</span>
			</WaTooltip>
		</>
		: null
}

export const AssistantMessage = () => <MessagePrimitive.Root className="message assistant">
	<MessagePrimitive.Content />
	<MessagePrimitive.Error>
		<ErrorPrimitive.Root className="error">
			The assistant could not answer: <ErrorPrimitive.Message />
		</ErrorPrimitive.Root>
	</MessagePrimitive.Error>

	<ActionBarPrimitive.Root className="message-actions" hideWhenRunning autohide="not-last">
		<ActionBarPrimitive.Copy title="Copy response">
			<AuiIf condition={state => state.message.isCopied}><CheckIcon /></AuiIf>
			<AuiIf condition={state => !state.message.isCopied}><CopyIcon /></AuiIf>
		</ActionBarPrimitive.Copy>

		<ActionBarPrimitive.Speak title="Read aloud"><Volume2Icon /></ActionBarPrimitive.Speak>
		<ActionBarPrimitive.StopSpeaking title="Stop reading"><VolumeXIcon /></ActionBarPrimitive.StopSpeaking>

		<ActionBarPrimitive.Reload title="Regenerate"><RefreshCwIcon /></ActionBarPrimitive.Reload>
		<MessageTiming />
	</ActionBarPrimitive.Root>
</MessagePrimitive.Root>

