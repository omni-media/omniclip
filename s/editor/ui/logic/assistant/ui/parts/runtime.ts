
import {useCallback, useEffect, useMemo} from 'react'
import {
	AuiConfig,
	Tools,
	WebSpeechSynthesisAdapter,
	useAui,
	useRemoteThreadListRuntime
} from '@assistant-ui/react'
import {lastAssistantMessageIsCompleteWithToolCalls} from 'ai'
import {AssistantChatTransport, useChatRuntime} from '@assistant-ui/ai-sdk'

import {createAssistantToolkit} from '../toolkit/toolkit.js'
import type {EditorContext} from '../../../../../context/context.js'
import {createLocalHistoryAdapter, createThreadListAdapter} from './persistence.js'

export type ReasoningEffort = 'none' | 'low' | 'medium' | 'xhigh'

export function useProjectChatRuntime(
	context: EditorContext,
	reasoningEffort: ReasoningEffort
) {
	const prefix = `omniclip:assistant:${context.strata.projectId}:`

	const transport = useMemo(() => new AssistantChatTransport({
		api: '/api/assistant',
		body: () => ({
			context: context.getAssistantContext(),
			reasoningEffort
		})
	}), [context, reasoningEffort])

	const threadListAdapter = useMemo(
		() => createThreadListAdapter(prefix),
		[prefix]
	)

	const config = useMemo(() => AuiConfig({
		tools: Tools({
			toolkit: createAssistantToolkit(context, reasoningEffort)
		})
	}), [context, reasoningEffort])

	const speech = useMemo(
		() => new WebSpeechSynthesisAdapter(),
		[]
	)

	const runtimeHook = useCallback(function useThreadRuntime() {
		const aui = useAui()

		const history = useMemo(() => createLocalHistoryAdapter(
			prefix,
			() => aui.threadListItem.getState().remoteId,
			async () => (await aui.threadListItem.initialize()).remoteId
		), [aui, prefix])

		return useChatRuntime({
			transport,
			adapters: {history, speech},
			sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls
		})
	}, [prefix, transport, speech])

	const runtime = useRemoteThreadListRuntime({
		adapter: threadListAdapter,
		runtimeHook
	})

	useEffect(() => {
		const reloadThreads = (event: StorageEvent) => {
			if (event.key === `${prefix}threads`)
				void runtime.threads.reload()
		}

		window.addEventListener('storage', reloadThreads)
		return () => window.removeEventListener('storage', reloadThreads)
	}, [prefix, runtime])

	return {runtime, config}
}

