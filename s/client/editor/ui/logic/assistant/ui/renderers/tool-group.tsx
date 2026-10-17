
import {useAuiState} from "@assistant-ui/react"
import {createContext, useContext, useEffect, useState, type ReactNode} from "react"
import {CheckCircle2Icon, ChevronRightIcon, CircleXIcon, Undo2Icon} from "lucide-react"

import type {EditorContext} from "../../../../../context/context.js"
import {useUploadProgress} from "../toolkit/video/progress.js"

const AssistantEditor = createContext<EditorContext | undefined>(undefined)

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

	if (!assistantEditId || turnRunning) return null

	const canUndo = complete && !undone && context.assistant.canUndo(assistantEditId)
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

const ToolStatus = ({active, failed, label, count}: {
	active: boolean
	failed: boolean
	label: string
	count: number
}) => {
	if (failed) return <><CircleXIcon className="activity-failed" /><span>Some steps failed</span></>
	if (active) return <span className="thinking-shimmer">{label}</span>
	return <><CheckCircle2Icon className="activity-done" /><span>Completed · {count} {count === 1 ? "step" : "steps"}</span></>
}

export const ToolGroup = ({failed, indices, children}: {
	failed: boolean
	indices: readonly number[]
	children: ReactNode
}) => {
	const parts = useAuiState(({message}) => message.parts)
	const turnRunning = useAuiState(({message, thread}) => message.isLast && thread.isRunning)
	const tools = indices.map(index => parts[index]).filter(part => part?.type === "tool-call")
	const active = turnRunning && indices.includes(parts.length - 1)
	const hasFailed = failed || tools.some(tool => tool.isError || (
		typeof tool.result === "object" && tool.result !== null &&
		"success" in tool.result && tool.result.success === false
	))
	const count = tools.filter(tool => tool.toolName !== "create_item" || tool.isError).length
	const lastTool = tools.at(-1)
	const label = useUploadProgress(lastTool?.toolCallId ?? "", "Working…")

	return <div className="tool-activity">
		{(count > 0 || active || hasFailed) && <details
			className="tool-group"
			data-running={active || undefined}
			data-failed={hasFailed || undefined}
			open={hasFailed}
		>
			<summary>
				<ToolStatus active={active} failed={hasFailed} label={label} count={count} />
				<ChevronRightIcon />
			</summary>
			<div className="tool-content">{children}</div>
		</details>}
		<TimelineEdit indices={indices} />
	</div>
}

