
export function activity(text: string, status: "running" | "complete" | "failed") {
	return <div className="tool-step" data-status={status}>
		<span>{status === "complete" ? "✓" : status === "failed" ? "×" : ""}</span>
		{text}
	</div>
}

export function resultActivity(result: unknown, success: string, failure: string) {
	return activity(result ? success : failure, result ? "complete" : "failed")
}
