import {Connection} from "sparrow-rtc"
import {FileHandler} from "./file-handler"
import type {file as File, dir as Dir, write as Write} from "opfs-tools"
//@ts-ignore
import * as opfs from 'https://cdn.jsdelivr.net/npm/opfs-tools@0.7.0/+esm'
const file = opfs.file as typeof File
const dir = opfs.dir as typeof Dir
const write = opfs.write as typeof Write

export {file, dir, write}

interface ChunkMetadata {
	offset: number
	length: number
}

export class OPFSManager {
	#worker = new Worker(new URL('./opfs-worker.js', import.meta.url), {type: "module"})

	constructor(private fileHandler: FileHandler) {
		this.#init()
	}

	async #init(): Promise<void> {
		// clear
		await dir('/compressed').remove()
		await dir('/compressed').create()
	}

	async createMetadataFile(videoFileName: string): Promise<void> {
		const metadataFileName = `${videoFileName}.metadata.json`
		await write(`/${metadataFileName}`, '[]')
	}

	async writeChunk(
		fileHash: string,
		chunk: Uint8Array
	): Promise<void> {
		this.#worker.postMessage({
			filePath: `/compressed/${fileHash}`,
			metadataPath: `/compressed/${fileHash}.metadata.json`,
			chunk,
			action: 'writeChunk'
		})
	}

	async readChunk(
		fileName: string,
		metadataFileName: string,
		chunkIndex: number
	): Promise<Uint8Array> {
		const metadata = await this.#readMetadata(metadataFileName)
		const {offset, length} = metadata[chunkIndex]
		const fileHandle = file(`/${fileName}`)
		const reader = await fileHandle.createReader()
		const arrayBuffer = await reader.read(length, {at: offset})
		await reader.close()
		return new Uint8Array(arrayBuffer)
	}

	async #readMetadata(metadataFileName: string): Promise<ChunkMetadata[]> {
		const metadataFile = file(`/${metadataFileName}`)
		const metadataText = await metadataFile.text()
		return JSON.parse(metadataText)
	}

	sendFile(originalFile: File, fileHash: string, frames: number, peer: Connection) {
		this.fileHandler.sendFileMetadata(peer.cable.reliable, fileHash, originalFile, true, frames)

		this.#worker.postMessage({
			filePath: `/compressed/${fileHash}`,
			metadataPath: `/compressed/${fileHash}.metadata.json`,
			action: 'getFile',
			frames,
			hash: fileHash
		})

		this.#worker.addEventListener("message", (e) => {
			if(e.data.action === "fileChunk") {
				const chunk = e.data.chunk as Uint8Array
				if(e.data.hash === fileHash)
					this.fileHandler.sendChunk(chunk, e.data.hash, peer.cable.reliable)
			}
			if(e.data.action === "finished") {
				if(e.data.hash === fileHash) {
					peer.cable.reliable.send(JSON.stringify({done: true, hash: fileHash, filename: originalFile.name, fileType: originalFile.type, proxy: true}))
					this.fileHandler.markFileAsSynced(fileHash)
				}
			}
		})
	}

	async writeMetadata(
		metadataFileName: string,
		metadata: ChunkMetadata[]
	): Promise<void> {
		const metadataFile = file(`/${metadataFileName}`)
		await write(metadataFile.path, JSON.stringify(metadata))
	}
}
