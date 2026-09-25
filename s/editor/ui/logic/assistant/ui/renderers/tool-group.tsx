
import {useAuiState} from "@assistant-ui/react"
import {createContext, useContext, useEffect, useState, type ReactNode} from "react"
import {CheckCircle2Icon, ChevronRightIcon, CircleXIcon, Undo2Icon} from "lucide-react"

import type {EditorContext} from "../../../../../context/context.js"

const AssistantEditor = createContext<EditorContext | undefined>(undefined)

export const AssistantEditorProvider = ({context, children}: {
	context: EditorContext
	children: ReactNode
}) =>
	<AssistantEditor.Provider value={context}>{children}</AssistantEditor.Provider>

const TimelineEdit = ({indices, active}: {
	indices: readonly number[]
	active: boolean
}) => {
	const context = useContext(AssistantEditor)!

	const [undone, setUndone] = useState(false)
	const [complete, setComplete] = useState(false)

	const turnRunning = useAuiState(state => state.message.isLast && state.thread.isRunning)

	const assistantEditId = useAuiState(state => {
		for (const index of indices) {
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

	if (!assistantEditId) return null

	const canUndo = complete && !active && !undone && context.assistant.canUndo(assistantEditId)
	const undo = async () => {
		if (await context.assistant.undo(assistantEditId))
			setUndone(true)
	}

	return <div className="tool-step tool-change">
		<span>✓</span><span>Timeline updated</span>
		{canUndo && <button className="undo-changes" type="button" onClick={undo}>
			<Undo2Icon />Undo changes
		</button>}
	</div>
}

const ToolStatus = ({active, failed}: {active: boolean; failed: boolean}) => {
	if (active) return <span className="thinking-shimmer">Working</span>
	if (failed) return <><CircleXIcon className="activity-failed" /><span>Failed</span></>
	return <><CheckCircle2Icon className="activity-done" /><span>Done</span></>
}

export const ToolGroup = ({failed, indices, children}: {
	failed: boolean
	indices: readonly number[]
	children: ReactNode
}) => {
	const active = useAuiState(({message, thread}) =>
		message.isLast && thread.isRunning && message.parts.at(-1)?.type !== "text"
	)

	return <details
		className="tool-group"
		data-running={active || undefined}
		data-failed={failed || undefined}
		open={active || failed}
	>
		<summary>
			<ToolStatus active={active} failed={failed} />
			<ChevronRightIcon />
		</summary>
		<div className="tool-content">
			{children}
			<TimelineEdit indices={indices} active={active} />
		</div>
	</details>
}

