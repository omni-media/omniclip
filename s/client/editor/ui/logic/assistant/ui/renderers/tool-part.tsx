import {useState, type ReactNode} from "react"

import {ToolCall} from "../components/elements/tool-call.js"
import {ToolError} from "../components/elements/tool-error.js"
import {useUploadProgress} from "../toolkit/video/progress.js"
import {
	isHiddenSuccessfulTool,
	toolStatus,
	type ToolState,
} from "../toolkit/tool-state.js"

type ToolPartData = ToolState & {
	toolCallId: string
	args: Record<string, unknown>
	toolUI?: ReactNode
}

const toolLabels: Partial<Record<string, [string, string]>> = {
	web_search: ["Searching the web", "Searched the web"],
	read_skill: ["Reading skill", "Read skill"],
	read_project_context: ["Reading project context", "Read project context"],
	update_settings: ["Updating project settings", "Project settings updated"],
	probe_media: ["Reading media metadata", "Read media metadata"],
	inspect_timeline: ["Inspecting timeline sources", "Inspected timeline sources"],
	provide_media: ["Preparing media context", "Media context ready"],
	inspect_media: ["Inspecting media", "Media inspected"],
	patch_timeline: ["Applying timeline changes", "Timeline updated"],
	create_item: ["Preparing an item", "Prepared an item"],
}

export function ToolPart({part}: {part: ToolPartData}) {
	const [open, setOpen] = useState(false)
	const {toolCallId, toolName, args, result, toolUI} = part
	const state = toolStatus(part)
	const {outcome} = state
	const defaultLabel = toolName.replaceAll("_", " ")
	const labels = toolLabels[toolName]
	const [activeLabel, label] = labels ?? [defaultLabel, defaultLabel]
	const progress = useUploadProgress(toolCallId, activeLabel)

	if (outcome === "failed")
		return <ToolError
			name={defaultLabel}
			target=""
			retrying={false}
			message={state.errorMessage}
		/>
	if (!labels) return toolUI ?? null
	if (outcome === "complete" && isHiddenSuccessfulTool(part)) return null

	const query = toolQuery(toolName, args)
	let shownLabel = label
	let resultText = toolResult(toolName, result, label)

	if (outcome === "cancelled") {
		shownLabel = toolName === "patch_timeline" ? "Timeline change interrupted" : `${defaultLabel} stopped`
		resultText = toolName === "patch_timeline"
			? "Stopped before confirming the timeline change."
			: "Stopped before a result was returned."
	} else if (outcome === "incomplete") {
		shownLabel = `${defaultLabel} incomplete`
		resultText = "The call ended before returning a result."
	}

	return <ToolCall
		label={shownLabel}
		activeLabel={progress}
		query={query}
		request={JSON.stringify(args, null, 2)}
		result={resultText}
		status={outcome}
		open={open}
		onOpenChange={setOpen}
	/>
}

function toolQuery(toolName: string, args: Record<string, unknown>) {
	if (toolName === "web_search")
		return typeof args.query === "string" ? args.query : ""
	if (toolName === "read_skill")
		return [args.skill, args.path].filter(Boolean).join("/")
	return ""
}

function toolResult(toolName: string, result: unknown, label: string) {
	if (result === undefined) return "No result yet"
	if (toolName !== "web_search" && toolName !== "read_skill") return label
	return typeof result === "string" ? result : JSON.stringify(result, null, 2) ?? ""
}

