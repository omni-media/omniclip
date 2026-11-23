
import {reactBindings} from "@e280/strata"
import {useAuiState} from "@assistant-ui/react"
import {CheckIcon, Undo2Icon} from "lucide-react"
import {createContext, useContext, useEffect, useState, type ReactNode} from "react"

import {
	isHiddenSuccessfulTool,
	toolStatus,
	type ToolOutcome,
	type ToolState,
} from "../toolkit/tool-state.js"
import {useUploadProgress} from "../toolkit/video/progress.js"
import {RunActivity} from "../components/elements/run-activity.js"
import type {EditorContext} from "../../../../../context/context.js"

const AssistantEditor = createContext<EditorContext | undefined>(undefined)
const {useTracked} = reactBindings({useEffect, useState})

function summarizeTools(tools: readonly ToolState[]) {
	const outcomes = tools.map(tool => toolStatus(tool).outcome)
	let outcome: ToolOutcome = "complete"
	if (outcomes.includes("incomplete")) outcome = "incomplete"
	if (outcomes.includes("cancelled")) outcome = "cancelled"
	if (outcomes.includes("failed")) outcome = "failed"

	const stepCount = tools.filter((tool, index) =>
		outcomes[index] !== "complete" || !isHiddenSuccessfulTool(tool)
	).length
	return {outcome, stepCount}
}

export const AssistantEditorProvider = ({context, children}: {
	context: EditorContext
	children: ReactNode
}) =>
	<AssistantEditor.Provider value={context}>{children}</AssistantEditor.Provider>

const TimelineEdit = ({indices}: {
	indices: readonly number[]
}) => {
	const context = useContext(AssistantEditor)!

	const [undone, setUndone] = useState(false)
	const [complete, setComplete] = useState(false)

	const turnRunning = useAuiState(state => state.message.isLast && state.thread.isRunning)

	const assistantEditId = useAuiState(state => {
		for (const index of indices.toReversed()) {
			const part = state.message.parts[index]
			if (part?.type !== "tool-call") continue
			const result = part.result as {assistantEditId?: string} | undefined
			if (result?.assistantEditId) return result.assistantEditId
		}
		return undefined
	})

	useEffect(() => {
		if (assistantEditId && !turnRunning) {
			context.assistant.finish(assistantEditId)
			setComplete(true)
		}
	}, [assistantEditId, context, turnRunning])

	useTracked(() => context.assistant.revision)
	if (!assistantEditId || turnRunning) return null

	const canUndo = complete && !undone && context.assistant.canUndo(assistantEditId)
	const undo = async () => {
		if (await context.assistant.undo(assistantEditId))
			setUndone(true)
	}

	return <div className="timeline-update">
		<span>Timeline updated</span><CheckIcon aria-hidden="true" />
		{canUndo && <button className="undo-changes" type="button" onClick={undo}>
			<Undo2Icon />Undo changes
		</button>}
	</div>
}

export const ToolGroup = ({indices, children}: {
	indices: readonly number[]
	children: ReactNode
}) => {
	const parts = useAuiState(({message}) => message.parts)
	const [open, setOpen] = useState(false)
	const turnRunning = useAuiState(({message, thread}) => message.isLast && thread.isRunning)

	const tools = indices.map(index => parts[index]).filter(part => part?.type === "tool-call")
	const {outcome, stepCount} = summarizeTools(tools)

	const lastTool = tools.at(-1)!
	const failed = outcome === "failed"
	const active = turnRunning && indices.at(-1) === parts.length - 1
	const fallbackLabel = lastTool.toolName === "web_search" ? "Searching the web…" : "Working…"
	const label = useUploadProgress(lastTool.toolCallId, fallbackLabel)

	useEffect(() => {
		if (failed) setOpen(true)
	}, [failed])

	const status = active ? "running" : outcome === "failed" ? "error" : outcome
	const statusLabel = ({
		running: label,
		error: "Some steps failed",
		cancelled: "Stopped",
		incomplete: "Some steps incomplete",
		complete: `Completed · ${stepCount} ${stepCount === 1 ? "step" : "steps"}`,
	})[status]
	const showActivity = stepCount > 0 || active

	return <div className="tool-activity">
		{showActivity && <div
			className="tool-group assistant-ui-elements"
			data-running={active || undefined}
			data-failed={failed || undefined}>
			<RunActivity
				status={status}
				statusLabel={statusLabel}
				entries={stepCount ? [{id: "tools", kind: "tool", label: "", content: children}] : []}
				open={open}
				onOpenChange={setOpen} />
		</div>}
		<TimelineEdit indices={indices} />
	</div>
}

