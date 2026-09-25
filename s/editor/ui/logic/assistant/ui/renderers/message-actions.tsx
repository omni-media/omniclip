
import {ActionBarPrimitive, AuiIf, useMessageTiming} from "@assistant-ui/react"
import {CheckIcon, CopyIcon, RefreshCwIcon, Volume2Icon, VolumeXIcon} from "lucide-react"

const seconds = (milliseconds: number | undefined) =>
	milliseconds === undefined ? "—" : `${(milliseconds / 1000).toFixed(2)}s`

const MessageTiming = () => {
	const timing = useMessageTiming()
	if (timing?.totalStreamTime === undefined)
		return null

	const title = [
		`First token: ${seconds(timing.firstTokenTime)}`,
		`Total: ${seconds(timing.totalStreamTime)}`,
		`Speed: ${timing.tokensPerSecond?.toFixed(1) ?? "—"} tok/s`,
		`Chunks: ${timing.totalChunks}`,
	].join("\n")

	return <span className="message-timing" title={title}>{seconds(timing.totalStreamTime)}</span>
}

export const MessageActions = () => <ActionBarPrimitive.Root className="message-actions" hideWhenRunning autohide="not-last">
	<ActionBarPrimitive.Copy title="Copy response">
		<AuiIf condition={state => state.message.isCopied}><CheckIcon /></AuiIf>
		<AuiIf condition={state => !state.message.isCopied}><CopyIcon /></AuiIf>
	</ActionBarPrimitive.Copy>

	<ActionBarPrimitive.Speak title="Read aloud"><Volume2Icon /></ActionBarPrimitive.Speak>
	<ActionBarPrimitive.StopSpeaking title="Stop reading"><VolumeXIcon /></ActionBarPrimitive.StopSpeaking>

	<ActionBarPrimitive.Reload title="Regenerate"><RefreshCwIcon /></ActionBarPrimitive.Reload>
	<MessageTiming />
</ActionBarPrimitive.Root>

