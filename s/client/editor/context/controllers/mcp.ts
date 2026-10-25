
import {signal} from '@e280/strata'

import type {EditorContext} from '../context.js'
import {bridgePort} from '@omnimedia/omniso/mcp/protocol'
import {connectMcp, type McpStatus} from '../../../mcp/connect.js'

export class McpController {
	#stop?: () => void
	$enabled = signal(false)
	$port = signal(bridgePort)
	$status = signal<McpStatus>('disconnected')

	constructor(private editor: EditorContext) {}

	setEnabled(enabled: boolean) {
		this.#stop?.()
		this.#stop = undefined
		this.$enabled(enabled)
		if (enabled)
			this.#stop = connectMcp(this.editor, this.$port(), status => this.$status(status))
	}

	dispose() {
		this.setEnabled(false)
	}
}

