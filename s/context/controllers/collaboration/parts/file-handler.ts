import {Connection} from "sparrow-rtc"

import {State} from "../../../types.js"
import {Compressor} from "./compressor.js"
import {omnislate} from "../../../context.js"
import {Collaboration} from "../controller.js"
import {AnyMedia} from "../../../../components/omni-media/types.js"
import {BinaryAccumulator} from "../../video-export/tools/BinaryAccumulator/tool.js"

export interface FileMetadata {
	hash: string
	name: string
	type: string
	size: number
	total?: number
	proxy: boolean
}

export class FileHandler {
	#fileProgress: {[hash: string]: {
		received: number
		total: number
		proxy: boolean
	}} = {}
	#fileMetadata: {[hash: string]: FileMetadata} = {}

	receivedFiles: {hash: string, proxy: boolean, receivedFrom: Connection}[] = []

	#syncedHashes: Set<string> = new Set() // Files that are already synced
	#pendingSync: Set<string> = new Set() // Files currently being sent
	
	binary_accumulators: {[hash: string]: BinaryAccumulator} = {}

	levels = [
		{resolution: '640:360', crf: '28', preset: 'ultrafast', suffix: 'level1'},
		{resolution: '1280:720', crf: '28', preset: 'veryfast', suffix: 'level2'},
		{resolution: '1920:1080', crf: '28', preset: 'medium', suffix: 'level3'}
	]
	
	compressor: Compressor

	constructor(private collaboration: Collaboration) {
		this.compressor = new Compressor(collaboration)
	}

	get filesInProgress() {
		return Object.entries(this.#fileProgress)
	}

	get filesMetadata() {
		return Object.entries(this.#fileMetadata)
	}

	sendChunk(compressedChunk: Uint8Array, hash: string, dataChannel: RTCDataChannel) {
		this.#sendChunkWithHash(dataChannel, compressedChunk, hash)
	}

	sendFile(file: File, hash: string, dataChannel: RTCDataChannel, total: number) {
		this.sendFileMetadata(dataChannel, hash, file, false, total)
		const chunkSize = 8 * 1024 // 16 KB
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
						JSON.stringify({ done: true, hash, filename: file.name, fileType: file.type, proxy: false })
					)
					this.markFileAsSynced(hash)
				}
			}
			reader.readAsArrayBuffer(slice)
		}

		readNextChunk()
	}

	requestOriginalVideoFile(requestedFileHash: string) {
		for(const {receivedFrom, hash} of this.receivedFiles) {
			if(requestedFileHash === hash) {
				const alive = this.collaboration.connectedClients.get(receivedFrom.id)
				if(alive) {
					alive.cable.reliable.send(JSON.stringify({type: "get-original-file", hash}))
				}
			}
		}
	}

	async onFileChunk(
		connection: Connection,
		event: MessageEvent<any>,
		hashLength: number,
		onComplete: (hash: string, file: File, proxy?: boolean) => void,
		onProgress?: (hash: string, receivedBytes: number, totalBytes: number) => void
	) {
		if (typeof event.data === "string") {
			const message = JSON.parse(event.data)
				
			if (message.hash && message.total) {
				const props = message as FileMetadata
				this.#fileMetadata[message.hash] = props
				this.#fileProgress[message.hash] = {
					total: message.total,
					received: 0,
					proxy: message.proxy
				}
			}
		} else {
			const {hash, chunk} = this.#receiveChunkWithHash(event, hashLength)

			if (!this.binary_accumulators[hash]) {
				this.binary_accumulators[hash] = new BinaryAccumulator()
			}

			this.binary_accumulators[hash].add_chunk(chunk)

			// Update progress
			if (onProgress && this.#fileProgress[hash]) {
				const {proxy, type, name} = this.#fileMetadata[hash]
				if(proxy) {
					const total = this.#fileProgress[hash].total
					this.#fileProgress[hash].received += 1
					const received = this.#fileProgress[hash].received
					onProgress(hash, received, total)
					this.collaboration.onFileProgress.publish({progress: (received / total) * 100, hash})
					if(received >= total) {
						delete this.#fileProgress[hash]
						if(type.startsWith("video")) {
							const ffmpeg = omnislate.context.helpers.ffmpeg
							await ffmpeg.isLoading
							await ffmpeg.write_composed_data(this.binary_accumulators[hash].binary, `${hash}compressed`)
							await ffmpeg.ffmpeg.exec([
								"-i", `${hash}compressed`,
								"-map", "0:v:0","-c:v" ,"copy", "-y", `${hash}.mp4`
							])
							const muxed_file = await ffmpeg.get_muxed_file(`${hash}.mp4`)
							const file = new File([muxed_file], name, {type})
							this.receivedFiles.push({hash, proxy, receivedFrom: connection})
							onComplete(hash, file, proxy)
							delete this.binary_accumulators[hash]
							delete this.#fileMetadata[hash]
						}
					}
				} else {
					const total = this.#fileProgress[hash].total
					this.#fileProgress[hash].received = this.binary_accumulators[hash].size
					const received = this.#fileProgress[hash].received
					onProgress(hash, this.binary_accumulators[hash].size, total)
					this.collaboration.onFileProgress.publish({progress: (this.binary_accumulators[hash].size / total) * 100, hash})
					if(received >= total) {
						const file = new File([this.binary_accumulators[hash].binary], name, {type})
						this.receivedFiles.push({hash, proxy, receivedFrom: connection})
						onComplete(hash, file, proxy)
						delete this.binary_accumulators[hash]
						delete this.#fileMetadata[hash]
						delete this.#fileProgress[hash]
					}
				}
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

	sendFileMetadata(dataChannel: RTCDataChannel, hash: string, file: File, proxy: boolean, total?: number) {
		const metadata: FileMetadata = {hash, size: file.size, name: file.name, type: file.type, total, proxy}
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

	markFileAsSynced(hash: string) {
		this.#syncedHashes.add(hash)
		this.#pendingSync.delete(hash)
	}

	getSizeInMB(uint8Array: Uint8Array) {
		const sizeInBytes = uint8Array.length // Each element is 1 byte
		const sizeInMB = sizeInBytes / (1024 * 1024) // Convert to MB
		return sizeInMB.toFixed(2) // Round to 2 decimal places
	}

	handleMissingFiles(missing: string[], connection: Connection) {
		missing.forEach(async hash => {
			const media = omnislate.context.controllers.media.get(hash)
			if (media) {
				if(media.kind === "video") {
					this.collaboration.opfs.sendFile(media.file, hash, media.frames, connection)
				} else {
					this.sendFile(media.file, media.hash, connection.cable.reliable, media.file.size)
				}
				this.#markFileAsPendingSync(media.hash)
			}
		})
	}

	broadcastMedia(media: AnyMedia, connection?: Connection, proxy?: boolean) {
		if(!this.collaboration.host && !this.collaboration.client)
			return

		if (this.#isFileAlreadySynced(media.hash) || this.#isFilePendingSync(media.hash)) {
			console.log(`File ${media.hash} is already synced or in the process of syncing.`)
			return
		}

		this.#markFileAsPendingSync(media.hash)
		
		if(media.kind === "video" && !proxy)
			this.compressor.compressVideo(media.file, {
				onChunk: (chunk) => {
					this.collaboration.opfs.writeChunk(media.hash, chunk)
				}
			})

		if (this.collaboration.host) {
			this.collaboration.connectedClients.forEach(client => {
				if (!connection || client !== connection) {
					if(media.kind === "video") {
						this.collaboration.opfs.sendFile(media.file, media.hash, media.frames, client)
					} else {
						this.sendFile(media.file, media.hash, client.cable.reliable, media.file.size)
					}
				}
			})
		} else if (this.collaboration.client) {
			if(media.kind === "video") {
				this.collaboration.opfs.sendFile(media.file, media.hash, media.frames, this.collaboration.client.connection)
			} else {
				this.sendFile(media.file, media.hash, this.collaboration.client.connection.cable.reliable, media.file.size)
			}
		}
	}

}
