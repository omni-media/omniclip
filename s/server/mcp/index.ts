#!/usr/bin/env node

import {once} from '@e280/stz'
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js'

import {connectVision} from './parts/vision.js'
import {createMcpServer} from './parts/server.js'
import {EditorBridge} from './parts/bridge/node.js'
import {bridgePort} from '@omnimedia/omniso/mcp/protocol'

const origin = process.env.OMNICLIP_ORIGIN ?? 'http://127.0.0.1:3000'
const port = Number(process.env.OMNICLIP_MCP_PORT ?? bridgePort)

let stopping = false
let bridge: EditorBridge | undefined
let vision: Awaited<ReturnType<typeof connectVision>> | undefined
let server: ReturnType<typeof createMcpServer> | undefined

const stop = once(async () => {
	stopping = true

	await Promise.allSettled([
		server?.close(),
		bridge?.close(),
		vision?.close()
	])
})

process.once('SIGINT', () => void stop())
process.once('SIGTERM', () => void stop())

async function main() {
	bridge = new EditorBridge(origin, port)
	vision = await connectVision()
	if (stopping) {
		await vision.close()
		return
	}
	server = createMcpServer(bridge, vision)

	server.server.onclose = () => void stop()

	await bridge.start()
	await server.connect(new StdioServerTransport())

	console.error(
		`Omniclip MCP ready. Open a project at ${origin}/editor/ and enable local MCP access in Settings (port ${bridge.port}).`
	)
}

try {
	await main()
} catch (error) {
	await stop()
	throw error
}

