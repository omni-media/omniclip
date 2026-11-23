
import {useEffect, useState} from "react"
import {ArrowDownIcon} from "lucide-react"
import {AssistantRuntimeProvider, AuiIf, ThreadPrimitive} from "@assistant-ui/react"

import {useChatPanel} from "./parts/panel.js"
import {useCloudAccess} from "./parts/access.js"
import {ChatHeader} from "./renderers/header.js"
import {ThreadSidebar} from "./renderers/threads.js"
import {ChatComposer} from "./renderers/composer.js"
import {StarterPrompts} from "./renderers/starter.js"
import {useProjectHeartbeat} from "./parts/heartbeat.js"
import {MediaSplitter} from "./toolkit/video/splitter.js"
import {settingsModal} from "../../modals/settings/modal.js"
import {ChatCreditsContext} from "./renderers/message-actions.js"
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
	const [reasoningEffort, setReasoningEffort] = useState<ReasoningEffort>("xhigh")
	const {runtime, config} = useProjectChatRuntime(context, reasoningEffort)
	const {auth, signedIn, balance, billingError} = useCloudAccess(runtime)
	const hasCredits = !!balance && balance.monthly + balance.purchased > 0

	useProjectHeartbeat(context.strata.projectId, signedIn)
	useEffect(() => {
		if (!signedIn) runtime.thread.cancelRun()
	}, [signedIn, runtime])
	useEffect(() => {MediaSplitter.clearTemporaryMedia()}, [])

	const composer = balance && <ChatComposer
		context={context}
		effort={reasoningEffort}
		onEffortChange={setReasoningEffort}
		status={balance}
	/>
	const suggestions = <StarterPrompts disabled={!hasCredits} />

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
						{fullscreen && suggestions}
						{fullscreen && composer}
					</div>
				</AuiIf>

				<ChatCreditsContext.Provider value={hasCredits}>
					<ThreadPrimitive.Messages components={{UserMessage, AssistantMessage}} />
				</ChatCreditsContext.Provider>
				<ThreadPrimitive.ScrollToBottom className="scroll-to-latest" aria-label="Scroll to latest message">
					<ArrowDownIcon /> Latest messages
				</ThreadPrimitive.ScrollToBottom>
			</ThreadPrimitive.Viewport>
		</ThreadPrimitive.Root>

		<AuiIf condition={state => !fullscreen || !state.thread.isEmpty}>
			<div className="composer-shell">
				{!fullscreen && <AuiIf condition={state => state.thread.isEmpty}>{suggestions}</AuiIf>}
				{composer}
			</div>
		</AuiIf>
	</>

	const accessTitle = () => {
		if (!signedIn)
			return auth.isPending ? "Checking your session…" : "Sign in to use cloud AI"
		if (billingError)
			return "Could not load your subscription"
		return balance ? "Subscribe to use cloud AI" : "Checking your subscription…"
	}

	const accessNotice = <div className="cloud-sign-in">
		<strong>{accessTitle()}</strong>
		<p>Or connect your own AI agent through{" "}
			<button type="button" className="mcp-link" onClick={openMcpSettings}>local MCP</button>.</p>
		{(signedIn || !auth.isPending) && <a href="#/account">{signedIn ? "Open account" : "Sign in"}</a>}
	</div>

	return <AssistantRuntimeProvider runtime={runtime} config={config}>
		<AssistantEditorProvider context={context}>
			<aside
				ref={panelRef}
				className="assistant-panel"
				data-fullscreen={fullscreen || undefined}
				data-signed-in={signedIn || undefined}
				data-minimized={minimized || undefined}>
				{signedIn && fullscreen && <ThreadSidebar />}

				<div className="chat-view">
					<ChatHeader panel={panel} />

					{signedIn && balance?.active ? renderThread() : accessNotice}
				</div>
			</aside>
		</AssistantEditorProvider>
	</AssistantRuntimeProvider>
}

