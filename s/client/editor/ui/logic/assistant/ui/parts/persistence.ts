import {
	createLocalStorageAdapter,
	createSimpleTitleAdapter,
	type AsyncStorageLike
} from '@assistant-ui/core/react'
import type {
	GenericThreadHistoryAdapter,
	MessageFormatAdapter,
	MessageFormatItem,
	MessageStorageEntry,
	ThreadHistoryAdapter
} from '@assistant-ui/react'

const storage: AsyncStorageLike = {
	getItem: async key => localStorage.getItem(key),
	setItem: async (key, value) => localStorage.setItem(key, value),
	removeItem: async key => localStorage.removeItem(key)
}

type StoredMessages<TFormat> = {
	headId?: string | null
	messages: MessageStorageEntry<TFormat>[]
}

const messageKey = (prefix: string, threadId: string) =>
	`${prefix}formatted-messages:${threadId}`

function readMessages<TFormat>(prefix: string, threadId: string): StoredMessages<TFormat> {
	try {
		const stored = JSON.parse(
			localStorage.getItem(messageKey(prefix, threadId)) ?? 'null'
		) as Partial<StoredMessages<TFormat>> | null

		return {
			headId: stored?.headId,
			messages: Array.isArray(stored?.messages) ? stored.messages : []
		}
	} catch {
		return {messages: []}
	}
}

function writeMessages<TFormat>(
	prefix: string,
	threadId: string,
	stored: StoredMessages<TFormat>
) {
	localStorage.setItem(
		messageKey(prefix, threadId),
		JSON.stringify(stored)
	)
}

export function createThreadListAdapter(prefix: string) {
	const adapter = createLocalStorageAdapter({
		storage,
		prefix,
		titleGenerator: createSimpleTitleAdapter()
	})

	return {
		...adapter,
		async delete(threadId: string) {
			await adapter.delete(threadId)
			await storage.removeItem(messageKey(prefix, threadId))
		}
	}
}

export function createLocalHistoryAdapter(
	prefix: string,
	getThreadId: () => string | undefined,
	initializeThread: () => Promise<string>
): ThreadHistoryAdapter {
	return {
		async load() {
			return {messages: []}
		},

		async append() {},

		withFormat<TMessage, TFormat extends Record<string, unknown>>(
			format: MessageFormatAdapter<TMessage, TFormat>
		): GenericThreadHistoryAdapter<TMessage> {
			let threadId: string | undefined

			const save = (
				threadId: string,
				item: MessageFormatItem<TMessage>,
				messageId = format.getId(item.message)
			) => {
				const stored = readMessages<TFormat>(prefix, threadId)

				const entry: MessageStorageEntry<TFormat> = {
					id: messageId,
					parent_id: item.parentId,
					format: format.format,
					content: format.encode(item)
				}

				writeMessages(prefix, threadId, {
					headId: messageId,
					messages: [
						...stored.messages.filter(message => message.id !== messageId),
						entry
					]
				})
			}

			return {
				pin() {
					threadId = getThreadId()
				},

				async load() {
					const id = threadId ?? getThreadId()
					if (!id) return {messages: []}

					const stored = readMessages<TFormat>(prefix, id)

					return {
						headId: stored.headId,
						messages: stored.messages
							.filter(message => message.format === format.format)
							.map(message => format.decode(message))
					}
				},

				async append(item) {
					threadId ??= await initializeThread()
					save(threadId, item)
				},

				async update(item, messageId) {
					threadId ??= getThreadId() ?? await initializeThread()
					save(threadId, item, messageId)
				},

				async delete(items) {
					const id = threadId ?? getThreadId()
					if (!id) return

					const stored = readMessages<TFormat>(prefix, id)
					const removedIds = new Set(
						items.map(item => format.getId(item.message))
					)

					const messages = stored.messages.filter(message =>
						message.format !== format.format ||
						!removedIds.has(message.id)
					)

					const headId =
						stored.headId && removedIds.has(stored.headId)
							? messages.at(-1)?.id ?? null
							: stored.headId

					writeMessages(prefix, id, {headId, messages})
				}
			}
		}
	}
}

