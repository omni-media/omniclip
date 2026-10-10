
import {css, html} from 'lit'
import {shadow, useCss, useSignal} from '@e280/sly'

import '@awesome.me/webawesome/dist/components/input/input.js'
import '@awesome.me/webawesome/dist/components/switch/switch.js'
import type {EditorContext} from '../../../../context/context.js'
import {bridgePort} from '../../../../../mcp/parts/bridge/protocol.js'

export const McpSettings = shadow((context: EditorContext) => {
	useCss(css`
		:host {display: block; max-width: min(480px, 80vw);}
		section {display: flex; flex-direction: column; gap: 12px;}
		p {margin: 0; color: #aaa; font-size: 12px;}
		code {display: block; overflow-wrap: anywhere; font-size: 12px;}
	`)

	const notice = useSignal('')
	const mcp = context.mcp
	const port = mcp.$port()
	const command = [
		'codex mcp add omniclip',
		location.origin !== 'http://127.0.0.1:3000' && `--env OMNICLIP_ORIGIN=${location.origin}`,
		port !== bridgePort && `--env OMNICLIP_MCP_PORT=${port}`,
		'-- npx --no-install omniclipmcp'
	].filter(Boolean).join(' ')

	const changePort = (event: Event) => {
		const input = event.currentTarget as HTMLInputElement
		const value = Number(input.value)

		if (Number.isInteger(value) && value >= 1 && value <= 65535) {
			mcp.$port(value)
			notice('')
		} else {
			input.value = String(port)
			notice('Use a port between 1 and 65535.')
		}
	}

	const copyCommand = async () => {
		try {
			await navigator.clipboard.writeText(command)
			notice('Setup command copied.')
		} catch {
			notice('Could not copy. Select the command above instead.')
		}
	}

	return html`
		<section>
			<wa-switch
				.checked=${mcp.$enabled()}
				@change=${(event: Event) =>
					mcp.setEnabled((event.currentTarget as HTMLInputElement).checked)}
			>
				Allow local MCP access
			</wa-switch>

			<p role="status">Status: ${mcp.$status()}</p>

			<p>
				Allows your connected agent to inspect media and edit this project.
				Changes take effect immediately. Access is off by default for each project tab.
			</p>

			<wa-input
				label="Bridge port"
				type="number"
				min="1"
				max="65535"
				size="small"
				.value=${String(port)}
				?disabled=${mcp.$enabled()}
				@change=${changePort}
			></wa-input>

			<p>
				Run npm link once in your local Omniclip repository, then register using this command.
				Your agent starts the local server automatically. Nothing is published or downloaded.
			</p>

			<code>${command}</code>

			<wa-button size="small" @click=${copyCommand}>
				Copy setup command
			</wa-button>

			<p role="status">${notice()}</p>
		</section>
	`
})

