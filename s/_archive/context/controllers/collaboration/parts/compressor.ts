import {generate_id} from "@benev/slate/x/tools/generate_id.js"

import {State} from "../../../types.js"
import {omnislate} from "../../../context.js"
import {Collaboration} from "../controller.js"
import {demuxer} from "../../../../tools/demuxer.js"
import {VideoFile} from "../../../../components/omni-media/types.js"

interface CompressProps {
	quality?: number
	start?: number
	end?: number
	onChunk?:(uint: Uint8Array) => void
}

export class Compressor {
	#decoderWorkers = new Map<string, Worker>()
	#encoderWorkers = new Map<string, Worker>()
	#alreadyCompressingVideos = new Map<string, string>()
	#taskQueue: (() => void)[] = []
	#maxWorkers = 8

	constructor(private collaboration: Collaboration) {}

	compressVideo(file: File, props?: CompressProps) {
		const task = async () => {
			const metadata = await omnislate.context.controllers.media.getVideoFileMetadata(file)
			await this.#waitForAvailableWorker()
			const decoder = this.#createDecoderWorker()
			const encoder = this.#createEncoderWorker()

			decoder.worker.postMessage({
				action: "demux",
				props: {
					start: props?.start ?? 0,
					end: props?.end ?? metadata.duration,
					id: decoder.id
				},
				starting_timestamp: 0,
				timebase: metadata.fps ?? 30
			})

			demuxer(
				file,
				encoder.worker,
				(config) => decoder.worker.postMessage({action: "configure", config}),
				(chunk) => {
					decoder.worker.postMessage({action: "chunk", chunk})
				}
			)

			encoder.worker.addEventListener("message", (msg) => {
				if(msg.data.action === "chunk") {
					if(props?.onChunk)
						props.onChunk(msg.data.chunk)
				}
			})

			// compress in actual width and height of video
			encoder.worker.postMessage({
				action: "configure",
				width: metadata.width ?? 1920,
				height: metadata.height ?? 1080,
				bitrate: 5000,
				timebase: metadata.fps ?? 30,
				bitrateMode: "quantizer",
				getChunks: true
			})

			decoder.worker.addEventListener("message", (msg) => {
				if(msg.data.action === "new-frame") {
					const data = {...msg.data.frame}
					const frame = data.frame as VideoFrame
					encoder.worker.postMessage({frame, action: "encode"})
					frame.close()
				}
				if(msg.data.action === "end") {
					this.#freeWorker(decoder.id, "decoder")
					this.#freeWorker(encoder.id, "encoder")
				}
			})
		}
		this.#taskQueue.push(task)
		this.#processNextTask()
	}


	#createDecoderWorker() {
		const id = generate_id()
		const worker = new Worker(new URL("../../video-export/parts/decode_worker.js", import.meta.url), {type: "module"})
		this.#decoderWorkers.set(id, worker)
		return {worker, id}
	}

	#createEncoderWorker() {
		const id = generate_id()
		const worker = new Worker(new URL("../../video-export/parts/encode_worker.js", import.meta.url), {type: "module"})
		this.#encoderWorkers.set(id, worker)
		return {worker, id}
	}

	async #waitForAvailableWorker() {
		while (this.#decoderWorkers.size + this.#encoderWorkers.size >= this.#maxWorkers) {
			console.log("Waiting for a free worker...")
			await new Promise(resolve => setTimeout(resolve, 100))
		}
	}

	#freeWorker(id: string, type: "decoder" | "encoder") {
		if (type === 'decoder') {
			this.#decoderWorkers.get(id)?.terminate()
			this.#decoderWorkers.delete(id)
		} else if (type === 'encoder') {
			this.#encoderWorkers.get(id)?.terminate()
			this.#encoderWorkers.delete(id)
		}
		this.#processNextTask()
	}

	#processNextTask() {
		if (this.#taskQueue.length > 0) {
			const nextTask = this.#taskQueue.shift()
			if(nextTask)
				nextTask()
		}
	}

	async compressAllVideos(state: State) {
		for(const effect of state.effects) {
			if(effect.kind === "video") {
				const media = omnislate.context.controllers.media.get(effect.file_hash) as VideoFile
				const alreadyCompressing = this.#alreadyCompressingVideos.get(media.hash)
				if(media && !alreadyCompressing) {
					this.#alreadyCompressingVideos.set(media.hash, media.hash)
					this.compressVideo(media.file, {
						onChunk: (chunk) => {
							this.collaboration.opfs.writeChunk(media.hash, chunk)
						}
					})
				}
			}
		}
	}
}
