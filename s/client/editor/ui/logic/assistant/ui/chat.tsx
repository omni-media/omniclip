
import {useEffect, useState} from "react"
import {useStore} from "better-auth/react"
import {AssistantRuntimeProvider, AuiIf, ThreadPrimitive} from "@assistant-ui/react"

import {authClient} from "../../auth.js"
import {useChatPanel} from "./parts/panel.js"
import {ChatHeader} from "./renderers/header.js"
import {starterPrompts} from "./parts/starter.js"
import {ThreadSidebar} from "./renderers/threads.js"
import {ChatComposer} from "./renderers/composer.js"
import {useProjectHeartbeat} from "./parts/heartbeat.js"
import {MediaSplitter} from "./toolkit/video/splitter.js"
import {settingsModal} from "../../modals/settings/modal.js"
import {AssistantEditorProvider} from "./renderers/tool-group.js"
import type {EditorContext} from "../../../../context/context.js"
import {AssistantMessage, UserMessage} from "./renderers/messages.js"
import {useProjectChatRuntime, type ReasoningEffort} from "./parts/runtime.js"

export function AssistantChat({context, onClose}: {
	context: EditorContext
	onClose: () => void
}) {
	const auth = useStore(authClient.useSession)
	const signedIn = !!auth.data

	const panel = useChatPanel(onClose)
	const {panelRef, minimized, fullscreen} = panel
	const [threadSearch, setThreadSearch] = useState("")
	const [reasoningEffort, setReasoningEffort] = useState<ReasoningEffort>("xhigh")
	const {runtime, config} = useProjectChatRuntime(context, reasoningEffort)

	useProjectHeartbeat(context.strata.projectId, signedIn)
	useEffect(() => {
		if (!signedIn) runtime.thread.cancelRun()
	}, [signedIn, runtime])
	useEffect(() => {MediaSplitter.clearTemporaryMedia()}, [])

	const composer = <ChatComposer
		effort={reasoningEffort}
		onEffortChange={setReasoningEffort}
	/>

	const openMcpSettings = async() => {
		const settings = await context.modals.openModal(settingsModal("mcp"))
		if (settings)
			context.strata.settings.mutate(state => Object.assign(state, settings))
	}

	const renderThread = () => <>
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
	</>

	const renderSignIn = () => <div className="cloud-sign-in">
		<strong>{auth.isPending ? "Checking your session…" : "Sign in to use cloud AI"}</strong>
		<p>
			Or connect your own AI agent through{" "}
			<button type="button" className="mcp-link" onClick={openMcpSettings}>local MCP</button>.
		</p>
		{!auth.isPending && <a href="#/account">Sign in</a>}
	</div>

	return <AssistantRuntimeProvider runtime={runtime} config={config}>
		<AssistantEditorProvider context={context}>
			<aside
				ref={panelRef}
				className="assistant-panel"
				data-fullscreen={fullscreen || undefined}
				data-signed-in={signedIn || undefined}
				data-minimized={minimized || undefined}>
				{signedIn && fullscreen && <ThreadSidebar
					search={threadSearch}
					onSearchChange={setThreadSearch}
				/>}

				<div className="chat-view">
					<ChatHeader panel={panel} />

					{signedIn ? renderThread() : renderSignIn()}
				</div>
			</aside>
		</AssistantEditorProvider>
	</AssistantRuntimeProvider>
}

