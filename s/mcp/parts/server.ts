
import type {infer as Infer} from 'zod'
import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js'
import type {CallToolResult} from '@modelcontextprotocol/sdk/types.js'

import {editorTools} from './tools.js'
import {EditorBridge} from './bridge/node.js'
import type {connectVision} from './vision.js'
import {mcpInstructions} from './instructions.js'
import type {TimelinePatch} from '../../iso/timeline.js'

type Vision = Awaited<ReturnType<typeof connectVision>>
type EditorToolInput = Infer<typeof editorTools[number]['inputSchema']>

export function createMcpServer(bridge: EditorBridge, vision: Vision) {
	const server = new McpServer(
		{name: 'omniclip', version: '0.1.0'},
		{instructions: mcpInstructions}
	)

	const executeEditorTool = async (
		name: string,
		args: EditorToolInput,
		signal: AbortSignal
	) => {
		signal.throwIfAborted()

		switch (name) {
			case 'read_project_context':
			case 'create_item':
				return bridge.editor[name]()
			case 'patch_timeline':
				return bridge.patch(args as TimelinePatch, signal)
			case 'audio_analyze':
				throw new Error('Audio analysis is not implemented yet.')
			case 'provide_media': {
				const context = await bridge.editor.read_project_context()
				const item = context.timeline.items.find(item =>
					'itemId' in args && item.id === args.itemId
				)

				if (!item || !('mediaHash' in item))
					throw new Error('Choose a media item from the latest context.')

				const media = await bridge.provide(item.mediaHash, signal)

				return {
					itemId: item.id,
					...media,
					timingUnit: 'milliseconds',
					sourceDuration: media.duration,
					sourceStart: 'start' in item ? item.start : 0,
					duration: 'duration' in item ? item.duration : media.duration
				}
			}
			default:
				throw new Error(`Unknown editor tool: ${name}`)
		}
	}

	for (const {name, ...tool} of editorTools) {
		server.registerTool(name, tool, async (input: EditorToolInput, {signal}: {signal: AbortSignal}): Promise<CallToolResult> => ({
			content: [{
				type: 'text',
				text: JSON.stringify(await executeEditorTool(name, input, signal))
			}]
		}))
	}

	for (const {name, ...tool} of vision.tools) {
		server.registerTool(name, tool, async (input, {signal}) =>
			await vision.call(name, input as Record<string, unknown>, signal) as CallToolResult
		)
	}

	return server
}

