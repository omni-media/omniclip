
import {useSyncExternalStore} from "react"

const initialProgress = "Preparing video context"
const messages = new Map<string, string>()
const listeners = new Set<() => void>()

export function setUploadProgress(toolCallId: string, label: string, value: number) {
	setProgressMessage(toolCallId, `${label} · ${Math.round(value * 100)}%`)
}

export function setProgressMessage(toolCallId: string, message: string) {
	messages.set(toolCallId, message)
	for (const listener of listeners) listener()
}

export function clearUploadProgress(toolCallId: string) {
	messages.delete(toolCallId)
	for (const listener of listeners) listener()
}

export function useUploadProgress(toolCallId: string) {
	return useSyncExternalStore(
		listener => {
			listeners.add(listener)
			return () => listeners.delete(listener)
		},
		() => messages.get(toolCallId) ?? initialProgress,
	)
}

