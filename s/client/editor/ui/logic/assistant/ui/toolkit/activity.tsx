
import {CheckIcon, XIcon} from "lucide-react"

import {isFailureResult} from "./tool-state.js"

export function activity(text: string, status: "running" | "complete" | "failed") {
	return <div className="tool-step" data-status={status}>
		{status === "complete" ? <CheckIcon /> : status === "failed" ? <XIcon /> : <span />}
		{text}
	</div>
}

export function resultActivity(result: unknown, success: string, failure: string) {
	const failed = !result || isFailureResult(result)
	return activity(failed ? failure : success, failed ? "failed" : "complete")
}
