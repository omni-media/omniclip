
export type Message = {
	role: "user" | "assistant"
	content: string
}

export type AssistantProgressReport = {progress: number, text: string}
export type AssistantProgressCallback = (report: AssistantProgressReport) => void
