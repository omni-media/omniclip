import {file} from "./opfs-manager.js"
import type {OPFSFileWrap} from "opfs-tools/dist/file"

interface WriteFileChunk {
	action: 'writeChunk'
	filePath: string
	chunk: Uint8Array
}

interface GetFileChunks {
	action: 'getFile'
	filePath: string
	frames: number
	hash: string
}

type Action = WriteFileChunk | GetFileChunks

interface ChunkMetadata {
	offset: number
	length: number
}

const writeQueues = new Map<string, Promise<void>>()

self.addEventListener("message", async (e) => {
	const data = e.data as Action
	if(data.action === "writeChunk") {
		const {filePath, chunk} = data
		try {
			await writeChunk(filePath, chunk)
		} catch(e) {
			console.log(e, "ERROR")
		}
	}

	else if(data.action === "getFile") {
		for (let chunkIndex = 0; chunkIndex <= data.frames; chunkIndex++) {
			const chunk = await readChunk(data.filePath, chunkIndex)
			self.postMessage({action: "fileChunk", chunk, hash: data.hash})
			if(chunkIndex === data.frames) {
				self.postMessage({action: "finished", hash: data.hash})
			}
		}
	}
})

const writers = new Map<string, any>()
const readers = new Map<string, any>()
const metaData = new Map<string, ChunkMetadata[]>()
const fileHandles = new Map<string, OPFSFileWrap>()

async function writeChunk(filePath: string, chunk: Uint8Array): Promise<void> {
	// Ensure only one write operation per filePath is active at a time
	const previousWrite = writeQueues.get(filePath) || Promise.resolve()
	const currentWrite = previousWrite.then(async () => {
		const fileHandle = fileHandles.get(filePath) ?? file(filePath, 'rw')
		const fileSize = await fileHandle.getSize()
		const length = chunk.byteLength

		fileHandles.set(filePath, fileHandle)

		if (!writers.get(filePath)) {
			const writer = await fileHandle.createWriter()
			writers.set(filePath, writer)
		}

		const writer = writers.get(filePath)
		await writer.write(chunk)
		await writer.flush()

		metaData.set(filePath, [...metaData.get(filePath) ?? [], { offset: fileSize, length }])
		// Note: Do not close the writer if it's reused
	})

	writeQueues.set(filePath, currentWrite)
	await currentWrite
}

async function readChunk(filePath: string, chunkIndex: number): Promise<Uint8Array> {
	const fileHandle = fileHandles.get(filePath) ?? file(filePath, 'rw')
	fileHandles.set(filePath, fileHandle)
	const metadata = metaData.get(filePath)

	if(metadata?.[chunkIndex]) {
		const {offset, length} = metadata[chunkIndex]

		if(!readers.get(filePath)) {
			const reader = await fileHandle.createReader()
			readers.set(filePath, reader)
		}

		const reader = readers.get(filePath)
		const chunk = await reader.read(length, {at: offset})
		const buffer = new Uint8Array(chunk)
		return buffer
	} else {
		return new Promise((resolve) => {
			const int = setInterval(async () => {
				const metadata = metaData.get(filePath)

				if(metadata?.[chunkIndex]) {
					const {offset, length} = metadata[chunkIndex]

					if(!readers.get(filePath)) {
						const reader = await fileHandle.createReader()
						readers.set(filePath, reader)
					}

					const reader = readers.get(filePath)
					const chunk = await reader.read(length, {at: offset})
					const buffer = new Uint8Array(chunk)
					clearInterval(int)
					resolve(buffer)
				}
			}, 10)
		})
	}
}
