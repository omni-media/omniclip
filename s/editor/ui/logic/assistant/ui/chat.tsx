
import {useMemo, useState} from "react"
import {
	AssistantRuntimeProvider,
	AuiConfig,
	AuiIf,
	ComposerPrimitive,
	ThreadPrimitive,
	Tools,
	WebSpeechSynthesisAdapter,
} from "@assistant-ui/react"
import {lastAssistantMessageIsCompleteWithToolCalls} from "ai"
import {AssistantChatTransport, useChatRuntime} from "@assistant-ui/ai-sdk"
import WaDropdown from "@awesome.me/webawesome/dist/react/dropdown/index.js"
import WaDropdownItem from "@awesome.me/webawesome/dist/react/dropdown-item/index.js"

import {createAssistantToolkit} from "./toolkit/toolkit.js"
import {AssistantEditorProvider} from "./renderers/tool-group.js"
import type {EditorContext} from "../../../../context/context.js"
import {AssistantMessage, UserMessage} from "./renderers/messages.js"

export function AssistantChat({context, onClose}: {
	context: EditorContext
	onClose: () => void
}) {

	const [minimized, setMinimized] = useState(false)
	const [reasoningEffort, setReasoningEffort] = useState<"none" | "low" | "medium" | "xhigh">("xhigh")

	const close = () => {
		setMinimized(false)
		onClose()
	}

	const transport = useMemo(() => new AssistantChatTransport({
		api: "/api/assistant",
		body: () => ({context: context.getAssistantContext(), reasoningEffort}),
	}), [context, reasoningEffort])
	const speech = useMemo(() => new WebSpeechSynthesisAdapter(), [])
	const config = useMemo(
		() => AuiConfig({tools: Tools({toolkit: createAssistantToolkit(context, reasoningEffort)})}),
		[context, reasoningEffort],
	)
	const runtime = useChatRuntime({
		transport,
		adapters: {speech},
		sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
	})

	return <AssistantRuntimeProvider runtime={runtime} config={config}>
		<AssistantEditorProvider context={context}>
		<aside className="assistant-panel" data-minimized={minimized || undefined}>
			<header>
				<strong><span>✦</span> Omniclip AI</strong>

				<div>
					<button
						type="button"
						title={minimized ? "Restore" : "Minimize"}
						onClick={() => setMinimized(value => !value)}>
						{minimized ? "+" : "−"}
					</button>

					<button type="button" title="Close" onClick={close}>×</button>
				</div>
			</header>

			<ThreadPrimitive.Root className="thread">
				<ThreadPrimitive.Viewport className="messages" turnAnchor="top">
					<AuiIf condition={state => state.thread.isEmpty}>
						<div className="welcome">
							<strong>How can I help you today?</strong>
							<span>Ask about Omniclip and video editing.</span>
						</div>
					</AuiIf>

					<ThreadPrimitive.Messages components={{
						UserMessage,
						AssistantMessage,
					}} />
				</ThreadPrimitive.Viewport>
			</ThreadPrimitive.Root>

			<div className="composer-area">
				<ComposerPrimitive.Root>
					<ComposerPrimitive.Input autoFocus placeholder="Send a message…" />
					<WaDropdown
						className="thinking-effort"
						onWaSelect={event => setReasoningEffort(
							(event.detail.item as HTMLElementTagNameMap["wa-dropdown-item"]).value as typeof reasoningEffort,
						)}>
						<button slot="trigger" type="button" title="Thinking effort for this turn">
							{({none: "Off", low: "Fast", medium: "Balanced", xhigh: "Deep"})[reasoningEffort]} <span>⌄</span>
						</button>
						{(["none", "low", "medium", "xhigh"] as const).map(value =>
							<WaDropdownItem key={value} value={value}>
								<span className="thinking-check">{reasoningEffort === value ? "✓" : ""}</span>
								{({none: "Off", low: "Fast", medium: "Balanced", xhigh: "Deep"})[value]}
							</WaDropdownItem>,
						)}
					</WaDropdown>

					<AuiIf condition={state => !state.thread.isRunning}>
						<ComposerPrimitive.Send className="send" title="Send">↑</ComposerPrimitive.Send>
					</AuiIf>

					<AuiIf condition={state => state.thread.isRunning}>
						<ComposerPrimitive.Cancel className="send" title="Stop">■</ComposerPrimitive.Cancel>
					</AuiIf>
				</ComposerPrimitive.Root>
			</div>
		</aside>
		</AssistantEditorProvider>
	</AssistantRuntimeProvider>
}

