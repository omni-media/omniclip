
import {fromJSONSchema} from 'zod'
import {createRequire} from 'node:module'
import {Client} from '@modelcontextprotocol/sdk/client/index.js'
import {StdioClientTransport} from '@modelcontextprotocol/sdk/client/stdio.js'
import {CallToolResultSchema, type Tool} from '@modelcontextprotocol/sdk/types.js'

const visualToolNames = new Set(['video_info', 'video_analyze', 'video_watch', 'video_detail'])
const hiddenInputs = ['skip_audio', 'frame_mode', 'describer_model']
const descriptionSuffix =
	'Audio transcription is disabled; audio_analyze is not implemented yet. ' +
	'Inspect original sources and map their timestamps using read_project_context.'

type JsonSchema = Parameters<typeof fromJSONSchema>[0]

export async function connectVision() {
	const client = new Client({name: 'omniclip-vision', version: '0.1.0'})

	try {
		await client.connect(new StdioClientTransport({
			command: process.execPath,
			args: [createRequire(import.meta.url).resolve('claude-video-vision')],
			stderr: 'inherit'
		}))

		const {tools} = await client.listTools()

		return {
			tools: tools
				.filter(tool => visualToolNames.has(tool.name))
				.map(prepareTool),

			call(name: string, args: Record<string, unknown>, signal?: AbortSignal) {
				if (name === 'video_watch')
					args = {...args, skip_audio: true, frame_mode: 'images'}

				if (name === 'video_analyze')
					args = {
						...args,
						filters: {...args.filters as object, transcription: false}
					}

				return client.callTool(
					{name, arguments: args},
					CallToolResultSchema,
					{signal, timeout: 300_000}
				)
			},

			close: () => client.close()
		}
	} catch (error) {
		await client.close().catch(() => {})
		throw error
	}
}

function prepareTool(tool: Tool) {
	const input = structuredClone(tool.inputSchema)
	input.additionalProperties = false

	for (const name of hiddenInputs)
		delete input.properties?.[name]

	const filters = input.properties?.filters as {
		properties?: Record<string, unknown>
	} | undefined

	delete filters?.properties?.transcription

	const description = tool.description?.replaceAll('Claude', 'the assistant')

	return {
		...tool,
		inputSchema: schema(input),
		outputSchema: tool.outputSchema && schema(tool.outputSchema),
		description: description
			? `${description} ${descriptionSuffix}`
			: descriptionSuffix
	}
}

function schema(value: unknown) {
	return fromJSONSchema(value as JsonSchema)
}


