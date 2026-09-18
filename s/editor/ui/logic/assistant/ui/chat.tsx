
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

import {assistantToolkit} from "./toolkit.js"
import {AssistantMessage, UserMessage} from "./renderers/messages.js"
import type {AssistantContext} from "../../../../../iso/assistant/types.js"

const assistantConfig = AuiConfig({tools: Tools({toolkit: assistantToolkit})})

export function AssistantChat({getContext, onClose}: {
	getContext: () => AssistantContext
	onClose: () => void
}) {

	const [minimized, setMinimized] = useState(false)

	const close = () => {
		setMinimized(false)
		onClose()
	}

	const transport = useMemo(() => new AssistantChatTransport({
		api: "/api/assistant",
		body: () => ({context: getContext()}),
	}), [getContext])
	const speech = useMemo(() => new WebSpeechSynthesisAdapter(), [])
	const runtime = useChatRuntime({
		transport,
		adapters: {speech},
		sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
	})

	return <AssistantRuntimeProvider runtime={runtime} config={assistantConfig}>
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

					<AuiIf condition={state => !state.thread.isRunning}>
						<ComposerPrimitive.Send className="send" title="Send">↑</ComposerPrimitive.Send>
					</AuiIf>

					<AuiIf condition={state => state.thread.isRunning}>
						<ComposerPrimitive.Cancel className="send" title="Stop">■</ComposerPrimitive.Cancel>
					</AuiIf>
				</ComposerPrimitive.Root>
			</div>
		</aside>
	</AssistantRuntimeProvider>
}

