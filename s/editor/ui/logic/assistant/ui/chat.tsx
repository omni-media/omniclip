
import {useEffect, useMemo, useState} from "react"
import {Settings2Icon} from "lucide-react"
import {
	AssistantRuntimeProvider,
	AuiIf,
	ComposerPrimitive,
	ThreadPrimitive,
	type ChatModelAdapter,
	WebSpeechSynthesisAdapter,
	useLocalRuntime,
} from "@assistant-ui/react"

import {LocalAssistant} from "../local.js"
import {RemoteAssistant} from "../remote.js"
import {ModelSettings} from "./renderers/model-settings.js"
import {ModelSelector} from "./renderers/model-selector.js"
import type {AssistantProgressReport} from "../parts/types.js"
import {AssistantMessage, UserMessage} from "./renderers/messages.js"
import type {AssistantContext, AssistantMessage as Message} from "../../../../../iso/assistant/types.js"
import {assistantModels, defaultAssistantSettings, type AssistantModelId, type AssistantSettings} from "../../models/assistant.js"

export function AssistantChat({getContext, onClose}: {
	getContext: () => AssistantContext
	onClose: () => void
}) {

	const [minimized, setMinimized] = useState(false)
	const [progress, setProgress] = useState<AssistantProgressReport>()
	const local = useMemo(() => new LocalAssistant(setProgress), [])
	const remote = useMemo(() => new RemoteAssistant(), [])
	const [modelId, setModelId] = useState<AssistantModelId>(assistantModels[0].id)
	const [settings, setSettings] = useState<AssistantSettings>(defaultAssistantSettings)
	const model = assistantModels.find(model => model.id === modelId)!

	const close = () => {
		setMinimized(false)
		onClose()
	}

	useEffect(() => () => {local.dispose()}, [local])

	const adapter = useMemo<ChatModelAdapter>(() => ({
		async *run({messages, abortSignal}) {
			const history: Message[] = messages.map(message => ({
				role: message.role,
				content: message.content
					.filter(part => part.type === "text")
					.map(part => part.text)
					.join(""),
			}))
			const input = {messages: history, context: getContext()}

			let answer = ""
			let chunks = 0
			let firstTokenTime: number | undefined
			const streamStartTime = Date.now()

			try {
				if (model.source === "Local")
					await local.prepare(model.id, settings, abortSignal)
				const assistant = model.source === "Local" ? local : remote
				const stream = await assistant.ask(input, abortSignal)

				for await (const token of stream) {
					firstTokenTime ??= Date.now() - streamStartTime
					chunks += 1
					answer += token
					yield {content: [{type: "text", text: answer}]}
				}

				const totalStreamTime = Date.now() - streamStartTime
				const tokenCount = Math.ceil(answer.length / 4)

				yield {
					content: [{type: "text", text: answer}],
					metadata: {timing: {
						streamStartTime,
						firstTokenTime,
						totalStreamTime,
						tokenCount,
						tokensPerSecond: totalStreamTime && tokenCount
							? tokenCount / (totalStreamTime / 1000)
							: undefined,
						totalChunks: chunks,
						toolCallCount: 0,
					}},
				}
			}
			finally {
				setProgress(undefined)
			}
		},
	}), [getContext, local, model, remote, settings])

	const speech = useMemo(() => new WebSpeechSynthesisAdapter(), [])
	const runtime = useLocalRuntime(adapter, {
		adapters: {speech},
	})

	return <AssistantRuntimeProvider runtime={runtime}>
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
					{progress && <small>
						{progress.text} {Math.round(progress.progress * 100)}%
					</small>}

					<ComposerPrimitive.Input autoFocus placeholder="Send a message…" />

					<div className="model-controls">
						<ModelSelector value={modelId} onChange={id => {
							setModelId(id)
							setSettings(defaultAssistantSettings)
						}} />

						{model.source === "Local" && <button className="settings-trigger" id="assistant-settings" type="button"
							title="Advanced model settings">
							<Settings2Icon />
						</button>}
					</div>

					<AuiIf condition={state => !state.thread.isRunning}>
						<ComposerPrimitive.Send className="send" title="Send">↑</ComposerPrimitive.Send>
					</AuiIf>

					<AuiIf condition={state => state.thread.isRunning}>
						<ComposerPrimitive.Cancel className="send" title="Stop">■</ComposerPrimitive.Cancel>
					</AuiIf>
				</ComposerPrimitive.Root>

				{model.source === "Local" && <ModelSettings
					assistant={local}
					key={modelId}
					modelId={model.id}
					settings={settings}
					onChange={setSettings} />}
			</div>
		</aside>
	</AssistantRuntimeProvider>
}

