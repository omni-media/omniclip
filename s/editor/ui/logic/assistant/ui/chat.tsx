
import {useState} from "react"
import {AssistantRuntimeProvider, AuiIf, ThreadPrimitive} from "@assistant-ui/react"

import {starterPrompts} from "./parts/starter.js"
import {ChatHeader} from "./parts/header.js"
import {ChatComposer} from "./parts/composer.js"
import {useChatPanel} from "./parts/panel.js"
import {ThreadSidebar} from "./parts/threads.js"
import {AssistantEditorProvider} from "./renderers/tool-group.js"
import type {EditorContext} from "../../../../context/context.js"
import {AssistantMessage, UserMessage} from "./renderers/messages.js"
import {useProjectChatRuntime, type ReasoningEffort} from "./parts/runtime.js"

export function AssistantChat({context, onClose}: {
	context: EditorContext
	onClose: () => void
}) {
	const panel = useChatPanel(onClose)
	const {panelRef, minimized, fullscreen} = panel
	const [threadSearch, setThreadSearch] = useState("")
	const [reasoningEffort, setReasoningEffort] = useState<ReasoningEffort>("xhigh")
	const {runtime, config} = useProjectChatRuntime(context, reasoningEffort)

	const composer = <ChatComposer
		effort={reasoningEffort}
		onEffortChange={setReasoningEffort}
	/>

	return <AssistantRuntimeProvider runtime={runtime} config={config}>
		<AssistantEditorProvider context={context}>
			<aside
				ref={panelRef}
				className="assistant-panel"
				data-fullscreen={fullscreen || undefined}
				data-minimized={minimized || undefined}>
				{fullscreen && <ThreadSidebar
					search={threadSearch}
					onSearchChange={setThreadSearch}
				/>}

				<div className="chat-view">
					<ChatHeader panel={panel} />

					<ThreadPrimitive.Root className="thread">
						<ThreadPrimitive.Viewport
							className="messages"
							turnAnchor="top">
							<AuiIf condition={state => state.thread.isEmpty}>
								<div className={fullscreen ? "welcome welcome-fullscreen" : "welcome"}>
									<strong>How can I help you today?</strong>
									{!fullscreen && <span>Ask about Omniclip and video editing.</span>}
									{fullscreen && composer}
									{fullscreen && <div className="starter-prompts">
										{starterPrompts.map(({title, prompt}) =>
											<ThreadPrimitive.Suggestion
												key={title}
												className="starter-prompt"
												prompt={prompt}
												send>
												{title}
											</ThreadPrimitive.Suggestion>,
										)}
									</div>}
								</div>
							</AuiIf>

							<ThreadPrimitive.Messages components={{UserMessage, AssistantMessage}} />
						</ThreadPrimitive.Viewport>
					</ThreadPrimitive.Root>

					<AuiIf condition={state => !fullscreen || !state.thread.isEmpty}>
						{composer}
					</AuiIf>
				</div>
			</aside>
		</AssistantEditorProvider>
	</AssistantRuntimeProvider>
}

