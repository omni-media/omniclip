
import {queue} from '@e280/stz'
import type {EditorRpc} from '../protocol.js'
import type {TimelinePatch} from '../../../../iso/timeline.js'
import type {EditorContext} from '../../../../editor/context/context.js'

export function createEditorSession(editor: EditorContext, origin: string) {
	const jobs = new Map<string, AbortController>()
	const context = () => editor.getAssistantContext()

	const patchTimeline = queue(async (patch: TimelinePatch, signal: AbortSignal) => {
		signal.throwIfAborted()

		const result = await editor.assistant.patchTimeline(patch)

		if (result.success)
			editor.assistant.finish(result.assistantEditId)

		return {result, context: context()}
	})

	const run = async <T>(id: string, action: (signal: AbortSignal) => Promise<T>) => {
		const controller = new AbortController()
		jobs.set(id, controller)

		try {
			return await action(controller.signal)
		} finally {
			jobs.delete(id)
		}
	}

	const fns: EditorRpc = {
		read_project_context: async () => context(),

		create_item: async () => ({
			id: editor.session.getId()
		}),

		cancel: async id => {
			jobs.get(id)?.abort()
		},

		patch_timeline: (patch, id) =>
			run(id, signal => patchTimeline(patch, signal)),

		provide_media: ({mediaHash, uploadUrl}, id) =>
			run(id, async signal => {
				if (new URL(uploadUrl).origin !== origin)
					throw new Error('Invalid MCP upload destination')

				const {filename, blob, duration} = editor.project.resources.require(mediaHash)
				const response = await fetch(uploadUrl, {
					method: 'POST',
					body: blob,
					signal
				})

				if (!response.ok)
					throw new Error(`Providing media failed (${response.status})`)

				return {
					mediaHash,
					filename,
					type: blob.type,
					duration
				}
			})
	}

	return {
		fns,

		close() {
			for (const job of jobs.values())
				job.abort()

			jobs.clear()
		}
	}
}
