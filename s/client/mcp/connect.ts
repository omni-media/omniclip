
import {bridgePort} from '@omnimedia/omniso/mcp/protocol'
import {connect, makeEndpoint, Messenger, wire} from '@e280/renraku'

import {createEditorSession} from './session.js'
import type {EditorContext} from '../editor/context/context.js'

export type McpStatus = 'disconnected' | 'connecting' | 'connected'

export function connectMcp(editor: EditorContext, port = bridgePort, onStatus: (status: McpStatus) => void = () => {}) {
	const origin = `http://127.0.0.1:${port}`
	let stopped = false
	let socket: WebSocket
	let retry: ReturnType<typeof setTimeout>
	let session: ReturnType<typeof createEditorSession>

	const reconnect = () => {
		onStatus('connecting')
		socket = new WebSocket(`ws://127.0.0.1:${port}/editor`)
		session = createEditorSession(editor, origin)

		socket.addEventListener('close', () => {
			session.close()

			if (!stopped) {
				onStatus('connecting')
				retry = setTimeout(reconnect, 2000)
			}
		}, {once: true})

		void connect(socket)
			.then(connection => {
				if (stopped) return connection.close()
				wire({
					connection,
					messenger: new Messenger(
						makeEndpoint(session.fns, {exposeAllErrors: true}),
						120_000
					)
				})

				onStatus('connected')
			})
			.catch(error => console.error('Omniclip MCP connection failed', error))
	}

	reconnect()

	return () => {
		stopped = true
		clearTimeout(retry)
		session.close()
		socket.close()
		onStatus('disconnected')
	}
}
