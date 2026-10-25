
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import cors from '@fastify/cors'
import type {WebSocket} from 'ws'
import {guarantee, hex} from '@e280/stz'
import websocket from '@fastify/websocket'
import {mkdtemp, rm, writeFile} from 'node:fs/promises'
import {connect, Messenger, wire} from '@e280/renraku'
import Fastify, {type FastifyReply, type FastifyRequest} from 'fastify'

import type {TimelinePatch} from '@omnimedia/omniso/timeline'
import {bridgePort, type EditorRpc} from '@omnimedia/omniso/mcp/protocol'
import type {MediaInfo} from '@omnimedia/omniso/assistant/types'
import {abortable} from '@omnimedia/omniso/abortable'

type ProvidedMedia = MediaInfo & {path: string}
type MediaRequest = FastifyRequest<{Params: {id: string}}>

export class EditorBridge {
	#server = Fastify()
	#directory = ''
	#editor?: EditorRpc
	#disconnected = new AbortController()
	#uploads = new Set<string>()
	#media = new Map<string, Promise<ProvidedMedia>>()

	constructor(private origin: string, public port = bridgePort) {}

	async start() {
		this.#directory = await mkdtemp(join(tmpdir(), 'omniclip-mcp-'))

		this.#server.addHook('onRequest', async (request, reply) => {
			const allowed =
				request.headers.origin === this.origin &&
				request.headers.host === `127.0.0.1:${this.port}`

			if (!allowed)
				return reply.code(403).send()
		})

		this.#server.register(cors, {
			origin: this.origin,
			methods: ['POST', 'OPTIONS'],
			allowedHeaders: ['Content-Type']
		})

		await this.#server.register(websocket, {
			options: {maxPayload: 16 * 1024 * 1024}
		})

		this.#server.removeAllContentTypeParsers()
		this.#server.addContentTypeParser('*', (_request, _payload, done) => done(null))

		this.#server.get('/editor', {websocket: true}, this.#connectEditor)
		this.#server.post('/media/:id', this.#receiveMedia)

		await this.#server.listen({port: this.port, host: '127.0.0.1'})
		this.port = this.#server.addresses()[0]!.port
	}

	get editor() {
		if (!this.#editor)
			throw new Error(`Open an Omniclip project and enable local MCP access in Settings (port ${this.port}), then retry.`)

		return this.#editor
	}

	patch(patch: TimelinePatch, signal?: AbortSignal) {
		return this.#callEditor((editor, id) => editor.patch_timeline(patch, id), signal)
	}

	provide(mediaHash: string, signal?: AbortSignal) {
		return guarantee(this.#media, mediaHash, async () => {
			const id = hex.random(16)
			const path = join(this.#directory, id)

			this.#uploads.add(id)

			try {
				const media = await this.#callEditor(
					(editor, id) => editor.provide_media({
						mediaHash,
						uploadUrl: `http://127.0.0.1:${this.port}/media/${id}`
					}, id),
					signal,
					id
				)

				return {...media, path}
			} catch (error) {
				this.#uploads.delete(id)
				this.#media.delete(mediaHash)
				await rm(path, {force: true})
				throw error
			}
		})
	}

	async close() {
		await this.#server.close()

		if (this.#directory)
			await rm(this.#directory, {recursive: true, force: true})
	}

	#connectEditor = async (socket: WebSocket) => {
		if (this.#editor)
			return socket.terminate()

		const {connection, remote} = wire({
			connection: await connect(socket),
			messenger: new Messenger<EditorRpc>(undefined, 120_000),
		})
		this.#editor = remote
		this.#disconnected = new AbortController()

		connection.onClose(() => {
			this.#editor = undefined
			this.#disconnected.abort(
				new Error('Editor disconnected. Re-read project context after reconnecting.')
			)
		})
	}

	#receiveMedia = async (request: MediaRequest, reply: FastifyReply) => {
		const {id} = request.params

		if (!this.#uploads.delete(id))
			return reply.code(404).send()

		await writeFile(join(this.#directory, id), request.raw, {
			flag: 'wx',
			mode: 0o600
		})

		return reply.code(204).send()
	}

	async #callEditor<T>(
		execute: (editor: EditorRpc, id: string) => Promise<T>,
		signal?: AbortSignal,
		id = hex.random(16)
	) {
		const editor = this.editor
		const cancelSignal = signal
			? AbortSignal.any([this.#disconnected.signal, signal])
			: this.#disconnected.signal

		cancelSignal.throwIfAborted()

		return abortable(execute(editor, id), cancelSignal, () => {
			void editor.cancel(id).catch(() => {})
		})
	}
}
