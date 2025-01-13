import {Connection} from "sparrow-rtc"

import {State} from "../../../types.js"
import {Compressor} from "./compressor.js"
import {omnislate} from "../../../context.js"
import {Collaboration} from "../controller.js"
import {AnyMedia} from "../../../../components/omni-media/types.js"
import {BinaryAccumulator} from "../../video-export/tools/BinaryAccumulator/tool.js"

interface FileMetadata {
	hash: string
	fileName: string
	fileType: string
	fileSize: number
}

export class FileHandler {
	#fileSizes: {[hash: string]: number} = {}

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

	sendChunk(compressedChunk: Uint8Array, hash: string, dataChannel: RTCDataChannel) {
		this.#sendChunkWithHash(dataChannel, compressedChunk, hash)
	}

	sendFile(file: File, hash: string, dataChannel: RTCDataChannel) {
		this.sendFileMetadata(dataChannel, hash, file)
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
					this.markFileAsSynced(hash)
				}
			}
			reader.readAsArrayBuffer(slice)
		}

		readNextChunk()
	}

	async onFileChunk(
		event: MessageEvent<any>,
		hashLength: number,
		onComplete: (hash: string, file: File) => void,
		onProgress?: (hash: string, receivedBytes: number, totalBytes: number) => void
	) {
		if (typeof event.data === "string") {
			const message = JSON.parse(event.data)
			if (message.done) {
				const hash = message.hash
				if (this.binary_accumulators[hash]) {
					if(message.fileType.startsWith("video")) {
						const ffmpeg = omnislate.context.helpers.ffmpeg
						await ffmpeg.isLoading
						await ffmpeg.write_composed_data(this.binary_accumulators[hash].binary, `${hash}compressed`)
						await ffmpeg.ffmpeg.exec([
							"-i", `${hash}compressed`,
							"-map", "0:v:0","-c:v" ,"copy", "-y", `${hash}.mp4`
						])
						const muxed_file = await ffmpeg.get_muxed_file(`${hash}.mp4`)
						const file = new File([muxed_file], message.filename, {type: message.fileType})
						onComplete(hash, file)
					} else {
						const file = new File([this.binary_accumulators[hash].binary], message.filename, {type: message.fileType})
						onComplete(hash, file)
					}
					delete this.binary_accumulators[hash]
					delete this.#fileSizes[hash]
				}
			} else if (message.hash && message.size) {
				this.#fileSizes[message.hash] = message.size // Save the total size
			}
		} else {
			const {hash, chunk} = this.#receiveChunkWithHash(event, hashLength)

			if (!this.binary_accumulators[hash]) {
				this.binary_accumulators[hash] = new BinaryAccumulator()
			}

			this.binary_accumulators[hash].add_chunk(chunk)
			// Update progress
			if (onProgress && this.#fileSizes[hash]) {
				//@ts-ignore
				// const receivedBytes = this.files[hash].reduce((sum, part) => sum + part.byteLength, 0)
				// onProgress(hash, receivedBytes, this.#fileSizes[hash])
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

	sendFileMetadata(dataChannel: RTCDataChannel, hash: string, file: File) {
		const metadata = {hash, size: file.size, filename: file.name, mimeType: file.type}
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
					this.sendFile(media.file, media.hash, connection.cable.reliable)
				}
				this.#markFileAsPendingSync(media.hash)
			}
		})
	}

	broadcastMedia(media: AnyMedia, connection?: Connection) {
		if(!this.collaboration.host && !this.collaboration.client)
			return

		if (this.#isFileAlreadySynced(media.hash) || this.#isFilePendingSync(media.hash)) {
			console.log(`File ${media.hash} is already synced or in the process of syncing.`)
			return
		}

		this.#markFileAsPendingSync(media.hash)
		
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
						this.sendFile(media.file, media.hash, client.cable.reliable)
					}
				}
			})
		} else if (this.collaboration.client) {
			if(media.kind === "video") {
				this.collaboration.opfs.sendFile(media.file, media.hash, media.frames, this.collaboration.client.connection)
			} else {
				this.sendFile(media.file, media.hash, this.collaboration.client.connection.cable.reliable)
			}
		}
	}

}
