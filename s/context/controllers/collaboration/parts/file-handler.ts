import {Connection} from "sparrow-rtc"

import {State} from "../../../types.js"
import {omnislate} from "../../../context.js"
import {Collaboration} from "../controller.js"

export class FileHandler {
	#files: {[hash: string]: BlobPart[]} = {}
	#fileSizes: {[hash: string]: number} = {}

	#syncedHashes: Set<string> = new Set() // Files that are already synced
	#pendingSync: Set<string> = new Set() // Files currently being sent

	constructor(private collaboration: Collaboration) {}

	sendFile(file: File, hash: string, dataChannel: RTCDataChannel) {
		this.#sendFileMetadata(dataChannel, hash, file)
		const chunkSize = 16 * 1024 // 16 KB
		let offset = 0

		const readNextChunk = () => {
			const slice = file.slice(offset, offset + chunkSize)
			const reader = new FileReader()
			reader.onload = () => {
				const chunk = reader.result as ArrayBuffer
				this.#sendChunkWithHash(dataChannel, chunk, hash)
				offset += chunkSize
				if (offset < file.size) {
					readNextChunk()
				} else {
					dataChannel.send(
						JSON.stringify({ done: true, hash, filename: file.name, fileType: file.type })
					)
					this.#markFileAsSynced(hash)
				}
			}
			reader.readAsArrayBuffer(slice)
		}

		readNextChunk()
	}

	onFileChunk(
		event: MessageEvent<any>,
		hashLength: number,
		onComplete: (hash: string, file: File) => void,
		onProgress?: (hash: string, receivedBytes: number, totalBytes: number) => void
	) {
		if (typeof event.data === "string") {
			const message = JSON.parse(event.data)
			if (message.done) {
				const hash = message.hash
				if (this.#files[hash]) {
					const file = new File(this.#files[hash], message.filename, {type: message.fileType})
					onComplete(hash, file)
					delete this.#files[hash]
					delete this.#fileSizes[hash]
				}
			} else if (message.hash && message.size) {
				this.#fileSizes[message.hash] = message.size // Save the total size
			}
		} else {
			const { hash, chunk } = this.#receiveChunkWithHash(event, hashLength)
			if (!this.#files[hash]) {
				this.#files[hash] = []
			}
			this.#files[hash].push(chunk)
			// Update progress
			if (onProgress && this.#fileSizes[hash]) {
				//@ts-ignore
				const receivedBytes = this.files[hash].reduce((sum, part) => sum + part.byteLength, 0)
				onProgress(hash, receivedBytes, this.#fileSizes[hash])
			}
		}
	}

	#sendChunkWithHash(dataChannel: RTCDataChannel, chunk: ArrayBuffer, hash: string) {
		const encoder = new TextEncoder()
		const hashBuffer = encoder.encode(hash)

		const combinedBuffer = new ArrayBuffer(hashBuffer.byteLength + chunk.byteLength)
		const combinedView = new Uint8Array(combinedBuffer)

		combinedView.set(new Uint8Array(hashBuffer), 0)
		combinedView.set(new Uint8Array(chunk), hashBuffer.byteLength)

		dataChannel.send(combinedBuffer)
	}

	#receiveChunkWithHash(event: MessageEvent<ArrayBuffer>, hashLength: number) {
		const combinedView = new Uint8Array(event.data)
		const hashBuffer = combinedView.slice(0, hashLength)
		const hash = new TextDecoder().decode(hashBuffer)
		const chunk = combinedView.slice(hashLength)
		return { hash, chunk }
	}

	#sendFileMetadata(dataChannel: RTCDataChannel, hash: string, file: File) {
		const metadata = { hash, size: file.size, filename: file.name, mimeType: file.type }
		dataChannel.send(JSON.stringify(metadata))
	}

	async getMissingFiles(state: State): Promise<string[]> {
		const missing: string[] = []
		for (const effect of state.effects) {
			if (effect.kind === "video" || effect.kind === "audio" || effect.kind === "image") {
				const file = await omnislate.context.controllers.media.get_file(effect.file_hash)
				if (!file) {
					missing.push(effect.file_hash)
				}
			}
		}
		return missing
	}

	#isFileAlreadySynced(hash: string) {
		return this.#syncedHashes.has(hash)
	}

	#isFilePendingSync(hash: string) {
		return this.#pendingSync.has(hash)
	}

	#markFileAsPendingSync(hash: string) {
		this.#pendingSync.add(hash)
	}

	#markFileAsSynced(hash: string) {
		this.#syncedHashes.add(hash)
		this.#pendingSync.delete(hash)
	}

	syncMedia(media: {hash: string, file: File}, connection?: Connection) {
		if (this.#isFileAlreadySynced(media.hash) || this.#isFilePendingSync(media.hash)) {
			console.log(`File ${media.hash} is already synced or in the process of syncing.`)
			return
		}

		this.#markFileAsPendingSync(media.hash)

		if (this.collaboration.host) {
			this.collaboration.connectedClients.forEach(client => {
				if (!connection || client !== connection) {
					this.sendFile(media.file, media.hash, client.cable.reliable)
				}
			})
		} else if (this.collaboration.client) {
			this.sendFile(media.file, media.hash, this.collaboration.client.connection.cable.reliable)
		}
	}

}
