
export type ToolOutcome = "running" | "complete" | "cancelled" | "incomplete" | "failed"

export type ToolState = {
	toolName: string
	isError?: boolean
	result?: unknown
	status: {type: string; reason?: string; error?: unknown}
}

export type ToolStatus =
	| {outcome: "failed"; errorMessage: string}
	| {outcome: Exclude<ToolOutcome, "failed">}

export function isFailureResult(result: unknown) {
	return typeof result === "object" && result !== null &&
		"success" in result && result.success === false
}

export function toolStatus(tool: ToolState): ToolStatus {
	const {status} = tool
	const failedByStatus = status.type === "incomplete" && status.reason === "error"

	if (tool.isError || isFailureResult(tool.result) || failedByStatus) {
		const resultError = typeof tool.result === "object" && tool.result !== null && "error" in tool.result
			? tool.result.error
			: undefined
		const statusError = failedByStatus ? status.error : undefined
		const error = resultError ?? (tool.isError ? tool.result : statusError)
		return {outcome: "failed", errorMessage: formatToolError(error)}
	}

	if (status.type === "incomplete")
		return {outcome: status.reason === "cancelled" ? "cancelled" : "incomplete"}
	if (status.type === "running") return {outcome: "running"}
	if (tool.toolName === "patch_timeline" && tool.result === undefined)
		return {outcome: "incomplete"}
	return {outcome: "complete"}
}

export function isHiddenSuccessfulTool(tool: ToolState) {
	return tool.toolName === "create_item" || (
		tool.toolName === "patch_timeline" &&
		(tool.result as {success?: boolean} | undefined)?.success === true
	)
}

function formatToolError(error: unknown) {
	if (typeof error === "string") return error
	if (error instanceof Error) return error.message
	if (error === undefined) return "Tool call failed"
	return JSON.stringify(error) ?? String(error)
}

